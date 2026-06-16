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
  return "Supervisão clínica";
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
  return `Relatório Supervisão TCC - ${contextTitle} - ${getPeriodText(filters)} - ${suffix}`;
}

// Componente PreviewTable refatorado para encaixar perfeitamente no Bento Box
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

function PrintReport({ data }) {
  if (!data) return null;

  const previewLancamentos = data.lancamentosRows.slice(0, 30);
  const previewAlertas = data.alertasRows.slice(0, 24);

  return (
    <article className="supervisao-print-report">
      <header>
        <span>Relatório de Supervisão Clínica em TCC</span>
        <h1>{data.contextTitle}</h1>
        <p>{data.periodText}</p>
      </header>

      <section className="supervisao-print-summary">
        {data.resumoRows.map((row) => (
          <div key={row.indicador}>
            <span>{row.indicador}</span>
            <strong>{row.valor}</strong>
            <small>{row.detalhe}</small>
          </div>
        ))}
      </section>

      <section className="supervisao-print-section">
        <h2>Resumo interpretativo</h2>
        <p>
          No recorte selecionado, o sistema consolidou {data.metrics.registros} lançamento(s),
          envolvendo {data.metrics.pacientes} paciente(s), {data.metrics.terapeutas} terapeuta(s)
          e {data.metrics.clinicas} clínica(s). A média técnica foi de {formatDecimal(data.metrics.competencia)}/5
          e o score clínico consolidado foi de {formatPercent(data.metrics.evolucao)}.
        </p>
      </section>

      <section className="supervisao-print-section">
        <h2>Alertas principais</h2>
        {previewAlertas.length ? (
          <table>
            <thead>
              <tr>
                <th>Nível</th>
                <th>Tipo</th>
                <th>Paciente</th>
                <th>Resumo</th>
              </tr>
            </thead>
            <tbody>
              {previewAlertas.map((alerta, index) => (
                <tr key={`${alerta.title}-${index}`}>
                  <td>{alerta.levelLabel}</td>
                  <td>{alerta.typeLabel}</td>
                  <td>{alerta.pacienteNome}</td>
                  <td>{alerta.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum alerta encontrado para o recorte selecionado.</p>
        )}
      </section>

      <section className="supervisao-print-section">
        <h2>Últimos lançamentos</h2>
        {previewLancamentos.length ? (
          <table>
            <thead>
              <tr>
                <th>Período</th>
                <th>Paciente</th>
                <th>Terapeuta</th>
                <th>Competência</th>
                <th>Evolução</th>
              </tr>
            </thead>
            <tbody>
              {previewLancamentos.map((item, index) => (
                <tr key={`${item.paciente}-${index}`}>
                  <td>{item.mes} · {item.ano} · {item.semana}</td>
                  <td>{item.paciente}</td>
                  <td>{item.terapeuta}</td>
                  <td>{item.competenciaMedia}</td>
                  <td>{item.evolucaoMedia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhum lançamento encontrado para o recorte selecionado.</p>
        )}
      </section>
    </article>
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
  const [reportType, setReportType] = useState("completo");
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

  useEffect(() => {
    if (!printData || typeof window === "undefined") return undefined;

    const timeout = window.setTimeout(() => window.print(), 250);
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
      buildReportFileName(contextTitle, filters, tipoRelatorioLabel),
      reportSheets
    );
  }

  function handleExportLancamentosCsv() {
    exportCsv(buildReportFileName(contextTitle, filters, "Lançamentos"), lancamentosColumns, reportRows.lancamentosRows);
  }

  function handleExportAlertasCsv() {
    exportCsv(buildReportFileName(contextTitle, filters, "Alertas"), alertasColumns, reportRows.alertasRows);
  }

  function handlePrintReport() {
    setPrintData({
      ...reportRows,
      metrics,
      filters,
      contextTitle,
      periodText,
    });
  }

  return (
    <>
      <Head>
        <title>Relatórios | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Relatórios e Análises"
        description="Gere resumos executivos, exportações para Excel e versões imprimíveis do trabalho clínico."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero relatorios-hero">
          <div>
            <span className="supervisao-kicker">Data & Inteligência</span>
            <h2>{contextTitle}</h2>
            <p>{periodText} · escolha o recorte e exporte os dados consolidados no formato necessário.</p>
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
                <span className="supervisao-kicker">Exportar Documentos</span>
                <h2>{tipoRelatorioLabel}</h2>
                <p>
                  O arquivo gerado reflete exatamente os filtros aplicados. Utilize o botão de PDF para abrir a formatação limpa de impressão.
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
                  Baixar Excel (XLSX)
                </button>
                <button type="button" className="supervisao-secondary-button" onClick={handlePrintReport}>
                  Gerar Relatório em PDF
                </button>
                <button type="button" className="supervisao-secondary-button" onClick={handleExportLancamentosCsv}>
                  CSV Lançamentos
                </button>
                <button type="button" className="supervisao-secondary-button" onClick={handleExportAlertasCsv}>
                  CSV Alertas
                </button>
              </div>
            </section>

            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Lançamentos" value={metrics.registros} detail="registros filtrados" />
              <CardIndicador label="Pacientes" value={metrics.pacientes} detail="casos acompanhados" />
              <CardIndicador label="Evolução" value={formatPercent(metrics.evolucao)} detail="score clínico geral" />
              <CardIndicador label="Alertas" value={metrics.alertas} detail="pontos de atenção" />
            </section>

            <div className="bento-grid">
              <div className="bento-col bento-4">
                <ChartPanel title="Alertas por Nível" subtitle="Prioridade dos pontos de atenção" action={`${resumoAlertas.total} alerta(s)`}>
                  <DonutChart items={resumoAlertas.niveis} />
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <ChartPanel title="Tipos de Alerta" subtitle="Motivos mais frequentes" action="Top 5">
                  <HorizontalBars
                    items={resumoAlertas.tipos.slice(0, 5)}
                    valueKey="value"
                    labelKey="label"
                    valueFormatter={(value) => String(value)}
                  />
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <ChartPanel title="Clínicas no Relatório" subtitle="Volume de registros no recorte" action={`${metrics.clinicas} clínica(s)`}>
                  <HorizontalBars
                    items={clinicasFiltradas.map((clinica) => ({
                      id: clinica.id,
                      label: clinica.nome,
                      value: lancamentosFiltrados.filter((item) => safeId(item.clinicaId) === safeId(clinica.id)).length,
                    })).filter((item) => item.value > 0).slice(0, 5)}
                    valueKey="value"
                    labelKey="label"
                    valueFormatter={(value) => String(value)}
                  />
                </ChartPanel>
              </div>
            </div>

            <div className="bento-grid dashboard-lower">
              <div className="bento-col bento-12">
                <PreviewTable title="Resumo Executivo" columns={resumoColumns} rows={reportRows.resumoRows} limit={4} />
              </div>
              <div className="bento-col bento-6">
                <PreviewTable title="Lançamentos Semanais" columns={lancamentosColumns} rows={reportRows.lancamentosRows} limit={4} />
              </div>
              <div className="bento-col bento-6">
                <PreviewTable title="Alertas Automáticos" columns={alertasColumns} rows={reportRows.alertasRows} limit={4} />
              </div>
              <div className="bento-col bento-4">
                <PreviewTable title="Pacientes / Casos" columns={pacientesColumns} rows={reportRows.pacientesRows} limit={5} />
              </div>
              <div className="bento-col bento-4">
                <PreviewTable title="Equipe de Terapeutas" columns={terapeutasColumns} rows={reportRows.terapeutasRows} limit={5} />
              </div>
              <div className="bento-col bento-4">
                <PreviewTable title="Unidades Clínicas" columns={clinicasColumns} rows={reportRows.clinicasRows} limit={5} />
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>

      <PrintReport data={printData} />
    </>
  );
}