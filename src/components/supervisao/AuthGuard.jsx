/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { createNetlifyIdentityAuth } from "@/lib/supervisao/netlifyIdentity";
import { supervisaoRequest } from "@/lib/supervisao/api";

async function fetchAccess(user) {
  const payload = await supervisaoRequest(user, "me");
  const access = payload?.access;

  if (!access || !["admin", "supervisor"].includes(access.role)) {
    throw new Error(
      "Esta conta não possui um perfil válido de administrador ou supervisor."
    );
  }

  return access;
}

export default function AuthGuard({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const auth = useMemo(() => createNetlifyIdentityAuth(), []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function restoreSession() {
      try {
        const currentUser = auth.currentUser();

        if (!currentUser) {
          if (!cancelled) {
            setUser(null);
            setAccess(null);
          }
          return;
        }

        if (!cancelled) {
          setUser(currentUser);
        }

        const currentAccess = await fetchAccess(currentUser);

        if (cancelled) return;

        currentUser.supervisaoAccess = currentAccess;

        setAccess(currentAccess);
        setMessage("");
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setAccess(null);
          setMessage(
            error?.message ||
              "Não foi possível validar sua permissão de acesso."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [auth]);

  async function handleLogin(event) {
    event.preventDefault();

    if (!auth) {
      setMessage("Serviço de autenticação indisponível.");
      return;
    }

    setSubmitting(true);
    setMessage("");
    setAccess(null);

    try {
      const loggedUser = await auth.login(email, password, true);

      setUser(loggedUser);

      const currentAccess = await fetchAccess(loggedUser);

      loggedUser.supervisaoAccess = currentAccess;

      setAccess(currentAccess);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);

      setMessage(
        error?.json?.msg ||
          error?.message ||
          "Não foi possível entrar. Confira o e-mail, a senha e a permissão da conta."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    try {
      await user?.logout?.();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      setAccess(null);
      setEmail("");
      setPassword("");
      setMessage("");
    }
  }

  if (loading) {
    return (
      <main className="supervisao-auth-page">
        <section className="supervisao-auth-card">
          <span className="supervisao-kicker">
            Supervisão clínica
          </span>

          <h1>Validando acesso...</h1>

          <p>
            Aguarde enquanto verificamos seu perfil e suas permissões.
          </p>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="supervisao-auth-page">
        <section className="supervisao-auth-card">
          <span className="supervisao-kicker">
            Área interna
          </span>

          <h1>Supervisão clínica</h1>

          <p>
            Entre com uma conta de administrador ou supervisor
            cadastrada no sistema.
          </p>

          <form
            onSubmit={handleLogin}
            className="supervisao-login-form"
          >
            <label>
              <span>E-mail</span>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@exemplo.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              <span>Senha</span>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </label>

            {message && (
              <div className="supervisao-message error">
                {message}
              </div>
            )}

            <button
              className="supervisao-primary-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Validando acesso..." : "Entrar"}
            </button>
          </form>

          <small>
            O acesso depende do cadastro e das permissões atribuídas
            pelo administrador geral.
          </small>
        </section>
      </main>
    );
  }

  if (!access) {
    return (
      <main className="supervisao-auth-page">
        <section className="supervisao-auth-card">
          <span className="supervisao-kicker">
            Acesso restrito
          </span>

          <h1>Conta sem permissão</h1>

          <p>
            {message ||
              "Esta conta não está vinculada a um administrador ou supervisor ativo."}
          </p>

          <small>
            Caso você seja um supervisor, solicite ao administrador
            que confira seu cadastro e seu e-mail de acesso.
          </small>

          <button
            className="supervisao-secondary-button"
            type="button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </section>
      </main>
    );
  }

  return children({
    user,
    access,
    onLogout: handleLogout,
  });
}