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
import { currentYear, safeId, safeText } from "@/lib/supervisao/dashboardUtils";
import { mesNome } from "@/lib/supervisao/format";
import {
  ALERT_LEVELS,
  ALERT_TYPES,
  buildAlertasSupervisao,
  filterAlertas,
  summarizeAlertas,
} from "@/lib/supervisao/alertas";


const currentMonth = String(new Date().getMonth() + 1);

function nivelClass(level) {
  if (level === "alto") return "danger";
  if (level === "medio") return "progress";
  return "neutral";
}

function tipoOptions() {
  return Object.entries(ALERT_TYPES).map(([value, label]) => ({ value, label }));
}

function safeDetail(value, fallback = "Sem detalhe registrado.") {
  const text = safeText(value, fallback);
  return text === "-" ? fallback : text;
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
          <strong>{alerta.pacienteNome}</strong>
        </div>
        <div>
          <span>Terapeuta</span>
          <strong>{alerta.terapeutaNome}</strong>
        </div>
        <div>
          <span>Clínica</span>
          <strong>{alerta.clinicaNome}</strong>
        </div>
        <div>
          <span>Período</span>
          <strong>{alerta.periodo}</strong>
        </div>
      </div>

      <div className="supervisao-alerta-modal-textos">
        <section>
          <h3>Resumo</h3>
          <p>{safeDetail(alerta.summary)}</p>
        </section>

        <section>
          <h3>Detalhe</h3>
          <p>{safeDetail(alerta.detail)}</p>
        </section>

        <section>
          <h3>Critério do alerta</h3>
          <p>{safeDetail(alerta.criteria)}</p>
        </section>
      </div>

      <div className="supervisao-alerta-modal-actions">
        <Link href={alerta.actionHref} className="supervisao-primary-button">
          Abrir acompanhamento
        </Link>
        <button type="button" className="supervisao-secondary-button" onClick={onClose}>
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

      <p>{alerta.summary}</p>

      <dl>
        <div>
          <dt>Paciente</dt>
          <dd>{alerta.pacienteNome}</dd>
        </div>
        <div>
          <dt>Terapeuta</dt>
          <dd>{alerta.terapeutaNome}</dd>
        </div>
        <div>
          <dt>Clínica</dt>
          <dd>{alerta.clinicaNome}</dd>
        </div>
        <div>
          <dt>Período</dt>
          <dd>{alerta.periodo}</dd>
        </div>
      </dl>

      <footer>
        <button type="button" className="supervisao-mini-action" onClick={() => onOpen(alerta)}>
          Ver detalhes
        </button>

        <Link href={alerta.actionHref}>Abrir histórico</Link>
      </footer>
    </article>
  );
}

