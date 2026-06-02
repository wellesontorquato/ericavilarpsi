import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatDecimal, formatPercent, meses, semanas } from "@/lib/supervisao/format";

const currentYear = new Date().getFullYear();

function competenciaMedia(item) {
  return average([
    item.qualidadeConceitualizacao,
    item.planejamentoTerapeutico,
    item.aplicacaoTecnicasTcc,
    item.manejoSessao,
    item.posturaTerapeutica,
    item.formulacaoHipoteses,
  ]);
}

function evolucaoMedia(item) {
  return average([
    item.qualidadeSono,
    item.adesaoTarefas,
    item.evolucaoObjetivos,
    item.intensidadeSintomas ? 10 - Number(item.intensidadeSintomas) : 0,
    item.evitacaoSocial ? 10 - Number(item.evitacaoSocial) : 0,
  ]);
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
        nome: terapeuta.nome,
        registros: registros.length,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    }).filter((item) => item.registros > 0).sort((a, b) => b.registros - a.registros);
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
        title="Dashboard de Supervisão Clínica"
        description="Acompanhe a clínica, os terapeutas e os casos supervisionados por semana, mês e ano."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-filters">
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
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando dashboard...</p></section>
        ) : (
          <>
            <section className="supervisao-indicator-grid">
              <CardIndicador label="Clínicas" value={data?.clinicas?.length || 0} detail="unidades cadastradas" />
              <CardIndicador label="Terapeutas" value={data?.terapeutas?.length || 0} detail="profissionais cadastrados" />
              <CardIndicador label="Pacientes/Casos ativos" value={metricas.pacientesAtivos} detail="em acompanhamento" />
              <CardIndicador label="Lançamentos" value={lancamentosFiltrados.length} detail="no período selecionado" />
              <CardIndicador label="Média das competências" value={formatDecimal(metricas.mediaCompetencias)} detail="escala de 1 a 5" />
              <CardIndicador label="Evolução média" value={formatPercent(metricas.mediaEvolucao)} detail="indicadores do paciente" />
              <CardIndicador label="Casos em atenção" value={metricas.casosAtencao} detail="nível de atenção alta" />
              <CardIndicador label="Planos abertos" value={metricas.planosAbertos} detail="ações em andamento" />
            </section>

            <div className="supervisao-grid-two">
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
                <div className="supervisao-timeline">
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
