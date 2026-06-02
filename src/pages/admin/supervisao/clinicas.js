import Head from "next/head";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import EntityCrud from "@/components/supervisao/EntityCrud";

const fields = [
  { name: "nome", label: "Nome da clínica", required: true },
  { name: "cidade", label: "Cidade" },
  { name: "responsavel", label: "Responsável" },
  {
    name: "status",
    label: "Status",
    type: "select",
    defaultValue: "Ativa",
    options: [
      { value: "Ativa", label: "Ativa" },
      { value: "Inativa", label: "Inativa" },
    ],
  },
];

const columns = [
  { name: "nome", label: "Clínica" },
  { name: "cidade", label: "Cidade" },
  { name: "responsavel", label: "Responsável" },
  { name: "status", label: "Status" },
];

export default function ClinicasPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => (
        <>
          <Head><title>Clínicas | Supervisão TCC</title></Head>
          <LayoutSupervisao
            title="Clínicas"
            description="Cadastre as unidades ou clínicas que serão acompanhadas pela supervisora."
            user={user}
            onLogout={onLogout}
          >
            <EntityCrud
              user={user}
              resource="clinicas"
              fields={fields}
              columns={columns}
              entityLabel="clínica"
              emptyText="Cadastre a primeira clínica para começar."
            />
          </LayoutSupervisao>
        </>
      )}
    </AuthGuard>
  );
}
