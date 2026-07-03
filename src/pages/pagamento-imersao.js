"use client";

import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

const PLANO = {
  nome: "Ingresso Individual",
  valor: "R$ 97,00",
  linkCartao: "https://link.infinitepay.io/lizianascimento/VC1DLUMtSQ-Flmn7DHNFM-97,00",
  participantes: "1 participante",
  texto: "Acesso completo à Imersão Presencial Gestação Sem Filtro.",
};

const DESTAQUES = [
  "Acolhimento humanizado",
  "Coffee break especial incluso",
  "Preparo físico para o parto",
  "Preparo mental e emocional",
  "Material prático de apoio"
];

export default function PagamentoImersao() {
  const router = useRouter();
  const [metodoPagamento, setMetodoPagamento] = useState("pix");

  const isPix = metodoPagamento === "pix";
  const isCartao = metodoPagamento === "cartao";

  function continuarPagamento() {
    if (isCartao) {
      // Redireciona para o link da InfinitePay
      window.location.href = PLANO.linkCartao;
      return;
    }

    // Libera o acesso para a página do PIX usando sessionStorage
    sessionStorage.setItem("acessoPixLiberado", "true");
    
    // Redireciona para a página PIX
    router.push("/pix-imersao");
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

      <style dangerouslySetInnerHTML={{ __html: stylesGlobais }} />

      <main className="lp-page checkout-wrapper">
        <div className="lp-container">
          
          <div className="checkout-header">
            <button onClick={() => router.push("/")} className="back-link">
              ← Voltar para a página principal
            </button>
            <h1 className="checkout-title">Finalize sua inscrição</h1>
          </div>

          <div className="checkout-grid">
            
            {/* COLUNA ESQUERDA: INFORMAÇÕES DO EVENTO */}
            <div className="info-card">
              <div className="badge">Imersão Presencial</div>
              <h2>Gestação Sem Filtro</h2>
              <p className="info-lead">
                Uma experiência profunda, acolhedora e transformadora para viver a gestação com mais consciência, preparo e segurança.
              </p>
              
              <ul className="included-list">
                {DESTAQUES.map((item, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span> {item}
                  </li>
                ))}
              </ul>

              <div className="prof-box">
                <img
                  src="/modelos%20transparente.png"
                  alt="Erica Vilar e Lizia Nascimento"
                  className="prof-img"
                />
                <div className="prof-text">
                  <span>Com as especialistas</span>
                  <strong>Erica Vilar & Lizia Nascimento</strong>
                  <small>Psicologia, Fisioterapia e Doula</small>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: OPÇÕES DE PAGAMENTO */}
            <div className="payment-card">
              <h3>Pagamento</h3>
              
              {/* Resumo do Ingresso Fixo */}
              <div className="plan-selected">
                <span className="block-label">Ingresso Selecionado</span>
                <div className="plan-box">
                  <div>
                    <strong>{PLANO.nome}</strong>
                    <small>{PLANO.participantes}</small>
                  </div>
                  <b>{PLANO.valor}</b>
                </div>
                <p className="plan-desc">{PLANO.texto}</p>
              </div>

              {/* Escolha do Método */}
              <div className="method-selection">
                <span className="block-label">Forma de pagamento</span>
                <div className="method-grid">
                  <button
                    type="button"
                    className={`method-btn ${isPix ? "is-selected" : ""}`}
                    onClick={() => setMetodoPagamento("pix")}
                  >
                    <strong>Pix</strong>
                    <small>Aprovação imediata</small>
                  </button>

                  <button
                    type="button"
                    className={`method-btn ${isCartao ? "is-selected" : ""}`}
                    onClick={() => setMetodoPagamento("cartao")}
                  >
                    <strong>Cartão</strong>
                    <small>Parcelamento disponível</small>
                  </button>
                </div>
              </div>

              {/* Caixa de Resumo Final */}
              <div className="summary-box">
                <span className="block-label" style={{ color: "var(--lp-primary)" }}>Resumo</span>
                <div className="summary-top">
                  <strong>{PLANO.nome} no {isPix ? "Pix" : "Cartão"}</strong>
                  <b>{isCartao ? `${PLANO.valor}*` : PLANO.valor}</b>
                </div>
                <p className="summary-desc">
                  {isPix
                    ? "Ao continuar, você será direcionada para a página com o QR Code e código Pix Copia e Cola."
                    : "*Você será redirecionada para o ambiente seguro da InfinitePay. Taxas de parcelamento podem ser aplicadas."}
                </p>
              </div>

              <button type="button" className="lp-btn continue-btn" onClick={continuarPagamento}>
                {isPix ? "GERAR CÓDIGO PIX" : "IR PARA PAGAMENTO SEGURO"}
              </button>

              <p className="safe-note">
                🔒 Ambiente 100% seguro. Suas informações estão protegidas.
              </p>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}

