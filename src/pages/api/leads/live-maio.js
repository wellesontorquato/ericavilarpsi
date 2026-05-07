import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const LIVE_ID = "gestacao-sem-filtro-maio";
const LIVE_TITULO = "Gestação sem filtro";
const MAX_SUBTEMAS = 5;
const TIMEZONE = "America/Maceio";

const SUBTEMAS_POR_PROFISSIONAL = {
  psicologia: [
    "A carga mental da mulher grávida",
    "Gestação e vulnerabilidade emocional: por que algumas mulheres adoecem psicologicamente?",
    "Ansiedade materna",
    "Picos hormonais e impactos emocionais",
  ],
  fisio: [
    "O corpo da gestante sem filtro",
    "Dor na gestação: até onde é normal?",
    "Movimento na gestação: medo x necessidade",
    "Recursos para alívio físico na gestação",
    "O peso físico da gestação",
    "Preparação do corpo para o parto",
    "Mitos sobre o corpo na gestação",
    "Cuidado individualizado na gestação",
    "Conexão com o corpo durante a gestação",
  ],
};

const SUBTEMAS_PERMITIDOS = [
  ...SUBTEMAS_POR_PROFISSIONAL.psicologia,
  ...SUBTEMAS_POR_PROFISSIONAL.fisio,
];

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeComparableText(value) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeWhatsapp(value) {
  return String(value || "").replace(/\D/g, "");
}

function getAllowedSubtema(value) {
  const normalizedValue = normalizeComparableText(value);

  return SUBTEMAS_PERMITIDOS.find(
    (subtema) => normalizeComparableText(subtema) === normalizedValue
  );
}

function normalizeSubtemas(value) {
  if (!value) return [];

  const rawItems = Array.isArray(value) ? value : [value];
  const uniqueSubtemas = [];
  const seen = new Set();

  rawItems.forEach((item) => {
    const cleanItem = normalizeText(item);

    if (!cleanItem) return;

    const allowedSubtema = getAllowedSubtema(cleanItem);

    if (!allowedSubtema) return;

    const key = normalizeComparableText(allowedSubtema);

    if (seen.has(key)) return;

    seen.add(key);
    uniqueSubtemas.push(allowedSubtema);
  });

  return uniqueSubtemas;
}

function mergeSubtemas(currentSubtemas, newSubtemas) {
  const merged = [];
  const seen = new Set();

  [...(currentSubtemas || []), ...(newSubtemas || [])].forEach((subtema) => {
    const allowedSubtema = getAllowedSubtema(subtema);

    if (!allowedSubtema) return;

    const key = normalizeComparableText(allowedSubtema);

    if (seen.has(key)) return;

    seen.add(key);
    merged.push(allowedSubtema);
  });

  return merged.slice(0, MAX_SUBTEMAS);
}

function getSubtemasPorProfissional(subtemas) {
  const selected = Array.isArray(subtemas) ? subtemas : [];

  return {
    psicologia: selected.filter((subtema) =>
      SUBTEMAS_POR_PROFISSIONAL.psicologia.includes(subtema)
    ),
    fisio: selected.filter((subtema) =>
      SUBTEMAS_POR_PROFISSIONAL.fisio.includes(subtema)
    ),
  };
}

function formatWhatsappDisplay(value) {
  const digits = normalizeWhatsapp(value);

  if (digits.length !== 11) {
    return digits;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function getBrazilDateKey(date) {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;

  return `${year}-${month}-${day}`;
}

function getIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    ""
  );
}

