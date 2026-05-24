import Head from "next/head";
import { useState } from "react";

const CARD_LINKS = {
  individual:
    "https://link.infinitepay.io/lizianascimento/VC1DLTAtUg-cOHS9p4ihX-197,00",
  casal:
    "https://link.infinitepay.io/lizianascimento/VC1DLTAtUg-UMY5a2YDjT-297,00",
};

const PIX_PAYMENTS = {
  individual: {
    imagem: "/pix197.png",
    codigo:
      "00020101021226760014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0228Imersao- Gestacao sem filtro5204000053039865406197.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCTZ0NCVL4utMwEIwa1KznP6304523E",
  },
  casal: {
    imagem: "/pix297.png",
    codigo:
      "00020101021226700014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0222Pagamento lizianascime5204000053039865406297.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCZUgc8SO3XQC3OvOamoRRm6304AA8C",
  },
};

const planos = {
  individual: {
    id: "individual",
    nome: "Individual",
    valor: "R$ 197",
    descricao: "Para participar individualmente da imersão.",
    participantes: "1 participante",
  },
  casal: {
    id: "casal",
    nome: "Casal",
    valor: "R$ 297",
    descricao: "Para viver essa experiência junto com o companheiro.",
    participantes: "2 participantes",
  },
};

const metodosPagamento = {
  pix: {
    id: "pix",
    nome: "Pix",
    detalhe: "sem acréscimo",
  },
  cartao: {
    id: "cartao",
    nome: "Cartão",
    detalhe: "com acréscimo",
  },
};

