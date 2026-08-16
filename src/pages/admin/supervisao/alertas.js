import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import Modal from "@/components/supervisao/Modal";
import StatusMessage from "@/components/supervisao/StatusMessage";
import {
  ChartPanel,
  DonutChart,
  HorizontalBars,
} from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import {
  currentYear,
  safeId,
  safeText,
} from "@/lib/supervisao/dashboardUtils";
import { mesNome } from "@/lib/supervisao/format";
import {
  ALERT_LEVELS,
  ALERT_TYPES,
  buildAlertasSupervisao,
  filterAlertas,
  summarizeAlertas,
} from "@/lib/supervisao/alertas";

const currentMonth = String(new Date().getMonth() + 1);

const INITIAL_FILTERS = {
  ano: String(currentYear),
  mes: currentMonth,
  semana: "",
  clinicaId: "",
  terapeutaId: "",
  pacienteId: "",
  nivel: "",
  tipo: "",
};

function nivelClass(level) {
  if (level === "alto") return "danger";
  if (level === "medio") return "progress";
  return "neutral";
}

function tipoOptions() {
  return Object.entries(ALERT_TYPES).map(([value, label]) => ({
    value,
    label,
  }));
}

function safeDetail(value, fallback = "Sem detalhe registrado.") {
  const text = safeText(value, fallback);
  return text === "-" ? fallback : text;
}

function periodScore(alerta = {}) {
  return (
    Number(alerta.ano || 0) * 1000 +
    Number(alerta.mes || 0) * 10 +
    Number(alerta.semana || 0)
  );
}

function periodDescription(filters = {}) {
  const parts = [];

  if (filters.semana) parts.push(`Semana ${filters.semana}`);
  if (filters.mes) parts.push(mesNome(filters.mes));
  if (filters.ano) parts.push(String(filters.ano));

  return parts.length ? parts.join(" · ") : "Todos os períodos";
}

