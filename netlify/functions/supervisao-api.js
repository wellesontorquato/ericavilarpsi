const admin = require("firebase-admin");

const RESOURCE_COLLECTIONS = {
  supervisores: "supervisao_supervisores",
  clinicas: "supervisao_clinicas",
  terapeutas: "supervisao_terapeutas",
  pacientes: "supervisao_pacientes",
  lancamentos: "supervisao_lancamentos_semanais",
  auditoria: "supervisao_auditoria",
};

const AUDIT_COLLECTION = RESOURCE_COLLECTIONS.auditoria;
const ADMIN_ONLY_RESOURCES = new Set(["supervisores", "auditoria"]);

const COMPETENCY_FIELDS = [
  "qualidadeConceitualizacao",
  "planejamentoTerapeutico",
  "aplicacaoTecnicasTcc",
  "manejoSessao",
  "posturaTerapeutica",
  "formulacaoHipoteses",
];

const PATIENT_INDICATOR_FIELDS = [
  "crisesAnsiedade",
  "qualidadeSono",
  "evitacaoSocial",
  "adesaoTarefas",
  "intensidadeSintomas",
  "intensidadeComportamento",
  "aplicacaoEstrategias",
  "evolucaoObjetivos",
];

const FIELD_RULES = {
  supervisores: {
    nome: { type: "string", max: 160 },
    email: { type: "email", max: 254 },
    status: { type: "enum", values: ["Ativo", "Inativo"] },
    observacao: { type: "string", max: 2000 },
    arquivado: { type: "boolean" },
    statusRegistro: { type: "enum", values: ["Ativo", "Arquivado"] },
  },

  clinicas: {
    nome: { type: "string", max: 160 },
    cidade: { type: "string", max: 160 },
    responsavel: { type: "string", max: 160 },
    status: { type: "enum", values: ["Ativa", "Inativa"] },
    supervisorIds: { type: "ids", maxItems: 30 },
    arquivado: { type: "boolean" },
    statusRegistro: { type: "enum", values: ["Ativo", "Arquivado"] },
  },

  terapeutas: {
    nome: { type: "string", max: 160 },
    clinicaId: { type: "id" },
    supervisorIds: { type: "ids", maxItems: 30 },
    dataEntrada: { type: "date" },
    status: { type: "enum", values: ["Ativo", "Inativo"] },
    observacao: { type: "string", max: 3000 },
    arquivado: { type: "boolean" },
    statusRegistro: { type: "enum", values: ["Ativo", "Arquivado"] },
  },

  pacientes: {
    nome: { type: "string", max: 160 },
    clinicaId: { type: "id" },
    terapeutaId: { type: "id" },
    supervisorIds: { type: "ids", maxItems: 30 },
    dataInicio: { type: "date" },
    statusCaso: {
      type: "enum",
      values: ["Em acompanhamento", "Alta", "Pausado", "Encerrado"],
    },
    nivelAtencao: {
      type: "enum",
      values: ["Baixa", "MÃ©dia", "Alta"],
    },
    statusConceitualizacao: {
      type: "enum",
      values: ["Rascunho", "ConcluÃ­da"],
    },
    queixaPrincipal: { type: "string", max: 5000 },
    pensamentosAutomaticos: { type: "string", max: 5000 },
    emocoes: { type: "string", max: 5000 },
    comportamentosManutencao: { type: "string", max: 5000 },
    crencas: { type: "string", max: 5000 },
    fatoresManutencao: { type: "string", max: 5000 },
    objetivosTerapeuticos: { type: "string", max: 5000 },
    observacoes: { type: "string", max: 5000 },
    arquivado: { type: "boolean" },
    statusRegistro: { type: "enum", values: ["Ativo", "Arquivado"] },
  },

  lancamentos: {
    ano: {
      type: "number",
      min: 2000,
      max: 2100,
      integer: true,
    },
    mes: {
      type: "number",
      min: 1,
      max: 12,
      integer: true,
    },
    semana: {
      type: "number",
      min: 1,
      max: 5,
      integer: true,
    },

    clinicaId: { type: "id" },
    terapeutaId: { type: "id" },
    pacienteId: { type: "id" },
    supervisorId: { type: "id" },
    supervisorIds: { type: "ids", maxItems: 30 },

    clinicaNome: { type: "string", max: 160 },
    terapeutaNome: { type: "string", max: 160 },
    pacienteNome: { type: "string", max: 160 },
    supervisorNome: { type: "string", max: 160 },
    supervisorEmail: { type: "email", max: 254 },

    qualidadeConceitualizacao: {
      type: "number",
      min: 1,
      max: 5,
      nullable: true,
    },
    planejamentoTerapeutico: {
      type: "number",
      min: 1,
      max: 5,
      nullable: true,
    },
    aplicacaoTecnicasTcc: {
      type: "number",
      min: 1,
      max: 5,
      nullable: true,
    },
    manejoSessao: {
      type: "number",
      min: 1,
      max: 5,
      nullable: true,
    },
    posturaTerapeutica: {
      type: "number",
      min: 1,
      max: 5,
      nullable: true,
    },
    formulacaoHipoteses: {
      type: "number",
      min: 1,
      max: 5,
      nullable: true,
    },

    crisesAnsiedade: {
      type: "number",
      min: 0,
      max: 99,
      nullable: true,
    },
    qualidadeSono: {
      type: "number",
      min: 0,
      max: 10,
      nullable: true,
    },
    evitacaoSocial: {
      type: "number",
      min: 0,
      max: 10,
      nullable: true,
    },
    adesaoTarefas: {
      type: "number",
      min: 0,
      max: 100,
      nullable: true,
    },
    intensidadeSintomas: {
      type: "number",
      min: 0,
      max: 10,
      nullable: true,
    },
    intensidadeComportamento: {
      type: "number",
      min: 0,
      max: 10,
      nullable: true,
    },
    aplicacaoEstrategias: {
      type: "number",
      min: 0,
      max: 100,
      nullable: true,
    },
    evolucaoObjetivos: {
      type: "number",
      min: 0,
      max: 100,
      nullable: true,
    },

    emocaoElaborada: { type: "string", max: 3000 },
    pontoForte: { type: "string", max: 3000 },
    pontoDesenvolver: { type: "string", max: 3000 },
    recomendacao: { type: "string", max: 5000 },
    planoAcao: { type: "string", max: 5000 },
    prazo: { type: "date" },
    statusPlano: {
      type: "enum",
      values: ["Pendente", "Em andamento", "ConcluÃ­do"],
    },
    observacao: { type: "string", max: 5000 },
    arquivado: { type: "boolean" },
    statusRegistro: { type: "enum", values: ["Ativo", "Arquivado"] },
  },
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
    body: JSON.stringify(body),
  };
}

function httpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function formatPrivateKey(key) {
  if (!key) return undefined;

  return key
    .replace(/^"|"$/g, "")
    .replace(/\\n/g, "\n");
}

function getAdminDb() {
  if (!admin.apps.length) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = formatPrivateKey(
      process.env.FIREBASE_PRIVATE_KEY
    );

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        "Firebase Admin nÃ£o configurado. Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY na Netlify."
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  return admin.firestore();
}

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function getRoles(user) {
  const roles =
    user?.app_metadata?.roles ||
    user?.app_metadata?.authorization?.roles ||
    [];

  return Array.isArray(roles)
    ? roles.map((role) => String(role).trim().toLowerCase())
    : [];
}

function envList(name, fallback = "") {
  return String(process.env[name] || fallback)
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getIdentityUser(context) {
  if (process.env.SUPERVISAO_DEV_NO_AUTH === "true") {
    if (
      String(process.env.CONTEXT || "").toLowerCase() === "production"
    ) {
      throw httpError(
        500,
        "SUPERVISAO_DEV_NO_AUTH nÃ£o pode ser usado em produÃ§Ã£o."
      );
    }

    return {
      sub: "dev-local-admin",
      email: "dev-local@supervisao.local",
      app_metadata: {
        roles: ["admin"],
      },
    };
  }

  const user = context?.clientContext?.user;

  if (!user) {
    throw httpError(
      401,
      "Acesso negado. FaÃ§a login para continuar."
    );
  }

  return user;
}

function isArchived(item) {
  return (
    item?.arquivado === true ||
    String(item?.statusRegistro || "").toLowerCase() === "arquivado"
  );
}

function isInactiveSupervisor(item) {
  return (
    isArchived(item) ||
    String(item?.status || "").toLowerCase() === "inativo"
  );
}

function serializeValue(value) {
  if (!value) return value;

  if (typeof value.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        serializeValue(item),
      ])
    );
  }

  return value;
}

function serializeDoc(doc) {
  return {
    id: doc.id,
    ...serializeValue(doc.data()),
  };
}

