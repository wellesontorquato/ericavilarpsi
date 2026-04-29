import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function AdminAcesso() {
  const [savedHash, setSavedHash] = useState("");
  const [shouldStartIdentity, setShouldStartIdentity] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash || "";
    const searchParams = new URLSearchParams(window.location.search);
    const start = searchParams.get("start") === "1";

    const isIdentityToken =
      hash.includes("invite_token") ||
      hash.includes("recovery_token") ||
      hash.includes("confirmation_token");

    if (isIdentityToken) {
      sessionStorage.setItem("netlify_identity_hash", hash);
      setSavedHash(hash);
    } else {
      const storedHash = sessionStorage.getItem("netlify_identity_hash") || "";
      setSavedHash(storedHash);
    }

    if (start) {
      setShouldStartIdentity(true);
    }
  }, []);

  function handleStartSignup() {
    if (typeof window === "undefined") return;

    const hash =
      savedHash ||
      sessionStorage.getItem("netlify_identity_hash") ||
      window.location.hash;

    const hasToken =
      hash.includes("invite_token") ||
      hash.includes("recovery_token") ||
      hash.includes("confirmation_token");

    if (!hasToken) {
      alert(
        "O token de convite não foi encontrado. Abra novamente o link de convite recebido por e-mail."
      );
      return;
    }

    sessionStorage.setItem("netlify_identity_hash", hash);

    window.location.href = `/admin-acesso?start=1${hash}`;
  }

  function handleIdentityLoad() {
    if (typeof window === "undefined" || !window.netlifyIdentity) return;

    window.netlifyIdentity.on("signup", () => {
      sessionStorage.removeItem("netlify_identity_hash");
      window.location.href = "/admin/";
    });

    window.netlifyIdentity.on("login", () => {
      sessionStorage.removeItem("netlify_identity_hash");
      window.location.href = "/admin/";
    });

    window.netlifyIdentity.init();
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

      {shouldStartIdentity && (
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
          onLoad={handleIdentityLoad}
        />
      )}

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
              <span>Digite uma senha segura na janela de cadastro.</span>
            </div>

            <div>
              <strong>3</strong>
              <span>Depois disso, você será levado ao painel do blog.</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-access-button"
            onClick={handleStartSignup}
          >
            Abrir criação de senha
          </button>

          <small>
            Caso a janela não apareça, abra novamente o link original recebido
            por e-mail.
          </small>
        </section>
      </main>
    </>
  );
}