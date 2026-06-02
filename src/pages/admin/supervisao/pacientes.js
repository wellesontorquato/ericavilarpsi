import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import EntityCrud from "@/components/supervisao/EntityCrud";
import { listResource } from "@/lib/supervisao/api";

export default function PacientesPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <PacientesContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function PacientesContent({ user, onLogout }) {
  const [clinicas, setClinicas] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);

  useEffect(() => {
    Promise.all([listResource(user, "clinicas"), listResource(user, "terapeutas")])
      .then(([clinicasData, terapeutasData]) => {
        setClinicas(clinicasData);
        setTerapeutas(terapeutasData);
      })
      .catch(console.error);
  }, [user]);

  const clinicaOptions = useMemo(
    () => clinicas.map((clinica) => ({ value: clinica.id, label: clinica.nome })),
    [clinicas]
  );

  const terapeutaOptions = useMemo(
    () => terapeutas.map((terapeuta) => ({ value: terapeuta.id, label: terapeuta.nome })),
    [terapeutas]
  );

  const fields = [
    { name: "nome", label: "Nome completo do paciente/caso", required: true },
    { name: "clinicaId", label: "Clínica", type: "select", options: clinicaOptions, required: true },
    { name: "terapeutaId", label: "Terapeuta responsável", type: "select", options: terapeutaOptions, required: true },
    { name: "dataInicio", label: "Data de início", type: "date" },
    {
      name: "statusCaso",
      label: "Status do caso",
      type: "select",
      defaultValue: "Em acompanhamento",
      options: [
        { value: "Em acompanhamento", label: "Em acompanhamento" },
        { value: "Alta", label: "Alta" },
        { value: "Pausado", label: "Pausado" },
        { value: "Encerrado", label: "Encerrado" },
      ],
    },
    {
      name: "nivelAtencao",
      label: "Nível de atenção",
      type: "select",
      defaultValue: "Média",
      options: [
        { value: "Baixa", label: "Baixa" },
        { value: "Média", label: "Média" },
        { value: "Alta", label: "Alta" },
      ],
    },
    { name: "queixaPrincipal", label: "Queixa principal", type: "textarea", rows: 3 },
    { name: "objetivosTerapeuticos", label: "Objetivos terapêuticos", type: "textarea", rows: 3 },
    { name: "observacoes", label: "Observações", type: "textarea", rows: 3 },
  ];

  const columns = [
    { name: "nome", label: "Paciente/Caso" },
    {
      name: "clinicaId",
      label: "Clínica",
      render: (item) => clinicas.find((clinica) => clinica.id === item.clinicaId)?.nome || "-",
    },
    {
      name: "terapeutaId",
      label: "Terapeuta",
      render: (item) => terapeutas.find((terapeuta) => terapeuta.id === item.terapeutaId)?.nome || "-",
    },
    { name: "statusCaso", label: "Status" },
    { name: "nivelAtencao", label: "Atenção" },
  ];

  return (
    <>
      <Head><title>Pacientes | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Pacientes / Casos"
        description="Cadastre os casos que serão acompanhados semanalmente."
        user={user}
        onLogout={onLogout}
      >
        <EntityCrud
          user={user}
          resource="pacientes"
          fields={fields}
          columns={columns}
          entityLabel="paciente"
              emptyText="Cadastre o primeiro paciente/caso para lançar supervisões."
        />
      </LayoutSupervisao>
    </>
  );
}
