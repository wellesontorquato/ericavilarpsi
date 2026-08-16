import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import StatusMessage from "@/components/supervisao/StatusMessage";
import DashboardFilters from "@/components/supervisao/DashboardFilters";
import {
  ChartPanel,
  ProgressRing,
  TrendLine,
  HorizontalBars,
} from "@/components/supervisao/Charts";
import { supervisaoRequest } from "@/lib/supervisao/api";
import {
  average,
  formatPercent,
  isNumericValue,
  mesNome,
} from "@/lib/supervisao/format";
import {
  buildTendencia,
  countComputedMetrics,
  currentYear,
  evolucaoMedia,
  filterLancamentos,
  isCasoAtencao,
  patientIndicatorFields,
  selectedName,
} from "@/lib/supervisao/dashboardUtils";

const NO_DATA = "Sem dados";

function isActivePatient(item = {}) {
  const archived =
    item?.arquivado === true ||
    String(
      item?.statusRegistro || ""
    ).toLowerCase() === "arquivado";

  if (archived) return false;

  const status = String(
    item?.statusCaso || ""
  )
    .trim()
    .toLowerCase();

  if (!status) return true;

  return status.includes(
    "acompanhamento"
  );
}

function formatEvolution(value) {
  return formatPercent(
    value,
    0,
    NO_DATA
  );
}

