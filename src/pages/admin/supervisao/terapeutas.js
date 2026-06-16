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
    () => clinicas
      .filter((clinica) => clinica.arquivado !== true && clinica.statusRegistro !== "Arquivado")
      .map((clinica) => ({ value: clinica.id, label: clinica.nome })),
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

  // Colunas redesenhadas usando as classes limpas do CSS
  const columns = [
    { 
      name: "nome", 
      label: "Terapeuta",
      render: (item) => (
        <div className="terapeuta-col-nome">
          <strong>{item.nome}</strong>
          <span>Equipa Clínica</span>
        </div>
      )
    },
    {
      name: "clinicaId",
      label: "Clínica Base",
      render: (item) => (
        <span className="terapeuta-col-clinica">
          {clinicas.find((clinica) => clinica.id === item.clinicaId)?.nome || "Não vinculada"}
        </span>
      ),
    },
    { 
      name: "dataEntrada", 
      label: "Data de Entrada",
      render: (item) => {
        if (!item.dataEntrada) return <span className="terapeuta-col-data">-</span>;
        
        // Formata AAAA-MM-DD para DD/MM/AAAA
        const parts = item.dataEntrada.split('-');
        const formattedDate = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : item.dataEntrada;
        
        return <span className="terapeuta-col-data">{formattedDate}</span>;
      }
    },
    { 
      name: "status", 
      label: "Status",
      render: (item) => {
        const status = item.status || "Ativo";
        const isInativo = status === "Inativo";
        
        // Usa a mesma classe global de pílulas de status que configurámos
        let className = "supervisao-inline-status";
        if (isInativo) className += " archived";

        return <span className={className}>{status}</span>;
      }
    },
  ];

  return (
    <div className="terapeutas-page-wrapper">
      <Head><title>Terapeutas | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Equipa Terapêutica"
        description="Cadastre os profissionais que terão as suas competências clínicas acompanhadas pela supervisão."
        user={user}
        onLogout={onLogout}
      >
        <EntityCrud
          user={user}
          resource="terapeutas"
          fields={fields}
          columns={columns}
          entityLabel="terapeuta"
          emptyText="Nenhum terapeuta cadastrado ainda. Adicione o primeiro membro da equipa."
        />
      </LayoutSupervisao>
    </div>
  );
}