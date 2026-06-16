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
    </>
  );
}