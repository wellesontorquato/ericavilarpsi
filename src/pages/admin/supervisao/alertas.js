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
      </dl>

      <footer>
        <button type="button" className="supervisao-mini-action" onClick={() => onOpen(alerta)}>
          Ver detalhes
        </button>
        <Link href={alerta.actionHref} className="supervisao-mini-action" style={{ background: "transparent", border: "1px solid var(--sup-line)" }}>
          Abrir histórico
        </Link>
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
  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const terapeutasFiltrados = useMemo(() => {
    if (!filters.clinicaId) return terapeutas;
    return terapeutas.filter((item) => safeId(item.clinicaId) === safeId(filters.clinicaId));
  }, [terapeutas, filters.clinicaId]);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((item) => {
      if (filters.clinicaId && safeId(item.clinicaId) !== safeId(filters.clinicaId)) return false;
      if (filters.terapeutaId && safeId(item.terapeutaId) !== safeId(filters.terapeutaId)) return false;
      return true;
    });
  }, [pacientes, filters.clinicaId, filters.terapeutaId]);

  const alertasCalculados = useMemo(() => {
    return buildAlertasSupervisao({ clinicas, terapeutas, pacientes, lancamentos, filters });
  }, [clinicas, terapeutas, pacientes, lancamentos, filters]);

  const alertasFiltrados = useMemo(() => {
    return filterAlertas(alertasCalculados, filters);
  }, [alertasCalculados, filters]);

  // ORDENAÇÃO: Força os alertas "Alto" a ficarem sempre no topo da lista
  const alertasOrdenados = useMemo(() => {
    const pesos = { alto: 3, medio: 2, baixo: 1 };
    return [...alertasFiltrados].sort((a, b) => (pesos[b.level] || 0) - (pesos[a.level] || 0));
  }, [alertasFiltrados]);

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
        title="Monitoramento e Alertas"
        description="Identificação automática de casos que precisam de atenção clínica imediata."
        user={user}
        onLogout={onLogout}
        actions={<Link className="supervisao-secondary-button" href="/admin/supervisao/historico">Ver histórico clínico</Link>}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero alertas-hero">
          <div>
            <span className="supervisao-kicker">Supervisão ativa</span>
            <h2>{resumo.total} alerta(s) pendentes</h2>
            <p>
              Avalie os desvios de rota clínica. Casos com sinalização vermelha requerem intervenção técnica junto ao terapeuta responsável.
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
                {/* Filtros unificados na mesma caixa */}
                <label>
                  <span>Nível Crítico</span>
                  <select value={filters.nivel} onChange={(event) => updateFilter("nivel", event.target.value)}>
                    <option value="">Todos os níveis</option>
                    {Object.entries(ALERT_LEVELS).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}
                  </select>
                </label>
                <label>
                  <span>Tipo de Alerta</span>
                  <select value={filters.tipo} onChange={(event) => updateFilter("tipo", event.target.value)}>
                    <option value="">Todos os motivos</option>
                    {tipoOptions().map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                </label>
              </>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando monitoramento...</p></section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Total no filtro" value={resumo.total} detail={`${resumoGeral.total} alerta(s) no período-base`} />
              <CardIndicador label="Atenção Imediata" value={resumo.alto} detail="casos com prioridade alta" />
              <CardIndicador label="Pacientes afetados" value={resumo.pacientes} detail="com ao menos um alerta" />
              <CardIndicador label="Terapeutas notificados" value={resumo.terapeutas} detail="responsáveis pelos casos" />
            </section>

            <section className="bento-grid" style={{ marginBottom: '24px' }}>
              <div className="bento-col bento-4">
                <ChartPanel title="Distribuição de Nível" subtitle="Volume por gravidade">
                  <DonutChart items={resumo.niveis} />
                </ChartPanel>
              </div>

              <div className="bento-col bento-8">
                <ChartPanel title="Motivos Recorrentes" subtitle="Tipos de alerta mais acionados na operação">
                  <HorizontalBars
                    items={resumo.tipos.slice(0, 5)} // Limitado a 5 para não ficar alto demais
                    valueKey="value"
                    labelKey="label"
                    valueFormatter={(value) => String(value)}
                  />
                </ChartPanel>
              </div>
            </section>

            <section className="supervisao-panel dashboard-lower">
              <div className="supervisao-section-title" style={{ marginBottom: '20px' }}>
                <h2>Fila de Intervenção</h2>
                <span style={{ color: 'var(--sup-muted)', fontSize: '0.9rem' }}>Ordenado por gravidade</span>
              </div>

              {alertasOrdenados.length ? (
                <div className="supervisao-alert-list">
                  {alertasOrdenados.map((alerta) => (
                    <AlertCard key={alerta.id} alerta={alerta} onOpen={setAlertaAberto} />
                  ))}
                </div>
              ) : (
                <p className="supervisao-empty" style={{ textAlign: 'center', padding: '40px' }}>
                  Nenhum alerta crítico encontrado para este recorte.
                </p>
              )}
            </section>
          </>
        )}
      </LayoutSupervisao>

      <AlertDetailModal alerta={alertaAberto} onClose={() => setAlertaAberto(null)} />
    </>
  );
}