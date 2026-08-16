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

export default function ClinicasPage() {
  return (
    <AuthGuard>
      {({
        user,
        access,
        onLogout,
      }) => (
        <ClinicasContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function ClinicasContent({
  user,
  access,
  onLogout,
}) {
  const [supervisores, setSupervisores] =
    useState([]);

  const [
    loadingSupervisores,
    setLoadingSupervisores,
  ] = useState(true);

  const [
    supervisorError,
    setSupervisorError,
  ] = useState("");

  const isAdmin =
    access?.role === "admin" ||
    access?.isAdmin === true;

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    let cancelled = false;

    async function loadSupervisores() {
      try {
        const data = await listResource(
          user,
          "supervisores"
        );

        if (cancelled) {
          return;
        }

        setSupervisores(data);
        setSupervisorError("");
      } catch (error) {
        console.error(error);

        if (!cancelled) {
          setSupervisorError(
            error?.message ||
              "Não foi possível carregar os supervisores."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSupervisores(false);
        }
      }
    }

    loadSupervisores();

    return () => {
      cancelled = true;
    };
  }, [isAdmin, user]);

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

  const supervisorOptions = useMemo(
    () =>
      supervisores
        .filter(isActiveSupervisor)
        .map((supervisor) => ({
          value: supervisor.id,
          label: `${supervisor.nome} — ${supervisor.email}`,
        }))
        .sort((a, b) =>
          a.label.localeCompare(
            b.label,
            "pt-BR"
          )
        ),
    [supervisores]
  );

  const fields = useMemo(() => {
    const clinicFields = [
      {
        name: "nome",
        label: "Nome da clínica",
        required: true,
        maxLength: 160,
        placeholder:
          "Nome da clínica ou unidade",
      },
      {
        name: "cidade",
        label: "Cidade",
        maxLength: 160,
        placeholder: "Cidade da clínica",
      },
      {
        name: "responsavel",
        label: "Responsável",
        maxLength: 160,
        placeholder:
          "Responsável pela unidade",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Ativa",
        required: true,
        options: [
          {
            value: "Ativa",
            label: "Ativa",
          },
          {
            value: "Inativa",
            label: "Inativa",
          },
        ],
      },
    ];

    if (isAdmin) {
      clinicFields.splice(3, 0, {
        name: "supervisorIds",
        label:
          "Supervisores responsáveis",
        type: "multiselect",
        required: true,
        defaultValue: [],
        options: supervisorOptions,
        fullWidth: true,
        help:
          "Selecione um ou mais supervisores. Use Ctrl no Windows ou Command no macOS para selecionar vários.",
      });
    }

    return clinicFields;
  }, [isAdmin, supervisorOptions]);

  const columns = useMemo(() => {
    const clinicColumns = [
      {
        name: "nome",
        label: "Clínica",
      },
      {
        name: "cidade",
        label: "Cidade",
      },
      {
        name: "responsavel",
        label: "Responsável",
      },
      {
        name: "status",
        label: "Status",
      },
    ];

    if (isAdmin) {
      clinicColumns.splice(3, 0, {
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

    return clinicColumns;
  }, [isAdmin, supervisoresPorId]);

  const waitingForSupervisors =
    isAdmin && loadingSupervisores;

  return (
    <>
      <Head>
        <title>
          Clínicas | Supervisão TCC
        </title>

        <meta
          name="description"
          content="Cadastro e gerenciamento das clínicas acompanhadas no sistema de supervisão."
        />
      </Head>

      <LayoutSupervisao
        title="Clínicas"
        description="Cadastre as unidades acompanhadas e defina os supervisores responsáveis."
        user={user}
        access={access}
        onLogout={onLogout}
      >
        {supervisorError && (
          <div className="supervisao-message error">
            {supervisorError}
          </div>
        )}

        {isAdmin &&
          !loadingSupervisores &&
          supervisorOptions.length ===
            0 && (
            <div className="supervisao-message">
              Cadastre pelo menos um
              supervisor ativo antes de
              criar ou atribuir uma
              clínica.
            </div>
          )}

        {waitingForSupervisors ? (
          <section className="supervisao-panel">
            <span className="supervisao-kicker">
              Controle de acesso
            </span>

            <h2>
              Carregando supervisores...
            </h2>

            <p>
              Aguarde enquanto o sistema
              prepara as opções de
              atribuição das clínicas.
            </p>
          </section>
        ) : (
          <EntityCrud
            user={user}
            resource="clinicas"
            fields={fields}
            columns={columns}
            entityLabel="clínica"
            emptyText="Cadastre a primeira clínica para começar."
          />
        )}
      </LayoutSupervisao>
    </>
  );
}