async function resolvePrincipal(db, user) {
  const roles = getRoles(user);
  const adminRoles = envList(
    "SUPERVISAO_ADMIN_ROLES",
    "admin,administrador"
  );
  const adminEmails = envList("SUPERVISAO_ADMIN_EMAILS");
  const email = normalizeEmail(user?.email);
  const userId = String(user?.sub || "").trim();

  const isAdmin =
    roles.some((role) => adminRoles.includes(role)) ||
    adminEmails.includes(email);

  if (isAdmin) {
    return {
      role: "admin",
      userId,
      email,
      supervisorId: null,
      nome: user?.email || "Administrador",
    };
  }

  const supervisorsRef = db.collection(
    RESOURCE_COLLECTIONS.supervisores
  );

  let profileDoc = null;

  if (userId) {
    const byIdentity = await supervisorsRef
      .where("identityUserId", "==", userId)
      .limit(1)
      .get();

    profileDoc = byIdentity.docs[0] || null;
  }

  if (!profileDoc && email) {
    const byEmail = await supervisorsRef
      .where("emailNormalizado", "==", email)
      .limit(1)
      .get();

    profileDoc = byEmail.docs[0] || null;
  }

  if (!profileDoc) {
    throw httpError(
      403,
      "UsuÃ¡rio autenticado, mas sem cadastro ativo como administrador ou supervisor."
    );
  }

  const profile = profileDoc.data();

  if (isInactiveSupervisor(profile)) {
    throw httpError(
      403,
      "Seu acesso de supervisor estÃ¡ inativo ou arquivado."
    );
  }

  if (
    profile.identityUserId &&
    userId &&
    profile.identityUserId !== userId
  ) {
    throw httpError(
      403,
      "A conta autenticada nÃ£o corresponde ao cadastro deste supervisor."
    );
  }

  const requireIdentityRole =
    process.env.SUPERVISAO_REQUIRE_SUPERVISOR_ROLE === "true";

  const supervisorRoles = envList(
    "SUPERVISAO_SUPERVISOR_ROLES",
    "supervisor"
  );

  if (
    requireIdentityRole &&
    !roles.some((role) => supervisorRoles.includes(role))
  ) {
    throw httpError(
      403,
      "A conta nÃ£o possui a funÃ§Ã£o de supervisor no provedor de identidade."
    );
  }

  if (!profile.identityUserId && userId) {
    await profileDoc.ref.update({
      identityUserId: userId,
      vinculadoEm:
        admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  return {
    role: "supervisor",
    userId,
    email,
    supervisorId: profileDoc.id,
    nome: profile.nome || user.email || "Supervisor",
  };
}

function publicAccess(principal) {
  return {
    role: principal.role,
    supervisorId: principal.supervisorId,
    nome: principal.nome,
    email: principal.email,
    isAdmin: principal.role === "admin",
  };
}

function parseBody(event) {
  if (!event.body) return {};

  if (Buffer.byteLength(event.body, "utf8") > 128 * 1024) {
    throw httpError(
      413,
      "O conteÃºdo enviado excede o limite permitido."
    );
  }

  try {
    const parsed = JSON.parse(event.body);

    if (
      !parsed ||
      Array.isArray(parsed) ||
      typeof parsed !== "object"
    ) {
      throw new Error("invalid");
    }

    return parsed;
  } catch (error) {
    throw httpError(
      400,
      "Corpo da requisiÃ§Ã£o invÃ¡lido."
    );
  }
}

function sanitizeString(value, max, fieldName) {
  if (value === undefined || value === null) {
    return "";
  }

  const text = String(value).trim();

  if (text.length > max) {
    throw httpError(
      400,
      `O campo ${fieldName} excede ${max} caracteres.`
    );
  }

  return text;
}

function sanitizeField(value, rule, fieldName) {
  if (rule.type === "string") {
    return sanitizeString(value, rule.max, fieldName);
  }

  if (rule.type === "email") {
    const email = normalizeEmail(value);

    if (
      !email ||
      email.length > rule.max ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      throw httpError(
        400,
        `Informe um e-mail vÃ¡lido em ${fieldName}.`
      );
    }

    return email;
  }

  if (rule.type === "enum") {
    const text = String(value || "").trim();

    if (!rule.values.includes(text)) {
      throw httpError(
        400,
        `Valor invÃ¡lido para ${fieldName}.`
      );
    }

    return text;
  }

  if (rule.type === "boolean") {
    return value === true;
  }

  if (rule.type === "id") {
    const id = String(value || "").trim();

    if (
      !id ||
      id.length > 180 ||
      id.includes("/")
    ) {
      throw httpError(
        400,
        `Identificador invÃ¡lido em ${fieldName}.`
      );
    }

    return id;
  }

  if (rule.type === "ids") {
    if (!Array.isArray(value)) {
      throw httpError(
        400,
        `O campo ${fieldName} deve ser uma lista.`
      );
    }

    const ids = [
      ...new Set(
        value
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      ),
    ];

    if (
      ids.length > rule.maxItems ||
      ids.some(
        (id) => id.length > 180 || id.includes("/")
      )
    ) {
      throw httpError(
        400,
        `Lista invÃ¡lida em ${fieldName}.`
      );
    }

    return ids;
  }

  if (rule.type === "date") {
    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return "";
    }

    const text = String(value).trim();

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(text) ||
      Number.isNaN(
        new Date(`${text}T00:00:00Z`).getTime()
      )
    ) {
      throw httpError(
        400,
        `Data invÃ¡lida em ${fieldName}.`
      );
    }

    return text;
  }

  if (rule.type === "number") {
    if (
      (value === undefined ||
        value === null ||
        value === "") &&
      rule.nullable
    ) {
      return null;
    }

    const number = Number(value);

    if (
      !Number.isFinite(number) ||
      (rule.integer && !Number.isInteger(number))
    ) {
      throw httpError(
        400,
        `Informe um nÃºmero vÃ¡lido em ${fieldName}.`
      );
    }

    if (
      number < rule.min ||
      number > rule.max
    ) {
      throw httpError(
        400,
        `${fieldName} deve ficar entre ${rule.min} e ${rule.max}.`
      );
    }

    return number;
  }

  throw httpError(
    400,
    `Campo nÃ£o suportado: ${fieldName}.`
  );
}

function sanitizeRecord(resource, body) {
  const rules = FIELD_RULES[resource];

  if (!rules) {
    throw httpError(
      400,
      "Recurso invÃ¡lido."
    );
  }

  const unknownFields = Object.keys(body).filter(
    (field) => !rules[field]
  );

  if (unknownFields.length) {
    throw httpError(
      400,
      `Campo(s) nÃ£o permitido(s): ${unknownFields.join(", ")}.`
    );
  }

  return Object.fromEntries(
    Object.entries(body).map(([field, value]) => [
      field,
      sanitizeField(
        value,
        rules[field],
        field
      ),
    ])
  );
}

function requireFields(data, fields, message) {
  const missing = fields.filter((field) => {
    const value = data[field];

    return (
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && !value.length)
    );
  });

  if (missing.length) {
    throw httpError(
      400,
      `${message}: ${missing.join(", ")}.`
    );
  }
}

function hasComputedField(data, fields) {
  return fields.some((field) => {
    const value = data[field];

    return (
      value !== undefined &&
      value !== null &&
      value !== ""
    );
  });
}

