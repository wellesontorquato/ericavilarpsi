/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import Head from "next/head";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import Modal from "@/components/supervisao/Modal";
import StatusMessage from "@/components/supervisao/StatusMessage";
import {
  archiveResource,
  createResource,
  listResource,
  restoreResource,
  updateResource,
} from "@/lib/supervisao/api";
import {
  formatDecimal,
  mesNome,
  meses,
  semanas,
} from "@/lib/supervisao/format";

const PAGE_SIZE = 15;

const scoreFields = [
  {
    name: "qualidadeConceitualizacao",
    label: "Qualidade da conceitualizaÃ§Ã£o",
    min: 1,
    max: 5,
  },
  {
    name: "planejamentoTerapeutico",
    label: "Planejamento terapÃªutico",
    min: 1,
    max: 5,
  },
  {
    name: "aplicacaoTecnicasTcc",
    label: "AplicaÃ§Ã£o de tÃ©cnicas TCC",
    min: 1,
    max: 5,
  },
  {
    name: "manejoSessao",
    label: "Manejo da sessÃ£o",
    min: 1,
    max: 5,
  },
  {
    name: "posturaTerapeutica",
    label: "Postura terapÃªutica",
    min: 1,
    max: 5,
  },
  {
    name: "formulacaoHipoteses",
    label: "FormulaÃ§Ã£o de hipÃ³teses",
    min: 1,
    max: 5,
  },
];

const evolucaoFields = [
  {
    name: "crisesAnsiedade",
    label: "Crises de ansiedade por semana",
    min: 0,
    max: 99,
  },
  {
    name: "qualidadeSono",
    label: "Qualidade do sono",
    min: 0,
    max: 10,
  },
  {
    name: "evitacaoSocial",
    label: "EvitaÃ§Ã£o social",
    min: 0,
    max: 10,
  },
  {
    name: "adesaoTarefas",
    label: "AdesÃ£o Ã s tarefas",
    min: 0,
    max: 100,
    suffix: "%",
  },
  {
    name: "intensidadeSintomas",
    label: "Intensidade dos sintomas",
    min: 0,
    max: 10,
  },
  {
    name: "intensidadeComportamento",
    label: "Intensidade do comportamento",
    min: 0,
    max: 10,
  },
  {
    name: "aplicacaoEstrategias",
    label: "AplicaÃ§Ã£o das estratÃ©gias discutidas",
    min: 0,
    max: 100,
    suffix: "%",
  },
  {
    name: "evolucaoObjetivos",
    label: "EvoluÃ§Ã£o dos objetivos terapÃªuticos",
    min: 0,
    max: 100,
    suffix: "%",
  },
];

const allMetricFields = [
  ...scoreFields,
  ...evolucaoFields,
];

function createInitialForm() {
  const currentDate = new Date();

  return {
    ano: String(
      currentDate.getFullYear()
    ),
    mes: String(
      currentDate.getMonth() + 1
    ),
    semana: "1",
    clinicaId: "",
    terapeutaId: "",
    pacienteId: "",
    supervisorId: "",

    qualidadeConceitualizacao: "",
    planejamentoTerapeutico: "",
    aplicacaoTecnicasTcc: "",
    manejoSessao: "",
    posturaTerapeutica: "",
    formulacaoHipoteses: "",

    crisesAnsiedade: "",
    qualidadeSono: "",
    evitacaoSocial: "",
    adesaoTarefas: "",
    intensidadeSintomas: "",
    intensidadeComportamento: "",
    aplicacaoEstrategias: "",
    evolucaoObjetivos: "",

    emocaoElaborada: "",
    pontoForte: "",
    pontoDesenvolver: "",
    recomendacao: "",
    planoAcao: "",
    prazo: "",
    statusPlano: "Em andamento",
    observacao: "",
  };
}

function isBlankMetric(value) {
  return (
    value === undefined ||
    value === null ||
    value === ""
  );
}

function averageEvaluated(values = []) {
  const validValues = values
    .filter(
      (value) => !isBlankMetric(value)
    )
    .map(Number)
    .filter(Number.isFinite);

  if (validValues.length === 0) {
    return null;
  }

  const total = validValues.reduce(
    (sum, value) => sum + value,
    0
  );

  return total / validValues.length;
}

function competenciaMedia(item = {}) {
  return averageEvaluated(
    scoreFields.map(
      ({ name }) => item[name]
    )
  );
}

function countComputedCompetencies(item = {}) {
  return scoreFields.filter(
    ({ name }) =>
      !isBlankMetric(item[name]) &&
      Number.isFinite(Number(item[name]))
  ).length;
}

function isArchived(item) {
  return (
    item?.arquivado === true ||
    String(
      item?.statusRegistro || ""
    ).toLowerCase() === "arquivado"
  );
}

function getSupervisorIds(item = {}) {
  return Array.isArray(
    item?.supervisorIds
  )
    ? item.supervisorIds
        .map((id) =>
          String(id || "").trim()
        )
        .filter(Boolean)
    : [];
}

