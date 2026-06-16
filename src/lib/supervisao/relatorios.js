import { formatDecimal, formatNumber, formatPercent, mesNome } from "./format";
import {
  asArray,
  competenciaMedia,
  evolucaoMedia,
  safeId,
  safeText,
  sortByPeriodDesc,
} from "./dashboardUtils";

export const REPORT_TYPES = [
  { value: "executivo", label: "Dashboard Executivo (Recomendado)" },
  { value: "completo", label: "Relatório com dados brutos" },
  { value: "lancamentos", label: "Apenas lançamentos semanais" },
  { value: "alertas", label: "Apenas alertas automáticos" },
];

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeText(value, fallback = "-") {
  return safeText(value, fallback).replace(/\s+/g, " ").trim();
}

function escapeCsv(value) {
  const text = value === null || value === undefined ? "" : String(value);
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

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function getColumnValue(row, column) {
  if (typeof column.value === "function") return column.value(row);
  return row?.[column.key];
}

export function exportCsv(filename, columns = [], rows = []) {
  const header = columns.map((column) => escapeCsv(column.label)).join(";");
  const body = asArray(rows)
    .map((row) => columns.map((column) => escapeCsv(getColumnValue(row, column))).join(";"))
    .join("\n");

  downloadFile(`${slugify(filename)}.csv`, `\uFEFF${header}\n${body}`, "text/csv;charset=utf-8");
}

// NOVA GERAÇÃO DE EXCEL COM DASHBOARD EMBUTIDO
export function exportExcelWorkbook(filename, sheets = [], dashboardMetrics = null) {
  let htmlContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="utf-8" />
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4efe8;">
  `;

  // SEÇÃO DE APRESENTAÇÃO EXECUTIVA NO TOPO DO EXCEL
  if (dashboardMetrics) {
    htmlContent += `
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td colspan="4" style="height: 20px;"></td></tr>
        
        <tr>
          <td colspan="4" style="background-color: #392619; color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; height: 60px; vertical-align: middle;">
            📊 RELATÓRIO EXECUTIVO: ${escapeHtml(filename)}
          </td>
        </tr>
        <tr><td colspan="4" style="height: 20px;"></td></tr>

        <tr>
           <td style="background-color: #ffffff; border: 2px solid #d8c8bf; text-align: center; padding: 25px; height: 110px; width: 25%;">
              <span style="font-size: 14px; color: #7b6c61; font-weight: bold;">EVOLUÇÃO CLÍNICA</span><br/>
              <span style="font-size: 34px; color: #9f6947; font-weight: bold;">${formatPercent(dashboardMetrics.evolucao)}</span><br/>
              <span style="font-size: 12px; color: #9f6947;">Score global consolidado</span>
           </td>
           <td style="background-color: #ffffff; border: 2px solid #d8c8bf; text-align: center; padding: 25px; height: 110px; width: 25%;">
              <span style="font-size: 14px; color: #7b6c61; font-weight: bold;">MÉDIA TÉCNICA</span><br/>
              <span style="font-size: 34px; color: #9f6947; font-weight: bold;">${formatDecimal(dashboardMetrics.competencia)} / 5</span><br/>
              <span style="font-size: 12px; color: #9f6947;">Desempenho da equipe</span>
           </td>
           <td style="background-color: #ffffff; border: 2px solid #d8c8bf; text-align: center; padding: 25px; height: 110px; width: 25%;">
              <span style="font-size: 14px; color: #7b6c61; font-weight: bold;">CASOS EM RISCO</span><br/>
              <span style="font-size: 34px; color: #a43c32; font-weight: bold;">${dashboardMetrics.alertas}</span><br/>
              <span style="font-size: 12px; color: #a43c32;">Atenção imediata</span>
           </td>
           <td style="background-color: #ffffff; border: 2px solid #d8c8bf; text-align: center; padding: 25px; height: 110px; width: 25%;">
              <span style="font-size: 14px; color: #7b6c61; font-weight: bold;">PACIENTES ATIVOS</span><br/>
              <span style="font-size: 34px; color: #9f6947; font-weight: bold;">${dashboardMetrics.pacientes}</span><br/>
              <span style="font-size: 12px; color: #9f6947;">No período filtrado</span>
           </td>
        </tr>
        <tr><td colspan="4" style="height: 30px;"></td></tr>
      </table>
    `;
  }

  // TABELAS DE DADOS ESTILIZADAS
  sheets.forEach(sheet => {
    if (sheet.rows.length === 0) return;
    htmlContent += `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr>
          <td colspan="${sheet.columns.length}" style="background-color: #9f6947; color: #ffffff; font-size: 18px; font-weight: bold; height: 40px; vertical-align: middle; padding-left: 10px;">
            ${escapeHtml(sheet.name)}
          </td>
        </tr>
        <tr>
          ${sheet.columns.map(col => `<td style="background-color: #efe2d5; color: #5f3825; font-weight: bold; padding: 12px; border: 1px solid #d8c8bf;">${escapeHtml(col.label)}</td>`).join('')}
        </tr>
        ${sheet.rows.map((row, idx) => `
          <tr>
            ${sheet.columns.map(col => `<td style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#fcfaf8'}; border: 1px solid #d8c8bf; padding: 10px; vertical-align: top; color: #392619;">${escapeHtml(getColumnValue(row, col))}</td>`).join('')}
          </tr>
        `).join('')}
      </table>
      <br/>
    `;
  });

  htmlContent += `</body></html>`;

  const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(filename)}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function buildMaps({ clinicas = [], terapeutas = [], pacientes = [] }) {
  return {
    clinicas: Object.fromEntries(asArray(clinicas).map((item) => [safeId(item.id), item])),
    terapeutas: Object.fromEntries(asArray(terapeutas).map((item) => [safeId(item.id), item])),
    pacientes: Object.fromEntries(asArray(pacientes).map((item) => [safeId(item.id), item])),
  };
}

function resolveClinicaNome(id, maps, fallback = "-") {
  return normalizeText(maps.clinicas[safeId(id)]?.nome, fallback);
}

function resolveTerapeutaNome(id, maps, fallback = "-") {
  return normalizeText(maps.terapeutas[safeId(id)]?.nome, fallback);
}

function resolvePacienteNome(id, maps, fallback = "-") {
  return normalizeText(maps.pacientes[safeId(id)]?.nome, fallback);
}

export const resumoColumns = [
  { key: "indicador", label: "Indicador" },
  { key: "valor", label: "Valor" },
  { key: "detalhe", label: "Detalhe" },
];

export const clinicasColumns = [
  { key: "nome", label: "Clínica" },
  { key: "cidade", label: "Cidade" },
  { key: "responsavel", label: "Responsável" },
  { key: "status", label: "Status" },
  { key: "registro", label: "Registro" },
];

export const terapeutasColumns = [
  { key: "nome", label: "Terapeuta" },
  { key: "clinica", label: "Clínica" },
  { key: "dataEntrada", label: "Data de entrada" },
  { key: "status", label: "Status" },
  { key: "observacao", label: "Observação" },
  { key: "registro", label: "Registro" },
];

export const pacientesColumns = [
  { key: "nome", label: "Paciente/Caso" },
  { key: "clinica", label: "Clínica" },
  { key: "terapeuta", label: "Terapeuta" },
  { key: "dataInicio", label: "Data de início" },
  { key: "statusCaso", label: "Status do caso" },
  { key: "nivelAtencao", label: "Nível de atenção" },
  { key: "queixaPrincipal", label: "Queixa principal" },
  { key: "objetivosTerapeuticos", label: "Objetivos terapêuticos" },
  { key: "observacoes", label: "Observações" },
  { key: "registro", label: "Registro" },
];

export const lancamentosColumns = [
  { key: "ano", label: "Ano" },
  { key: "mes", label: "Mês" },
  { key: "semana", label: "Semana" },
  { key: "clinica", label: "Clínica" },
  { key: "terapeuta", label: "Terapeuta" },
  { key: "paciente", label: "Paciente/Caso" },
  { key: "competenciaMedia", label: "Média competências" },
  { key: "evolucaoMedia", label: "Evolução clínica" },
  { key: "statusPlano", label: "Status do plano" },
  { key: "pontoForte", label: "Ponto forte" },
  { key: "pontoDesenvolver", label: "Ponto a desenvolver" },
  { key: "recomendacao", label: "Recomendação" },
  { key: "planoAcao", label: "Plano de ação" },
];

export const alertasColumns = [
  { key: "levelLabel", label: "Nível" },
  { key: "typeLabel", label: "Tipo" },
  { key: "pacienteNome", label: "Paciente/Caso" },
  { key: "terapeutaNome", label: "Terapeuta" },
  { key: "clinicaNome", label: "Clínica" },
  { key: "summary", label: "Resumo" },
];

export function buildResumoRows({ metrics, filters, contexto }) {
  return [
    { indicador: "Contexto", valor: contexto || "Geral", detalhe: "Filtro principal do relatório" },
    { indicador: "Lançamentos", valor: formatNumber(metrics.registros), detalhe: "Registros semanais filtrados" },
    { indicador: "Pacientes", valor: formatNumber(metrics.pacientes), detalhe: "Pacientes/casos no recorte" },
    { indicador: "Média de competências", valor: `${formatDecimal(metrics.competencia)}/5`, detalhe: "Média técnica dos lançamentos" },
    { indicador: "Evolução clínica", valor: formatPercent(metrics.evolucao), detalhe: "Score consolidado dos pacientes" },
    { indicador: "Alertas", valor: formatNumber(metrics.alertas), detalhe: "Alertas automáticos no recorte" },
  ];
}

export function buildClinicasRows(clinicas = []) {
  return asArray(clinicas).map((item) => ({
    nome: normalizeText(item.nome),
    cidade: normalizeText(item.cidade),
    responsavel: normalizeText(item.responsavel),
    status: normalizeText(item.status, "Ativo"),
    registro: item.arquivado ? "Arquivado" : normalizeText(item.statusRegistro, "Ativo"),
  }));
}

export function buildTerapeutasRows(terapeutas = [], context = {}) {
  const maps = buildMaps(context);
  return asArray(terapeutas).map((item) => ({
    nome: normalizeText(item.nome),
    clinica: resolveClinicaNome(item.clinicaId, maps),
    dataEntrada: normalizeText(item.dataEntrada),
    status: normalizeText(item.status, "Ativo"),
    observacao: normalizeText(item.observacao),
    registro: item.arquivado ? "Arquivado" : normalizeText(item.statusRegistro, "Ativo"),
  }));
}

export function buildPacientesRows(pacientes = [], context = {}) {
  const maps = buildMaps(context);
  return asArray(pacientes).map((item) => ({
    nome: normalizeText(item.nome),
    clinica: resolveClinicaNome(item.clinicaId, maps),
    terapeuta: resolveTerapeutaNome(item.terapeutaId, maps),
    dataInicio: normalizeText(item.dataInicio),
    statusCaso: normalizeText(item.statusCaso),
    nivelAtencao: normalizeText(item.nivelAtencao),
    queixaPrincipal: normalizeText(item.queixaPrincipal),
    objetivosTerapeuticos: normalizeText(item.objetivosTerapeuticos),
    observacoes: normalizeText(item.observacoes),
    registro: item.arquivado ? "Arquivado" : normalizeText(item.statusRegistro, "Ativo"),
  }));
}

export function buildLancamentosRows(lancamentos = [], context = {}) {
  const maps = buildMaps(context);
  return sortByPeriodDesc(lancamentos).map((item) => ({
    ano: normalizeText(item.ano),
    mes: item.mes ? mesNome(item.mes) : "-",
    semana: item.semana ? `Semana ${item.semana}` : "-",
    clinica: normalizeText(item.clinicaNome, resolveClinicaNome(item.clinicaId, maps)),
    terapeuta: normalizeText(item.terapeutaNome, resolveTerapeutaNome(item.terapeutaId, maps)),
    paciente: normalizeText(item.pacienteNome, resolvePacienteNome(item.pacienteId, maps)),
    competenciaMedia: formatDecimal(competenciaMedia(item)),
    evolucaoMedia: formatPercent(evolucaoMedia(item)),
    statusPlano: normalizeText(item.statusPlano),
    pontoForte: normalizeText(item.pontoForte),
    pontoDesenvolver: normalizeText(item.pontoDesenvolver),
    recomendacao: normalizeText(item.recomendacao),
    planoAcao: normalizeText(item.planoAcao),
  }));
}

export function buildAlertasRows(alertas = []) {
  return asArray(alertas).map((item) => ({
    levelLabel: normalizeText(item.levelLabel),
    typeLabel: normalizeText(item.typeLabel),
    pacienteNome: normalizeText(item.pacienteNome),
    terapeutaNome: normalizeText(item.terapeutaNome),
    clinicaNome: normalizeText(item.clinicaNome),
    summary: normalizeText(item.summary),
  }));
}

export function buildReportSheets({ resumoRows = [], clinicasRows = [], terapeutasRows = [], pacientesRows = [], lancamentosRows = [], alertasRows = [], type = "executivo" }) {
  const sheets = [];

  if (type === "executivo") {
    sheets.push({ name: "Atenção Imediata (Top 15 Alertas)", columns: alertasColumns, rows: alertasRows.slice(0, 15) });
    sheets.push({ name: "Últimos Lançamentos (Resumo)", columns: lancamentosColumns, rows: lancamentosRows.slice(0, 20) });
    return sheets;
  }

  // Completo
  if (["completo", "lancamentos"].includes(type)) sheets.push({ name: "Lançamentos Semanais (Todos)", columns: lancamentosColumns, rows: lancamentosRows });
  if (["completo", "alertas"].includes(type)) sheets.push({ name: "Alertas Gerados (Todos)", columns: alertasColumns, rows: alertasRows });
  if (["completo", "cadastros"].includes(type)) {
    sheets.push({ name: "Pacientes", columns: pacientesColumns, rows: pacientesRows });
    sheets.push({ name: "Terapeutas", columns: terapeutasColumns, rows: terapeutasRows });
    sheets.push({ name: "Clínicas", columns: clinicasColumns, rows: clinicasRows });
  }

  return sheets;
}

export function buildTopRows(items = [], key = "label", valueKey = "value", limit = 6) {
  return asArray(items)
    .slice(0, limit)
    .map((item) => ({
      label: normalizeText(item?.[key]),
      value: safeNumber(item?.[valueKey]),
    }));
}