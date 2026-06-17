import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { ChartPanel, DonutChart, HorizontalBars } from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import { average, formatDecimal, formatPercent, mesNome, formatarDataBR } from "@/lib/supervisao/format";
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

// =========================================================================
// O COMPONENTE MÁGICO DE PDF (SUPER ENRIQUECIDO COM DADOS DO FIRESTORE)
// =========================================================================
function PrintReport({ data }) {
  if (!data) return null;

  const previewLancamentos = data.lancamentosRows.slice(0, 10);
  const previewAlertas = data.alertasRows.slice(0, 10);
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // Filtra Planos de Ação em Aberto/Atrasados
  const planosPendentes = data.lancamentosRaw
    .filter(isPlanoAberto)
    .sort((a, b) => new Date(a.prazo) - new Date(b.prazo))
    .slice(0, 8);

  // Filtra as últimas Recomendações registradas (Síntese Qualitativa)
  const ultimasRecomendacoes = data.lancamentosRaw
    .filter(l => l.recomendacao && l.recomendacao.trim() !== "" && l.recomendacao.trim() !== "-")
    .slice(0, 5);

  const isGlobalView = data.clinicasFiltradas.length > 1;
  const rankingBase = isGlobalView ? data.clinicasFiltradas : data.terapeutasFiltrados;
  
  // Ranking de Evolução por Clínica/Terapeuta
  const rankingEvolucao = rankingBase.map(item => ({ 
    label: item.nome, 
    value: average(filterLancamentos(data.lancamentosRaw, isGlobalView ? {clinicaId: item.id} : {terapeutaId: item.id}).map(evolucaoMedia)) 
  })).sort((a,b) => b.value - a.value).slice(0,5);

  // EXTRAÇÃO AVANÇADA 1: Quebra de Competências Clínicas
  const totalLancs = data.lancamentosRaw.length || 1;
  const avgSkill = (key) => average(data.lancamentosRaw.map(l => Number(l[key]) || 0));
  
  const competenciasTecnicas = [
    { label: "Aplicação TCC", value: avgSkill("aplicacaoTecnicasTcc") },
    { label: "Formulação de Hipóteses", value: avgSkill("formulacaoHipoteses") },
    { label: "Manejo da Sessão", value: avgSkill("manejoSessao") },
    { label: "Qualidade da Conceitualização", value: avgSkill("qualidadeConceitualizacao") },
    { label: "Postura Terapêutica", value: avgSkill("posturaTerapeutica") }
  ].sort((a,b) => b.value - a.value);

  // EXTRAÇÃO AVANÇADA 2: Termômetro de Sintomatologia
  const termometroSintomas = [
    { label: "Intensidade dos Sintomas", value: avgSkill("intensidadeSintomas") },
    { label: "Crises de Ansiedade (Vol.)", value: avgSkill("crisesAnsiedade") },
    { label: "Evitação Social", value: avgSkill("evitacaoSocial") },
  ];

  // EXTRAÇÃO AVANÇADA 3: Raio-X da Carteira (Status dos Casos)
  const statusCarteira = data.pacientesFiltrados.reduce((acc, p) => {
    const st = p.statusCaso || "Não informado";
    acc[st] = (acc[st] || 0) + 1;
    return acc;
  }, {});

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
        
        <div className="print-metrics" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <div className="print-metric-card">
            <span>Evolução Clínica</span>
            <strong>{formatPercent(data.metrics.evolucao)}</strong>
            <small>Score consolidado</small>
          </div>
          <div className="print-metric-card">
            <span>Média Técnica</span>
            <strong>{formatDecimal(data.metrics.competencia)}</strong>
            <small>Média Geral (1 a 5)</small>
          </div>
          <div className="print-metric-card">
            <span>Adesão Terapêutica</span>
            <strong>{formatPercent(data.metrics.adesao)}</strong>
            <small>Engajamento do paciente</small>
          </div>
          <div className="print-metric-card">
            <span>Evolução de Objetivos</span>
            <strong>{formatPercent(data.metrics.objetivos)}</strong>
            <small>Metas alcançadas</small>
          </div>
          <div className="print-metric-card">
            <span>Casos em Risco</span>
            <strong>{data.metrics.alertas}</strong>
            <small>Alertas automáticos gerados</small>
          </div>
          <div className="print-metric-card">
            <span>Acompanhamentos</span>
            <strong>{data.metrics.registros}</strong>
            <small>Atendimentos supervisionados</small>
          </div>
        </div>

        <div className="print-grid-two">
          <div className="print-card">
            <h4>Raio-X da Carteira (Status dos Pacientes)</h4>
            <div style={{ display: 'grid', gap: '10px' }}>
              {Object.entries(statusCarteira).map(([status, count], i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#fdfaf6', borderRadius: '8px', border: '1px solid #e8ddd3' }}>
                  <span style={{ color: '#5d4d43', fontWeight: 600 }}>{status}</span>
                  <strong style={{ color: '#392619' }}>{count} caso(s)</strong>
                </div>
              ))}
            </div>
          </div>
          
          <div className="print-card">
            <h4>{isGlobalView ? "Evolução por Clínica" : "Evolução por Terapeuta"}</h4>
            {rankingEvolucao.map((item, i) => (
              <div className="print-bar-row" key={`evol-${i}`}>
                <span className="print-bar-label">{item.label}</span>
                <div className="print-bar-track">
                  <div className="print-bar-fill" style={{ width: `${item.value}%` }}></div>
                </div>
                <span className="print-bar-value">{formatPercent(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PÁGINA 2: APROFUNDAMENTO TÉCNICO E CLÍNICO */}
      <div className="print-section">
        <h3>Mapeamento de Competências e Sintomatologia</h3>
        <p style={{ marginBottom: '24px', color: '#7b6c61' }}>
          Análise granulada do desempenho técnico da equipe de terapeutas e da intensidade dos sintomas reportados pelos pacientes no recorte selecionado.
        </p>

        <div className="print-grid-two">
          <div className="print-card">
            <h4>Perfil de Competência Técnica (Média / 5)</h4>
            {competenciasTecnicas.map((item, i) => (
              <div className="print-bar-row" key={`comp-${i}`}>
                <span className="print-bar-label">{item.label}</span>
                <div className="print-bar-track">
                  <div className="print-bar-fill" style={{ width: `${(item.value / 5) * 100}%`, background: '#b78290' }}></div>
                </div>
                <span className="print-bar-value">{formatDecimal(item.value)}</span>
              </div>
            ))}
          </div>

          <div className="print-card">
            <h4>Termômetro de Sintomas (Média)</h4>
            {termometroSintomas.map((item, i) => (
              <div className="print-bar-row" key={`sint-${i}`}>
                <span className="print-bar-label">{item.label}</span>
                <div className="print-bar-track">
                  <div className="print-bar-fill" style={{ width: `${(item.value / 10) * 100}%`, background: '#6c7fa0' }}></div>
                </div>
                <span className="print-bar-value">{formatDecimal(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <h3 style={{ marginTop: '40px' }}>Gestão de Planos de Ação (Abertos)</h3>
        {planosPendentes.length > 0 ? (
          <table className="print-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Prazo</th>
                <th style={{ width: '25%' }}>Terapeuta / Caso</th>
                <th style={{ width: '15%' }}>Status</th>
                <th style={{ width: '45%' }}>Ação Requerida</th>
              </tr>
            </thead>
            <tbody>
              {planosPendentes.map((plano, index) => (
                <tr key={`plano-${index}`}>
                  <td><strong>{plano.prazo ? formatarDataBR(plano.prazo) : "Sem prazo"}</strong></td>
                  <td>{plano.terapeutaNome}<br/><small style={{ color: '#9f6947'}}>{plano.pacienteNome}</small></td>
                  <td>{plano.statusPlano}</td>
                  <td>{plano.planoAcao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Não há planos de ação pendentes registrados neste recorte.</p>
        )}
      </div>

      {/* PÁGINA 3: SÍNTESE E RISCO */}
      <div className="print-section">
        <h3>Síntese Qualitativa: Recomendações da Supervisão</h3>
        {ultimasRecomendacoes.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px', marginBottom: '40px' }}>
            {ultimasRecomendacoes.map((rec, i) => (
              <div key={`rec-${i}`} style={{ background: '#fff', border: '1px solid #e8ddd3', borderRadius: '12px', padding: '16px' }}>
                <strong style={{ display: 'block', color: '#392619', fontSize: '0.9rem', marginBottom: '6px' }}>
                  Para: {rec.terapeutaNome} (Caso: {rec.pacienteNome})
                </strong>
                <p style={{ margin: 0, color: '#5d4d43', fontSize: '0.95rem', lineHeight: 1.5 }}>
                  "{rec.recomendacao}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginBottom: '40px' }}>Nenhuma recomendação registrada nas últimas semanas.</p>
        )}

        <h3>Casos que Exigem Intervenção (Alertas)</h3>
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
  const [reportType, setReportType] = useState("executivo"); 
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
      adesao: average(lancamentosFiltrados.map(item => item.adesaoTarefas || 0)), 
      objetivos: average(lancamentosFiltrados.map(item => item.evolucaoObjetivos || 0)), 
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
      metrics
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
      pacientesFiltrados,
      lancamentosRaw: lancamentosFiltrados 
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
            {/* PAINEL DE EXPORTAÇÃO REFATORADO (MAIS COMPACTO, LAYOUT HORIZONTAL E BOTÕES RENOMEADOS) */}
            <section 
              className="supervisao-report-command-panel" 
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap',
                padding: '24px 32px' 
              }}
            >
              <div style={{ flex: '1 1 300px' }}>
                <span className="supervisao-kicker">Exportação de Dados</span>
                <h2 style={{ fontSize: '1.75rem', margin: '4px 0 8px' }}>Baixar Relatórios</h2>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Gere arquivos com os indicadores atuais para envio à diretoria ou análise em planilhas.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: '0 0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sup-primary-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Formato:
                  </span>
                  <select 
                    value={reportType} 
                    onChange={(event) => setReportType(event.target.value)}
                    style={{ height: '40px', borderRadius: '12px', border: '1px solid rgba(159, 105, 71, 0.25)', padding: '0 16px', background: '#fff', fontSize: '0.85rem', color: 'var(--sup-text)', outline: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    {REPORT_TYPES.map((item) => (
                      <option key={item.value} value={item.value}>{item.label}</option>
                    ))}
                  </select>
                </div>

                <div className="supervisao-report-actions" style={{ margin: 0, justifyContent: 'flex-end' }}>
                  <button type="button" className="supervisao-primary-button" onClick={handleExportExcel} style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                    Gerar Excel
                  </button>
                  <button type="button" className="supervisao-secondary-button" onClick={handlePrintReport} style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                    Gerar PDF
                  </button>
                  <button type="button" className="supervisao-secondary-button" onClick={handleExportLancamentosCsv} style={{ padding: '10px 18px', fontSize: '0.85rem' }}>
                    Gerar CSV
                  </button>
                </div>
              </div>
            </section>

            <section className="supervisao-indicator-grid executive">
              <CardIndicador label="Lançamentos" value={metrics.registros} detail="registros filtrados" />
              <CardIndicador label="Pacientes" value={metrics.pacientes} detail="casos acompanhados" />
              <CardIndicador label="Evolução Média" value={formatPercent(metrics.evolucao)} detail="score clínico geral" />
              <CardIndicador label="Adesão (Tarefas)" value={formatPercent(metrics.adesao)} detail="engajamento do paciente" />
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