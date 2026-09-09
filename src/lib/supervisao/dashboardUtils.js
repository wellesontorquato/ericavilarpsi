import {
  average,
  isNumericValue,
  mesNome,
  meses,
  semanas,
  toNumber,
} from "./format";

export const currentYear = new Date().getFullYear();

export const competencyFields = [
  [
    "qualidadeConceitualizacao",
    "Conceit.",
    "Conceitualização",
  ],
  [
    "planejamentoTerapeutico",
    "Planej.",
    "Planejamento terapêutico",
  ],
  [
    "aplicacaoTecnicasTcc",
    "Técnicas",
    "Técnicas TCC",
  ],
  [
    "manejoSessao",
    "Manejo",
    "Manejo da sessão",
  ],
  [
    "posturaTerapeutica",
    "Postura",
    "Postura terapêutica",
  ],
  [
    "formulacaoHipoteses",
    "Hipóteses",
    "Formulação de hipóteses",
  ],
];

/**
 * Indicadores utilizados no cálculo consolidado da evolução clínica.
 *
 * Estrutura:
 * [campo, rótulo, valor máximo, inverter]
 *
 * Indicadores de intensidade são invertidos, pois quanto menor o valor
 * informado, melhor é o resultado clínico.
 *
 * crisesAnsiedade não participa da média consolidada porque é uma
 * frequência sem uma escala máxima clínica fixa. Ela continua sendo
 * utilizada separadamente nos alertas e no histórico.
 */
export const patientIndicatorFields = [
  [
    "qualidadeSono",
    "Sono",
    10,
    false,
  ],
  [
    "adesaoTarefas",
    "Adesão",
    100,
    false,
  ],
  [
    "aplicacaoEstrategias",
    "Estratégias",
    100,
    false,
  ],
  [
    "evolucaoObjetivos",
    "Objetivos",
    100,
    false,
  ],
  [
    "intensidadeSintomas",
    "Sintomas",
    10,
    true,
  ],
  [
    "evitacaoSocial",
    "Evitação",
    10,
    true,
  ],
  [
    "intensidadeComportamento",
    "Comportamento",
    10,
    true,
  ],
];

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function safeText(value, fallback = "-") {
  if (
    value === null ||
    value === undefined ||
    typeof value === "object"
  ) {
    return fallback;
  }

  const text = String(value).trim();

  return text || fallback;
}

export function safeId(value) {
  if (
    value === null ||
    value === undefined ||
    typeof value === "object"
  ) {
    return "";
  }

  return String(value).trim();
}

/**
 * Informa se determinado campo foi efetivamente computado.
 *
 * O número zero é considerado um valor válido.
 */
export function hasComputedMetric(item = {}, field) {
  return isNumericValue(item?.[field]);
}

/**
 * Retorna quantas métricas foram computadas em um registro.
 *
 * Aceita uma lista simples de nomes ou as listas de configuração
 * competencyFields e patientIndicatorFields.
 */
export function countComputedMetrics(item = {}, fields = []) {
  return asArray(fields).reduce((total, config) => {
    const field = Array.isArray(config) ? config[0] : config;

    return total + (
      hasComputedMetric(item, field) ? 1 : 0
    );
  }, 0);
}

/**
 * Normaliza uma métrica para a escala percentual de 0 a 100.
 *
 * Quando o valor não foi computado, retorna null.
 * Dessa forma, campos desmarcados não entram nas médias.
 */
export function normalizedPercent(
  value,
  max = 10,
  invert = false
) {
  const parsed = toNumber(value, null);
  const parsedMax = toNumber(max, null);

  if (
    parsed === null ||
    parsedMax === null ||
    parsedMax <= 0
  ) {
    return null;
  }

  const adjusted = invert
    ? parsedMax - parsed
    : parsed;

  return Math.max(
    0,
    Math.min(
      100,
      (adjusted / parsedMax) * 100
    )
  );
}

/**
 * Calcula a média das competências avaliadas.
 *
 * Competências com null, undefined ou string vazia são ignoradas.
 * Retorna null quando nenhuma competência foi computada.
 */
export function competenciaMedia(item = {}) {
  const values = competencyFields.map(
    ([field]) => item?.[field]
  );

  return average(values);
}

/**
 * Calcula o índice consolidado da evolução clínica.
 *
 * Cada indicador é normalizado para 0 a 100 antes da média.
 * Indicadores não computados são ignorados.
 * Retorna null quando nenhum indicador consolidável foi computado.
 */
export function evolucaoMedia(item = {}) {
  const normalizedValues = patientIndicatorFields.map(
    ([field, , max, invert]) =>
      normalizedPercent(
        item?.[field],
        max,
        invert
      )
  );

  return average(normalizedValues);
}

export function isArchived(item = {}) {
  return (
    item?.arquivado === true ||
    String(
      item?.statusRegistro || ""
    ).toLowerCase() === "arquivado"
  );
}

export function isPlanoAberto(item = {}) {
  const status = String(
    item?.statusPlano || ""
  )
    .trim()
    .toLowerCase();

  if (!status) return false;

  return ![
    "concluído",
    "concluido",
    "finalizado",
  ].includes(status);
}

