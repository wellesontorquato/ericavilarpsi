import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
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
import { average, formatDecimal, formatPercent, mesNome, meses, semanas } from "@/lib/supervisao/format";

const currentYear = new Date().getFullYear();

const competencyFields = [
  ["qualidadeConceitualizacao", "Conceit."],
  ["planejamentoTerapeutico", "Planej."],
  ["aplicacaoTecnicasTcc", "Técnicas"],
  ["manejoSessao", "Manejo"],
  ["posturaTerapeutica", "Postura"],
  ["formulacaoHipoteses", "Hipóteses"],
];

function normalizedPercent(value, max = 10, invert = false) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  const adjusted = invert ? max - parsed : parsed;
  return Math.max(0, Math.min(100, (adjusted / max) * 100));
}

function competenciaMedia(item) {
  return average(competencyFields.map(([field]) => item[field]));
}

function evolucaoMedia(item) {
  return average([
    normalizedPercent(item.qualidadeSono, 10),
    normalizedPercent(item.adesaoTarefas, 100),
    normalizedPercent(item.evolucaoObjetivos, 100),
    normalizedPercent(item.intensidadeSintomas, 10, true),
    normalizedPercent(item.evitacaoSocial, 10, true),
  ]);
}

function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    if (!key) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

export default function SupervisaoDashboardPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <DashboardContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function DashboardContent({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({ ano: String(currentYear), mes: "", semana: "" });

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

  const lancamentosFiltrados = useMemo(() => {
    const lancamentos = data?.lancamentos || [];
    return lancamentos.filter((item) => {
      if (filters.ano && String(item.ano) !== String(filters.ano)) return false;
      if (filters.mes && String(item.mes) !== String(filters.mes)) return false;
      if (filters.semana && String(item.semana) !== String(filters.semana)) return false;
      return true;
    });
  }, [data, filters]);

  const metricas = useMemo(() => {
    const pacientesAtivos = (data?.pacientes || []).filter((item) => item.statusCaso !== "Encerrado").length;
    const mediaCompetencias = average(lancamentosFiltrados.map(competenciaMedia));
    const mediaEvolucao = average(lancamentosFiltrados.map(evolucaoMedia));
    const planosAbertos = lancamentosFiltrados.filter((item) => {
      const status = String(item.statusPlano || "").toLowerCase();
      return status && !["concluído", "concluido", "finalizado"].includes(status);
    }).length;
    const casosAtencao = (data?.pacientes || []).filter((item) => String(item.nivelAtencao || "").toLowerCase() === "alta").length;

    return {
      pacientesAtivos,
      mediaCompetencias,
      mediaEvolucao,
      planosAbertos,
      casosAtencao,
    };
  }, [data, lancamentosFiltrados]);

  const resumoTerapeutas = useMemo(() => {
    const terapeutas = data?.terapeutas || [];
    return terapeutas.map((terapeuta) => {
      const registros = lancamentosFiltrados.filter((item) => item.terapeutaId === terapeuta.id);
      return {
        id: terapeuta.id,
        label: terapeuta.nome,
        nome: terapeuta.nome,
        registros: registros.length,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.registros > 0).sort((a, b) => b.registros - a.registros);
  }, [data, lancamentosFiltrados]);

  const competenciaRadar = useMemo(() => {
    return competencyFields.map(([field, label]) => ({
      label,
      value: average(lancamentosFiltrados.map((item) => item[field])),
    }));
  }, [lancamentosFiltrados]);

  const tendencia = useMemo(() => {
    const usarSemana = Boolean(filters.mes);
    const groups = groupBy(lancamentosFiltrados, (item) => usarSemana ? item.semana : item.mes);
    const base = usarSemana ? semanas : meses;

    return base.map((item) => {
      const registros = groups[item.value] || [];
      return {
        id: item.value,
        label: usarSemana ? `S${item.value}` : mesNome(item.value).slice(0, 3),
        registros: registros.length,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.registros > 0);
  }, [lancamentosFiltrados, filters.mes]);

  const statusPlano = useMemo(() => {
    const groups = groupBy(lancamentosFiltrados, (item) => item.statusPlano || "Sem status");
    return Object.entries(groups).map(([label, items]) => ({ label, value: items.length }));
  }, [lancamentosFiltrados]);

  const resumoClinicas = useMemo(() => {
    const clinicas = data?.clinicas || [];
    return clinicas.map((clinica) => {
      const registros = lancamentosFiltrados.filter((item) => item.clinicaId === clinica.id);
      return {
        id: clinica.id,
        label: clinica.nome,
        value: registros.length,
      };
    }).filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
  }, [data, lancamentosFiltrados]);

  const anosDisponiveis = useMemo(() => {
    const anos = new Set((data?.lancamentos || []).map((item) => item.ano).filter(Boolean));
    anos.add(currentYear);
    return [...anos].sort((a, b) => Number(b) - Number(a));
  }, [data]);

  return (
    <>
      <Head><title>Dashboard | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Painel executivo da supervisão"
        description="Indicadores visuais para apresentar evolução dos casos, desenvolvimento dos terapeutas e status geral da clínica."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão de apresentação</span>
            <h2>{filters.mes ? mesNome(filters.mes) : "Todos os meses"} {filters.ano && `· ${filters.ano}`}</h2>
            <p>Use os filtros para alternar entre visão anual, mensal e semanal sem alterar a base de dados.</p>
          </div>

          <div className="supervisao-filters compact">
            <label>
              <span>Ano</span>
              <select value={filters.ano} onChange={(event) => setFilters({ ...filters, ano: event.target.value })}>
                <option value="">Todos</option>
                {anosDisponiveis.map((ano) => <option key={ano} value={ano}>{ano}</option>)}
              </select>
            </label>
            <label>
              <span>Mês</span>
              <select value={filters.mes} onChange={(event) => setFilters({ ...filters, mes: event.target.value })}>
                <option value="">Todos</option>
                {meses.map((mes) => <option key={mes.value} value={mes.value}>{mes.label}</option>)}
              </select>
            </label>
            <label>
              <span>Semana</span>
              <select value={filters.semana} onChange={(event) => setFilters({ ...filters, semana: event.target.value })}>
                <option value="">Todas</option>
                {semanas.map((semana) => <option key={semana.value} value={semana.value}>{semana.label}</option>)}
              </select>
            </label>
          </div>
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando dashboard...</p></section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Clínicas" value={data?.clinicas?.length || 0} detail="unidades cadastradas" />
              <CardIndicador label="Terapeutas" value={data?.terapeutas?.length || 0} detail="profissionais cadastrados" />
              <CardIndicador label="Pacientes ativos" value={metricas.pacientesAtivos} detail="em acompanhamento" />
              <CardIndicador label="Lançamentos" value={lancamentosFiltrados.length} detail="no período" />
              <CardIndicador label="Competências" value={formatDecimal(metricas.mediaCompetencias)} detail="média 1 a 5" />
              <CardIndicador label="Evolução" value={formatPercent(metricas.mediaEvolucao)} detail="score clínico" />
              <CardIndicador label="Atenção alta" value={metricas.casosAtencao} detail="casos sinalizados" />
              <CardIndicador label="Planos abertos" value={metricas.planosAbertos} detail="ações pendentes" />
            </section>

            <section className="supervisao-presentation-grid">
              <ChartPanel title="Evolução média dos pacientes" subtitle="Score consolidado dos indicadores clínicos" action={formatPercent(metricas.mediaEvolucao)}>
                <ProgressRing value={metricas.mediaEvolucao} label="evolução" detail="Quanto maior, melhor o cenário geral dos casos acompanhados." />
              </ChartPanel>

              <ChartPanel title="Radar de competências" subtitle="Média da matriz clínica dos terapeutas" action={`${formatDecimal(metricas.mediaCompetencias)} / 5`}>
                <RadarChart items={competenciaRadar} />
              </ChartPanel>

              <ChartPanel title="Tendência do período" subtitle={filters.mes ? "Comparativo por semana" : "Comparativo por mês"} action="competência x evolução">
                <TrendLine items={tendencia} valueKey="evolucao" secondaryKey="competencia" labelKey="label" />
              </ChartPanel>

              <ChartPanel title="Lançamentos por clínica" subtitle="Volume de supervisões registradas" action={`${resumoClinicas.length} clínicas`}>
                <ColumnChart items={resumoClinicas} valueKey="value" labelKey="label" valueFormatter={(value) => String(value)} />
              </ChartPanel>
            </section>

            <div className="supervisao-grid-two dashboard-lower">
              <ChartPanel title="Desempenho por terapeuta" subtitle="Média de competência clínica por profissional" action={`${resumoTerapeutas.length} ativos`}>
                <HorizontalBars
                  items={resumoTerapeutas.slice(0, 8)}
                  valueKey="competencia"
                  labelKey="label"
                  max={5}
                  valueFormatter={(value) => `${formatDecimal(value)} / 5`}
                />
              </ChartPanel>

              <ChartPanel title="Status dos planos" subtitle="Distribuição dos planos de desenvolvimento" action={`${lancamentosFiltrados.length} registros`}>
                <DonutChart items={statusPlano} />
              </ChartPanel>
            </div>

            <div className="supervisao-grid-two dashboard-lower">
              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Resumo por terapeuta</h2>
                  <span>{resumoTerapeutas.length} com lançamento</span>
                </div>
                {resumoTerapeutas.length === 0 ? (
                  <p className="supervisao-empty">Ainda não há lançamentos para o filtro selecionado.</p>
                ) : (
                  <div className="supervisao-table-wrap">
                    <table className="supervisao-table">
                      <thead>
                        <tr>
                          <th>Terapeuta</th>
                          <th>Registros</th>
                          <th>Competência</th>
                          <th>Evolução</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resumoTerapeutas.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nome}</td>
                            <td>{item.registros}</td>
                            <td>{formatDecimal(item.competencia)}</td>
                            <td>{formatPercent(item.evolucao)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Últimos lançamentos</h2>
                  <span>{lancamentosFiltrados.slice(0, 6).length}</span>
                </div>
                <div className="supervisao-timeline compact-list">
                  {lancamentosFiltrados.slice(0, 6).map((item) => (
                    <article key={item.id}>
                      <strong>{item.pacienteNome || "Paciente/caso"}</strong>
                      <span>{item.terapeutaNome || "Terapeuta"} · {item.ano}/{item.mes} · Semana {item.semana}</span>
                      <p>{item.recomendacao || item.observacao || "Sem observação registrada."}</p>
                    </article>
                  ))}
                  {lancamentosFiltrados.length === 0 && (
                    <p className="supervisao-empty">Nenhum lançamento semanal encontrado.</p>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}