export default function SupervisaoClinicasDashboardPage() {
  return (
    <AuthGuard>
      {({
        user,
        access,
        onLogout,
      }) => (
        <ClinicasDashboardContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function ClinicasDashboardContent({
  user,
  access,
  onLogout,
}) {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });

  const [filters, setFilters] =
    useState({
      ano: String(currentYear),
      mes: "",
      semana: "",
      clinicaId: "",
    });

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
              error.message ||
              "Não foi possível carregar o dashboard.",
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

  const lancamentosFiltrados =
    useMemo(
      () =>
        filterLancamentos(
          lancamentos,
          filters
        ),
      [lancamentos, filters]
    );

  const pacientesDaClinica =
    useMemo(
      () =>
        pacientes.filter(
          (paciente) =>
            !filters.clinicaId ||
            String(
              paciente.clinicaId
            ) ===
              String(
                filters.clinicaId
              )
        ),
      [
        pacientes,
        filters.clinicaId,
      ]
    );

  const pacientesAtivosDaClinica =
    useMemo(
      () =>
        pacientesDaClinica.filter(
          isActivePatient
        ),
      [pacientesDaClinica]
    );

  const metricas = useMemo(() => {
    const scoresEvolucao =
      lancamentosFiltrados
        .map(evolucaoMedia)
        .filter(
          isNumericValue
        );

    const indicadoresComputados =
      lancamentosFiltrados.reduce(
        (total, item) =>
          total +
          countComputedMetrics(
            item,
            patientIndicatorFields
          ),
        0
      );

    const totalIndicadoresPossiveis =
      lancamentosFiltrados.length *
      patientIndicatorFields.length;

    return {
      pacientesAtivos:
        pacientesAtivosDaClinica.length,

      mediaEvolucao:
        average(
          scoresEvolucao
        ),

      casosAtencao:
        pacientesAtivosDaClinica.filter(
          isCasoAtencao
        ).length,

      supervisoes:
        lancamentosFiltrados.length,

      supervisoesComEvolucao:
        scoresEvolucao.length,

      indicadoresComputados,

      coberturaIndicadores:
        totalIndicadoresPossiveis
          ? (
              indicadoresComputados /
              totalIndicadoresPossiveis
            ) * 100
          : null,
    };
  }, [
    lancamentosFiltrados,
    pacientesAtivosDaClinica,
  ]);

  const resumoClinicas =
    useMemo(
      () =>
        clinicas
          .map((clinica) => {
            const registros =
              filterLancamentos(
                lancamentos,
                {
                  ...filters,
                  clinicaId:
                    clinica.id,
                }
              );

            const evolucao =
              average(
                registros.map(
                  evolucaoMedia
                )
              );

            return {
              id: clinica.id,
              label:
                clinica.nome,
              evolucao,
              registros:
                registros.length,
            };
          })
          .filter((item) =>
            isNumericValue(
              item.evolucao
            )
          )
          .sort(
            (a, b) =>
              b.evolucao -
              a.evolucao
          ),
      [
        clinicas,
        lancamentos,
        filters,
      ]
    );

  const resumoPacientesDaClinica =
    useMemo(() => {
      if (!filters.clinicaId) {
        return [];
      }

      return pacientesAtivosDaClinica
        .map((paciente) => {
          const registros =
            filterLancamentos(
              lancamentos,
              {
                ...filters,
                pacienteId:
                  paciente.id,
              }
            );

          const evolucao =
            average(
              registros.map(
                evolucaoMedia
              )
            );

          return {
            id: paciente.id,
            label:
              paciente.nome,
            evolucao,
            registros:
              registros.length,
          };
        })
        .filter((item) =>
          isNumericValue(
            item.evolucao
          )
        )
        .sort(
          (a, b) =>
            b.evolucao -
            a.evolucao
        );
    }, [
      pacientesAtivosDaClinica,
      lancamentos,
      filters,
    ]);

  const casosAtencaoLista =
    useMemo(
      () =>
        pacientesAtivosDaClinica
          .filter(
            isCasoAtencao
          )
          .slice(0, 6),
      [pacientesAtivosDaClinica]
    );

  const tendencia = useMemo(
    () =>
      buildTendencia(
        lancamentosFiltrados,
        filters
      ).filter((item) =>
        isNumericValue(
          item.evolucao
        )
      ),
    [
      lancamentosFiltrados,
      filters,
    ]
  );

  const periodoDescricao = `${
    filters.mes
      ? mesNome(filters.mes)
      : "Todos os meses"
  }${
    filters.ano
      ? ` · ${filters.ano}`
      : ""
  }`;

  return (
    <>
      <Head>
        <title>
          Dashboard por clínica |
          Supervisão TCC
        </title>
      </Head>

      <LayoutSupervisao
        title="Dashboard da Clínica"
        description="Acompanhe a evolução média e os casos que exigem atenção dentro das clínicas sob sua responsabilidade."
        user={user}
        access={access}
        onLogout={onLogout}
        actions={
          <div className="supervisao-header-action-group">
            <Link
              className="supervisao-secondary-button"
              href="/admin/supervisao/alertas"
            >
              Gerenciar alertas
            </Link>
          </div>
        }
      >
        <StatusMessage
          message={message}
        />

        <section className="supervisao-dashboard-hero">
          <div>
            <span className="supervisao-kicker">
              Visão macro
            </span>

            <h2>
              {selectedName(
                clinicas,
                filters.clinicaId,
                "Todas as clínicas"
              )}
            </h2>

            <p>
              {periodoDescricao}
            </p>
          </div>

          <DashboardFilters
            filters={filters}
            setFilters={setFilters}
            lancamentos={
              lancamentos
            }
            extraFilters={
              <label>
                <span>
                  Clínica
                </span>

                <select
                  value={
                    filters.clinicaId
                  }
                  onChange={(
                    event
                  ) =>
                    setFilters(
                      (
                        current
                      ) => ({
                        ...current,
                        clinicaId:
                          event
                            .target
                            .value,
                      })
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
                        {
                          clinica.nome
                        }
                      </option>
                    )
                  )}
                </select>
              </label>
            }
          />
        </section>

        {loading ? (
          <section className="supervisao-panel">
            <p>
              Carregando
              dashboard...
            </p>
          </section>
        ) : !data ? (
          <section className="supervisao-panel">
            <p className="supervisao-empty">
              Não foi possível
              carregar os dados do
              dashboard.
            </p>
          </section>
        ) : (
          <>
            <section className="supervisao-indicator-grid executive">
              <CardIndicador
                label="Saúde da Clínica"
                value={formatEvolution(
                  metricas.mediaEvolucao
                )}
                detail={
                  metricas.supervisoesComEvolucao
                    ? `${metricas.supervisoesComEvolucao} lançamento(s) com score calculável`
                    : "nenhuma evolução computada no período"
                }
              />

              <CardIndicador
                label="Casos de Risco"
                value={
                  metricas.casosAtencao
                }
                detail="casos ativos que necessitam atenção"
              />

              <CardIndicador
                label="Pacientes Ativos"
                value={
                  metricas.pacientesAtivos
                }
                detail="casos em acompanhamento"
              />

              <CardIndicador
                label="Supervisões"
                value={
                  metricas.supervisoes
                }
                detail={
                  isNumericValue(
                    metricas.coberturaIndicadores
                  )
                    ? `${formatPercent(
                        metricas.coberturaIndicadores
                      )} das métricas computadas`
                    : "sem lançamentos no período"
                }
              />
            </section>

            <div className="bento-grid">
              <div className="bento-col bento-8">
                <ChartPanel
                  title="Tendência de Evolução"
                  subtitle="Curva calculada somente com indicadores efetivamente computados"
                  action="evolução"
                >
                  {tendencia.length ? (
                    <TrendLine
                      items={
                        tendencia
                      }
                      valueKey="evolucao"
                      labelKey="label"
                    />
                  ) : (
                    <p className="supervisao-empty">
                      Nenhuma evolução
                      computável para o
                      período selecionado.
                    </p>
                  )}
                </ChartPanel>
              </div>

              <div className="bento-col bento-4">
                <ChartPanel
                  title="Saúde Geral"
                  subtitle="Média de evolução clínica atual"
                  action={formatEvolution(
                    metricas.mediaEvolucao
                  )}
                >
                  {isNumericValue(
                    metricas.mediaEvolucao
                  ) ? (
                    <ProgressRing
                      value={
                        metricas.mediaEvolucao
                      }
                      label="evolução"
                      detail={`Até ${patientIndicatorFields.length} indicadores por lançamento`}
                    />
                  ) : (
                    <p className="supervisao-empty">
                      Nenhum indicador de
                      evolução foi
                      computado neste
                      período.
                    </p>
                  )}
                </ChartPanel>
              </div>

              <div className="bento-col bento-8">
                {!filters.clinicaId ? (
                  <ChartPanel
                    title="Evolução por Unidade"
                    subtitle="Ranking calculado apenas entre clínicas com indicadores computados"
                    action={`${resumoClinicas.length} com dados`}
                  >
                    {resumoClinicas.length ? (
                      <HorizontalBars
                        items={resumoClinicas.slice(
                          0,
                          5
                        )}
                        valueKey="evolucao"
                        labelKey="label"
                        max={100}
                        valueFormatter={
                          formatEvolution
                        }
                      />
                    ) : (
                      <p className="supervisao-empty">
                        Nenhuma clínica
                        possui evolução
                        computável no
                        período.
                      </p>
                    )}
                  </ChartPanel>
                ) : (
                  <ChartPanel
                    title="Evolução dos Casos"
                    subtitle="Casos da unidade com indicadores computados"
                    action={`${resumoPacientesDaClinica.length} com dados`}
                  >
                    {resumoPacientesDaClinica.length ? (
                      <HorizontalBars
                        items={resumoPacientesDaClinica.slice(
                          0,
                          5
                        )}
                        valueKey="evolucao"
                        labelKey="label"
                        max={100}
                        valueFormatter={
                          formatEvolution
                        }
                      />
                    ) : (
                      <p className="supervisao-empty">
                        Nenhum caso possui
                        evolução
                        computável no
                        período.
                      </p>
                    )}
                  </ChartPanel>
                )}
              </div>

              <div className="bento-col bento-4">
                <section
                  className="supervisao-panel h-full"
                  style={{
                    display: "flex",
                    flexDirection:
                      "column",
                  }}
                >
                  <div
                    style={{
                      paddingBottom:
                        "16px",
                      marginBottom:
                        "16px",
                      borderBottom:
                        "1px solid var(--sup-line)",
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize:
                          "1.35rem",
                        color:
                          "var(--sup-text)",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap: "8px",
                      }}
                    >
                      Atenção imediata:

                      <strong
                        style={{
                          backgroundColor:
                            "var(--sup-primary)",
                          color:
                            "#fff",
                          padding:
                            "2px 14px",
                          borderRadius:
                            "999px",
                          fontSize:
                            "1.15rem",
                          lineHeight:
                            "1.4",
                        }}
                      >
                        {
                          metricas.casosAtencao
                        }
                      </strong>
                    </h2>

                    <p
                      style={{
                        margin:
                          "6px 0 0",
                        fontSize:
                          "0.85rem",
                        color:
                          "var(--sup-muted)",
                      }}
                    >
                      Casos ativos que
                      exigem
                      acompanhamento
                      prioritário.
                    </p>
                  </div>

                  <div
                    className="supervisao-insight-list"
                    style={{
                      flex: 1,
                      overflowY:
                        "auto",
                    }}
                  >
                    {casosAtencaoLista.map(
                      (
                        paciente
                      ) => {
                        const terapeutaResponsavel =
                          terapeutas.find(
                            (
                              terapeuta
                            ) =>
                              terapeuta.id ===
                              paciente.terapeutaId
                          );

                        const isAltoRisco =
                          [
                            "Alta",
                            "Alto",
                          ].includes(
                            paciente.nivelAtencao
                          );

                        return (
                          <article
                            key={
                              paciente.id
                            }
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap:
                                "6px",
                              padding:
                                "16px",
                              backgroundColor:
                                "rgba(255,255,255,0.7)",
                              border:
                                "1px solid var(--sup-line)",
                              borderRadius:
                                "18px",
                            }}
                          >
                            <strong
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "1.05rem",
                                color:
                                  "var(--sup-text)",
                                lineHeight: 1.2,
                              }}
                            >
                              {
                                paciente.nome
                              }
                            </strong>

                            <span
                              style={{
                                display:
                                  "flex",
                                alignItems:
                                  "center",
                                gap:
                                  "6px",
                                fontSize:
                                  "0.85rem",
                                color:
                                  "var(--sup-muted)",
                                marginTop:
                                  "2px",
                              }}
                            >
                              <span
                                aria-hidden="true"
                                style={{
                                  width:
                                    "8px",
                                  height:
                                    "8px",
                                  borderRadius:
                                    "50%",
                                  backgroundColor:
                                    isAltoRisco
                                      ? "#a43c32"
                                      : "#c98239",
                                }}
                              />

                              {terapeutaResponsavel?.nome ||
                                "Sem terapeuta"}{" "}
                              · Nível:{" "}
                              {
                                paciente.nivelAtencao
                              }
                            </span>
                          </article>
                        );
                      }
                    )}

                    {!casosAtencaoLista.length && (
                      <div
                        style={{
                          padding:
                            "24px",
                          textAlign:
                            "center",
                          backgroundColor:
                            "rgba(255,255,255,0.4)",
                          borderRadius:
                            "16px",
                          border:
                            "1px dashed var(--sup-line)",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            fontSize:
                              "2rem",
                            display:
                              "block",
                            marginBottom:
                              "8px",
                          }}
                        >
                          ✓
                        </span>

                        <p
                          style={{
                            margin: 0,
                            color:
                              "var(--sup-muted)",
                            fontSize:
                              "0.9rem",
                          }}
                        >
                          Nenhum caso
                          crítico detectado
                          no momento.
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </div>
          </>
        )}
      </LayoutSupervisao>
    </>
  );
}