function validateRecord(resource, data) {
  if (isArchived(data)) return;

  if (resource === "supervisores") {
    requireFields(
      data,
      ["nome", "email"],
      "Preencha os campos obrigatÃ³rios"
    );
  }

  if (resource === "clinicas") {
    requireFields(
      data,
      ["nome", "supervisorIds"],
      "Preencha os campos obrigatÃ³rios"
    );
  }

  if (resource === "terapeutas") {
    requireFields(
      data,
      [
        "nome",
        "clinicaId",
        "supervisorIds",
      ],
      "Preencha os campos obrigatÃ³rios"
    );
  }

  if (resource === "pacientes") {
    requireFields(
      data,
      [
        "nome",
        "clinicaId",
        "terapeutaId",
        "supervisorIds",
      ],
      "Preencha os campos obrigatÃ³rios"
    );

    if (
      data.statusConceitualizacao === "ConcluÃ­da"
    ) {
      requireFields(
        data,
        [
          "queixaPrincipal",
          "pensamentosAutomaticos",
          "emocoes",
          "comportamentosManutencao",
          "crencas",
          "fatoresManutencao",
          "objetivosTerapeuticos",
        ],
        "Para concluir a prÃ©-supervisÃ£o, preencha"
      );
    }
  }

  if (resource === "lancamentos") {
    requireFields(
      data,
      [
        "ano",
        "mes",
        "semana",
        "clinicaId",
        "terapeutaId",
        "pacienteId",
        "supervisorId",
        "supervisorIds",
      ],
      "Preencha os campos obrigatÃ³rios do lanÃ§amento"
    );

    const hasCompetency = hasComputedField(
      data,
      COMPETENCY_FIELDS
    );

    if (!hasCompetency) {
      throw httpError(
        400,
        "Informe pelo menos uma competÃªncia clÃ­nica para calcular a mÃ©dia."
      );
    }

    const hasPatientIndicator =
      hasComputedField(
        data,
        PATIENT_INDICATOR_FIELDS
      );

    if (!hasPatientIndicator) {
      throw httpError(
        400,
        "Informe pelo menos um indicador de evoluÃ§Ã£o do paciente."
      );
    }
  }
}

function recordSupervisorIds(item) {
  return Array.isArray(item?.supervisorIds)
    ? item.supervisorIds.map(String)
    : [];
}

function canAccessRecord(principal, item) {
  return (
    principal.role === "admin" ||
    recordSupervisorIds(item).includes(
      String(principal.supervisorId)
    )
  );
}

function assertRecordAccess(principal, item) {
  if (!canAccessRecord(principal, item)) {
    throw httpError(
      403,
      "VocÃª nÃ£o possui permissÃ£o para acessar este registro."
    );
  }
}

async function assertResourceAccess(
  db,
  resource,
  principal,
  item
) {
  if (canAccessRecord(principal, item)) {
    return;
  }

  const isLegacyLaunch =
    resource === "lancamentos" &&
    recordSupervisorIds(item).length === 0 &&
    item?.pacienteId;

  if (isLegacyLaunch) {
    const patient = await getDocument(
      db,
      "pacientes",
      item.pacienteId
    );

    assertRecordAccess(
      principal,
      patient.data
    );

    return;
  }

  assertRecordAccess(
    principal,
    item
  );
}

function assertAdmin(principal) {
  if (principal.role !== "admin") {
    throw httpError(
      403,
      "Esta operaÃ§Ã£o Ã© exclusiva do administrador geral."
    );
  }
}

async function getDocument(db, resource, id) {
  const doc = await db
    .collection(RESOURCE_COLLECTIONS[resource])
    .doc(id)
    .get();

  if (!doc.exists) {
    throw httpError(
      404,
      "Registro nÃ£o encontrado."
    );
  }

  return {
    ref: doc.ref,
    data: serializeDoc(doc),
    raw: doc.data(),
  };
}

async function listCollection(
  db,
  resource,
  principal
) {
  if (ADMIN_ONLY_RESOURCES.has(resource)) {
    assertAdmin(principal);
  }

  const collection = db.collection(
    RESOURCE_COLLECTIONS[resource]
  );

  let documents;

  if (principal.role === "admin") {
    const snapshot =
      await collection.get();

    documents = snapshot.docs;
  } else if (resource === "lancamentos") {
    const [assignedSnapshot, patientsSnapshot] =
      await Promise.all([
        collection
          .where(
            "supervisorIds",
            "array-contains",
            principal.supervisorId
          )
          .get(),
        db
          .collection(
            RESOURCE_COLLECTIONS.pacientes
          )
          .where(
            "supervisorIds",
            "array-contains",
            principal.supervisorId
          )
          .get(),
      ]);

    const patientIds =
      patientsSnapshot.docs.map(
        (doc) => doc.id
      );

    const patientChunks = [];

    for (
      let index = 0;
      index < patientIds.length;
      index += 10
    ) {
      patientChunks.push(
        patientIds.slice(
          index,
          index + 10
        )
      );
    }

    const legacySnapshots =
      await Promise.all(
        patientChunks.map((ids) =>
          collection
            .where(
              "pacienteId",
              "in",
              ids
            )
            .get()
        )
      );

    const documentsById =
      new Map(
        assignedSnapshot.docs.map(
          (doc) => [doc.id, doc]
        )
      );

    legacySnapshots.forEach(
      (snapshot) => {
        snapshot.docs.forEach(
          (doc) => {
            if (
              recordSupervisorIds(
                doc.data()
              ).length === 0
            ) {
              documentsById.set(
                doc.id,
                doc
              );
            }
          }
        );
      }
    );

    documents = [
      ...documentsById.values(),
    ];
  } else {
    const snapshot = await collection
      .where(
        "supervisorIds",
        "array-contains",
        principal.supervisorId
      )
      .get();

    documents = snapshot.docs;
  }

  return documents
    .map(serializeDoc)
    .sort((a, b) =>
      String(
        b.criadoEm ||
          b.atualizadoEm ||
          ""
      ).localeCompare(
        String(
          a.criadoEm ||
            a.atualizadoEm ||
            ""
        )
      )
    );
}

