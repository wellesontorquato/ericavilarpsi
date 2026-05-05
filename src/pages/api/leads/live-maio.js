import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

const LIVE_ID = "gestacao-sem-filtro-maio";
const LIVE_TITULO = "Gestação sem filtro";

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeWhatsapp(value) {
  return String(value || "").replace(/\D/g, "");
}

function normalizeSubtemas(value) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  return [normalizeText(value)].filter(Boolean);
}

function formatWhatsappDisplay(value) {
  const digits = normalizeWhatsapp(value);

  if (digits.length !== 11) {
    return digits;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
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

    const now = admin.firestore.FieldValue.serverTimestamp();

    const existingLead = await findExistingLead({
      adminDb,
      email,
      whatsapp,
    });

    if (existingLead) {
      await existingLead.ref.set(
        {
          lastAttemptAt: now,
          duplicateAttempts: admin.firestore.FieldValue.increment(1),
          updatedAt: now,
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
      updatedAt: now,
      userAgent: req.headers["user-agent"] || "",
      ip:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "",
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