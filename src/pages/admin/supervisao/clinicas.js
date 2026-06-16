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

// Colunas com Renderização Rica (SaaS Premium)
const columns = [
  { 
    name: "nome", 
    label: "Clínica / Localização",
    render: (item) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <strong style={{ color: "var(--sup-text)", fontSize: "1.05rem", lineHeight: "1.2" }}>
          {item.nome}
        </strong>
        <span style={{ color: "var(--sup-primary-dark)", fontSize: "0.82rem", fontWeight: 700 }}>
          {item.cidade || "Localização não informada"}
        </span>
      </div>
    )
  },
  { 
    name: "responsavel", 
    label: "Responsável",
    render: (item) => (
      <span style={{ color: "var(--sup-muted)", fontSize: "0.9rem", fontWeight: 600 }}>
        {item.responsavel || "-"}
      </span>
    )
  },
  { 
    name: "status", 
    label: "Status",
    render: (item) => {
      const status = item.status || "Ativa";
      const isInativa = status === "Inativa";
      
      // Usa a mesma classe global de pílulas de status que já configuramos
      let className = "supervisao-inline-status";
      if (isInativa) className += " archived";

      return <span className={className}>{status}</span>;
    }
  },
];

export default function ClinicasPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => (
        <div className="clinicas-page-wrapper">
          <Head><title>Clínicas | Supervisão TCC</title></Head>
          <LayoutSupervisao
            title="Unidades Clínicas"
            description="Cadastre e gerencie as unidades, polos ou clínicas que serão acompanhadas pela supervisão."
            user={user}
            onLogout={onLogout}
          >
            <EntityCrud
              user={user}
              resource="clinicas"
              fields={fields}
              columns={columns}
              entityLabel="clínica"
              emptyText="Nenhuma clínica cadastrada ainda. Adicione a primeira unidade para iniciar."
            />
          </LayoutSupervisao>
        </div>
      )}
    </AuthGuard>
  );
}