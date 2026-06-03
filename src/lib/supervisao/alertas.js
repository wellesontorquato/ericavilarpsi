import { mesNome } from "./format";
import {
  asArray,
  competenciaMedia,
  evolucaoMedia,
  filterLancamentos,
  safeId,
  safeText,
  sortByPeriodDesc,
} from "./dashboardUtils";

export const ALERT_LEVELS = {
  alto: {
    label: "Alto",
    order: 3,
    description: "Prioridade para revisão da supervisora.",
  },
  medio: {
    label: "Médio",
    order: 2,
    description: "Requer acompanhamento e possível intervenção.",
  },
  baixo: {
    label: "Baixo",
    order: 1,
    description: "Ponto de atenção para monitoramento.",
  },
};

export const ALERT_TYPES = {
  plano_vencido: "Plano vencido",
  plano_aberto: "Plano em aberto",
  baixa_adesao: "Baixa adesão",
  indicador_atencao: "Indicador em atenção",
  piora_clinica: "Piora clínica",
  competencia_baixa: "Competência baixa",
  queda_competencia: "Queda de competência",
  sem_lancamento: "Sem lançamento",
  caso_atencao: "Caso em atenção",
};

const INDICATOR_RULES = [
  {
    field: "qualidadeSono",
    label: "Qualidade do sono",
    max: 10,
    higherIsBetter: true,
    medium: 4,
    high: 3,
    detail: "Sono baixo no último acompanhamento.",
  },
  {
    field: "adesaoTarefas",
    label: "Adesão às tarefas",
    max: 100,
    higherIsBetter: true,
    medium: 50,
    high: 30,
    detail: "Adesão abaixo do esperado para as intervenções combinadas.",
  },
  {
    field: "evolucaoObjetivos",
    label: "Evolução dos objetivos",
    max: 100,
    higherIsBetter: true,
    medium: 40,
    high: 25,
    detail: "Baixo avanço nos objetivos terapêuticos definidos.",
  },
  {
    field: "intensidadeSintomas",
    label: "Intensidade dos sintomas",
    max: 10,
    higherIsBetter: false,
    medium: 6,
    high: 8,
    detail: "Sintomas elevados no último acompanhamento.",
  },
  {
    field: "evitacaoSocial",
    label: "Evitação social",
    max: 10,
    higherIsBetter: false,
    medium: 6,
    high: 8,
    detail: "Evitação social elevada no último acompanhamento.",
  },
  {
    field: "crisesAnsiedade",
    label: "Crises por semana",
    max: null,
    higherIsBetter: false,
    medium: 2,
    high: 4,
    detail: "Frequência de crises acima do esperado.",
  },
];

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isArchived(item = {}) {
  return item?.arquivado === true || String(item?.statusRegistro || "").toLowerCase() === "arquivado";
}

function isActivePatient(paciente = {}) {
  const status = String(paciente?.statusCaso || "").toLowerCase();
  return !isArchived(paciente) && !status.includes("encerr") && !status.includes("alta");
}

function isOpenStatus(status) {
  const normalized = String(status || "").toLowerCase();

  if (!normalized) return false;

  return !["concluído", "concluido", "finalizado", "feito", "resolvido"].some((item) =>
    normalized.includes(item)
  );
}

