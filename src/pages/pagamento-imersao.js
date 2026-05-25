import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

const CARD_LINKS = {
  individual:
    "https://link.infinitepay.io/lizianascimento/VC1DLTAtUg-cOHS9p4ihX-197,00",
  casal:
    "https://link.infinitepay.io/lizianascimento/VC1DLTAtUg-UMY5a2YDjT-297,00",
};

const planos = {
  individual: {
    id: "individual",
    nome: "Individual",
    valor: "R$ 197",
    participantes: "1 participante",
    texto: "Para participar individualmente da imersão.",
  },
  casal: {
    id: "casal",
    nome: "Casal",
    valor: "R$ 297",
    participantes: "2 participantes",
    texto: "Para viver essa experiência junto com o(a) companheiro(a).",
  },
};

const destaques = [
  "Muito acolhimento",
  "Coffee break especial",
  "Exercícios para o trabalho de parto",
  "Preparação para gestação, parto e pós-parto",
];

export default function PagamentoImersao() {
  const router = useRouter();
  const [plano, setPlano] = useState("individual");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");

  const planoSelecionado = planos[plano];
  const isPix = metodoPagamento === "pix";
  const isCartao = metodoPagamento === "cartao";

  function continuarPagamento() {
    if (isCartao) {
      window.location.href = CARD_LINKS[plano];
      return;
    }

    router.push(`/pix-imersao?plano=${plano}`);
  }

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
          <section className="heroCard">
            <div className="heroContent">
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

              <h1>Gestação sem filtro</h1>

              <p className="heroLead">
                Uma experiência profunda, acolhedora e transformadora para viver
                a gestação com mais consciência, preparo e segurança.
              </p>

              <div className="includedList">
                {destaques.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="modelCard">
              <div className="modelText">
                <span>Com</span>
                <strong>Erica Vilar & Lizia Nascimento</strong>
                <small>Psicologia, fisioterapia, doula e acolhimento</small>
              </div>

              <div className="modelImageBox">
                <img
                  src="/modelos%20transparente.png"
                  alt="Erica Vilar e Lizia Nascimento"
                />
              </div>
            </div>
          </section>

          <section className="paymentCard">
            <div className="paymentHeader">
              <span>Pagamento</span>
              <h2>Escolha como garantir sua vaga</h2>
              <p>
                Se escolher Pix, você será direcionada para uma página com QR Code
                e copia e cola. Se escolher cartão, vai direto para a InfinitePay.
              </p>
            </div>

            <div className="choiceBlock">
              <span className="blockLabel">Escolha sua vaga</span>

              <div className="planGrid">
                {Object.values(planos).map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`planCard ${plano === item.id ? "isSelected" : ""}`}
                    onClick={() => setPlano(item.id)}
                  >
                    <div>
                      <strong>{item.nome}</strong>
                      <small>{item.participantes}</small>
                    </div>

                    <b>{item.valor}</b>

                    <p>{item.texto}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="choiceBlock">
              <span className="blockLabel">Forma de pagamento</span>

              <div className="paymentGrid">
                <button
                  type="button"
                  className={`methodCard ${isPix ? "isSelected" : ""}`}
                  onClick={() => setMetodoPagamento("pix")}
                >
                  <strong>Pix</strong>
                  <small>Sem acréscimo</small>
                </button>

                <button
                  type="button"
                  className={`methodCard ${isCartao ? "isSelected" : ""}`}
                  onClick={() => setMetodoPagamento("cartao")}
                >
                  <strong>Cartão</strong>
                  <small>Com acréscimo</small>
                </button>
              </div>
            </div>

            <div className="summaryBox">
              <span>Resumo</span>

              <div className="summaryTop">
                <strong>
                  {planoSelecionado.nome} no {isPix ? "Pix" : "Cartão"}
                </strong>

                <b>{isCartao ? `${planoSelecionado.valor}+` : planoSelecionado.valor}</b>
              </div>

              <p>
                {isPix
                  ? "Você irá para a página do Pix para copiar o código ou escanear o QR Code."
                  : "Você será redirecionada para a InfinitePay. O cartão possui acréscimo de taxas."}
              </p>
            </div>

            <button type="button" className="primaryButton" onClick={continuarPagamento}>
              {isPix ? "Ir para pagamento via Pix" : "Ir para pagamento no cartão"}
              <span>↗</span>
            </button>

            <p className="safeNote">
              No Pix, envie o comprovante no grupo para confirmação da vaga.
            </p>
          </section>
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
          overflow-x: hidden;
          padding: 12px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 12% 10%, rgba(255, 210, 184, 0.22), transparent 30%),
            radial-gradient(circle at 88% 16%, rgba(187, 76, 91, 0.34), transparent 34%),
            radial-gradient(circle at 50% 100%, rgba(240, 143, 101, 0.22), transparent 34%),
            linear-gradient(135deg, #321217 0%, #5a2328 46%, #9a5545 100%);
        }

        .bgWord {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          color: rgba(255, 235, 224, 0.07);
          font-size: clamp(4rem, 17vw, 15rem);
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
          bottom: 18%;
          background: rgba(255, 181, 137, 0.42);
        }

        .orbTwo {
          width: 360px;
          height: 360px;
          right: -150px;
          top: 14%;
          background: rgba(129, 42, 63, 0.52);
        }

        .checkoutShell {
          width: min(1280px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: grid;
          gap: 14px;
          padding: 10px 0 22px;
        }

        .heroCard,
        .paymentCard {
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(255, 247, 242, 0.99)),
            #fff8f4;
          border: 1px solid rgba(255, 255, 255, 0.74);
          box-shadow:
            0 28px 70px rgba(24, 6, 8, 0.24),
            inset 0 0 0 1px rgba(255, 255, 255, 0.68);
        }

        .heroCard {
          display: grid;
          gap: 16px;
          overflow: hidden;
          border-radius: 30px;
          padding: 18px;
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
          font-size: 0.67rem;
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
          font-size: 0.74rem;
          font-weight: 850;
        }

        .eyebrow {
          width: fit-content;
          margin: 0 0 10px;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(247, 229, 220, 0.72);
          color: #a64c50;
          font-size: 0.68rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .heroCard h1 {
          margin: 0;
          max-width: 720px;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(3rem, 16vw, 5.25rem);
          line-height: 0.86;
          letter-spacing: -0.07em;
          font-weight: 600;
        }

        .heroLead {
          margin: 16px 0 0;
          max-width: 610px;
          color: #563936;
          font-size: 0.98rem;
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
          background: rgba(255, 250, 247, 0.88);
          color: #72443d;
          font-size: 0.76rem;
          line-height: 1.25;
          font-weight: 850;
          border: 1px solid rgba(166, 76, 80, 0.09);
        }

        .includedList span::before {
          content: "✓";
          display: grid;
          place-items: center;
          width: 21px;
          height: 21px;
          border-radius: 999px;
          background: #a64c50;
          color: #fff;
          font-size: 0.72rem;
          font-weight: 950;
          flex: 0 0 auto;
        }

        .modelCard {
          position: relative;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 132px;
          align-items: end;
          gap: 10px;
          min-height: 195px;
          border-radius: 24px;
          padding: 15px 12px 0 15px;
          background:
            radial-gradient(circle at 74% 16%, rgba(255, 255, 255, 0.72), transparent 36%),
            radial-gradient(circle at 52% 100%, rgba(216, 111, 79, 0.24), transparent 42%),
            linear-gradient(135deg, #fff0e7, #f5cdbc);
          border: 1px solid rgba(166, 76, 80, 0.13);
          box-shadow: 0 18px 42px rgba(143, 48, 72, 0.13);
        }

        .modelText span {
          display: inline-flex;
          margin-bottom: 6px;
          color: #a64c50;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .modelText strong {
          display: block;
          max-width: 220px;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.56rem;
          line-height: 0.94;
          letter-spacing: -0.05em;
          font-weight: 500;
        }

        .modelText small {
          display: block;
          max-width: 210px;
          margin-top: 8px;
          color: #704740;
          font-size: 0.73rem;
          line-height: 1.35;
          font-weight: 800;
        }

        .modelImageBox {
          position: relative;
          display: grid;
          place-items: end center;
          min-height: 176px;
        }

        .modelImageBox img {
          position: relative;
          z-index: 1;
          width: 145px;
          max-height: 196px;
          object-fit: contain;
          object-position: center bottom;
          display: block;
          filter: drop-shadow(0 24px 28px rgba(35, 8, 10, 0.2));
        }

        .paymentCard {
          border-radius: 30px;
          padding: 18px;
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
          font-size: 0.68rem;
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
          font-size: clamp(2rem, 8vw, 2.65rem);
          line-height: 0.95;
          letter-spacing: -0.055em;
          font-weight: 500;
        }

        .paymentHeader p {
          margin: 9px 0 0;
          color: #67443e;
          font-size: 0.86rem;
          line-height: 1.45;
        }

        .choiceBlock {
          display: grid;
          gap: 9px;
          margin-top: 14px;
        }

        .blockLabel {
          color: #3a1b1a;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .planGrid,
        .paymentGrid {
          display: grid;
          gap: 9px;
        }

        .planCard,
        .methodCard {
          width: 100%;
          border: 1px solid rgba(166, 76, 80, 0.14);
          border-radius: 18px;
          background: #fffaf7;
          color: inherit;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .planCard {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 8px 12px;
          padding: 13px;
        }

        .planCard strong,
        .methodCard strong {
          display: block;
          color: #351817;
          font-size: 0.95rem;
          font-weight: 950;
        }

        .planCard small,
        .methodCard small {
          display: block;
          margin-top: 3px;
          color: #704740;
          font-size: 0.72rem;
          font-weight: 760;
        }

        .planCard b {
          color: #351817;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.45rem;
          line-height: 1;
        }

        .planCard p {
          grid-column: 1 / -1;
          margin: 0;
          color: #704740;
          font-size: 0.74rem;
          line-height: 1.34;
          font-weight: 740;
        }

        .methodCard {
          padding: 13px;
        }

        .planCard:hover,
        .methodCard:hover,
        .planCard.isSelected,
        .methodCard.isSelected {
          transform: translateY(-1px);
          border-color: rgba(166, 76, 80, 0.46);
          box-shadow: 0 14px 28px rgba(143, 48, 72, 0.12);
          background:
            radial-gradient(circle at 16% 12%, rgba(255, 255, 255, 0.72), transparent 38%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
        }

        .paymentGrid {
          grid-template-columns: 1fr 1fr;
        }

        .summaryBox {
          display: grid;
          gap: 8px;
          margin-top: 14px;
          padding: 14px;
          border-radius: 22px;
          background:
            radial-gradient(circle at 12% 18%, rgba(255, 255, 255, 0.78), transparent 35%),
            linear-gradient(135deg, #fff0e7, #f7d6c8);
          border: 1px solid rgba(166, 76, 80, 0.16);
        }

        .summaryBox > span {
          color: #a64c50;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .summaryTop {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .summaryTop strong {
          color: #351817;
          font-size: 0.98rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .summaryTop b {
          color: #351817;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.8rem;
          line-height: 1;
          white-space: nowrap;
        }

        .summaryBox p {
          margin: 0;
          color: #704740;
          font-size: 0.76rem;
          line-height: 1.4;
          font-weight: 750;
        }

        .primaryButton {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 18px;
          margin-top: 14px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #ffffff;
          font-family: "Montserrat", Arial, sans-serif;
          font-size: 0.94rem;
          font-weight: 950;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 18px 38px rgba(143, 48, 72, 0.34);
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .primaryButton span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .primaryButton:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
        }

        .safeNote {
          margin: 12px 0 0;
          text-align: center;
          color: #86534b;
          font-size: 0.72rem;
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

        @media (min-width: 620px) {
          .checkoutPage {
            padding: 22px;
          }

          .checkoutShell {
            gap: 18px;
          }

          .heroCard,
          .paymentCard {
            border-radius: 36px;
            padding: 28px;
          }

          .includedList {
            grid-template-columns: 1fr 1fr;
          }

          .planGrid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 980px) {
          .checkoutPage {
            padding: 32px;
          }

          .checkoutShell {
            min-height: calc(100vh - 64px);
            grid-template-columns: minmax(0, 1fr) 390px;
            align-items: start;
            gap: 24px;
          }

          .heroCard {
            grid-template-columns: minmax(0, 1fr) 265px;
            align-items: stretch;
            min-height: 500px;
            padding: 38px;
          }

          .paymentCard {
            position: sticky;
            top: 24px;
            padding: 24px;
          }

          .heroCard h1 {
            font-size: clamp(4.2rem, 6vw, 5.3rem);
            max-width: 680px;
          }

          .heroLead {
            font-size: 1.04rem;
          }

          .modelCard {
            grid-template-columns: 1fr;
            align-content: space-between;
            min-height: 100%;
            padding: 18px 18px 0;
          }

          .modelImageBox {
            min-height: 230px;
          }

          .modelImageBox img {
            width: 220px;
            max-height: 285px;
          }
        }

        @media (min-width: 1220px) {
          .checkoutShell {
            width: min(1280px, 100%);
            grid-template-columns: minmax(0, 1fr) 410px;
          }

          .heroCard {
            grid-template-columns: minmax(0, 1fr) 315px;
            min-height: 540px;
            padding: 42px;
          }

          .heroCard h1 {
            font-size: clamp(4.8rem, 6vw, 6.15rem);
            max-width: 760px;
          }

          .modelImageBox img {
            width: 250px;
            max-height: 320px;
          }
        }

        @media (max-width: 380px) {
          .heroCard h1 {
            font-size: 2.75rem;
          }

          .modelCard {
            grid-template-columns: 1fr 110px;
          }

          .modelImageBox img {
            width: 124px;
          }

          .summaryTop {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}