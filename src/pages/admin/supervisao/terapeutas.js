import Head from "next/head";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import EntityCrud from "@/components/supervisao/EntityCrud";
import { listResource } from "@/lib/supervisao/api";

function isArchived(item) {
  return (
    item?.arquivado === true ||
    String(item?.statusRegistro || "")
      .toLowerCase() === "arquivado"
  );
}

function isActiveSupervisor(supervisor) {
  return (
    !isArchived(supervisor) &&
    String(
      supervisor?.status || "Ativo"
    ).toLowerCase() === "ativo"
  );
}

export default function TerapeutasPage() {
  return (
    <AuthGuard>
      {({
        user,
        access,
        onLogout,
      }) => (
        <TerapeutasContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function TerapeutasContent({
  user,
  access,
  onLogout,
}) {
  const [clinicas, setClinicas] =
    useState([]);

  const [supervisores, setSupervisores] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const isAdmin =
    access?.role === "admin" ||
    access?.isAdmin === true;

  useEffect(() => {
    let cancelled = false;

    async function loadDependencies() {
      try {
        const requests = [
          listResource(
            user,
            "clinicas"
          ),
        ];

        if (isAdmin) {
          requests.push(
            listResource(
              user,
              "supervisores"
            )
          );
        }

        const [
          clinicasData,
          supervisoresData = [],
        ] = await Promise.all(requests);

        if (cancelled) {
          return;
        }

        setClinicas(clinicasData);
        setSupervisores(
          supervisoresData
        );
        setLoadError("");
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setLoadError(
            error?.message ||
              "Não foi possível carregar as clínicas e os supervisores."
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
        (clinica) =>
          !isArchived(clinica)
      ),
    [clinicas]
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

  const supervisoresPorId = useMemo(
    () =>
      Object.fromEntries(
        supervisores.map(
          (supervisor) => [
            String(supervisor.id),
            supervisor,
          ]
        )
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
          a.label.localeCompare(
            b.label,
            "pt-BR"
          )
        ),
    [clinicasAtivas]
  );

  const supervisorOptions = useMemo(
    () =>
      supervisores
        .filter(isActiveSupervisor)
        .map((supervisor) => {
          const clinicasDoSupervisor =
            clinicasAtivas.filter(
              (clinica) =>
                Array.isArray(
                  clinica.supervisorIds
                ) &&
                clinica.supervisorIds
                  .map(String)
                  .includes(
                    String(
                      supervisor.id
                    )
                  )
            );

          const clinicasLabel =
            clinicasDoSupervisor
              .map(
                (clinica) =>
                  clinica.nome
              )
              .join(", ");

          return {
            value: supervisor.id,
            label: clinicasLabel
              ? `${supervisor.nome} — ${clinicasLabel}`
              : `${supervisor.nome} — sem clínica atribuída`,
          };
        })
        .sort((a, b) =>
          a.label.localeCompare(
            b.label,
            "pt-BR"
          )
        ),
    [
      supervisores,
      clinicasAtivas,
    ]
  );

  const fields = useMemo(() => {
    const therapistFields = [
      {
        name: "nome",
        label: "Nome completo",
        required: true,
        maxLength: 160,
        placeholder:
          "Nome do terapeuta",
      },
      {
        name: "clinicaId",
        label: "Clínica",
        type: "select",
        options: clinicaOptions,
        required: true,
        help:
          "Selecione a clínica em que o terapeuta será acompanhado.",
      },
      {
        name: "dataEntrada",
        label: "Data de entrada",
        type: "date",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Ativo",
        required: true,
        options: [
          {
            value: "Ativo",
            label: "Ativo",
          },
          {
            value: "Inativo",
            label: "Inativo",
          },
        ],
      },
      {
        name: "observacao",
        label: "Observação",
        type: "textarea",
        rows: 3,
        maxLength: 3000,
        placeholder:
          "Informações relevantes sobre o terapeuta.",
      },
    ];

    if (isAdmin) {
      therapistFields.splice(2, 0, {
        name: "supervisorIds",
        label:
          "Supervisores responsáveis",
        type: "multiselect",
        required: true,
        defaultValue: [],
        options: supervisorOptions,
        fullWidth: true,
        help:
          "Selecione apenas supervisores atribuídos à clínica escolhida. Use Ctrl no Windows ou Command no macOS para selecionar vários.",
      });
    }

    return therapistFields;
  }, [
    isAdmin,
    clinicaOptions,
    supervisorOptions,
  ]);

  const columns = useMemo(() => {
    const therapistColumns = [
      {
        name: "nome",
        label: "Terapeuta",
      },
      {
        name: "clinicaId",
        label: "Clínica",

        render: (item) =>
          clinicasPorId[
            String(item.clinicaId)
          ]?.nome || "-",

        searchValue: (item) =>
          clinicasPorId[
            String(item.clinicaId)
          ]?.nome || "",
      },
      {
        name: "dataEntrada",
        label: "Entrada",
      },
      {
        name: "status",
        label: "Status",
      },
    ];

    if (isAdmin) {
      therapistColumns.splice(2, 0, {
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

    return therapistColumns;
  }, [
    isAdmin,
    clinicasPorId,
    supervisoresPorId,
  ]);

  const hasClinicas =
    clinicaOptions.length > 0;

  const hasSupervisores =
    !isAdmin ||
    supervisorOptions.length > 0;

  return (
    <>
      <Head>
        <title>
          Terapeutas | Supervisão TCC
        </title>

        <meta
          name="description"
          content="Cadastro dos terapeutas acompanhados no sistema de supervisão clínica."
        />
      </Head>

      <LayoutSupervisao
        title="Terapeutas"
        description="Cadastre os profissionais supervisionados e defina quem poderá acompanhar seus pacientes e competências clínicas."
        user={user}
        access={access}
        onLogout={onLogout}
      >
        {loadError && (
          <div className="supervisao-message error">
            {loadError}
          </div>
        )}

        {!loading &&
          !hasClinicas && (
            <div className="supervisao-message">
              Cadastre pelo menos uma
              clínica antes de adicionar
              terapeutas.
            </div>
          )}

        {!loading &&
          isAdmin &&
          !hasSupervisores && (
            <div className="supervisao-message">
              Cadastre pelo menos um
              supervisor ativo antes de
              atribuir terapeutas.
            </div>
          )}

        {loading ? (
          <section className="supervisao-panel">
            <span className="supervisao-kicker">
              Preparando cadastro
            </span>

            <h2>
              Carregando clínicas e
              supervisores...
            </h2>

            <p>
              Aguarde enquanto o sistema
              verifica as opções
              disponíveis para atribuição.
            </p>
          </section>
        ) : (
          <EntityCrud
            user={user}
            resource="terapeutas"
            fields={fields}
            columns={columns}
            entityLabel="terapeuta"
            emptyText="Cadastre o primeiro terapeuta supervisionado."
          />
        )}
      </LayoutSupervisao>
    </>
  );
}