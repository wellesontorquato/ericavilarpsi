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
  const terapeutas = useMemo(() => data?.terapeutas || [], [data]); // Importante para cruzar nomes
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

  // Ranking de Clínicas (Usado quando NENHUMA clínica específica está selecionada)
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

  // Ranking de Casos/Pacientes (Usado quando UMA clínica específica ESTÁ selecionada)
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
          <section className="supervisao-panel"><p>Carregando dashboard...</p></section>
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
                {/* RENDERIZAÇÃO CONDICIONAL: Ranking de Clínicas vs Ranking de Pacientes */}
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
                {/* Painel Reformulado de Atenção Imediata */}
                <section className="supervisao-panel h-full" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--sup-line)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--sup-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Atenção Imediata:
                      <strong style={{ 
                        backgroundColor: 'var(--sup-primary)', 
                        color: '#fff', 
                        padding: '2px 14px', 
                        borderRadius: '999px', 
                        fontSize: '1.15rem',
                        lineHeight: '1.4'
                      }}>
                        {casosAtencaoLista.length}
                      </strong>
                    </h2>
                    <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: 'var(--sup-muted)' }}>Casos que exigem intervenção prioritária.</p>
                  </div>
                  
                  <div className="supervisao-insight-list" style={{ flex: 1, overflowY: 'auto' }}>
                    {casosAtencaoLista.map((paciente) => {
                      const terapeutaResponsavel = terapeutas.find(t => t.id === paciente.terapeutaId);
                      const isAltoRisco = paciente.nivelAtencao === 'Alta' || paciente.nivelAtencao === 'Alto';
                      
                      return (
                        <article 
                          key={paciente.id} 
                          style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '16px', backgroundColor: 'rgba(255,255,255,0.7)', border: '1px solid var(--sup-line)', borderRadius: '18px' }}
                        >
                          <strong style={{ display: 'block', fontSize: '1.05rem', color: 'var(--sup-text)', lineHeight: 1.2 }}>
                            {paciente.nome}
                          </strong>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--sup-muted)', marginTop: '2px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isAltoRisco ? '#a43c32' : '#c98239' }}></span>
                            {terapeutaResponsavel?.nome || "Sem terapeuta"} · Nível: {paciente.nivelAtencao}
                          </span>
                        </article>
                      );
                    })}
                    {casosAtencaoLista.length === 0 && (
                      <div style={{ padding: '24px', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px dashed var(--sup-line)' }}>
                        <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🎉</span>
                        <p style={{ margin: 0, color: 'var(--sup-muted)', fontSize: '0.9rem' }}>Nenhum caso crítico detectado no momento.</p>
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