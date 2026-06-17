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
  { value: "completo", label: "Relatório completo" },
  { value: "lancamentos", label: "Lançamentos semanais" },
  { value: "alertas", label: "Alertas automáticos" },
  { value: "cadastros", label: "Cadastros" },
  { value: "executivo", label: "Resumo executivo" },
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

export function exportExcelWorkbook(filename, sheets = []) {
  const sheetHtml = asArray(sheets)
    .filter((sheet) => sheet?.columns?.length)
    .map((sheet) => {
      const rows = asArray(sheet.rows);
      const thead = sheet.columns
        .map((column) => `<th>${escapeHtml(column.label)}</th>`)
        .join("");
      const tbody = rows
        .map((row) => {
          const cells = sheet.columns
            .map((column) => `<td>${escapeHtml(getColumnValue(row, column))}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `
        <h2>${escapeHtml(sheet.name)}</h2>
        <table>
          <thead><tr>${thead}</tr></thead>
          <tbody>${tbody || `<tr><td colspan="${sheet.columns.length}">Sem dados</td></tr>`}</tbody>
        </table>
        <br />
      `;
    })
    .join("");

  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; color: #222; }
          h1 { font-size: 22px; }
          h2 { margin-top: 24px; font-size: 18px; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 18px; }
          th, td { border: 1px solid #cfcfcf; padding: 8px; font-size: 12px; vertical-align: top; }
          th { background: #f0e6e1; font-weight: 700; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(filename)}</h1>
        <p>Arquivo gerado pelo sistema de supervisão clínica.</p>
        ${sheetHtml}
      </body>
    </html>
  `;

  downloadFile(`${slugify(filename)}.xls`, `\uFEFF${html}`, "application/vnd.ms-excel;charset=utf-8");
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
  { key: "qualidadeConceitualizacao", label: "Conceitualização" },
  { key: "planejamentoTerapeutico", label: "Planejamento terapêutico" },
  { key: "aplicacaoTecnicasTcc", label: "Técnicas TCC" },
  { key: "manejoSessao", label: "Manejo da sessão" },
  { key: "posturaTerapeutica", label: "Postura terapêutica" },
  { key: "formulacaoHipoteses", label: "Formulação de hipóteses" },
  { key: "crisesAnsiedade", label: "Crises de ansiedade" },
  { key: "qualidadeSono", label: "Qualidade do sono" },
  { key: "evitacaoSocial", label: "Evitação social" },
  { key: "adesaoTarefas", label: "Adesão às tarefas" },
  { key: "intensidadeSintomas", label: "Intensidade dos sintomas" },
  { key: "evolucaoObjetivos", label: "Evolução dos objetivos" },
  { key: "statusPlano", label: "Status do plano" },
  { key: "prazo", label: "Prazo" },
  { key: "pontoForte", label: "Ponto forte" },
  { key: "pontoDesenvolver", label: "Ponto a desenvolver" },
  { key: "recomendacao", label: "Recomendação" },
  { key: "planoAcao", label: "Plano de ação" },
  { key: "observacao", label: "Observação" },
];

export const alertasColumns = [
  { key: "levelLabel", label: "Nível" },
  { key: "typeLabel", label: "Tipo" },
  { key: "title", label: "Título" },
  { key: "summary", label: "Resumo" },
  { key: "detail", label: "Detalhe" },
  { key: "criteria", label: "Critério" },
  { key: "pacienteNome", label: "Paciente/Caso" },
  { key: "terapeutaNome", label: "Terapeuta" },
  { key: "clinicaNome", label: "Clínica" },
  { key: "periodo", label: "Período" },
];

export function buildResumoRows({ metrics, filters, contexto }) {
  return [
    { indicador: "Contexto", valor: contexto || "Geral", detalhe: "Filtro principal do relatório" },
    { indicador: "Ano", valor: filters?.ano || "Todos", detalhe: "Ano selecionado" },
    { indicador: "Mês", valor: filters?.mes ? mesNome(filters.mes) : "Todos", detalhe: "Mês selecionado" },
    { indicador: "Semana", valor: filters?.semana ? `Semana ${filters.semana}` : "Todas", detalhe: "Semana selecionada" },
    { indicador: "Lançamentos", valor: formatNumber(metrics.registros), detalhe: "Registros semanais filtrados" },
    { indicador: "Clínicas", valor: formatNumber(metrics.clinicas), detalhe: "Clínicas no recorte" },
    { indicador: "Terapeutas", valor: formatNumber(metrics.terapeutas), detalhe: "Terapeutas no recorte" },
    { indicador: "Pacientes", valor: formatNumber(metrics.pacientes), detalhe: "Pacientes/casos no recorte" },
    { indicador: "Média de competências", valor: `${formatDecimal(metrics.competencia)}/5`, detalhe: "Média técnica dos lançamentos" },
    { indicador: "Evolução clínica", valor: formatPercent(metrics.evolucao), detalhe: "Score consolidado dos pacientes" },
    { indicador: "Planos abertos", valor: formatNumber(metrics.planosAbertos), detalhe: "Ações pendentes ou em andamento" },
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
    qualidadeConceitualizacao: formatDecimal(item.qualidadeConceitualizacao),
    planejamentoTerapeutico: formatDecimal(item.planejamentoTerapeutico),
    aplicacaoTecnicasTcc: formatDecimal(item.aplicacaoTecnicasTcc),
    manejoSessao: formatDecimal(item.manejoSessao),
    posturaTerapeutica: formatDecimal(item.posturaTerapeutica),
    formulacaoHipoteses: formatDecimal(item.formulacaoHipoteses),
    crisesAnsiedade: formatDecimal(item.crisesAnsiedade),
    qualidadeSono: formatDecimal(item.qualidadeSono),
    evitacaoSocial: formatDecimal(item.evitacaoSocial),
    adesaoTarefas: formatPercent(item.adesaoTarefas),
    intensidadeSintomas: formatDecimal(item.intensidadeSintomas),
    evolucaoObjetivos: formatPercent(item.evolucaoObjetivos),
    statusPlano: normalizeText(item.statusPlano),
    prazo: normalizeText(item.prazo),
    pontoForte: normalizeText(item.pontoForte),
    pontoDesenvolver: normalizeText(item.pontoDesenvolver),
    recomendacao: normalizeText(item.recomendacao),
    planoAcao: normalizeText(item.planoAcao),
    observacao: normalizeText(item.observacao),
  }));
}

export function buildAlertasRows(alertas = []) {
  return asArray(alertas).map((item) => ({
    levelLabel: normalizeText(item.levelLabel),
    typeLabel: normalizeText(item.typeLabel),
    title: normalizeText(item.title),
    summary: normalizeText(item.summary),
    detail: normalizeText(item.detail),
    criteria: normalizeText(item.criteria),
    pacienteNome: normalizeText(item.pacienteNome),
    terapeutaNome: normalizeText(item.terapeutaNome),
    clinicaNome: normalizeText(item.clinicaNome),
    periodo: normalizeText(item.periodo),
  }));
}

export function buildReportSheets({ resumoRows = [], clinicasRows = [], terapeutasRows = [], pacientesRows = [], lancamentosRows = [], alertasRows = [], type = "completo" }) {
  const sheets = [];

  if (["completo", "executivo"].includes(type)) {
    sheets.push({ name: "Resumo executivo", columns: resumoColumns, rows: resumoRows });
  }

  if (["completo", "cadastros"].includes(type)) {
    sheets.push({ name: "Clínicas", columns: clinicasColumns, rows: clinicasRows });
    sheets.push({ name: "Terapeutas", columns: terapeutasColumns, rows: terapeutasRows });
    sheets.push({ name: "Pacientes", columns: pacientesColumns, rows: pacientesRows });
  }

  if (["completo", "lancamentos"].includes(type)) {
    sheets.push({ name: "Lançamentos semanais", columns: lancamentosColumns, rows: lancamentosRows });
  }

  if (["completo", "alertas"].includes(type)) {
    sheets.push({ name: "Alertas automáticos", columns: alertasColumns, rows: alertasRows });
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