async function validateSupervisorIds(
  db,
  supervisorIds
) {
  if (!supervisorIds.length) {
    throw httpError(
      400,
      "Selecione pelo menos um supervisor responsÃ¡vel."
    );
  }

  const documents = await Promise.all(
    supervisorIds.map((id) =>
      db
        .collection(
          RESOURCE_COLLECTIONS.supervisores
        )
        .doc(id)
        .get()
    )
  );

  const invalid = documents.find(
    (doc) =>
      !doc.exists ||
      isInactiveSupervisor(doc.data())
  );

  if (invalid) {
    throw httpError(
      400,
      "Um dos supervisores selecionados nÃ£o existe ou estÃ¡ inativo."
    );
  }
}

function assertSubset(
  ids,
  allowedIds,
  message
) {
  const allowed = new Set(
    allowedIds.map(String)
  );

  if (
    ids.some(
      (id) =>
        !allowed.has(String(id))
    )
  ) {
    throw httpError(
      400,
      message
    );
  }
}

function resolveSupervisorIds(
  principal,
  requested,
  existing = []
) {
  if (principal.role === "admin") {
    return requested === undefined
      ? [...existing]
      : requested;
  }

  if (existing.length) {
    return [
      ...new Set(
        existing.map(String)
      ),
    ];
  }

  return [principal.supervisorId];
}

function resolveResponsibleSupervisorId(
  principal,
  requested,
  existing = ""
) {
  const existingId = String(
    existing || ""
  ).trim();

  if (principal.role === "admin") {
    return requested === undefined
      ? existingId
      : String(requested || "").trim();
  }

  if (existingId) {
    return existingId;
  }

  return String(
    principal.supervisorId || ""
  ).trim();
}

async function prepareRecord(
  db,
  resource,
  sanitized,
  principal,
  existing = null
) {
  const merged = {
    ...(existing || {}),
    ...sanitized,
  };

  if (resource === "supervisores") {
    assertAdmin(principal);

    merged.emailNormalizado =
      normalizeEmail(merged.email);

    const duplicate = await db
      .collection(
        RESOURCE_COLLECTIONS.supervisores
      )
      .where(
        "emailNormalizado",
        "==",
        merged.emailNormalizado
      )
      .limit(2)
      .get();

    const duplicateDoc =
      duplicate.docs.find(
        (doc) =>
          doc.id !== existing?.id
      );

    if (duplicateDoc) {
      throw httpError(
        409,
        "JÃ¡ existe um supervisor cadastrado com este e-mail."
      );
    }

    validateRecord(
      resource,
      merged
    );

    return merged;
  }

  const existingAssignments =
    recordSupervisorIds(existing);

  if (resource === "lancamentos") {
    merged.supervisorIds = [
      ...existingAssignments,
    ];
  } else {
    merged.supervisorIds =
      resolveSupervisorIds(
        principal,
        sanitized.supervisorIds,
        existingAssignments
      );

    await validateSupervisorIds(
      db,
      merged.supervisorIds
    );
  }

  if (resource === "clinicas") {
    validateRecord(
      resource,
      merged
    );

    return merged;
  }

  requireFields(
    merged,
    ["clinicaId"],
    "Preencha os campos obrigatÃ³rios"
  );

  const clinic = await getDocument(
    db,
    "clinicas",
    merged.clinicaId
  );

  assertRecordAccess(
    principal,
    clinic.data
  );

  assertSubset(
    merged.supervisorIds,
    recordSupervisorIds(
      clinic.data
    ),
    "Os supervisores do registro tambÃ©m precisam estar atribuÃ­dos Ã  clÃ­nica."
  );

  if (resource === "terapeutas") {
    validateRecord(
      resource,
      merged
    );

    return merged;
  }

  requireFields(
    merged,
    ["terapeutaId"],
    "Preencha os campos obrigatÃ³rios"
  );

  const therapist = await getDocument(
    db,
    "terapeutas",
    merged.terapeutaId
  );

  assertRecordAccess(
    principal,
    therapist.data
  );

  if (
    String(
      therapist.data.clinicaId
    ) !==
    String(
      merged.clinicaId
    )
  ) {
    throw httpError(
      400,
      "O terapeuta selecionado nÃ£o pertence Ã  clÃ­nica informada."
    );
  }

  assertSubset(
    merged.supervisorIds,
    recordSupervisorIds(
      therapist.data
    ),
    "Os supervisores do paciente tambÃ©m precisam estar atribuÃ­dos ao terapeuta."
  );

  if (resource === "pacientes") {
    validateRecord(
      resource,
      merged
    );

    return merged;
  }

  requireFields(
    merged,
    ["pacienteId"],
    "Preencha os campos obrigatÃ³rios"
  );

  const patient = await getDocument(
    db,
    "pacientes",
    merged.pacienteId
  );

  assertRecordAccess(
    principal,
    patient.data
  );

  const patientClinicMatches =
    String(
      patient.data.clinicaId
    ) ===
    String(
      merged.clinicaId
    );

  const patientTherapistMatches =
    String(
      patient.data.terapeutaId
    ) ===
    String(
      merged.terapeutaId
    );

  if (
    !patientClinicMatches ||
    !patientTherapistMatches
  ) {
    throw httpError(
      400,
      "Paciente, terapeuta e clÃ­nica nÃ£o correspondem ao mesmo vÃ­nculo."
    );
  }

  merged.supervisorIds =
    recordSupervisorIds(
      patient.data
    );

  await validateSupervisorIds(
    db,
    merged.supervisorIds
  );

  const existingSupervisorId =
    String(
      existing?.supervisorId || ""
    ).trim();

  const responsibleSupervisorId =
    resolveResponsibleSupervisorId(
      principal,
      sanitized.supervisorId,
      existingSupervisorId
    );

  if (!responsibleSupervisorId) {
    throw httpError(
      400,
      "Selecione a supervisora responsÃ¡vel pelo lanÃ§amento."
    );
  }

  const responsibleChanged =
    !existingSupervisorId ||
    responsibleSupervisorId !==
      existingSupervisorId;

  if (responsibleChanged) {
    assertSubset(
      [responsibleSupervisorId],
      merged.supervisorIds,
      "A supervisora responsÃ¡vel precisa estar vinculada ao paciente selecionado."
    );
  }

  const responsibleSupervisor =
    await getDocument(
      db,
      "supervisores",
      responsibleSupervisorId
    );

  if (
    responsibleChanged &&
    isInactiveSupervisor(
      responsibleSupervisor.data
    )
  ) {
    throw httpError(
      400,
      "A supervisora responsÃ¡vel estÃ¡ inativa ou arquivada."
    );
  }

  merged.supervisorId =
    responsibleSupervisorId;

  merged.supervisorNome =
    responsibleSupervisor.data.nome ||
    existing?.supervisorNome ||
    "";

  merged.supervisorEmail =
    responsibleSupervisor.data.email ||
    existing?.supervisorEmail ||
    "";

  merged.clinicaNome =
    clinic.data.nome || "";

  merged.terapeutaNome =
    therapist.data.nome || "";

  merged.pacienteNome =
    patient.data.nome || "";

  validateRecord(
    resource,
    merged
  );

  return merged;
}

