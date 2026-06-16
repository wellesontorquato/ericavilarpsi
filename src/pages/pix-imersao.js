import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import "@/styles/pix-imersao.css";

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
    </>
  );
}