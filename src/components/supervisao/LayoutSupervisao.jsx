import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const navGroups = [
  {
    id: "dashboards",
    label: "Dashboards",
    icon: "▦",
    items: [
      {
        href: "/admin/supervisao",
        label: "Por clínica",
        icon: "⌂",
      },
      {
        href: "/admin/supervisao/dashboard-terapeutas",
        label: "Por terapeuta",
        icon: "◎",
      },
      {
        href: "/admin/supervisao/dashboard-pacientes",
        label: "Por paciente",
        icon: "✦",
      },
    ],
  },
  {
    id: "cadastros",
    label: "Cadastros",
    icon: "◇",
    items: [
      {
        href: "/admin/supervisao/clinicas",
        label: "Clínicas",
        icon: "⌂",
      },
      {
        href: "/admin/supervisao/terapeutas",
        label: "Terapeutas",
        icon: "◌",
      },
      {
        href: "/admin/supervisao/pacientes",
        label: "Pacientes",
        icon: "☼",
      },
    ],
  },
  {
    id: "rotina",
    label: "Rotina clínica",
    icon: "+",
    items: [
      {
        href: "/admin/supervisao/lancamento-semanal",
        label: "Lançamento semanal",
        icon: "+",
      },
      {
        href: "/admin/supervisao/historico",
        label: "Histórico clínico",
        icon: "↗",
      },
    ],
  },
];

function isActiveRoute(pathname, href) {
  return pathname === href;
}

function getOpenGroups(pathname) {
  return navGroups.reduce((acc, group) => {
    acc[group.id] = group.items.some((item) => isActiveRoute(pathname, item.href));
    return acc;
  }, {});
}

export default function LayoutSupervisao({
  title,
  description,
  user,
  onLogout,
  children,
  actions,
}) {
  const router = useRouter();
  const activeGroups = useMemo(() => getOpenGroups(router.pathname), [router.pathname]);
  const [openGroups, setOpenGroups] = useState(() => getOpenGroups(router.pathname));

  function toggleGroup(groupId) {
    setOpenGroups((current) => ({
      ...current,
      [groupId]: !current[groupId],
    }));
  }

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

        <nav className="supervisao-sidebar-nav" aria-label="Menu da supervisão">
          {navGroups.map((group) => {
            const isGroupOpen = Boolean(openGroups[group.id] || activeGroups[group.id]);
            const isGroupActive = group.items.some((item) =>
              isActiveRoute(router.pathname, item.href)
            );

            return (
              <div
                key={group.id}
                className={`supervisao-nav-section ${isGroupOpen ? "open" : ""} ${
                  isGroupActive ? "active" : ""
                }`}
              >
                <button
                  type="button"
                  className="supervisao-submenu-trigger"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isGroupOpen}
                >
                  <span className="supervisao-submenu-left">
                    <span className="supervisao-nav-icon">{group.icon}</span>
                    <span>{group.label}</span>
                  </span>

                  <span className="supervisao-submenu-chevron">⌄</span>
                </button>

                {isGroupOpen && (
                  <div className="supervisao-submenu-items">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={isActiveRoute(router.pathname, item.href) ? "active" : ""}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="supervisao-sidebar-footer">
          <small>{user?.email}</small>
          <button type="button" onClick={onLogout}>
            Sair
          </button>
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