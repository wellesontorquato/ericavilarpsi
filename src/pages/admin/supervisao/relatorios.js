import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { supervisaoRequest } from "@/lib/supervisao/api";
import {
  formatDecimal,
  formatPercent,
  isNumericValue,
  mesNome,
} from "@/lib/supervisao/format";
import {
  currentYear,
  filterLancamentos,
  safeId,
  safeText,
  selectedName,
} from "@/lib/supervisao/dashboardUtils";
import { buildAlertasSupervisao } from "@/lib/supervisao/alertas";
import {
  REPORT_TYPES,
  alertasColumns,
  buildAlertasRows,
  buildClinicasRows,
  buildLancamentosRows,
  buildPacientesRows,
  buildReportAnalysis,
  buildReportSheets,
  buildResumoRows,
  buildTerapeutasRows,
  exportCsv,
  exportExcelWorkbook,
  lancamentosColumns,
  resumoColumns,
} from "@/lib/supervisao/relatorios";

const NOT_COMPUTED = "Não computado";
const MAX_REPORT_OBSERVATION_LENGTH = 2000;

const INITIAL_FILTERS = {
  ano: String(currentYear),
  mes: "",
  semana: "",
  clinicaId: "",
  terapeutaId: "",
  pacienteId: "",
};

function getContextTitle({
  filters,
  clinicas,
  terapeutas,
  pacientes,
}) {
  if (filters.pacienteId) {
    return selectedName(
      pacientes,
      filters.pacienteId,
      "Paciente selecionado"
    );
  }

  if (filters.terapeutaId) {
    return selectedName(
      terapeutas,
      filters.terapeutaId,
      "Terapeuta selecionado"
    );
  }

  if (filters.clinicaId) {
    return selectedName(
      clinicas,
      filters.clinicaId,
      "Clínica selecionada"
    );
  }

  return "Visão global da operação";
}

function getPeriodText(filters = {}) {
  const parts = [];

  if (filters.semana) {
    parts.push(`Semana ${filters.semana}`);
  }

  parts.push(
    filters.mes
      ? mesNome(filters.mes)
      : "Todos os meses"
  );

  parts.push(
    filters.ano || "Todos os anos"
  );

  return parts.join(" · ");
}

function formatarDataBR(value) {
  if (!value) return "-";

  try {
    if (typeof value?.toDate === "function") {
      return value
        .toDate()
        .toLocaleDateString("pt-BR");
    }

    if (
      value instanceof Date &&
      !Number.isNaN(value.getTime())
    ) {
      return value.toLocaleDateString("pt-BR");
    }

    const text = String(value).trim();
    const isoMatch = text.match(
      /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }

    const parsed = new Date(text);

    return Number.isNaN(parsed.getTime())
      ? text || "-"
      : parsed.toLocaleDateString("pt-BR");
  } catch {
    return "-";
  }
}

function buildReportFileName(
  contextTitle,
  filters,
  suffix
) {
  return `Supervisao_TCC_${contextTitle}_${getPeriodText(
    filters
  )}_${suffix}`;
}

function formatMetricPercent(value) {
  return formatPercent(
    value,
    0,
    NOT_COMPUTED
  );
}

function formatMetricDecimal(
  value,
  fractionDigits = 1
) {
  return formatDecimal(
    value,
    fractionDigits,
    NOT_COMPUTED
  );
}

function clampPercent(value) {
  if (!isNumericValue(value)) {
    return null;
  }

  return Math.max(
    0,
    Math.min(100, Number(value))
  );
}

function hasText(value) {
  if (typeof value !== "string") {
    return false;
  }

  const normalized = value.trim();

  return Boolean(
    normalized &&
    normalized !== "-"
  );
}

