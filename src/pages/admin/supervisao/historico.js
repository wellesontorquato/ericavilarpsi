import Head from "next/head";
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
import TextoLimitado, {
  ModalTextoCompleto,
} from "@/components/supervisao/TextoLimitado";
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

function TimelineLancamentosComModal({ items = [], onAbrirTexto }) {
  const timeline = useMemo(() => sortByPeriodDesc(items), [items]);

  if (!timeline.length) {
    return (
      <p className="supervisao-empty">
        Nenhum lançamento semanal encontrado para o filtro selecionado.
      </p>
    );
  }

  return (
    <div className="supervisao-timeline">
      {timeline.map((item, index) => (
        <article
          key={item.id || `${item.ano}-${item.mes}-${item.semana}-${index}`}
          className="supervisao-timeline-item"
        >
          <div className="supervisao-timeline-marker">
            <span>{index + 1}</span>
          </div>

          <div className="supervisao-timeline-card">
            <div className="supervisao-timeline-head">
              <div>
                <span className="supervisao-kicker">
                  {mesNome(item.mes)} · {item.ano} · Semana {item.semana}
                </span>

                <h3>{safeText(item.pacienteNome, "Paciente/caso")}</h3>

                <p>
                  {safeText(item.terapeutaNome, "Terapeuta")} ·{" "}
                  {safeText(item.clinicaNome, "Clínica")}
                </p>
              </div>

              <div className="supervisao-timeline-scores">
                <strong>{formatDecimal(competenciaMedia(item))}</strong>
                <span>competência</span>
              </div>
            </div>

            <div className="supervisao-timeline-metrics">
              <div>
                <span>Evolução</span>
                <strong>{formatPercent(evolucaoMedia(item))}</strong>
              </div>

              <div>
                <span>Adesão</span>
                <strong>{formatPercent(item.adesaoTarefas || 0)}</strong>
              </div>

              <div>
                <span>Sintomas</span>
                <strong>{safeText(item.intensidadeSintomas)}</strong>
              </div>

              <div>
                <span>Status do plano</span>
                <strong>{safeText(item.statusPlano)}</strong>
              </div>
            </div>

            <div className="supervisao-timeline-textos">
              <TextoLimitado
                label="Ponto forte"
                value={item.pontoForte}
                limite={110}
                onAbrir={onAbrirTexto}
              />

              <TextoLimitado
                label="Ponto a desenvolver"
                value={item.pontoDesenvolver}
                limite={110}
                onAbrir={onAbrirTexto}
              />

              <TextoLimitado
                label="Plano de ação"
                value={item.planoAcao}
                limite={110}
                onAbrir={onAbrirTexto}
              />

              <TextoLimitado
                label="Recomendação"
                value={item.recomendacao}
                limite={120}
                onAbrir={onAbrirTexto}
              />

              <TextoLimitado
                label="Observação"
                value={item.observacao}
                limite={120}
                onAbrir={onAbrirTexto}
              />
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [textoAberto, setTextoAberto] = useState(null);

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
      terapeutas: new Set(
        lancamentosFiltrados.map((item) => item.terapeutaId).filter(Boolean)
      ).size,
      competencia: average(lancamentosFiltrados.map(competenciaMedia)),
      evolucao: average(lancamentosFiltrados.map(evolucaoMedia)),
      planosAbertos: lancamentosFiltrados.filter(isPlanoAberto).length,
    };
  }, [lancamentosFiltrados]);

  const tituloContexto = useMemo(() => {
    if (filters.pacienteId) {
      return selectedName(pacientes, filters.pacienteId, "Paciente selecionado");
    }

    if (filters.terapeutaId) {
      return selectedName(
        terapeutas,
        filters.terapeutaId,
        "Terapeuta selecionado"
      );
    }

    if (filters.clinicaId) {
      return selectedName(clinicas, filters.clinicaId, "Clínica selecionada");
    }

    return "Histórico geral da supervisão";
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
        title="Histórico clínico"
        description="Linha do tempo dos lançamentos semanais, comparativo início x atual e leitura evolutiva por clínica, terapeuta ou paciente."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <section className="supervisao-dashboard-hero history-hero">
          <div>
            <span className="supervisao-kicker">Linha do tempo</span>
            <h2>{tituloContexto}</h2>
            <p>
              {subtituloContexto} · use os filtros para transformar o histórico
              em leitura por clínica, terapeuta ou paciente.
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
                    onChange={(event) =>
                      updateFilter("clinicaId", event.target.value)
                    }
                  >
                    <option value="">Todas</option>
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
                    onChange={(event) =>
                      updateFilter("terapeutaId", event.target.value)
                    }
                  >
                    <option value="">Todos</option>
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
                    onChange={(event) =>
                      updateFilter("pacienteId", event.target.value)
                    }
                  >
                    <option value="">Todos</option>
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
            <p>Carregando histórico...</p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Registros"
                value={metricas.registros}
                detail="lançamentos no filtro"
              />

              <CardIndicador
                label="Pacientes"
                value={metricas.pacientes}
                detail="casos acompanhados"
              />

              <CardIndicador
                label="Terapeutas"
                value={metricas.terapeutas}
                detail="com atuação no filtro"
              />

              <CardIndicador
                label="Competência"
                value={formatDecimal(metricas.competencia)}
                detail="média técnica"
              />

              <CardIndicador
                label="Evolução"
                value={formatPercent(metricas.evolucao)}
                detail="score clínico"
              />

              <CardIndicador
                label="Planos abertos"
                value={metricas.planosAbertos}
                detail="ações pendentes"
              />

              <CardIndicador
                label="Última semana"
                value={ultimoLancamento ? `S${ultimoLancamento.semana}` : "-"}
                detail={
                  ultimoLancamento
                    ? `${mesNome(ultimoLancamento.mes)} · ${ultimoLancamento.ano}`
                    : "sem registro"
                }
              />

              <CardIndicador
                label="Último paciente"
                value={ultimoLancamento?.pacienteNome || "-"}
                detail="registro mais recente"
              />
            </section>

            <HistoricoSnapshot items={lancamentosFiltrados} />

            <div className="supervisao-historico-cards-pareados dashboard-lower">
              <section className="supervisao-panel supervisao-historico-card-pareado">
                <div className="supervisao-section-title">
                  <h2>Comparativo início x atual</h2>
                  <span>{lancamentosFiltrados.length} registro(s)</span>
                </div>

                <HistoricoComparativo items={lancamentosFiltrados} />
              </section>

              <section className="supervisao-panel supervisao-historico-card-pareado">
                <div className="supervisao-section-title">
                  <h2>Último acompanhamento</h2>
                  <span>{ultimoLancamento ? "mais recente" : "sem dados"}</span>
                </div>

                {ultimoLancamento ? (
                  <article className="supervisao-last-note">
                    <strong>
                      {ultimoLancamento.pacienteNome || "Paciente/caso"}
                    </strong>

                    <span>
                      {ultimoLancamento.terapeutaNome || "Terapeuta"} ·{" "}
                      {ultimoLancamento.clinicaNome || "Clínica"}
                    </span>

                    <div className="supervisao-historico-textos">
                      <TextoLimitado
                        label="Recomendação"
                        value={ultimoLancamento.recomendacao}
                        limite={140}
                        onAbrir={setTextoAberto}
                      />

                      <TextoLimitado
                        label="Ponto forte"
                        value={ultimoLancamento.pontoForte}
                        limite={120}
                        onAbrir={setTextoAberto}
                      />

                      <TextoLimitado
                        label="Ponto a desenvolver"
                        value={ultimoLancamento.pontoDesenvolver}
                        limite={120}
                        onAbrir={setTextoAberto}
                      />

                      <TextoLimitado
                        label="Plano de ação"
                        value={ultimoLancamento.planoAcao}
                        limite={140}
                        onAbrir={setTextoAberto}
                      />

                      <TextoLimitado
                        label="Observação"
                        value={ultimoLancamento.observacao}
                        limite={140}
                        onAbrir={setTextoAberto}
                      />
                    </div>

                    <dl>
                      <div>
                        <dt>Status do plano</dt>
                        <dd>{ultimoLancamento.statusPlano || "-"}</dd>
                      </div>

                      <div>
                        <dt>Prazo</dt>
                        <dd>{ultimoLancamento.prazo || "-"}</dd>
                      </div>

                      <div>
                        <dt>Semana</dt>
                        <dd>
                          S{ultimoLancamento.semana} ·{" "}
                          {mesNome(ultimoLancamento.mes)} ·{" "}
                          {ultimoLancamento.ano}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ) : (
                  <p className="supervisao-empty">
                    Nenhum registro encontrado para o filtro selecionado.
                  </p>
                )}
              </section>
            </div>

            <section className="supervisao-panel dashboard-lower">
              <div className="supervisao-section-title">
                <h2>Linha do tempo semanal</h2>
                <span>{lancamentosFiltrados.length} lançamento(s)</span>
              </div>

              <TimelineLancamentosComModal
                items={lancamentosFiltrados}
                onAbrirTexto={setTextoAberto}
              />
            </section>
          </>
        )}
      </LayoutSupervisao>

      <ModalTextoCompleto
        conteudo={textoAberto}
        onFechar={() => setTextoAberto(null)}
      />
    </>
  );
}