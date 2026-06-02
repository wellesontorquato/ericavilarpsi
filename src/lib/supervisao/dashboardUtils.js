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

export function normalizedPercent(value, max = 10, invert = false) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return 0;
  const adjusted = invert ? max - parsed : parsed;
  return Math.max(0, Math.min(100, (adjusted / max) * 100));
}

export function competenciaMedia(item) {
  return average(competencyFields.map(([field]) => item[field]));
}

export function evolucaoMedia(item) {
  return average(patientIndicatorFields.map(([field, , max, invert]) => normalizedPercent(item[field], max, invert)));
}

export function isPlanoAberto(item) {
  const status = String(item.statusPlano || "").toLowerCase();
  return status && !["concluído", "concluido", "finalizado"].includes(status);
}

export function isCasoAtencao(paciente) {
  const nivel = String(paciente?.nivelAtencao || "").toLowerCase();
  return nivel.includes("alta") || nivel.includes("urgente") || nivel.includes("atenção");
}

export function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    if (!key && key !== 0) return acc;
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function filterLancamentos(lancamentos = [], filters = {}) {
  return lancamentos.filter((item) => {
    if (filters.ano && String(item.ano) !== String(filters.ano)) return false;
    if (filters.mes && String(item.mes) !== String(filters.mes)) return false;
    if (filters.semana && String(item.semana) !== String(filters.semana)) return false;
    if (filters.clinicaId && item.clinicaId !== filters.clinicaId) return false;
    if (filters.terapeutaId && item.terapeutaId !== filters.terapeutaId) return false;
    if (filters.pacienteId && item.pacienteId !== filters.pacienteId) return false;
    return true;
  });
}

export function anosDisponiveis(lancamentos = []) {
  const anos = new Set(lancamentos.map((item) => item.ano).filter(Boolean));
  anos.add(currentYear);
  return [...anos].sort((a, b) => Number(b) - Number(a));
}

export function buildTendencia(lancamentos = [], filters = {}) {
  const usarSemana = Boolean(filters.mes);
  const groups = groupBy(lancamentos, (item) => usarSemana ? item.semana : item.mes);
  const base = usarSemana ? semanas : meses;

  return base.map((item) => {
    const registros = groups[item.value] || [];
    return {
      id: item.value,
      label: usarSemana ? `S${item.value}` : mesNome(item.value).slice(0, 3),
      registros: registros.length,
      competencia: average(registros.map(competenciaMedia)),
      evolucao: average(registros.map(evolucaoMedia)),
    };
  }).filter((item) => item.registros > 0);
}

export function buildRadar(lancamentos = []) {
  return competencyFields.map(([field, shortLabel]) => ({
    label: shortLabel,
    value: average(lancamentos.map((item) => item[field])),
  }));
}

export function buildStatusPlano(lancamentos = []) {
  const groups = groupBy(lancamentos, (item) => item.statusPlano || "Sem status");
  return Object.entries(groups).map(([label, items]) => ({ label, value: items.length }));
}

export function sortByPeriodDesc(items = []) {
  return [...items].sort((a, b) => {
    const periodA = Number(a.ano || 0) * 1000 + Number(a.mes || 0) * 10 + Number(a.semana || 0);
    const periodB = Number(b.ano || 0) * 1000 + Number(b.mes || 0) * 10 + Number(b.semana || 0);
    return periodB - periodA;
  });
}

export function selectedName(items = [], id, fallback = "Todos") {
  if (!id) return fallback;
  return items.find((item) => item.id === id)?.nome || fallback;
}
