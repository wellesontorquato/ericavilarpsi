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
  isNumericValue,
  mesNome,
} from "@/lib/supervisao/format";
import {
  competenciaMedia,
  competencyFields,
  countComputedMetrics,
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  isPlanoAberto,
  patientIndicatorFields,
  safeId,
  safeText,
  selectedName,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

const NOT_COMPUTED = "Não computado";

function queryValue(value) {
  if (Array.isArray(value)) {
    return value[0] || "";
  }

  return value || "";
}

function isArchived(item = {}) {
  return (
    item?.arquivado === true ||
    String(item?.statusRegistro || "").toLowerCase() === "arquivado"
  );
}

/**
 * Adiciona aos filtros entidades que existem apenas
 * nos lançamentos históricos.
 */
function mergeHistoricalEntities(
  items = [],
  lancamentos = [],
  getSnapshot
) {
  const entities = new Map();

  items.forEach((item) => {
    const id = safeId(item?.id);

    if (id) {
      entities.set(id, {
        ...item,
        historicoOnly: false,
      });
    }
  });

  lancamentos.forEach((lancamento) => {
    const snapshot = getSnapshot(lancamento);
    const id = safeId(snapshot?.id);

    if (!id || entities.has(id)) {
      return;
    }

    entities.set(id, {
      ...snapshot,
      id,
      nome: safeText(snapshot?.nome, "Registro histórico"),
      historicoOnly: true,
    });
  });

  return [...entities.values()].sort((a, b) =>
    safeText(a?.nome, "").localeCompare(
      safeText(b?.nome, ""),
      "pt-BR"
    )
  );
}

function getLatest(items = []) {
  return sortByPeriodDesc(items)[0] || null;
}

function truncateText(value, maxLength = 150, fallback = "-") {
  const text = safeText(value, fallback)
    .replace(/\s+/g, " ")
    .trim();

  if (!text || text === fallback) {
    return fallback;
  }

  if (text.length <= maxLength) {
    return text;
  }

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

function getStatusClass(status, archived = false) {
  if (archived) {
    return "neutral";
  }

  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("concl")) {
    return "done";
  }

  if (
    normalized.includes("atras") ||
    normalized.includes("venc")
  ) {
    return "danger";
  }

  if (normalized.includes("andamento")) {
    return "progress";
  }

  return "neutral";
}

function formatarDataBR(value) {
  if (!value) return "-";

  try {
    if (typeof value?.toDate === "function") {
      return value.toDate().toLocaleDateString("pt-BR");
    }

    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return value.toLocaleDateString("pt-BR");
    }

    const text = String(value).trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (match) {
      const [, year, month, day] = match;
      return `${day}/${month}/${year}`;
    }

    const parsed = new Date(text);

    return Number.isNaN(parsed.getTime())
      ? text || "-"
      : parsed.toLocaleDateString("pt-BR");
  } catch (error) {
    console.error(error);
    return "-";
  }
}

function periodLabel(item = {}) {
  return `${mesNome(item.mes)} · ${item.ano || "-"} · Semana ${
    item.semana || "-"
  }`;
}

function formatMetricPercent(value) {
  return formatPercent(value, 0, NOT_COMPUTED);
}

function formatMetricDecimal(value, fractionDigits = 1) {
  return formatDecimal(value, fractionDigits, NOT_COMPUTED);
}

function formatScale(value, max, fractionDigits = 1) {
  if (!isNumericValue(value)) {
    return NOT_COMPUTED;
  }

  return `${formatDecimal(value, fractionDigits)}/${max}`;
}

