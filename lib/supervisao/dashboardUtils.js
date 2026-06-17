import { average, mesNome, meses, semanas } from "./format";

export const currentYear = new Date().getFullYear();

export const competencyFields = [
  ["qualidadeConceitualizacao", "Conceit.", "Conceitualização"],
  ["planejamentoTerapeutico", "Planej.", "Planejamento"],
  ["aplicacaoTecnicasTcc", "Técnicas", "Técnicas TCC"],
  ["manejoSessao", "Manejo", "Manejo da sessão"],
  ["posturaTerapeutica", "Postura", "Postura terapêutica"],
  ["formulacaoHipoteses", "Hipóteses", "Formulação de hipóteses"],
];

export const patientIndicatorFields = [
  ["qualidadeSono", "Sono", 10, false],
  ["adesaoTarefas", "Adesão", 100, false],
  ["evolucaoObjetivos", "Objetivos", 100, false],
  ["intensidadeSintomas", "Sintomas", 10, true],
  ["evitacaoSocial", "Evitação", 10, true],
];

export function asArray(value) {
  return Array.isArray(value) ? value : [];
}

export function safeText(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
}

export function safeId(value) {
  if (value === null || value === undefined || typeof value === "object") return "";
  return String(value);
}

export function normalizedPercent(value, max = 10, invert = false) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return 0;

  const adjusted = invert ? Number(max) - parsed : parsed;
  return Math.max(0, Math.min(100, (adjusted / Number(max || 1)) * 100));
}

export function competenciaMedia(item = {}) {
  return average(competencyFields.map(([field]) => item?.[field]));
}

export function evolucaoMedia(item = {}) {
  return average(
    patientIndicatorFields.map(([field, , max, invert]) =>
      normalizedPercent(item?.[field], max, invert)
    )
  );
}

export function isPlanoAberto(item = {}) {
  const status = String(item?.statusPlano || "").toLowerCase();
  return status && !["concluído", "concluido", "finalizado"].includes(status);
}

export function isCasoAtencao(paciente = {}) {
  const nivel = String(paciente?.nivelAtencao || "").toLowerCase();
  return nivel.includes("alta") || nivel.includes("urgente") || nivel.includes("atenção");
}

export function groupBy(items = [], getKey) {
  return asArray(items).reduce((acc, item) => {
    const key = getKey(item);

    if (key === null || key === undefined || key === "") return acc;

    const safeKey = String(key);
    acc[safeKey] = acc[safeKey] || [];
    acc[safeKey].push(item);

    return acc;
  }, {});
}

export function filterLancamentos(lancamentos = [], filters = {}) {
  return asArray(lancamentos).filter((item = {}) => {
    if (filters.ano && String(item.ano) !== String(filters.ano)) return false;
    if (filters.mes && String(item.mes) !== String(filters.mes)) return false;
    if (filters.semana && String(item.semana) !== String(filters.semana)) return false;
    if (filters.clinicaId && safeId(item.clinicaId) !== safeId(filters.clinicaId)) return false;
    if (filters.terapeutaId && safeId(item.terapeutaId) !== safeId(filters.terapeutaId)) return false;
    if (filters.pacienteId && safeId(item.pacienteId) !== safeId(filters.pacienteId)) return false;

    return true;
  });
}

export function anosDisponiveis(lancamentos = []) {
  const anos = new Set(
    asArray(lancamentos)
      .map((item) => item?.ano)
      .filter(Boolean)
  );

  anos.add(currentYear);

  return [...anos].sort((a, b) => Number(b) - Number(a));
}

export function buildTendencia(lancamentos = [], filters = {}) {
  const usarSemana = Boolean(filters.mes);
  const groups = groupBy(lancamentos, (item) => (usarSemana ? item?.semana : item?.mes));
  const base = usarSemana ? semanas : meses;

  return base
    .map((item) => {
      const registros = groups[String(item.value)] || [];

      return {
        id: String(item.value),
        label: usarSemana ? `S${item.value}` : mesNome(item.value).slice(0, 3),
        registros: registros.length,
        competencia: average(registros.map(competenciaMedia)),
        evolucao: average(registros.map(evolucaoMedia)),
      };
    })
    .filter((item) => item.registros > 0);
}

export function buildRadar(lancamentos = []) {
  return competencyFields.map(([field, shortLabel]) => ({
    id: field,
    label: shortLabel,
    value: average(asArray(lancamentos).map((item) => item?.[field])),
  }));
}

export function buildStatusPlano(lancamentos = []) {
  const groups = groupBy(lancamentos, (item) => safeText(item?.statusPlano, "Sem status"));

  return Object.entries(groups).map(([label, items]) => ({
    id: label,
    label,
    value: items.length,
  }));
}

export function sortByPeriodDesc(items = []) {
  return [...asArray(items)].sort((a = {}, b = {}) => {
    const periodA =
      Number(a.ano || 0) * 1000 +
      Number(a.mes || 0) * 10 +
      Number(a.semana || 0);

    const periodB =
      Number(b.ano || 0) * 1000 +
      Number(b.mes || 0) * 10 +
      Number(b.semana || 0);

    return periodB - periodA;
  });
}

export function selectedName(items = [], id, fallback = "Todos") {
  if (!id) return fallback;

  const found = asArray(items).find((item) => safeId(item?.id) === safeId(id));

  return safeText(found?.nome, fallback);
}