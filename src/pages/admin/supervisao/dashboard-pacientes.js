import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { TimelineLancamentos } from "@/components/supervisao/TimelineLancamentos";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import { ChartPanel, HorizontalBars, TrendLine } from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatDecimal, formatPercent, mesNome } from "@/lib/supervisao/format";
import {
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  normalizedPercent,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

function latestNumber(items, field) {
  const latest = sortByPeriodDesc(items).find((item) => item[field] !== "" && item[field] !== undefined && item[field] !== null);
  const value = Number(latest?.[field]);
  return Number.isFinite(value) ? value : 0;
}

function buildPacienteTendencia(lancamentos) {
  return sortByPeriodDesc(lancamentos)
    .reverse()
    .map((item) => ({
      id: item.id,
      label: `${item.mes || "-"}/S${item.semana || "-"}`,
      evolucao: evolucaoMedia(item),
      objetivos: normalizedPercent(item.evolucaoObjetivos, 100),
    }));
}

export default function SupervisaoPacientesDashboardPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <PacientesDashboardContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function PacientesDashboardContent({ user, onLogout }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({ ano: String(currentYear), mes: "", semana: "", pacienteId: "" });

  useEffect(() => {
    if (!router.isReady || !router.query.pacienteId) return;
    const pacienteId = Array.isArray(router.query.pacienteId) ? router.query.pacienteId[0] : router.query.pacienteId;
    setFilters((current) => ({ ...current, pacienteId: pacienteId || current.pacienteId }));
  }, [router.isReady, router.query.pacienteId]);

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

  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);
  const pacienteSelecionado = pacientes.find((item) => item.id === filters.pacienteId);
  
  // Força o filtro do paciente selecionado, ignorando os outros casos
  const lancamentosFiltrados = useMemo(() => {
    if (!filters.pacienteId) return [];
    return filterLancamentos(lancamentos, filters);
  }, [lancamentos, filters]);

  const metricas = useMemo(() => {
    return {
      evolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      sintomasAtual: latestNumber(lancamentosFiltrados, "intensidadeSintomas"),
      crisesAtual: latestNumber(lancamentosFiltrados, "crisesAnsiedade"),
      sonoAtual: latestNumber(lancamentosFiltrados, "qualidadeSono"),
    };
  }, [lancamentosFiltrados]);

  const indicadoresAtuais = useMemo(() => {
    return [
      { id: "sintomas", label: "Sintomas (escala de dor/intensidade)", value: metricas.sintomasAtual, max: 10, formatter: (v) => `${formatDecimal(v)} / 10` },
      { id: "sono", label: "Qualidade do sono", value: metricas.sonoAtual, max: 10, formatter: (v) => `${formatDecimal(v)} / 10` },
      { id: "crises", label: "Crises relatadas na semana", value: metricas.crisesAtual, max: 20, formatter: (v) => formatDecimal(v, 0) },
      { id: "adesao", label: "Adesão às tarefas", value: latestNumber(lancamentosFiltrados, "adesaoTarefas"), max: 100, formatter: formatPercent },
    ];
  }, [metricas, lancamentosFiltrados]);

  const tendenciaPaciente = useMemo(() => buildPacienteTendencia(lancamentosFiltrados), [lancamentosFiltrados]);
  const historico = useMemo(() => sortByPeriodDesc(lancamentosFiltrados).slice(0, 10), [lancamentosFiltrados]);

  return (
    <>
      <Head><title>Prontuário | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Progresso do Caso"
        description="Acompanhamento rápido dos sinais vitais clínicos e evolução dos objetivos."
        user={user}
        onLogout={onLogout}
        actions={pacienteSelecionado ? (
          <Link className="supervisao-secondary-button" href="/admin/supervisao/historico">Linha do Tempo</Link>
        ) : null}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Prontuário</span>
            <h2>{selectedName(pacientes, filters.pacienteId, "Selecione um Paciente")}</h2>
            <p>{pacienteSelecionado ? `${pacienteSelecionado.terapeutaNome || "Sem terapeuta"} · Nível: ${pacienteSelecionado.nivelAtencao || "Padrão"}` : "Escolha um paciente no filtro ao lado para visualizar os dados clínicos reais."}</p>
          </div>
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <label>
                <span>Paciente</span>
                <select value={filters.pacienteId} onChange={(e) => setFilters((c) => ({ ...c, pacienteId: e.target.value }))}>
                  <option value="">Selecione...</option>
                  {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </label>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando prontuário...</p></section>
        ) : !pacienteSelecionado ? (
          <section className="supervisao-panel" style={{ textAlign: "center", padding: "60px 20px" }}>
            <span style={{ fontSize: "3rem", display: "block", marginBottom: "16px" }}>👥</span>
            <h2>Nenhum paciente selecionado</h2>
            <p className="supervisao-empty">Selecione um paciente no filtro acima para visualizar o prontuário clínico detalhado, histórico de melhoria e diário de intervenções. Não exibimos dados acumulados aqui para não gerar distorções analíticas.</p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Evolução Atual" value={formatPercent(metricas.evolucao)} detail="score global do caso" />
              <CardIndicador label="Sintomas Atuais" value={formatDecimal(metricas.sintomasAtual)} detail="escala de 0 a 10" />
              <CardIndicador label="Crises Semanais" value={formatDecimal(metricas.crisesAtual, 0)} detail="relato do paciente" />
              <CardIndicador label="Supervisões" value={lancamentosFiltrados.length} detail="sessões avaliadas" />
            </section>

            <div className="bento-grid dashboard-lower">
              <div className="bento-col bento-8">
                <ChartPanel title="Histórico de Melhoria" subtitle="Acompanhamento de Evolução e Objetivos" action="tendência">
                  <TrendLine items={tendenciaPaciente} valueKey="evolucao" secondaryKey="objetivos" labelKey="label" />
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <section className="supervisao-panel h-full">
                  <div className="supervisao-section-title">
                    <h2>Resumo Estrutural</h2>
                  </div>
                  <div className="supervisao-focus-card">
                    <strong>Queixa Principal</strong>
                    <p>{pacienteSelecionado?.queixaPrincipal || "Nenhuma queixa cadastrada."}</p>
                    
                    <strong style={{ marginTop: '20px' }}>Objetivos Terapêuticos</strong>
                    <p>{pacienteSelecionado?.objetivosTerapeuticos || "Sem objetivos cadastrados."}</p>
                  </div>
                </section>
              </div>

              <div className="bento-col bento-6">
                <ChartPanel title="Sinais Vitais Clínicos" subtitle="Leitura do último encontro" action="panorama">
                  <HorizontalBars items={indicadoresAtuais} valueKey="value" labelKey="label" max={100} valueFormatter={(v, item) => item?.formatter ? item.formatter(v) : v} />
                </ChartPanel>
              </div>

              <div className="bento-col bento-6">
                <section className="supervisao-panel h-full">
                  <div className="supervisao-section-title">
                    <h2>Diário de Intervenções</h2>
                    <span>Últimos registros</span>
                  </div>
                  <TimelineLancamentos items={historico} emptyText="Sem histórico clínico para exibir." limit={4} />
                </section>
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}