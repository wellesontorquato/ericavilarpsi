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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Esta rota aceita apenas envio via formulário.");
  }

  try {
    const { admin, adminDb } = getFirebaseAdmin();

    const nome = normalizeText(req.body.nome);
    const whatsapp = normalizeWhatsapp(req.body.whatsapp);
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

    await adminDb.collection("leads").add({
      nome,
      whatsapp,
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
      createdAt: now,
      updatedAt: now,
      userAgent: req.headers["user-agent"] || "",
      ip:
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket?.remoteAddress ||
        "",
    });

    return res.redirect(303, "/obrigado-live");
  } catch (error) {
    console.error("Erro ao salvar lead da live:", error);

    return res
      .status(500)
      .send("Não foi possível concluir sua inscrição agora. Tente novamente.");
  }
}