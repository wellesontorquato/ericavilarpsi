import Link from "next/link";
import { formatDecimal, formatPercent, mesNome } from "@/lib/supervisao/format";
import {
  competenciaMedia,
  evolucaoMedia,
  normalizedPercent,
  sortByPeriodDesc,
} from "@/lib/supervisao/dashboardUtils";

function safeNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function periodLabel(item = {}) {
  return `${mesNome(item.mes)} de ${item.ano || "-"} · Semana ${item.semana || "-"}`;
}

function getResumoTexto(item = {}) {
  return (
    item.recomendacao ||
    item.planoAcao ||
    item.observacao ||
    item.pontoDesenvolver ||
    "Sem observação registrada para esta semana."
  );
}

function getStatusClass(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("concl")) return "done";
  if (normalized.includes("atras") || normalized.includes("venc")) return "danger";
  if (normalized.includes("andamento")) return "progress";

  return "neutral";
}

export function TimelineLancamentos({
  items = [],
  emptyText = "Nenhum lançamento encontrado para o filtro selecionado.",
  limit,
  showLink = false,
}) {
  const rows = sortByPeriodDesc(items).slice(0, limit || items.length);

  if (!rows.length) {
    return <p className="supervisao-empty">{emptyText}</p>;
  }

  return (
    <div className="supervisao-history-timeline">
      {rows.map((item) => (
        <article key={item.id}>
          <div className="supervisao-history-marker" aria-hidden="true" />

          <div className="supervisao-history-card">
            <header>
              <div>
                <span>{periodLabel(item)}</span>
                <strong>{item.pacienteNome || "Paciente/caso não informado"}</strong>
                <small>
                  {item.terapeutaNome || "Terapeuta não informado"}
                  {item.clinicaNome ? ` · ${item.clinicaNome}` : ""}
                </small>
              </div>

              <i className={`supervisao-status-pill ${getStatusClass(item.statusPlano)}`}>
                {item.statusPlano || "Sem plano"}
              </i>
            </header>

            <div className="supervisao-history-metrics">
              <span>Evolução {formatPercent(evolucaoMedia(item))}</span>
              <span>Competência {formatDecimal(competenciaMedia(item))}/5</span>
              <span>Adesão {formatPercent(item.adesaoTarefas)}</span>
              <span>Objetivos {formatPercent(item.evolucaoObjetivos)}</span>
            </div>

            <p>{getResumoTexto(item)}</p>

            {(item.pontoForte || item.pontoDesenvolver || item.planoAcao) && (
              <dl>
                {item.pontoForte && (
                  <div>
                    <dt>Ponto forte</dt>
                    <dd>{item.pontoForte}</dd>
                  </div>
                )}
                {item.pontoDesenvolver && (
                  <div>
                    <dt>Ponto a desenvolver</dt>
                    <dd>{item.pontoDesenvolver}</dd>
                  </div>
                )}
                {item.planoAcao && (
                  <div>
                    <dt>Plano de ação</dt>
                    <dd>{item.planoAcao}</dd>
                  </div>
                )}
              </dl>
            )}

            {showLink && item.pacienteId && (
              <Link href={`/admin/supervisao/dashboard-pacientes?pacienteId=${item.pacienteId}`}>
                Ver dashboard do paciente
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function getFirstAndLast(items = []) {
  const ordered = sortByPeriodDesc(items).reverse();
  return {
    first: ordered[0],
    last: ordered[ordered.length - 1],
  };
}

function trendText(firstValue, lastValue, invert = false, suffix = "") {
  const first = safeNumber(firstValue);
  const last = safeNumber(lastValue);
  const diff = invert ? first - last : last - first;

  if (!first && !last) return "Sem base";
  if (diff > 0) return `Melhorou ${formatDecimal(diff)}${suffix}`;
  if (diff < 0) return `Piorou ${formatDecimal(Math.abs(diff))}${suffix}`;
  return "Estável";
}

function trendClass(firstValue, lastValue, invert = false) {
  const first = safeNumber(firstValue);
  const last = safeNumber(lastValue);
  const diff = invert ? first - last : last - first;

  if (diff > 0) return "positive";
  if (diff < 0) return "negative";
  return "neutral";
}

export function HistoricoComparativo({ items = [] }) {
  const { first, last } = getFirstAndLast(items);

  if (!first || !last) {
    return <p className="supervisao-empty">É necessário ter pelo menos um lançamento para montar o comparativo.</p>;
  }

  const rows = [
    {
      id: "evolucao",
      label: "Evolução geral",
      inicio: evolucaoMedia(first),
      atual: evolucaoMedia(last),
      formatter: formatPercent,
      trend: trendText(evolucaoMedia(first), evolucaoMedia(last), false, " p.p."),
      status: trendClass(evolucaoMedia(first), evolucaoMedia(last)),
    },
    {
      id: "adesao",
      label: "Adesão às tarefas",
      inicio: safeNumber(first.adesaoTarefas),
      atual: safeNumber(last.adesaoTarefas),
      formatter: formatPercent,
      trend: trendText(first.adesaoTarefas, last.adesaoTarefas, false, " p.p."),
      status: trendClass(first.adesaoTarefas, last.adesaoTarefas),
    },
    {
      id: "objetivos",
      label: "Objetivos terapêuticos",
      inicio: safeNumber(first.evolucaoObjetivos),
      atual: safeNumber(last.evolucaoObjetivos),
      formatter: formatPercent,
      trend: trendText(first.evolucaoObjetivos, last.evolucaoObjetivos, false, " p.p."),
      status: trendClass(first.evolucaoObjetivos, last.evolucaoObjetivos),
    },
    {
      id: "sono",
      label: "Qualidade do sono",
      inicio: safeNumber(first.qualidadeSono),
      atual: safeNumber(last.qualidadeSono),
      formatter: (value) => `${formatDecimal(value)}/10`,
      trend: trendText(first.qualidadeSono, last.qualidadeSono),
      status: trendClass(first.qualidadeSono, last.qualidadeSono),
    },
    {
      id: "sintomas",
      label: "Intensidade dos sintomas",
      inicio: safeNumber(first.intensidadeSintomas),
      atual: safeNumber(last.intensidadeSintomas),
      formatter: (value) => `${formatDecimal(value)}/10`,
      trend: trendText(first.intensidadeSintomas, last.intensidadeSintomas, true),
      status: trendClass(first.intensidadeSintomas, last.intensidadeSintomas, true),
    },
    {
      id: "evitacao",
      label: "Evitação social",
      inicio: safeNumber(first.evitacaoSocial),
      atual: safeNumber(last.evitacaoSocial),
      formatter: (value) => `${formatDecimal(value)}/10`,
      trend: trendText(first.evitacaoSocial, last.evitacaoSocial, true),
      status: trendClass(first.evitacaoSocial, last.evitacaoSocial, true),
    },
    {
      id: "crises",
      label: "Crises por semana",
      inicio: safeNumber(first.crisesAnsiedade),
      atual: safeNumber(last.crisesAnsiedade),
      formatter: formatDecimal,
      trend: trendText(first.crisesAnsiedade, last.crisesAnsiedade, true),
      status: trendClass(first.crisesAnsiedade, last.crisesAnsiedade, true),
    },
  ];

  return (
    <div className="supervisao-comparison-card">
      <header>
        <div>
          <span>Início</span>
          <strong>{periodLabel(first)}</strong>
        </div>
        <div>
          <span>Atual</span>
          <strong>{periodLabel(last)}</strong>
        </div>
      </header>

      <div className="supervisao-comparison-grid">
        {rows.map((row) => (
          <article key={row.id}>
            <span>{row.label}</span>
            <strong>{row.formatter(row.inicio)} → {row.formatter(row.atual)}</strong>
            <small className={row.status}>{row.trend}</small>
          </article>
        ))}
      </div>
    </div>
  );
}

export function HistoricoSnapshot({ items = [] }) {
  const { first, last } = getFirstAndLast(items);

  if (!last) {
    return null;
  }

  const scoreAtual = evolucaoMedia(last);
  const scoreInicial = first ? evolucaoMedia(first) : 0;
  const ganho = scoreAtual - scoreInicial;

  return (
    <section className="supervisao-history-snapshot">
      <article>
        <span>Último score clínico</span>
        <strong>{formatPercent(scoreAtual)}</strong>
        <small className={ganho >= 0 ? "positive" : "negative"}>
          {ganho >= 0 ? "+" : "-"}{formatDecimal(Math.abs(ganho))} p.p. desde o início
        </small>
      </article>
      <article>
        <span>Última adesão</span>
        <strong>{formatPercent(last.adesaoTarefas)}</strong>
        <small>{periodLabel(last)}</small>
      </article>
      <article>
        <span>Plano atual</span>
        <strong>{last.statusPlano || "Sem status"}</strong>
        <small>{last.prazo ? `Prazo: ${last.prazo}` : "Sem prazo informado"}</small>
      </article>
      <article>
        <span>Sintomas atuais</span>
        <strong>{formatPercent(normalizedPercent(last.intensidadeSintomas, 10, true))}</strong>
        <small>quanto maior, melhor</small>
      </article>
    </section>
  );
}
