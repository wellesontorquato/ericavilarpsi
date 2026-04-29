import Head from "next/head";
import { useEffect, useState } from "react";

export default function AdminAcesso() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hash = window.location.hash || "";
    const storedHash = sessionStorage.getItem("netlify_identity_hash");

    const isIdentityToken =
      hash.includes("invite_token") ||
      hash.includes("recovery_token") ||
      hash.includes("confirmation_token");

    if (isIdentityToken) {
      sessionStorage.setItem("netlify_identity_hash", hash);
      setHasToken(true);
      return;
    }

    if (storedHash) {
      setHasToken(true);
    }
  }, []);

  function loadNetlifyIdentity() {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") return reject();

      if (window.netlifyIdentity) {
        resolve(window.netlifyIdentity);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js";
      script.async = true;

      script.onload = () => {
        if (window.netlifyIdentity) {
          resolve(window.netlifyIdentity);
        } else {
          reject();
        }
      };

      script.onerror = reject;

      document.body.appendChild(script);
    });
  }

  async function handleOpenIdentity() {
    if (typeof window === "undefined") return;

    setIsLoading(true);

    try {
      const savedHash =
        sessionStorage.getItem("netlify_identity_hash") ||
        window.location.hash;

      const hasSavedToken =
        savedHash.includes("invite_token") ||
        savedHash.includes("recovery_token") ||
        savedHash.includes("confirmation_token");

      if (hasSavedToken) {
        window.location.hash = savedHash;
      }

      const netlifyIdentity = await loadNetlifyIdentity();

      netlifyIdentity.on("signup", () => {
        sessionStorage.removeItem("netlify_identity_hash");
        window.location.href = "/admin/";
      });

      netlifyIdentity.on("login", () => {
        sessionStorage.removeItem("netlify_identity_hash");
        window.location.href = "/admin/";
      });

      netlifyIdentity.on("close", () => {
        const savedHashAgain = sessionStorage.getItem("netlify_identity_hash");

        if (savedHashAgain && window.location.hash === "#") {
          window.location.hash = savedHashAgain;
        }
      });

      if (hasSavedToken) {
        netlifyIdentity.init();
      } else {
        netlifyIdentity.open();
      }
    } catch (error) {
      alert(
        "Não foi possível carregar a janela de acesso. Recarregue a página e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
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
            onClick={handleOpenIdentity}
            disabled={isLoading}
          >
            {isLoading ? "Carregando..." : "Abrir criação de senha"}
          </button>

          {!hasToken && (
            <small>
              Para criar a senha, acesse esta página usando o link de convite
              recebido por e-mail.
            </small>
          )}

          {hasToken && (
            <small>
              Se você fechou a janela sem criar a senha, clique novamente no
              botão acima.
            </small>
          )}
        </section>
      </main>
    </>
  );
}