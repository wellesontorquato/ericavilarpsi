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
  HorizontalBars,
} from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import {
  average,
  formatDecimal,
  formatPercent,
  isNumericValue,
  mesNome,
} from "@/lib/supervisao/format";
import {
  buildRadar,
  buildTendencia,
  competenciaMedia,
  competencyFields,
  countComputedMetrics,
  currentYear,
  filterLancamentos,
  isPlanoAberto,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

const NO_DATA = "Sem dados";

function formatTechnicalScore(value) {
  return formatDecimal(value, 1, NO_DATA);
}

export default function SupervisaoTerapeutasDashboardPage() {
  return (
    <AuthGuard>
      {({ user, access, onLogout }) => (
        <TerapeutasDashboardContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function TerapeutasDashboardContent({ user, access, onLogout }) {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [periodFilters, setPeriodFilters] = useState({
    ano: String(currentYear),
    mes: "",
    semana: "",
  });

  /*
   * O terapeuta selecionado é derivado diretamente da URL.
   * Isso elimina a necessidade de sincronizar router.query
   * com setState dentro de um useEffect.
   */
  const terapeutaId = router.isReady
    ? Array.isArray(router.query.terapeutaId)
      ? router.query.terapeutaId[0] || ""
      : router.query.terapeutaId || ""
    : "";

  const filters = useMemo(
    () => ({
      ...periodFilters,
      terapeutaId,
    }),
    [periodFilters, terapeutaId]
  );

  function handleTerapeutaChange(event) {
    const selectedTerapeutaId = event.target.value;
    const nextQuery = { ...router.query };

    if (selectedTerapeutaId) {
      nextQuery.terapeutaId = selectedTerapeutaId;
    } else {
      delete nextQuery.terapeutaId;
    }

    void router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });

      try {
        const payload = await supervisaoRequest(user, "dashboard");

        if (!cancelled) {
          setData(payload);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setData(null);

          setMessage({
            type: "error",
            text:
              error.message ||
              "Não foi possível carregar o dashboard técnico.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const lancamentosFiltrados = useMemo(
    () => filterLancamentos(lancamentos, filters),
    [lancamentos, filters]
  );

  const metricas = useMemo(() => {
    const scoresCompetencia = lancamentosFiltrados
      .map(competenciaMedia)
      .filter(isNumericValue);

    const competenciasComputadas = lancamentosFiltrados.reduce(
      (total, item) =>
        total + countComputedMetrics(item, competencyFields),
      0
    );

    const totalCompetenciasPossiveis =
      lancamentosFiltrados.length * competencyFields.length;

    return {
      mediaCompetencias: average(scoresCompetencia),

      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,

      pacientesAvaliados: new Set(
        lancamentosFiltrados
          .filter((item) => isNumericValue(competenciaMedia(item)))
          .map((item) => item.pacienteId)
          .filter(Boolean)
      ).size,

      supervisoes: lancamentosFiltrados.length,

      supervisoesComCompetencia: scoresCompetencia.length,

      competenciasComputadas,

      coberturaCompetencias: totalCompetenciasPossiveis
        ? (competenciasComputadas / totalCompetenciasPossiveis) * 100
        : null,
    };
  }, [lancamentosFiltrados]);

  const terapeutasRanking = useMemo(
    () =>
      terapeutas
        .map((terapeuta) => {
          const registros = filterLancamentos(lancamentos, {
            ...filters,
            terapeutaId: terapeuta.id,
          });

          const scores = registros
            .map(competenciaMedia)
            .filter(isNumericValue);

          return {
            id: terapeuta.id,
            label: terapeuta.nome,
            competencia: average(scores),
            registrosComCompetencia: scores.length,
          };
        })
        .filter((terapeuta) => isNumericValue(terapeuta.competencia))
        .sort((a, b) => b.competencia - a.competencia)
        .slice(0, 5),
    [terapeutas, lancamentos, filters]
  );

  const ultimasDevolutivas = useMemo(
    () =>
      sortByPeriodDesc(lancamentosFiltrados)
        .filter((item) => item.pontoDesenvolver || item.planoAcao)
        .slice(0, 6),
    [lancamentosFiltrados]
  );

  const historicoRecente = useMemo(
    () => sortByPeriodDesc(lancamentosFiltrados).slice(0, 4),
    [lancamentosFiltrados]
  );

  const tendencia = useMemo(
    () =>
      buildTendencia(lancamentosFiltrados, filters).filter((item) =>
        isNumericValue(item.competencia)
      ),
    [lancamentosFiltrados, filters]
  );

  const competenciaRadar = useMemo(
    () =>
      buildRadar(lancamentosFiltrados).filter((item) =>
        isNumericValue(item.value)
      ),
    [lancamentosFiltrados]
  );

  const periodoDescricao = `${
    filters.mes ? mesNome(filters.mes) : "Todos os meses"
  }${filters.ano ? ` · ${filters.ano}` : ""}`;

  return (
    <>
      <Head>
        <title>Dashboard Técnico | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Desempenho Técnico"
        description="Acompanhe as competências computadas e o plano de desenvolvimento dos terapeutas sob sua responsabilidade."
        user={user}
        access={access}
        onLogout={onLogout}
        actions={
          <Link
            className="supervisao-secondary-button"
            href="/admin/supervisao/lancamento-semanal"
          >
            Novo lançamento
          </Link>
        }
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Visão clínica</span>

            <h2>
              {selectedName(
                terapeutas,
                filters.terapeutaId,
                "Todos os terapeutas"
              )}
            </h2>

            <p>{periodoDescricao}</p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setPeriodFilters}
            lancamentos={lancamentos}
            extraFilters={
              <label>
                <span>Terapeuta</span>

                <select
                  value={filters.terapeutaId}
                  onChange={handleTerapeutaChange}
                >
                  <option value="">Todos</option>

                  {terapeutas.map((terapeuta) => (
                    <option key={terapeuta.id} value={terapeuta.id}>
                      {terapeuta.nome}
                    </option>
                  ))}
                </select>
              </label>
            }
          />
        </section>

        {loading ? (
          <section className="supervisao-panel">
            <p>Carregando dados técnicos...</p>
          </section>
        ) : !data ? (
          <section className="supervisao-panel">
            <p className="supervisao-empty">
              Não foi possível carregar os dados do dashboard técnico.
            </p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Nível Técnico"
                value={formatTechnicalScore(metricas.mediaCompetencias)}
                detail={
                  isNumericValue(metricas.coberturaCompetencias)
                    ? `média das competências computadas · ${formatPercent(
                        metricas.coberturaCompetencias
                      )} de cobertura`
                    : "nenhuma competência computada no período"
                }
              />

              <CardIndicador
                label="Casos Avaliados"
                value={metricas.pacientesAvaliados}
                detail="casos com competência registrada"
              />

              <CardIndicador
                label="Ações Pendentes"
                value={metricas.planosAbertos}
                detail="planos de desenvolvimento em aberto"
              />

              <CardIndicador
                label="Supervisões"
                value={metricas.supervisoes}
                detail={
                  metricas.supervisoesComCompetencia
                    ? `${metricas.supervisoesComCompetencia} com média técnica calculável`
                    : "nenhuma média técnica calculável"
                }
              />
            </section>

            <div className="bento-grid">
              <div className="bento-col bento-8">
                <ChartPanel
                  title="Evolução Técnica"
                  subtitle="Progressão calculada somente com competências efetivamente computadas"
                  action="escala de 5"
                >
                  {tendencia.length ? (
                    <TrendLine
                      items={tendencia}
                      valueKey="competencia"
                      labelKey="label"
                    />
                  ) : (
                    <p className="supervisao-empty">
                      Nenhuma competência computável para montar a tendência
                      no período selecionado.
                    </p>
                  )}
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <ChartPanel
                  title="Matriz de Habilidades"
                  subtitle="Média de cada competência clínica computada"
                  action={`${competenciaRadar.length}/${competencyFields.length} avaliadas`}
                >
                  {competenciaRadar.length >= 3 ? (
                    <RadarChart items={competenciaRadar} />
                  ) : (
                    <p className="supervisao-empty">
                      O radar precisa de pelo menos três competências
                      computadas. Foram encontradas{" "}
                      {competenciaRadar.length}.
                    </p>
                  )}
                </ChartPanel>
              </div>

              <div className="bento-col bento-6">
                <section className="supervisao-panel h-full">
                  <div className="supervisao-section-title">
                    <h2>Planos e Devolutivas</h2>
                    <span>{ultimasDevolutivas.length}</span>
                  </div>

                  <div className="supervisao-insight-list">
                    {ultimasDevolutivas.map((item) => {
                      const paciente = pacientes.find(
                        (current) =>
                          String(current.id) === String(item.pacienteId)
                      );

                      return (
                        <article key={item.id}>
                          <strong>
                            {item.pontoDesenvolver ||
                              "Ação de desenvolvimento"}
                          </strong>

                          <span>
                            Caso:{" "}
                            {paciente?.nome ||
                              item.pacienteNome ||
                              "Não informado"}
                          </span>

                          <p>
                            {item.planoAcao || "Nenhum plano detalhado."}
                          </p>
                        </article>
                      );
                    })}

                    {!ultimasDevolutivas.length && (
                      <p className="supervisao-empty">
                        Nenhum plano de desenvolvimento registrado.
                      </p>
                    )}
                  </div>
                </section>
              </div>

              <div className="bento-col bento-6">
                {!filters.terapeutaId ? (
                  <ChartPanel
                    title="Ranking da Equipe"
                    subtitle="Comparativo das médias técnicas computadas"
                    action="Top 5"
                  >
                    {terapeutasRanking.length ? (
                      <HorizontalBars
                        items={terapeutasRanking}
                        valueKey="competencia"
                        labelKey="label"
                        max={5}
                        valueFormatter={formatTechnicalScore}
                      />
                    ) : (
                      <p className="supervisao-empty">
                        Nenhum terapeuta possui competências computadas no
                        período.
                      </p>
                    )}
                  </ChartPanel>
                ) : (
                  <section className="supervisao-panel h-full">
                    <div className="supervisao-section-title">
                      <h2>Últimas anotações</h2>
                    </div>

                    <TimelineLancamentos
                      items={historicoRecente}
                      limit={4}
                      emptyText="Sem histórico para o terapeuta selecionado."
                    />
                  </section>
                )}
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}