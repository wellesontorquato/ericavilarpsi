import {
  average,
  formatDecimal,
  formatNumber,
  formatPercent,
  isNumericValue,
  mesNome,
  toNumber,
} from "./format";
import {
  asArray,
  competenciaMedia,
  competencyFields,
  countComputedMetrics,
  evolucaoMedia,
  isPlanoAberto,
  patientIndicatorFields,
  safeId,
  safeText,
  sortByPeriodDesc,
} from "./dashboardUtils";

const NOT_COMPUTED = "Não computado";

const INDICATOR_LABELS = {
  qualidadeSono: "Qualidade do sono",
  adesaoTarefas: "Adesão às tarefas",
  aplicacaoEstrategias: "Aplicação das estratégias",
  evolucaoObjetivos: "Evolução dos objetivos",
  intensidadeSintomas: "Intensidade dos sintomas",
  evitacaoSocial: "Evitação social",
  intensidadeComportamento: "Intensidade do comportamento-alvo",
};

export const REPORT_TYPES = [
  {
    value: "executivo",
    label: "Dashboard executivo (recomendado)",
  },
  {
    value: "completo",
    label: "Relatório completo",
  },
  {
    value: "lancamentos",
    label: "Apenas lançamentos semanais",
  },
  {
    value: "alertas",
    label: "Apenas alertas automáticos",
  },
];

function isArchived(item = {}) {
  return (
    item?.arquivado === true ||
    String(item?.statusRegistro || "").toLowerCase() === "arquivado"
  );
}

function normalizeText(value, fallback = "-") {
  const text = safeText(value, fallback);

  if (typeof text !== "string") return fallback;

  const normalized = text.replace(/\s+/g, " ").trim();

  return normalized || fallback;
}

function hasText(value) {
  if (typeof value !== "string") return false;

  const normalized = value.trim();

  return Boolean(normalized && normalized !== "-");
}

function formatMetricDecimal(value, fractionDigits = 1) {
  return formatDecimal(value, fractionDigits, NOT_COMPUTED);
}

function formatMetricPercent(value, fractionDigits = 0) {
  return formatPercent(value, fractionDigits, NOT_COMPUTED);
}

function formatScale(value, max, fractionDigits = 1) {
  if (!isNumericValue(value)) return NOT_COMPUTED;

  return `${formatDecimal(value, fractionDigits)}/${max}`;
}

function rawPercent(value, max) {
  if (
    !isNumericValue(value) ||
    !isNumericValue(max) ||
    Number(max) <= 0
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.min(100, (Number(value) / Number(max)) * 100)
  );
}

function periodValue(item = {}) {
  return (
    toNumber(item?.ano, 0) * 1000 +
    toNumber(item?.mes, 0) * 10 +
    toNumber(item?.semana, 0)
  );
}

function parseDate(value) {
  if (!value) return null;

  if (
    value instanceof Date &&
    !Number.isNaN(value.getTime())
  ) {
    return value;
  }

  const text = String(value).trim();

  if (!text) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const parsed = new Date(
      `${text.slice(0, 10)}T00:00:00`
    );

    return Number.isNaN(parsed.getTime())
      ? null
      : parsed;
  }

  const parsed = new Date(text);

  return Number.isNaN(parsed.getTime())
    ? null
    : parsed;
}

function comparePlanDeadline(a = {}, b = {}) {
  const dateA = parseDate(a?.prazo);
  const dateB = parseDate(b?.prazo);

  if (dateA && dateB) {
    return dateA.getTime() - dateB.getTime();
  }

  if (dateA) return -1;
  if (dateB) return 1;

  return periodValue(b) - periodValue(a);
}

function uniqueCount(items = [], getValue) {
  return new Set(
    asArray(items)
      .map(getValue)
      .map(safeId)
      .filter(Boolean)
  ).size;
}

function groupCount(items = [], getLabel) {
  const groups = asArray(items).reduce(
    (accumulator, item) => {
      const label = normalizeText(
        getLabel(item),
        "Não informado"
      );

      accumulator[label] =
        (accumulator[label] || 0) + 1;

      return accumulator;
    },
    {}
  );

  return Object.entries(groups)
    .map(([label, value]) => ({
      id: label,
      label,
      value,
    }))
    .sort(
      (a, b) =>
        b.value - a.value ||
        a.label.localeCompare(b.label, "pt-BR")
    );
}