async function findExistingLead({ adminDb, email, whatsapp }) {
  const leadsRef = adminDb.collection("leads");

  const emailSnapshot = await leadsRef
    .where("email", "==", email)
    .limit(10)
    .get();

  const existingByEmail = emailSnapshot.docs.find((doc) => {
    const data = doc.data();
    return data.liveId === LIVE_ID;
  });

  if (existingByEmail) {
    return existingByEmail;
  }

  const whatsappSnapshot = await leadsRef
    .where("whatsapp", "==", whatsapp)
    .limit(10)
    .get();

  const existingByWhatsapp = whatsappSnapshot.docs.find((doc) => {
    const data = doc.data();
    return data.liveId === LIVE_ID;
  });

  if (existingByWhatsapp) {
    return existingByWhatsapp;
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Esta rota aceita apenas envio via formulário.");
  }

  try {
    const { admin, adminDb } = getFirebaseAdmin();

    const nowDate = new Date();
    const now = admin.firestore.FieldValue.serverTimestamp();
    const nowIso = nowDate.toISOString();
    const nowDateKey = getBrazilDateKey(nowDate);

    const nome = normalizeText(req.body.nome);
    const whatsapp = normalizeWhatsapp(req.body.whatsapp);
    const whatsappFormatado = formatWhatsappDisplay(req.body.whatsapp);
    const email = normalizeEmail(req.body.email);
    const subtemas = normalizeSubtemas(req.body.subtemas);
    const consentimento =
      req.body.consentimento === "on" || req.body.consentimento === true;

    if (!nome || nome.length < 2) {
      return res.status(400).send("Informe um nome válido.");
    }

    if (!whatsapp || whatsapp.length < 10) {
      return res.status(400).send("Informe um WhatsApp válido.");
    }

    if (!email || !email.includes("@")) {
      return res.status(400).send("Informe um e-mail válido.");
    }

    if (!consentimento) {
      return res
        .status(400)
        .send("O consentimento é obrigatório para concluir a inscrição.");
    }

    if (subtemas.length > MAX_SUBTEMAS) {
      return res
        .status(400)
        .send(`Escolha no máximo ${MAX_SUBTEMAS} subtemas.`);
    }

    const subtemasPorProfissional = getSubtemasPorProfissional(subtemas);

    const existingLead = await findExistingLead({
      adminDb,
      email,
      whatsapp,
    });

    if (existingLead) {
      const existingData = existingLead.data() || {};
      const mergedSubtemas = mergeSubtemas(existingData.subtemas, subtemas);
      const mergedSubtemasPorProfissional =
        getSubtemasPorProfissional(mergedSubtemas);

      await existingLead.ref.set(
        {
          nome,
          whatsapp,
          whatsappFormatado,
          email,

          subtemas: mergedSubtemas,
          subtemasCount: mergedSubtemas.length,
          hasSubtemas: mergedSubtemas.length > 0,
          subtemasTexto: mergedSubtemas.join(" | "),
          subtemasPorProfissional: mergedSubtemasPorProfissional,

          lastAttemptAt: now,
          lastAttemptAtIso: nowIso,
          lastAttemptDateKey: nowDateKey,
          lastAttemptSubtemas: subtemas,
          lastAttemptSubtemasCount: subtemas.length,
          lastAttemptHasSubtemas: subtemas.length > 0,

          duplicateAttempts: admin.firestore.FieldValue.increment(1),
          updatedAt: now,
          updatedAtIso: nowIso,
          updatedAtDateKey: nowDateKey,
        },
        { merge: true }
      );

      return res.redirect(303, "/obrigado-live?status=ja-inscrito");
    }

    await adminDb.collection("leads").add({
      nome,
      whatsapp,
      whatsappFormatado,
      email,

      subtemas,
      subtemasCount: subtemas.length,
      hasSubtemas: subtemas.length > 0,
      subtemasTexto: subtemas.join(" | "),
      subtemasPorProfissional,

      consentimento: true,
      consentimentoTexto:
        "Aceito receber comunicações sobre esta live e conteúdos relacionados por WhatsApp e e-mail.",

      liveId: LIVE_ID,
      liveTitulo: LIVE_TITULO,
      origem: "live-maio",
      campanha: "gestacao-sem-filtro",
      canal: "landing-page",

      status: "novo",
      entrouGrupoVip: false,
      duplicateAttempts: 0,

      createdAt: now,
      createdAtIso: nowIso,
      createdAtDateKey: nowDateKey,

      updatedAt: now,
      updatedAtIso: nowIso,
      updatedAtDateKey: nowDateKey,

      userAgent: req.headers["user-agent"] || "",
      ip: getIp(req),
    });

    return res.redirect(303, "/obrigado-live?status=confirmado");
  } catch (error) {
    console.error("Erro ao salvar lead da live:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });

    return res
      .status(500)
      .send("Não foi possível concluir sua inscrição agora. Tente novamente.");
  }
}