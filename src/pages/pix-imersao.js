import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

const PIX_PAYMENTS = {
  individual: {
    nome: "Individual",
    valor: "R$ 197",
    imagem: "/pix197.jpeg",
    codigo:
      "00020101021226760014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0228Imersao- Gestacao sem filtro5204000053039865406197.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCTZ0NCVL4utMwEIwa1KznP6304523E",
  },
  casal: {
    nome: "Casal",
    valor: "R$ 297",
    imagem: "/pix297.jpeg",
    codigo:
      "00020101021226700014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0222Pagamento lizianascime5204000053039865406297.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCZUgc8SO3XQC3OvOamoRRm6304AA8C",
  },
};

export default function PixImersao() {
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");

  const planoQuery = router.query.plano === "casal" ? "casal" : "individual";
  const pagamento = PIX_PAYMENTS[planoQuery];

  async function copiarPix() {
    setErro("");

    try {
      await navigator.clipboard.writeText(pagamento.codigo);
      setCopiado(true);

      setTimeout(() => {
        setCopiado(false);
      }, 2200);
    } catch (error) {
      setErro(
        "Não foi possível copiar automaticamente. Selecione o código Pix e copie manualmente."
      );
    }
  }

  return (
    <>
      <Head>
        <title>Pix | Imersão Gestação Sem Filtro</title>
        <meta
          name="description"
          content="Pagamento via Pix da Imersão Gestação Sem Filtro."
        />
      </Head>

      <main className="pixPage">
        <div className="bgWord">PIX</div>
        <div className="orb orbOne" />
        <div className="orb orbTwo" />

        <section className="pixShell">
          <div className="pixIntro">
            <a href="/pagamento-imersao" className="backLink">
              ← Voltar para opções
            </a>

            <div className="badge">
              <span />
              Pagamento via Pix
            </div>

            <h1>Finalize sua reserva</h1>

            <p>
              Escaneie o QR Code ou copie o código Pix abaixo. Depois, envie o
              comprovante no grupo para confirmação da sua vaga.
            </p>

            <div className="summaryBox">
              <span>Resumo</span>

              <div>
                <strong>{pagamento.nome}</strong>
                <b>{pagamento.valor}</b>
              </div>

              <small>Pix sem acréscimo</small>
            </div>
          </div>

          <div className="pixCard">
            <div className="qrFrame">
              <img
                src={pagamento.imagem}
                alt={`QR Code Pix ${pagamento.nome} ${pagamento.valor}`}
              />
            </div>

            <div className="copyArea">
              <label htmlFor="pixCopiaCola">Pix copia e cola</label>

              <textarea
                id="pixCopiaCola"
                value={pagamento.codigo}
                readOnly
                onFocus={(event) => event.target.select()}
              />

              <button type="button" className="primaryButton" onClick={copiarPix}>
                {copiado ? "Pix copiado!" : "Copiar código Pix"}
                <span>↗</span>
              </button>
            </div>

            {erro && <p className="errorMessage">{erro}</p>}

            <p className="proofNote">
              Importante: sua vaga será confirmada após o envio do comprovante no grupo.
            </p>
          </div>
        </section>
      </main>

      <style jsx global>{`
        .pixPage,
        .pixPage * {
          box-sizing: border-box;
        }

        .pixPage {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          padding: 14px;
          color: #2d1717;
          font-family: "Montserrat", Arial, sans-serif;
          background:
            radial-gradient(circle at 14% 12%, rgba(255, 210, 184, 0.24), transparent 30%),
            radial-gradient(circle at 86% 20%, rgba(187, 76, 91, 0.34), transparent 34%),
            linear-gradient(135deg, #321217 0%, #5a2328 46%, #9a5545 100%);
        }

        .bgWord {
          position: absolute;
          top: 10px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
          color: rgba(255, 235, 224, 0.075);
          font-size: clamp(6rem, 26vw, 18rem);
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
          width: 320px;
          height: 320px;
          left: -130px;
          bottom: 18%;
          background: rgba(255, 181, 137, 0.42);
        }

        .orbTwo {
          width: 360px;
          height: 360px;
          right: -150px;
          top: 16%;
          background: rgba(129, 42, 63, 0.52);
        }

        .pixShell {
          width: min(980px, 100%);
          min-height: calc(100vh - 28px);
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: grid;
          gap: 14px;
          align-content: center;
        }

        .pixIntro,
        .pixCard {
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.97), rgba(255, 247, 242, 0.99)),
            #fff8f4;
          border: 1px solid rgba(255, 255, 255, 0.74);
          box-shadow:
            0 28px 70px rgba(24, 6, 8, 0.24),
            inset 0 0 0 1px rgba(255, 255, 255, 0.68);
          border-radius: 30px;
          padding: 18px;
        }

        .backLink {
          display: inline-flex;
          margin-bottom: 14px;
          color: #8f3048;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 900;
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
        }

        .pixIntro h1 {
          margin: 14px 0 0;
          color: #291211;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: clamp(2.6rem, 13vw, 5.3rem);
          line-height: 0.9;
          letter-spacing: -0.065em;
          font-weight: 600;
        }

        .pixIntro p {
          margin: 14px 0 0;
          color: #563936;
          font-size: 0.96rem;
          line-height: 1.5;
          font-weight: 560;
        }

        .summaryBox {
          display: grid;
          gap: 8px;
          margin-top: 16px;
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

        .summaryBox div {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .summaryBox strong {
          color: #351817;
          font-size: 1rem;
          font-weight: 950;
        }

        .summaryBox b {
          color: #351817;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.9rem;
          line-height: 1;
        }

        .summaryBox small {
          color: #704740;
          font-size: 0.76rem;
          font-weight: 800;
        }

        .pixCard {
          display: grid;
          gap: 14px;
        }

        .qrFrame {
          display: grid;
          place-items: center;
          padding: 12px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid rgba(166, 76, 80, 0.1);
        }

        .qrFrame img {
          width: min(330px, 100%);
          height: auto;
          display: block;
          border-radius: 14px;
        }

        .copyArea {
          display: grid;
          gap: 8px;
        }

        .copyArea label {
          color: #3a1b1a;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .copyArea textarea {
          width: 100%;
          min-height: 96px;
          resize: vertical;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #ffffff;
          padding: 12px;
          color: #2d1717;
          font: inherit;
          font-size: 0.72rem;
          line-height: 1.38;
          outline: none;
        }

        .primaryButton {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 18px;
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
        }

        .primaryButton span {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
        }

        .proofNote {
          margin: 0;
          padding: 10px 12px;
          border-radius: 15px;
          background: rgba(143, 48, 72, 0.08);
          color: #7f293f;
          font-size: 0.75rem;
          line-height: 1.38;
          font-weight: 900;
          text-align: center;
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

        @media (min-width: 760px) {
          .pixPage {
            padding: 28px;
          }

          .pixShell {
            min-height: calc(100vh - 56px);
            grid-template-columns: minmax(0, 1fr) 420px;
            align-items: center;
            gap: 22px;
          }

          .pixIntro,
          .pixCard {
            border-radius: 36px;
            padding: 28px;
          }
        }

        @media (min-width: 1020px) {
          .pixShell {
            grid-template-columns: minmax(0, 1fr) 440px;
          }

          .pixIntro {
            padding: 42px;
          }

          .pixIntro h1 {
            font-size: clamp(4.5rem, 6vw, 6rem);
          }
        }
      `}</style>
    </>
  );
}