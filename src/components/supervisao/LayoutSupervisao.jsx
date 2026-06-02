import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/admin/supervisao", label: "Clínica", icon: "▦" },
  { href: "/admin/supervisao/dashboard-terapeutas", label: "Terapeuta", icon: "◌" },
  { href: "/admin/supervisao/dashboard-pacientes", label: "Paciente", icon: "✦" },
  { href: "/admin/supervisao/clinicas", label: "Clínicas", icon: "⌂" },
  { href: "/admin/supervisao/terapeutas", label: "Terapeutas", icon: "◎" },
  { href: "/admin/supervisao/pacientes", label: "Pacientes", icon: "◇" },
  { href: "/admin/supervisao/lancamento-semanal", label: "Lançamentos", icon: "+" },
];

export default function LayoutSupervisao({ title, description, user, onLogout, children, actions }) {
  const router = useRouter();

  return (
    <main className="supervisao-shell">
      <aside className="supervisao-sidebar">
        <div className="supervisao-brand-card">
          <span className="supervisao-brand-mark">EV</span>
          <div>
            <span className="supervisao-kicker">Área interna</span>
            <h2>Supervisão Clínica</h2>
          </div>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? "active" : ""}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="supervisao-sidebar-footer">
          <small>{user?.email}</small>
          <button type="button" onClick={onLogout}>Sair</button>
        </div>
      </aside>

      <section className="supervisao-content">
        <header className="supervisao-page-header">
          <div>
            <span className="supervisao-kicker">Sistema de acompanhamento</span>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </div>
          {actions && <div className="supervisao-header-actions">{actions}</div>}
        </header>

        {children}
      </section>
    </main>
  );
}
