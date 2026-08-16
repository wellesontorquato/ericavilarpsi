import Head from "next/head";
import AuthGuard from "@/components/supervisao/AuthGuard";
import EntityCrud from "@/components/supervisao/EntityCrud";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";

const fields = [
  {
    name: "nome",
    label: "Nome completo",
    required: true,
    maxLength: 160,
    placeholder: "Nome do supervisor",
  },
  {
    name: "email",
    label: "E-mail de acesso",
    type: "email",
    required: true,
    maxLength: 254,
    autoComplete: "email",
    placeholder: "supervisor@exemplo.com",
    help:
      "Utilize exatamente o mesmo e-mail que será convidado no Netlify Identity.",
  },
  {
    name: "status",
    label: "Status do acesso",
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
    label: "Observação administrativa",
    type: "textarea",
    rows: 4,
    maxLength: 2000,
    placeholder:
      "Informações internas sobre o supervisor, vínculo ou responsabilidade.",
  },
];

const columns = [
  {
    name: "nome",
    label: "Supervisor",
  },
  {
    name: "email",
    label: "E-mail",
  },
  {
    name: "status",
    label: "Status",
  },
];

export default function SupervisoresPage() {
  return (
    <AuthGuard>
      {({ user, access, onLogout }) => (
        <SupervisoresContent
          user={user}
          access={access}
          onLogout={onLogout}
        />
      )}
    </AuthGuard>
  );
}

function SupervisoresContent({
  user,
  access,
  onLogout,
}) {
  const isAdmin =
    access?.role === "admin" ||
    access?.isAdmin === true;

  if (!isAdmin) {
    return (
      <>
        <Head>
          <title>
            Acesso restrito | Supervisão TCC
          </title>
        </Head>

        <LayoutSupervisao
          title="Acesso restrito"
          description="Esta área é exclusiva do administrador geral."
          user={user}
          onLogout={onLogout}
        >
          <section className="supervisao-panel">
            <span className="supervisao-kicker">
              Permissão necessária
            </span>

            <h2>
              Gerenciamento de supervisores
            </h2>

            <p>
              Somente o administrador geral pode
              cadastrar, editar, inativar ou
              arquivar supervisores.
            </p>
          </section>
        </LayoutSupervisao>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          Supervisores | Supervisão TCC
        </title>

        <meta
          name="description"
          content="Gerenciamento dos supervisores autorizados no sistema de supervisão clínica."
        />
      </Head>

      <LayoutSupervisao
        title="Supervisores"
        description="Cadastre os profissionais autorizados e controle quem poderá receber clínicas, terapeutas e pacientes."
        user={user}
        onLogout={onLogout}
      >
        <section className="supervisao-panel">
          <span className="supervisao-kicker">
            Controle de acesso
          </span>

          <h2>
            Como funciona o cadastro
          </h2>

          <p>
            O cadastro nesta página concede ao
            profissional um perfil de supervisor.
            O e-mail informado deve ser o mesmo
            utilizado no convite do Netlify
            Identity.
          </p>

          <p>
            Após o cadastro, o supervisor ainda
            precisará ser atribuído às clínicas,
            terapeutas e pacientes que poderá
            visualizar.
          </p>
        </section>

        <EntityCrud
          user={user}
          resource="supervisores"
          fields={fields}
          columns={columns}
          entityLabel="supervisor"
          emptyText="Nenhum supervisor foi cadastrado."
        />
      </LayoutSupervisao>
    </>
  );
}