function average(values) {
  const validValues = values
    .filter(
      (value) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
    .map(Number)
    .filter(Number.isFinite);

  if (!validValues.length) {
    return 0;
  }

  return (
    validValues.reduce(
      (sum, value) =>
        sum + value,
      0
    ) / validValues.length
  );
}

function normalizedPercent(
  value,
  max = 10,
  invert = false
) {
  if (
    value === "" ||
    value === null ||
    value === undefined
  ) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return null;
  }

  const adjusted = invert
    ? Number(max) - parsed
    : parsed;

  return Math.max(
    0,
    Math.min(
      100,
      (adjusted /
        Number(max || 1)) *
        100
    )
  );
}

function calcCompetencias(lancamento) {
  return average(
    COMPETENCY_FIELDS.map(
      (field) =>
        lancamento[field]
    )
  );
}

function calcEvolucao(lancamento) {
  return average([
    normalizedPercent(
      lancamento.qualidadeSono,
      10
    ),
    normalizedPercent(
      lancamento.adesaoTarefas,
      100
    ),
    normalizedPercent(
      lancamento.aplicacaoEstrategias,
      100
    ),
    normalizedPercent(
      lancamento.evolucaoObjetivos,
      100
    ),
    normalizedPercent(
      lancamento.intensidadeSintomas,
      10,
      true
    ),
    normalizedPercent(
      lancamento.evitacaoSocial,
      10,
      true
    ),
    normalizedPercent(
      lancamento.intensidadeComportamento,
      10,
      true
    ),
  ]);
}

async function dashboard(
  db,
  principal
) {
  const [
    todasClinicas,
    todosTerapeutas,
    todosPacientes,
    todosLancamentos,
  ] = await Promise.all([
    listCollection(
      db,
      "clinicas",
      principal
    ),
    listCollection(
      db,
      "terapeutas",
      principal
    ),
    listCollection(
      db,
      "pacientes",
      principal
    ),
    listCollection(
      db,
      "lancamentos",
      principal
    ),
  ]);

  const clinicas =
    todasClinicas.filter(
      (item) =>
        !isArchived(item)
    );

  const terapeutas =
    todosTerapeutas.filter(
      (item) =>
        !isArchived(item)
    );

  const pacientes =
    todosPacientes.filter(
      (item) =>
        !isArchived(item)
    );

  const lancamentos =
    todosLancamentos.filter(
      (item) =>
        !isArchived(item)
    );

  const mediaCompetencias =
    average(
      lancamentos.map(
        calcCompetencias
      )
    );

  const mediaEvolucao =
    average(
      lancamentos.map(
        calcEvolucao
      )
    );

  const planosAbertos =
    lancamentos.filter(
      (item) => {
        const status = String(
          item.statusPlano || ""
        ).toLowerCase();

        return (
          status &&
          ![
            "concluÃ­do",
            "concluido",
            "finalizado",
          ].includes(status)
        );
      }
    ).length;

  const casosAtencao =
    pacientes.filter(
      (item) => {
        const nivel = String(
          item.nivelAtencao || ""
        ).toLowerCase();

        return (
          nivel.includes("alta") ||
          nivel.includes("urgente") ||
          nivel.includes("atenÃ§Ã£o")
        );
      }
    ).length;

  return {
    access:
      publicAccess(principal),

    metricas: {
      totalClinicas:
        clinicas.length,
      totalTerapeutas:
        terapeutas.length,
      totalPacientes:
        pacientes.length,
      totalLancamentos:
        lancamentos.length,
      mediaCompetencias,
      mediaEvolucao,
      casosAtencao,
      planosAbertos,
    },

    clinicas,
    terapeutas,
    pacientes,
    lancamentos,
    lancamentosHistorico:
      todosLancamentos,
  };
}

