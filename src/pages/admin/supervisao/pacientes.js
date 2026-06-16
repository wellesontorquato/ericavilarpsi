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
    () => clinicas
      .filter((clinica) => clinica.arquivado !== true && clinica.statusRegistro !== "Arquivado")
      .map((clinica) => ({ value: clinica.id, label: clinica.nome })),
    [clinicas]
  );

  const terapeutaOptions = useMemo(
    () => terapeutas
      .filter((terapeuta) => terapeuta.arquivado !== true && terapeuta.statusRegistro !== "Arquivado")
      .map((terapeuta) => ({ value: terapeuta.id, label: terapeuta.nome })),
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

  // Colunas redesenhadas usando as classes limpas do CSS
  const columns = [
    { 
      name: "nome", 
      label: "Paciente / Terapeuta",
      render: (item) => (
        <div className="paciente-col-nome">
          <strong>{item.nome}</strong>
          <span>
            {terapeutas.find((t) => t.id === item.terapeutaId)?.nome || "Sem terapeuta"}
          </span>
        </div>
      )
    },
    {
      name: "clinicaId",
      label: "Unidade Base",
      render: (item) => (
        <span className="paciente-col-unidade">
          {clinicas.find((c) => c.id === item.clinicaId)?.nome || "-"}
        </span>
      ),
    },
    { 
      name: "nivelAtencao", 
      label: "Risco Clínico",
      render: (item) => {
        const nivel = item.nivelAtencao || "Baixa";
        const isAlto = nivel === "Alta";
        const isMedio = nivel === "Média";
        
        let dotClass = "paciente-risco-dot baixo";
        if (isAlto) dotClass = "paciente-risco-dot alto";
        else if (isMedio) dotClass = "paciente-risco-dot medio";
        
        return (
          <span className="paciente-col-risco">
            <span className={dotClass}></span>
            {nivel}
          </span>
        );
      }
    },
    { 
      name: "statusCaso", 
      label: "Status do Caso",
      render: (item) => {
        const status = item.statusCaso || "Em acompanhamento";
        const isEncerrado = status === "Encerrado" || status === "Alta";
        const isPausado = status === "Pausado";
        
        // Puxa as classes nativas do seu CSS global para desenhar o Badge
        let className = "supervisao-inline-status";
        if (isEncerrado) className += " archived";
        else if (isPausado) className += " neutral";

        return <span className={className}>{status}</span>;
      }
    },
  ];

  return (
    <div className="pacientes-page-wrapper">
      <Head><title>Gestão de Casos | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Gestão de Casos e Pacientes"
        description="Cadastre os pacientes, defina o nível inicial de atenção e vincule-os aos terapeutas para acompanhamento."
        user={user}
        onLogout={onLogout}
      >
        <EntityCrud
          user={user}
          resource="pacientes"
          fields={fields}
          columns={columns}
          entityLabel="paciente"
          emptyText="Cadastre o primeiro paciente/caso para iniciar a gestão clínica."
        />
      </LayoutSupervisao>
    </div>
  );
}