export default function AlertasSupervisaoPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <AlertasContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function AlertasContent({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [alertaAberto, setAlertaAberto] = useState(null);
  const [filters, setFilters] = useState({
    ano: String(currentYear),
    mes: currentMonth,
    semana: "",
    clinicaId: "",
    terapeutaId: "",
    pacienteId: "",
    nivel: "",
    tipo: "",
  });

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);

      try {
        const payload = await supervisaoRequest(user, "dashboard");
        setData(payload);
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  const clinicas = useMemo(() => data?.clinicas || [], [data]);
  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const pacienes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const terapeutasFiltrados = useMemo(() => {
    if (!filters.clinicaId) return terapeutas;
    return terapeutas.filter((item) => safeId(item.clinicaId) === safeId(filters.clinicaId));
  }, [terapeutas, filters.clinicaId]);

  const pacientesFiltrados = useMemo(() => {
    return pacienes.filter((item) => {
      if (filters.clinicaId && safeId(item.clinicaId) !== safeId(filters.clinicaId)) return false;
      if (filters.terapeutaId && safeId(item.terapeutaId) !== safeId(filters.terapeutaId)) return false;
      return true;
    });
  }, [pacienes, filters.clinicaId, filters.terapeutaId]);

  const alertasCalculados = useMemo(() => {
    return buildAlertasSupervisao({ clinicas, terapeutas, pacientes: pacienes, lancamentos, filters });
  }, [clinicas, terapeutas, pacienes, lancamentos, filters]);

  const alertasFiltrados = useMemo(() => {
    return filterAlertas(alertasCalculados, filters);
  }, [alertasCalculados, filters]);

  const resumo = useMemo(() => summarizeAlertas(alertasFiltrados), [alertasFiltrados]);
  const resumoGeral = useMemo(() => summarizeAlertas(alertasCalculados), [alertasCalculados]);

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
  }

  return (
    <>
      <Head>
        <title>Alertas automáticos | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Alertas automáticos"
        description="Identificação automática de casos, planos e indicadores que precisam de atenção clínica ou supervisão técnica."
        user={user}
        onLogout={onLogout}
        actions={<Link className="supervisao-secondary-button" href="/admin/supervisao/historico">Ver histórico clínico</Link>}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero alertas-hero">
          <div>
            <span className="supervisao-kicker">Supervisão ativa</span>
            <h2>{resumo.total} alerta(s) no filtro</h2>
            <p>
              Os alertas respeitam a direção de cada indicador clínico: alguns sinalizam risco quando sobem, outros quando caem.
            </p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <>
                <label>
                  <span>Clínica</span>
                  <select value={filters.clinicaId} onChange={(event) => updateFilter("clinicaId", event.target.value)}>
                    <option value="">Todas</option>
                    {clinicas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}
                  </select>
                </label>

                <label>
                  <span>Terapeuta</span>
                  <select value={filters.terapeutaId} onChange={(event) => updateFilter("terapeutaId", event.target.value)}>
                    <option value="">Todos</option>
                    {terapeutasFiltrados.map((terapeuta) => <option key={terapeuta.id} value={terapeuta.id}>{terapeuta.nome}</option>)}
                  </select>
                </label>

                <label>
                  <span>Paciente</span>
                  <select value={filters.pacienteId} onChange={(event) => updateFilter("pacienteId", event.target.value)}>
                    <option value="">Todos</option>
                    {pacientesFiltrados.map((paciente) => <option key={paciente.id} value={paciente.id}>{paciente.nome}</option>)}
                  </select>
                </label>
              </>
            )}
          />
        </section>

        <section className="supervisao-filters alertas-extra-filters">
          <label>
            <span>Nível</span>
            <select value={filters.nivel} onChange={(event) => updateFilter("nivel", event.target.value)}>
              <option value="">Todos</option>
              {Object.entries(ALERT_LEVELS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
            </select>
          </label>

          <label>
            <span>Tipo</span>
            <select value={filters.tipo} onChange={(event) => updateFilter("tipo", event.target.value)}>
              <option value="">Todos</option>
              {tipoOptions().map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando alertas...</p></section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Alertas no filtro" value={resumo.total} detail={`${resumoGeral.total} alerta(s) no período-base`} />
              <CardIndicador label="Alto" value={resumo.alto} detail="prioridade imediata" />
              <CardIndicador label="Médio" value={resumo.medio} detail="acompanhar de perto" />
              <CardIndicador label="Baixo" value={resumo.baixo} detail="monitoramento" />
              <CardIndicador label="Pacientes impactados" value={resumo.pacientes} detail="com ao menos um alerta" />
              <CardIndicador label="Terapeutas envolvidos" value={resumo.terapeutas} detail="com alertas vinculados" />
            </section>

            <section className="supervisao-presentation-grid alertas-charts-grid">
              <ChartPanel title="Alertas por nível" subtitle="Distribuição de prioridade" action={`${resumo.total} ativo(s)`}>
                <DonutChart items={resumo.niveis} />
              </ChartPanel>

              <ChartPanel title="Tipos de alerta" subtitle="Principais motivos de atenção" action={`${resumo.tipos.length} tipo(s)`}>
                <HorizontalBars
                  items={resumo.tipos.slice(0, 8)}
                  valueKey="value"
                  labelKey="label"
                  valueFormatter={(value) => String(value)}
                />
              </ChartPanel>

              <ChartPanel title="Alertas por clínica" subtitle="Onde os alertas estão concentrados" action={`${resumo.clinicas.length} clínica(s)`}>
                <HorizontalBars
                  items={resumo.clinicas.slice(0, 8)}
                  valueKey="value"
                  labelKey="label"
                  valueFormatter={(value) => String(value)}
                />
              </ChartPanel>
            </section>

            <section className="supervisao-panel dashboard-lower">
              <div className="supervisao-section-title">
                <h2>Lista de alertas</h2>
                <span>{alertasFiltrados.length} alerta(s)</span>
              </div>

              {alertasFiltrados.length ? (
                <div className="supervisao-alert-list">
                  {alertasFiltrados.map((alerta) => (
                    <AlertCard key={alerta.id} alerta={alerta} onOpen={setAlertaAberto} />
                  ))}
                </div>
              ) : (
                <p className="supervisao-empty">Nenhum alerta encontrado para os filtros selecionados.</p>
              )}
            </section>
          </>
        )}
      </LayoutSupervisao>

      <AlertDetailModal alerta={alertaAberto} onClose={() => setAlertaAberto(null)} />
    </>
  );
}