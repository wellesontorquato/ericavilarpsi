export const meses = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export const semanas = [
  { value: 1, label: "Semana 1" },
  { value: 2, label: "Semana 2" },
  { value: 3, label: "Semana 3" },
  { value: 4, label: "Semana 4" },
  { value: 5, label: "Semana 5" },
];

export function mesNome(mes) {
  const encontrado = meses.find((item) => Number(item.value) === Number(mes));
  return encontrado?.label || "-";
}

function safeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function safeFractionDigits(value, fallback = 1) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) return fallback;

  const inteiro = Math.trunc(parsed);

  if (inteiro < 0) return fallback;
  if (inteiro > 20) return fallback;

  return inteiro;
}

export function formatDecimal(value, fractionDigits = 1) {
  const safeValue = safeNumber(value);
  const digits = safeFractionDigits(fractionDigits, 1);

  return safeValue.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatNumber(value) {
  const safeValue = safeNumber(value);

  return safeValue.toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  });
}

export function formatPercent(value, fractionDigits = 0) {
  const safeValue = safeNumber(value);
  const digits = safeFractionDigits(fractionDigits, 0);

  return `${safeValue.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

export function formatScore(value) {
  return `${formatDecimal(value, 1)}/5`;
}

export function average(values = []) {
  if (!Array.isArray(values)) return 0;

  const validValues = values
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (!validValues.length) return 0;

  const total = validValues.reduce((sum, value) => sum + value, 0);

  return total / validValues.length;
}

export function clamp(value, min = 0, max = 100) {
  const safeValue = safeNumber(value);

  return Math.min(max, Math.max(min, safeValue));
}

// Converte YYYY-MM-DD para DD/MM/YYYY com segurança contra fuso horário
export function formatarDataBR(dataIso) {
  if (!dataIso) return "";
  
  // Se a data já vier com hora (ex: 2026-06-12T00:00:00), pegamos só a parte da data
  const apenasData = dataIso.split("T")[0]; 
  const partes = apenasData.split("-");
  
  if (partes.length !== 3) return dataIso; // Se não for no formato esperado, devolve como veio
  
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}