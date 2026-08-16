import Link from "next/link";
import {
  average,
  formatDecimal,
  formatPercent,
  isNumericValue,
  mesNome,
  toNumber,
} from "@/lib/supervisao/format";
import {
  competenciaMedia,
  competencyFields,
  countComputedMetrics,
  evolucaoMedia,
  normalizedPercent,
  patientIndicatorFields,
  safeText,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

const NOT_COMPUTED = "Não computado";

export function truncateText(value, maxLength = 120, fallback = "-") {
  const text = safeText(value, fallback).replace(/\s+/g, " ").trim();

  if (!text || text === fallback) return fallback;
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}…`;
}

function periodLabel(item = {}) {
  return `${mesNome(item.mes)} de ${item.ano || "-"} · Semana ${
    item.semana || "-"
  }`;
}

function getResumoTexto(item = {}) {
  return (
    item.recomendacao ||
    item.planoAcao ||
    item.observacao ||
    item.pontoDesenvolver ||
    "Sem observação registrada para esta semana."
  );
}

function getStatusClass(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("concl")) return "done";

  if (
    normalized.includes("atras") ||
    normalized.includes("venc")
  ) {
    return "danger";
  }

  if (normalized.includes("andamento")) {
    return "progress";
  }

  return "neutral";
}

function formatMetricPercent(value) {
  return formatPercent(value, 0, NOT_COMPUTED);
}

function formatMetricDecimal(value, fractionDigits = 1) {
  return formatDecimal(value, fractionDigits, NOT_COMPUTED);
}

function formatScale(value, max, fractionDigits = 1) {
  if (!isNumericValue(value)) return NOT_COMPUTED;

  return `${formatDecimal(value, fractionDigits)}/${max}`;
}

function metricCoverage(count, total) {
  return `${count}/${total} computadas`;
}

export function TimelineLancamentos({
  items = [],
  emptyText = "Nenhum lançamento encontrado para o filtro selecionado.",
  limit,
  showLink = false,
}) {
  const ordered = sortByPeriodDesc(items);
  const parsedLimit = toNumber(limit, null);

  const rows =
    parsedLimit && parsedLimit > 0
      ? ordered.slice(0, parsedLimit)
      : ordered;

  if (!rows.length) {
    return <p className="supervisao-empty">{emptyText}</p>;
  }

  return (
    <div className="supervisao-history-timeline">
      {rows.map((item, index) => {
        const competencia = competenciaMedia(item);
        const evolucao = evolucaoMedia(item);

        const competenciasComputadas = countComputedMetrics(
          item,
          competencyFields
        );

        const indicadoresComputados = countComputedMetrics(
          item,
          patientIndicatorFields
        );

        return (
          <article
            key={
              item.id ||
              `${item.ano}-${item.mes}-${item.semana}-${index}`
            }
          >
            <div
              className="supervisao-history-marker"
              aria-hidden="true"
            />

            <div className="supervisao-history-card">
              <header>
                <div>
                  <span>{periodLabel(item)}</span>

                  <strong>
                    {item.pacienteNome ||
                      "Paciente/caso não informado"}
                  </strong>

                  <small>
                    {item.terapeutaNome ||
                      "Terapeuta não informado"}

                    {item.clinicaNome
                      ? ` · ${item.clinicaNome}`
                      : ""}
                  </small>
                </div>

                <i
                  className={`supervisao-status-pill ${getStatusClass(
                    item.statusPlano
                  )}`}
                >
                  {item.statusPlano || "Sem plano"}
                </i>
              </header>

              <div className="supervisao-history-metrics">
                <span
                  title={metricCoverage(
                    indicadoresComputados,
                    patientIndicatorFields.length
                  )}
                >
                  Evolução {formatMetricPercent(evolucao)} (
                  {indicadoresComputados}/
                  {patientIndicatorFields.length})
                </span>

                <span
                  title={metricCoverage(
                    competenciasComputadas,
                    competencyFields.length
                  )}
                >
                  Competência {formatScale(competencia, 5)} (
                  {competenciasComputadas}/{competencyFields.length})
                </span>

                <span>
                  Adesão{" "}
                  {formatMetricPercent(item.adesaoTarefas)}
                </span>

                <span>
                  Objetivos{" "}
                  {formatMetricPercent(item.evolucaoObjetivos)}
                </span>

                <span>
                  Estratégias{" "}
                  {formatMetricPercent(item.aplicacaoEstrategias)}
                </span>

                <span>
                  Intensidade (Comp.){" "}
                  {formatScale(
                    item.intensidadeComportamento,
                    10
                  )}
                </span>
              </div>

              <p title={safeText(getResumoTexto(item), "")}>
                {truncateText(
                  getResumoTexto(item),
                  170,
                  "Sem observação registrada para esta semana."
                )}
              </p>

              {(item.emocaoElaborada ||
                item.pontoForte ||
                item.pontoDesenvolver ||
                item.planoAcao) && (
                <dl>
                  {item.emocaoElaborada && (
                    <div>
                      <dt>Emoção a ser elaborada</dt>

                      <dd
                        title={safeText(
                          item.emocaoElaborada,
                          ""
                        )}
                      >
                        {truncateText(
                          item.emocaoElaborada,
                          95
                        )}
                      </dd>
                    </div>
                  )}

                  {item.pontoForte && (
                    <div>
                      <dt>Ponto forte</dt>

                      <dd
                        title={safeText(
                          item.pontoForte,
                          ""
                        )}
                      >
                        {truncateText(item.pontoForte, 95)}
                      </dd>
                    </div>
                  )}

                  {item.pontoDesenvolver && (
                    <div>
                      <dt>Ponto a desenvolver</dt>

                      <dd
                        title={safeText(
                          item.pontoDesenvolver,
                          ""
                        )}
                      >
                        {truncateText(
                          item.pontoDesenvolver,
                          95
                        )}
                      </dd>
                    </div>
                  )}

                  {item.planoAcao && (
                    <div>
                      <dt>Plano de ação</dt>

                      <dd
                        title={safeText(item.planoAcao, "")}
                      >
                        {truncateText(item.planoAcao, 95)}
                      </dd>
                    </div>
                  )}
                </dl>
              )}

              {showLink && item.pacienteId && (
                <Link
                  href={`/admin/supervisao/dashboard-pacientes?pacienteId=${encodeURIComponent(
                    item.pacienteId
                  )}`}
                >
                  Ver dashboard do paciente
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function getFirstAndLast(items = []) {
  const ordered = sortByPeriodDesc(items).reverse();

  return {
    first: ordered[0] || null,
    last: ordered[ordered.length - 1] || null,
    count: ordered.length,
  };
}

/**
 * Calcula valores comparáveis usando somente métricas
 * computadas tanto no lançamento inicial quanto no atual.
 */
function comparableAverage(
  first = {},
  last = {},
  fields = [],
  normalize = false
) {
  const sharedFields = fields.filter(
    ([field]) =>
      isNumericValue(first?.[field]) &&
      isNumericValue(last?.[field])
  );

  if (!sharedFields.length) {
    return {
      inicio: null,
      atual: null,
      metricCount: 0,
    };
  }

  const getValue = (item, config) => {
    const [field, , max, invert] = config;

    return normalize
      ? normalizedPercent(item?.[field], max, invert)
      : item?.[field];
  };

  return {
    inicio: average(
      sharedFields.map((config) =>
        getValue(first, config)
      )
    ),
    atual: average(
      sharedFields.map((config) =>
        getValue(last, config)
      )
    ),
    metricCount: sharedFields.length,
  };
}

function trendText(
  firstValue,
  lastValue,
  invert = false,
  suffix = ""
) {
  if (
    !isNumericValue(firstValue) ||
    !isNumericValue(lastValue)
  ) {
    return "Sem base comparável";
  }

  const first = Number(firstValue);
  const last = Number(lastValue);

  const diff = invert
    ? first - last
    : last - first;

  if (diff > 0) {
    return `Melhorou ${formatDecimal(diff)}${suffix}`;
  }

  if (diff < 0) {
    return `Piorou ${formatDecimal(
      Math.abs(diff)
    )}${suffix}`;
  }

  return "Estável";
}

function trendClass(
  firstValue,
  lastValue,
  invert = false
) {
  if (
    !isNumericValue(firstValue) ||
    !isNumericValue(lastValue)
  ) {
    return "neutral";
  }

  const first = Number(firstValue);
  const last = Number(lastValue);

  const diff = invert
    ? first - last
    : last - first;

  if (diff > 0) return "positive";
  if (diff < 0) return "negative";

  return "neutral";
}

function createMetricRow({
  id,
  label,
  first,
  last,
  field,
  formatter,
  invert = false,
  suffix = "",
}) {
  const inicio = toNumber(first?.[field], null);
  const atual = toNumber(last?.[field], null);

  return {
    id,
    label,
    inicio,
    atual,
    formatter,
    trend: trendText(
      inicio,
      atual,
      invert,
      suffix
    ),
    status: trendClass(
      inicio,
      atual,
      invert
    ),
  };
}

export function HistoricoComparativo({
  items = [],
}) {
  const {
    first,
    last,
    count,
  } = getFirstAndLast(items);

  if (!first || !last || count < 2) {
    return (
      <p className="supervisao-empty">
        É necessário ter pelo menos dois lançamentos para
        montar o comparativo.
      </p>
    );
  }

  const evolucaoComparavel = comparableAverage(
    first,
    last,
    patientIndicatorFields,
    true
  );

  const competenciaComparavel = comparableAverage(
    first,
    last,
    competencyFields,
    false
  );

  const rows = [
    {
      id: "evolucao",
      label: "Evolução geral",
      inicio: evolucaoComparavel.inicio,
      atual: evolucaoComparavel.atual,
      formatter: formatMetricPercent,
      trend: trendText(
        evolucaoComparavel.inicio,
        evolucaoComparavel.atual,
        false,
        " p.p."
      ),
      status: trendClass(
        evolucaoComparavel.inicio,
        evolucaoComparavel.atual
      ),
      basis: evolucaoComparavel.metricCount
        ? `${evolucaoComparavel.metricCount}/${patientIndicatorFields.length} indicadores comparáveis`
        : "Nenhum indicador em comum",
    },
    {
      id: "competencia",
      label: "Competência clínica",
      inicio: competenciaComparavel.inicio,
      atual: competenciaComparavel.atual,
      formatter: (value) =>
        formatScale(value, 5),
      trend: trendText(
        competenciaComparavel.inicio,
        competenciaComparavel.atual
      ),
      status: trendClass(
        competenciaComparavel.inicio,
        competenciaComparavel.atual
      ),
      basis: competenciaComparavel.metricCount
        ? `${competenciaComparavel.metricCount}/${competencyFields.length} competências comparáveis`
        : "Nenhuma competência em comum",
    },
    createMetricRow({
      id: "adesao",
      label: "Adesão às tarefas",
      first,
      last,
      field: "adesaoTarefas",
      formatter: formatMetricPercent,
      suffix: " p.p.",
    }),
    createMetricRow({
      id: "estrategias",
      label: "Aplicação das estratégias",
      first,
      last,
      field: "aplicacaoEstrategias",
      formatter: formatMetricPercent,
      suffix: " p.p.",
    }),
    createMetricRow({
      id: "objetivos",
      label: "Objetivos terapêuticos",
      first,
      last,
      field: "evolucaoObjetivos",
      formatter: formatMetricPercent,
      suffix: " p.p.",
    }),
    createMetricRow({
      id: "sono",
      label: "Qualidade do sono",
      first,
      last,
      field: "qualidadeSono",
      formatter: (value) =>
        formatScale(value, 10),
    }),
    createMetricRow({
      id: "sintomas",
      label: "Intensidade dos sintomas",
      first,
      last,
      field: "intensidadeSintomas",
      formatter: (value) =>
        formatScale(value, 10),
      invert: true,
    }),
    createMetricRow({
      id: "comportamento",
      label: "Intensidade do comportamento",
      first,
      last,
      field: "intensidadeComportamento",
      formatter: (value) =>
        formatScale(value, 10),
      invert: true,
    }),
    createMetricRow({
      id: "evitacao",
      label: "Evitação social",
      first,
      last,
      field: "evitacaoSocial",
      formatter: (value) =>
        formatScale(value, 10),
      invert: true,
    }),
    createMetricRow({
      id: "crises",
      label: "Crises por semana",
      first,
      last,
      field: "crisesAnsiedade",
      formatter: (value) =>
        formatMetricDecimal(value, 0),
      invert: true,
    }),
  ];

  return (
    <div className="supervisao-comparison-card">
      <header>
        <div>
          <span>Início</span>
          <strong>{periodLabel(first)}</strong>
        </div>

        <div>
          <span>Atual</span>
          <strong>{periodLabel(last)}</strong>
        </div>
      </header>

      <div className="supervisao-comparison-grid">
        {rows.map((row) => (
          <article key={row.id}>
            <span>{row.label}</span>

            <strong>
              {row.formatter(row.inicio)} →{" "}
              {row.formatter(row.atual)}
            </strong>

            <small className={row.status}>
              {row.trend}
              {row.basis
                ? ` · ${row.basis}`
                : ""}
            </small>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HistoricoSnapshot({
  items = [],
}) {
  const {
    first,
    last,
    count,
  } = getFirstAndLast(items);

  if (!last) return null;

  const scoreAtual = evolucaoMedia(last);

  const comparacao =
    first && count >= 2
      ? comparableAverage(
          first,
          last,
          patientIndicatorFields,
          true
        )
      : null;

  const ganho =
    comparacao &&
    isNumericValue(comparacao.inicio) &&
    isNumericValue(comparacao.atual)
      ? comparacao.atual -
        comparacao.inicio
      : null;

  const sintomasNormalizados =
    normalizedPercent(
      last.intensidadeSintomas,
      10,
      true
    );

  return (
    <section className="supervisao-history-snapshot">
      <article>
        <span>Último score clínico</span>

        <strong>
          {formatMetricPercent(scoreAtual)}
        </strong>

        {isNumericValue(ganho) ? (
          <small
            className={
              ganho > 0
                ? "positive"
                : ganho < 0
                  ? "negative"
                  : "neutral"
            }
          >
            {ganho > 0 ? "+" : ""}
            {formatDecimal(ganho)} p.p. desde o início ·{" "}
            {comparacao.metricCount} indicador(es) comparáveis
          </small>
        ) : (
          <small className="neutral">
            Sem base comparável com o início
          </small>
        )}
      </article>

      <article>
        <span>Última adesão</span>

        <strong>
          {formatMetricPercent(
            last.adesaoTarefas
          )}
        </strong>

        <small>
          {isNumericValue(
            last.adesaoTarefas
          )
            ? periodLabel(last)
            : "Métrica não avaliada neste lançamento"}
        </small>
      </article>

      <article>
        <span>Plano atual</span>

        <strong>
          {last.statusPlano ||
            "Sem status"}
        </strong>

        <small>
          {last.prazo
            ? `Prazo: ${last.prazo}`
            : "Sem prazo informado"}
        </small>
      </article>

      <article>
        <span>Sintomas atuais</span>

        <strong>
          {formatMetricPercent(
            sintomasNormalizados
          )}
        </strong>

        <small>
          {isNumericValue(
            sintomasNormalizados
          )
            ? "Score invertido: quanto maior, melhor"
            : "Métrica não avaliada neste lançamento"}
        </small>
      </article>
    </section>
  );
}