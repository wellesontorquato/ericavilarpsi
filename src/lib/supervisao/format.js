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
  const encontrado = meses.find(
    (item) => Number(item.value) === Number(mes)
  );

  return encontrado?.label || "-";
}

/**
 * Retorna true somente quando o valor realmente representa um número.
 *
 * Diferencia corretamente:
 * - 0: valor válido;
 * - "0": valor válido;
 * - null: não computado;
 * - undefined: não computado;
 * - "": não computado;
 * - "   ": não computado;
 * - booleanos e objetos: inválidos.
 */
export function isNumericValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string") {
    const normalized = value.trim();

    if (!normalized) return false;

    return Number.isFinite(Number(normalized));
  }

  return false;
}

/**
 * Converte um valor numérico válido.
 * Quando o valor não foi computado ou é inválido, retorna o fallback.
 */
export function toNumber(value, fallback = null) {
  return isNumericValue(value) ? Number(value) : fallback;
}

function safeFractionDigits(value, fallback = 1) {
  const parsed = toNumber(value, null);

  if (parsed === null) return fallback;

  const inteiro = Math.trunc(parsed);

  if (inteiro < 0 || inteiro > 20) return fallback;

  return inteiro;
}

/**
 * Formata um valor decimal.
 *
 * O terceiro argumento pode ser usado para definir o texto de ausência:
 * formatDecimal(null, 1, "Não computado")
 */
export function formatDecimal(
  value,
  fractionDigits = 1,
  fallback = "-"
) {
  const safeValue = toNumber(value, null);

  if (safeValue === null) return fallback;

  const digits = safeFractionDigits(fractionDigits, 1);

  return safeValue.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Formata um número inteiro.
 */
export function formatNumber(value, fallback = "-") {
  const safeValue = toNumber(value, null);

  if (safeValue === null) return fallback;

  return safeValue.toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  });
}

/**
 * Formata um percentual.
 *
 * O terceiro argumento pode ser usado para definir o texto de ausência:
 * formatPercent(null, 0, "Não computado")
 */
export function formatPercent(
  value,
  fractionDigits = 0,
  fallback = "-"
) {
  const safeValue = toNumber(value, null);

  if (safeValue === null) return fallback;

  const digits = safeFractionDigits(fractionDigits, 0);

  return `${safeValue.toLocaleString("pt-BR", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}

/**
 * Formata uma competência na escala de 1 a 5.
 */
export function formatScore(value, fallback = "-") {
  if (!isNumericValue(value)) return fallback;

  return `${formatDecimal(value, 1)}/5`;
}

/**
 * Calcula a média considerando somente valores efetivamente computados.
 *
 * null, undefined, strings vazias e valores inválidos são ignorados.
 * O número zero continua sendo considerado um valor válido.
 *
 * Se nenhum valor válido existir, retorna null por padrão.
 */
export function average(values = [], fallback = null) {
  if (!Array.isArray(values)) return fallback;

  const validValues = values
    .filter(isNumericValue)
    .map(Number);

  if (!validValues.length) return fallback;

  const total = validValues.reduce(
    (sum, value) => sum + value,
    0
  );

  return total / validValues.length;
}

/**
 * Limita um número entre o mínimo e o máximo.
 * Retorna null quando o valor não foi computado.
 */
export function clamp(
  value,
  min = 0,
  max = 100,
  fallback = null
) {
  const safeValue = toNumber(value, null);
  const safeMin = toNumber(min, 0);
  const safeMax = toNumber(max, 100);

  if (safeValue === null) return fallback;

  const lower = Math.min(safeMin, safeMax);
  const upper = Math.max(safeMin, safeMax);

  return Math.min(
    upper,
    Math.max(lower, safeValue)
  );
}