function isActiveSupervisor(item = {}) {
  return (
    !isArchived(item) &&
    String(
      item?.status || "Ativo"
    ).toLowerCase() !== "inativo"
  );
}

function normalizeLaunchForm(item = {}) {
  const initialForm =
    createInitialForm();

  return Object.keys(
    initialForm
  ).reduce((acc, key) => {
    acc[key] = isBlankMetric(
      item[key]
    )
      ? ""
      : String(item[key]);

    return acc;
  }, {});
}

function getIgnoredMetrics(item = {}) {
  return allMetricFields
    .filter(({ name }) =>
      isBlankMetric(item[name])
    )
    .map(({ name }) => name);
}

function getStatusClass(
  status,
  archived
) {
  if (archived) {
    return "archived";
  }

  const normalized = String(
    status || ""
  ).toLowerCase();

  if (normalized.includes("concl")) {
    return "";
  }

  if (
    normalized.includes(
      "andamento"
    ) ||
    normalized.includes("pendente")
  ) {
    return "neutral";
  }

  if (
    normalized.includes("atras") ||
    normalized.includes("venc")
  ) {
    return "danger";
  }

  return "neutral";
}

function MetricField({
  name,
  label,
  min,
  max,
  suffix,
  value,
  ignored,
  onValueChange,
  onIgnoredChange,
}) {
  const inputId = `metric-${name}`;
  const descriptionId =
    `${inputId}-description`;

  return (
    <div
      className={
        `supervisao-metric-field ${
          ignored
            ? "metric-disabled"
            : ""
        }`
      }
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "14px",
        border:
          "1px solid rgba(23, 55, 90, 0.14)",
        borderRadius: "12px",
        background: ignored
          ? "rgba(23, 55, 90, 0.04)"
          : "transparent",
        opacity: ignored ? 0.75 : 1,
      }}
    >
      <label
        htmlFor={inputId}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <span>
          {label}
          {suffix
            ? ` (${min}-${max}${suffix})`
            : ` (${min}-${max})`}
        </span>

        <input
          id={inputId}
          type="number"
          min={min}
          max={max}
          value={value}
          disabled={ignored}
          required={!ignored}
          aria-describedby={
            descriptionId
          }
          onChange={(event) =>
            onValueChange(
              event.target.value
            )
          }
        />
      </label>

      <label
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          fontSize: "0.84rem",
          fontWeight: 600,
        }}
      >
        <input
          type="checkbox"
          checked={ignored}
          onChange={(event) =>
            onIgnoredChange(
              event.target.checked
            )
          }
          style={{
            width: "auto",
            margin: 0,
          }}
        />

        <span>
          NÃ£o computar esta mÃ©trica
        </span>
      </label>

      <small id={descriptionId}>
        {ignored
          ? "Esta mÃ©trica nÃ£o participarÃ¡ da mÃ©dia final deste lanÃ§amento."
          : "Informe a pontuaÃ§Ã£o ou marque a opÃ§Ã£o acima para desconsiderÃ¡-la."}
      </small>
    </div>
  );
}

