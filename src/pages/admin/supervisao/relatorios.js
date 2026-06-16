import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { ChartPanel, DonutChart, HorizontalBars } from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatDecimal, formatPercent, mesNome } from "@/lib/supervisao/format";
import {
  competenciaMedia,
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  isPlanoAberto,
  safeId,
  safeText,
  selectedName,
} from "@/lib/supervisao/dashboardUtils";
import { buildAlertasSupervisao, summarizeAlertas } from "@/lib/supervisao/alertas";
import {
  REPORT_TYPES,
  alertasColumns,
  buildAlertasRows,
  buildClinicasRows,
  buildLancamentosRows,
  buildPacientesRows,
  buildReportSheets,
  buildResumoRows,
  buildTerapeutasRows,
  clinicasColumns,
  exportCsv,
  exportExcelWorkbook,
  lancamentosColumns,
  pacientesColumns,
  resumoColumns,
  terapeutasColumns,
} from "@/lib/supervisao/relatorios";

function matchEntity(item = {}, filters = {}, type = "generico") {
  if (type === "clinica") {
    if (filters.clinicaId && safeId(item.id) !== safeId(filters.clinicaId)) return false;
    return true;
  }
  if (filters.clinicaId && safeId(item.clinicaId) !== safeId(filters.clinicaId)) return false;
  if (type === "terapeuta") {
    if (filters.terapeutaId && safeId(item.id) !== safeId(filters.terapeutaId)) return false;
    return true;
  }
  if (filters.terapeutaId && safeId(item.terapeutaId) !== safeId(filters.terapeutaId)) return false;
  if (type === "paciente") {
    if (filters.pacienteId && safeId(item.id) !== safeId(filters.pacienteId)) return false;
  }
  return true;
}

function getContextTitle({ filters, clinicas, terapeutas, pacientes }) {
  if (filters.pacienteId) return selectedName(pacientes, filters.pacienteId, "Paciente selecionado");
  if (filters.terapeutaId) return selectedName(terapeutas, filters.terapeutaId, "Terapeuta selecionado");
  if (filters.clinicaId) return selectedName(clinicas, filters.clinicaId, "Clínica selecionada");
  return "Visão Global da Operação";
}

function getPeriodText(filters = {}) {
  const periodo = [
    filters.mes ? mesNome(filters.mes) : "Todos os meses",
    filters.ano || "Todos os anos",
  ]
    .filter(Boolean)
    .join(" · ");
  return `${periodo}${filters.semana ? ` · Semana ${filters.semana}` : ""}`;
}

function buildReportFileName(contextTitle, filters, suffix) {
  return `Supervisao_TCC_${contextTitle}_${getPeriodText(filters)}_${suffix}`;
}

