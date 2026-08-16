import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
import {
  HistoricoComparativo,
  TimelineLancamentos,
} from "@/components/supervisao/TimelineLancamentos";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import {
  ChartPanel,
  HorizontalBars,
  TrendLine,
} from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import {
  average,
  formatDecimal,
  formatPercent,
  isNumericValue,
  mesNome,
  toNumber,
} from "@/lib/supervisao/format";
import {
  countComputedMetrics,
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  normalizedPercent,
  patientIndicatorFields,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

const NOT_COMPUTED = "Não computado";

const INDICATOR_LABELS = {
  qualidadeSono: "Qualidade do sono",
  adesaoTarefas: "Adesão às tarefas",
  aplicacaoEstrategias: "Aplicação das estratégias",
  evolucaoObjetivos: "Evolução dos objetivos",
  intensidadeSintomas: "Controle dos sintomas",
  evitacaoSocial: "Redução da evitação social",
  intensidadeComportamento: "Controle do comportamento-alvo",
};

function formatMetricPercent(value) {
  return formatPercent(value, 0, NOT_COMPUTED);
}

function formatMetricDecimal(value, fractionDigits = 1) {
  return formatDecimal(value, fractionDigits, NOT_COMPUTED);
}

function formatScale(value, max, fractionDigits = 1) {
  if (!isNumericValue(value)) {
    return NOT_COMPUTED;
  }

  return `${formatDecimal(value, fractionDigits)}/${max}`;
}

/**
 * A tendência utiliza somente indicadores computados
 * em todos os lançamentos do período.
 */
function buildPacienteTendencia(lancamentos = []) {
  const ordered = sortByPeriodDesc(lancamentos).reverse();

  if (ordered.length < 2) {
    return {
      items: [],
      metricCount: 0,
      hasObjectives: false,
    };
  }

  const sharedFields = patientIndicatorFields.filter(([field]) =>
    ordered.every((item) => isNumericValue(item?.[field]))
  );

  if (!sharedFields.length) {
    return {
      items: [],
      metricCount: 0,
      hasObjectives: false,
    };
  }

  const hasObjectives = sharedFields.some(
    ([field]) => field === "evolucaoObjetivos"
  );

  const items = ordered.map((item, index) => ({
    id: item.id || `${item.ano}-${item.mes}-${item.semana}-${index}`,

    label: `${item.mes || "-"}/${String(item.ano || "-").slice(-2)} · S${
      item.semana || "-"
    }`,

    evolucao: average(
      sharedFields.map(([field, , max, invert]) =>
        normalizedPercent(item?.[field], max, invert)
      )
    ),

    objetivos: hasObjectives
      ? normalizedPercent(item.evolucaoObjetivos, 100)
      : null,
  }));

  return {
    items,
    metricCount: sharedFields.length,
    hasObjectives,
  };
}

export default function SupervisaoPacientesDashboardPage() {
  return (
    <AuthGuard>
      {({ user, access, onLogout }) => (
        <PacientesDashboardContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function PacientesDashboardContent({ user, access, onLogout }) {
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
   * O paciente selecionado é derivado diretamente da URL.
   * Dessa forma não precisamos sincronizar router.query com
   * setState dentro de um useEffect.
   */
  const pacienteId = router.isReady
    ? Array.isArray(router.query.pacienteId)
      ? router.query.pacienteId[0] || ""
      : router.query.pacienteId || ""
    : "";

  const filters = useMemo(
    () => ({
      ...periodFilters,
      pacienteId,
    }),
    [periodFilters, pacienteId]
  );

  function handlePacienteChange(event) {
    const selectedPacienteId = event.target.value;
    const nextQuery = { ...router.query };

    if (selectedPacienteId) {
      nextQuery.pacienteId = selectedPacienteId;
    } else {
      delete nextQuery.pacienteId;
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
              "Não foi possível carregar o dashboard do paciente.",
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

  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const pacienteSelecionado = useMemo(
    () =>
      pacientes.find(
        (item) => String(item.id) === String(filters.pacienteId)
      ),
    [pacientes, filters.pacienteId]
  );

  const terapeutaResponsavel = useMemo(
    () =>
      terapeutas.find(
        (item) =>
          String(item.id) === String(pacienteSelecionado?.terapeutaId)
      ),
    [terapeutas, pacienteSelecionado?.terapeutaId]
  );

  const lancamentosFiltrados = useMemo(() => {
    if (!filters.pacienteId) {
      return [];
    }

    return filterLancamentos(lancamentos, filters);
  }, [lancamentos, filters]);

  const lancamentosOrdenados = useMemo(
    () => sortByPeriodDesc(lancamentosFiltrados),
    [lancamentosFiltrados]
  );

  const ultimoLancamento = lancamentosOrdenados[0] || null;

  const metricas = useMemo(() => {
    const scoresDoPeriodo = lancamentosFiltrados
      .map(evolucaoMedia)
      .filter(isNumericValue);

    return {
      evolucaoAtual: ultimoLancamento
        ? evolucaoMedia(ultimoLancamento)
        : null,

      evolucaoMediaPeriodo: average(scoresDoPeriodo),

      sintomasAtual: toNumber(
        ultimoLancamento?.intensidadeSintomas,
        null
      ),

      crisesAtual: toNumber(ultimoLancamento?.crisesAnsiedade, null),

      sonoAtual: toNumber(ultimoLancamento?.qualidadeSono, null),

      indicadoresAtuais: ultimoLancamento
        ? countComputedMetrics(ultimoLancamento, patientIndicatorFields)
        : 0,

      supervisoesComEvolucao: scoresDoPeriodo.length,
    };
  }, [lancamentosFiltrados, ultimoLancamento]);

  const indicadoresAtuais = useMemo(() => {
    if (!ultimoLancamento) {
      return [];
    }

    return patientIndicatorFields
      .map(([field, shortLabel, max, invert]) => ({
        id: field,

        label: INDICATOR_LABELS[field] || shortLabel,

        value: normalizedPercent(
          ultimoLancamento?.[field],
          max,
          invert
        ),

        max: 100,
      }))
      .filter((item) => isNumericValue(item.value));
  }, [ultimoLancamento]);

  const tendenciaPaciente = useMemo(
    () => buildPacienteTendencia(lancamentosFiltrados),
    [lancamentosFiltrados]
  );

  const historico = useMemo(
    () => lancamentosOrdenados.slice(0, 10),
    [lancamentosOrdenados]
  );

  const periodoDescricao = `${
    filters.mes ? mesNome(filters.mes) : "Todos os meses"
  }${filters.ano ? ` · ${filters.ano}` : ""}`;

  return (
    <>
      <Head>
        <title>Progresso do caso | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Progresso do Caso"
        description="Acompanhe os indicadores computados, a evolução clínica e o histórico do caso selecionado."
        user={user}
        access={access}
        onLogout={onLogout}
        actions={
          pacienteSelecionado ? (
            <Link
              className="supervisao-secondary-button"
              href={`/admin/supervisao/historico?pacienteId=${encodeURIComponent(
                pacienteSelecionado.id
              )}`}
            >
              Linha do tempo
            </Link>
          ) : null
        }
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">Caso clínico</span>

            <h2>
              {selectedName(
                pacientes,
                filters.pacienteId,
                "Selecione um paciente"
              )}
            </h2>

            <p>
              {pacienteSelecionado
                ? `Terapeuta: ${
                    terapeutaResponsavel?.nome || "Sem terapeuta"
                  } · Nível: ${
                    pacienteSelecionado.nivelAtencao || "Não informado"
                  } · ${periodoDescricao}`
                : "Escolha um paciente no filtro para visualizar somente os dados do caso selecionado."}
            </p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setPeriodFilters}
            lancamentos={lancamentos}
            extraFilters={
              <label>
                <span>Paciente</span>

                <select
                  value={filters.pacienteId}
                  onChange={handlePacienteChange}
                >
                  <option value="">Selecione...</option>

                  {pacientes.map((paciente) => {
                    const terapeuta = terapeutas.find(
                      (item) =>
                        String(item.id) === String(paciente.terapeutaId)
                    );

                    return (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                        {terapeuta ? ` — ${terapeuta.nome}` : ""}
                      </option>
                    );
                  })}
                </select>
              </label>
            }
          />
        </section>

        {loading ? (
          <section className="supervisao-panel">
            <p>Carregando dados do caso...</p>
          </section>
        ) : !data ? (
          <section className="supervisao-panel">
            <p className="supervisao-empty">
              Não foi possível carregar os dados do dashboard.
            </p>
          </section>
        ) : !pacienteSelecionado ? (
          <section
            className="supervisao-panel"
            style={{
              textAlign: "center",
              padding: "60px 20px",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: "3rem",
                display: "block",
                marginBottom: "16px",
              }}
            >
              ◉
            </span>

            <h2>Nenhum paciente selecionado</h2>

            <p className="supervisao-empty">
              Selecione um paciente para visualizar indicadores, evolução e
              histórico. Não exibimos dados clínicos acumulados de pacientes
              diferentes nesta página.
            </p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Evolução Atual"
                value={formatMetricPercent(metricas.evolucaoAtual)}
                detail={
                  ultimoLancamento
                    ? `${metricas.indicadoresAtuais}/${
                        patientIndicatorFields.length
                      } indicadores computados · média do período: ${formatMetricPercent(
                        metricas.evolucaoMediaPeriodo
                      )}`
                    : "nenhum lançamento no período"
                }
              />

              <CardIndicador
                label="Sintomas Atuais"
                value={formatScale(metricas.sintomasAtual, 10)}
                detail="valor do último lançamento; quanto menor, melhor"
              />

              <CardIndicador
                label="Crises Semanais"
                value={formatMetricDecimal(metricas.crisesAtual, 0)}
                detail="frequência informada no último lançamento"
              />

              <CardIndicador
                label="Supervisões"
                value={lancamentosFiltrados.length}
                detail={
                  metricas.supervisoesComEvolucao
                    ? `${metricas.supervisoesComEvolucao} com score de evolução calculável`
                    : "nenhum score de evolução calculável"
                }
              />
            </section>

            <div className="bento-grid dashboard-lower">
              <div className="bento-col bento-8">
                <ChartPanel
                  title="Histórico de Melhoria"
                  subtitle={
                    tendenciaPaciente.metricCount
                      ? `Comparação com ${tendenciaPaciente.metricCount}/${patientIndicatorFields.length} indicadores presentes em todos os períodos`
                      : "A tendência exige indicadores em comum entre os lançamentos"
                  }
                  action="tendência comparável"
                >
                  {tendenciaPaciente.items.length >= 2 ? (
                    <TrendLine
                      items={tendenciaPaciente.items}
                      valueKey="evolucao"
                      secondaryKey={
                        tendenciaPaciente.hasObjectives
                          ? "objetivos"
                          : undefined
                      }
                      labelKey="label"
                    />
                  ) : (
                    <p className="supervisao-empty">
                      São necessários ao menos dois lançamentos com uma mesma
                      métrica computada para montar uma tendência confiável.
                    </p>
                  )}
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <section
                  className="supervisao-panel h-full"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      paddingBottom: "16px",
                      marginBottom: "16px",
                      borderBottom: "1px solid var(--sup-line)",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.25rem",
                        color: "var(--sup-text)",
                      }}
                    >
                      Resumo estrutural
                    </h2>
                  </div>

                  <div
                    className="scroll-interno"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <article
                      style={{
                        padding: "16px",
                        backgroundColor: "rgba(255,255,255,0.65)",
                        border: "1px solid var(--sup-line)",
                        borderRadius: "18px",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: "var(--sup-primary-dark)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "8px",
                        }}
                      >
                        Queixa principal
                      </span>

                      <p
                        style={{
                          margin: 0,
                          color: "var(--sup-text)",
                          fontSize: "0.92rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {pacienteSelecionado.queixaPrincipal ||
                          "Nenhuma queixa cadastrada."}
                      </p>
                    </article>

                    <article
                      style={{
                        padding: "16px",
                        backgroundColor: "rgba(255,255,255,0.65)",
                        border: "1px solid var(--sup-line)",
                        borderRadius: "18px",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: "var(--sup-primary-dark)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginBottom: "8px",
                        }}
                      >
                        Objetivos terapêuticos
                      </span>

                      <p
                        style={{
                          margin: 0,
                          color: "var(--sup-text)",
                          fontSize: "0.92rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {pacienteSelecionado.objetivosTerapeuticos ||
                          "Sem objetivos cadastrados."}
                      </p>
                    </article>
                  </div>
                </section>
              </div>

              <div className="bento-col bento-6">
                <ChartPanel
                  title="Indicadores Clínicos Atuais"
                  subtitle="Scores normalizados do último lançamento; quanto maior, melhor"
                  action={`${indicadoresAtuais.length}/${patientIndicatorFields.length} computados`}
                >
                  {indicadoresAtuais.length ? (
                    <HorizontalBars
                      items={indicadoresAtuais}
                      valueKey="value"
                      labelKey="label"
                      max={100}
                      valueFormatter={formatMetricPercent}
                    />
                  ) : (
                    <p className="supervisao-empty">
                      Nenhum indicador clínico consolidável foi computado no
                      último lançamento.
                    </p>
                  )}
                </ChartPanel>
              </div>

              <div className="bento-col bento-6">
                <section
                  className="supervisao-panel h-full"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      paddingBottom: "16px",
                      marginBottom: "16px",
                      borderBottom: "1px solid var(--sup-line)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: "0 0 4px",
                          fontSize: "1.25rem",
                          color: "var(--sup-text)",
                        }}
                      >
                        Diário de intervenções
                      </h2>

                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--sup-muted)",
                        }}
                      >
                        Últimos registros do período
                      </span>
                    </div>
                  </div>

                  <div className="scroll-interno">
                    <TimelineLancamentos
                      items={historico}
                      emptyText="Sem histórico clínico para exibir."
                      limit={10}
                    />
                  </div>
                </section>
              </div>

              <div className="bento-col bento-12">
                <section className="supervisao-panel">
                  <div className="supervisao-section-title">
                    <h2>Comparativo do caso</h2>
                    <span>início × atual</span>
                  </div>

                  <HistoricoComparativo items={lancamentosFiltrados} />
                </section>
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}