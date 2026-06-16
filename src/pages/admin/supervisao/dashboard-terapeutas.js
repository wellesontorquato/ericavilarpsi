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
  RadarChart,
  TrendLine,
  HorizontalBars
} from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatDecimal, mesNome } from "@/lib/supervisao/format";
import {
  buildRadar,
  buildTendencia,
  competenciaMedia,
  currentYear,
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
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [filters, setFilters] = useState({ ano: String(currentYear), mes: "", semana: "", terapeutaId: "" });

  useEffect(() => {
    if (!router.isReady || !router.query.terapeutaId) return;
    const terapeutaId = Array.isArray(router.query.terapeutaId) ? router.query.terapeutaId[0] : router.query.terapeutaId;
    setFilters((current) => ({ ...current, terapeutaId: terapeutaId || current.terapeutaId }));
  }, [router.isReady, router.query.terapeutaId]);

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
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);
  const lancamentosFiltrados = useMemo(() => filterLancamentos(lancamentos, filters), [lancamentos, filters]);

  const metricas = useMemo(() => {
    return {
      mediaCompetencias: average(lancamentosFiltrados.map(competenciaMedia)),
      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,
      pacientesAvaliados: new Set(lancamentosFiltrados.map((item) => item.pacienteId).filter(Boolean)).size,
    };
  }, [lancamentosFiltrados]);

  const terapeutasRanking = useMemo(() => {
    return terapeutas.map((t) => {
      const regs = filterLancamentos(lancamentos, { ...filters, terapeutaId: t.id });
      return { id: t.id, label: t.nome, competencia: average(regs.map(competenciaMedia)) };
    }).filter((t) => t.competencia > 0).sort((a, b) => b.competencia - a.competencia).slice(0, 5);
  }, [terapeutas, lancamentos, filters]);

  const ultimasDevolutivas = useMemo(() => sortByPeriodDesc(lancamentosFiltrados).filter((item) => item.pontoDesenvolver || item.planoAcao).slice(0, 6), [lancamentosFiltrados]);
  const historicoRecente = useMemo(() => sortByPeriodDesc(lancamentosFiltrados).slice(0, 5), [lancamentosFiltrados]);
  const tendencia = useMemo(() => buildTendencia(lancamentosFiltrados, filters), [lancamentosFiltrados, filters]);
  const competenciaRadar = useMemo(() => buildRadar(lancamentosFiltrados), [lancamentosFiltrados]);

  return (
    <>
      <Head><title>Dashboard Técnico | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Desempenho Técnico"
        description="Foco exclusivo no desenvolvimento das competências e entregas do terapeuta."
        user={user}
        onLogout={onLogout}
        actions={(
          <Link className="supervisao-secondary-button" href="/admin/supervisao/lancamento-semanal">Novo Lançamento</Link>
        )}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão Clínica</span>
            <h2>{selectedName(terapeutas, filters.terapeutaId, "Todos os terapeutas")}</h2>
            <p>{filters.mes ? mesNome(filters.mes) : "Todos os meses"} {filters.ano && `· ${filters.ano}`}</p>
          </div>
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <label>
                <span>Terapeuta</span>
                <select value={filters.terapeutaId} onChange={(e) => setFilters((c) => ({ ...c, terapeutaId: e.target.value }))}>
                  <option value="">Todos</option>
                  {terapeutas.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </label>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando dados técnicos...</p></section>
        ) : (
          <>
            {/* Apenas 4 KPIs essenciais */}
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Nível Técnico" value={formatDecimal(metricas.mediaCompetencias)} detail="média geral (1 a 5)" />
              <CardIndicador label="Casos Avaliados" value={metricas.pacientesAvaliados} detail="com registro no período" />
              <CardIndicador label="Ações Pendentes" value={metricas.planosAbertos} detail="planos em aberto" />
              <CardIndicador label="Supervisões" value={lancamentosFiltrados.length} detail="sessões documentadas" />
            </section>

            <section className="supervisao-presentation-grid">
              <ChartPanel title="Evolução Técnica" subtitle="Progressão da competência do terapeuta" action="escala de 5">
                <TrendLine items={tendencia} valueKey="competencia" labelKey="label" />
              </ChartPanel>

              <ChartPanel title="Matriz de Habilidades" subtitle="Onde focar o desenvolvimento" action="Radar TCC">
                <RadarChart items={competenciaRadar} />
              </ChartPanel>
            </section>

            <div className="supervisao-grid-two dashboard-lower">
              <section className="supervisao-panel">
                <div className="supervisao-section-title">
                  <h2>Planos e Devolutivas</h2>
                  <span>{ultimasDevolutivas.length}</span>
                </div>
                <div className="supervisao-insight-list">
                  {ultimasDevolutivas.map((item) => (
                    <article key={item.id}>
                      <strong>{item.pontoDesenvolver || "Ação de desenvolvimento"}</strong>
                      <span>Caso: {item.pacienteNome || "Não informado"}</span>
                      <p>{item.planoAcao || "Nenhum plano detalhado."}</p>
                    </article>
                  ))}
                  {ultimasDevolutivas.length === 0 && <p className="supervisao-empty">Nenhum plano de ação pendente.</p>}
                </div>
              </section>

              {!filters.terapeutaId ? (
                <ChartPanel title="Ranking da Equipe" subtitle="Comparativo de competência técnica" action="Top 5">
                  <HorizontalBars items={terapeutasRanking} valueKey="competencia" labelKey="label" max={5} valueFormatter={(v) => formatDecimal(v)} />
                </ChartPanel>
              ) : (
                <section className="supervisao-panel">
                  <div className="supervisao-section-title">
                    <h2>Últimas anotações</h2>
                  </div>
                  <TimelineLancamentos items={historicoRecente} limit={4} emptyText="Sem histórico." />
                </section>
              )}
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}