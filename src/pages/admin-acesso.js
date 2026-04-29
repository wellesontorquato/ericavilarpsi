import Head from "next/head";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function AdminAcesso() {
  const [identityToken, setIdentityToken] = useState("");
  const [shouldLoadIdentity, setShouldLoadIdentity] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("identity_token");

    if (tokenFromUrl) {
      sessionStorage.setItem("netlify_identity_token", tokenFromUrl);
      setIdentityToken(tokenFromUrl);
      return;
    }

    const tokenFromStorage =
      sessionStorage.getItem("netlify_identity_token") || "";

    setIdentityToken(tokenFromStorage);
  }, []);

  function handleStartSignup() {
    if (typeof window === "undefined") return;

    const token =
      identityToken ||
      sessionStorage.getItem("netlify_identity_token") ||
      "";

    const hasToken =
      token.includes("invite_token") ||
      token.includes("recovery_token") ||
      token.includes("confirmation_token");

    if (!hasToken) {
      alert(
        "O token de convite não foi encontrado. Envie um novo convite pela Netlify e abra o link recebido por e-mail."
      );
      return;
    }

    sessionStorage.setItem("netlify_identity_token", token);

    const url = new URL(window.location.href);
    url.searchParams.set("start", "1");
    url.hash = token;

    window.history.replaceState({}, "", url.toString());

    setShouldLoadIdentity(true);
  }

  function handleIdentityLoad() {
    if (typeof window === "undefined" || !window.netlifyIdentity) return;

    window.netlifyIdentity.on("signup", () => {
      sessionStorage.removeItem("netlify_identity_token");
      window.location.href = "/admin/";
    });

    window.netlifyIdentity.on("login", () => {
      sessionStorage.removeItem("netlify_identity_token");
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

      {shouldLoadIdentity && (
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
            Se o botão não abrir a criação de senha, envie um novo convite pela
            Netlify. Tokens antigos podem ser invalidados após testes.
          </small>
        </section>
      </main>
    </>
  );
}