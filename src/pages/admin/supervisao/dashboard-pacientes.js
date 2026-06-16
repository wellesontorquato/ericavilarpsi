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
import {
  ChartPanel,
  DonutChart,
  HorizontalBars,
  ProgressRing,
  RadarChart,
  TrendLine,
} from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatDecimal, formatPercent, mesNome } from "@/lib/supervisao/format";
import {
  buildRadar,
  buildStatusPlano,
  competenciaMedia,
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
      adesao: normalizedPercent(item.adesaoTarefas, 100),
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
  const lancamentosFiltrados = useMemo(() => filterLancamentos(lancamentos, filters), [lancamentos, filters]);

  const metricas = useMemo(() => {
    return {
      registros: lancamentosFiltrados.length,
      competencia: average(lancamentosFiltrados.map(competenciaMedia)),
      evolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      adesao: average(lancamentosFiltrados.map((item) => item.adesaoTarefas)),
      objetivos: average(lancamentosFiltrados.map((item) => item.evolucaoObjetivos)),
      sonoAtual: latestNumber(lancamentosFiltrados, "qualidadeSono"),
      sintomasAtual: latestNumber(lancamentosFiltrados, "intensidadeSintomas"),
      crisesAtual: latestNumber(lancamentosFiltrados, "crisesAnsiedade"),
    };
  }, [lancamentosFiltrados]);

  const resumoPacientes = useMemo(() => {
    return pacientes.map((paciente) => {
      const registros = filterLancamentos(lancamentos, { ...filters, pacienteId: paciente.id });
      return {
        id: paciente.id,
        label: paciente.nome,
        registros: registros.length,
        evolucao: average(registros.map(evolucaoMedia)),
        adesao: average(registros.map((item) => item.adesaoTarefas)),
      };
    }).filter((item) => item.registros > 0).sort((a, b) => b.evolucao - a.evolucao);
  }, [pacientes, lancamentos, filters]);

  const indicadoresAtuais = useMemo(() => {
    return [
      { id: "sono", label: "Qualidade do sono", value: latestNumber(lancamentosFiltrados, "qualidadeSono"), max: 10, formatter: (value) => `${formatDecimal(value)} / 10` },
      { id: "adesao", label: "Adesão às tarefas", value: latestNumber(lancamentosFiltrados, "adesaoTarefas"), max: 100, formatter: formatPercent },
      { id: "objetivos", label: "Objetivos terapêuticos", value: latestNumber(lancamentosFiltrados, "evolucaoObjetivos"), max: 100, formatter: formatPercent },
      { id: "sintomas", label: "Sintomas invertido", value: normalizedPercent(latestNumber(lancamentosFiltrados, "intensidadeSintomas"), 10, true), max: 100, formatter: formatPercent },
      { id: "evitacao", label: "Evitação invertida", value: normalizedPercent(latestNumber(lancamentosFiltrados, "evitacaoSocial"), 10, true), max: 100, formatter: formatPercent },
    ];
  }, [lancamentosFiltrados]);

  const tendenciaPaciente = useMemo(() => buildPacienteTendencia(lancamentosFiltrados), [lancamentosFiltrados]);
  const competenciaRadar = useMemo(() => buildRadar(lancamentosFiltrados), [lancamentosFiltrados]);
  const statusPlano = useMemo(() => buildStatusPlano(lancamentosFiltrados), [lancamentosFiltrados]);
  const historico = useMemo(() => sortByPeriodDesc(lancamentosFiltrados).slice(0, 8), [lancamentosFiltrados]);

  return (
    <>
      <Head><title>Dashboard por paciente | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Dashboard por paciente"
        description="Leitura clínica individual do caso: evolução, adesão, sintomas, objetivos terapêuticos e histórico das recomendações."
        user={user}
        onLogout={onLogout}
        actions={(
          <div className="supervisao-header-action-group">
            <Link className="supervisao-secondary-button" href="/admin/supervisao/historico">Ver histórico clínico</Link>
            <Link className="supervisao-secondary-button" href="/admin/supervisao/alertas">Ver alertas</Link>
          </div>
        )}
      >
        <StatusMessage message={message} />

        {/* HERO E FILTROS FIXOS */}
        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão do caso</span>
            <h2>{selectedName(pacientes, filters.pacienteId, "Todos os pacientes")}</h2>
            <p>{pacienteSelecionado ? `${pacienteSelecionado.statusCaso || "Status não informado"} · ${pacienteSelecionado.nivelAtencao || "atenção não informada"}` : "Selecione um paciente para ver o histórico individual do caso."}</p>
          </div>
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <label>
                <span>Paciente</span>
                <select value={filters.pacienteId} onChange={(event) => setFilters((current) => ({ ...current, pacienteId: event.target.value }))}>
                  <option value="">Todos</option>
                  {pacientes.map((paciente) => <option key={paciente.id} value={paciente.id}>{paciente.nome}</option>)}
                </select>
              </label>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando dashboard...</p></section>
        ) : (
          <>
            {/* LINHA 1: KPIs Rápidos */}
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Registros" value={metricas.registros} detail="lançamentos no período" />
              <CardIndicador label="Evolução média" value={formatPercent(metricas.evolucao)} detail="score clínico" />
              <CardIndicador label="Adesão média" value={formatPercent(metricas.adesao)} detail="tarefas/intervenções" />
              <CardIndicador label="Objetivos" value={formatPercent(metricas.objetivos)} detail="avanço terapêutico" />
              <CardIndicador label="Sono atual" value={formatDecimal(metricas.sonoAtual)} detail="escala 0 a 10" />
              <CardIndicador label="Sintomas atuais" value={formatDecimal(metricas.sintomasAtual)} detail="0 menor · 10 maior" />
              <CardIndicador label="Crises atuais" value={formatDecimal(metricas.crisesAtual)} detail="por semana" />
              <CardIndicador label="Competência no caso" value={formatDecimal(metricas.competencia)} detail="média do terapeuta" />
            </section>

            {/* BENTO BOX GRID 1: Gráficos Principais */}
            <section className="supervisao-presentation-grid">
              
              {/* Tendência (Largo - 8 Colunas) */}
              <ChartPanel title="Histórico de evolução" subtitle="Evolução e objetivos ao longo das semanas" action="evolução x objetivos">
                <TrendLine items={tendenciaPaciente} valueKey="evolucao" secondaryKey="objetivos" labelKey="label" />
              </ChartPanel>

              {/* Saúde Geral (Estreito - 4 Colunas) */}
              <ChartPanel title="Evolução do caso" subtitle="Score consolidado do paciente no período" action={formatPercent(metricas.evolucao)}>
                <ProgressRing value={metricas.evolucao} label="evolução" detail="Quanto maior, melhor o estado geral do caso acompanhado." />
              </ChartPanel>

              {/* Radar (Estreito - 4 Colunas) */}
              <ChartPanel title="Competências no caso" subtitle="Leitura técnica do terapeuta neste acompanhamento" action={`${formatDecimal(metricas.competencia)} / 5`}>
                <RadarChart items={competenciaRadar} />
              </ChartPanel>

              {/* Indicadores atuais (Largo - 8 Colunas) */}
              <ChartPanel title="Indicadores atuais" subtitle="Últimos valores registrados para o paciente" action="última semana lançada">
                <HorizontalBars
                  items={indicadoresAtuais}
                  valueKey="value"
                  labelKey="label"
                  max={100}
                  valueFormatter={(value, item) => item?.formatter ? item.formatter(value) : formatPercent(value)}
                />
              </ChartPanel>
            </section>

            {/* BENTO BOX GRID 2: Análises Aprofundadas */}
            <div className="supervisao-grid-two dashboard-lower">
              <ChartPanel title="Pacientes por evolução" subtitle="Comparativo geral quando nenhum paciente está selecionado" action={`${resumoPacientes.length} pacientes`}>
                <HorizontalBars
                  items={resumoPacientes.slice(0, 8)}
                  valueKey="evolucao"
                  labelKey="label"
                  max={100}
                  valueFormatter={formatPercent}
                />
              </ChartPanel>

              <ChartPanel title="Status do plano" subtitle="Ações combinadas para o caso" action={`${historico.length} registros`}>
                <DonutChart items={statusPlano} />
              </ChartPanel>
            </div>

            {/* PAINÉIS DE ROTINA CLÍNICA E LISTAGENS */}
            <div className="supervisao-grid-two dashboard-lower">
              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Resumo do caso</h2>
                  <span>{pacienteSelecionado ? "selecionado" : "geral"}</span>
                </div>
                <div className="supervisao-focus-card">
                  <strong>{pacienteSelecionado?.nome || "Selecione um paciente"}</strong>
                  <span>{pacienteSelecionado?.terapeutaNome || "Terapeuta não informado"} · {pacienteSelecionado?.statusCaso || "Status não informado"}</span>
                  <p>{pacienteSelecionado?.queixaPrincipal || "A queixa principal aparecerá aqui quando o paciente estiver cadastrado e selecionado."}</p>
                  <p>{pacienteSelecionado?.objetivosTerapeuticos || "Os objetivos terapêuticos cadastrados serão exibidos neste bloco."}</p>
                </div>
              </section>

              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Histórico semanal</h2>
                  <span>{historico.length}</span>
                </div>
                <TimelineLancamentos
                  items={historico}
                  emptyText="Nenhum lançamento encontrado para o filtro selecionado."
                  limit={8}
                />
              </section>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}