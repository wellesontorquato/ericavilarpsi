const admin = require("firebase-admin");

const RESOURCE_COLLECTIONS = {
  clinicas: "supervisao_clinicas",
  terapeutas: "supervisao_terapeutas",
  pacientes: "supervisao_pacientes",
  lancamentos: "supervisao_lancamentos_semanais",
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body: JSON.stringify(body),
  };
}

function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/^"|"$/g, "").replace(/\\n/g, "\n");
}

function getAdminDb() {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin não configurado. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY na Netlify."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    });
  }

  return admin.firestore();
}

function getRoles(user) {
  return user?.app_metadata?.roles || user?.app_metadata?.authorization?.roles || [];
}

function assertAuthenticated(context) {
  if (process.env.SUPERVISAO_DEV_NO_AUTH === "true") {
    return { email: "dev-local@supervisao.local", app_metadata: { roles: ["admin"] } };
  }

  const user = context?.clientContext?.user;

  if (!user) {
    const error = new Error("Acesso negado. Faça login no Netlify Identity para continuar.");
    error.statusCode = 401;
    throw error;
  }

  const allowedRoles = (process.env.SUPERVISAO_ALLOWED_ROLES || "")
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  if (allowedRoles.length) {
    const roles = getRoles(user);
    const hasRole = roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      const error = new Error("Usuário autenticado, mas sem permissão para acessar a supervisão clínica.");
      error.statusCode = 403;
      throw error;
    }
  }

  return user;
}

function parseBody(event) {
  if (!event.body) return {};
  try {
    return JSON.parse(event.body);
  } catch (error) {
    const invalid = new Error("Corpo da requisição inválido.");
    invalid.statusCode = 400;
    throw invalid;
  }
}

function serializeValue(value) {
  if (!value) return value;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (Array.isArray(value)) return value.map(serializeValue);
  if (typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serializeValue(item)]));
  }
  return value;
}

function serializeDoc(doc) {
  return {
    id: doc.id,
    ...serializeValue(doc.data()),
  };
}

function isArchived(item) {
  return item?.arquivado === true || String(item?.statusRegistro || "").toLowerCase() === "arquivado";
}

async function listCollection(db, collectionName) {
  const snapshot = await db.collection(collectionName).get();
  return snapshot.docs
    .map(serializeDoc)
    .sort((a, b) => String(b.criadoEm || b.atualizadoEm || "").localeCompare(String(a.criadoEm || a.atualizadoEm || "")));
}

function average(values) {
  const validValues = values.map(Number).filter((value) => Number.isFinite(value) && value > 0);
  if (!validValues.length) return 0;
  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length;
}

function calcCompetencias(lancamento) {
  return average([
    lancamento.qualidadeConceitualizacao,
    lancamento.planejamentoTerapeutico,
    lancamento.aplicacaoTecnicasTcc,
    lancamento.manejoSessao,
    lancamento.posturaTerapeutica,
    lancamento.formulacaoHipoteses,
  ]);
}

function calcEvolucao(lancamento) {
  return average([
    lancamento.qualidadeSono,
    lancamento.adesaoTarefas,
    lancamento.evolucaoObjetivos,
    lancamento.intensidadeSintomas ? 10 - Number(lancamento.intensidadeSintomas) : 0,
    lancamento.evitacaoSocial ? 10 - Number(lancamento.evitacaoSocial) : 0,
  ]);
}

async function dashboard(db) {
  const [todasClinicas, todosTerapeutas, todosPacientes, todosLancamentos] = await Promise.all([
    listCollection(db, RESOURCE_COLLECTIONS.clinicas),
    listCollection(db, RESOURCE_COLLECTIONS.terapeutas),
    listCollection(db, RESOURCE_COLLECTIONS.pacientes),
    listCollection(db, RESOURCE_COLLECTIONS.lancamentos),
  ]);

  const clinicas = todasClinicas.filter((item) => !isArchived(item));
  const terapeutas = todosTerapeutas.filter((item) => !isArchived(item));
  const pacientes = todosPacientes.filter((item) => !isArchived(item));
  const lancamentos = todosLancamentos.filter((item) => !isArchived(item));

  const mediaCompetencias = average(lancamentos.map(calcCompetencias));
  const mediaEvolucao = average(lancamentos.map(calcEvolucao));
  const planosAbertos = lancamentos.filter((item) => {
    const status = String(item.statusPlano || "").toLowerCase();
    return status && !["concluído", "concluido", "finalizado"].includes(status);
  }).length;

  const casosAtencao = pacientes.filter((item) => {
    const nivel = String(item.nivelAtencao || "").toLowerCase();
    return nivel.includes("alta") || nivel.includes("urgente") || nivel.includes("atenção");
  }).length;

  return {
    metricas: {
      totalClinicas: clinicas.length,
      totalTerapeutas: terapeutas.length,
      totalPacientes: pacientes.length,
      totalLancamentos: lancamentos.length,
      mediaCompetencias,
      mediaEvolucao,
      casosAtencao,
      planosAbertos,
    },
    clinicas,
    terapeutas,
    pacientes,
    lancamentos,
  };
}

exports.handler = async function handler(event, context) {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  try {
    const user = assertAuthenticated(context);
    const db = getAdminDb();
    const resource = event.queryStringParameters?.resource;
    const id = event.queryStringParameters?.id;

    if (resource === "dashboard") {
      if (event.httpMethod !== "GET") return json(405, { message: "Método não permitido." });
      return json(200, await dashboard(db));
    }

    const collectionName = RESOURCE_COLLECTIONS[resource];

    if (!collectionName) {
      return json(400, { message: "Recurso inválido." });
    }

    const collectionRef = db.collection(collectionName);

    if (event.httpMethod === "GET") {
      const items = await listCollection(db, collectionName);
      return json(200, { items });
    }

    if (event.httpMethod === "POST") {
      const body = parseBody(event);
      const now = admin.firestore.FieldValue.serverTimestamp();
      const data = {
        ...body,
        arquivado: body.arquivado === true,
        statusRegistro: body.statusRegistro || "Ativo",
        criadoEm: now,
        atualizadoEm: now,
        criadoPor: user.email || user.sub || "usuario-netlify",
      };
      const docRef = await collectionRef.add(data);
      const saved = await docRef.get();
      return json(201, { item: serializeDoc(saved) });
    }

    if (event.httpMethod === "PUT") {
      if (!id) return json(400, { message: "ID obrigatório para atualização." });
      const body = parseBody(event);
      const docRef = collectionRef.doc(id);
      await docRef.set(
        {
          ...body,
          atualizadoEm: admin.firestore.FieldValue.serverTimestamp(),
          atualizadoPor: user.email || user.sub || "usuario-netlify",
        },
        { merge: true }
      );
      const updated = await docRef.get();
      return json(200, { item: serializeDoc(updated) });
    }

    if (event.httpMethod === "DELETE") {
      if (!id) return json(400, { message: "ID obrigatório para exclusão." });
      await collectionRef.doc(id).delete();
      return json(200, { ok: true });
    }

    return json(405, { message: "Método não permitido." });
  } catch (error) {
    console.error(error);
    return json(error.statusCode || 500, {
      message: error.message || "Erro interno na API de supervisão.",
    });
  }
};
