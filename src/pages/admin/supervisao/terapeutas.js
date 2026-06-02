import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import EntityCrud from "@/components/supervisao/EntityCrud";
import { listResource } from "@/lib/supervisao/api";

export default function TerapeutasPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <TerapeutasContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function TerapeutasContent({ user, onLogout }) {
  const [clinicas, setClinicas] = useState([]);

  useEffect(() => {
    listResource(user, "clinicas").then(setClinicas).catch(console.error);
  }, [user]);

  const clinicaOptions = useMemo(
    () => clinicas.map((clinica) => ({ value: clinica.id, label: clinica.nome })),
    [clinicas]
  );

  const fields = [
    { name: "nome", label: "Nome completo", required: true },
    { name: "clinicaId", label: "Clínica", type: "select", options: clinicaOptions, required: true },
    { name: "dataEntrada", label: "Data de entrada", type: "date" },
    {
      name: "status",
      label: "Status",
      type: "select",
      defaultValue: "Ativo",
      options: [
        { value: "Ativo", label: "Ativo" },
        { value: "Inativo", label: "Inativo" },
      ],
    },
    { name: "observacao", label: "Observação", type: "textarea", rows: 3 },
  ];

  const columns = [
    { name: "nome", label: "Terapeuta" },
    {
      name: "clinicaId",
      label: "Clínica",
      render: (item) => clinicas.find((clinica) => clinica.id === item.clinicaId)?.nome || "-",
    },
    { name: "dataEntrada", label: "Entrada" },
    { name: "status", label: "Status" },
  ];

  return (
    <>
      <Head><title>Terapeutas | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Terapeutas"
        description="Cadastre os profissionais que terão competências clínicas acompanhadas."
        user={user}
        onLogout={onLogout}
      >
        <EntityCrud
          user={user}
          resource="terapeutas"
          fields={fields}
          columns={columns}
          entityLabel="terapeuta"
              emptyText="Cadastre o primeiro terapeuta supervisionado."
        />
      </LayoutSupervisao>
    </>
  );
}