export function isCasoAtencao(paciente = {}) {
  const nivel = String(
    paciente?.nivelAtencao || ""
  ).toLowerCase();

  return (
    nivel.includes("alta") ||
    nivel.includes("urgente") ||
    nivel.includes("atenção")
  );
}

export function groupBy(items = [], getKey) {
  if (typeof getKey !== "function") {
    return {};
  }

  return asArray(items).reduce(
    (acc, item) => {
      const key = getKey(item);

      if (
        key === null ||
        key === undefined ||
        key === ""
      ) {
        return acc;
      }

      const normalizedKey = String(key);

      acc[normalizedKey] =
        acc[normalizedKey] || [];

      acc[normalizedKey].push(item);

      return acc;
    },
    {}
  );
}

export function filterLancamentos(
  lancamentos = [],
  filters = {}
) {
  return asArray(lancamentos).filter(
    (item = {}) => {
      if (
        filters.ano &&
        String(item.ano) !==
          String(filters.ano)
      ) {
        return false;
      }

      if (
        filters.mes &&
        String(item.mes) !==
          String(filters.mes)
      ) {
        return false;
      }

      if (
        filters.semana &&
        String(item.semana) !==
          String(filters.semana)
      ) {
        return false;
      }

      if (
        filters.clinicaId &&
        safeId(item.clinicaId) !==
          safeId(filters.clinicaId)
      ) {
        return false;
      }

      if (
        filters.terapeutaId &&
        safeId(item.terapeutaId) !==
          safeId(filters.terapeutaId)
      ) {
        return false;
      }

      if (
        filters.pacienteId &&
        safeId(item.pacienteId) !==
          safeId(filters.pacienteId)
      ) {
        return false;
      }

      if (
        filters.supervisorId &&
        safeId(item.supervisorId) !==
          safeId(filters.supervisorId)
      ) {
        return false;
      }

      return true;
    }
  );
}

export function anosDisponiveis(
  lancamentos = []
) {
  const anos = new Set(
    asArray(lancamentos)
      .map((item) =>
        toNumber(
          item?.ano,
          null
        )
      )
      .filter(
        (ano) =>
          ano !== null
      )
  );

  anos.add(currentYear);

  return [...anos].sort(
    (a, b) =>
      Number(b) - Number(a)
  );
}

/**
 * Monta a tendência mensal ou semanal.
 *
 * As médias ignoram métricas não computadas. Os campos
 * registrosCompetencia e registrosEvolucao informam quantos
 * lançamentos realmente participaram de cada média.
 */
export function buildTendencia(
  lancamentos = [],
  filters = {}
) {
  const usarSemana = Boolean(
    filters.mes
  );

  const groups = groupBy(
    lancamentos,
    (item) =>
      usarSemana
        ? item?.semana
        : item?.mes
  );

  const base = usarSemana
    ? semanas
    : meses;

  return base
    .map((item) => {
      const registros =
        groups[
          String(item.value)
        ] || [];

      const competencias =
        registros
          .map(competenciaMedia)
          .filter(isNumericValue);

      const evolucoes =
        registros
          .map(evolucaoMedia)
          .filter(isNumericValue);

      return {
        id: String(
          item.value
        ),

        label: usarSemana
          ? `S${item.value}`
          : mesNome(
              item.value
            ).slice(0, 3),

        registros:
          registros.length,

        registrosCompetencia:
          competencias.length,

        registrosEvolucao:
          evolucoes.length,

        competencia:
          average(competencias),

        evolucao:
          average(evolucoes),
      };
    })
    .filter(
      (item) =>
        item.registros > 0
    );
}

/**
 * Monta o radar das competências.
 *
 * Quando uma competência não tiver nenhuma avaliação, seu valor será
 * null, e não zero. O campo avaliacoes informa quantos lançamentos
 * participaram da média de cada competência.
 */
export function buildRadar(
  lancamentos = []
) {
  return competencyFields.map(
    ([
      field,
      shortLabel,
      fullLabel,
    ]) => {
      const values = asArray(
        lancamentos
      )
        .map(
          (item) =>
            item?.[field]
        )
        .filter(
          isNumericValue
        );

      return {
        id: field,
        label: shortLabel,
        fullLabel,
        value: average(values),
        avaliacoes:
          values.length,
      };
    }
  );
}

export function buildStatusPlano(
  lancamentos = []
) {
  const groups = groupBy(
    lancamentos,
    (item) =>
      safeText(
        item?.statusPlano,
        "Sem status"
      )
  );

  return Object.entries(
    groups
  ).map(
    ([label, items]) => ({
      id: label,
      label,
      value:
        items.length,
    })
  );
}

function periodValue(item = {}) {
  const ano = toNumber(
    item?.ano,
    0
  );

  const mes = toNumber(
    item?.mes,
    0
  );

  const semana = toNumber(
    item?.semana,
    0
  );

  return (
    ano * 1000 +
    mes * 10 +
    semana
  );
}

export function sortByPeriodDesc(
  items = []
) {
  return [...asArray(items)].sort(
    (a = {}, b = {}) =>
      periodValue(b) -
      periodValue(a)
  );
}

export function selectedName(
  items = [],
  id,
  fallback = "Todos"
) {
  if (!id) return fallback;

  const found = asArray(
    items
  ).find(
    (item) =>
      safeId(item?.id) ===
      safeId(id)
  );

  return safeText(
    found?.nome,
    fallback
  );
}