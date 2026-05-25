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
    imagem: "/pix197.jpeg",
    codigo:
      "00020101021226760014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0228Imersao- Gestacao sem filtro5204000053039865406197.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCTZ0NCVL4utMwEIwa1KznP6304523E",
  },
  casal: {
    imagem: "/pix297.jpeg",
    codigo:
      "00020101021226700014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0222Pagamento lizianascime5204000053039865406297.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCZUgc8SO3XQC3OvOamoRRm6304AA8C",
  },
};

const planos = {
  individual: {
    id: "individual",
    nome: "Individual",
    valor: "R$ 197",
    participantes: "1 participante",
    resumo: "Para participar individualmente da imersão.",
  },
  casal: {
    id: "casal",
    nome: "Casal",
    valor: "R$ 297",
    participantes: "2 participantes",
    resumo: "Para viver essa experiência junto com o companheiro.",
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

const destaques = [
  "Muito acolhimento",
  "Coffee break especial",
  "Exercícios para o trabalho de parto",
  "Preparação para gestação, parto e pós-parto",
];

const beneficios = [
  "Ambiente íntimo e seguro",
  "Apenas 10 vagas",
  "Vivência prática e acolhedora",
];

export default function PagamentoImersao() {
  const [plano, setPlano] = useState("individual");
  const [metodoPagamento, setMetodoPagamento] = useState("pix");
  const [editandoEscolha, setEditandoEscolha] = useState(false);
  const [pixCopiado, setPixCopiado] = useState(false);
  const [erro, setErro] = useState("");

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

  function irParaCartao() {
    const linkCartao = CARD_LINKS[plano];

    if (!linkCartao) {
      setErro("O link do cartão ainda não foi configurado.");
      return;
    }

    window.location.href = linkCartao;
  }

  function alterarPlano(value) {
    setPlano(value);
    setPixCopiado(false);
    setErro("");
  }

  function alterarMetodo(value) {
    setMetodoPagamento(value);
    setPixCopiado(false);
    setErro("");
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

          <section className="paymentCard" id="pagamento">
            <div className="paymentHeader">
              <span>Pagamento</span>
              <h2>Escolha como garantir sua vaga</h2>
              <p>
                A opção inicial é Individual no Pix. Para alterar, use o botão
                abaixo.
              </p>
            </div>

            <div className="choiceBox">
              <div className="choiceTop">
                <div>
                  <span>Sua escolha</span>
                  <strong>
                    {planoSelecionado.nome} no {metodoSelecionado.nome}
                  </strong>
                  <small>
                    {planoSelecionado.participantes} · {metodoSelecionado.detalhe}
                  </small>
                </div>

                <b>{isCartao ? `${planoSelecionado.valor}+` : planoSelecionado.valor}</b>
              </div>

              {!editandoEscolha && (
                <button
                  type="button"
                  className="ghostButton"
                  onClick={() => setEditandoEscolha(true)}
                >
                  Alterar opção
                </button>
              )}

              {editandoEscolha && (
                <div className="choiceEditor">
                  <label>
                    Vaga
                    <select
                      value={plano}
                      onChange={(event) => alterarPlano(event.target.value)}
                    >
                      <option value="individual">Individual — R$ 197</option>
                      <option value="casal">Casal — R$ 297</option>
                    </select>
                  </label>

                  <label>
                    Forma de pagamento
                    <select
                      value={metodoPagamento}
                      onChange={(event) => alterarMetodo(event.target.value)}
                    >
                      <option value="pix">Pix sem acréscimo</option>
                      <option value="cartao">Cartão com acréscimo</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    className="primaryMiniButton"
                    onClick={() => setEditandoEscolha(false)}
                  >
                    Aplicar escolha
                  </button>
                </div>
              )}
            </div>

            {isPix && (
              <div className="pixBox">
                <div className="pixHeader">
                  <span>Pagamento via Pix</span>
                  <strong>
                    {planoSelecionado.nome} — {planoSelecionado.valor}
                  </strong>
                  <p>
                    Escaneie o QR Code ou copie o código Pix. Depois, envie o
                    comprovante no grupo para confirmação da vaga.
                  </p>
                </div>

                <div className="qrFrame">
                  <img
                    src={dadosPix.imagem}
                    alt={`QR Code Pix ${planoSelecionado.nome}`}
                  />
                </div>

                <div className="pixCopyArea">
                  <label htmlFor="pixCopiaCola">Pix copia e cola</label>

                  <textarea
                    id="pixCopiaCola"
                    value={dadosPix.codigo}
                    readOnly
                    onFocus={(event) => event.target.select()}
                  />

                  <button
                    type="button"
                    className="primaryButton"
                    onClick={copiarPix}
                  >
                    {pixCopiado ? "Pix copiado!" : "Copiar código Pix"}
                    <span>↗</span>
                  </button>
                </div>

                <p className="proofNote">
                  Importante: sua vaga será confirmada após o envio do comprovante
                  no grupo.
                </p>
              </div>
            )}

            {isCartao && (
              <div className="cardBox">
                <span>Pagamento no cartão</span>
                <strong>
                  {planoSelecionado.nome} — {planoSelecionado.valor} + taxas
                </strong>
                <p>
                  O pagamento será feito pela InfinitePay. O cartão possui
                  acréscimo referente às taxas da operadora, exibido antes da
                  confirmação.
                </p>

                <button type="button" className="primaryButton" onClick={irParaCartao}>
                  Ir para pagamento no cartão
                  <span>↗</span>
                </button>
              </div>
            )}

            {erro && <p className="errorMessage">{erro}</p>}

            <p className="safeNote">
              Se escolher Pix, envie o comprovante no grupo. Se escolher cartão,
              você será direcionada para a InfinitePay.
            </p>
          </section>

          <section className="benefitGrid" aria-label="Destaques da imersão">
            {beneficios.map((beneficio) => (
              <article key={beneficio}>
                <span>✓</span>
                <p>{beneficio}</p>
              </article>
            ))}
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
          width: min(1180px, 100%);
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: grid;
          gap: 14px;
          padding: 10px 0 22px;
        }

        .heroCard,
        .paymentCard,
        .benefitGrid article {
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

        .heroContent {
          min-width: 0;
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

        .includedList span::before,
        .benefitGrid article span {
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

        .modelText {
          position: relative;
          z-index: 2;
          align-self: start;
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

        .modelImageBox::before {
          content: "";
          position: absolute;
          right: -8px;
          bottom: 8px;
          width: 150px;
          height: 150px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.5);
          filter: blur(18px);
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

        .paymentHeader span,
        .pixHeader span,
        .cardBox span {
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

        .choiceBox {
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

        .choiceTop {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .choiceTop span {
          display: block;
          margin-bottom: 5px;
          color: #a64c50;
          font-size: 0.64rem;
          font-weight: 950;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .choiceTop strong {
          display: block;
          color: #351817;
          font-size: 1rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .choiceTop small {
          display: block;
          margin-top: 4px;
          color: #704740;
          font-size: 0.74rem;
          line-height: 1.35;
          font-weight: 750;
        }

        .choiceTop b {
          text-align: right;
          color: #351817;
          font-family: "Libre Bodoni", Georgia, serif;
          font-size: 1.85rem;
          line-height: 0.95;
          letter-spacing: -0.04em;
          font-weight: 600;
          white-space: nowrap;
        }

        .ghostButton,
        .primaryMiniButton,
        .primaryButton {
          width: 100%;
          border: 0;
          font-family: "Montserrat", Arial, sans-serif;
          cursor: pointer;
          transition: transform 0.18s ease, filter 0.18s ease;
        }

        .ghostButton {
          min-height: 44px;
          border-radius: 15px;
          padding: 12px 14px;
          background: rgba(255, 250, 247, 0.82);
          color: #8f3048;
          border: 1px solid rgba(143, 48, 72, 0.13);
          font-size: 0.84rem;
          font-weight: 950;
        }

        .choiceEditor {
          display: grid;
          gap: 10px;
        }

        .choiceEditor label {
          display: grid;
          gap: 6px;
          color: #3a1b1a;
          font-size: 0.79rem;
          font-weight: 850;
        }

        .choiceEditor select {
          width: 100%;
          min-height: 48px;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #fffaf7;
          padding: 13px 14px;
          color: #2d1717;
          font: inherit;
          outline: none;
        }

        .primaryMiniButton {
          min-height: 44px;
          border-radius: 15px;
          padding: 12px 14px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #ffffff;
          font-size: 0.84rem;
          font-weight: 950;
          box-shadow: 0 14px 28px rgba(143, 48, 72, 0.24);
        }

        .pixBox,
        .cardBox {
          display: grid;
          gap: 13px;
          margin-top: 12px;
          padding: 14px;
          border-radius: 22px;
          background: #fffaf7;
          border: 1px solid rgba(166, 76, 80, 0.14);
        }

        .pixHeader,
        .cardBox {
          min-width: 0;
        }

        .pixHeader strong,
        .cardBox strong {
          display: block;
          color: #351817;
          font-size: 0.96rem;
          line-height: 1.25;
          font-weight: 950;
        }

        .pixHeader p,
        .cardBox p {
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
          width: min(220px, 100%);
          height: auto;
          display: block;
          border-radius: 12px;
        }

        .pixCopyArea {
          display: grid;
          gap: 8px;
        }

        .pixCopyArea label {
          color: #3a1b1a;
          font-size: 0.78rem;
          font-weight: 900;
        }

        .pixCopyArea textarea {
          width: 100%;
          min-height: 78px;
          resize: vertical;
          border: 1px solid rgba(166, 76, 80, 0.16);
          border-radius: 16px;
          background: #ffffff;
          padding: 12px;
          color: #2d1717;
          font: inherit;
          font-size: 0.7rem;
          line-height: 1.38;
          outline: none;
        }

        .primaryButton {
          min-height: 56px;
          border-radius: 18px;
          padding: 15px 16px;
          background: linear-gradient(135deg, #8f3048, #d86f4f);
          color: #ffffff;
          font-size: 0.94rem;
          font-weight: 950;
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
          flex: 0 0 auto;
        }

        .ghostButton:hover,
        .primaryMiniButton:hover,
        .primaryButton:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
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
          margin: 12px 0 0;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(143, 48, 72, 0.09);
          color: #8f3048;
          font-size: 0.78rem;
          line-height: 1.35;
          font-weight: 850;
        }

        .safeNote {
          margin: 12px 0 0;
          text-align: center;
          color: #86534b;
          font-size: 0.72rem;
          line-height: 1.35;
        }

        .benefitGrid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .benefitGrid article {
          display: flex;
          align-items: center;
          gap: 10px;
          border-radius: 20px;
          padding: 14px;
        }

        .benefitGrid article p {
          margin: 0;
          color: #60413b;
          font-size: 0.82rem;
          line-height: 1.3;
          font-weight: 850;
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

          .benefitGrid {
            grid-template-columns: repeat(3, 1fr);
          }

          .benefitGrid article {
            align-items: flex-start;
            flex-direction: column;
            min-height: 112px;
          }

          .choiceEditor {
            grid-template-columns: 1fr 1fr;
          }

          .choiceEditor .primaryMiniButton {
            grid-column: 1 / -1;
          }
        }

        @media (min-width: 980px) {
          .checkoutPage {
            padding: 32px;
          }

          .checkoutShell {
            min-height: calc(100vh - 64px);
            grid-template-columns: minmax(0, 1fr) 390px;
            grid-template-areas:
              "hero payment"
              "benefits payment";
            align-items: start;
            gap: 24px;
          }

          .heroCard {
            grid-area: hero;
            grid-template-columns: minmax(0, 1fr) 265px;
            align-items: stretch;
            min-height: 470px;
            padding: 38px;
          }

          .paymentCard {
            grid-area: payment;
            position: sticky;
            top: 24px;
            padding: 24px;
          }

          .benefitGrid {
            grid-area: benefits;
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

          .modelText strong {
            font-size: 1.84rem;
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
            min-height: 520px;
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

          .modelText strong {
            font-size: 2.05rem;
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

          .choiceTop {
            flex-direction: column;
          }

          .choiceTop b {
            text-align: left;
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