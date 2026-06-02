/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { createNetlifyIdentityAuth } from "@/lib/supervisao/netlifyIdentity";

export default function AuthGuard({ children }) {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const auth = useMemo(() => createNetlifyIdentityAuth(), []);

  useEffect(() => {
    if (!auth) return;

    try {
      setUser(auth.currentUser());
    } catch (error) {
      console.error(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [auth]);

  async function handleLogin(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const loggedUser = await auth.login(email, password, true);
      setUser(loggedUser);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setMessage(
        error?.json?.msg || error?.message || "Não foi possível entrar. Confira e-mail e senha."
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
    }
  }

  if (loading) {
    return (
      <main className="supervisao-auth-page">
        <section className="supervisao-auth-card">
          <span className="supervisao-kicker">Supervisão clínica</span>
          <h1>Carregando acesso...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="supervisao-auth-page">
        <section className="supervisao-auth-card">
          <span className="supervisao-kicker">Área interna</span>
          <h1>Supervisão clínica</h1>
          <p>
            Entre com o usuário convidado no Netlify Identity para acessar os cadastros,
            lançamentos semanais e dashboard.
          </p>

          <form onSubmit={handleLogin} className="supervisao-login-form">
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

            {message && <div className="supervisao-message error">{message}</div>}

            <button className="supervisao-primary-button" type="submit" disabled={submitting}>
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <small>
            O acesso é restrito a usuários convidados no painel da Netlify.
          </small>
        </section>
      </main>
    );
  }

  return children({ user, onLogout: handleLogout });
}