function PreviewTable({ title, columns, rows, limit = 5 }) {
  const previewRows = rows.slice(0, limit);

  return (
    <section className="supervisao-report-preview-card h-full" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--sup-text)' }}>{title}</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--sup-muted)', fontWeight: 600 }}>{rows.length} registro(s)</span>
      </div>

      {previewRows.length ? (
        <div className="supervisao-report-preview-table-wrap scroll-interno" style={{ flex: 1, border: 'none', background: 'transparent' }}>
          <table className="supervisao-report-preview-table" style={{ border: '1px solid var(--sup-line)', borderRadius: '16px', overflow: 'hidden' }}>
            <thead>
              <tr>
                {columns.slice(0, 4).map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewRows.map((row, rowIndex) => (
                <tr key={row.id || rowIndex}>
                  {columns.slice(0, 4).map((column) => (
                    <td key={column.key}>{safeText(row[column.key])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: '16px', border: '1px dashed var(--sup-line)' }}>
          <p className="supervisao-empty" style={{ background: 'none', border: 'none' }}>Sem dados para este recorte.</p>
        </div>
      )}
    </section>
  );
}

// O COMPONENTE MÁGICO DE PDF (Agora formatado como Dashboard)
function PrintReport({ data }) {
  if (!data) return null;

  const previewLancamentos = data.lancamentosRows.slice(0, 15);
  const previewAlertas = data.alertasRows.slice(0, 10);
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // Arrays de Top Evolução para gerar as barras em CSS
  const rankingEvolucao = data.clinicasFiltradas.length > 1 
    ? data.clinicasFiltradas.map(c => ({ label: c.nome, value: average(filterLancamentos(data.lancamentosRaw, {clinicaId: c.id}).map(evolucaoMedia)) })).sort((a,b) => b.value - a.value).slice(0,5)
    : data.terapeutasFiltrados.map(t => ({ label: t.nome, value: average(filterLancamentos(data.lancamentosRaw, {terapeutaId: t.id}).map(evolucaoMedia)) })).sort((a,b) => b.value - a.value).slice(0,5);

  return (
    <div className="supervisao-print-report">
      {/* CAPA DA APRESENTAÇÃO */}
      <div className="print-cover">
        <span className="kicker">DOCUMENTO EXECUTIVO</span>
        <h1>Desempenho Clínico <br/> & Acompanhamento</h1>
        <h2>{data.contextTitle}</h2>
        <p>Referência: {data.periodText}</p>
        
        <div className="print-cover-footer">
          Relatório oficial gerado em {dataHoje}
        </div>
      </div>

      {/* PÁGINA 1: DASHBOARD EXECUTIVO */}
      <div className="print-section">
        <h3>Painel de Saúde e Eficiência</h3>
        
        <div className="print-metrics">
          <div className="print-metric-card">
            <span>Evolução Clínica</span>
            <strong>{formatPercent(data.metrics.evolucao)}</strong>
            <small>Score consolidado</small>
          </div>
          <div className="print-metric-card">
            <span>Média Técnica</span>
            <strong>{formatDecimal(data.metrics.competencia)}</strong>
            <small>Equipe (1 a 5)</small>
          </div>
          <div className="print-metric-card">
            <span>Casos em Risco</span>
            <strong>{data.metrics.alertas}</strong>
            <small>Alertas automáticos</small>
          </div>
          <div className="print-metric-card">
            <span>Pacientes</span>
            <strong>{data.metrics.pacientes}</strong>
            <small>Atendidos no período</small>
          </div>
        </div>

        <div className="print-grid-two">
          <div className="print-card">
            <h4>{data.clinicasFiltradas.length > 1 ? "Evolução por Clínica" : "Evolução por Terapeuta"}</h4>
            {rankingEvolucao.map((item, i) => (
              <div className="print-bar-row" key={i}>
                <span className="print-bar-label">{item.label}</span>
                <div className="print-bar-track">
                  <div className="print-bar-fill" style={{ width: `${item.value}%` }}></div>
                </div>
                <span className="print-bar-value">{formatPercent(item.value)}</span>
              </div>
            ))}
          </div>
          
          <div className="print-card">
            <h4>Status Operacional</h4>
            <p style={{ color: '#5f3825', lineHeight: 1.6, fontSize: '1.05rem', margin: 0 }}>
              No recorte selecionado, o sistema documentou <strong>{data.metrics.registros} intervenções clínicas</strong>,
              envolvendo o trabalho direto de <strong>{data.metrics.terapeutas} terapeuta(s)</strong> em <strong>{data.metrics.clinicas} clínica(s)</strong>.
              Foram registrados {data.metrics.planosAbertos} planos de ação em aberto, indicando frentes de desenvolvimento contínuo da equipe.
            </p>
          </div>
        </div>
      </div>

      {/* PÁGINA 2: ATENÇÃO E ROTINA */}
      <div className="print-section">
        <h3>Casos que Exigem Intervenção (Top 10)</h3>
        {previewAlertas.length > 0 ? (
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Nível</th>
                <th style={{ width: '25%' }}>Paciente</th>
                <th style={{ width: '60%' }}>Resumo do Risco / Motivo</th>
              </tr>
            </thead>
            <tbody>
              {previewAlertas.map((alerta, index) => (
                <tr key={`alerta-${index}`}>
                  <td><strong>{alerta.levelLabel}</strong></td>
                  <td>{alerta.pacienteNome}<br/><small style={{ color: '#9f6947'}}>{alerta.terapeutaNome}</small></td>
                  <td>{alerta.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum alerta crítico encontrado para o recorte selecionado. Operação estável.</p>
        )}

        <h3 style={{ marginTop: '50px' }}>Registro de Intervenções Recentes</h3>
        {previewLancamentos.length > 0 ? (
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Semana</th>
                <th style={{ width: '25%' }}>Paciente / Terapeuta</th>
                <th style={{ width: '15%' }}>Score</th>
                <th style={{ width: '45%' }}>Ponto a Desenvolver / Foco</th>
              </tr>
            </thead>
            <tbody>
              {previewLancamentos.map((item, index) => (
                <tr key={`lancamento-${index}`}>
                  <td>{item.mes} · S{item.semana}</td>
                  <td>{item.paciente}<br/><small style={{ color: '#9f6947'}}>{item.terapeuta}</small></td>
                  <td>Evol: {item.evolucaoMedia}<br/>Comp: {item.competenciaMedia}</td>
                  <td>{item.pontoDesenvolver || item.planoAcao || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum lançamento encontrado para o recorte selecionado.</p>
        )}
      </div>
    </div>
  );
}

export default function RelatoriosSupervisaoPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <RelatoriosContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function RelatoriosContent({ user, onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [reportType, setReportType] = useState("executivo"); // Já vem marcado o recomendado
  const [printData, setPrintData] = useState(null);
  const [filters, setFilters] = useState({
    ano: String(currentYear),
    mes: "",
    semana: "",
    clinicaId: "",
    terapeutaId: "",
    pacienteId: "",
  });

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const payload = await supervisaoRequest(user, "dashboard");
        setData(payload);
      } catch (error) {
        console.error(error);
        setMessage({ type: "error", text: error.message });
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [user]);

  // TEMPO AUMENTADO PARA 1200ms para garantir renderização perfeita dos gráficos em CSS antes da tela travar
  useEffect(() => {
    if (!printData || typeof window === "undefined") return undefined;

    const timeout = window.setTimeout(() => window.print(), 1200);
    const clearAfterPrint = () => setPrintData(null);

    window.addEventListener("afterprint", clearAfterPrint);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("afterprint", clearAfterPrint);
    };
  }, [printData]);

  const clinicas = useMemo(() => data?.clinicas || [], [data]);
  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const terapeutasFiltradosSelect = useMemo(() => {
    if (!filters.clinicaId) return terapeutas;
    return terapeutas.filter((item) => safeId(item.clinicaId) === safeId(filters.clinicaId));
  }, [terapeutas, filters.clinicaId]);

  const pacientesFiltradosSelect = useMemo(() => {
    return pacientes.filter((item) => matchEntity(item, filters, "paciente"));
  }, [pacientes, filters]);

  const lancamentosFiltrados = useMemo(() => {
    return filterLancamentos(lancamentos, filters);
  }, [lancamentos, filters]);

  const clinicasFiltradas = useMemo(() => {
    return clinicas.filter((item) => matchEntity(item, filters, "clinica"));
  }, [clinicas, filters]);

  const terapeutasFiltrados = useMemo(() => {
    return terapeutas.filter((item) => matchEntity(item, filters, "terapeuta"));
  }, [terapeutas, filters]);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((item) => matchEntity(item, filters, "paciente"));
  }, [pacientes, filters]);

  const alertasCalculados = useMemo(() => {
    return buildAlertasSupervisao({ clinicas, terapeutas, pacientes, lancamentos, filters });
  }, [clinicas, terapeutas, pacientes, lancamentos, filters]);

  const resumoAlertas = useMemo(() => summarizeAlertas(alertasCalculados), [alertasCalculados]);

  const contextTitle = useMemo(() => {
    return getContextTitle({ filters, clinicas, terapeutas, pacientes });
  }, [filters, clinicas, terapeutas, pacientes]);

  const periodText = useMemo(() => getPeriodText(filters), [filters]);

  const metrics = useMemo(() => {
    return {
      registros: lancamentosFiltrados.length,
      clinicas: clinicasFiltradas.length,
      terapeutas: new Set(lancamentosFiltrados.map((item) => item.terapeutaId).filter(Boolean)).size || terapeutasFiltrados.length,
      pacientes: new Set(lancamentosFiltrados.map((item) => item.pacienteId).filter(Boolean)).size || pacientesFiltrados.length,
      competencia: average(lancamentosFiltrados.map(competenciaMedia)),
      evolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,
      alertas: alertasCalculados.length,
    };
  }, [lancamentosFiltrados, clinicasFiltradas, terapeutasFiltrados, pacientesFiltrados, alertasCalculados]);

  const reportRows = useMemo(() => {
    const context = { clinicas, terapeutas, pacientes };

    const resumoRows = buildResumoRows({ metrics, filters, contexto: contextTitle });
    const clinicasRows = buildClinicasRows(clinicasFiltradas);
    const terapeutasRows = buildTerapeutasRows(terapeutasFiltrados, context);
    const pacientesRows = buildPacientesRows(pacientesFiltrados, context);
    const lancamentosRows = buildLancamentosRows(lancamentosFiltrados, context);
    const alertasRows = buildAlertasRows(alertasCalculados);

    return {
      resumoRows,
      clinicasRows,
      terapeutasRows,
      pacientesRows,
      lancamentosRows,
      alertasRows,
    };
  }, [clinicas, terapeutas, pacientes, metrics, filters, contextTitle, clinicasFiltradas, terapeutasFiltrados, pacientesFiltrados, lancamentosFiltrados, alertasCalculados]);

  const reportSheets = useMemo(() => {
    return buildReportSheets({ ...reportRows, type: reportType });
  }, [reportRows, reportType]);

  const tipoRelatorioLabel = REPORT_TYPES.find((item) => item.value === reportType)?.label || "Relatório";

  function updateFilter(name, value) {
    setFilters((current) => {
      const next = { ...current, [name]: value };
      if (name === "clinicaId") {
        next.terapeutaId = "";
        next.pacienteId = "";
      }
      if (name === "terapeutaId") {
        next.pacienteId = "";
      }
      return next;
    });
  }

  function handleExportExcel() {
    exportExcelWorkbook(
      buildReportFileName(contextTitle, filters, "Excel"),
      reportSheets,
      metrics // Passando os dados para a capa do Excel
    );
  }

  function handleExportLancamentosCsv() {
    exportCsv(buildReportFileName(contextTitle, filters, "Lançamentos"), lancamentosColumns, reportRows.lancamentosRows);
  }

  function handlePrintReport() {
    setPrintData({
      ...reportRows,
      metrics,
      filters,
      contextTitle,
      periodText,
      clinicasFiltradas,
      terapeutasFiltrados,
      lancamentosRaw: lancamentos // Usado para calcular as barras no PDF
    });
  }

  return (
    <>
      <Head>
        <title>Relatórios | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Relatórios e Apresentações"
        description="Gere dashboards executivos e exporte relatórios consolidados em Excel ou PDF."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero relatorios-hero">
          <div>
            <span className="supervisao-kicker">Inteligência de Dados</span>
            <h2>{contextTitle}</h2>
            <p>{periodText} · escolha o recorte e gere uma apresentação executiva formatada.</p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={(
              <>
                <label>
                  <span>Clínica</span>
                  <select value={filters.clinicaId} onChange={(event) => updateFilter("clinicaId", event.target.value)}>
                    <option value="">Todas</option>
                    {clinicas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}
                  </select>
                </label>

                <label>
                  <span>Terapeuta</span>
                  <select value={filters.terapeutaId} onChange={(event) => updateFilter("terapeutaId", event.target.value)}>
                    <option value="">Todos</option>
                    {terapeutasFiltradosSelect.map((terapeuta) => <option key={terapeuta.id} value={terapeuta.id}>{terapeuta.nome}</option>)}
                  </select>
                </label>

                <label>
                  <span>Paciente</span>
                  <select value={filters.pacienteId} onChange={(event) => updateFilter("pacienteId", event.target.value)}>
                    <option value="">Todos</option>
                    {pacientesFiltradosSelect.map((paciente) => <option key={paciente.id} value={paciente.id}>{paciente.nome}</option>)}
                  </select>
                </label>
              </>
            )}
          />
        </section>

        {loading ? (
          <section className="supervisao-panel"><p>Carregando relatórios...</p></section>
        ) : (
          <>
            <section className="supervisao-report-command-panel">
              <div>
                <span className="supervisao-kicker">Exportar Apresentação</span>
                <h2>{tipoRelatorioLabel}</h2>
                <p>
                  O "Dashboard Executivo" foca nos resultados finais (KPIs) para envio à diretoria. Para baixar toda a base de dados de uma vez, escolha "Relatório com dados brutos".
                </p>
              </div>

              <label>
                <span>Selecionar modelo de arquivo</span>
                <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
                  {REPORT_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>{item.label}</option>
                  ))}
                </select>
              </label>

              <div className="supervisao-report-actions">
                <button type="button" className="supervisao-primary-button" onClick={handleExportExcel}>
                  Gerar Excel Estilizado
                </button>
                <button type="button" className="supervisao-secondary-button" onClick={handlePrintReport}>
                  Gerar PDF para Apresentação
                </button>
                <button type="button" className="supervisao-secondary-button" onClick={handleExportLancamentosCsv}>
                  Baixar CSV Simples
                </button>
              </div>
            </section>

            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Lançamentos" value={metrics.registros} detail="registros filtrados" />
              <CardIndicador label="Pacientes" value={metrics.pacientes} detail="casos acompanhados" />
              <CardIndicador label="Evolução" value={formatPercent(metrics.evolucao)} detail="score clínico geral" />
              <CardIndicador label="Alertas" value={metrics.alertas} detail="pontos de atenção" />
            </section>

            <div className="bento-grid dashboard-lower">
              <div className="bento-col bento-12">
                <PreviewTable title="Resumo Executivo (Prévia)" columns={resumoColumns} rows={reportRows.resumoRows} limit={4} />
              </div>
              <div className="bento-col bento-6">
                <PreviewTable title="Atenção Imediata" columns={alertasColumns} rows={reportRows.alertasRows} limit={4} />
              </div>
              <div className="bento-col bento-6">
                <PreviewTable title="Últimos Lançamentos" columns={lancamentosColumns} rows={reportRows.lancamentosRows} limit={4} />
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>

      <PrintReport data={printData} />
    </>
  );
}