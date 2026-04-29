import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import GoTrue from "gotrue-js";

export default function AdminAcesso() {
  const [token, setToken] = useState("");
  const [flowType, setFlowType] = useState("invite");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const auth = useMemo(() => {
    if (typeof window === "undefined") return null;

    return new GoTrue({
      APIUrl: `${window.location.origin}/.netlify/identity`,
      audience: "",
      setCookie: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token") || "";
    const typeFromUrl = params.get("type") || "invite";

    setToken(tokenFromUrl);
    setFlowType(typeFromUrl);

    if (!tokenFromUrl) {
      setMessage({
        type: "error",
        text: "Token de convite não encontrado. Abra esta página usando o link recebido por e-mail.",
      });
    }
  }, []);

  function validatePassword() {
    if (!token) {
      return "Token de convite não encontrado. Abra novamente o link recebido por e-mail.";
    }

    if (!password || !confirmPassword) {
      return "Preencha a senha e a confirmação de senha.";
    }

    if (password.length < 8) {
      return "A senha precisa ter pelo menos 8 caracteres.";
    }

    if (password !== confirmPassword) {
      return "As senhas não conferem. Digite novamente.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validatePassword();

    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });
      return;
    }

    setIsSubmitting(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      if (!auth) {
        throw new Error("Serviço de autenticação indisponível.");
      }

      /*
        Para convite da Netlify:
        auth.acceptInvite(token, password)

        Para recuperação de senha, podemos tratar depois com:
        auth.recover(token)
        ou endpoint específico conforme necessidade.
      */
      if (flowType !== "invite") {
        throw new Error(
          "Este formulário está configurado para convite de novo usuário."
        );
      }

      await auth.acceptInvite(token, password);

      setMessage({
        type: "success",
        text: "Senha criada com sucesso. Redirecionando para o painel...",
      });

      setTimeout(() => {
        window.location.href = "/admin/";
      }, 900);
    } catch (error) {
      console.error(error);

      let errorMessage =
        "Não foi possível criar a senha. Verifique se o convite ainda é válido.";

      if (error?.json?.msg) {
        errorMessage = error.json.msg;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Criar senha | Érica Vilar</title>
        <meta
          name="description"
          content="Criação de senha para acesso administrativo ao site Érica Vilar."
        />
      </Head>

      <main className="admin-access-page">
        <section className="admin-access-card">
          <span className="admin-access-kicker">Área administrativa</span>

          <h1>Crie sua senha</h1>

          <p>
            Defina uma senha segura para acessar o painel administrativo do site
            Érica Vilar.
          </p>

          <form className="admin-password-form" onSubmit={handleSubmit}>
            <label>
              <span>Nova senha</span>
              <input
                type="password"
                placeholder="Digite uma senha segura"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <label>
              <span>Confirmar senha</span>
              <input
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
              />
            </label>

            <div className="admin-password-rules">
              <strong>Recomendação:</strong>
              <span>
                use pelo menos 8 caracteres, misturando letras, números e
                símbolos.
              </span>
            </div>

            {message.text && (
              <div className={`admin-access-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="admin-access-button"
              disabled={isSubmitting || !token}
            >
              {isSubmitting ? "Criando senha..." : "Criar senha e acessar"}
            </button>
          </form>

          <small>
            Este acesso é restrito a usuários convidados pela administração.
          </small>
        </section>
      </main>
    </>
  );
}