function parseDate(value) {
  if (!value) return null;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  const text = String(value).trim();

  if (!text) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    const parsed = new Date(`${text.slice(0, 10)}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const brMatch = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brMatch) {
    const [, day, month, year] = brMatch;
    const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isPastDate(value) {
  const dueDate = parseDate(value);

  if (!dueDate) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
}

function periodValue(item = {}) {
  return Number(item.ano || 0) * 1000 + Number(item.mes || 0) * 10 + Number(item.semana || 0);
}

function periodLabel(item = {}) {
  return `${mesNome(item.mes)} · ${item.ano || "-"} · Semana ${item.semana || "-"}`;
}

function byPeriodAsc(items = []) {
  return [...asArray(items)].sort((a, b) => periodValue(a) - periodValue(b));
}

function getLatest(items = []) {
  return sortByPeriodDesc(items)[0];
}

function groupBy(items = [], keyFn) {
  return asArray(items).reduce((acc, item) => {
    const key = keyFn(item);
    if (!key) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

function getMatchedEntityItems(items = [], filters = {}) {
  return asArray(items).filter((item) => {
    if (filters.clinicaId && safeId(item?.clinicaId) !== safeId(filters.clinicaId)) return false;
    if (filters.terapeutaId && safeId(item?.terapeutaId) !== safeId(filters.terapeutaId)) return false;
    if (filters.pacienteId && safeId(item?.id) !== safeId(filters.pacienteId)) return false;
    return true;
  });
}

function createAlert({
  type,
  level = "baixo",
  title,
  summary,
  detail,
  criteria,
  lancamento,
  paciente,
  terapeuta,
  clinica,
  value,
  actionHref,
  idSuffix = "",
}) {
  const item = lancamento || paciente || terapeuta || clinica || {};
  const pacienteId = safeId(paciente?.id || lancamento?.pacienteId);
  const terapeutaId = safeId(terapeuta?.id || paciente?.terapeutaId || lancamento?.terapeutaId);
  const clinicaId = safeId(clinica?.id || terapeuta?.clinicaId || paciente?.clinicaId || lancamento?.clinicaId);
  const typeLabel = ALERT_TYPES[type] || type;

  return {
    id: [type, pacienteId, terapeutaId, clinicaId, item?.id, item?.ano, item?.mes, item?.semana, idSuffix]
      .filter(Boolean)
      .join("-"),
    type,
    typeLabel,
    level,
    levelLabel: ALERT_LEVELS[level]?.label || level,
    title,
    summary,
    detail,
    criteria,
    value,
    periodo: lancamento ? periodLabel(lancamento) : "-",
    ano: lancamento?.ano || "",
    mes: lancamento?.mes || "",
    semana: lancamento?.semana || "",
    clinicaId,
    clinicaNome: safeText(clinica?.nome || paciente?.clinicaNome || lancamento?.clinicaNome, "Clínica não informada"),
    terapeutaId,
    terapeutaNome: safeText(terapeuta?.nome || paciente?.terapeutaNome || lancamento?.terapeutaNome, "Terapeuta não informado"),
    pacienteId,
    pacienteNome: safeText(paciente?.nome || lancamento?.pacienteNome, "Paciente/caso não informado"),
    actionHref: actionHref || (pacienteId ? `/admin/supervisao/historico?pacienteId=${pacienteId}` : "/admin/supervisao/historico"),
    sortScore: ALERT_LEVELS[level]?.order || 0,
  };
}

function indicatorSeverity(rule, value) {
  if (value === null) return null;

  if (rule.higherIsBetter) {
    if (value <= rule.high) return "alto";
    if (value <= rule.medium) return "medio";
    return null;
  }

  if (value >= rule.high) return "alto";
  if (value >= rule.medium) return "medio";
  return null;
}

function indicatorCriteria(rule) {
  if (rule.higherIsBetter) {
    return `Sinaliza quando ${rule.label.toLowerCase()} fica abaixo do limite definido.`;
  }

  return `Sinaliza quando ${rule.label.toLowerCase()} fica acima do limite definido.`;
}

export function buildAlertasSupervisao({ clinicas = [], terapeutas = [], pacientes = [], lancamentos = [], filters = {} }) {
  const clinicaMap = Object.fromEntries(asArray(clinicas).map((item) => [safeId(item.id), item]));
  const terapeutaMap = Object.fromEntries(asArray(terapeutas).map((item) => [safeId(item.id), item]));
  const pacienteMap = Object.fromEntries(asArray(pacientes).map((item) => [safeId(item.id), item]));

  const lancamentosFiltrados = filterLancamentos(lancamentos, filters);
  const lancamentosPorPacienteFiltrado = groupBy(lancamentosFiltrados, (item) => safeId(item.pacienteId));
  const lancamentosPorPacienteGeral = groupBy(lancamentos, (item) => safeId(item.pacienteId));
  const lancamentosPorTerapeutaFiltrado = groupBy(lancamentosFiltrados, (item) => safeId(item.terapeutaId));
  const pacientesFiltrados = getMatchedEntityItems(pacientes, filters).filter(isActivePatient);
  const alertas = [];

  pacientesFiltrados.forEach((paciente) => {
    const clinica = clinicaMap[safeId(paciente.clinicaId)];
    const terapeuta = terapeutaMap[safeId(paciente.terapeutaId)];
    const nivelAtencao = String(paciente.nivelAtencao || "").toLowerCase();

    if (nivelAtencao.includes("alta") || nivelAtencao.includes("urgente")) {
      alertas.push(
        createAlert({
          type: "caso_atencao",
          level: "alto",
          title: "Caso marcado com atenção alta",
          summary: `${safeText(paciente.nome, "Paciente/caso")} está cadastrado com nível de atenção elevado.`,
          detail: safeText(paciente.observacoes || paciente.queixaPrincipal, "Revise o cadastro do caso e priorize acompanhamento."),
          criteria: "Nível de atenção do cadastro contém alta ou urgente.",
          paciente,
          terapeuta,
          clinica,
          actionHref: `/admin/supervisao/dashboard-pacientes?pacienteId=${paciente.id}`,
        })
      );
    } else if (nivelAtencao.includes("média") || nivelAtencao.includes("media") || nivelAtencao.includes("atenção")) {
      alertas.push(
        createAlert({
          type: "caso_atencao",
          level: "medio",
          title: "Caso marcado para acompanhamento",
          summary: `${safeText(paciente.nome, "Paciente/caso")} está cadastrado com nível de atenção intermediário.`,
          detail: safeText(paciente.observacoes || paciente.queixaPrincipal, "Acompanhar evolução nas próximas supervisões."),
          criteria: "Nível de atenção do cadastro contém média ou atenção.",
          paciente,
          terapeuta,
          clinica,
          actionHref: `/admin/supervisao/dashboard-pacientes?pacienteId=${paciente.id}`,
        })
      );
    }

    const lancamentosPacienteFiltrado = lancamentosPorPacienteFiltrado[safeId(paciente.id)] || [];

    if (!lancamentosPacienteFiltrado.length) {
      alertas.push(
        createAlert({
          type: "sem_lancamento",
          level: "medio",
          title: "Paciente sem lançamento no período",
          summary: `${safeText(paciente.nome, "Paciente/caso")} não possui lançamento para o período filtrado.`,
          detail: "Verifique se o acompanhamento semanal foi preenchido ou se o caso deve ser arquivado/encerrado.",
          criteria: "Paciente ativo sem lançamento correspondente aos filtros de ano, mês e semana selecionados.",
          paciente,
          terapeuta,
          clinica,
          actionHref: `/admin/supervisao/lancamento-semanal`,
        })
      );

      return;
    }

    const latest = getLatest(lancamentosPacienteFiltrado);

    INDICATOR_RULES.forEach((rule) => {
      const value = safeNumber(latest?.[rule.field]);
      const level = indicatorSeverity(rule, value);

      if (!level) return;

      alertas.push(
        createAlert({
          type: rule.field === "adesaoTarefas" ? "baixa_adesao" : "indicador_atencao",
          level,
          title: `${rule.label} requer atenção`,
          summary: `${rule.label}: ${value}${rule.max === 100 ? "%" : ""} no último acompanhamento.`,
          detail: rule.detail,
          criteria: indicatorCriteria(rule),
          lancamento: latest,
          paciente,
          terapeuta,
          clinica,
          value,
          idSuffix: rule.field,
          actionHref: `/admin/supervisao/dashboard-pacientes?pacienteId=${paciente.id}`,
        })
      );
    });

    const statusAberto = isOpenStatus(latest?.statusPlano);
    const planoVencido = statusAberto && isPastDate(latest?.prazo);

    if (planoVencido) {
      alertas.push(
        createAlert({
          type: "plano_vencido",
          level: "alto",
          title: "Plano de ação vencido",
          summary: `Prazo vencido em ${safeText(latest?.prazo)} para ${safeText(paciente.nome, "Paciente/caso")}.`,
          detail: safeText(latest?.planoAcao || latest?.recomendacao, "Revise o plano e atualize o status da ação."),
          criteria: "Prazo menor que hoje e status diferente de concluído/finalizado.",
          lancamento: latest,
          paciente,
          terapeuta,
          clinica,
          actionHref: `/admin/supervisao/historico?pacienteId=${paciente.id}`,
        })
      );
    } else if (statusAberto) {
      alertas.push(
        createAlert({
          type: "plano_aberto",
          level: "baixo",
          title: "Plano de ação em aberto",
          summary: `Plano com status ${safeText(latest?.statusPlano)} para ${safeText(paciente.nome, "Paciente/caso")}.`,
          detail: safeText(latest?.planoAcao || latest?.recomendacao, "Acompanhar andamento da ação combinada."),
          criteria: "Status do plano existe e ainda não está concluído/finalizado.",
          lancamento: latest,
          paciente,
          terapeuta,
          clinica,
          actionHref: `/admin/supervisao/historico?pacienteId=${paciente.id}`,
        })
      );
    }

    const orderedPaciente = byPeriodAsc(lancamentosPorPacienteGeral[safeId(paciente.id)] || []);
    const latestIndex = orderedPaciente.findIndex((item) => safeId(item.id) === safeId(latest.id));
    const previous = latestIndex > 0 ? orderedPaciente[latestIndex - 1] : orderedPaciente[orderedPaciente.length - 2];

    if (previous) {
      const previousScore = evolucaoMedia(previous);
      const latestScore = evolucaoMedia(latest);
      const diff = latestScore - previousScore;

      if (diff <= -10 || diff <= -5) {
        alertas.push(
          createAlert({
            type: "piora_clinica",
            level: diff <= -10 ? "alto" : "medio",
            title: "Piora clínica em relação ao acompanhamento anterior",
            summary: `Score clínico caiu ${Math.abs(diff).toFixed(0)} p.p. em relação ao registro anterior.`,
            detail: "A queda considera a direção de cada indicador: alguns melhoram quando sobem, outros quando caem.",
            criteria: "Comparação do score consolidado atual contra o acompanhamento anterior do paciente.",
            lancamento: latest,
            paciente,
            terapeuta,
            clinica,
            value: diff,
            actionHref: `/admin/supervisao/historico?pacienteId=${paciente.id}`,
          })
        );
      }
    }

    const competencia = competenciaMedia(latest);

    if (competencia > 0 && competencia < 3) {
      alertas.push(
        createAlert({
          type: "competencia_baixa",
          level: competencia < 2.5 ? "alto" : "medio",
          title: "Competência técnica abaixo do esperado no caso",
          summary: `Média técnica ${competencia.toFixed(1)}/5 no último acompanhamento.`,
          detail: "Revise conceitualização, planejamento, aplicação de técnicas, manejo, postura e formulação de hipóteses.",
          criteria: "Média das competências menor que 3/5.",
          lancamento: latest,
          paciente,
          terapeuta,
          clinica,
          value: competencia,
          actionHref: `/admin/supervisao/dashboard-terapeutas?terapeutaId=${terapeuta?.id || latest.terapeutaId}`,
        })
      );
    }
  });

  Object.entries(lancamentosPorTerapeutaFiltrado).forEach(([terapeutaId, registros]) => {
    if (!terapeutaId || registros.length < 2) return;

    const ordered = byPeriodAsc(registros);
    const previous = ordered[ordered.length - 2];
    const latest = ordered[ordered.length - 1];
    const previousScore = competenciaMedia(previous);
    const latestScore = competenciaMedia(latest);
    const diff = latestScore - previousScore;

    if (diff > -0.6) return;

    const terapeuta = terapeutaMap[terapeutaId];
    const clinica = clinicaMap[safeId(terapeuta?.clinicaId || latest?.clinicaId)];

    alertas.push(
      createAlert({
        type: "queda_competencia",
        level: diff <= -1 ? "alto" : "medio",
        title: "Queda na média de competências do terapeuta",
        summary: `${safeText(terapeuta?.nome || latest?.terapeutaNome, "Terapeuta")} caiu ${Math.abs(diff).toFixed(1)} ponto(s) na média técnica.`,
        detail: "Comparação entre os dois últimos lançamentos do terapeuta no período filtrado.",
        criteria: "Queda maior ou igual a 0,6 ponto na média das competências.",
        lancamento: latest,
        terapeuta,
        clinica,
        value: diff,
        actionHref: `/admin/supervisao/dashboard-terapeutas?terapeutaId=${terapeutaId}`,
      })
    );
  });

  return alertas.sort((a, b) => {
    if (b.sortScore !== a.sortScore) return b.sortScore - a.sortScore;
    return String(a.pacienteNome || a.terapeutaNome || "").localeCompare(String(b.pacienteNome || b.terapeutaNome || ""));
  });
}

export function filterAlertas(alertas = [], filters = {}) {
  return asArray(alertas).filter((alerta) => {
    if (filters.nivel && alerta.level !== filters.nivel) return false;
    if (filters.tipo && alerta.type !== filters.tipo) return false;
    if (filters.clinicaId && safeId(alerta.clinicaId) !== safeId(filters.clinicaId)) return false;
    if (filters.terapeutaId && safeId(alerta.terapeutaId) !== safeId(filters.terapeutaId)) return false;
    if (filters.pacienteId && safeId(alerta.pacienteId) !== safeId(filters.pacienteId)) return false;
    return true;
  });
}

export function summarizeAlertas(alertas = []) {
  const rows = asArray(alertas);
  const byLevel = rows.reduce((acc, alerta) => {
    acc[alerta.level] = (acc[alerta.level] || 0) + 1;
    return acc;
  }, {});

  const byType = rows.reduce((acc, alerta) => {
    acc[alerta.type] = acc[alerta.type] || {
      id: alerta.type,
      label: alerta.typeLabel,
      value: 0,
    };
    acc[alerta.type].value += 1;
    return acc;
  }, {});

  const byClinic = rows.reduce((acc, alerta) => {
    const key = alerta.clinicaId || alerta.clinicaNome;
    acc[key] = acc[key] || {
      id: key,
      label: alerta.clinicaNome || "Sem clínica",
      value: 0,
    };
    acc[key].value += 1;
    return acc;
  }, {});

  return {
    total: rows.length,
    alto: byLevel.alto || 0,
    medio: byLevel.medio || 0,
    baixo: byLevel.baixo || 0,
    pacientes: new Set(rows.map((item) => item.pacienteId).filter(Boolean)).size,
    terapeutas: new Set(rows.map((item) => item.terapeutaId).filter(Boolean)).size,
    tipos: Object.values(byType).sort((a, b) => b.value - a.value),
    niveis: [
      { id: "alto", label: "Alto", value: byLevel.alto || 0 },
      { id: "medio", label: "Médio", value: byLevel.medio || 0 },
      { id: "baixo", label: "Baixo", value: byLevel.baixo || 0 },
    ].filter((item) => item.value > 0),
    clinicas: Object.values(byClinic).sort((a, b) => b.value - a.value),
  };
}