// Estilos unificados com a Landing Page e página PIX
const stylesGlobais = `
  :root {
    --lp-primary: #8a2522;
    --lp-primary-hover: #6b1b19;
    --lp-primary-border: #fad1d1;
    --lp-text-dark: #2d2d2d;
    --lp-text-muted: #595959;
    --lp-bg-light: #fcf8f7;
    --lp-white: #ffffff;
    --lp-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    --lp-transition: all 0.3s ease;
  }

  body { margin: 0; padding: 0; background-color: var(--lp-bg-light); }

  .lp-page {
    font-family: var(--lp-font-sans); color: var(--lp-text-dark);
    line-height: 1.6; -webkit-font-smoothing: antialiased;
  }
  .lp-container { width: 100%; max-width: 1000px; margin: 0 auto; padding: 0 20px; }

  .checkout-wrapper { padding: 40px 0; min-height: 100vh; }

  .checkout-header { margin-bottom: 30px; }
  .back-link {
    background: none; border: none; cursor: pointer; color: var(--lp-primary);
    font-weight: 700; font-size: 0.9rem; margin-bottom: 16px;
    display: inline-block; text-decoration: underline; font-family: inherit;
  }
  .checkout-title {
    font-size: 2.5rem; font-weight: 900; color: var(--lp-text-dark); margin: 0;
  }

  .checkout-grid { display: grid; gap: 30px; grid-template-columns: 1fr; }

  /* CARDS GERAIS */
  .info-card, .payment-card {
    background: var(--lp-white); border-radius: 24px; padding: 30px;
    box-shadow: 0 10px 40px rgba(138, 37, 34, 0.05);
    border: 1px solid var(--lp-primary-border);
  }

  /* INFO CARD (ESQUERDA) */
  .badge {
    background: #fce8e8; color: var(--lp-primary); padding: 6px 16px;
    border-radius: 50px; font-size: 0.8rem; font-weight: 800;
    text-transform: uppercase; display: inline-block; margin-bottom: 16px;
  }
  .info-card h2 { font-size: 2rem; font-weight: 900; margin: 0 0 16px 0; }
  .info-lead { color: var(--lp-text-muted); font-size: 1.05rem; margin-bottom: 24px; }
  
  .included-list { list-style: none; padding: 0; margin: 0 0 30px 0; }
  .included-list li {
    display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
    background: #f9f9f9; padding: 12px 16px; border-radius: 12px;
    font-size: 0.95rem; font-weight: 600; color: var(--lp-text-dark);
  }
  .check-icon {
    background: var(--lp-primary); color: white; width: 20px; height: 20px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 50%; font-size: 0.7rem; font-weight: bold;
  }

  .prof-box {
    display: flex; align-items: center; gap: 20px;
    background: #fff5f5; padding: 20px; border-radius: 16px;
    border: 1px solid var(--lp-primary-border);
  }
  .prof-img { width: 80px; height: 80px; object-fit: cover; border-radius: 50%; background: #fad1d1; }
  .prof-text span { display: block; font-size: 0.8rem; color: var(--lp-primary); font-weight: 800; text-transform: uppercase; margin-bottom: 4px;}
  .prof-text strong { display: block; font-size: 1.1rem; color: var(--lp-text-dark); font-weight: 900; line-height: 1.2; }
  .prof-text small { color: var(--lp-text-muted); font-size: 0.85rem; }

  /* PAYMENT CARD (DIREITA) */
  .payment-card h3 { font-size: 1.5rem; font-weight: 900; margin: 0 0 24px 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 12px; }
  
  .block-label { display: block; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: var(--lp-text-muted); margin-bottom: 12px; }
  
  .plan-selected { margin-bottom: 24px; }
  .plan-box {
    display: flex; justify-content: space-between; align-items: center;
    background: var(--lp-white); border: 2px solid var(--lp-primary);
    padding: 16px 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(138, 37, 34, 0.08);
  }
  .plan-box strong { display: block; font-size: 1.1rem; color: var(--lp-primary); font-weight: 900; }
  .plan-box small { color: var(--lp-text-muted); font-size: 0.85rem; font-weight: 600; }
  .plan-box b { font-size: 1.8rem; font-weight: 900; color: var(--lp-text-dark); }
  .plan-desc { font-size: 0.85rem; color: var(--lp-text-muted); margin: 8px 0 0 4px; }

  .method-selection { margin-bottom: 24px; }
  .method-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .method-btn {
    background: var(--lp-white); border: 2px solid #e0e0e0; padding: 16px;
    border-radius: 16px; cursor: pointer; text-align: left; transition: var(--lp-transition);
    font-family: inherit;
  }
  .method-btn strong { display: block; font-size: 1rem; color: var(--lp-text-dark); font-weight: 900; }
  .method-btn small { color: var(--lp-text-muted); font-size: 0.8rem; display: block; margin-top: 4px; }
  .method-btn:hover { border-color: #fad1d1; }
  .method-btn.is-selected {
    border-color: var(--lp-primary); background: #fff5f5;
  }
  .method-btn.is-selected strong { color: var(--lp-primary); }

  .summary-box {
    background: #f9f9f9; padding: 20px; border-radius: 16px;
    border: 1px dashed var(--lp-primary-border); margin-bottom: 24px;
  }
  .summary-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .summary-top strong { font-size: 1rem; color: var(--lp-text-dark); }
  .summary-top b { font-size: 1.6rem; font-weight: 900; color: var(--lp-text-dark); }
  .summary-desc { margin: 0; font-size: 0.85rem; color: var(--lp-text-muted); line-height: 1.4; }

  .lp-btn {
    display: inline-flex; align-items: center; justify-content: center;
    background-color: var(--lp-primary); color: var(--lp-white);
    text-decoration: none; font-weight: 800; padding: 18px 32px;
    border-radius: 50px; text-transform: uppercase; font-size: 1rem;
    letter-spacing: 0.05em; transition: var(--lp-transition);
    border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(138, 37, 34, 0.3);
    width: 100%; font-family: inherit;
  }
  .lp-btn:hover {
    background-color: var(--lp-primary-hover); transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(138, 37, 34, 0.5);
  }

  .safe-note { text-align: center; font-size: 0.8rem; color: #888; margin-top: 16px; font-weight: 600; }

  @media (min-width: 850px) {
    .checkout-grid { grid-template-columns: 1fr 1fr; align-items: start; }
    .checkout-wrapper { padding: 60px 0; }
  }
`;