function actorLabel(principal) {
  return (
    principal.email ||
    principal.userId ||
    principal.supervisorId ||
    "usuario"
  );
}

async function writeAudit(
  db,
  {
    action,
    resource,
    recordId,
    principal,
    changedFields,
  }
) {
  await db
    .collection(
      AUDIT_COLLECTION
    )
    .add({
      action,
      resource,
      recordId,
      changedFields: [
        ...new Set(
          changedFields
        ),
      ].sort(),
      actorRole:
        principal.role,
      actorSupervisorId:
        principal.supervisorId ||
        null,
      actorUserId:
        principal.userId ||
        null,
      actorEmail:
        principal.email ||
        null,
      createdAt:
        admin.firestore.FieldValue.serverTimestamp(),
    });
}

function launchDocumentId(data) {
  return `${data.pacienteId}__${data.ano}_${data.mes}_${data.semana}`;
}

async function assertNoLegacyLaunchDuplicate(
  db,
  data
) {
  const snapshot = await db
    .collection(
      RESOURCE_COLLECTIONS.lancamentos
    )
    .where(
      "pacienteId",
      "==",
      data.pacienteId
    )
    .get();

  const duplicate =
    snapshot.docs.some(
      (doc) => {
        const item =
          doc.data();

        return (
          !isArchived(item) &&
          Number(item.ano) ===
            Number(data.ano) &&
          Number(item.mes) ===
            Number(data.mes) &&
          Number(item.semana) ===
            Number(data.semana)
        );
      }
    );

  if (duplicate) {
    throw httpError(
      409,
      "JÃ¡ existe um lanÃ§amento ativo para este paciente no perÃ­odo informado."
    );
  }
}

async function createRecord(
  db,
  resource,
  body,
  principal
) {
  if (
    ADMIN_ONLY_RESOURCES.has(
      resource
    )
  ) {
    assertAdmin(principal);
  }

  const sanitized =
    sanitizeRecord(
      resource,
      body
    );

  const prepared =
    await prepareRecord(
      db,
      resource,
      sanitized,
      principal
    );

  const now =
    admin.firestore.FieldValue.serverTimestamp();

  const data = {
    ...prepared,

    ...(resource ===
      "supervisores" &&
    !prepared.status
      ? {
          status: "Ativo",
        }
      : {}),

    arquivado:
      prepared.arquivado === true,

    statusRegistro:
      prepared.statusRegistro ||
      "Ativo",

    criadoEm: now,
    atualizadoEm: now,

    criadoPor:
      actorLabel(principal),

    atualizadoPor:
      actorLabel(principal),
  };

  let docRef;

  if (
    resource ===
    "lancamentos"
  ) {
    await assertNoLegacyLaunchDuplicate(
      db,
      data
    );

    docRef = db
      .collection(
        RESOURCE_COLLECTIONS.lancamentos
      )
      .doc(
        launchDocumentId(data)
      );

    await db.runTransaction(
      async (transaction) => {
        const current =
          await transaction.get(
            docRef
          );

        if (current.exists) {
          throw httpError(
            409,
            "JÃ¡ existe um lanÃ§amento para este paciente no perÃ­odo informado. Edite ou restaure o registro existente."
          );
        }

        transaction.create(
          docRef,
          data
        );
      }
    );
  } else {
    docRef = await db
      .collection(
        RESOURCE_COLLECTIONS[
          resource
        ]
      )
      .add(data);
  }

  await writeAudit(
    db,
    {
      action: "create",
      resource,
      recordId:
        docRef.id,
      principal,
      changedFields:
        Object.keys(
          sanitized
        ),
    }
  );

  const saved =
    await docRef.get();

  return serializeDoc(
    saved
  );
}

function launchIdentityChanged(
  existing,
  next
) {
  const identityFields = [
    "ano",
    "mes",
    "semana",
    "clinicaId",
    "terapeutaId",
    "pacienteId",
  ];

  if (existing?.supervisorId) {
    identityFields.push(
      "supervisorId"
    );
  }

  return identityFields.some(
    (field) =>
      String(
        existing[field] ?? ""
      ) !==
      String(
        next[field] ?? ""
      )
  );
}