function ModalDetalheLancamento({ item, onFechar }) {
  if (!item) return null;

  const archived = isArchived(item);

  const competenciasComputadas = countComputedMetrics(
    item,
    competencyFields
  );

  const indicadoresComputados = countComputedMetrics(
    item,
    patientIndicatorFields
  );

  const textos = [
    ["Emoção a ser elaborada", item.emocaoElaborada],
    ["Ponto forte", item.pontoForte],
    ["Ponto a desenvolver", item.pontoDesenvolver],
    ["Recomendação", item.recomendacao],
    ["Plano de ação", item.planoAcao],
    ["Observação", item.observacao],
  ];

  return (
    <div
      className="supervisao-modal-backdrop"
      onClick={onFechar}
      role="presentation"
    >
      <div
        className="supervisao-modal supervisao-modal-large supervisao-detalhe-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="detalhe-lancamento-title"
      >
        <div className="supervisao-modal-header">
          <div>
            <span className="supervisao-kicker">
              {periodLabel(item)}
            </span>

            <h2 id="detalhe-lancamento-title">
              {safeText(item.pacienteNome, "Paciente/caso")}
            </h2>

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
              <span>Status do registro</span>
              <strong>{archived ? "Arquivado" : "Ativo"}</strong>
            </div>

            <div>
              <span>Status do plano</span>
              <strong>
                {safeText(item.statusPlano, "Sem status")}
              </strong>
            </div>

            <div>
              <span>Prazo</span>
              <strong>{formatarDataBR(item.prazo)}</strong>
            </div>

            <div>
              <span>Evolução</span>
              <strong>
                {formatMetricPercent(evolucaoMedia(item))}
              </strong>
              <small>
                {indicadoresComputados}/{patientIndicatorFields.length}{" "}
                indicadores
              </small>
            </div>

            <div>
              <span>Competência</span>
              <strong>
                {formatScale(competenciaMedia(item), 5)}
              </strong>
              <small>
                {competenciasComputadas}/{competencyFields.length}{" "}
                competências
              </small>
            </div>

            <div>
              <span>Adesão</span>
              <strong>{formatMetricPercent(item.adesaoTarefas)}</strong>
            </div>

            <div>
              <span>Aplicação das estratégias</span>
              <strong>
                {formatMetricPercent(item.aplicacaoEstrategias)}
              </strong>
            </div>

            <div>
              <span>Objetivos</span>
              <strong>
                {formatMetricPercent(item.evolucaoObjetivos)}
              </strong>
            </div>

            <div>
              <span>Qualidade do sono</span>
              <strong>{formatScale(item.qualidadeSono, 10)}</strong>
            </div>

            <div>
              <span>Intensidade dos sintomas</span>
              <strong>
                {formatScale(item.intensidadeSintomas, 10)}
              </strong>
            </div>

            <div>
              <span>Evitação social</span>
              <strong>{formatScale(item.evitacaoSocial, 10)}</strong>
            </div>

            <div>
              <span>Intensidade do comportamento</span>
              <strong>
                {formatScale(item.intensidadeComportamento, 10)}
              </strong>
            </div>

            <div>
              <span>Crises semanais</span>
              <strong>
                {formatMetricDecimal(item.crisesAnsiedade, 0)}
              </strong>
            </div>
          </div>

          <div className="supervisao-detalhe-textos">
            {textos.map(([label, value]) => (
              <section key={label}>
                <h3>{label}</h3>
                <p>{safeText(value, "Não informado")}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineLancamentosResumida({
  items = [],
  onVerDetalhes,
}) {
  const rows = useMemo(() => sortByPeriodDesc(items), [items]);

  if (!rows.length) {
    return (
      <p
        className="supervisao-empty"
        style={{
          textAlign: "center",
          padding: "40px",
        }}
      >
        Nenhum acompanhamento semanal encontrado para o filtro
        selecionado.
      </p>
    );
  }

  return (
    <div className="supervisao-history-timeline">
      {rows.map((item, index) => {
        const archived = isArchived(item);

        const competenciasComputadas = countComputedMetrics(
          item,
          competencyFields
        );

        const indicadoresComputados = countComputedMetrics(
          item,
          patientIndicatorFields
        );

        return (
          <article
            key={
              item.id ||
              `${item.ano}-${item.mes}-${item.semana}-${index}`
            }
          >
            <div
              className="supervisao-history-marker"
              aria-hidden="true"
            />

            <div className="supervisao-history-card supervisao-history-card-compact">
              <header>
                <div>
                  <span>{periodLabel(item)}</span>

                  <strong>
                    {safeText(item.pacienteNome, "Paciente/caso")}
                  </strong>

                  <small>
                    {safeText(item.terapeutaNome, "Terapeuta")}
                    {item.clinicaNome ? ` · ${item.clinicaNome}` : ""}
                  </small>
                </div>

                <i
                  className={`supervisao-status-pill ${getStatusClass(
                    item.statusPlano,
                    archived
                  )}`}
                >
                  {archived
                    ? "Registro arquivado"
                    : item.statusPlano || "Sem plano"}
                </i>
              </header>

              <div className="supervisao-history-metrics">
                <span>
                  Evolução {formatMetricPercent(evolucaoMedia(item))} (
                  {indicadoresComputados}/{patientIndicatorFields.length})
                </span>

                <span>
                  Competência {formatScale(competenciaMedia(item), 5)} (
                  {competenciasComputadas}/{competencyFields.length})
                </span>

                <span>
                  Adesão {formatMetricPercent(item.adesaoTarefas)}
                </span>

                <span>
                  Objetivos {formatMetricPercent(item.evolucaoObjetivos)}
                </span>

                <span>
                  Estratégias{" "}
                  {formatMetricPercent(item.aplicacaoEstrategias)}
                </span>

                <span>
                  Intensidade{" "}
                  {formatScale(item.intensidadeComportamento, 10)}
                </span>
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
        );
      })}
    </div>
  );
}

export default function HistoricoSupervisaoPage() {
  return (
    <AuthGuard>
      {({ user, access, onLogout }) => (
        <HistoricoContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function HistoricoContent({ user, access, onLogout }) {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [detalheAberto, setDetalheAberto] = useState(null);

  const [periodFilters, setPeriodFilters] = useState({
    ano: String(currentYear),
    mes: "",
    semana: "",
  });

  /*
   * Os filtros de entidade são derivados diretamente da URL.
   * Isso elimina a sincronização de router.query com setState
   * dentro de um useEffect.
   */
  const clinicaId = router.isReady
    ? queryValue(router.query.clinicaId)
    : "";

  const terapeutaId = router.isReady
    ? queryValue(router.query.terapeutaId)
    : "";

  const pacienteId = router.isReady
    ? queryValue(router.query.pacienteId)
    : "";

  const filters = useMemo(
    () => ({
      ...periodFilters,
      clinicaId,
      terapeutaId,
      pacienteId,
    }),
    [
      periodFilters,
      clinicaId,
      terapeutaId,
      pacienteId,
    ]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });

      try {
        const payload = await supervisaoRequest(user, "dashboard");

        if (!cancelled) {
          setData(payload);
        }
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setData(null);

          setMessage({
            type: "error",
            text:
              error.message ||
              "Não foi possível carregar o histórico.",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /*
   * Utiliza lancamentosHistorico para incluir também
   * registros arquivados.
   */
  const lancamentos = useMemo(
    () => data?.lancamentosHistorico || data?.lancamentos || [],
    [data]
  );

  const clinicas = useMemo(
    () =>
      mergeHistoricalEntities(
        data?.clinicas || [],
        lancamentos,
        (item) => ({
          id: item?.clinicaId,
          nome: item?.clinicaNome,
        })
      ),
    [data, lancamentos]
  );

  const terapeutas = useMemo(
    () =>
      mergeHistoricalEntities(
        data?.terapeutas || [],
        lancamentos,
        (item) => ({
          id: item?.terapeutaId,
          nome: item?.terapeutaNome,
          clinicaId: item?.clinicaId,
        })
      ),
    [data, lancamentos]
  );

  const pacientes = useMemo(
    () =>
      mergeHistoricalEntities(
        data?.pacientes || [],
        lancamentos,
        (item) => ({
          id: item?.pacienteId,
          nome: item?.pacienteNome,
          clinicaId: item?.clinicaId,
          terapeutaId: item?.terapeutaId,
        })
      ),
    [data, lancamentos]
  );

  const terapeutasFiltrados = useMemo(() => {
    if (!filters.clinicaId) {
      return terapeutas;
    }

    return terapeutas.filter(
      (item) =>
        safeId(item.clinicaId) === safeId(filters.clinicaId)
    );
  }, [terapeutas, filters.clinicaId]);

  const pacientesFiltrados = useMemo(
    () =>
      pacientes.filter((item) => {
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
      }),
    [
      pacientes,
      filters.clinicaId,
      filters.terapeutaId,
    ]
  );

  const lancamentosFiltrados = useMemo(
    () => filterLancamentos(lancamentos, filters),
    [lancamentos, filters]
  );

  const ultimoLancamento = useMemo(
    () => getLatest(lancamentosFiltrados),
    [lancamentosFiltrados]
  );

  const metricas = useMemo(() => {
    const scores = lancamentosFiltrados
      .map(evolucaoMedia)
      .filter(isNumericValue);

    return {
      registros: lancamentosFiltrados.length,

      registrosArquivados:
        lancamentosFiltrados.filter(isArchived).length,

      registrosComEvolucao: scores.length,

      pacientes: new Set(
        lancamentosFiltrados
          .map((item) => item.pacienteId)
          .filter(Boolean)
      ).size,

      evolucao: average(scores),

      planosAbertos: lancamentosFiltrados.filter(
        (item) => !isArchived(item) && isPlanoAberto(item)
      ).length,
    };
  }, [lancamentosFiltrados]);

  const tituloContexto = useMemo(() => {
    if (filters.pacienteId) {
      return selectedName(
        pacientes,
        filters.pacienteId,
        "Paciente"
      );
    }

    if (filters.terapeutaId) {
      return selectedName(
        terapeutas,
        filters.terapeutaId,
        "Terapeuta"
      );
    }

    if (filters.clinicaId) {
      return selectedName(
        clinicas,
        filters.clinicaId,
        "Clínica"
      );
    }

    return "Histórico Geral";
  }, [
    filters.pacienteId,
    filters.terapeutaId,
    filters.clinicaId,
    pacientes,
    terapeutas,
    clinicas,
  ]);

  const subtituloContexto = useMemo(() => {
    const periodo = [
      filters.mes ? mesNome(filters.mes) : "Todos os meses",
      filters.ano || "Todos os anos",
    ]
      .filter(Boolean)
      .join(" · ");

    return `${periodo}${
      filters.semana ? ` · Semana ${filters.semana}` : ""
    }`;
  }, [filters.ano, filters.mes, filters.semana]);

  function updateEntityFilter(name, value) {
    const nextQuery = { ...router.query };

    if (value) {
      nextQuery[name] = value;
    } else {
      delete nextQuery[name];
    }

    if (name === "clinicaId") {
      delete nextQuery.terapeutaId;
      delete nextQuery.pacienteId;
    }

    if (name === "terapeutaId") {
      delete nextQuery.pacienteId;
    }

    setDetalheAberto(null);

    void router.replace(
      {
        pathname: router.pathname,
        query: nextQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  }

  return (
    <>
      <Head>
        <title>Histórico clínico | Supervisão TCC</title>
      </Head>

      <LayoutSupervisao
        title="Histórico Clínico"
        description="Consulte lançamentos ativos e arquivados dentro das clínicas e casos sob sua responsabilidade."
        user={user}
        access={access}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero history-hero">
          <div>
            <span className="supervisao-kicker">
              Evolução e linha do tempo
            </span>

            <h2>{tituloContexto}</h2>

            <p>
              {subtituloContexto} · Registros ativos e arquivados são
              preservados nesta consulta.
            </p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setPeriodFilters}
            lancamentos={lancamentos}
            extraFilters={
              <>
                <label>
                  <span>Clínica</span>

                  <select
                    value={filters.clinicaId}
                    onChange={(event) =>
                      updateEntityFilter(
                        "clinicaId",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Todas as clínicas</option>

                    {clinicas.map((clinica) => (
                      <option key={clinica.id} value={clinica.id}>
                        {clinica.nome}
                        {clinica.historicoOnly
                          ? " (histórico)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Terapeuta</span>

                  <select
                    value={filters.terapeutaId}
                    onChange={(event) =>
                      updateEntityFilter(
                        "terapeutaId",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Todos os terapeutas</option>

                    {terapeutasFiltrados.map((terapeuta) => (
                      <option
                        key={terapeuta.id}
                        value={terapeuta.id}
                      >
                        {terapeuta.nome}
                        {terapeuta.historicoOnly
                          ? " (histórico)"
                          : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span>Paciente</span>

                  <select
                    value={filters.pacienteId}
                    onChange={(event) =>
                      updateEntityFilter(
                        "pacienteId",
                        event.target.value
                      )
                    }
                  >
                    <option value="">Todos os pacientes</option>

                    {pacientesFiltrados.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                        {paciente.historicoOnly
                          ? " (histórico)"
                          : ""}
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
        ) : !data ? (
          <section className="supervisao-panel">
            <p className="supervisao-empty">
              Não foi possível carregar a base histórica.
            </p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Acompanhamentos"
                value={metricas.registros}
                detail={`${metricas.registrosArquivados} registro(s) arquivado(s)`}
              />

              <CardIndicador
                label="Casos Clínicos"
                value={metricas.pacientes}
                detail="pacientes/casos presentes no filtro"
              />

              <CardIndicador
                label="Evolução Média"
                value={formatMetricPercent(metricas.evolucao)}
                detail={
                  metricas.registrosComEvolucao
                    ? `${metricas.registrosComEvolucao} registro(s) com score calculável`
                    : "nenhum indicador de evolução computado"
                }
              />

              <CardIndicador
                label="Planos Abertos"
                value={metricas.planosAbertos}
                detail="ações ativas pendentes"
              />
            </section>

            {filters.pacienteId ? (
              <HistoricoSnapshot items={lancamentosFiltrados} />
            ) : (
              <section className="supervisao-panel">
                <p className="supervisao-empty">
                  Selecione um paciente para exibir o resumo
                  comparativo. Não comparamos lançamentos de pacientes
                  diferentes.
                </p>
              </section>
            )}

            <section className="bento-grid dashboard-lower">
              <div className="bento-col bento-6">
                <div className="supervisao-panel supervisao-historico-card-pareado">
                  <div className="supervisao-section-title">
                    <h2>Comparativo: início × atual</h2>

                    <span>
                      somente métricas computadas nos dois períodos
                    </span>
                  </div>

                  {filters.pacienteId ? (
                    <HistoricoComparativo
                      items={lancamentosFiltrados}
                    />
                  ) : (
                    <p className="supervisao-empty">
                      Selecione um paciente para montar um comparativo
                      clínico válido.
                    </p>
                  )}
                </div>
              </div>

              <div className="bento-col bento-6">
                <div className="supervisao-panel supervisao-historico-card-pareado">
                  <div className="supervisao-section-title">
                    <h2>Último registro</h2>
                    <span>Anotação mais recente no filtro</span>
                  </div>

                  {ultimoLancamento ? (
                    <article className="supervisao-last-note supervisao-last-note-compact">
                      <div>
                        <strong>
                          {ultimoLancamento.pacienteNome ||
                            "Paciente/caso"}
                        </strong>

                        <span>
                          {ultimoLancamento.terapeutaNome ||
                            "Terapeuta"}{" "}
                          ·{" "}
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
                          <dt>Status do registro</dt>
                          <dd>
                            {isArchived(ultimoLancamento)
                              ? "Arquivado"
                              : "Ativo"}
                          </dd>
                        </div>

                        <div>
                          <dt>Status do plano</dt>
                          <dd>
                            {ultimoLancamento.statusPlano || "-"}
                          </dd>
                        </div>

                        <div>
                          <dt>Prazo</dt>
                          <dd>
                            {formatarDataBR(ultimoLancamento.prazo)}
                          </dd>
                        </div>

                        <div>
                          <dt>Período</dt>
                          <dd>{periodLabel(ultimoLancamento)}</dd>
                        </div>
                      </dl>

                      <div className="supervisao-last-note-actions">
                        <button
                          type="button"
                          className="supervisao-mini-action"
                          onClick={() =>
                            setDetalheAberto(ultimoLancamento)
                          }
                        >
                          Detalhar intervenção
                        </button>
                      </div>
                    </article>
                  ) : (
                    <p
                      className="supervisao-empty"
                      style={{ margin: "auto" }}
                    >
                      Nenhum registro encontrado.
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="supervisao-panel dashboard-lower">
              <div
                className="supervisao-section-title"
                style={{ marginBottom: "20px" }}
              >
                <h2>Linha do tempo semanal</h2>

                <span
                  style={{
                    color: "var(--sup-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  Ordem cronológica decrescente
                </span>
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