import Head from "next/head";
import Script from "next/script";
import { useEffect } from "react";

export default function AdminAcesso() {
  useEffect(() => {
    const openIdentity = () => {
      if (typeof window === "undefined" || !window.netlifyIdentity) return;

      window.netlifyIdentity.on("init", (user) => {
        if (!user) {
          const hasInviteToken = window.location.hash.includes("invite_token");
          const hasRecoveryToken = window.location.hash.includes("recovery_token");
          const hasConfirmationToken = window.location.hash.includes("confirmation_token");

          if (hasInviteToken || hasRecoveryToken || hasConfirmationToken) {
            window.netlifyIdentity.open();
          }
        }
      });

      window.netlifyIdentity.on("signup", () => {
        window.location.href = "/admin/";
      });

      window.netlifyIdentity.on("login", () => {
        window.location.href = "/admin/";
      });

      window.netlifyIdentity.init();
    };

    const timer = setTimeout(openIdentity, 500);

    return () => clearTimeout(timer);
  }, []);

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
      />

      <main className="admin-access-page">
        <section className="admin-access-card">
          <span className="admin-access-kicker">Área administrativa</span>

          <h1>Crie sua senha de acesso</h1>

          <p>
            Você recebeu um convite para acessar o painel administrativo do site
            Érica Vilar. Para continuar, defina uma senha segura na janela que
            será aberta.
          </p>

          <div className="admin-access-steps">
            <div>
              <strong>1</strong>
              <span>Digite uma senha segura.</span>
            </div>

            <div>
              <strong>2</strong>
              <span>Clique em “Sign up” para finalizar o cadastro.</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Depois disso, você será levado ao painel do blog.</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-access-button"
            onClick={() => {
              if (window.netlifyIdentity) {
                window.netlifyIdentity.open();
              }
            }}
          >
            Abrir criação de senha
          </button>

          <small>
            Caso a janela não apareça automaticamente, clique no botão acima.
          </small>
        </section>
      </main>
    </>
  );
}