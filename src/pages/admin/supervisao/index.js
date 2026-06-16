import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import { ChartPanel, ProgressRing, TrendLine, HorizontalBars } from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatPercent, mesNome } from "@/lib/supervisao/format";
import { buildTendencia, currentYear, evolucaoMedia, filterLancamentos, isCasoAtencao, selectedName } from "@/lib/supervisao/dashboardUtils";

// Importa o CSS focado nesta página
import "@/styles/dashboard-clinicas.css";

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

  const metricas = useMemo(() => {
    return {
      pacientesAtivos: pacientesDaClinica.filter((item) => item.statusCaso !== "Encerrado").length,
      mediaEvolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      casosAtencao: pacientesDaClinica.filter(isCasoAtencao).length,
    };
  }, [lancamentosFiltrados, pacientesDaClinica]);

  const resumoClinicas = useMemo(() => {
    return clinicas.map((clinica) => {
      const registros = filterLancamentos(lancamentos, { ...filters, clinicaId: clinica.id });
      return {
        id: clinica.id,
        label: clinica.nome,
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.evolucao > 0).sort((a, b) => b.evolucao - a.evolucao);
  }, [clinicas, lancamentos, filters]);

  const resumoPacientesDaClinica = useMemo(() => {
    if (!filters.clinicaId) return [];
    return pacientesDaClinica.map((paciente) => {
      const registros = filterLancamentos(lancamentos, { ...filters, pacienteId: paciente.id });
      return {
        id: paciente.id,
        label: paciente.nome,
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.evolucao > 0).sort((a, b) => b.evolucao - a.evolucao);
  }, [pacientesDaClinica, lancamentos, filters]);

  const casosAtencaoLista = useMemo(() => pacientesDaClinica.filter(isCasoAtencao).slice(0, 6), [pacientesDaClinica]);
  const tendencia = useMemo(() => buildTendencia(lancamentosFiltrados, filters), [lancamentosFiltrados, filters]);

  return (
    <>
      <Head><title>Dashboard por clínica | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Dashboard da Clínica"
        description="Visão executiva simples: acompanhe a evolução média e os casos que exigem atenção imediata."
        user={user}
        onLogout={onLogout}
        actions={(
          <div className="supervisao-header-action-group">
            <Link className="supervisao-secondary-button" href="/admin/supervisao/alertas">Gerenciar Alertas</Link>
          </div>
        )}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão macro</span>
            <h2>{selectedName(clinicas, filters.clinicaId, "Todas as clínicas")}</h2>
            <p>{filters.mes ? mesNome(filters.mes) : "Todos os meses"} {filters.ano && `· ${filters.ano}`}</p>
          </div>
          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <label>
                <span>Clínica</span>
                <select value={filters.clinicaId} onChange={(e) => setFilters((c) => ({ ...c, clinicaId: e.target.value }))}>
                  <option value="">Todas</option>
                  {clinicas.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </label>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>A carregar dashboard...</p></section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Saúde da Clínica" value={formatPercent(metricas.mediaEvolucao)} detail="score clínico geral" />
              <CardIndicador label="Casos de Risco" value={metricas.casosAtencao} detail="necessitam intervenção" />
              <CardIndicador label="Pacientes Ativos" value={metricas.pacientesAtivos} detail="em acompanhamento" />
              <CardIndicador label="Supervisões" value={lancamentosFiltrados.length} detail="registros lançados" />
            </section>

            <div className="bento-grid">
              <div className="bento-col bento-8">
                <ChartPanel title="Tendência de Evolução" subtitle="Curva de melhora clínica no período" action="evolução">
                  <TrendLine items={tendencia} valueKey="evolucao" labelKey="label" />
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <ChartPanel title="Saúde Geral" subtitle="Média de evolução atual" action={formatPercent(metricas.mediaEvolucao)}>
                  <ProgressRing value={metricas.mediaEvolucao} label="evolução" detail="Consolida os 5 indicadores." />
                </ChartPanel>
              </div>

              <div className="bento-col bento-8">
                {!filters.clinicaId ? (
                  <ChartPanel title="Evolução por Unidade" subtitle="Ranking de saúde por clínica" action={`${resumoClinicas.length} ativas`}>
                    <HorizontalBars items={resumoClinicas.slice(0, 5)} valueKey="evolucao" labelKey="label" max={100} valueFormatter={formatPercent} />
                  </ChartPanel>
                ) : (
                  <ChartPanel title="Evolução dos Casos" subtitle="Desempenho clínico dos pacientes desta unidade" action={`${resumoPacientesDaClinica.length} pacientes`}>
                    <HorizontalBars items={resumoPacientesDaClinica.slice(0, 5)} valueKey="evolucao" labelKey="label" max={100} valueFormatter={formatPercent} />
                  </ChartPanel>
                )}
              </div>

              <div className="bento-col bento-4">
                <section className="supervisao-panel clinica-panel-flex">
                  <div className="clinica-panel-header">
                    <h2 className="clinica-panel-title">
                      Atenção Imediata:
                      <strong className="clinica-panel-badge">
                        {casosAtencaoLista.length}
                      </strong>
                    </h2>
                    <p className="clinica-panel-desc">Casos que exigem intervenção prioritária.</p>
                  </div>
                  
                  <div className="scroll-interno clinica-attention-list">
                    {casosAtencaoLista.map((paciente) => {
                      const terapeutaResponsavel = terapeutas.find(t => t.id === paciente.terapeutaId);
                      const isAltoRisco = paciente.nivelAtencao === 'Alta' || paciente.nivelAtencao === 'Alto';
                      
                      return (
                        <article key={paciente.id} className="clinica-attention-card">
                          <strong className="clinica-attention-name">
                            {paciente.nome}
                          </strong>
                          <span className="clinica-attention-meta">
                            <span 
                              className="clinica-attention-dot" 
                              style={{ backgroundColor: isAltoRisco ? '#a43c32' : '#c98239' }}
                            ></span>
                            {terapeutaResponsavel?.nome || "Sem terapeuta"} · Nível: {paciente.nivelAtencao}
                          </span>
                        </article>
                      );
                    })}
                    
                    {casosAtencaoLista.length === 0 && (
                      <div className="clinica-empty-state">
                        <span className="emoji">🎉</span>
                        <p>Nenhum caso crítico detetado no momento.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}