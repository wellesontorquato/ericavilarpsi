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
        href: "/admin/supervisao/supervisores",
        label: "Supervisores",
        icon: "♙",
        adminOnly: true,
      },
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
      {
        href: "/admin/supervisao/alertas",
        label: "Alertas automáticos",
        icon: "!",
      },
      {
        href: "/admin/supervisao/relatorios",
        label: "Relatórios",
        icon: "▣",
      },
    ],
  },
];

function isActiveRoute(pathname, href) {
  return pathname === href;
}

function getVisibleGroups(isAdmin) {
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.adminOnly || isAdmin
      ),
    }))
    .filter((group) => group.items.length > 0);
}

function getOpenGroups(pathname, groups) {
  return groups.reduce((acc, group) => {
    acc[group.id] = group.items.some((item) =>
      isActiveRoute(pathname, item.href)
    );

    return acc;
  }, {});
}

function getRoleLabel(access) {
  if (access?.role === "admin" || access?.isAdmin === true) {
    return "Administrador geral";
  }

  if (access?.role === "supervisor") {
    return "Supervisor clínico";
  }

  return "Usuário interno";
}

function normalizeText(value) {
  return String(value || "").trim();
}

function getDisplayName(user, access) {
  const email = normalizeText(user?.email).toLowerCase();

  const candidates = [
    user?.user_metadata?.full_name,
    user?.user_metadata?.name,
    user?.user_metadata?.display_name,
    access?.nome,
  ];

  const name = candidates
    .map(normalizeText)
    .find(
      (candidate) =>
        candidate &&
        candidate.toLowerCase() !== email &&
        !candidate.includes("@")
    );

  return name || getRoleLabel(access);
}

function getInitials(value) {
  const parts = normalizeText(value)
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "US";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function LayoutSupervisao({
  title,
  description,
  user,
  access,
  onLogout,
  children,
  actions,
}) {
  const router = useRouter();

  const currentAccess =
    access || user?.supervisaoAccess || null;

  const isAdmin =
    currentAccess?.role === "admin" ||
    currentAccess?.isAdmin === true;

  const roleLabel = getRoleLabel(currentAccess);
  const displayName = getDisplayName(user, currentAccess);
  const userEmail = normalizeText(user?.email);

  const showRoleLabel =
    displayName.toLowerCase() !== roleLabel.toLowerCase();

  const visibleGroups = useMemo(
    () => getVisibleGroups(isAdmin),
    [isAdmin]
  );

  const activeGroups = useMemo(
    () => getOpenGroups(router.pathname, visibleGroups),
    [router.pathname, visibleGroups]
  );

  const [openGroups, setOpenGroups] = useState(() =>
    getOpenGroups(router.pathname, getVisibleGroups(isAdmin))
  );

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

        <nav
          className="supervisao-sidebar-nav"
          aria-label="Menu da supervisão"
        >
          {visibleGroups.map((group) => {
            const isGroupOpen = Boolean(
              openGroups[group.id] || activeGroups[group.id]
            );

            const isGroupActive = group.items.some((item) =>
              isActiveRoute(router.pathname, item.href)
            );

            return (
              <div
                key={group.id}
                className={`supervisao-nav-section ${
                  isGroupOpen ? "open" : ""
                } ${isGroupActive ? "active" : ""}`}
              >
                <button
                  type="button"
                  className="supervisao-submenu-trigger"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={isGroupOpen}
                  aria-controls={`supervisao-menu-${group.id}`}
                >
                  <span className="supervisao-submenu-left">
                    <span
                      className="supervisao-nav-icon"
                      aria-hidden="true"
                    >
                      {group.icon}
                    </span>

                    <span>{group.label}</span>
                  </span>

                  <span
                    className="supervisao-submenu-chevron"
                    aria-hidden="true"
                  >
                    ⌄
                  </span>
                </button>

                {isGroupOpen && (
                  <div
                    id={`supervisao-menu-${group.id}`}
                    className="supervisao-submenu-items"
                  >
                    {group.items.map((item) => {
                      const active = isActiveRoute(
                        router.pathname,
                        item.href
                      );

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={active ? "active" : ""}
                          aria-current={active ? "page" : undefined}
                        >
                          <span aria-hidden="true">{item.icon}</span>
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="supervisao-sidebar-footer">
          <div className="supervisao-sidebar-user">
            <span
              className="supervisao-sidebar-user-avatar"
              aria-hidden="true"
            >
              {getInitials(displayName)}
            </span>

            <div className="supervisao-sidebar-user-copy">
              <strong title={displayName}>{displayName}</strong>

              {showRoleLabel && (
                <span className="supervisao-sidebar-user-role">
                  {roleLabel}
                </span>
              )}

              {userEmail && (
                <small title={userEmail}>{userEmail}</small>
              )}
            </div>
          </div>

          <button type="button" onClick={onLogout}>
            Sair
          </button>
        </div>
      </aside>

      <section className="supervisao-content">
        <header className="supervisao-page-header">
          <div>
            <span className="supervisao-kicker">
              Sistema de acompanhamento
            </span>

            <h1>{title}</h1>

            {description && <p>{description}</p>}
          </div>

          {actions && (
            <div className="supervisao-header-actions">
              {actions}
            </div>
          )}
        </header>

        {children}
      </section>
    </main>
  );
}