import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import StatusMessage from "@/components/supervisao/StatusMessage";
import {
  HistoricoComparativo,
  HistoricoSnapshot,
} from "@/components/supervisao/TimelineLancamentos";
import { supervisaoRequest } from "@/lib/supervisao/api";
import {
  average,
  formatDecimal,
  formatPercent,
  mesNome,
} from "@/lib/supervisao/format";
import {
  competenciaMedia,
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  isPlanoAberto,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

function safeId(value) {
  return value === undefined || value === null ? "" : String(value);
}

function safeText(value, fallback = "-") {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
}

function getLatest(items = []) {
  return sortByPeriodDesc(items)[0];
}

function truncateText(value, maxLength = 150, fallback = "-") {
  const text = safeText(value, fallback).replace(/\s+/g, " ").trim();

  if (!text || text === fallback) return fallback;
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trim()}…`;
}

function getResumoLancamento(item = {}) {
  return (
    item.recomendacao ||
    item.planoAcao ||
    item.observacao ||
    item.pontoDesenvolver ||
    item.pontoForte ||
    "Sem observação registrada para este acompanhamento."
  );
}

function getStatusClass(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("concl")) return "done";
  if (normalized.includes("atras") || normalized.includes("venc")) return "danger";
  if (normalized.includes("andamento")) return "progress";

  return "neutral";
}

function formatarDataBR(dataIso) {
  if (!dataIso) return "";
  
  try {
    // 1. Se vier do Firebase como Timestamp (tem a função toDate)
    if (typeof dataIso.toDate === "function") {
      const dataFormatada = dataIso.toDate();
      const dia = String(dataFormatada.getDate()).padStart(2, "0");
      const mes = String(dataFormatada.getMonth() + 1).padStart(2, "0");
      const ano = dataFormatada.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    // 2. Se for uma data JS normal
    if (dataIso instanceof Date) {
      const dia = String(dataIso.getDate()).padStart(2, "0");
      const mes = String(dataIso.getMonth() + 1).padStart(2, "0");
      const ano = dataIso.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    // 3. Força virar string para evitar crash (Objects are not valid as a React child)
    const textoData = String(dataIso);
    const apenasData = textoData.split("T")[0]; 
    const partes = apenasData.split("-");
    
    // Se estiver no formato YYYY-MM-DD
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return textoData;
  } catch (error) {
    return "-"; // Em caso de falha absoluta, não quebra a tela
  }
}

function periodLabel(item = {}) {
  return `${mesNome(item.mes)} · ${item.ano || "-"} · Semana ${
    item.semana || "-"
  }`;
}

function ModalDetalheLancamento({ item, onFechar }) {
  if (!item) return null;

  const textos = [
    ["Ponto forte", item.pontoForte],
    ["Ponto a desenvolver", item.pontoDesenvolver],
    ["Recomendação", item.recomendacao],
    ["Plano de ação", item.planoAcao],
    ["Observação", item.observacao],
  ];

  return (
    <div className="supervisao-modal-backdrop" onClick={onFechar}>
      <div
        className="supervisao-modal supervisao-modal-large supervisao-detalhe-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="supervisao-modal-header">
          <div>
            <span className="supervisao-kicker">{periodLabel(item)}</span>
            <h2>{safeText(item.pacienteNome, "Paciente/caso")}</h2>
            <p>
              {safeText(item.terapeutaNome, "Terapeuta")} ·{" "}
              {safeText(item.clinicaNome, "Clínica")}
            </p>
          </div>

          <button
            type="button"
            className="supervisao-modal-close"
            onClick={onFechar}
            aria-label="Fechar detalhes"
          >
            ×
          </button>
        </div>

        <div className="supervisao-modal-body">
          <div className="supervisao-detalhe-grid">
            <div>
              <span>Status do plano</span>
              <strong>{safeText(item.statusPlano)}</strong>
            </div>

            <div>
              <span>Prazo</span>
              {/* FORMATAÇÃO APLICADA AQUI NO MODAL */}
              <strong>{item.prazo ? formatarDataBR(item.prazo) : "-"}</strong>
            </div>

            <div>
              <span>Evolução</span>
              <strong>{formatPercent(evolucaoMedia(item))}</strong>
            </div>

            <div>
              <span>Competência</span>
              <strong>{formatDecimal(competenciaMedia(item))}/5</strong>
            </div>

            <div>
              <span>Adesão</span>
              <strong>{formatPercent(item.adesaoTarefas || 0)}</strong>
            </div>

            <div>
              <span>Objetivos</span>
              <strong>{formatPercent(item.evolucaoObjetivos || 0)}</strong>
            </div>
          </div>

          <div className="supervisao-detalhe-textos">
            {textos.map(([label, value]) => (
              <section key={label}>
                <h3>{label}</h3>
                <p>{safeText(value)}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineLancamentosResumida({ items = [], onVerDetalhes }) {
  const rows = useMemo(() => sortByPeriodDesc(items), [items]);

  if (!rows.length) {
    return (
      <p className="supervisao-empty" style={{ textAlign: 'center', padding: '40px' }}>
        Nenhum acompanhamento semanal encontrado para o filtro selecionado.
      </p>
    );
  }

  return (
    <div className="supervisao-history-timeline">
      {rows.map((item, index) => (
        <article key={item.id || `${item.ano}-${item.mes}-${item.semana}-${index}`}>
          <div className="supervisao-history-marker" aria-hidden="true" />

          <div className="supervisao-history-card supervisao-history-card-compact">
            <header>
              <div>
                <span>{periodLabel(item)}</span>
                <strong>{safeText(item.pacienteNome, "Paciente/caso")}</strong>
                <small>
                  {safeText(item.terapeutaNome, "Terapeuta")}
                  {item.clinicaNome ? ` · ${item.clinicaNome}` : ""}
                </small>
              </div>

              <i
                className={`supervisao-status-pill ${getStatusClass(
                  item.statusPlano
                )}`}
              >
                {item.statusPlano || "Sem plano"}
              </i>
            </header>

            <div className="supervisao-history-metrics">
              <span>Evolução {formatPercent(evolucaoMedia(item))}</span>
              <span>Competência {formatDecimal(competenciaMedia(item))}/5</span>
              <span>Adesão {formatPercent(item.adesaoTarefas || 0)}</span>
              <span>Objetivos {formatPercent(item.evolucaoObjetivos || 0)}</span>
            </div>

            <p className="supervisao-history-summary">
              {truncateText(
                getResumoLancamento(item),
                170,
                "Sem observação registrada para esta semana."
              )}
            </p>

            <div className="supervisao-history-actions">
              <button
                type="button"
                className="supervisao-mini-action"
                onClick={() => onVerDetalhes(item)}
              >
                Ver detalhes completos
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HistoricoSupervisaoPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => (
        <HistoricoContent user={user} onLogout={onLogout} />
      )}
    </AuthGuard>
  );
}

function HistoricoContent({ user, onLogout }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [detalheAberto, setDetalheAberto] = useState(null);

  const [filters, setFilters] = useState({
    ano: String(currentYear),
    mes: "",
    semana: "",
    clinicaId: "",
    terapeutaId: "",
    pacienteId: "",
  });

  useEffect(() => {
    if (!router.isReady) return;

    const queryValue = (name) => {
      const value = router.query[name];
      return Array.isArray(value) ? value[0] : value;
    };

    const clinicaId = queryValue("clinicaId");
    const terapeutaId = queryValue("terapeutaId");
    const pacienteId = queryValue("pacienteId");

    if (!clinicaId && !terapeutaId && !pacienteId) return;

    setFilters((current) => ({
      ...current,
      clinicaId: clinicaId || current.clinicaId,
      terapeutaId: terapeutaId || current.terapeutaId,
      pacienteId: pacienteId || current.pacienteId,
    }));
  }, [router.isReady, router.query.clinicaId, router.query.terapeutaId, router.query.pacienteId]);

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

  const clinicas = useMemo(() => data?.clinicas || [], [data]);
  const terapeutas = useMemo(() => data?.terapeutas || [], [data]);
  const pacientes = useMemo(() => data?.pacientes || [], [data]);
  const lancamentos = useMemo(() => data?.lancamentos || [], [data]);

  const terapeutasFiltrados = useMemo(() => {
    if (!filters.clinicaId) return terapeutas;

    return terapeutas.filter(
      (item) => safeId(item.clinicaId) === safeId(filters.clinicaId)
    );
  }, [terapeutas, filters.clinicaId]);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((item) => {
      if (
        filters.clinicaId &&
        safeId(item.clinicaId) !== safeId(filters.clinicaId)
      ) {
        return false;
      }

      if (
        filters.terapeutaId &&
        safeId(item.terapeutaId) !== safeId(filters.terapeutaId)
      ) {
        return false;
      }

      return true;
    });
  }, [pacientes, filters.clinicaId, filters.terapeutaId]);

  const lancamentosFiltrados = useMemo(() => {
    return filterLancamentos(lancamentos, filters);
  }, [lancamentos, filters]);

  const ultimoLancamento = useMemo(
    () => getLatest(lancamentosFiltrados),
    [lancamentosFiltrados]
  );

  const metricas = useMemo(() => {
    return {
      registros: lancamentosFiltrados.length,
      pacientes: new Set(
        lancamentosFiltrados.map((item) => item.pacienteId).filter(Boolean)
      ).size,
      evolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,
    };
  }, [lancamentosFiltrados]);

  const tituloContexto = useMemo(() => {
    if (filters.pacienteId) {
      return selectedName(pacientes, filters.pacienteId, "Paciente");
    }
    if (filters.terapeutaId) {
      return selectedName(terapeutas, filters.terapeutaId, "Terapeuta");
    }
    if (filters.clinicaId) {
      return selectedName(clinicas, filters.clinicaId, "Clínica");
    }
    return "Histórico Geral";
  }, [filters.pacienteId, filters.terapeutaId, filters.clinicaId, pacientes, terapeutas, clinicas]);

  const subtituloContexto = useMemo(() => {
    const periodo = [
      filters.mes ? mesNome(filters.mes) : "Todos os meses",
      filters.ano || "Todos os anos",
    ].filter(Boolean).join(" · ");

    return `${periodo}${filters.semana ? ` · Semana ${filters.semana}` : ""}`;
  }, [filters.ano, filters.mes, filters.semana]);

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

  return (
    <>
      <Head>
        <title>Histórico clínico | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Histórico Clínico"
        description="Acompanhe a linha do tempo evolutiva e os comparativos de desempenho por paciente ou equipe."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero history-hero">
          <div>
            <span className="supervisao-kicker">Evolução e Linha do Tempo</span>
            <h2>{tituloContexto}</h2>
            <p>
              {subtituloContexto} · Acompanhe o progresso técnico e os desfechos clínicos através dos registros semanais arquivados.
            </p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={lancamentos}
            extraFilters={
              <>
                <label>
                  <span>Clínica</span>
                  <select
                    value={filters.clinicaId}
                    onChange={(event) => updateFilter("clinicaId", event.target.value)}
                  >
                    <option value="">Todas as Clínicas</option>
                    {clinicas.map((clinica) => (
                      <option key={clinica.id} value={clinica.id}>
                        {clinica.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Terapeuta</span>
                  <select
                    value={filters.terapeutaId}
                    onChange={(event) => updateFilter("terapeutaId", event.target.value)}
                  >
                    <option value="">Todos os Terapeutas</option>
                    {terapeutasFiltrados.map((terapeuta) => (
                      <option key={terapeuta.id} value={terapeuta.id}>
                        {terapeuta.nome}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Paciente</span>
                  <select
                    value={filters.pacienteId}
                    onChange={(event) => updateFilter("pacienteId", event.target.value)}
                  >
                    <option value="">Todos os Pacientes</option>
                    {pacientesFiltrados.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </option>
                    ))}
                  </select>
                </label>
              </>
            }
          />
        </section>

        {loading ? (
          <section className="supervisao-panel">
            <p>Carregando base histórica...</p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Acompanhamentos"
                value={metricas.registros}
                detail="registros no filtro"
              />
              <CardIndicador
                label="Casos Clínicos"
                value={metricas.pacientes}
                detail="pacientes avaliados"
              />
              <CardIndicador
                label="Evolução Média"
                value={formatPercent(metricas.evolucao)}
                detail="score clínico geral"
              />
              <CardIndicador
                label="Planos Abertos"
                value={metricas.planosAbertos}
                detail="ações pendentes"
              />
            </section>

            <HistoricoSnapshot items={lancamentosFiltrados} />

            <section className="bento-grid dashboard-lower">
              <div className="bento-col bento-6">
                <div className="supervisao-panel supervisao-historico-card-pareado">
                  <div className="supervisao-section-title">
                    <h2>Comparativo: Início x Atual</h2>
                    <span>Progressão do quadro clínico</span>
                  </div>
                  <HistoricoComparativo items={lancamentosFiltrados} />
                </div>
              </div>

              <div className="bento-col bento-6">
                <div className="supervisao-panel supervisao-historico-card-pareado">
                  <div className="supervisao-section-title">
                    <h2>Último Registro</h2>
                    <span>Anotação mais recente no filtro</span>
                  </div>

                  {ultimoLancamento ? (
                    <article className="supervisao-last-note supervisao-last-note-compact">
                      <div>
                        <strong>{ultimoLancamento.pacienteNome || "Paciente/caso"}</strong>
                        <span>
                          {ultimoLancamento.terapeutaNome || "Terapeuta"} ·{" "}
                          {ultimoLancamento.clinicaNome || "Clínica"}
                        </span>

                        <p>
                          {truncateText(
                            getResumoLancamento(ultimoLancamento),
                            180,
                            "Sem observação registrada."
                          )}
                        </p>
                      </div>

                      <dl>
                        <div>
                          <dt>Status do plano</dt>
                          <dd>{ultimoLancamento.statusPlano || "-"}</dd>
                        </div>
                        <div>
                          <dt>Prazo</dt>
                          {/* FORMATAÇÃO APLICADA AQUI TAMBÉM */}
                          <dd>{ultimoLancamento.prazo ? formatarDataBR(ultimoLancamento.prazo) : "-"}</dd>
                        </div>
                        <div>
                          <dt>Semana</dt>
                          <dd>{periodLabel(ultimoLancamento)}</dd>
                        </div>
                      </dl>

                      <div className="supervisao-last-note-actions">
                        <button
                          type="button"
                          className="supervisao-mini-action"
                          onClick={() => setDetalheAberto(ultimoLancamento)}
                        >
                          Detalhar intervenção
                        </button>
                      </div>
                    </article>
                  ) : (
                    <p className="supervisao-empty" style={{ margin: 'auto' }}>
                      Nenhum registro encontrado.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="supervisao-panel dashboard-lower">
              <div className="supervisao-section-title" style={{ marginBottom: '20px' }}>
                <h2>Linha do Tempo Semanal</h2>
                <span style={{ color: 'var(--sup-muted)', fontSize: '0.9rem' }}>Ordem cronológica decrescente</span>
              </div>

              <TimelineLancamentosResumida
                items={lancamentosFiltrados}
                onVerDetalhes={setDetalheAberto}
              />
            </section>
          </>
        )}
      </LayoutSupervisao>

      <ModalDetalheLancamento
        item={detalheAberto}
        onFechar={() => setDetalheAberto(null)}
      />
    </>
  );
}