function AlertDetailModal({ alerta, onClose }) {
  if (!alerta) return null;

  return (
    <Modal
      open={Boolean(alerta)}
      title={alerta.title}
      description={`${alerta.typeLabel} · Nível ${alerta.levelLabel}`}
      onClose={onClose}
      size="large"
    >
      <div className="supervisao-alerta-modal-grid">
        <div>
          <span>Paciente/caso</span>
          <strong>
            {safeDetail(alerta.pacienteNome, "Não se aplica")}
          </strong>
        </div>

        <div>
          <span>Terapeuta</span>
          <strong>
            {safeDetail(alerta.terapeutaNome, "Não informado")}
          </strong>
        </div>

        <div>
          <span>Clínica</span>
          <strong>
            {safeDetail(alerta.clinicaNome, "Não informada")}
          </strong>
        </div>

        <div>
          <span>Período de referência</span>
          <strong>
            {safeDetail(alerta.periodo, "Cadastro atual")}
          </strong>
        </div>
      </div>

      <div className="supervisao-alerta-modal-textos">
        <section>
          <h3>Resumo</h3>
          <p>{safeDetail(alerta.summary)}</p>
        </section>

        <section>
          <h3>Detalhe clínico</h3>
          <p>{safeDetail(alerta.detail)}</p>
        </section>

        <section>
          <h3>Critério utilizado</h3>
          <p>{safeDetail(alerta.criteria)}</p>
        </section>
      </div>

      <p className="supervisao-helper-text">
        Métricas marcadas como &quot;Não computar&quot; não participam dos
        cálculos e não geram alertas automáticos.
      </p>

      <div className="supervisao-alerta-modal-actions">
        <Link
          href={alerta.actionHref}
          className="supervisao-primary-button"
          onClick={onClose}
        >
          Abrir acompanhamento
        </Link>

        <button
          type="button"
          className="supervisao-secondary-button"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}

function AlertCard({ alerta, onOpen }) {
  return (
    <article className={`supervisao-alert-card ${alerta.level}`}>
      <header>
        <div>
          <span className="supervisao-kicker">{alerta.typeLabel}</span>
          <h3>{alerta.title}</h3>
        </div>

        <i className={`supervisao-status-pill ${nivelClass(alerta.level)}`}>
          {alerta.levelLabel}
        </i>
      </header>

      <p>{safeDetail(alerta.summary)}</p>

      <dl>
        <div>
          <dt>Paciente</dt>
          <dd>{safeDetail(alerta.pacienteNome, "Não se aplica")}</dd>
        </div>

        <div>
          <dt>Terapeuta</dt>
          <dd>{safeDetail(alerta.terapeutaNome, "Não informado")}</dd>
        </div>

        <div>
          <dt>Clínica</dt>
          <dd>{safeDetail(alerta.clinicaNome, "Não informada")}</dd>
        </div>

        <div>
          <dt>Período</dt>
          <dd>{safeDetail(alerta.periodo, "Cadastro atual")}</dd>
        </div>
      </dl>

      <footer>
        <button
          type="button"
          className="supervisao-mini-action"
          onClick={() => onOpen(alerta)}
        >
          Ver detalhes
        </button>

        <Link
          href={alerta.actionHref}
          className="supervisao-mini-action"
          style={{
            background: "transparent",
            border: "1px solid var(--sup-line)",
          }}
        >
          Abrir acompanhamento
        </Link>
      </footer>
    </article>
  );
}

export default function AlertasSupervisaoPage() {
  return (
    <AuthGuard>
      {({ user, access, onLogout }) => (
        <AlertasContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function AlertasContent({ user, access, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadToken, setReloadToken] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [alertaAberto, setAlertaAberto] = useState(null);
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      setMessage({ type: "", text: "" });

      try {
        const payload = await supervisaoRequest(user, "dashboard");

        if (!cancelled) {
          setData(payload);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setData(null);
          setMessage({
            type: "error",
            text:
              error?.message ||
              "Não foi possível carregar os alertas da supervisão.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user, reloadToken]);

  const clinicas = useMemo(() => data?.clinicas || [], [data]);
  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const terapeutasFiltrados = useMemo(() => {
    if (!filters.clinicaId) return terapeutas;

    return terapeutas.filter(
      (item) => safeId(item?.clinicaId) === safeId(filters.clinicaId)
    );
  }, [terapeutas, filters.clinicaId]);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((item) => {
      if (
        filters.clinicaId &&
        safeId(item?.clinicaId) !== safeId(filters.clinicaId)
      ) {
        return false;
      }

      if (
        filters.terapeutaId &&
        safeId(item?.terapeutaId) !== safeId(filters.terapeutaId)
      ) {
        return false;
      }

      return true;
    });
  }, [pacientes, filters.clinicaId, filters.terapeutaId]);

  const alertasCalculados = useMemo(() => {
    return buildAlertasSupervisao({
      clinicas,
      terapeutas,
      pacientes,
      lancamentos,
      filters,
    });
  }, [clinicas, terapeutas, pacientes, lancamentos, filters]);

  const alertasFiltrados = useMemo(
    () => filterAlertas(alertasCalculados, filters),
    [alertasCalculados, filters]
  );

  const alertasOrdenados = useMemo(() => {
    return [...alertasFiltrados].sort((a, b) => {
      const levelDifference =
        (ALERT_LEVELS[b.level]?.order || 0) -
        (ALERT_LEVELS[a.level]?.order || 0);

      if (levelDifference) return levelDifference;

      const periodDifference = periodScore(b) - periodScore(a);

      if (periodDifference) return periodDifference;

      return safeText(a.title, "").localeCompare(
        safeText(b.title, ""),
        "pt-BR"
      );
    });
  }, [alertasFiltrados]);

  const resumo = useMemo(
    () => summarizeAlertas(alertasFiltrados),
    [alertasFiltrados]
  );

  const resumoBase = useMemo(
    () => summarizeAlertas(alertasCalculados),
    [alertasCalculados]
  );

  function updateFilter(name, value) {
    setFilters((current) => {
      const next = { ...current, [name]: value };

      if (name === "clinicaId") {
        next.terapeutaId = "";
        next.pacienteId = "";
      }

      if (name === "terapeutaId") {
        next.pacienteId = "";
      }

      return next;
    });

    setAlertaAberto(null);
  }

  function resetFilters() {
    setFilters(INITIAL_FILTERS);
    setAlertaAberto(null);
  }

  return (
    <>
      <Head>
        <title>Alertas automáticos | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Monitoramento e alertas"
        description="Identifica automaticamente casos, indicadores e planos que precisam de revisão clínica."
        user={user}
        access={access}
        onLogout={onLogout}
        actions={
          <Link
            className="supervisao-secondary-button"
            href="/admin/supervisao/historico"
          >
            Ver histórico clínico
          </Link>
        }
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero alertas-hero">
          <div>
            <span className="supervisao-kicker">Supervisão ativa</span>

            <h2>{resumo.total} alerta(s) no recorte</h2>

            <p>
              {periodDescription(filters)}. Alertas de nível alto devem ser
              priorizados na revisão com o terapeuta responsável.
            </p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={
              <>
                <label>
                  <span>Clínica</span>

                  <select
                    value={filters.clinicaId}
                    onChange={(event) =>
                      updateFilter("clinicaId", event.target.value)
                    }
                  >
                    <option value="">Todas</option>

                    {clinicas.map((clinica) => (
                      <option key={clinica.id} value={clinica.id}>
                        {clinica.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Terapeuta</span>

                  <select
                    value={filters.terapeutaId}
                    onChange={(event) =>
                      updateFilter("terapeutaId", event.target.value)
                    }
                  >
                    <option value="">Todos</option>

                    {terapeutasFiltrados.map((terapeuta) => (
                      <option key={terapeuta.id} value={terapeuta.id}>
                        {terapeuta.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Paciente</span>

                  <select
                    value={filters.pacienteId}
                    onChange={(event) =>
                      updateFilter("pacienteId", event.target.value)
                    }
                  >
                    <option value="">Todos</option>

                    {pacientesFiltrados.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Nível</span>

                  <select
                    value={filters.nivel}
                    onChange={(event) =>
                      updateFilter("nivel", event.target.value)
                    }
                  >
                    <option value="">Todos</option>

                    {Object.entries(ALERT_LEVELS).map(([value, item]) => (
                      <option key={value} value={value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Tipo de alerta</span>

                  <select
                    value={filters.tipo}
                    onChange={(event) =>
                      updateFilter("tipo", event.target.value)
                    }
                  >
                    <option value="">Todos</option>

                    {tipoOptions().map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  className="supervisao-secondary-button"
                  onClick={resetFilters}
                >
                  Limpar filtros
                </button>
              </>
            }
          />
        </section>

        {loading ? (
          <section className="supervisao-panel">
            <p>Carregando monitoramento...</p>
          </section>
        ) : !data ? (
          <section className="supervisao-panel">
            <p className="supervisao-empty">
              Não foi possível carregar os dados dos alertas.
            </p>

            <button
              type="button"
              className="supervisao-primary-button"
              onClick={() => setReloadToken((current) => current + 1)}
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Total no filtro"
                value={resumo.total}
                detail={`${resumoBase.total} alerta(s) antes dos filtros de nível e tipo`}
              />

              <CardIndicador
                label="Atenção imediata"
                value={resumo.alto}
                detail="alertas de prioridade alta"
              />

              <CardIndicador
                label="Pacientes afetados"
                value={resumo.pacientes}
                detail="com ao menos um alerta"
              />

              <CardIndicador
                label="Terapeutas envolvidos"
                value={resumo.terapeutas}
                detail="responsáveis pelos acompanhamentos"
              />
            </section>

            <section className="supervisao-panel">
              <p className="supervisao-helper-text">
                Os alertas consideram somente registros ativos e campos que
                possuem valor computado. Campos marcados como
                &quot;Não computar&quot; são ignorados, sem serem convertidos
                em zero.
              </p>
            </section>

            <section
              className="bento-grid"
              style={{ marginBottom: "24px" }}
            >
              <div className="bento-col bento-4">
                <ChartPanel
                  title="Distribuição por nível"
                  subtitle="Quantidade de alertas por gravidade"
                >
                  <DonutChart items={resumo.niveis} />
                </ChartPanel>
              </div>

              <div className="bento-col bento-8">
                <ChartPanel
                  title="Motivos recorrentes"
                  subtitle="Tipos de alerta mais frequentes no recorte"
                >
                  <HorizontalBars
                    items={resumo.tipos.slice(0, 5)}
                    valueKey="value"
                    labelKey="label"
                    valueFormatter={(value) => String(value)}
                  />
                </ChartPanel>
              </div>
            </section>

            <section className="supervisao-panel dashboard-lower">
              <div
                className="supervisao-section-title"
                style={{ marginBottom: "20px" }}
              >
                <h2>Fila de intervenção</h2>
                <span>Prioridade e período mais recente primeiro</span>
              </div>

              {alertasOrdenados.length ? (
                <div className="supervisao-alert-list">
                  {alertasOrdenados.map((alerta) => (
                    <AlertCard
                      key={alerta.id}
                      alerta={alerta}
                      onOpen={setAlertaAberto}
                    />
                  ))}
                </div>
              ) : (
                <p
                  className="supervisao-empty"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  Nenhum alerta encontrado para os filtros selecionados.
                </p>
              )}
            </section>
          </>
        )}
      </LayoutSupervisao>

      <AlertDetailModal
        alerta={alertaAberto}
        onClose={() => setAlertaAberto(null)}
      />
    </>
  );
}