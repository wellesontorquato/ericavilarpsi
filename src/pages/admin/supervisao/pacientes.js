import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import EntityCrud from "@/components/supervisao/EntityCrud";
import { listResource } from "@/lib/supervisao/api";

function isArchived(item) {
  return (
    item?.arquivado === true ||
    String(item?.statusRegistro || "").toLowerCase() === "arquivado"
  );
}

function isActiveSupervisor(supervisor) {
  return (
    !isArchived(supervisor) &&
    String(supervisor?.status || "Ativo").toLowerCase() === "ativo"
  );
}

export default function PacientesPage() {
  return (
    <AuthGuard>
      {({ user, access, onLogout }) => (
        <PacientesContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function PacientesContent({ user, access, onLogout }) {
  const [clinicas, setClinicas] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const isAdmin =
    access?.role === "admin" ||
    access?.isAdmin === true;

  useEffect(() => {
    let cancelled = false;

    async function loadDependencies() {
      try {
        const requests = [
          listResource(user, "clinicas"),
          listResource(user, "terapeutas"),
        ];

        if (isAdmin) {
          requests.push(
            listResource(user, "supervisores")
          );
        }

        const [
          clinicasData,
          terapeutasData,
          supervisoresData = [],
        ] = await Promise.all(requests);

        if (cancelled) return;

        setClinicas(clinicasData);
        setTerapeutas(terapeutasData);
        setSupervisores(supervisoresData);
        setLoadError("");
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setLoadError(
            error?.message ||
              "Não foi possível carregar clínicas, terapeutas e supervisores."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDependencies();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, user]);

  const clinicasAtivas = useMemo(
    () =>
      clinicas.filter(
        (clinica) => !isArchived(clinica)
      ),
    [clinicas]
  );

  const terapeutasAtivos = useMemo(
    () =>
      terapeutas.filter(
        (terapeuta) => !isArchived(terapeuta)
      ),
    [terapeutas]
  );

  const clinicasPorId = useMemo(
    () =>
      Object.fromEntries(
        clinicas.map((clinica) => [
          String(clinica.id),
          clinica,
        ])
      ),
    [clinicas]
  );

  const terapeutasPorId = useMemo(
    () =>
      Object.fromEntries(
        terapeutas.map((terapeuta) => [
          String(terapeuta.id),
          terapeuta,
        ])
      ),
    [terapeutas]
  );

  const supervisoresPorId = useMemo(
    () =>
      Object.fromEntries(
        supervisores.map((supervisor) => [
          String(supervisor.id),
          supervisor,
        ])
      ),
    [supervisores]
  );

  const clinicaOptions = useMemo(
    () =>
      clinicasAtivas
        .map((clinica) => ({
          value: clinica.id,
          label:
            clinica.status === "Inativa"
              ? `${clinica.nome} — Inativa`
              : clinica.nome,
        }))
        .sort((a, b) =>
          a.label.localeCompare(b.label, "pt-BR")
        ),
    [clinicasAtivas]
  );

  const terapeutaOptions = useMemo(
    () =>
      terapeutasAtivos
        .map((terapeuta) => {
          const clinica =
            clinicasPorId[String(terapeuta.clinicaId)];

          const statusLabel =
            terapeuta.status === "Inativo"
              ? " — Inativo"
              : "";

          return {
            value: terapeuta.id,
            label: `${terapeuta.nome}${
              clinica?.nome
                ? ` — ${clinica.nome}`
                : ""
            }${statusLabel}`,
          };
        })
        .sort((a, b) =>
          a.label.localeCompare(b.label, "pt-BR")
        ),
    [terapeutasAtivos, clinicasPorId]
  );

  const supervisorOptions = useMemo(
    () =>
      supervisores
        .filter(isActiveSupervisor)
        .map((supervisor) => {
          const terapeutasDoSupervisor =
            terapeutasAtivos.filter(
              (terapeuta) =>
                Array.isArray(
                  terapeuta.supervisorIds
                ) &&
                terapeuta.supervisorIds
                  .map(String)
                  .includes(String(supervisor.id))
            );

          const terapeutasLabel =
            terapeutasDoSupervisor
              .map((terapeuta) => terapeuta.nome)
              .join(", ");

          return {
            value: supervisor.id,
            label: terapeutasLabel
              ? `${supervisor.nome} — ${terapeutasLabel}`
              : `${supervisor.nome} — sem terapeuta atribuído`,
          };
        })
        .sort((a, b) =>
          a.label.localeCompare(b.label, "pt-BR")
        ),
    [supervisores, terapeutasAtivos]
  );

  const fields = useMemo(() => {
    const patientFields = [
      {
        name: "nome",
        label: "Identificação do paciente/caso",
        required: true,
        maxLength: 160,
        placeholder:
          "Utilize um código, iniciais ou nome abreviado",
        help:
          "Evite utilizar o nome completo quando ele não for necessário para a supervisão.",
      },
      {
        name: "clinicaId",
        label: "Clínica",
        type: "select",
        options: clinicaOptions,
        required: true,
      },
      {
        name: "terapeutaId",
        label: "Terapeuta responsável",
        type: "select",
        options: terapeutaOptions,
        required: true,
        help:
          "Selecione um terapeuta pertencente à clínica escolhida.",
      },
      {
        name: "dataInicio",
        label: "Data de início",
        type: "date",
      },
      {
        name: "statusCaso",
        label: "Status do caso",
        type: "select",
        defaultValue: "Em acompanhamento",
        required: true,
        options: [
          {
            value: "Em acompanhamento",
            label: "Em acompanhamento",
          },
          {
            value: "Alta",
            label: "Alta",
          },
          {
            value: "Pausado",
            label: "Pausado",
          },
          {
            value: "Encerrado",
            label: "Encerrado",
          },
        ],
      },
      {
        name: "nivelAtencao",
        label: "Nível de atenção",
        type: "select",
        defaultValue: "Média",
        required: true,
        options: [
          {
            value: "Baixa",
            label: "Baixa",
          },
          {
            value: "Média",
            label: "Média",
          },
          {
            value: "Alta",
            label: "Alta",
          },
        ],
      },
      {
        name: "statusConceitualizacao",
        label: "Status da pré-supervisão",
        type: "select",
        defaultValue: "Rascunho",
        required: true,
        fullWidth: true,
        options: [
          {
            value: "Rascunho",
            label: "Rascunho",
          },
          {
            value: "Concluída",
            label: "Concluída",
          },
        ],
        help:
          "Quando marcada como concluída, todos os campos da conceitualização deverão estar preenchidos.",
      },
      {
        name: "queixaPrincipal",
        label: "Queixa principal",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Descreva a demanda principal apresentada no caso.",
      },
      {
        name: "pensamentosAutomaticos",
        label: "Pensamentos automáticos",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Registre os pensamentos automáticos identificados.",
      },
      {
        name: "emocoes",
        label: "Emoções",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Registre as emoções relevantes para a conceitualização.",
      },
      {
        name: "comportamentosManutencao",
        label: "Comportamentos de manutenção",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Descreva os comportamentos que contribuem para a manutenção do problema.",
      },
      {
        name: "crencas",
        label: "Crenças intermediárias e centrais",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Registre as crenças intermediárias e centrais identificadas.",
      },
      {
        name: "fatoresManutencao",
        label: "Fatores de manutenção",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Descreva fatores internos, externos e contextuais que mantêm o problema.",
      },
      {
        name: "objetivosTerapeuticos",
        label: "Objetivos terapêuticos",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Descreva os objetivos terapêuticos definidos para o caso.",
      },
      {
        name: "observacoes",
        label: "Observações",
        type: "textarea",
        rows: 3,
        maxLength: 5000,
        placeholder:
          "Inclua informações complementares relevantes.",
      },
    ];

    if (isAdmin) {
      patientFields.splice(3, 0, {
        name: "supervisorIds",
        label: "Supervisores responsáveis",
        type: "multiselect",
        required: true,
        defaultValue: [],
        options: supervisorOptions,
        fullWidth: true,
        help:
          "Selecione apenas supervisores atribuídos ao terapeuta escolhido. Use Ctrl no Windows ou Command no macOS para selecionar vários.",
      });
    }

    return patientFields;
  }, [
    isAdmin,
    clinicaOptions,
    terapeutaOptions,
    supervisorOptions,
  ]);

  const columns = useMemo(() => {
    const patientColumns = [
      {
        name: "nome",
        label: "Paciente / Terapeuta",

        render: (item) => {
          const terapeuta =
            terapeutasPorId[
              String(item.terapeutaId)
            ];

          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <strong
                style={{
                  color: "var(--sup-text)",
                  fontSize: "1rem",
                  lineHeight: "1.2",
                }}
              >
                {item.nome}
              </strong>

              <span
                style={{
                  color: "var(--sup-primary)",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                }}
              >
                {terapeuta?.nome ||
                  "Sem terapeuta"}
              </span>
            </div>
          );
        },

        searchValue: (item) => {
          const terapeuta =
            terapeutasPorId[
              String(item.terapeutaId)
            ];

          return [
            item.nome,
            terapeuta?.nome,
          ]
            .filter(Boolean)
            .join(" ");
        },
      },
      {
        name: "clinicaId",
        label: "Unidade",

        render: (item) => (
          <span
            style={{
              color: "var(--sup-muted)",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            {clinicasPorId[
              String(item.clinicaId)
            ]?.nome || "-"}
          </span>
        ),

        searchValue: (item) =>
          clinicasPorId[
            String(item.clinicaId)
          ]?.nome || "",
      },
      {
        name: "statusConceitualizacao",
        label: "Pré-supervisão",

        render: (item) => {
          const status =
            item.statusConceitualizacao ||
            "Rascunho";

          const className =
            status === "Concluída"
              ? "supervisao-inline-status"
              : "supervisao-inline-status neutral";

          return (
            <span className={className}>
              {status}
            </span>
          );
        },
      },
      {
        name: "nivelAtencao",
        label: "Nível de atenção",

        render: (item) => {
          const nivel =
            item.nivelAtencao || "Baixa";

          const color =
            nivel === "Alta"
              ? "#a43c32"
              : nivel === "Média"
                ? "#c98239"
                : "#6f8b6b";

          return (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.85rem",
                color: "var(--sup-text)",
                fontWeight: 800,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: color,
                }}
              />

              {nivel}
            </span>
          );
        },
      },
      {
        name: "statusCaso",
        label: "Status",

        render: (item) => {
          const status =
            item.statusCaso ||
            "Em acompanhamento";

          const isEncerrado =
            status === "Encerrado" ||
            status === "Alta";

          const isPausado =
            status === "Pausado";

          let className =
            "supervisao-inline-status";

          if (isEncerrado) {
            className += " archived";
          } else if (isPausado) {
            className += " neutral";
          }

          return (
            <span className={className}>
              {status}
            </span>
          );
        },
      },
    ];

    if (isAdmin) {
      patientColumns.splice(2, 0, {
        name: "supervisorIds",
        label: "Supervisores",

        render: (item) => {
          const supervisorIds =
            Array.isArray(
              item.supervisorIds
            )
              ? item.supervisorIds
              : [];

          if (
            supervisorIds.length === 0
          ) {
            return "Não atribuídos";
          }

          return supervisorIds
            .map(
              (supervisorId) =>
                supervisoresPorId[
                  String(supervisorId)
                ]?.nome ||
                "Supervisor não encontrado"
            )
            .join(", ");
        },

        searchValue: (item) => {
          const supervisorIds =
            Array.isArray(
              item.supervisorIds
            )
              ? item.supervisorIds
              : [];

          return supervisorIds.map(
            (supervisorId) => {
              const supervisor =
                supervisoresPorId[
                  String(supervisorId)
                ];

              return [
                supervisor?.nome,
                supervisor?.email,
              ]
                .filter(Boolean)
                .join(" ");
            }
          );
        },
      });
    }

    return patientColumns;
  }, [
    isAdmin,
    clinicasPorId,
    terapeutasPorId,
    supervisoresPorId,
  ]);

  const hasClinicas =
    clinicaOptions.length > 0;

  const hasTerapeutas =
    terapeutaOptions.length > 0;

  const hasSupervisores =
    !isAdmin ||
    supervisorOptions.length > 0;

  return (
    <>
      <Head>
        <title>
          Pacientes | Supervisão TCC
        </title>

        <meta
          name="description"
          content="Cadastro e conceitualização dos pacientes acompanhados no sistema de supervisão clínica."
        />
      </Head>

      <LayoutSupervisao
        title="Pacientes / Casos"
        description="Cadastre os casos, estruture a conceitualização cognitiva e defina os supervisores responsáveis."
        user={user}
        access={access}
        onLogout={onLogout}
      >
        {loadError && (
          <div className="supervisao-message error">
            {loadError}
          </div>
        )}

        {!loading && !hasClinicas && (
          <div className="supervisao-message">
            Cadastre pelo menos uma clínica
            antes de adicionar pacientes.
          </div>
        )}

        {!loading && !hasTerapeutas && (
          <div className="supervisao-message">
            Cadastre pelo menos um terapeuta
            antes de adicionar pacientes.
          </div>
        )}

        {!loading &&
          isAdmin &&
          !hasSupervisores && (
            <div className="supervisao-message">
              Cadastre pelo menos um
              supervisor ativo antes de
              atribuir pacientes.
            </div>
          )}

        {loading ? (
          <section className="supervisao-panel">
            <span className="supervisao-kicker">
              Preparando cadastro
            </span>

            <h2>
              Carregando vínculos clínicos...
            </h2>

            <p>
              Aguarde enquanto o sistema
              carrega clínicas, terapeutas
              e supervisores.
            </p>
          </section>
        ) : (
          <EntityCrud
            user={user}
            resource="pacientes"
            fields={fields}
            columns={columns}
            entityLabel="paciente"
            emptyText="Cadastre o primeiro paciente/caso para iniciar a supervisão."
          />
        )}
      </LayoutSupervisao>
    </>
  );
}