export default function LancamentoSemanalPage() {
  return (
    <AuthGuard>
      {({
        user,
        access,
        onLogout,
      }) => (
        <LancamentoContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function LancamentoContent({
  user,
  access,
  onLogout,
}) {
  const [form, setForm] = useState(
    () => createInitialForm()
  );

  const [
    ignoredMetrics,
    setIgnoredMetrics,
  ] = useState([]);

  const [editingId, setEditingId] =
    useState("");

  const [clinicas, setClinicas] =
    useState([]);

  const [
    supervisores,
    setSupervisores,
  ] = useState([]);

  const [terapeutas, setTerapeutas] =
    useState([]);

  const [pacientes, setPacientes] =
    useState([]);

  const [lancamentos, setLancamentos] =
    useState([]);

  const [loadingData, setLoadingData] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("ativos");

  const [page, setPage] =
    useState(1);

  const [message, setMessage] =
    useState({
      type: "",
      text: "",
    });

  async function loadData() {
    setLoadingData(true);

    try {
      const [
        supervisoresData,
        clinicasData,
        terapeutasData,
        pacientesData,
        lancamentosData,
      ] = await Promise.all([
        access?.isAdmin
          ? listResource(
              user,
              "supervisores"
            )
          : Promise.resolve(
              access?.supervisorId
                ? [
                    {
                      id:
                        access.supervisorId,
                      nome:
                        access.nome ||
                        "Supervisora autenticada",
                      email:
                        access.email ||
                        "",
                      status: "Ativo",
                    },
                  ]
                : []
            ),
        listResource(
          user,
          "clinicas"
        ),
        listResource(
          user,
          "terapeutas"
        ),
        listResource(
          user,
          "pacientes"
        ),
        listResource(
          user,
          "lancamentos"
        ),
      ]);

      setSupervisores(
        supervisoresData
      );
      setClinicas(clinicasData);
      setTerapeutas(terapeutasData);
      setPacientes(pacientesData);
      setLancamentos(
        lancamentosData
      );
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "NÃ£o foi possÃ­vel carregar os lanÃ§amentos.",
      });
    } finally {
      setLoadingData(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [
    user,
    access?.isAdmin,
    access?.supervisorId,
    access?.nome,
    access?.email,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    search,
    statusFilter,
    lancamentos.length,
  ]);

  const clinicasDisponiveis =
    useMemo(
      () =>
        clinicas.filter(
          (item) =>
            !isArchived(item) ||
            String(item.id) ===
              String(form.clinicaId)
        ),
      [
        clinicas,
        form.clinicaId,
      ]
    );

  const terapeutasDisponiveis =
    useMemo(
      () =>
        terapeutas.filter(
          (item) =>
            (!isArchived(item) &&
              item.status !==
                "Inativo") ||
            String(item.id) ===
              String(
                form.terapeutaId
              )
        ),
      [
        terapeutas,
        form.terapeutaId,
      ]
    );

  const pacientesDisponiveis =
    useMemo(
      () =>
        pacientes.filter((item) => {
          const status = String(
            item.statusCaso || ""
          ).toLowerCase();

          const active =
            !isArchived(item) &&
            !status.includes(
              "encerrado"
            ) &&
            !status.includes("alta");

          return (
            active ||
            String(item.id) ===
              String(form.pacienteId)
          );
        }),
      [
        pacientes,
        form.pacienteId,
      ]
    );

  const terapeutasFiltrados =
    useMemo(() => {
      if (!form.clinicaId) {
        return terapeutasDisponiveis;
      }

      return terapeutasDisponiveis.filter(
        (item) =>
          String(item.clinicaId) ===
          String(form.clinicaId)
      );
    }, [
      terapeutasDisponiveis,
      form.clinicaId,
    ]);

  const pacientesFiltrados =
    useMemo(
      () =>
        pacientesDisponiveis.filter(
          (item) => {
            if (
              form.clinicaId &&
              String(
                item.clinicaId
              ) !==
                String(
                  form.clinicaId
                )
            ) {
              return false;
            }

            if (
              form.terapeutaId &&
              String(
                item.terapeutaId
              ) !==
                String(
                  form.terapeutaId
                )
            ) {
              return false;
            }

            return true;
          }
        ),
      [
        pacientesDisponiveis,
        form.clinicaId,
        form.terapeutaId,
      ]
    );

  const pacienteSelecionado =
    useMemo(
      () =>
        pacientes.find(
          (item) =>
            String(item.id) ===
            String(form.pacienteId)
        ) || null,
      [
        pacientes,
        form.pacienteId,
      ]
    );

  const supervisoresFiltrados =
    useMemo(() => {
      const allowedIds = new Set(
        getSupervisorIds(
          pacienteSelecionado
        )
      );

      return supervisores.filter(
        (item) => {
          const id = String(
            item?.id || ""
          );

          const isCurrent =
            id ===
            String(
              form.supervisorId || ""
            );

          return (
            isCurrent ||
            (allowedIds.has(id) &&
              isActiveSupervisor(item))
          );
        }
      );
    }, [
      supervisores,
      pacienteSelecionado,
      form.supervisorId,
    ]);

  function defaultSupervisorId(
    pacienteId,
    existingId = ""
  ) {
    if (existingId) {
      return String(existingId);
    }

    const patient = pacientes.find(
      (item) =>
        String(item.id) ===
        String(pacienteId)
    );

    const allowedIds =
      getSupervisorIds(patient);

    if (!access?.isAdmin) {
      const currentId = String(
        access?.supervisorId || ""
      );

      return allowedIds.includes(
        currentId
      )
        ? currentId
        : "";
    }

    return allowedIds.length === 1
      ? allowedIds[0]
      : "";
  }

  const statusCounts = useMemo(() => {
    const arquivados =
      lancamentos.filter(
        isArchived
      ).length;

    return {
      todos: lancamentos.length,
      ativos:
        lancamentos.length -
        arquivados,
      arquivados,
    };
  }, [lancamentos]);

  const lancamentosFiltrados =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      return lancamentos.filter(
        (item) => {
          if (
            statusFilter ===
              "ativos" &&
            isArchived(item)
          ) {
            return false;
          }

          if (
            statusFilter ===
              "arquivados" &&
            !isArchived(item)
          ) {
            return false;
          }

          if (!query) {
            return true;
          }

          return [
            item.pacienteNome,
            item.terapeutaNome,
            item.clinicaNome,
            item.supervisorNome,
            item.recomendacao,
            item.observacao,
            item.statusPlano,
          ].some((value) =>
            String(value || "")
              .toLowerCase()
              .includes(query)
          );
        }
      );
    }, [
      lancamentos,
      search,
      statusFilter,
    ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      lancamentosFiltrados.length /
        PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const startIndex =
    (currentPage - 1) * PAGE_SIZE;

  const endIndex =
    startIndex + PAGE_SIZE;

  const lancamentosPaginados =
    lancamentosFiltrados.slice(
      startIndex,
      endIndex
    );

  const lancamentosAtivos =
    useMemo(
      () =>
        lancamentos.filter(
          (item) =>
            !isArchived(item)
        ),
      [lancamentos]
    );

  const resumo = useMemo(() => {
    const competencias =
      lancamentosAtivos
        .map(competenciaMedia)
        .filter(
          (value) => value !== null
        );

    return {
      total:
        lancamentosAtivos.length,

      terapeutas: new Set(
        lancamentosAtivos
          .map(
            (item) =>
              item.terapeutaId
          )
          .filter(Boolean)
      ).size,

      pacientes: new Set(
        lancamentosAtivos
          .map(
            (item) =>
              item.pacienteId
          )
          .filter(Boolean)
      ).size,

      competencia:
        averageEvaluated(
          competencias
        ),
    };
  }, [lancamentosAtivos]);

  function isMetricIgnored(name) {
    return ignoredMetrics.includes(
      name
    );
  }

  function setField(name, value) {
    setForm((current) => {
      const next = {
        ...current,
        [name]: value,
      };

      if (
        name === "clinicaId"
      ) {
        next.terapeutaId = "";
        next.pacienteId = "";
        next.supervisorId = "";
      }

      if (
        name === "terapeutaId"
      ) {
        next.pacienteId = "";
        next.supervisorId = "";
      }

      if (name === "pacienteId") {
        next.supervisorId =
          defaultSupervisorId(
            value
          );
      }

      return next;
    });
  }

  function toggleIgnoredMetric(
    name,
    checked
  ) {
    setIgnoredMetrics((current) => {
      if (checked) {
        return [
          ...new Set([
            ...current,
            name,
          ]),
        ];
      }

      return current.filter(
        (item) => item !== name
      );
    });

    if (checked) {
      setForm((current) => ({
        ...current,
        [name]: "",
      }));
    }
  }

  function openCreateModal() {
    setEditingId("");
    setForm({
      ...createInitialForm(),
      supervisorId:
        access?.isAdmin
          ? ""
          : String(
              access?.supervisorId ||
                ""
            ),
    });
    setIgnoredMetrics([]);

    setMessage({
      type: "",
      text: "",
    });

    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);

    if (item.supervisorId) {
      setSupervisores((current) => {
        const alreadyLoaded =
          current.some(
            (supervisora) =>
              String(
                supervisora.id
              ) ===
              String(
                item.supervisorId
              )
          );

        if (alreadyLoaded) {
          return current;
        }

        return [
          ...current,
          {
            id: item.supervisorId,
            nome:
              item.supervisorNome ||
              "Supervisora responsÃ¡vel",
            email:
              item.supervisorEmail ||
              "",
            status: "Ativo",
          },
        ];
      });
    }

    const normalized =
      normalizeLaunchForm(item);

    normalized.supervisorId =
      defaultSupervisorId(
        item.pacienteId,
        item.supervisorId
      );

    setForm(normalized);
    setIgnoredMetrics(
      getIgnoredMetrics(item)
    );

    setMessage({
      type: "",
      text: "",
    });

    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId("");
    setForm(createInitialForm());
    setIgnoredMetrics([]);
  }

  function validateMetricGroup(
    metricFields,
    groupLabel
  ) {
    const computedFields =
      metricFields.filter(
        ({ name }) =>
          !isMetricIgnored(name)
      );

    if (
      computedFields.length === 0
    ) {
      throw new Error(
        `Pelo menos uma mÃ©trica de ${groupLabel} deve ser computada.`
      );
    }

    const missingField =
      computedFields.find(
        ({ name }) =>
          isBlankMetric(
            form[name]
          )
      );

    if (missingField) {
      throw new Error(
        `Informe "${missingField.label}" ou marque a opÃ§Ã£o para nÃ£o computar essa mÃ©trica.`
      );
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      if (
        !form.ano ||
        !form.mes ||
        !form.semana
      ) {
        throw new Error(
          "Informe ano, mÃªs e semana do lanÃ§amento."
        );
      }

      if (
        !form.clinicaId ||
        !form.terapeutaId ||
        !form.pacienteId ||
        !form.supervisorId
      ) {
        throw new Error(
          "Selecione clÃ­nica, terapeuta, paciente/caso e supervisora responsÃ¡vel."
        );
      }

      const clinica = clinicas.find(
        (item) =>
          String(item.id) ===
          String(form.clinicaId)
      );

      const terapeuta =
        terapeutas.find(
          (item) =>
            String(item.id) ===
            String(
              form.terapeutaId
            )
        );

      const paciente =
        pacientes.find(
          (item) =>
            String(item.id) ===
            String(
              form.pacienteId
            )
        );

      const supervisora =
        supervisores.find(
          (item) =>
            String(item.id) ===
            String(
              form.supervisorId
            )
        );

      if (
        !clinica ||
        !terapeuta ||
        !paciente ||
        !supervisora
      ) {
        throw new Error(
          "Um dos vÃ­nculos selecionados nÃ£o foi encontrado."
        );
      }

      if (
        String(
          terapeuta.clinicaId
        ) !==
        String(clinica.id)
      ) {
        throw new Error(
          "O terapeuta selecionado nÃ£o pertence Ã  clÃ­nica informada."
        );
      }

      if (
        String(
          paciente.clinicaId
        ) !==
          String(clinica.id) ||
        String(
          paciente.terapeutaId
        ) !==
          String(terapeuta.id)
      ) {
        throw new Error(
          "O paciente selecionado nÃ£o pertence ao terapeuta e Ã  clÃ­nica informados."
        );
      }

      const originalLaunch =
        editingId
          ? lancamentos.find(
              (item) =>
                String(item.id) ===
                String(editingId)
            )
          : null;

      const keepsHistoricalSupervisor =
        originalLaunch?.supervisorId &&
        String(
          originalLaunch.supervisorId
        ) ===
          String(
            supervisora.id
          );

      if (
        !keepsHistoricalSupervisor &&
        !getSupervisorIds(
          paciente
        ).includes(
          String(
            supervisora.id
          )
        )
      ) {
        throw new Error(
          "A supervisora responsÃ¡vel nÃ£o estÃ¡ vinculada ao paciente selecionado."
        );
      }

      validateMetricGroup(
        scoreFields,
        "competÃªncia clÃ­nica"
      );

      validateMetricGroup(
        evolucaoFields,
        "evoluÃ§Ã£o do paciente"
      );

      const payload = {
        ...form,
        ano: Number(form.ano),
        mes: Number(form.mes),
        semana: Number(
          form.semana
        ),
        clinicaNome:
          clinica.nome || "",
        terapeutaNome:
          terapeuta.nome || "",
        pacienteNome:
          paciente.nome || "",
      };

      allMetricFields.forEach(
        ({ name }) => {
          payload[name] =
            isMetricIgnored(name)
              ? null
              : Number(form[name]);
        }
      );

      if (editingId) {
        await updateResource(
          user,
          "lancamentos",
          editingId,
          payload
        );

        setMessage({
          type: "success",
          text:
            "LanÃ§amento semanal atualizado com sucesso.",
        });
      } else {
        await createResource(
          user,
          "lancamentos",
          {
            ...payload,
            arquivado: false,
            statusRegistro: "Ativo",
          }
        );

        setMessage({
          type: "success",
          text:
            "LanÃ§amento semanal salvo com sucesso.",
        });
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "NÃ£o foi possÃ­vel salvar o lanÃ§amento.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(item) {
    const confirmed =
      window.confirm(
        "Deseja arquivar este lanÃ§amento semanal? Ele sairÃ¡ dos dashboards ativos, mas continuarÃ¡ salvo no histÃ³rico."
      );

    if (!confirmed) {
      return;
    }

    try {
      await archiveResource(
        user,
        "lancamentos",
        item.id
      );

      setMessage({
        type: "success",
        text:
          "LanÃ§amento arquivado com sucesso.",
      });

      await loadData();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "NÃ£o foi possÃ­vel arquivar o lanÃ§amento.",
      });
    }
  }

  async function handleRestore(item) {
    try {
      await restoreResource(
        user,
        "lancamentos",
        item.id
      );

      setMessage({
        type: "success",
        text:
          "LanÃ§amento restaurado com sucesso.",
      });

      await loadData();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "NÃ£o foi possÃ­vel restaurar o lanÃ§amento.",
      });
    }
  }

  const identityLocked =
    Boolean(editingId);

  return (
    <>
      <Head>
        <title>
          LanÃ§amento semanal |
          SupervisÃ£o TCC
        </title>

        <meta
          name="description"
          content="Registro semanal das competÃªncias clÃ­nicas e da evoluÃ§Ã£o dos pacientes acompanhados."
        />
      </Head>

      <LayoutSupervisao
        title="LanÃ§amentos semanais"
        description="Registre as competÃªncias avaliadas, a evoluÃ§Ã£o do paciente e as mÃ©tricas que nÃ£o foram computadas."
        user={user}
        access={access}
        onLogout={onLogout}
        actions={
          <button
            className="supervisao-primary-button"
            type="button"
            onClick={openCreateModal}
          >
            + Novo lanÃ§amento
          </button>
        }
      >
        <StatusMessage
          message={message}
        />

        <section className="supervisao-indicator-grid launch-summary">
          <CardIndicador
            label="LanÃ§amentos ativos"
            value={resumo.total}
            detail="registros no dashboard"
          />

          <CardIndicador
            label="Terapeutas"
            value={resumo.terapeutas}
            detail="com lanÃ§amento ativo"
          />

          <CardIndicador
            label="Pacientes/Casos"
            value={resumo.pacientes}
            detail="acompanhados"
          />

          <CardIndicador
            label="MÃ©dia competÃªncia"
            value={
              resumo.competencia ===
              null
                ? "-"
                : formatDecimal(
                    resumo.competencia
                  )
            }
            detail="somente mÃ©tricas computadas"
          />
        </section>

        <section className="supervisao-system-toolbar compact">
          <div>
            <span className="supervisao-kicker">
              HistÃ³rico
            </span>

            <h2>
              {
                lancamentosFiltrados.length
              }{" "}
              lanÃ§amento(s)
            </h2>

            <p>
              Use a busca e os filtros
              para revisar registros
              antigos ou restaurar itens
              arquivados.
            </p>
          </div>

          <div className="supervisao-toolbar-actions">
            <label className="supervisao-search-box">
              <span>Buscar</span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Paciente, terapeuta, supervisora, clÃ­nica..."
              />
            </label>
          </div>
        </section>

        <div
          className="supervisao-status-tabs"
          aria-label="Filtro dos lanÃ§amentos"
        >
          <button
            type="button"
            className={
              statusFilter === "ativos"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("ativos")
            }
          >
            Ativos{" "}
            <span>
              {statusCounts.ativos}
            </span>
          </button>

          <button
            type="button"
            className={
              statusFilter ===
              "arquivados"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "arquivados"
              )
            }
          >
            Arquivados{" "}
            <span>
              {
                statusCounts.arquivados
              }
            </span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "todos"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("todos")
            }
          >
            Todos{" "}
            <span>
              {statusCounts.todos}
            </span>
          </button>
        </div>

        <section className="supervisao-panel supervisao-list-panel supervisao-list-panel-table">
          <div className="supervisao-section-title supervisao-list-section-title">
            <div>
              <h2>
                HistÃ³rico de lanÃ§amentos
              </h2>

              <p>
                {
                  lancamentosFiltrados.length
                }{" "}
                salvo(s). Exibindo{" "}
                {
                  lancamentosPaginados.length
                }{" "}
                nesta pÃ¡gina.
              </p>
            </div>

            {lancamentosFiltrados.length >
              PAGE_SIZE && (
              <span>
                PÃ¡gina {currentPage} de{" "}
                {totalPages}
              </span>
            )}
          </div>

          {loadingData ? (
            <p>Carregando...</p>
          ) : lancamentosFiltrados.length ===
            0 ? (
            <p className="supervisao-empty">
              Nenhum lanÃ§amento semanal
              encontrado para o filtro
              selecionado.
            </p>
          ) : (
            <>
              <div className="supervisao-entity-list-wrap">
                <div
                  className="supervisao-entity-list supervisao-launch-list"
                  style={{
                    "--entity-grid":
                      "minmax(210px, 1.25fr) minmax(150px, 0.8fr) minmax(160px, 0.9fr) minmax(160px, 0.9fr) minmax(150px, 0.7fr) minmax(190px, auto)",
                  }}
                >
                  <div className="supervisao-entity-row supervisao-entity-row-head">
                    <div>
                      Paciente/Caso
                    </div>
                    <div>PerÃ­odo</div>
                    <div>
                      Terapeuta
                    </div>
                    <div>
                      Supervisora
                    </div>
                    <div>
                      CompetÃªncia
                    </div>
                    <div>AÃ§Ãµes</div>
                  </div>

                  {lancamentosPaginados.map(
                    (item) => {
                      const archived =
                        isArchived(item);

                      const competencia =
                        competenciaMedia(
                          item
                        );

                      const computedCount =
                        countComputedCompetencies(
                          item
                        );

                      return (
                        <article
                          className={
                            `supervisao-entity-row ${
                              archived
                                ? "archived"
                                : ""
                            }`
                          }
                          key={item.id}
                        >
                          <div
                            className="primary"
                            data-label="Paciente/Caso"
                          >
                            <strong>
                              {item.pacienteNome ||
                                "Paciente/caso"}
                            </strong>

                            <span
                              className={
                                `supervisao-inline-status ${getStatusClass(
                                  item.statusPlano,
                                  archived
                                )}`
                              }
                            >
                              {archived
                                ? "Arquivado"
                                : item.statusPlano ||
                                  "Ativo"}
                            </span>
                          </div>

                          <div data-label="PerÃ­odo">
                            <span>
                              {item.ano} Â·{" "}
                              {mesNome(
                                item.mes
                              )}{" "}
                              Â· Semana{" "}
                              {item.semana}
                            </span>
                          </div>

                          <div data-label="Terapeuta">
                            <span>
                              {item.terapeutaNome ||
                                "-"}
                            </span>

                            {item.clinicaNome && (
                              <small className="supervisao-row-muted">
                                {
                                  item.clinicaNome
                                }
                              </small>
                            )}
                          </div>

                          <div data-label="Supervisora">
                            <span>
                              {item.supervisorNome ||
                                "VÃ­nculo pendente"}
                            </span>

                            {item.supervisorEmail && (
                              <small className="supervisao-row-muted">
                                {
                                  item.supervisorEmail
                                }
                              </small>
                            )}
                          </div>

                          <div data-label="CompetÃªncia">
                            <span>
                              {competencia ===
                              null
                                ? "NÃ£o computada"
                                : `${formatDecimal(
                                    competencia
                                  )}/5`}
                            </span>

                            <small className="supervisao-row-muted">
                              {
                                computedCount
                              }
                              /{
                                scoreFields.length
                              }{" "}
                              avaliadas
                            </small>
                          </div>

                          <div
                            className="actions"
                            data-label="AÃ§Ãµes"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  item
                                )
                              }
                            >
                              Editar
                            </button>

                            {archived ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRestore(
                                    item
                                  )
                                }
                              >
                                Restaurar
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="danger"
                                onClick={() =>
                                  handleArchive(
                                    item
                                  )
                                }
                              >
                                Arquivar
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </div>

              {lancamentosFiltrados.length >
                PAGE_SIZE && (
                <div className="supervisao-pagination">
                  <button
                    type="button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                  >
                    Anterior
                  </button>

                  <span>
                    {startIndex + 1}-
                    {Math.min(
                      endIndex,
                      lancamentosFiltrados.length
                    )}{" "}
                    de{" "}
                    {
                      lancamentosFiltrados.length
                    }
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current + 1
                          )
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                  >
                    PrÃ³xima
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <Modal
          open={modalOpen}
          title={
            editingId
              ? "Editar lanÃ§amento semanal"
              : "Novo lanÃ§amento semanal"
          }
          description="Preencha a identificaÃ§Ã£o, as mÃ©tricas avaliadas e o plano de desenvolvimento."
          onClose={closeModal}
          size="xl"
        >
          <StatusMessage
            message={message}
          />

          <form
            className="supervisao-form supervisao-modal-form lancamento"
            onSubmit={handleSubmit}
          >
            <div className="supervisao-form-group full">
              <h2>
                1. IdentificaÃ§Ã£o do
                acompanhamento
              </h2>

              <p>
                Escolha o perÃ­odo, a
                clÃ­nica, o terapeuta e o
                paciente supervisionado,
                alÃ©m da supervisora
                responsÃ¡vel pelo registro.
              </p>

              {identityLocked && (
                <small>
                  O perÃ­odo e os vÃ­nculos
                  nÃ£o podem ser alterados
                  durante a ediÃ§Ã£o. Para
                  alterar essas
                  informaÃ§Ãµes, arquive o
                  lanÃ§amento e crie outro.
                </small>
              )}
            </div>

            <label>
              <span>Ano *</span>

              <input
                type="number"
                min="2000"
                max="2100"
                value={form.ano}
                disabled={identityLocked}
                onChange={(event) =>
                  setField(
                    "ano",
                    event.target.value
                  )
                }
                required
              />
            </label>

            <label>
              <span>MÃªs *</span>

              <select
                value={form.mes}
                disabled={identityLocked}
                onChange={(event) =>
                  setField(
                    "mes",
                    event.target.value
                  )
                }
                required
              >
                {meses.map((mes) => (
                  <option
                    key={mes.value}
                    value={mes.value}
                  >
                    {mes.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Semana *</span>

              <select
                value={form.semana}
                disabled={identityLocked}
                onChange={(event) =>
                  setField(
                    "semana",
                    event.target.value
                  )
                }
                required
              >
                {semanas.map(
                  (semana) => (
                    <option
                      key={
                        semana.value
                      }
                      value={
                        semana.value
                      }
                    >
                      {semana.label}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>ClÃ­nica *</span>

              <select
                value={form.clinicaId}
                disabled={identityLocked}
                onChange={(event) =>
                  setField(
                    "clinicaId",
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Selecione
                </option>

                {clinicasDisponiveis.map(
                  (clinica) => (
                    <option
                      key={clinica.id}
                      value={clinica.id}
                    >
                      {clinica.nome}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>Terapeuta *</span>

              <select
                value={form.terapeutaId}
                disabled={identityLocked}
                onChange={(event) =>
                  setField(
                    "terapeutaId",
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Selecione
                </option>

                {terapeutasFiltrados.map(
                  (terapeuta) => (
                    <option
                      key={
                        terapeuta.id
                      }
                      value={
                        terapeuta.id
                      }
                    >
                      {terapeuta.nome}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                Paciente/Caso *
              </span>

              <select
                value={form.pacienteId}
                disabled={identityLocked}
                onChange={(event) =>
                  setField(
                    "pacienteId",
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Selecione
                </option>

                {pacientesFiltrados.map(
                  (paciente) => (
                    <option
                      key={paciente.id}
                      value={paciente.id}
                    >
                      {paciente.nome}
                    </option>
                  )
                )}
              </select>
            </label>

            <label>
              <span>
                Supervisora responsÃ¡vel *
              </span>

              <select
                value={form.supervisorId}
                disabled={
                  identityLocked ||
                  !form.pacienteId ||
                  !access?.isAdmin
                }
                onChange={(event) =>
                  setField(
                    "supervisorId",
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  {form.pacienteId
                    ? "Selecione"
                    : "Selecione o paciente primeiro"}
                </option>

                {supervisoresFiltrados.map(
                  (supervisora) => (
                    <option
                      key={
                        supervisora.id
                      }
                      value={
                        supervisora.id
                      }
                    >
                      {supervisora.nome}
                      {supervisora.email
                        ? ` Â· ${supervisora.email}`
                        : ""}
                    </option>
                  )
                )}
              </select>

              <small>
                {access?.isAdmin
                  ? "A lista mostra somente as supervisoras vinculadas ao paciente."
                  : "Seu usuÃ¡rio Ã© vinculado automaticamente como responsÃ¡vel pelo lanÃ§amento."}
              </small>
            </label>

            <div className="supervisao-form-group full">
              <h2>
                2. CompetÃªncias clÃ­nicas
                do terapeuta
              </h2>

              <p>
                Escala de 1 a 5,
                seguindo a matriz de
                competÃªncias clÃ­nicas.
                Marque â€œNÃ£o computarâ€
                quando uma competÃªncia
                nÃ£o tiver sido avaliada
                nesta supervisÃ£o.
              </p>
            </div>

            {scoreFields.map(
              ({
                name,
                label,
                min,
                max,
              }) => (
                <MetricField
                  key={name}
                  name={name}
                  label={label}
                  min={min}
                  max={max}
                  value={form[name]}
                  ignored={isMetricIgnored(
                    name
                  )}
                  onValueChange={(
                    value
                  ) =>
                    setField(
                      name,
                      value
                    )
                  }
                  onIgnoredChange={(
                    checked
                  ) =>
                    toggleIgnoredMetric(
                      name,
                      checked
                    )
                  }
                />
              )
            )}

            <div className="supervisao-form-group full">
              <h2>
                3. EvoluÃ§Ã£o do paciente
              </h2>

              <p>
                Informe os indicadores
                avaliados neste perÃ­odo.
                MÃ©tricas marcadas como
                nÃ£o computadas ficarÃ£o
                fora da mÃ©dia final.
              </p>
            </div>

            {evolucaoFields.map(
              ({
                name,
                label,
                min,
                max,
                suffix,
              }) => (
                <MetricField
                  key={name}
                  name={name}
                  label={label}
                  min={min}
                  max={max}
                  suffix={suffix}
                  value={form[name]}
                  ignored={isMetricIgnored(
                    name
                  )}
                  onValueChange={(
                    value
                  ) =>
                    setField(
                      name,
                      value
                    )
                  }
                  onIgnoredChange={(
                    checked
                  ) =>
                    toggleIgnoredMetric(
                      name,
                      checked
                    )
                  }
                />
              )
            )}

            <label className="full">
              <span>
                EmoÃ§Ã£o a ser elaborada
              </span>

              <textarea
                value={
                  form.emocaoElaborada
                }
                onChange={(event) =>
                  setField(
                    "emocaoElaborada",
                    event.target.value
                  )
                }
                rows="2"
                maxLength="3000"
              />
            </label>

            <div className="supervisao-form-group full">
              <h2>
                4. Plano de
                desenvolvimento e
                devolutiva
              </h2>
            </div>

            <label className="full">
              <span>
                Ponto forte do terapeuta
              </span>

              <textarea
                value={form.pontoForte}
                onChange={(event) =>
                  setField(
                    "pontoForte",
                    event.target.value
                  )
                }
                rows="3"
                maxLength="3000"
              />
            </label>

            <label className="full">
              <span>
                Ponto a desenvolver
              </span>

              <textarea
                value={
                  form.pontoDesenvolver
                }
                onChange={(event) =>
                  setField(
                    "pontoDesenvolver",
                    event.target.value
                  )
                }
                rows="3"
                maxLength="3000"
              />
            </label>

            <label className="full">
              <span>
                RecomendaÃ§Ã£o do
                supervisor
              </span>

              <textarea
                value={
                  form.recomendacao
                }
                onChange={(event) =>
                  setField(
                    "recomendacao",
                    event.target.value
                  )
                }
                rows="3"
                maxLength="5000"
              />
            </label>

            <label className="full">
              <span>Plano de aÃ§Ã£o</span>

              <textarea
                value={form.planoAcao}
                onChange={(event) =>
                  setField(
                    "planoAcao",
                    event.target.value
                  )
                }
                rows="3"
                maxLength="5000"
              />
            </label>

            <label>
              <span>Prazo</span>

              <input
                type="date"
                value={form.prazo}
                onChange={(event) =>
                  setField(
                    "prazo",
                    event.target.value
                  )
                }
              />
            </label>

            <label>
              <span>
                Status do plano
              </span>

              <select
                value={form.statusPlano}
                onChange={(event) =>
                  setField(
                    "statusPlano",
                    event.target.value
                  )
                }
              >
                <option value="Pendente">
                  Pendente
                </option>

                <option value="Em andamento">
                  Em andamento
                </option>

                <option value="ConcluÃ­do">
                  ConcluÃ­do
                </option>
              </select>
            </label>

            <label className="full">
              <span>
                ObservaÃ§Ã£o geral
              </span>

              <textarea
                value={form.observacao}
                onChange={(event) =>
                  setField(
                    "observacao",
                    event.target.value
                  )
                }
                rows="4"
                maxLength="5000"
              />
            </label>

            <div className="supervisao-form-actions full sticky-actions">
              <button
                className="supervisao-primary-button"
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Salvando..."
                  : editingId
                    ? "Atualizar lanÃ§amento"
                    : "Salvar lanÃ§amento semanal"}
              </button>

              <button
                className="supervisao-secondary-button"
                type="button"
                onClick={closeModal}
                disabled={saving}
              >
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      </LayoutSupervisao>
    </>
  );
}