import Link from "next/link";
import { useRouter } from "next/router";

const navItems = [
  { href: "/admin/supervisao", label: "Dashboard" },
  { href: "/admin/supervisao/clinicas", label: "Clínicas" },
  { href: "/admin/supervisao/terapeutas", label: "Terapeutas" },
  { href: "/admin/supervisao/pacientes", label: "Pacientes" },
  { href: "/admin/supervisao/lancamento-semanal", label: "Lançamento semanal" },
];

export default function LayoutSupervisao({ title, description, user, onLogout, children, actions }) {
  const router = useRouter();

  return (
    <main className="supervisao-shell">
      <aside className="supervisao-sidebar">
        <div>
          <span className="supervisao-kicker">Erica Vilar</span>
          <h2>Supervisão TCC</h2>
        </div>

        <nav>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={router.pathname === item.href ? "active" : ""}
            >
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
            <span className="supervisao-kicker">Área interna</span>
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
