import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function AdminAcesso() {
  const [identityReady, setIdentityReady] = useState(false);
  const [hasInviteToken, setHasInviteToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash || "";

    setHasInviteToken(
      hash.includes("invite_token") ||
        hash.includes("recovery_token") ||
        hash.includes("confirmation_token")
    );
  }, []);

  function handleOpenIdentity() {
    if (typeof window === "undefined" || !window.netlifyIdentity) {
      return;
    }

    window.netlifyIdentity.on("signup", () => {
      window.location.href = "/admin/";
    });

    window.netlifyIdentity.on("login", () => {
      window.location.href = "/admin/";
    });

    /*
      Importante:
      Quando existe invite_token na URL, o correto é chamar init().
      O próprio widget da Netlify lê o token e abre a tela "Complete your signup".
      Se chamarmos open() direto, ele abre a tela comum de login.
    */
    if (hasInviteToken) {
      window.netlifyIdentity.init();
      return;
    }

    window.netlifyIdentity.open();
  }

  return (
    <>
      <Head>
        <title>Acesso administrativo | Érica Vilar</title>
        <meta
          name="description"
          content="Página de criação de senha para acesso administrativo ao site Érica Vilar."
        />
      </Head>

      <Script
        src="https://identity.netlify.com/v1/netlify-identity-widget.js"
        strategy="afterInteractive"
        onLoad={() => setIdentityReady(true)}
      />

      <main className="admin-access-page">
        <section className="admin-access-card">
          <span className="admin-access-kicker">Área administrativa</span>

          <h1>Crie sua senha</h1>

          <p>
            Você recebeu um convite para acessar o painel administrativo do site
            Érica Vilar. Para continuar, clique no botão abaixo e defina uma
            senha segura.
          </p>

          <div className="admin-access-steps">
            <div>
              <strong>1</strong>
              <span>Clique em “Abrir criação de senha”.</span>
            </div>

            <div>
              <strong>2</strong>
              <span>Digite uma senha segura na janela da Netlify.</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Depois disso, você será levado ao painel do blog.</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-access-button"
            onClick={handleOpenIdentity}
            disabled={!identityReady}
          >
            {identityReady
              ? "Abrir criação de senha"
              : "Carregando acesso..."}
          </button>

          <small>
            Se aparecer a tela de login em vez da criação de senha, abra
            novamente o link original do convite recebido por e-mail.
          </small>
        </section>
      </main>
    </>
  );
}