function PreviewTable({
  title,
  columns,
  rows,
  limit = 5,
}) {
  const previewRows = rows.slice(0, limit);

  return (
    <section
      className="supervisao-report-preview-card h-full"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          gap: "16px",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1.2rem",
            color: "var(--sup-text)",
          }}
        >
          {title}
        </h2>

        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--sup-muted)",
            fontWeight: 600,
          }}
        >
          {rows.length} registro(s)
        </span>
      </div>

      {previewRows.length ? (
        <div
          className="supervisao-report-preview-table-wrap scroll-interno"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
          }}
        >
          <table
            className="supervisao-report-preview-table"
            style={{
              border: "1px solid var(--sup-line)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr>
                {columns
                  .slice(0, 4)
                  .map((column) => (
                    <th key={column.key}>
                      {column.label}
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {previewRows.map(
                (row, rowIndex) => (
                  <tr
                    key={
                      row.id ||
                      rowIndex
                    }
                  >
                    {columns
                      .slice(0, 4)
                      .map((column) => (
                        <td key={column.key}>
                          {safeText(
                            row[column.key],
                            NOT_COMPUTED
                          )}
                        </td>
                      ))}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor:
              "rgba(255,255,255,0.4)",
            borderRadius: "16px",
            border:
              "1px dashed var(--sup-line)",
          }}
        >
          <p
            className="supervisao-empty"
            style={{
              background: "none",
              border: "none",
            }}
          >
            Sem dados para este recorte.
          </p>
        </div>
      )}
    </section>
  );
}

function PrintBar({
  item,
  color,
  formatter = formatMetricPercent,
}) {
  const width = clampPercent(
    item?.percent
  );

  return (
    <div className="print-bar-row">
      <span className="print-bar-label">
        {item.label}
      </span>

      <div className="print-bar-track">
        {width !== null && (
          <div
            className="print-bar-fill"
            style={{
              width: `${width}%`,
              background: color,
            }}
          />
        )}
      </div>

      <span className="print-bar-value">
        {formatter(item.value, item)}
      </span>
    </div>
  );
}

function PrintEmpty({ children }) {
  return (
    <p className="supervisao-empty">
      {children}
    </p>
  );
}

function TechnicalScoreExplanation({
  explanation,
  contextTitle,
}) {
  if (!explanation) {
    return null;
  }

  const competencias =
    explanation.competencias || [];

  const pontosFortes =
    explanation.pontosFortes || [];

  const pontosDesenvolvimento =
    explanation.pontosDesenvolvimento ||
    [];

  return (
    <div className="print-technical-explanation">
      <div className="print-technical-explanation-heading">
        <div>
          <span>
            Transparência do cálculo
          </span>

          <h4>
            Como a média técnica foi
            formada
          </h4>
        </div>

        <strong>
          {explanation.hasData
            ? `${formatMetricDecimal(
                explanation.notaFinal
              )}/5`
            : NOT_COMPUTED}
        </strong>
      </div>

      <p className="print-technical-context">
        Resultado referente a{" "}
        <strong>{contextTitle}</strong>.
        A nota não inclui campos sem
        avaliação ou marcados como
        &quot;Não computar&quot;.
      </p>

      <div className="print-technical-narrative">
        <p>
          {explanation.calculation}
        </p>

        <p>{explanation.summary}</p>
      </div>

      {explanation.hasData && (
        <>
          <div className="print-technical-facts">
            <div>
              <span>
                Supervisões consideradas
              </span>

              <strong>
                {
                  explanation.supervisoesConsideradas
                }
              </strong>

              <small>
                de{" "}
                {
                  explanation.supervisoesTotais
                }{" "}
                no recorte
              </small>
            </div>

            <div>
              <span>
                Campos computados
              </span>

              <strong>
                {
                  explanation.competenciasComputadas
                }
              </strong>

              <small>
                de{" "}
                {
                  explanation.competenciasPossiveis
                }{" "}
                possíveis
              </small>
            </div>

            <div>
              <span>
                Cobertura da avaliação
              </span>

              <strong>
                {formatMetricPercent(
                  explanation.cobertura
                )}
              </strong>

              <small>
                proporção efetivamente
                avaliada
              </small>
            </div>

            <div>
              <span>
                Campos excluídos
              </span>

              <strong>
                {
                  explanation.naoComputadas
                }
              </strong>

              <small>
                sem avaliação ou não
                computados
              </small>
            </div>
          </div>

          {competencias.length ? (
            <div className="print-technical-breakdown">
              {competencias.map(
                (item) => (
                  <div
                    key={
                      item.id ||
                      item.label
                    }
                  >
                    <span>
                      {item.label}
                    </span>

                    <strong>
                      {formatMetricDecimal(
                        item.value
                      )}
                      /5
                    </strong>

                    <small>
                      {item.avaliacoes}{" "}
                      avaliação
                      {Number(
                        item.avaliacoes
                      ) === 1
                        ? ""
                        : "ões"}
                    </small>
                  </div>
                )
              )}
            </div>
          ) : null}

          <div className="print-technical-highlights">
            <div>
              <h5>
                Maiores médias do período
              </h5>

              {pontosFortes.length ? (
                <ul>
                  {pontosFortes.map(
                    (item) => (
                      <li
                        key={
                          item.id ||
                          item.label
                        }
                      >
                        <span>
                          {item.label}
                        </span>

                        <strong>
                          {formatMetricDecimal(
                            item.value
                          )}
                          /5
                        </strong>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Sem competências
                  suficientes para
                  destacar.
                </p>
              )}
            </div>

            <div>
              <h5>
                Focos comparativos de
                desenvolvimento
              </h5>

              {pontosDesenvolvimento.length ? (
                <ul>
                  {pontosDesenvolvimento.map(
                    (item) => (
                      <li
                        key={
                          item.id ||
                          item.label
                        }
                      >
                        <span>
                          {item.label}
                        </span>

                        <strong>
                          {formatMetricDecimal(
                            item.value
                          )}
                          /5
                        </strong>
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>
                  Nenhuma competência
                  ficou abaixo da média
                  consolidada neste
                  recorte.
                </p>
              )}
            </div>
          </div>

          <p className="print-technical-method-note">
            As maiores e menores médias
            são comparações relativas ao
            próprio recorte. Elas apoiam
            a devolutiva da supervisão,
            mas não substituem a análise
            qualitativa do caso, do
            contexto e da complexidade
            atendida.
          </p>
        </>
      )}
    </div>
  );
}

function ReportObservationModal({
  open,
  value,
  onChange,
  onCancel,
  onGenerateWithoutObservation,
  onGenerateWithObservation,
}) {
  if (!open) {
    return null;
  }

  const normalizedValue = String(
    value || ""
  );

  const hasObservation = Boolean(
    normalizedValue.trim()
  );

  return (
    <div
      className="supervisao-modal-backdrop supervisao-report-observation-backdrop"
      onClick={onCancel}
      role="presentation"
    >
      <section
        className="supervisao-modal supervisao-report-observation-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-observation-title"
        aria-describedby="report-observation-description"
      >
        <div className="supervisao-report-observation-modal-header">
          <div>
            <span className="supervisao-kicker">
              Antes de gerar o PDF
            </span>

            <h2 id="report-observation-title">
              Deseja adicionar uma
              observação?
            </h2>

            <p id="report-observation-description">
              O texto aparecerá depois
              de &quot;Competências e
              indicadores clínicos&quot;
              e antes de &quot;Gestão de
              planos de ação em
              aberto&quot;.
            </p>
          </div>

          <button
            type="button"
            className="supervisao-modal-close"
            onClick={onCancel}
            aria-label="Fechar sem gerar o relatório"
          >
            ×
          </button>
        </div>

        <div className="supervisao-report-observation-modal-body">
          <label htmlFor="report-observation">
            <span>
              Observação da supervisão
            </span>

            <textarea
              id="report-observation"
              value={normalizedValue}
              onChange={(event) =>
                onChange(
                  event.target.value
                )
              }
              maxLength={
                MAX_REPORT_OBSERVATION_LENGTH
              }
              rows={7}
              placeholder="Ex.: A média deve ser interpretada considerando a complexidade dos casos acompanhados e o período de adaptação do terapeuta..."
              autoFocus
            />
          </label>

          <div className="supervisao-report-observation-counter">
            {normalizedValue.length}/
            {
              MAX_REPORT_OBSERVATION_LENGTH
            }{" "}
            caracteres
          </div>
        </div>

        <div className="supervisao-report-observation-modal-actions">
          <button
            type="button"
            className="supervisao-secondary-button"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="supervisao-secondary-button"
            onClick={
              onGenerateWithoutObservation
            }
          >
            Gerar sem observação
          </button>

          <button
            type="button"
            className="supervisao-primary-button"
            onClick={
              onGenerateWithObservation
            }
            disabled={!hasObservation}
          >
            Adicionar e gerar PDF
          </button>
        </div>
      </section>
    </div>
  );
}

function PrintReport({ data }) {
  if (!data) return null;

  const { analysis, metrics } = data;

  const dataHoje =
    new Date().toLocaleDateString(
      "pt-BR"
    );

  const previewAlertas =
    data.alertasRows.slice(0, 10);

  const ranking =
    analysis.ranking || [];

  const competencias =
    analysis.competencias || [];

  const sintomas =
    analysis.sintomas || [];

  const statusCarteira =
    analysis.statusCarteira || [];

  const planosPendentes =
    analysis.planosPendentes || [];

  const recomendacoes =
    analysis.recomendacoes || [];

  const technicalExplanation =
    analysis.technicalExplanation ||
    null;

  const reportObservation = String(
    data.reportObservation || ""
  ).trim();

  return (
    <div className="supervisao-print-report">
      <div className="print-cover">
        <span className="kicker">
          DOCUMENTO EXECUTIVO
        </span>

        <h1>
          Desempenho Clínico
          <br />
          &amp; Acompanhamento
        </h1>

        <h2>{data.contextTitle}</h2>

        <p>
          Referência: {data.periodText}
        </p>

        <div className="print-cover-footer">
          Relatório oficial gerado em{" "}
          {dataHoje}
        </div>
      </div>

      <div className="print-section">
        <h3>
          Painel de saúde e eficiência
        </h3>

        <div
          className="print-metrics"
          style={{
            gridTemplateColumns:
              "repeat(3, 1fr)",
          }}
        >
          <div className="print-metric-card">
            <span>
              Evolução clínica
            </span>

            <strong>
              {formatMetricPercent(
                metrics.evolucao
              )}
            </strong>

            <small>
              Score consolidado dos
              indicadores computados
            </small>
          </div>

          <div className="print-metric-card">
            <span>Média técnica</span>

            <strong>
              {isNumericValue(
                metrics.competencia
              )
                ? `${formatMetricDecimal(
                    metrics.competencia
                  )}/5`
                : NOT_COMPUTED}
            </strong>

            <small>
              Média geral de 1 a 5
            </small>
          </div>

          <div className="print-metric-card">
            <span>
              Adesão terapêutica
            </span>

            <strong>
              {formatMetricPercent(
                metrics.adesao
              )}
            </strong>

            <small>
              Somente registros
              computados
            </small>
          </div>

          <div className="print-metric-card">
            <span>
              Evolução de objetivos
            </span>

            <strong>
              {formatMetricPercent(
                metrics.objetivos
              )}
            </strong>

            <small>
              Somente registros
              computados
            </small>
          </div>

          <div className="print-metric-card">
            <span>Alertas</span>
            <strong>
              {metrics.alertas}
            </strong>
            <small>
              Alertas automáticos no
              recorte
            </small>
          </div>

          <div className="print-metric-card">
            <span>
              Acompanhamentos
            </span>
            <strong>
              {metrics.registros}
            </strong>
            <small>
              Supervisões documentadas
            </small>
          </div>
        </div>

        <div
          className="print-card"
          style={{
            marginBottom: "24px",
          }}
        >
          <p style={{ margin: 0 }}>
            Campos marcados como
            &quot;Não computar&quot;
            foram excluídos das médias e
            permanecem identificados
            como não computados nas
            tabelas.
          </p>
        </div>

        <TechnicalScoreExplanation
          explanation={
            technicalExplanation
          }
          contextTitle={
            data.contextTitle
          }
        />

        <div className="print-grid-two">
          <div className="print-card">
            <h4>Raio-X da carteira</h4>

            {statusCarteira.length ? (
              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                {statusCarteira.map(
                  (item) => (
                    <div
                      key={
                        item.id ||
                        item.label
                      }
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        padding: "10px",
                        background:
                          "#fdfaf6",
                        borderRadius:
                          "8px",
                        border:
                          "1px solid #e8ddd3",
                      }}
                    >
                      <span
                        style={{
                          color:
                            "#5d4d43",
                          fontWeight: 600,
                        }}
                      >
                        {item.label}
                      </span>

                      <strong
                        style={{
                          color:
                            "#392619",
                        }}
                      >
                        {item.value} caso(s)
                      </strong>
                    </div>
                  )
                )}
              </div>
            ) : (
              <PrintEmpty>
                Sem pacientes no recorte
                selecionado.
              </PrintEmpty>
            )}
          </div>

          <div className="print-card">
            <h4>
              {analysis.rankingLabel ||
                "Evolução por contexto"}
            </h4>

            {ranking.length ? (
              ranking.map((item) => (
                <PrintBar
                  key={
                    item.id ||
                    item.label
                  }
                  item={item}
                  color="#9f6947"
                />
              ))
            ) : (
              <PrintEmpty>
                Sem evolução computada
                para comparação.
              </PrintEmpty>
            )}
          </div>
        </div>
      </div>

      <div className="print-section">
        <h3>
          Competências e indicadores
          clínicos
        </h3>

        <p
          style={{
            marginBottom: "24px",
            color: "#7b6c61",
          }}
        >
          As médias abaixo consideram
          somente os campos
          efetivamente avaliados em
          cada acompanhamento.
        </p>

        <div className="print-grid-two">
          <div className="print-card">
            <h4>
              Perfil de competência
              técnica
            </h4>

            {competencias.length ? (
              competencias.map(
                (item) => (
                  <PrintBar
                    key={
                      item.id ||
                      item.label
                    }
                    item={item}
                    color="#b78290"
                    formatter={(value) =>
                      isNumericValue(
                        value
                      )
                        ? `${formatMetricDecimal(
                            value
                          )}/5`
                        : NOT_COMPUTED
                    }
                  />
                )
              )
            ) : (
              <PrintEmpty>
                Nenhuma competência foi
                computada no período.
              </PrintEmpty>
            )}
          </div>

          <div className="print-card">
            <h4>
              Termômetro de indicadores
            </h4>

            {sintomas.length ? (
              sintomas.map((item) => (
                <PrintBar
                  key={
                    item.id ||
                    item.label
                  }
                  item={item}
                  color="#6c7fa0"
                  formatter={(
                    value,
                    current
                  ) => {
                    if (
                      !isNumericValue(
                        value
                      )
                    ) {
                      return NOT_COMPUTED;
                    }

                    if (
                      current.unit ===
                      "%"
                    ) {
                      return formatMetricPercent(
                        value
                      );
                    }

                    if (current.max) {
                      return `${formatMetricDecimal(
                        value
                      )}/${current.max}`;
                    }

                    return formatMetricDecimal(
                      value
                    );
                  }}
                />
              ))
            ) : (
              <PrintEmpty>
                Nenhum indicador foi
                computado no período.
              </PrintEmpty>
            )}
          </div>
        </div>

        {reportObservation && (
          <aside className="print-report-observation">
            <span>
              Observação adicionada pela
              supervisão
            </span>

            <h4>
              Observação do relatório
            </h4>

            <p>{reportObservation}</p>
          </aside>
        )}

        <h3
          style={{
            marginTop: "40px",
          }}
        >
          Gestão de planos de ação em
          aberto
        </h3>

        {planosPendentes.length ? (
          <table className="print-table">
            <thead>
              <tr>
                <th
                  style={{
                    width: "15%",
                  }}
                >
                  Prazo
                </th>

                <th
                  style={{
                    width: "25%",
                  }}
                >
                  Terapeuta/caso
                </th>

                <th
                  style={{
                    width: "15%",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    width: "45%",
                  }}
                >
                  Ação requerida
                </th>
              </tr>
            </thead>

            <tbody>
              {planosPendentes.map(
                (plano, index) => (
                  <tr
                    key={
                      plano.id ||
                      `plano-${index}`
                    }
                  >
                    <td>
                      <strong>
                        {plano.prazo
                          ? formatarDataBR(
                              plano.prazo
                            )
                          : "Sem prazo"}
                      </strong>
                    </td>

                    <td>
                      {safeText(
                        plano.terapeutaNome
                      )}
                      <br />

                      <small
                        style={{
                          color:
                            "#9f6947",
                        }}
                      >
                        {safeText(
                          plano.pacienteNome
                        )}
                      </small>
                    </td>

                    <td>
                      {safeText(
                        plano.statusPlano
                      )}
                    </td>

                    <td>
                      {safeText(
                        plano.planoAcao ||
                          plano.recomendacao,
                        "Sem detalhamento"
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <PrintEmpty>
            Não há planos de ação
            pendentes neste recorte.
          </PrintEmpty>
        )}
      </div>

      <div className="print-section">
        <h3>
          Síntese qualitativa da
          supervisão
        </h3>

        {recomendacoes.length ? (
          <div
            style={{
              display: "grid",
              gap: "16px",
              marginBottom: "40px",
            }}
          >
            {recomendacoes.map(
              (item, index) => (
                <div
                  key={
                    item.id ||
                    `recomendacao-${index}`
                  }
                  style={{
                    background: "#fff",
                    border:
                      "1px solid #e8ddd3",
                    borderRadius:
                      "12px",
                    padding: "16px",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      color: "#392619",
                      fontSize:
                        "0.9rem",
                      marginBottom:
                        "8px",
                    }}
                  >
                    Para:{" "}
                    {safeText(
                      item.terapeutaNome
                    )}{" "}
                    · Caso:{" "}
                    {safeText(
                      item.pacienteNome
                    )}
                  </strong>

                  {hasText(
                    item.recomendacao
                  ) && (
                    <p
                      style={{
                        margin:
                          "0 0 6px",
                        color:
                          "#5d4d43",
                        fontSize:
                          "0.95rem",
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>
                        Recomendação:
                      </strong>{" "}
                      {
                        item.recomendacao
                      }
                    </p>
                  )}

                  {hasText(
                    item.emocaoElaborada
                  ) && (
                    <p
                      style={{
                        margin: 0,
                        color:
                          "#9f6947",
                        fontSize:
                          "0.9rem",
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>
                        Emoção a elaborar:
                      </strong>{" "}
                      {
                        item.emocaoElaborada
                      }
                    </p>
                  )}
                </div>
              )
            )}
          </div>
        ) : (
          <PrintEmpty>
            Nenhuma recomendação ou
            emoção registrada neste
            recorte.
          </PrintEmpty>
        )}

        <h3>
          Casos que exigem intervenção
        </h3>

        {previewAlertas.length ? (
          <table className="print-table">
            <thead>
              <tr>
                <th
                  style={{
                    width: "15%",
                  }}
                >
                  Nível
                </th>

                <th
                  style={{
                    width: "25%",
                  }}
                >
                  Paciente
                </th>

                <th
                  style={{
                    width: "60%",
                  }}
                >
                  Resumo/motivo
                </th>
              </tr>
            </thead>

            <tbody>
              {previewAlertas.map(
                (alerta, index) => (
                  <tr
                    key={
                      alerta.id ||
                      `alerta-${index}`
                    }
                  >
                    <td>
                      <strong>
                        {
                          alerta.levelLabel
                        }
                      </strong>
                    </td>

                    <td>
                      {
                        alerta.pacienteNome
                      }
                      <br />

                      <small
                        style={{
                          color:
                            "#9f6947",
                        }}
                      >
                        {
                          alerta.terapeutaNome
                        }
                      </small>
                    </td>

                    <td>
                      {alerta.summary}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        ) : (
          <PrintEmpty>
            Nenhum alerta automático
            encontrado para o recorte.
          </PrintEmpty>
        )}
      </div>
    </div>
  );
}

export default function RelatoriosSupervisaoPage() {
  return (
    <AuthGuard>
      {({
        user,
        access,
        onLogout,
      }) => (
        <RelatoriosContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function RelatoriosContent({
  user,
  access,
  onLogout,
}) {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    reloadToken,
    setReloadToken,
  ] = useState(0);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });

  const [reportType, setReportType] =
    useState("executivo");

  const [printData, setPrintData] =
    useState(null);

  const [
    observationModalOpen,
    setObservationModalOpen,
  ] = useState(false);

  const [
    reportObservation,
    setReportObservation,
  ] = useState("");

  const [filters, setFilters] =
    useState(INITIAL_FILTERS);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);

      setMessage({
        type: "",
        text: "",
      });

      try {
        const payload =
          await supervisaoRequest(
            user,
            "dashboard"
          );

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
              error?.message ||
              "Não foi possível carregar os dados dos relatórios.",
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
  }, [user, reloadToken]);

  useEffect(() => {
    if (
      !printData ||
      typeof window === "undefined"
    ) {
      return undefined;
    }

    const timeout =
      window.setTimeout(
        () => window.print(),
        500
      );

    const clearAfterPrint = () => {
      setPrintData(null);
      setReportObservation("");
    };

    window.addEventListener(
      "afterprint",
      clearAfterPrint
    );

    return () => {
      window.clearTimeout(timeout);

      window.removeEventListener(
        "afterprint",
        clearAfterPrint
      );
    };
  }, [printData]);

  const clinicas = useMemo(
    () => data?.clinicas || [],
    [data]
  );

  const terapeutas = useMemo(
    () => data?.terapeutas || [],
    [data]
  );

  const pacientes = useMemo(
    () => data?.pacientes || [],
    [data]
  );

  const lancamentos = useMemo(
    () => data?.lancamentos || [],
    [data]
  );

  const selectedPatient = useMemo(
    () =>
      pacientes.find(
        (item) =>
          safeId(item?.id) ===
          safeId(filters.pacienteId)
      ) || null,
    [pacientes, filters.pacienteId]
  );

  const selectedTherapistId =
    filters.terapeutaId ||
    selectedPatient?.terapeutaId ||
    "";

  const selectedTherapist = useMemo(
    () =>
      terapeutas.find(
        (item) =>
          safeId(item?.id) ===
          safeId(
            selectedTherapistId
          )
      ) || null,
    [
      terapeutas,
      selectedTherapistId,
    ]
  );

  const selectedClinicId =
    filters.clinicaId ||
    selectedPatient?.clinicaId ||
    selectedTherapist?.clinicaId ||
    "";

  const terapeutasFiltradosSelect =
    useMemo(() => {
      if (!filters.clinicaId) {
        return terapeutas;
      }

      return terapeutas.filter(
        (item) =>
          safeId(item?.clinicaId) ===
          safeId(
            filters.clinicaId
          )
      );
    }, [
      terapeutas,
      filters.clinicaId,
    ]);

  const pacientesFiltradosSelect =
    useMemo(() => {
      return pacientes.filter(
        (item) => {
          if (
            filters.clinicaId &&
            safeId(
              item?.clinicaId
            ) !==
              safeId(
                filters.clinicaId
              )
          ) {
            return false;
          }

          if (
            filters.terapeutaId &&
            safeId(
              item?.terapeutaId
            ) !==
              safeId(
                filters.terapeutaId
              )
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      pacientes,
      filters.clinicaId,
      filters.terapeutaId,
    ]);

  const lancamentosFiltrados =
    useMemo(
      () =>
        filterLancamentos(
          lancamentos,
          filters
        ),
      [lancamentos, filters]
    );

  const clinicasFiltradas =
    useMemo(() => {
      if (!selectedClinicId) {
        return clinicas;
      }

      return clinicas.filter(
        (item) =>
          safeId(item?.id) ===
          safeId(selectedClinicId)
      );
    }, [clinicas, selectedClinicId]);

  const terapeutasFiltrados =
    useMemo(() => {
      return terapeutas.filter(
        (item) => {
          if (
            selectedClinicId &&
            safeId(
              item?.clinicaId
            ) !==
              safeId(
                selectedClinicId
              )
          ) {
            return false;
          }

          if (
            selectedTherapistId &&
            safeId(item?.id) !==
              safeId(
                selectedTherapistId
              )
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      terapeutas,
      selectedClinicId,
      selectedTherapistId,
    ]);

  const pacientesFiltrados =
    useMemo(() => {
      return pacientes.filter(
        (item) => {
          if (
            selectedClinicId &&
            safeId(
              item?.clinicaId
            ) !==
              safeId(
                selectedClinicId
              )
          ) {
            return false;
          }

          if (
            selectedTherapistId &&
            safeId(
              item?.terapeutaId
            ) !==
              safeId(
                selectedTherapistId
              )
          ) {
            return false;
          }

          if (
            filters.pacienteId &&
            safeId(item?.id) !==
              safeId(
                filters.pacienteId
              )
          ) {
            return false;
          }

          return true;
        }
      );
    }, [
      pacientes,
      selectedClinicId,
      selectedTherapistId,
      filters.pacienteId,
    ]);

  const alertasCalculados =
    useMemo(
      () =>
        buildAlertasSupervisao({
          clinicas,
          terapeutas,
          pacientes,
          lancamentos,
          filters,
        }),
      [
        clinicas,
        terapeutas,
        pacientes,
        lancamentos,
        filters,
      ]
    );

  const rankingMode =
    selectedClinicId
      ? "terapeutas"
      : "clinicas";

  const analysis = useMemo(
    () =>
      buildReportAnalysis({
        lancamentos:
          lancamentosFiltrados,
        clinicas:
          clinicasFiltradas,
        terapeutas:
          terapeutasFiltrados,
        pacientes:
          pacientesFiltrados,
        alertas:
          alertasCalculados,
        rankingMode,
      }),
    [
      lancamentosFiltrados,
      clinicasFiltradas,
      terapeutasFiltrados,
      pacientesFiltrados,
      alertasCalculados,
      rankingMode,
    ]
  );

  const metrics = analysis.metrics;

  const contextTitle = useMemo(
    () =>
      getContextTitle({
        filters,
        clinicas,
        terapeutas,
        pacientes,
      }),
    [
      filters,
      clinicas,
      terapeutas,
      pacientes,
    ]
  );

  const periodText = useMemo(
    () => getPeriodText(filters),
    [filters]
  );

  const reportRows = useMemo(() => {
    const context = {
      clinicas,
      terapeutas,
      pacientes,
    };

    return {
      resumoRows: buildResumoRows({
        metrics,
        filters,
        contexto: contextTitle,
      }),

      clinicasRows:
        buildClinicasRows(
          clinicasFiltradas
        ),

      terapeutasRows:
        buildTerapeutasRows(
          terapeutasFiltrados,
          context
        ),

      pacientesRows:
        buildPacientesRows(
          pacientesFiltrados,
          context
        ),

      lancamentosRows:
        buildLancamentosRows(
          lancamentosFiltrados,
          context
        ),

      alertasRows:
        buildAlertasRows(
          alertasCalculados
        ),
    };
  }, [
    metrics,
    filters,
    contextTitle,
    clinicas,
    terapeutas,
    pacientes,
    clinicasFiltradas,
    terapeutasFiltrados,
    pacientesFiltrados,
    lancamentosFiltrados,
    alertasCalculados,
  ]);

  const reportSheets = useMemo(
    () =>
      buildReportSheets({
        ...reportRows,
        type: reportType,
      }),
    [reportRows, reportType]
  );

  function updateFilter(
    name,
    value
  ) {
    setFilters((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (
        name === "clinicaId"
      ) {
        next.terapeutaId = "";
        next.pacienteId = "";
      }

      if (
        name === "terapeutaId"
      ) {
        next.pacienteId = "";
      }

      return next;
    });
  }

  function handleExportExcel() {
    exportExcelWorkbook(
      buildReportFileName(
        contextTitle,
        filters,
        "Excel"
      ),
      reportSheets,
      metrics
    );
  }

  function handleExportLancamentosCsv() {
    exportCsv(
      buildReportFileName(
        contextTitle,
        filters,
        "Lancamentos"
      ),
      lancamentosColumns,
      reportRows.lancamentosRows
    );
  }

  function openPrintObservationModal() {
    setReportObservation("");
    setObservationModalOpen(true);
  }

  function closePrintObservationModal() {
    setObservationModalOpen(false);
    setReportObservation("");
  }

  function generatePrintReport(
    observation = ""
  ) {
    const sanitizedObservation =
      String(observation || "")
        .trim()
        .slice(
          0,
          MAX_REPORT_OBSERVATION_LENGTH
        );

    setPrintData({
      ...reportRows,
      metrics,
      analysis,
      filters,
      contextTitle,
      periodText,
      reportObservation:
        sanitizedObservation,
    });

    setObservationModalOpen(false);
  }

  return (
    <>
      <Head>
        <title>
          Relatórios | Supervisão TCC
        </title>
      </Head>

      <LayoutSupervisao
        title="Relatórios e apresentações"
        description="Exporte indicadores consolidados usando as mesmas regras dos dashboards, do histórico e dos alertas."
        user={user}
        access={access}
        onLogout={onLogout}
      >
        <StatusMessage
          message={message}
        />

        <section className="supervisao-dashboard-hero relatorios-hero">
          <div>
            <span className="supervisao-kicker">
              Inteligência de dados
            </span>

            <h2>{contextTitle}</h2>

            <p>
              {periodText} · escolha o
              recorte e o formato de
              exportação.
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
                    value={
                      filters.clinicaId
                    }
                    onChange={(
                      event
                    ) =>
                      updateFilter(
                        "clinicaId",
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Todas
                    </option>

                    {clinicas.map(
                      (clinica) => (
                        <option
                          key={
                            clinica.id
                          }
                          value={
                            clinica.id
                          }
                        >
                          {clinica.nome}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  <span>
                    Terapeuta
                  </span>

                  <select
                    value={
                      filters.terapeutaId
                    }
                    onChange={(
                      event
                    ) =>
                      updateFilter(
                        "terapeutaId",
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Todos
                    </option>

                    {terapeutasFiltradosSelect.map(
                      (terapeuta) => (
                        <option
                          key={
                            terapeuta.id
                          }
                          value={
                            terapeuta.id
                          }
                        >
                          {
                            terapeuta.nome
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  <span>Paciente</span>

                  <select
                    value={
                      filters.pacienteId
                    }
                    onChange={(
                      event
                    ) =>
                      updateFilter(
                        "pacienteId",
                        event.target
                          .value
                      )
                    }
                  >
                    <option value="">
                      Todos
                    </option>

                    {pacientesFiltradosSelect.map(
                      (paciente) => (
                        <option
                          key={
                            paciente.id
                          }
                          value={
                            paciente.id
                          }
                        >
                          {
                            paciente.nome
                          }
                        </option>
                      )
                    )}
                  </select>
                </label>
              </>
            }
          />
        </section>

        {loading ? (
          <section className="supervisao-panel">
            <p>
              Carregando relatórios...
            </p>
          </section>
        ) : !data ? (
          <section className="supervisao-panel">
            <p className="supervisao-empty">
              Não foi possível carregar
              os dados dos relatórios.
            </p>

            <button
              type="button"
              className="supervisao-primary-button"
              onClick={() =>
                setReloadToken(
                  (current) =>
                    current + 1
                )
              }
            >
              Tentar novamente
            </button>
          </section>
        ) : (
          <>
            <section
              className="supervisao-report-command-panel"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent:
                  "space-between",
                flexWrap: "wrap",
                padding: "24px 32px",
              }}
            >
              <div
                style={{
                  flex: "1 1 300px",
                }}
              >
                <span className="supervisao-kicker">
                  Exportação de dados
                </span>

                <h2
                  style={{
                    fontSize:
                      "1.75rem",
                    margin:
                      "4px 0 8px",
                  }}
                >
                  Gerar relatórios
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                  }}
                >
                  PDF, Excel e CSV
                  respeitam os mesmos
                  filtros e ignoram
                  métricas marcadas como
                  &quot;Não
                  computar&quot;.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "14px",
                  flex: "0 0 auto",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent:
                      "flex-end",
                  }}
                >
                  <span
                    style={{
                      fontSize:
                        "0.75rem",
                      fontWeight: 800,
                      color:
                        "var(--sup-primary-dark)",
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.05em",
                    }}
                  >
                    Conteúdo:
                  </span>

                  <select
                    value={reportType}
                    onChange={(event) =>
                      setReportType(
                        event.target
                          .value
                      )
                    }
                    style={{
                      height: "40px",
                      borderRadius:
                        "12px",
                      border:
                        "1px solid rgba(159, 105, 71, 0.25)",
                      padding:
                        "0 16px",
                      background: "#fff",
                      fontSize:
                        "0.85rem",
                      color:
                        "var(--sup-text)",
                      outline: "none",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {REPORT_TYPES.map(
                      (item) => (
                        <option
                          key={
                            item.value
                          }
                          value={
                            item.value
                          }
                        >
                          {item.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div
                  className="supervisao-report-actions"
                  style={{
                    margin: 0,
                    justifyContent:
                      "flex-end",
                  }}
                >
                  <button
                    type="button"
                    className="supervisao-primary-button"
                    onClick={
                      handleExportExcel
                    }
                  >
                    Gerar Excel
                  </button>

                  <button
                    type="button"
                    className="supervisao-secondary-button"
                    onClick={
                      openPrintObservationModal
                    }
                  >
                    Gerar PDF
                  </button>

                  <button
                    type="button"
                    className="supervisao-secondary-button"
                    onClick={
                      handleExportLancamentosCsv
                    }
                  >
                    Gerar CSV
                  </button>
                </div>
              </div>
            </section>

            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Lançamentos"
                value={
                  metrics.registros
                }
                detail="registros ativos filtrados"
              />

              <CardIndicador
                label="Pacientes"
                value={
                  metrics.pacientes
                }
                detail="casos no recorte"
              />

              <CardIndicador
                label="Evolução média"
                value={formatMetricPercent(
                  metrics.evolucao
                )}
                detail="somente indicadores computados"
              />

              <CardIndicador
                label="Adesão às tarefas"
                value={formatMetricPercent(
                  metrics.adesao
                )}
                detail="campos não computados foram ignorados"
              />
            </section>

            <div className="bento-grid dashboard-lower">
              <div className="bento-col bento-12">
                <PreviewTable
                  title="Resumo executivo"
                  columns={
                    resumoColumns
                  }
                  rows={
                    reportRows.resumoRows
                  }
                  limit={6}
                />
              </div>

              <div className="bento-col bento-6">
                <PreviewTable
                  title="Atenção imediata"
                  columns={
                    alertasColumns
                  }
                  rows={
                    reportRows.alertasRows
                  }
                  limit={4}
                />
              </div>

              <div className="bento-col bento-6">
                <PreviewTable
                  title="Últimos lançamentos"
                  columns={
                    lancamentosColumns
                  }
                  rows={
                    reportRows.lancamentosRows
                  }
                  limit={4}
                />
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>

      <ReportObservationModal
        open={observationModalOpen}
        value={reportObservation}
        onChange={
          setReportObservation
        }
        onCancel={
          closePrintObservationModal
        }
        onGenerateWithoutObservation={() =>
          generatePrintReport("")
        }
        onGenerateWithObservation={() =>
          generatePrintReport(
            reportObservation
          )
        }
      />

      <PrintReport data={printData} />
    </>
  );
}