import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import {
  ChartPanel,
  ColumnChart,
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
  buildTendencia,
  competenciaMedia,
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  isCasoAtencao,
  isPlanoAberto,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

export default function SupervisaoClinicasDashboardPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <ClinicasDashboardContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function ClinicasDashboardContent({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({ ano: String(currentYear), mes: "", semana: "", clinicaId: "" });

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

  const lancamentosFiltrados = useMemo(() => filterLancamentos(lancamentos, filters), [lancamentos, filters]);

  const pacientesDaClinica = useMemo(() => {
    return pacientes.filter((paciente) => !filters.clinicaId || paciente.clinicaId === filters.clinicaId);
  }, [pacientes, filters.clinicaId]);

  const terapeutasDaClinica = useMemo(() => {
    return terapeutas.filter((terapeuta) => !filters.clinicaId || terapeuta.clinicaId === filters.clinicaId);
  }, [terapeutas, filters.clinicaId]);

  const metricas = useMemo(() => {
    const pacientesAtivos = pacientesDaClinica.filter((item) => item.statusCaso !== "Encerrado").length;
    const casosAtencao = pacientesDaClinica.filter(isCasoAtencao).length;
    return {
      pacientesAtivos,
      terapeutasAtivos: terapeutasDaClinica.filter((item) => item.status !== "Inativo").length,
      mediaCompetencias: average(lancamentosFiltrados.map(competenciaMedia)),
      mediaEvolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,
      casosAtencao,
    };
  }, [lancamentosFiltrados, pacientesDaClinica, terapeutasDaClinica]);

  const resumoClinicas = useMemo(() => {
    return clinicas.map((clinica) => {
      const registros = filterLancamentos(lancamentos, { ...filters, clinicaId: clinica.id });
      const pacientesClinica = pacientes.filter((item) => item.clinicaId === clinica.id && item.statusCaso !== "Encerrado");
      return {
        id: clinica.id,
        label: clinica.nome,
        registros: registros.length,
        pacientes: pacientesClinica.length,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.registros > 0 || item.pacientes > 0).sort((a, b) => b.registros - a.registros);
  }, [clinicas, lancamentos, pacientes, filters]);

  const resumoTerapeutas = useMemo(() => {
    return terapeutasDaClinica.map((terapeuta) => {
      const registros = lancamentosFiltrados.filter((item) => item.terapeutaId === terapeuta.id);
      return {
        id: terapeuta.id,
        label: terapeuta.nome,
        registros: registros.length,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.registros > 0).sort((a, b) => b.registros - a.registros);
  }, [terapeutasDaClinica, lancamentosFiltrados]);

  const casosAtencaoLista = useMemo(() => {
    return pacientesDaClinica.filter(isCasoAtencao).slice(0, 6);
  }, [pacientesDaClinica]);

  const ultimosLancamentos = useMemo(() => sortByPeriodDesc(lancamentosFiltrados).slice(0, 6), [lancamentosFiltrados]);
  const tendencia = useMemo(() => buildTendencia(lancamentosFiltrados, filters), [lancamentosFiltrados, filters]);
  const competenciaRadar = useMemo(() => buildRadar(lancamentosFiltrados), [lancamentosFiltrados]);
  const statusPlano = useMemo(() => buildStatusPlano(lancamentosFiltrados), [lancamentosFiltrados]);

  return (
    <>
      <Head><title>Dashboard por clínica | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Dashboard por clínica"
        description="Visão executiva para acompanhar a saúde geral da clínica, volume de supervisões, casos em atenção e desempenho da equipe."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão macro</span>
            <h2>{selectedName(clinicas, filters.clinicaId, "Todas as clínicas")}</h2>
            <p>{filters.mes ? mesNome(filters.mes) : "Todos os meses"} {filters.ano && `· ${filters.ano}`} · análise por clínica, equipe e casos ativos.</p>
          </div>
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <label>
                <span>Clínica</span>
                <select value={filters.clinicaId} onChange={(event) => setFilters((current) => ({ ...current, clinicaId: event.target.value }))}>
                  <option value="">Todas</option>
                  {clinicas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}
                </select>
              </label>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando dashboard...</p></section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Pacientes ativos" value={metricas.pacientesAtivos} detail="em acompanhamento" />
              <CardIndicador label="Terapeutas ativos" value={metricas.terapeutasAtivos} detail="vinculados à clínica" />
              <CardIndicador label="Lançamentos" value={lancamentosFiltrados.length} detail="no período filtrado" />
              <CardIndicador label="Evolução média" value={formatPercent(metricas.mediaEvolucao)} detail="score clínico" />
              <CardIndicador label="Competências" value={formatDecimal(metricas.mediaCompetencias)} detail="média 1 a 5" />
              <CardIndicador label="Casos em atenção" value={metricas.casosAtencao} detail="nível alto/urgente" />
              <CardIndicador label="Planos abertos" value={metricas.planosAbertos} detail="ações pendentes" />
              <CardIndicador label="Clínicas comparadas" value={resumoClinicas.length} detail="com dados no período" />
            </section>

            <section className="supervisao-presentation-grid">
              <ChartPanel title="Saúde geral da clínica" subtitle="Score de evolução dos casos acompanhados" action={formatPercent(metricas.mediaEvolucao)}>
                <ProgressRing value={metricas.mediaEvolucao} label="evolução" detail="Consolida sono, adesão, objetivos, sintomas e evitação." />
              </ChartPanel>

              <ChartPanel title="Radar da equipe" subtitle="Média das competências dos terapeutas" action={`${formatDecimal(metricas.mediaCompetencias)} / 5`}>
                <RadarChart items={competenciaRadar} />
              </ChartPanel>

              <ChartPanel title="Tendência da clínica" subtitle={filters.mes ? "Evolução por semana" : "Evolução por mês"} action="evolução x competência">
                <TrendLine items={tendencia} valueKey="evolucao" secondaryKey="competencia" labelKey="label" />
              </ChartPanel>

              <ChartPanel title="Comparativo entre clínicas" subtitle="Evolução média por unidade" action={`${resumoClinicas.length} clínicas`}>
                <ColumnChart items={resumoClinicas} valueKey="evolucao" labelKey="label" valueFormatter={formatPercent} />
              </ChartPanel>
            </section>

            <div className="supervisao-grid-two dashboard-lower">
              <ChartPanel title="Terapeutas da clínica" subtitle="Competência média por profissional" action={`${resumoTerapeutas.length} com registro`}>
                <HorizontalBars
                  items={resumoTerapeutas.slice(0, 8)}
                  valueKey="competencia"
                  labelKey="label"
                  max={5}
                  valueFormatter={(value) => `${formatDecimal(value)} / 5`}
                />
              </ChartPanel>

              <ChartPanel title="Status dos planos" subtitle="Distribuição das ações de desenvolvimento" action={`${lancamentosFiltrados.length} registros`}>
                <DonutChart items={statusPlano} />
              </ChartPanel>
            </div>

            <div className="supervisao-grid-two dashboard-lower">
              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Casos em atenção</h2>
                  <span>{casosAtencaoLista.length}</span>
                </div>
                <div className="supervisao-insight-list">
                  {casosAtencaoLista.map((paciente) => (
                    <article key={paciente.id}>
                      <strong>{paciente.nome}</strong>
                      <span>{paciente.terapeutaNome || "Terapeuta não informado"} · {paciente.nivelAtencao}</span>
                      <p>{paciente.queixaPrincipal || paciente.objetivosTerapeuticos || "Sem observação clínica cadastrada."}</p>
                    </article>
                  ))}
                  {casosAtencaoLista.length === 0 && <p className="supervisao-empty">Nenhum caso de alta atenção para o filtro selecionado.</p>}
                </div>
              </section>

              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Últimos movimentos</h2>
                  <span>{ultimosLancamentos.length}</span>
                </div>
                <div className="supervisao-timeline compact-list">
                  {ultimosLancamentos.map((item) => (
                    <article key={item.id}>
                      <strong>{item.pacienteNome || "Paciente/caso"}</strong>
                      <span>{item.clinicaNome || "Clínica"} · {item.terapeutaNome || "Terapeuta"} · {item.ano}/{item.mes} · S{item.semana}</span>
                      <p>{item.recomendacao || item.planoAcao || item.observacao || "Sem observação registrada."}</p>
                    </article>
                  ))}
                  {ultimosLancamentos.length === 0 && <p className="supervisao-empty">Nenhum lançamento semanal encontrado.</p>}
                </div>
              </section>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}