async function updateRecord(
  db,
  resource,
  id,
  body,
  principal
) {
  if (
    ADMIN_ONLY_RESOURCES.has(
      resource
    )
  ) {
    assertAdmin(principal);
  }

  const current =
    await getDocument(
      db,
      resource,
      id
    );

  if (
    resource !==
    "supervisores"
  ) {
    await assertResourceAccess(
      db,
      resource,
      principal,
      current.data
    );
  }

  const sanitized =
    sanitizeRecord(
      resource,
      body
    );

  const archiveOnly =
    sanitized.arquivado ===
      true &&
    Object.keys(
      sanitized
    ).every((field) =>
      [
        "arquivado",
        "statusRegistro",
      ].includes(field)
    );

  const prepared =
    archiveOnly
      ? {
          ...current.data,
          ...sanitized,
        }
      : await prepareRecord(
          db,
          resource,
          sanitized,
          principal,
          current.data
        );

  if (
    resource ===
      "lancamentos" &&
    launchIdentityChanged(
      current.data,
      prepared
    )
  ) {
    throw httpError(
      400,
      "O perÃ­odo e os vÃ­nculos de um lanÃ§amento nÃ£o podem ser alterados. Arquive-o e crie outro lanÃ§amento."
    );
  }

  const writableFields = [
    ...Object.keys(
      FIELD_RULES[
        resource
      ]
    ),

    ...(resource ===
    "supervisores"
      ? ["emailNormalizado"]
      : []),
  ];

  const update =
    Object.fromEntries(
      writableFields
        .filter(
          (key) =>
            key in prepared &&
            prepared[key] !==
              current.data[key]
        )
        .map((key) => [
          key,
          prepared[key],
        ])
    );

  update.atualizadoEm =
    admin.firestore.FieldValue.serverTimestamp();

  update.atualizadoPor =
    actorLabel(principal);

  if (
    sanitized.arquivado ===
      true &&
    !isArchived(
      current.data
    )
  ) {
    update.arquivadoEm =
      admin.firestore.FieldValue.serverTimestamp();

    update.arquivadoPor =
      actorLabel(principal);
  }

  if (
    sanitized.arquivado ===
      false &&
    isArchived(
      current.data
    )
  ) {
    update.restauradoEm =
      admin.firestore.FieldValue.serverTimestamp();

    update.restauradoPor =
      actorLabel(principal);
  }

  await current.ref.update(
    update
  );

  await writeAudit(
    db,
    {
      action:
        sanitized.arquivado ===
        true
          ? "archive"
          : sanitized.arquivado ===
            false
          ? "restore"
          : "update",

      resource,
      recordId: id,
      principal,

      changedFields:
        Object.keys(
          sanitized
        ),
    }
  );

  const updated =
    await current.ref.get();

  return serializeDoc(
    updated
  );
}

exports.handler =
  async function handler(
    event,
    context
  ) {
    if (
      event.httpMethod ===
      "OPTIONS"
    ) {
      return json(
        200,
        {
          ok: true,
        }
      );
    }

    try {
      const user =
        getIdentityUser(
          context
        );

      const db =
        getAdminDb();

      const principal =
        await resolvePrincipal(
          db,
          user
        );

      const resource =
        event
          .queryStringParameters
          ?.resource;

      const id =
        event
          .queryStringParameters
          ?.id;

      if (
        resource === "me"
      ) {
        if (
          event.httpMethod !==
          "GET"
        ) {
          return json(
            405,
            {
              message:
                "MÃ©todo nÃ£o permitido.",
            }
          );
        }

        return json(
          200,
          {
            access:
              publicAccess(
                principal
              ),
          }
        );
      }

      if (
        resource ===
        "dashboard"
      ) {
        if (
          event.httpMethod !==
          "GET"
        ) {
          return json(
            405,
            {
              message:
                "MÃ©todo nÃ£o permitido.",
            }
          );
        }

        return json(
          200,
          await dashboard(
            db,
            principal
          )
        );
      }

      if (
        !RESOURCE_COLLECTIONS[
          resource
        ]
      ) {
        return json(
          400,
          {
            message:
              "Recurso invÃ¡lido.",
          }
        );
      }

      if (
        event.httpMethod ===
        "GET"
      ) {
        if (id) {
          const item =
            await getDocument(
              db,
              resource,
              id
            );

          if (
            ADMIN_ONLY_RESOURCES.has(
              resource
            )
          ) {
            assertAdmin(
              principal
            );
          } else {
            await assertResourceAccess(
              db,
              resource,
              principal,
              item.data
            );
          }

          return json(
            200,
            {
              item:
                item.data,
            }
          );
        }

        return json(
          200,
          {
            items:
              await listCollection(
                db,
                resource,
                principal
              ),
          }
        );
      }

      if (
        event.httpMethod ===
        "POST"
      ) {
        return json(
          201,
          {
            item:
              await createRecord(
                db,
                resource,
                parseBody(
                  event
                ),
                principal
              ),
          }
        );
      }

      if (
        event.httpMethod ===
        "PUT"
      ) {
        if (!id) {
          return json(
            400,
            {
              message:
                "ID obrigatÃ³rio para atualizaÃ§Ã£o.",
            }
          );
        }

        return json(
          200,
          {
            item:
              await updateRecord(
                db,
                resource,
                id,
                parseBody(
                  event
                ),
                principal
              ),
          }
        );
      }

      if (
        event.httpMethod ===
        "DELETE"
      ) {
        return json(
          405,
          {
            message:
              "ExclusÃ£o definitiva desativada. Arquive o registro para preservar o histÃ³rico.",
          }
        );
      }

      return json(
        405,
        {
          message:
            "MÃ©todo nÃ£o permitido.",
        }
      );
    } catch (error) {
      console.error(
        error
      );

      return json(
        error.statusCode ||
          500,
        {
          message:
            error.message ||
            "Erro interno na API de supervisÃ£o.",
        }
      );
    }
  };

exports.__test = {
  average,
  calcCompetencias,
  calcEvolucao,
  canAccessRecord,
  launchDocumentId,
  normalizedPercent,
  sanitizeRecord,
  validateRecord,
};