function spreadsheetSafeValue(value) {
  if (value === null || value === undefined) {
    return NOT_COMPUTED;
  }

  const text = String(value);

  return /^[=+\-@]/.test(text.trimStart())
    ? `'${text}`
    : text;
}

function escapeCsv(value) {
  const text = spreadsheetSafeValue(value);

  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function slugify(value) {
  return String(value || "relatorio")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function downloadFile(filename, content, mimeType) {
  if (typeof window === "undefined") return;

  const blob = new Blob(
    [content],
    { type: mimeType }
  );

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(
    () => URL.revokeObjectURL(url),
    0
  );
}

function getColumnValue(row, column) {
  if (typeof column.value === "function") {
    return column.value(row);
  }

  return row?.[column.key];
}

function buildMaps({
  clinicas = [],
  terapeutas = [],
  pacientes = [],
}) {
  return {
    clinicas: Object.fromEntries(
      asArray(clinicas).map((item) => [
        safeId(item?.id),
        item,
      ])
    ),
    terapeutas: Object.fromEntries(
      asArray(terapeutas).map((item) => [
        safeId(item?.id),
        item,
      ])
    ),
    pacientes: Object.fromEntries(
      asArray(pacientes).map((item) => [
        safeId(item?.id),
        item,
      ])
    ),
  };
}

function resolveClinicaNome(
  id,
  maps,
  fallback = "-"
) {
  return normalizeText(
    maps.clinicas[safeId(id)]?.nome,
    fallback
  );
}

function resolveTerapeutaNome(
  id,
  maps,
  fallback = "-"
) {
  return normalizeText(
    maps.terapeutas[safeId(id)]?.nome,
    fallback
  );
}

function resolvePacienteNome(
  id,
  maps,
  fallback = "-"
) {
  return normalizeText(
    maps.pacientes[safeId(id)]?.nome,
    fallback
  );
}

function buildReportMetrics({
  lancamentos = [],
  clinicas = [],
  terapeutas = [],
  pacientes = [],
  alertas = [],
}) {
  const registros = asArray(lancamentos);

  const competenciasPossiveis =
    registros.length * competencyFields.length;

  const indicadoresPossiveis =
    registros.length * patientIndicatorFields.length;

  const competenciasComputadas = registros.reduce(
    (total, item) =>
      total +
      countComputedMetrics(
        item,
        competencyFields
      ),
    0
  );

  const indicadoresComputados = registros.reduce(
    (total, item) =>
      total +
      countComputedMetrics(
        item,
        patientIndicatorFields
      ),
    0
  );

  return {
    registros: registros.length,
    clinicas: asArray(clinicas).length,
    terapeutas: asArray(terapeutas).length,
    pacientes: asArray(pacientes).length,

    terapeutasAvaliados: uniqueCount(
      registros,
      (item) => item?.terapeutaId
    ),

    pacientesAvaliados: uniqueCount(
      registros,
      (item) => item?.pacienteId
    ),

    competencia: average(
      registros.map(competenciaMedia)
    ),

    evolucao: average(
      registros.map(evolucaoMedia)
    ),

    adesao: average(
      registros.map(
        (item) => item?.adesaoTarefas
      )
    ),

    estrategias: average(
      registros.map(
        (item) => item?.aplicacaoEstrategias
      )
    ),

    objetivos: average(
      registros.map(
        (item) => item?.evolucaoObjetivos
      )
    ),

    planosAbertos:
      registros.filter(isPlanoAberto).length,

    alertas: asArray(alertas).length,

    competenciasComputadas,
    competenciasPossiveis,
    indicadoresComputados,
    indicadoresPossiveis,

    coberturaCompetencias:
      competenciasPossiveis > 0
        ? (
            competenciasComputadas /
            competenciasPossiveis
          ) * 100
        : null,

    coberturaIndicadores:
      indicadoresPossiveis > 0
        ? (
            indicadoresComputados /
            indicadoresPossiveis
          ) * 100
        : null,
  };
}

function buildRanking({
  lancamentos = [],
  clinicas = [],
  terapeutas = [],
  rankingMode = "clinicas",
}) {
  const byTherapist =
    rankingMode === "terapeutas";

  const entities = byTherapist
    ? asArray(terapeutas)
    : asArray(clinicas);

  const field = byTherapist
    ? "terapeutaId"
    : "clinicaId";

  return entities
    .map((entity) => {
      const entityId = safeId(entity?.id);

      const registros = asArray(
        lancamentos
      ).filter(
        (item) =>
          safeId(item?.[field]) === entityId
      );

      const value = average(
        registros.map(evolucaoMedia)
      );

      return {
        id: entityId,
        label: normalizeText(
          entity?.nome,
          "Sem nome"
        ),
        value,
        percent: value,
        registros: registros.length,
        pacientes: uniqueCount(
          registros,
          (item) => item?.pacienteId
        ),
      };
    })
    .filter((item) =>
      isNumericValue(item.value)
    )
    .sort(
      (a, b) =>
        b.value - a.value ||
        a.label.localeCompare(
          b.label,
          "pt-BR"
        )
    )
    .slice(0, 5);
}

function buildCompetencias(lancamentos = []) {
  const registros = asArray(lancamentos);

  return competencyFields.map(
    ([field, shortLabel, fullLabel]) => {
      const values = registros
        .map((item) => item?.[field])
        .filter(isNumericValue);

      const value = average(values);

      return {
        id: field,
        field,
        label: fullLabel || shortLabel,
        value,
        percent: isNumericValue(value)
          ? (Number(value) / 5) * 100
          : null,
        max: 5,
        avaliacoes: values.length,
      };
    }
  );
}

function buildIndicadores(lancamentos = []) {
  const registros = asArray(lancamentos);

  const indicadores =
    patientIndicatorFields.map(
      ([
        field,
        fallbackLabel,
        max,
        invert,
      ]) => {
        const values = registros
          .map((item) => item?.[field])
          .filter(isNumericValue);

        const value = average(values);

        return {
          id: field,
          field,
          label:
            INDICATOR_LABELS[field] ||
            fallbackLabel,
          value,
          percent: rawPercent(value, max),
          max,
          unit:
            max === 100
              ? "%"
              : "escala",
          invert,
          avaliacoes: values.length,
        };
      }
    );

  const crisesValues = registros
    .map(
      (item) => item?.crisesAnsiedade
    )
    .filter(isNumericValue);

  indicadores.push({
    id: "crisesAnsiedade",
    field: "crisesAnsiedade",
    label: "Crises de ansiedade por semana",
    value: average(crisesValues),
    percent: null,
    max: null,
    unit: "quantidade",
    invert: true,
    avaliacoes: crisesValues.length,
  });

  return indicadores;
}

function buildPlanosPendentes(
  lancamentos = []
) {
  return asArray(lancamentos)
    .filter(isPlanoAberto)
    .sort(comparePlanDeadline)
    .slice(0, 8);
}

function buildRecomendacoes(
  lancamentos = []
) {
  return sortByPeriodDesc(lancamentos)
    .filter(
      (item) =>
        hasText(item?.recomendacao) ||
        hasText(item?.emocaoElaborada)
    )
    .slice(0, 5);
}

export function buildReportAnalysis({
  lancamentos = [],
  clinicas = [],
  terapeutas = [],
  pacientes = [],
  alertas = [],
  rankingMode = "clinicas",
} = {}) {
  const registrosAtivos =
    asArray(lancamentos).filter(
      (item) => !isArchived(item)
    );

  const clinicasAtivas =
    asArray(clinicas).filter(
      (item) => !isArchived(item)
    );

  const terapeutasAtivos =
    asArray(terapeutas).filter(
      (item) => !isArchived(item)
    );

  const pacientesAtivos =
    asArray(pacientes).filter(
      (item) => !isArchived(item)
    );

  const alertasAtivos =
    asArray(alertas);

  return {
    metrics: buildReportMetrics({
      lancamentos: registrosAtivos,
      clinicas: clinicasAtivas,
      terapeutas: terapeutasAtivos,
      pacientes: pacientesAtivos,
      alertas: alertasAtivos,
    }),

    rankingLabel:
      rankingMode === "terapeutas"
        ? "Evolução por terapeuta"
        : "Evolução por clínica",

    ranking: buildRanking({
      lancamentos: registrosAtivos,
      clinicas: clinicasAtivas,
      terapeutas: terapeutasAtivos,
      rankingMode,
    }),

    competencias:
      buildCompetencias(registrosAtivos),

    sintomas:
      buildIndicadores(registrosAtivos),

    statusCarteira: groupCount(
      pacientesAtivos,
      (item) => item?.statusCaso
    ),

    planosPendentes:
      buildPlanosPendentes(registrosAtivos),

    recomendacoes:
      buildRecomendacoes(registrosAtivos),
  };
}

export const resumoColumns = [
  {
    key: "indicador",
    label: "Indicador",
  },
  {
    key: "valor",
    label: "Valor",
  },
  {
    key: "detalhe",
    label: "Detalhe",
  },
];

export const clinicasColumns = [
  {
    key: "nome",
    label: "Clínica",
  },
  {
    key: "cidade",
    label: "Cidade",
  },
  {
    key: "responsavel",
    label: "Responsável",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "registro",
    label: "Registro",
  },
];

export const terapeutasColumns = [
  {
    key: "nome",
    label: "Terapeuta",
  },
  {
    key: "clinica",
    label: "Clínica",
  },
  {
    key: "dataEntrada",
    label: "Data de entrada",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "observacao",
    label: "Observação",
  },
  {
    key: "registro",
    label: "Registro",
  },
];

export const pacientesColumns = [
  {
    key: "nome",
    label: "Paciente/caso",
  },
  {
    key: "clinica",
    label: "Clínica",
  },
  {
    key: "terapeuta",
    label: "Terapeuta",
  },
  {
    key: "dataInicio",
    label: "Data de início",
  },
  {
    key: "statusCaso",
    label: "Status do caso",
  },
  {
    key: "nivelAtencao",
    label: "Nível de atenção",
  },
  {
    key: "queixaPrincipal",
    label: "Queixa principal",
  },
  {
    key: "objetivosTerapeuticos",
    label: "Objetivos terapêuticos",
  },
  {
    key: "observacoes",
    label: "Observações",
  },
  {
    key: "registro",
    label: "Registro",
  },
];

export const lancamentosColumns = [
  {
    key: "ano",
    label: "Ano",
  },
  {
    key: "mes",
    label: "Mês",
  },
  {
    key: "semana",
    label: "Semana",
  },
  {
    key: "clinica",
    label: "Clínica",
  },
  {
    key: "terapeuta",
    label: "Terapeuta",
  },
  {
    key: "paciente",
    label: "Paciente/caso",
  },
  {
    key: "competenciaMedia",
    label: "Média das competências",
  },
  {
    key: "competenciasComputadas",
    label: "Competências computadas",
  },
  {
    key: "qualidadeConceitualizacao",
    label: "Conceitualização",
  },
  {
    key: "planejamentoTerapeutico",
    label: "Planejamento terapêutico",
  },
  {
    key: "aplicacaoTecnicasTcc",
    label: "Técnicas TCC",
  },
  {
    key: "manejoSessao",
    label: "Manejo da sessão",
  },
  {
    key: "posturaTerapeutica",
    label: "Postura terapêutica",
  },
  {
    key: "formulacaoHipoteses",
    label: "Formulação de hipóteses",
  },
  {
    key: "evolucaoMedia",
    label: "Evolução clínica",
  },
  {
    key: "indicadoresComputados",
    label: "Indicadores computados",
  },
  {
    key: "qualidadeSono",
    label: "Qualidade do sono",
  },
  {
    key: "adesaoTarefas",
    label: "Adesão às tarefas",
  },
  {
    key: "aplicacaoEstrategias",
    label: "Aplicação das estratégias",
  },
  {
    key: "evolucaoObjetivos",
    label: "Evolução dos objetivos",
  },
  {
    key: "intensidadeSintomas",
    label: "Intensidade dos sintomas",
  },
  {
    key: "evitacaoSocial",
    label: "Evitação social",
  },
  {
    key: "intensidadeComportamento",
    label: "Intensidade do comportamento-alvo",
  },
  {
    key: "crisesAnsiedade",
    label: "Crises de ansiedade/semana",
  },
  {
    key: "statusPlano",
    label: "Status do plano",
  },
  {
    key: "prazo",
    label: "Prazo",
  },
  {
    key: "pontoForte",
    label: "Ponto forte",
  },
  {
    key: "pontoDesenvolver",
    label: "Ponto a desenvolver",
  },
  {
    key: "recomendacao",
    label: "Recomendação",
  },
  {
    key: "planoAcao",
    label: "Plano de ação",
  },
  {
    key: "emocaoElaborada",
    label: "Emoção a elaborar",
  },
  {
    key: "observacao",
    label: "Observação",
  },
  {
    key: "registro",
    label: "Registro",
  },
];

export const alertasColumns = [
  {
    key: "levelLabel",
    label: "Nível",
  },
  {
    key: "typeLabel",
    label: "Tipo",
  },
  {
    key: "periodo",
    label: "Período",
  },
  {
    key: "pacienteNome",
    label: "Paciente/caso",
  },
  {
    key: "terapeutaNome",
    label: "Terapeuta",
  },
  {
    key: "clinicaNome",
    label: "Clínica",
  },
  {
    key: "summary",
    label: "Resumo",
  },
  {
    key: "detail",
    label: "Detalhe",
  },
  {
    key: "criteria",
    label: "Critério",
  },
];

function buildPeriodDetail(filters = {}) {
  const parts = [];

  if (filters.semana) {
    parts.push(`Semana ${filters.semana}`);
  }

  parts.push(
    filters.mes
      ? mesNome(filters.mes)
      : "Todos os meses"
  );

  parts.push(
    filters.ano || "Todos os anos"
  );

  return parts.join(" · ");
}

export function buildResumoRows({
  metrics = {},
  filters = {},
  contexto,
}) {
  return [
    {
      indicador: "Contexto",
      valor: contexto || "Geral",
      detalhe: "Filtro principal do relatório",
    },
    {
      indicador: "Período",
      valor: buildPeriodDetail(filters),
      detalhe: "Recorte temporal aplicado",
    },
    {
      indicador: "Lançamentos",
      valor: formatNumber(metrics.registros),
      detalhe: "Registros semanais ativos filtrados",
    },
    {
      indicador: "Pacientes",
      valor: formatNumber(metrics.pacientes),
      detalhe: `${formatNumber(
        metrics.pacientesAvaliados
      )} paciente(s) com lançamento no período`,
    },
    {
      indicador: "Média de competências",
      valor: isNumericValue(metrics.competencia)
        ? `${formatMetricDecimal(
            metrics.competencia
          )}/5`
        : NOT_COMPUTED,
      detalhe: `${formatNumber(
        metrics.competenciasComputadas
      )}/${formatNumber(
        metrics.competenciasPossiveis
      )} campos computados`,
    },
    {
      indicador: "Evolução clínica",
      valor: formatMetricPercent(
        metrics.evolucao
      ),
      detalhe: `${formatNumber(
        metrics.indicadoresComputados
      )}/${formatNumber(
        metrics.indicadoresPossiveis
      )} indicadores computados`,
    },
    {
      indicador: "Adesão às tarefas",
      valor: formatMetricPercent(
        metrics.adesao
      ),
      detalhe:
        "Campos não computados foram ignorados",
    },
    {
      indicador: "Aplicação das estratégias",
      valor: formatMetricPercent(
        metrics.estrategias
      ),
      detalhe:
        "Campos não computados foram ignorados",
    },
    {
      indicador: "Evolução dos objetivos",
      valor: formatMetricPercent(
        metrics.objetivos
      ),
      detalhe:
        "Campos não computados foram ignorados",
    },
    {
      indicador: "Planos em aberto",
      valor: formatNumber(
        metrics.planosAbertos
      ),
      detalhe: "Planos ainda não concluídos",
    },
    {
      indicador: "Alertas",
      valor: formatNumber(metrics.alertas),
      detalhe:
        "Alertas automáticos no recorte",
    },
  ];
}

export function buildClinicasRows(
  clinicas = []
) {
  return asArray(clinicas).map((item) => ({
    id: safeId(item?.id),
    nome: normalizeText(item?.nome),
    cidade: normalizeText(item?.cidade),
    responsavel: normalizeText(
      item?.responsavel
    ),
    status: normalizeText(
      item?.status,
      "Ativa"
    ),
    registro: isArchived(item)
      ? "Arquivado"
      : normalizeText(
          item?.statusRegistro,
          "Ativo"
        ),
  }));
}

export function buildTerapeutasRows(
  terapeutas = [],
  context = {}
) {
  const maps = buildMaps(context);

  return asArray(terapeutas).map(
    (item) => ({
      id: safeId(item?.id),
      nome: normalizeText(item?.nome),
      clinica: resolveClinicaNome(
        item?.clinicaId,
        maps
      ),
      dataEntrada: normalizeText(
        item?.dataEntrada
      ),
      status: normalizeText(
        item?.status,
        "Ativo"
      ),
      observacao: normalizeText(
        item?.observacao
      ),
      registro: isArchived(item)
        ? "Arquivado"
        : normalizeText(
            item?.statusRegistro,
            "Ativo"
          ),
    })
  );
}

export function buildPacientesRows(
  pacientes = [],
  context = {}
) {
  const maps = buildMaps(context);

  return asArray(pacientes).map(
    (item) => ({
      id: safeId(item?.id),
      nome: normalizeText(item?.nome),
      clinica: resolveClinicaNome(
        item?.clinicaId,
        maps
      ),
      terapeuta: resolveTerapeutaNome(
        item?.terapeutaId,
        maps
      ),
      dataInicio: normalizeText(
        item?.dataInicio
      ),
      statusCaso: normalizeText(
        item?.statusCaso
      ),
      nivelAtencao: normalizeText(
        item?.nivelAtencao
      ),
      queixaPrincipal: normalizeText(
        item?.queixaPrincipal
      ),
      objetivosTerapeuticos:
        normalizeText(
          item?.objetivosTerapeuticos
        ),
      observacoes: normalizeText(
        item?.observacoes
      ),
      registro: isArchived(item)
        ? "Arquivado"
        : normalizeText(
            item?.statusRegistro,
            "Ativo"
          ),
    })
  );
}

export function buildLancamentosRows(
  lancamentos = [],
  context = {}
) {
  const maps = buildMaps(context);

  return sortByPeriodDesc(
    lancamentos
  ).map((item) => {
    const competenciasComputadas =
      countComputedMetrics(
        item,
        competencyFields
      );

    const indicadoresComputados =
      countComputedMetrics(
        item,
        patientIndicatorFields
      );

    const mediaCompetencia =
      competenciaMedia(item);

    return {
      id: safeId(item?.id),
      ano: normalizeText(item?.ano),

      mes: item?.mes
        ? mesNome(item.mes)
        : "-",

      semana: item?.semana
        ? `Semana ${item.semana}`
        : "-",

      clinica: normalizeText(
        item?.clinicaNome,
        resolveClinicaNome(
          item?.clinicaId,
          maps
        )
      ),

      terapeuta: normalizeText(
        item?.terapeutaNome,
        resolveTerapeutaNome(
          item?.terapeutaId,
          maps
        )
      ),

      paciente: normalizeText(
        item?.pacienteNome,
        resolvePacienteNome(
          item?.pacienteId,
          maps
        )
      ),

      competenciaMedia:
        isNumericValue(mediaCompetencia)
          ? `${formatMetricDecimal(
              mediaCompetencia
            )}/5`
          : NOT_COMPUTED,

      competenciasComputadas:
        `${competenciasComputadas}/${competencyFields.length}`,

      qualidadeConceitualizacao:
        formatScale(
          item?.qualidadeConceitualizacao,
          5
        ),

      planejamentoTerapeutico:
        formatScale(
          item?.planejamentoTerapeutico,
          5
        ),

      aplicacaoTecnicasTcc:
        formatScale(
          item?.aplicacaoTecnicasTcc,
          5
        ),

      manejoSessao:
        formatScale(
          item?.manejoSessao,
          5
        ),

      posturaTerapeutica:
        formatScale(
          item?.posturaTerapeutica,
          5
        ),

      formulacaoHipoteses:
        formatScale(
          item?.formulacaoHipoteses,
          5
        ),

      evolucaoMedia:
        formatMetricPercent(
          evolucaoMedia(item)
        ),

      indicadoresComputados:
        `${indicadoresComputados}/${patientIndicatorFields.length}`,

      qualidadeSono:
        formatScale(
          item?.qualidadeSono,
          10
        ),

      adesaoTarefas:
        formatMetricPercent(
          item?.adesaoTarefas
        ),

      aplicacaoEstrategias:
        formatMetricPercent(
          item?.aplicacaoEstrategias
        ),

      evolucaoObjetivos:
        formatMetricPercent(
          item?.evolucaoObjetivos
        ),

      intensidadeSintomas:
        formatScale(
          item?.intensidadeSintomas,
          10
        ),

      evitacaoSocial:
        formatScale(
          item?.evitacaoSocial,
          10
        ),

      intensidadeComportamento:
        formatScale(
          item?.intensidadeComportamento,
          10
        ),

      crisesAnsiedade:
        isNumericValue(
          item?.crisesAnsiedade
        )
          ? formatDecimal(
              item.crisesAnsiedade,
              0
            )
          : NOT_COMPUTED,

      statusPlano: normalizeText(
        item?.statusPlano,
        "Sem status"
      ),

      prazo: normalizeText(
        item?.prazo,
        "Sem prazo"
      ),

      pontoForte: normalizeText(
        item?.pontoForte
      ),

      pontoDesenvolver: normalizeText(
        item?.pontoDesenvolver
      ),

      recomendacao: normalizeText(
        item?.recomendacao
      ),

      planoAcao: normalizeText(
        item?.planoAcao
      ),

      emocaoElaborada: normalizeText(
        item?.emocaoElaborada
      ),

      observacao: normalizeText(
        item?.observacao
      ),

      registro: isArchived(item)
        ? "Arquivado"
        : "Ativo",
    };
  });
}

export function buildAlertasRows(
  alertas = []
) {
  return asArray(alertas).map(
    (item) => ({
      id: safeId(item?.id),

      levelLabel: normalizeText(
        item?.levelLabel
      ),

      typeLabel: normalizeText(
        item?.typeLabel
      ),

      periodo:
        item?.periodo &&
        item.periodo !== "-"
          ? normalizeText(item.periodo)
          : "Cadastro atual",

      pacienteNome: normalizeText(
        item?.pacienteNome,
        "Não se aplica"
      ),

      terapeutaNome: normalizeText(
        item?.terapeutaNome,
        "Não informado"
      ),

      clinicaNome: normalizeText(
        item?.clinicaNome,
        "Não informada"
      ),

      summary: normalizeText(
        item?.summary
      ),

      detail: normalizeText(
        item?.detail
      ),

      criteria: normalizeText(
        item?.criteria
      ),
    })
  );
}

export function buildReportSheets({
  resumoRows = [],
  clinicasRows = [],
  terapeutasRows = [],
  pacientesRows = [],
  lancamentosRows = [],
  alertasRows = [],
  type = "executivo",
} = {}) {
  const summarySheet = {
    name: "Resumo executivo",
    columns: resumoColumns,
    rows: resumoRows,
  };

  if (type === "executivo") {
    return [
      summarySheet,
      {
        name: "Atenção imediata - Top 15",
        columns: alertasColumns,
        rows: alertasRows.slice(0, 15),
      },
      {
        name: "Últimos lançamentos - Top 20",
        columns: lancamentosColumns,
        rows: lancamentosRows.slice(0, 20),
      },
    ];
  }

  if (type === "lancamentos") {
    return [
      summarySheet,
      {
        name: "Lançamentos semanais",
        columns: lancamentosColumns,
        rows: lancamentosRows,
      },
    ];
  }

  if (type === "alertas") {
    return [
      summarySheet,
      {
        name: "Alertas automáticos",
        columns: alertasColumns,
        rows: alertasRows,
      },
    ];
  }

  return [
    summarySheet,
    {
      name: "Lançamentos semanais",
      columns: lancamentosColumns,
      rows: lancamentosRows,
    },
    {
      name: "Alertas automáticos",
      columns: alertasColumns,
      rows: alertasRows,
    },
    {
      name: "Pacientes",
      columns: pacientesColumns,
      rows: pacientesRows,
    },
    {
      name: "Terapeutas",
      columns: terapeutasColumns,
      rows: terapeutasRows,
    },
    {
      name: "Clínicas",
      columns: clinicasColumns,
      rows: clinicasRows,
    },
  ];
}

export function exportCsv(
  filename,
  columns = [],
  rows = []
) {
  const header = asArray(columns)
    .map(
      (column) =>
        escapeCsv(column.label)
    )
    .join(";");

  const body = asArray(rows)
    .map((row) =>
      asArray(columns)
        .map((column) =>
          escapeCsv(
            getColumnValue(row, column)
          )
        )
        .join(";")
    )
    .join("\n");

  downloadFile(
    `${slugify(filename)}.csv`,
    `\uFEFFsep=;\n${header}${
      body ? `\n${body}` : ""
    }`,
    "text/csv;charset=utf-8"
  );
}

function metricCardHtml(
  label,
  value,
  detail,
  color = "#9f6947"
) {
  return `
    <td style="background-color:#ffffff;border:2px solid #d8c8bf;text-align:center;padding:20px;height:100px;width:25%;">
      <span style="font-size:12px;color:#7b6c61;font-weight:bold;">
        ${escapeHtml(label)}
      </span>
      <br/>
      <span style="font-size:30px;color:${color};font-weight:bold;">
        ${escapeHtml(value)}
      </span>
      <br/>
      <span style="font-size:11px;color:#7b6c61;">
        ${escapeHtml(detail)}
      </span>
    </td>
  `;
}

export function exportExcelWorkbook(
  filename,
  sheets = [],
  dashboardMetrics = null
) {
  let htmlContent = `
    <html
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
    >
      <head>
        <meta charset="utf-8" />
        <meta
          name="ProgId"
          content="Excel.Sheet"
        />
      </head>

      <body
        style="
          font-family:Arial,sans-serif;
          background-color:#f4efe8;
        "
      >
  `;

  if (dashboardMetrics) {
    htmlContent += `
      <table
        style="
          width:100%;
          border-collapse:collapse;
        "
      >
        <tr>
          <td
            colspan="4"
            style="height:20px;"
          ></td>
        </tr>

        <tr>
          <td
            colspan="4"
            style="
              background-color:#392619;
              color:#ffffff;
              font-size:24px;
              font-weight:bold;
              text-align:center;
              height:60px;
              vertical-align:middle;
            "
          >
            RELATÓRIO EXECUTIVO:
            ${escapeHtml(filename)}
          </td>
        </tr>

        <tr>
          <td
            colspan="4"
            style="height:20px;"
          ></td>
        </tr>

        <tr>
          ${metricCardHtml(
            "EVOLUÇÃO CLÍNICA",
            formatMetricPercent(
              dashboardMetrics.evolucao
            ),
            "Indicadores computados"
          )}

          ${metricCardHtml(
            "MÉDIA TÉCNICA",
            isNumericValue(
              dashboardMetrics.competencia
            )
              ? `${formatMetricDecimal(
                  dashboardMetrics.competencia
                )}/5`
              : NOT_COMPUTED,
            "Competências computadas"
          )}

          ${metricCardHtml(
            "ALERTAS",
            formatNumber(
              dashboardMetrics.alertas
            ),
            "Alertas no recorte",
            "#a43c32"
          )}

          ${metricCardHtml(
            "PACIENTES",
            formatNumber(
              dashboardMetrics.pacientes
            ),
            "Casos incluídos"
          )}
        </tr>

        <tr>
          <td
            colspan="4"
            style="height:30px;"
          ></td>
        </tr>
      </table>
    `;
  }

  asArray(sheets).forEach((sheet) => {
    const columns = asArray(
      sheet?.columns
    );

    const rows = asArray(
      sheet?.rows
    );

    htmlContent += `
      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-bottom:30px;
        "
      >
        <tr>
          <td
            colspan="${Math.max(
              columns.length,
              1
            )}"
            style="
              background-color:#9f6947;
              color:#ffffff;
              font-size:18px;
              font-weight:bold;
              height:40px;
              vertical-align:middle;
              padding-left:10px;
            "
          >
            ${escapeHtml(
              sheet?.name || "Dados"
            )}
          </td>
        </tr>

        <tr>
          ${columns
            .map(
              (column) => `
                <td
                  style="
                    background-color:#efe2d5;
                    color:#5f3825;
                    font-weight:bold;
                    padding:10px;
                    border:1px solid #d8c8bf;
                  "
                >
                  ${escapeHtml(
                    column.label
                  )}
                </td>
              `
            )
            .join("")}
        </tr>

        ${
          rows.length
            ? rows
                .map(
                  (
                    row,
                    rowIndex
                  ) => `
                    <tr>
                      ${columns
                        .map(
                          (
                            column
                          ) => `
                            <td
                              style="
                                background-color:${
                                  rowIndex %
                                    2 ===
                                  0
                                    ? "#ffffff"
                                    : "#fcfaf8"
                                };
                                border:1px solid #d8c8bf;
                                padding:9px;
                                vertical-align:top;
                                color:#392619;
                              "
                            >
                              ${escapeHtml(
                                spreadsheetSafeValue(
                                  getColumnValue(
                                    row,
                                    column
                                  )
                                )
                              )}
                            </td>
                          `
                        )
                        .join("")}
                    </tr>
                  `
                )
                .join("")
            : `
              <tr>
                <td
                  colspan="${Math.max(
                    columns.length,
                    1
                  )}"
                  style="
                    padding:12px;
                    border:1px solid #d8c8bf;
                    color:#7b6c61;
                  "
                >
                  Sem dados para este recorte.
                </td>
              </tr>
            `
        }
      </table>
    `;
  });

  htmlContent += "</body></html>";

  downloadFile(
    `${slugify(filename)}.xls`,
    `\uFEFF${htmlContent}`,
    "application/vnd.ms-excel;charset=utf-8"
  );
}

export function buildTopRows(
  items = [],
  key = "label",
  valueKey = "value",
  limit = 6
) {
  return asArray(items)
    .slice(0, limit)
    .map((item) => ({
      id: safeId(item?.id),

      label: normalizeText(
        item?.[key]
      ),

      value: isNumericValue(
        item?.[valueKey]
      )
        ? Number(item[valueKey])
        : null,
    }));
}