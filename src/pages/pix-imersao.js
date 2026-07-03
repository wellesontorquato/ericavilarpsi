"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

// Deixamos apenas o Individual com o valor de R$ 97
// ATENÇÃO: Lembre-se de gerar e trocar a 'imagem' e o 'codigo' para o valor exato de R$ 97!
const PAGAMENTO = {
  nome: "Ingresso Individual",
  valor: "R$ 97,00",
  imagem: "/pix97.jpeg", // Altere para o QR Code de R$ 97
  codigo:
    "00020101021226700014BR.GOV.BCB.PIX0122liz.rafaela@icloud.com0222Pagamento lizianascime520400005303986540597.005802BR5925LIZIA RAFAELA CORDEIRO DO6006MACEIO62290525QRCCDn8mpfYUusbmekQpcFRu46304E527", // Altere para o copia e cola de R$ 97
};

export default function PixImersao() {
  const router = useRouter();
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");
  const [autorizado, setAutorizado] = useState(null); // null = carregando, false = erro, true = liberado

  useEffect(() => {
    // Verifica se a pessoa veio da página de pagamento
    const veioDoPagamento = sessionStorage.getItem("acessoPixLiberado");
    
    if (veioDoPagamento === "true") {
      setAutorizado(true);
      // Opcional: limpar o acesso após entrar para que um F5 bloqueie a página novamente
      // sessionStorage.removeItem("acessoPixLiberado"); 
    } else {
      setAutorizado(false);
    }
  }, []);

  async function copiarPix() {
    setErro("");

    try {
      await navigator.clipboard.writeText(PAGAMENTO.codigo);
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

  // Enquanto verifica a autorização, não renderiza nada (evita piscar a tela)
  if (autorizado === null) return null;

  // Tela de erro caso o acesso seja direto (sem passar pela página de opções)
  if (autorizado === false) {
    return (
      <div className="lp-page erro-container">
        <Head>
          <title>Acesso Negado | Imersão</title>
        </Head>
        <div className="erro-box">
          <h1>⚠️ Acesso Indisponível</h1>
          <p>Você tentou acessar a página de pagamento diretamente.</p>
          <p>Por favor, volte e inicie sua compra selecionando a forma de pagamento.</p>
          <button onClick={() => router.push("/")} className="lp-btn">
            Voltar ao Início
          </button>
        </div>
        <style dangerouslySetInnerHTML={{ __html: stylesGlobais }} />
      </div>
    );
  }

  // Tela principal do PIX (Liberada)
  return (
    <>
      <Head>
        <title>Pagamento Pix | Imersão Gestação Sem Filtro</title>
        <meta
          name="description"
          content="Finalize seu pagamento via Pix para a Imersão Gestação Sem Filtro."
        />
      </Head>

      <style dangerouslySetInnerHTML={{ __html: stylesGlobais }} />

      <main className="lp-page pix-wrapper">
        <section className="lp-container pix-container">
          
          <div className="pix-header">
            <button onClick={() => router.push("/pagamento-imersao")} className="back-link">
              ← Voltar para opções de pagamento
            </button>
            <div className="badge">Pagamento via Pix</div>
            <h1 className="pix-title">Finalize sua reserva</h1>
            <p className="pix-subtitle">
              Escaneie o QR Code ou copie o código Pix abaixo. <strong>Sua vaga só estará garantida após o envio do comprovante.</strong>
            </p>
          </div>

          <div className="pix-content">
            {/* Resumo do Pedido */}
            <div className="summary-box">
              <span className="summary-label">Resumo do Pedido</span>
              <div className="summary-details">
                <strong>{PAGAMENTO.nome}</strong>
                <b className="lp-text-red">{PAGAMENTO.valor}</b>
              </div>
            </div>

            {/* QR Code */}
            <div className="qr-frame">
              <img
                src={PAGAMENTO.imagem}
                alt={`QR Code Pix ${PAGAMENTO.valor}`}
              />
            </div>

            {/* Copia e Cola */}
            <div className="copy-area">
              <label htmlFor="pixCopiaCola">Pix Copia e Cola</label>
              <textarea
                id="pixCopiaCola"
                value={PAGAMENTO.codigo}
                readOnly
                onFocus={(event) => event.target.select()}
              />

              <button type="button" className="lp-btn copy-btn" onClick={copiarPix}>
                {copiado ? "✔ PIX COPIADO!" : "COPIAR CÓDIGO PIX"}
              </button>
            </div>

            {erro && <p className="error-message">{erro}</p>}

            <div className="proof-note">
              <p>📸 <strong>Atenção:</strong> Após o pagamento, não esqueça de enviar o comprovante no nosso grupo de WhatsApp para confirmar sua inscrição.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

// Estilos padronizados com a Landing Page
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

  body {
    margin: 0;
    padding: 0;
    background-color: var(--lp-bg-light);
  }

  .lp-page {
    font-family: var(--lp-font-sans);
    color: var(--lp-text-dark);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .lp-text-red { color: var(--lp-primary); }

  .lp-btn {
    display: inline-flex; align-items: center; justify-content: center;
    background-color: var(--lp-primary); color: var(--lp-white);
    text-decoration: none; font-weight: 800; padding: 16px 32px;
    border-radius: 50px; text-transform: uppercase; font-size: 1rem;
    letter-spacing: 0.05em; transition: var(--lp-transition);
    border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(138, 37, 34, 0.3);
    width: 100%;
  }
  .lp-btn:hover {
    background-color: var(--lp-primary-hover);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(138, 37, 34, 0.5);
  }

  /* Container de Erro */
  .erro-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: var(--lp-bg-light);
  }
  .erro-box {
    background: var(--lp-white);
    padding: 40px;
    border-radius: 20px;
    text-align: center;
    max-width: 500px;
    box-shadow: 0 10px 30px rgba(138, 37, 34, 0.1);
    border: 1px solid var(--lp-primary-border);
  }
  .erro-box h1 {
    color: var(--lp-primary);
    margin-bottom: 16px;
    font-size: 2rem;
    font-weight: 900;
  }
  .erro-box p {
    color: var(--lp-text-muted);
    margin-bottom: 24px;
    font-size: 1.1rem;
  }

  /* Layout PIX */
  .pix-wrapper {
    min-height: 100vh;
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pix-container {
    background: var(--lp-white);
    max-width: 600px;
    width: 100%;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 20px 50px rgba(138,37,34,0.08);
    border: 1px solid var(--lp-primary-border);
  }

  .pix-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .back-link {
    background: none; border: none; cursor: pointer;
    color: var(--lp-primary); font-weight: 700;
    font-size: 0.9rem; margin-bottom: 24px;
    display: inline-block; text-decoration: underline;
    font-family: inherit;
  }

  .badge {
    background: #fce8e8;
    color: var(--lp-primary);
    padding: 6px 16px;
    border-radius: 50px;
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 16px;
    letter-spacing: 1px;
  }

  .pix-title {
    font-size: 2.2rem;
    font-weight: 900;
    margin: 0 0 16px 0;
    color: var(--lp-text-dark);
  }

  .pix-subtitle {
    color: var(--lp-text-muted);
    font-size: 1.05rem;
    margin: 0;
  }

  .pix-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .summary-box {
    background: #f9f9f9;
    padding: 20px;
    border-radius: 16px;
    border: 1px dashed var(--lp-primary-border);
  }

  .summary-label {
    display: block;
    font-size: 0.8rem;
    color: var(--lp-text-muted);
    text-transform: uppercase;
    font-weight: 800;
    margin-bottom: 8px;
  }

  .summary-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
  }

  .summary-details strong {
    color: var(--lp-text-dark);
  }

  .summary-details b {
    font-size: 1.8rem;
    font-weight: 900;
  }

  .qr-frame {
    display: flex;
    justify-content: center;
    background: #fff;
    padding: 20px;
    border-radius: 20px;
    border: 1px solid #eee;
    box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  }

  .qr-frame img {
    width: 100%;
    max-width: 280px;
    border-radius: 12px;
  }

  .copy-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .copy-area label {
    font-weight: 800;
    color: var(--lp-text-dark);
    font-size: 0.95rem;
  }

  .copy-area textarea {
    width: 100%;
    box-sizing: border-box;
    height: 80px;
    resize: none;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 12px;
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--lp-text-muted);
    background: #fcfcfc;
    outline: none;
  }

  .copy-area textarea:focus {
    border-color: var(--lp-primary);
  }

  .copy-btn {
    margin-top: 8px;
  }

  .error-message {
    color: #e74c3c;
    background: #fdf0ed;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    margin: 0;
  }

  .proof-note {
    background: #eaf8ec;
    border: 1px solid #bfe4c6;
    color: #27ae60;
    padding: 16px;
    border-radius: 12px;
    font-size: 0.95rem;
    text-align: center;
  }
  .proof-note p { margin: 0; }

  @media (max-width: 600px) {
    .pix-container {
      padding: 24px;
    }
    .pix-title {
      font-size: 1.8rem;
    }
    .summary-details b {
      font-size: 1.5rem;
    }
  }
`;