function formatBrazilianWhatsapp(value) {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;

  if (digits.length <= 7) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function PagamentoImersao() {
  return (
    <>
      <Head>
        <title>Pagamento | Imersão Gestação Sem Filtro</title>
        <meta
          name="description"
          content="Garanta sua vaga na Imersão Gestação Sem Filtro."
        />
      </Head>

      <main className="checkoutPage">
        <div className="bgWord">GESTAÇÃO</div>
        <div className="orb orbOne" />
        <div className="orb orbTwo" />

        <section className="checkoutShell">
          <div className="heroArea">
            <div className="badge">
              <span />
              Imersão presencial
            </div>

            <div className="dateRow">
              <span>Apenas 10 vagas</span>
              <span>Gestação</span>
              <span>Parto e pós-parto</span>
            </div>

            <p className="eyebrow">Para mulheres e casais</p>

            <h1>
              Gestação sem filtro
              <em> uma vivência real, acolhedora e transformadora.</em>
            </h1>

            <p className="heroText">
              Uma experiência profunda para viver a gestação com mais
              consciência, preparo, segurança e acolhimento.
            </p>

            <div className="includedList">
              <span>Muito acolhimento</span>
              <span>Coffee break especial</span>
              <span>Exercícios para o trabalho de parto</span>
              <span>Preparação para o pós-parto</span>
            </div>
          </div>

          <div className="modelsArea" aria-hidden="true">
            <div className="modelsGlow" />
            <img
              src="/modelos%20transparente.png"
              alt=""
              className="modelsImage"
            />
          </div>

          <CheckoutCard />
        </section>
      </main>

      <style jsx global>{`
        .checkoutPage,
        .checkoutPage * {
          box-sizing: border-box;
        }

        .checkoutPage {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 14px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 14% 12%, rgba(255, 210, 184, 0.23), transparent 30%),
            radial-gradient(circle at 84% 20%, rgba(187, 76, 91, 0.32), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(240, 143, 101, 0.22), transparent 34%),
            linear-gradient(135deg, #321217 0%, #5a2328 46%, #9a5545 100%);
        }

        .bgWord {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          color: rgba(255, 235, 224, 0.075);
          font-size: clamp(4rem, 18vw, 15rem);
          font-weight: 950;
          letter-spacing: -0.09em;
          line-height: 0.8;
          white-space: nowrap;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          z-index: 0;
          border-radius: 999px;
          filter: blur(74px);
          pointer-events: none;
        }

        .orbOne {
          width: 300px;
          height: 300px;
          left: -120px;
          bottom: 20%;
          background: rgba(255, 181, 137, 0.42);
        }

        .orbTwo {
          width: 360px;
          height: 360px;
          right: -150px;
          top: 16%;
          background: rgba(129, 42, 63, 0.52);
        }

        .checkoutShell {
          width: min(1140px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: grid;
          gap: 16px;
          padding: 10px 0 22px;
        }

        .heroArea,
        .paymentCard,
        .modelsArea {
          min-width: 0;
        }

        .heroArea {
          border-radius: 30px;
          padding: 20px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(255, 247, 242, 0.98)),
            #fff8f4;
          box-shadow:
            0 30px 80px rgba(24, 6, 8, 0.28),
            inset 0 0 0 1px rgba(255, 255, 255, 0.76);
        }

        .badge {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 13px;
          border-radius: 999px;
          background: #ffffff;
          color: #a64c50;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.055em;
          text-transform: uppercase;
          box-shadow: 0 12px 30px rgba(90, 35, 38, 0.08);
        }

        .badge span {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #b04b58;
          box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
          animation: pulseDot 1.35s ease-in-out infinite;
        }

        .dateRow {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 14px 0 16px;
        }

        .dateRow span {
          padding: 9px 12px;
          border-radius: 999px;
          background: #f7e5dc;
          color: #7f3d3a;
          font-size: 0.75rem;
          font-weight: 850;
        }

        .eyebrow {
          margin: 0 0 10px;
          color: #a64c50;
          font-size: 0.72rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .heroArea h1 {
          margin: 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.35rem, 11vw, 5rem);
          line-height: 0.9;
          letter-spacing: -0.065em;
          font-weight: 600;
        }

        .heroArea h1 em {
          display: block;
          color: #a64c50;
          font-style: italic;
          font-weight: 400;
        }

        .heroText {
          margin: 16px 0 0;
          max-width: 560px;
          color: #563936;
          font-size: 0.96rem;
          line-height: 1.5;
          font-weight: 560;
        }

        .includedList {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          margin-top: 16px;
        }

        .includedList span {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 42px;
          padding: 10px 11px;
          border-radius: 15px;
          background: rgba(255, 250, 247, 0.82);
          color: #72443d;
          font-size: 0.78rem;
          line-height: 1.25;
          font-weight: 850;
          border: 1px solid rgba(166, 76, 80, 0.09);
        }

        .includedList span::before {
          content: "✓";
          display: grid;
          place-items: center;
          width: 19px;
          height: 19px;
          border-radius: 999px;
          background: #a64c50;
          color: #fff;
          font-size: 0.68rem;
          font-weight: 950;
          flex: 0 0 auto;
        }

        .modelsArea {
          position: relative;
          display: grid;
          place-items: center;
          min-height: 310px;
          border-radius: 30px;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 10%, rgba(255, 236, 224, 0.6), transparent 40%),
            linear-gradient(180deg, rgba(255, 248, 243, 0.18), rgba(255, 248, 243, 0.04));
        }

        .modelsGlow {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 999px;
          background: rgba(255, 207, 184, 0.35);
          filter: blur(36px);
        }

        .modelsImage {
          position: relative;
          z-index: 1;
          width: min(360px, 100%);
          max-height: 390px;
          object-fit: contain;
          object-position: center bottom;
          display: block;
          filter: drop-shadow(0 30px 34px rgba(35, 8, 10, 0.28));
        }

        .paymentCard {
          border-radius: 30px;
          padding: 18px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 244, 238, 0.99)),
            #fff8f4;
          border: 1px solid rgba(166, 76, 80, 0.14);
          box-shadow:
            0 26px 70px rgba(49, 15, 15, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.65);
        }

        .paymentHeader {
          margin-bottom: 14px;
        }

        .paymentHeader span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 8px;
          color: #a64c50;
          font-size: 0.7rem;
          font-weight: 950;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .paymentHeader span::before {
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #b04b58;
          box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
          animation: pulseDot 1.35s ease-in-out infinite;
        }

        .paymentHeader h2 {
          margin: 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2rem, 8vw, 2.55rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .paymentHeader p {
          margin: 9px 0 0;
          color: #67443e;
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .leadForm {
          display: grid;
          gap: 11px;
        }

        .field {
          display: grid;
          gap: 6px;
        }

        .field label,
        .selectField label {
          color: #3a1b1a;
          font-size: 0.79rem;
          font-weight: 850;
        }

        .field input,
        .selectField select {
          width: 100%;
          min-height: 48px;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #fffaf7;
          padding: 13px 14px;
          color: #2d1717;
          font: inherit;
          outline: none;
          transition: box-shadow 0.18s ease, border-color 0.18s ease;
        }

        .field input:focus,
        .selectField select:focus {
          border-color: rgba(166, 76, 80, 0.58);
          box-shadow: 0 0 0 4px rgba(166, 76, 80, 0.12);
        }

        .currentChoice {
          display: grid;
          gap: 12px;
          padding: 14px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.78), transparent 35%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border: 1px solid rgba(166, 76, 80, 0.16);
          box-shadow: 0 14px 34px rgba(143, 48, 72, 0.1);
        }

        .currentChoiceTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .choiceMiniLabel {
          display: block;
          margin-bottom: 5px;
          color: #a64c50;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .currentChoice strong {
          display: block;
          color: #351817;
          font-size: 0.98rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .currentChoice small {
          display: block;
          margin-top: 4px;
          color: #704740;
          font-size: 0.74rem;
          line-height: 1.35;
          font-weight: 750;
        }

        .choiceValue {
          text-align: right;
          color: #351817;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.75rem;
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-weight: 600;
          white-space: nowrap;
        }

        .changeChoiceButton,
        .applyChoiceButton,
        .copyPixButton {
          width: 100%;
          min-height: 44px;
          border: 0;
          border-radius: 15px;
          padding: 12px 14px;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.84rem;
          font-weight: 950;
          cursor: pointer;
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .changeChoiceButton {
          background: rgba(255, 250, 247, 0.82);
          color: #8f3048;
          border: 1px solid rgba(143, 48, 72, 0.13);
        }

        .applyChoiceButton,
        .copyPixButton {
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #ffffff;
          box-shadow: 0 14px 28px rgba(143, 48, 72, 0.24);
        }

        .changeChoiceButton:hover,
        .applyChoiceButton:hover,
        .copyPixButton:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }

        .choiceEditor {
          display: grid;
          gap: 10px;
          padding-top: 2px;
        }

        .selectGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .selectField {
          display: grid;
          gap: 6px;
        }

        .noticeBox {
          display: grid;
          gap: 6px;
          padding: 12px;
          border-radius: 17px;
          background: rgba(255, 250, 247, 0.72);
          border: 1px solid rgba(166, 76, 80, 0.1);
        }

        .noticeBox strong {
          color: #7f293f;
          font-size: 0.84rem;
          line-height: 1.3;
          font-weight: 950;
        }

        .noticeBox p {
          margin: 0;
          color: #704740;
          font-size: 0.76rem;
          line-height: 1.4;
          font-weight: 750;
        }

        .pixBox {
          display: grid;
          gap: 13px;
          padding: 13px;
          border-radius: 22px;
          background: #fffaf7;
          border: 1px solid rgba(166, 76, 80, 0.14);
        }

        .pixBoxHeader {
          display: grid;
          gap: 5px;
        }

        .pixBoxHeader span {
          color: #a64c50;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .pixBoxHeader strong {
          color: #351817;
          font-size: 0.94rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .pixBoxHeader p {
          margin: 0;
          color: #704740;
          font-size: 0.76rem;
          line-height: 1.4;
          font-weight: 750;
        }

        .qrFrame {
          display: grid;
          place-items: center;
          padding: 10px;
          border-radius: 18px;
          background: #ffffff;
          border: 1px solid rgba(166, 76, 80, 0.1);
        }

        .qrFrame img {
          width: min(230px, 100%);
          height: auto;
          display: block;
          border-radius: 12px;
        }

        .pixCodeArea {
          display: grid;
          gap: 8px;
        }

        .pixCodeArea label {
          color: #3a1b1a;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .pixCodeArea textarea {
          width: 100%;
          min-height: 86px;
          resize: vertical;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #fff;
          padding: 12px;
          color: #2d1717;
          font: inherit;
          font-size: 0.72rem;
          line-height: 1.38;
          outline: none;
        }

        .proofNote {
          margin: 0;
          padding: 10px 12px;
          border-radius: 15px;
          background: rgba(143, 48, 72, 0.08);
          color: #7f293f;
          font-size: 0.76rem;
          line-height: 1.38;
          font-weight: 900;
          text-align: center;
        }

        .consent {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px;
          border-radius: 16px;
          background: #f8e5dc;
          color: #5b3a36;
          font-size: 0.78rem;
          line-height: 1.38;
          cursor: pointer;
          border: 1px solid rgba(166, 76, 80, 0.12);
        }

        .consent input {
          width: 18px;
          height: 18px;
          margin-top: 1px;
          flex: 0 0 auto;
          accent-color: #a64c50;
        }

        .consent strong {
          color: #8f3048;
        }

        .errorMessage {
          margin: 0;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(143, 48, 72, 0.09);
          color: #8f3048;
          font-size: 0.78rem;
          line-height: 1.35;
          font-weight: 850;
        }

        .submit {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 18px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #fff;
          font-family: "Montserrat", Arial, sans-serif;
          font-weight: 950;
          font-size: 0.95rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 38px rgba(143, 48, 72, 0.34);
          animation: ctaPulse 1.6s ease-in-out infinite;
          transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
        }

        .submit span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          flex: 0 0 auto;
        }

        .submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.04);
          box-shadow: 0 24px 48px rgba(143, 48, 72, 0.4);
        }

        .submit:disabled {
          opacity: 0.72;
          cursor: wait;
        }

        .safeNote {
          margin: 0;
          text-align: center;
          color: #86534b;
          font-size: 0.73rem;
          line-height: 1.35;
        }

        @keyframes pulseDot {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 5px rgba(176, 75, 88, 0.12);
          }

          50% {
            transform: scale(1.18);
            box-shadow: 0 0 0 8px rgba(176, 75, 88, 0.08);
          }
        }

        @keyframes ctaPulse {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-1px);
          }
        }

        @media (min-width: 620px) {
          .checkoutPage {
            padding: 22px;
          }

          .heroArea,
          .paymentCard,
          .modelsArea {
            border-radius: 36px;
          }

          .heroArea {
            padding: 28px;
          }

          .includedList {
            grid-template-columns: 1fr 1fr;
          }

          .paymentCard {
            padding: 24px;
          }

          .selectGrid {
            grid-template-columns: 1fr 1fr;
          }

          .currentChoiceTop {
            align-items: center;
          }
        }

        @media (min-width: 980px) {
          .checkoutPage {
            padding: 32px;
          }

          .checkoutShell {
            min-height: calc(100vh - 64px);
            grid-template-columns: minmax(0, 1fr) 420px;
            grid-template-areas:
              "hero payment"
              "models payment";
            align-items: stretch;
            gap: 24px;
          }

          .heroArea {
            grid-area: hero;
            padding: 42px;
          }

          .modelsArea {
            grid-area: models;
            min-height: 360px;
          }

          .modelsImage {
            width: min(560px, 100%);
            max-height: 430px;
          }

          .paymentCard {
            grid-area: payment;
            align-self: start;
            position: sticky;
            top: 24px;
            padding: 24px;
          }

          .heroArea h1 {
            font-size: clamp(4rem, 5vw, 5.3rem);
          }

          .heroText {
            font-size: 1.02rem;
          }

          .includedList {
            max-width: 690px;
          }
        }

        @media (min-width: 1180px) {
          .checkoutShell {
            grid-template-columns: minmax(0, 1fr) 430px;
          }

          .modelsArea {
            min-height: 385px;
          }

          .modelsImage {
            width: min(620px, 100%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .checkoutPage *,
          .checkoutPage *::before,
          .checkoutPage *::after {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}

function CheckoutCard() {
  const [whatsapp, setWhatsapp] = useState("");
  const [plano, setPlano] = useState("individual");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [editandoEscolha, setEditandoEscolha] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const planoSelecionado = planos[plano];
  const metodoSelecionado = metodosPagamento[metodoPagamento];
  const dadosPix = PIX_PAYMENTS[plano];
  const isPix = metodoPagamento === "pix";
  const isCartao = metodoPagamento === "cartao";

  async function copiarPix() {
    setErro("");

    try {
      await navigator.clipboard.writeText(dadosPix.codigo);
      setPixCopiado(true);

      setTimeout(() => {
        setPixCopiado(false);
      }, 2200);
    } catch (error) {
      setErro(
        "Não foi possível copiar automaticamente. Selecione o código Pix e copie manualmente."
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErro("");
    setEnviando(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      nome: formData.get("nome"),
      whatsapp: formData.get("whatsapp"),
      email: formData.get("email"),
      plano,
      planoNome: planoSelecionado.nome,
      valor: planoSelecionado.valor,
      metodoPagamento,
      metodoPagamentoNome: metodoSelecionado.nome,
      origem: "imersao-gestacao-sem-filtro",
      criadoEm: new Date().toISOString(),
    };

    try {
      await fetch("/api/leads/imersao-gestacao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Erro ao salvar lead antes do pagamento:", error);
    }

    if (isCartao) {
      const linkCartao = CARD_LINKS[plano];

      if (!linkCartao) {
        setErro("O link do cartão ainda não foi configurado.");
        setEnviando(false);
        return;
      }

      window.location.href = linkCartao;
      return;
    }

    setEnviando(false);

    const pixBox = document.getElementById("pix-pagamento");

    if (pixBox) {
      pixBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <aside className="paymentCard" id="inscricao">
      <div className="paymentHeader">
        <span>Reserva de vaga</span>
        <h2>Finalize sua inscrição</h2>
        <p>
          Comece com a opção individual no Pix. Caso queira, altere para casal ou
          cartão antes de confirmar.
        </p>
      </div>

      <form className="leadForm" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="nome">Nome</label>
          <input id="nome" type="text" name="nome" placeholder="Seu nome" required />
        </div>

        <div className="field">
          <label htmlFor="whatsapp">WhatsApp</label>
          <input
            id="whatsapp"
            type="tel"
            name="whatsapp"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            maxLength={15}
            onChange={(event) => {
              setWhatsapp(formatBrazilianWhatsapp(event.target.value));
            }}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="seuemail@exemplo.com"
            required
          />
        </div>

        <div className="currentChoice">
          <div className="currentChoiceTop">
            <div>
              <span className="choiceMiniLabel">Sua escolha</span>
              <strong>
                {planoSelecionado.nome} no {metodoSelecionado.nome}
              </strong>
              <small>
                {planoSelecionado.participantes} · {metodoSelecionado.detalhe}
              </small>
            </div>

            <div className="choiceValue">
              {isCartao ? `${planoSelecionado.valor}+` : planoSelecionado.valor}
            </div>
          </div>

          {!editandoEscolha && (
            <button
              type="button"
              className="changeChoiceButton"
              onClick={() => setEditandoEscolha(true)}
            >
              Alterar opção
            </button>
          )}

          {editandoEscolha && (
            <div className="choiceEditor">
              <div className="selectGrid">
                <div className="selectField">
                  <label htmlFor="plano">Vaga</label>
                  <select
                    id="plano"
                    value={plano}
                    onChange={(event) => setPlano(event.target.value)}
                  >
                    <option value="individual">Individual — R$ 197</option>
                    <option value="casal">Casal — R$ 297</option>
                  </select>
                </div>

                <div className="selectField">
                  <label htmlFor="metodoPagamento">Pagamento</label>
                  <select
                    id="metodoPagamento"
                    value={metodoPagamento}
                    onChange={(event) => setMetodoPagamento(event.target.value)}
                  >
                    <option value="pix">Pix sem acréscimo</option>
                    <option value="cartao">Cartão com acréscimo</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="applyChoiceButton"
                onClick={() => setEditandoEscolha(false)}
              >
                Aplicar escolha
              </button>
            </div>
          )}
        </div>

        {isPix && (
          <div className="pixBox" id="pix-pagamento">
            <div className="pixBoxHeader">
              <span>Pagamento via Pix</span>
              <strong>
                {planoSelecionado.nome} — {planoSelecionado.valor}
              </strong>
              <p>
                Escaneie o QR Code ou use o Pix copia e cola. Depois envie o
                comprovante no grupo para confirmação da vaga.
              </p>
            </div>

            <div className="qrFrame">
              <img
                src={dadosPix.imagem}
                alt={`QR Code Pix ${planoSelecionado.nome}`}
              />
            </div>

            <div className="pixCodeArea">
              <label htmlFor="pixCopiaCola">Pix copia e cola</label>

              <textarea
                id="pixCopiaCola"
                value={dadosPix.codigo}
                readOnly
                onFocus={(event) => event.target.select()}
              />

              <button type="button" className="copyPixButton" onClick={copiarPix}>
                {pixCopiado ? "Pix copiado!" : "Copiar código Pix"}
              </button>
            </div>

            <p className="proofNote">
              Importante: a vaga será confirmada após o envio do comprovante no grupo.
            </p>
          </div>
        )}

        {isCartao && (
          <div className="noticeBox">
            <strong>Cartão com acréscimo de taxas</strong>
            <p>
              Você será direcionada para a InfinitePay. O valor final pode ter
              acréscimo referente às taxas da operadora e será exibido antes da
              confirmação.
            </p>
          </div>
        )}

        <label className="consent">
          <input type="checkbox" name="consentimento" required />
          <span>
            <strong>Obrigatório:</strong> confirmo que meus dados estão corretos
            e aceito receber comunicações sobre a Imersão Gestação Sem Filtro.
          </span>
        </label>

        {erro && <p className="errorMessage">{erro}</p>}

        <button className="submit" type="submit" disabled={enviando}>
          {isCartao
            ? enviando
              ? "Redirecionando..."
              : "Ir para pagamento no cartão"
            : enviando
              ? "Confirmando..."
              : "Confirmar meus dados"}
          <span>↗</span>
        </button>

        <p className="safeNote">
          Sua vaga será reservada após a confirmação do pagamento.
        </p>
      </form>
    </aside>
  );
}