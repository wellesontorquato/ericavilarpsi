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
  isPlanoAberto,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

export default function SupervisaoTerapeutasDashboardPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <TerapeutasDashboardContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function TerapeutasDashboardContent({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({ ano: String(currentYear), mes: "", semana: "", terapeutaId: "" });

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

  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const lancamentosFiltrados = useMemo(() => filterLancamentos(lancamentos, filters), [lancamentos, filters]);

  const pacientesDoTerapeuta = useMemo(() => {
    const pacientesComRegistro = new Set(lancamentosFiltrados.map((item) => item.pacienteId).filter(Boolean));
    return pacientes.filter((paciente) => {
      if (filters.terapeutaId && paciente.terapeutaId !== filters.terapeutaId) return false;
      if (!filters.terapeutaId && !pacientesComRegistro.has(paciente.id)) return false;
      return paciente.statusCaso !== "Encerrado";
    });
  }, [pacientes, filters.terapeutaId, lancamentosFiltrados]);

  const metricas = useMemo(() => {
    return {
      terapeutasComRegistro: new Set(lancamentosFiltrados.map((item) => item.terapeutaId).filter(Boolean)).size,
      pacientesAcompanhados: new Set(lancamentosFiltrados.map((item) => item.pacienteId).filter(Boolean)).size || pacientesDoTerapeuta.length,
      mediaCompetencias: average(lancamentosFiltrados.map(competenciaMedia)),
      mediaEvolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,
      lancamentos: lancamentosFiltrados.length,
    };
  }, [lancamentosFiltrados, pacientesDoTerapeuta.length]);

  const resumoTerapeutas = useMemo(() => {
    return terapeutas.map((terapeuta) => {
      const registros = filterLancamentos(lancamentos, { ...filters, terapeutaId: terapeuta.id });
      return {
        id: terapeuta.id,
        label: terapeuta.nome,
        registros: registros.length,
        pacientes: new Set(registros.map((item) => item.pacienteId).filter(Boolean)).size,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.registros > 0).sort((a, b) => b.competencia - a.competencia);
  }, [terapeutas, lancamentos, filters]);

  const resumoPacientes = useMemo(() => {
    return pacientesDoTerapeuta.map((paciente) => {
      const registros = lancamentosFiltrados.filter((item) => item.pacienteId === paciente.id);
      return {
        id: paciente.id,
        label: paciente.nome,
        registros: registros.length,
        evolucao: average(registros.map(evolucaoMedia)),
        competencia: average(registros.map(competenciaMedia)),
      };
    }).filter((item) => item.registros > 0).sort((a, b) => b.evolucao - a.evolucao);
  }, [pacientesDoTerapeuta, lancamentosFiltrados]);

  const ultimasDevolutivas = useMemo(() => sortByPeriodDesc(lancamentosFiltrados).filter((item) => item.pontoDesenvolver || item.recomendacao || item.planoAcao).slice(0, 6), [lancamentosFiltrados]);
  const tendencia = useMemo(() => buildTendencia(lancamentosFiltrados, filters), [lancamentosFiltrados, filters]);
  const competenciaRadar = useMemo(() => buildRadar(lancamentosFiltrados), [lancamentosFiltrados]);
  const statusPlano = useMemo(() => buildStatusPlano(lancamentosFiltrados), [lancamentosFiltrados]);

  return (
    <>
      <Head><title>Dashboard por terapeuta | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Dashboard por terapeuta"
        description="Acompanhamento do desenvolvimento técnico, carga de casos, evolução dos pacientes e planos de ação por terapeuta."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão técnica</span>
            <h2>{selectedName(terapeutas, filters.terapeutaId, "Todos os terapeutas")}</h2>
            <p>{filters.mes ? mesNome(filters.mes) : "Todos os meses"} {filters.ano && `· ${filters.ano}`} · leitura de competência, evolução dos casos e prioridades de desenvolvimento.</p>
          </div>
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <label>
                <span>Terapeuta</span>
                <select value={filters.terapeutaId} onChange={(event) => setFilters((current) => ({ ...current, terapeutaId: event.target.value }))}>
                  <option value="">Todos</option>
                  {terapeutas.map((terapeuta) => <option key={terapeuta.id} value={terapeuta.id}>{terapeuta.nome}</option>)}
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
              <CardIndicador label="Terapeutas" value={metricas.terapeutasComRegistro || resumoTerapeutas.length} detail="com registro no período" />
              <CardIndicador label="Pacientes" value={metricas.pacientesAcompanhados} detail="acompanhados" />
              <CardIndicador label="Lançamentos" value={metricas.lancamentos} detail="registros semanais" />
              <CardIndicador label="Competência" value={formatDecimal(metricas.mediaCompetencias)} detail="média 1 a 5" />
              <CardIndicador label="Evolução" value={formatPercent(metricas.mediaEvolucao)} detail="média dos casos" />
              <CardIndicador label="Planos abertos" value={metricas.planosAbertos} detail="ações pendentes" />
              <CardIndicador label="Pacientes avaliados" value={resumoPacientes.length} detail="com lançamento" />
              <CardIndicador label="Devolutivas" value={ultimasDevolutivas.length} detail="com ação registrada" />
            </section>

            <section className="supervisao-presentation-grid">
              <ChartPanel title="Nível técnico do terapeuta" subtitle="Média das competências clínicas" action={`${formatDecimal(metricas.mediaCompetencias)} / 5`}>
                <ProgressRing value={metricas.mediaCompetencias} max={5} suffix="" label="competência" detail="Pontuação consolidada da matriz técnica da supervisão." />
              </ChartPanel>

              <ChartPanel title="Radar de competências" subtitle="Pontos fortes e pontos de desenvolvimento" action="escala 1 a 5">
                <RadarChart items={competenciaRadar} />
              </ChartPanel>

              <ChartPanel title="Tendência de desempenho" subtitle={filters.mes ? "Comparativo por semana" : "Comparativo por mês"} action="competência x evolução">
                <TrendLine items={tendencia} valueKey="competencia" secondaryKey="evolucao" labelKey="label" />
              </ChartPanel>

              <ChartPanel title="Comparativo entre terapeutas" subtitle="Competência média no período" action={`${resumoTerapeutas.length} ativos`}>
                <ColumnChart items={resumoTerapeutas} valueKey="competencia" labelKey="label" valueFormatter={(value) => `${formatDecimal(value)}`} />
              </ChartPanel>
            </section>

            <div className="supervisao-grid-two dashboard-lower">
              <ChartPanel title="Pacientes por evolução" subtitle="Resultado médio dos casos acompanhados" action={`${resumoPacientes.length} pacientes`}>
                <HorizontalBars
                  items={resumoPacientes.slice(0, 8)}
                  valueKey="evolucao"
                  labelKey="label"
                  max={100}
                  valueFormatter={formatPercent}
                />
              </ChartPanel>

              <ChartPanel title="Status dos planos" subtitle="Ações combinadas na supervisão" action={`${metricas.planosAbertos} abertos`}>
                <DonutChart items={statusPlano} />
              </ChartPanel>
            </div>

            <div className="supervisao-grid-two dashboard-lower">
              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Prioridades de desenvolvimento</h2>
                  <span>{ultimasDevolutivas.length}</span>
                </div>
                <div className="supervisao-insight-list">
                  {ultimasDevolutivas.map((item) => (
                    <article key={item.id}>
                      <strong>{item.pontoDesenvolver || "Ponto a desenvolver"}</strong>
                      <span>{item.terapeutaNome || "Terapeuta"} · {item.pacienteNome || "Paciente/caso"}</span>
                      <p>{item.recomendacao || item.planoAcao || item.observacao || "Sem recomendação registrada."}</p>
                    </article>
                  ))}
                  {ultimasDevolutivas.length === 0 && <p className="supervisao-empty">Nenhuma devolutiva registrada no período.</p>}
                </div>
              </section>

              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Resumo por terapeuta</h2>
                  <span>{resumoTerapeutas.length}</span>
                </div>
                <div className="supervisao-table-wrap">
                  <table className="supervisao-table">
                    <thead>
                      <tr>
                        <th>Terapeuta</th>
                        <th>Pacientes</th>
                        <th>Registros</th>
                        <th>Competência</th>
                        <th>Evolução</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumoTerapeutas.map((item) => (
                        <tr key={item.id}>
                          <td>{item.label}</td>
                          <td>{item.pacientes}</td>
                          <td>{item.registros}</td>
                          <td>{formatDecimal(item.competencia)}</td>
                          <td>{formatPercent(item.evolucao)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {resumoTerapeutas.length === 0 && <p className="supervisao-empty">Nenhum terapeuta com lançamento no filtro selecionado.</p>}
                </div>
              </section>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}
