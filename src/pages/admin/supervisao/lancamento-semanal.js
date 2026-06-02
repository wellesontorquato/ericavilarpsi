/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import Modal from "@/components/supervisao/Modal";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { createResource, deleteResource, listResource } from "@/lib/supervisao/api";
import { average, formatDecimal, mesNome, meses, semanas } from "@/lib/supervisao/format";

const currentDate = new Date();

const initialForm = {
  ano: String(currentDate.getFullYear()),
  mes: String(currentDate.getMonth() + 1),
  semana: "1",
  clinicaId: "",
  terapeutaId: "",
  pacienteId: "",
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
  evolucaoObjetivos: "",
  pontoForte: "",
  pontoDesenvolver: "",
  recomendacao: "",
  planoAcao: "",
  prazo: "",
  statusPlano: "Em andamento",
  observacao: "",
};

const scoreFields = [
  ["qualidadeConceitualizacao", "Qualidade da conceitualização"],
  ["planejamentoTerapeutico", "Planejamento terapêutico"],
  ["aplicacaoTecnicasTcc", "Aplicação de técnicas TCC"],
  ["manejoSessao", "Manejo da sessão"],
  ["posturaTerapeutica", "Postura terapêutica"],
  ["formulacaoHipoteses", "Formulação de hipóteses"],
];

const evolucaoFields = [
  ["crisesAnsiedade", "Crises de ansiedade/semana", 0, 99],
  ["qualidadeSono", "Qualidade do sono (0-10)", 0, 10],
  ["evitacaoSocial", "Evitação social (0-10)", 0, 10],
  ["adesaoTarefas", "Adesão às tarefas (%)", 0, 100],
  ["intensidadeSintomas", "Intensidade dos sintomas (0-10)", 0, 10],
  ["evolucaoObjetivos", "Evolução dos objetivos (%)", 0, 100],
];

function competenciaMedia(item) {
  return average(scoreFields.map(([field]) => item[field]));
}

export default function LancamentoSemanalPage() {
  return (
    <AuthGuard>
      {({ user, onLogout }) => <LancamentoContent user={user} onLogout={onLogout} />}
    </AuthGuard>
  );
}

function LancamentoContent({ user, onLogout }) {
  const [form, setForm] = useState(initialForm);
  const [clinicas, setClinicas] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  async function loadData() {
    try {
      const [clinicasData, terapeutasData, pacientesData, lancamentosData] = await Promise.all([
        listResource(user, "clinicas"),
        listResource(user, "terapeutas"),
        listResource(user, "pacientes"),
        listResource(user, "lancamentos"),
      ]);
      setClinicas(clinicasData);
      setTerapeutas(terapeutasData);
      setPacientes(pacientesData);
      setLancamentos(lancamentosData);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    }
  }

  useEffect(() => {
    loadData();
  }, [user]);

  const terapeutasFiltrados = useMemo(() => {
    if (!form.clinicaId) return terapeutas;
    return terapeutas.filter((item) => item.clinicaId === form.clinicaId);
  }, [terapeutas, form.clinicaId]);

  const pacientesFiltrados = useMemo(() => {
    return pacientes.filter((item) => {
      if (form.clinicaId && item.clinicaId !== form.clinicaId) return false;
      if (form.terapeutaId && item.terapeutaId !== form.terapeutaId) return false;
      return true;
    });
  }, [pacientes, form.clinicaId, form.terapeutaId]);

  const resumo = useMemo(() => {
    return {
      total: lancamentos.length,
      terapeutas: new Set(lancamentos.map((item) => item.terapeutaId).filter(Boolean)).size,
      pacientes: new Set(lancamentos.map((item) => item.pacienteId).filter(Boolean)).size,
      competencia: average(lancamentos.map(competenciaMedia)),
    };
  }, [lancamentos]);

  function setField(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };
      if (name === "clinicaId") {
        next.terapeutaId = "";
        next.pacienteId = "";
      }
      if (name === "terapeutaId") {
        next.pacienteId = "";
      }
      return next;
    });
  }

  function openModal() {
    setForm(initialForm);
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setForm(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      if (!form.ano || !form.mes || !form.semana) {
        throw new Error("Informe ano, mês e semana do lançamento.");
      }
      if (!form.clinicaId || !form.terapeutaId || !form.pacienteId) {
        throw new Error("Selecione clínica, terapeuta e paciente/caso.");
      }

      const clinica = clinicas.find((item) => item.id === form.clinicaId);
      const terapeuta = terapeutas.find((item) => item.id === form.terapeutaId);
      const paciente = pacientes.find((item) => item.id === form.pacienteId);

      const payload = {
        ...form,
        ano: Number(form.ano),
        mes: Number(form.mes),
        semana: Number(form.semana),
        clinicaNome: clinica?.nome || "",
        terapeutaNome: terapeuta?.nome || "",
        pacienteNome: paciente?.nome || "",
      };

      [...scoreFields, ...evolucaoFields].forEach(([name]) => {
        payload[name] = form[name] === "" ? "" : Number(form[name]);
      });

      await createResource(user, "lancamentos", payload);
      closeModal();
      setMessage({ type: "success", text: "Lançamento semanal salvo com sucesso." });
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm("Deseja excluir este lançamento semanal?");
    if (!confirmed) return;

    try {
      await deleteResource(user, "lancamentos", item.id);
      setMessage({ type: "success", text: "Lançamento excluído com sucesso." });
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    }
  }

  return (
    <>
      <Head><title>Lançamento semanal | Supervisão TCC</title></Head>
      <LayoutSupervisao
        title="Lançamentos semanais"
        description="Registre supervisões em um modal único, mantendo a tela principal limpa e prática."
        user={user}
        onLogout={onLogout}
        actions={<button className="supervisao-primary-button" type="button" onClick={openModal}>+ Novo lançamento</button>}
      >
        <StatusMessage message={message} />

        <section className="supervisao-indicator-grid launch-summary">
          <CardIndicador label="Lançamentos" value={resumo.total} detail="registros salvos" />
          <CardIndicador label="Terapeutas" value={resumo.terapeutas} detail="com lançamento" />
          <CardIndicador label="Pacientes/Casos" value={resumo.pacientes} detail="acompanhados" />
          <CardIndicador label="Média competência" value={formatDecimal(resumo.competencia)} detail="escala de 1 a 5" />
        </section>

        <section className="supervisao-panel supervisao-list-panel">
          <div className="supervisao-section-title">
            <h2>Histórico de lançamentos</h2>
            <span>{lancamentos.length} salvo(s)</span>
          </div>

          <div className="supervisao-record-grid lancamentos">
            {lancamentos.slice(0, 16).map((item) => (
              <article className="supervisao-record-card launch" key={item.id}>
                <header>
                  <strong>{item.pacienteNome || "Paciente/caso"}</strong>
                  <span>{mesNome(item.mes)} · S{item.semana}</span>
                </header>
                <dl>
                  <div>
                    <dt>Terapeuta</dt>
                    <dd>{item.terapeutaNome || "-"}</dd>
                  </div>
                  <div>
                    <dt>Clínica</dt>
                    <dd>{item.clinicaNome || "-"}</dd>
                  </div>
                  <div>
                    <dt>Competência média</dt>
                    <dd>{formatDecimal(competenciaMedia(item))}</dd>
                  </div>
                </dl>
                <p>{item.recomendacao || item.observacao || "Sem observação."}</p>
                <footer>
                  <button type="button" onClick={() => handleDelete(item)}>Excluir</button>
                </footer>
              </article>
            ))}
            {lancamentos.length === 0 && <p className="supervisao-empty">Nenhum lançamento semanal salvo ainda.</p>}
          </div>
        </section>

        <Modal
          open={modalOpen}
          title="Novo lançamento semanal"
          description="Preencha a identificação, notas clínicas, evolução do paciente e plano de ação em uma única janela."
          onClose={closeModal}
          size="xl"
        >
          <StatusMessage message={message} />

          <form className="supervisao-form supervisao-modal-form lancamento" onSubmit={handleSubmit}>
            <div className="supervisao-form-group full">
              <h2>1. Identificação do acompanhamento</h2>
              <p>Escolha o período, a clínica, o terapeuta e o paciente/caso supervisionado.</p>
            </div>

            <label>
              <span>Ano *</span>
              <input type="number" value={form.ano} onChange={(event) => setField("ano", event.target.value)} required />
            </label>

            <label>
              <span>Mês *</span>
              <select value={form.mes} onChange={(event) => setField("mes", event.target.value)} required>
                {meses.map((mes) => <option key={mes.value} value={mes.value}>{mes.label}</option>)}
              </select>
            </label>

            <label>
              <span>Semana *</span>
              <select value={form.semana} onChange={(event) => setField("semana", event.target.value)} required>
                {semanas.map((semana) => <option key={semana.value} value={semana.value}>{semana.label}</option>)}
              </select>
            </label>

            <label>
              <span>Clínica *</span>
              <select value={form.clinicaId} onChange={(event) => setField("clinicaId", event.target.value)} required>
                <option value="">Selecione</option>
                {clinicas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}
              </select>
            </label>

            <label>
              <span>Terapeuta *</span>
              <select value={form.terapeutaId} onChange={(event) => setField("terapeutaId", event.target.value)} required>
                <option value="">Selecione</option>
                {terapeutasFiltrados.map((terapeuta) => <option key={terapeuta.id} value={terapeuta.id}>{terapeuta.nome}</option>)}
              </select>
            </label>

            <label>
              <span>Paciente/Caso *</span>
              <select value={form.pacienteId} onChange={(event) => setField("pacienteId", event.target.value)} required>
                <option value="">Selecione</option>
                {pacientesFiltrados.map((paciente) => <option key={paciente.id} value={paciente.id}>{paciente.nome}</option>)}
              </select>
            </label>

            <div className="supervisao-form-group full">
              <h2>2. Competências clínicas do terapeuta</h2>
              <p>Escala de 1 a 5, seguindo a matriz de supervisão.</p>
            </div>

            {scoreFields.map(([name, label]) => (
              <label key={name}>
                <span>{label}</span>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={form[name]}
                  onChange={(event) => setField(name, event.target.value)}
                />
              </label>
            ))}

            <div className="supervisao-form-group full">
              <h2>3. Evolução do paciente</h2>
              <p>Indicadores acompanhados semanalmente.</p>
            </div>

            {evolucaoFields.map(([name, label, min, max]) => (
              <label key={name}>
                <span>{label}</span>
                <input
                  type="number"
                  min={min}
                  max={max}
                  value={form[name]}
                  onChange={(event) => setField(name, event.target.value)}
                />
              </label>
            ))}

            <div className="supervisao-form-group full">
              <h2>4. Plano de desenvolvimento e devolutiva</h2>
            </div>

            <label className="full">
              <span>Ponto forte do terapeuta</span>
              <textarea value={form.pontoForte} onChange={(event) => setField("pontoForte", event.target.value)} rows="3" />
            </label>

            <label className="full">
              <span>Ponto a desenvolver</span>
              <textarea value={form.pontoDesenvolver} onChange={(event) => setField("pontoDesenvolver", event.target.value)} rows="3" />
            </label>

            <label className="full">
              <span>Recomendação da supervisora</span>
              <textarea value={form.recomendacao} onChange={(event) => setField("recomendacao", event.target.value)} rows="3" />
            </label>

            <label className="full">
              <span>Plano de ação</span>
              <textarea value={form.planoAcao} onChange={(event) => setField("planoAcao", event.target.value)} rows="3" />
            </label>

            <label>
              <span>Prazo</span>
              <input type="date" value={form.prazo} onChange={(event) => setField("prazo", event.target.value)} />
            </label>

            <label>
              <span>Status do plano</span>
              <select value={form.statusPlano} onChange={(event) => setField("statusPlano", event.target.value)}>
                <option value="Pendente">Pendente</option>
                <option value="Em andamento">Em andamento</option>
                <option value="Concluído">Concluído</option>
              </select>
            </label>

            <label className="full">
              <span>Observação geral</span>
              <textarea value={form.observacao} onChange={(event) => setField("observacao", event.target.value)} rows="4" />
            </label>

            <div className="supervisao-form-actions full sticky-actions">
              <button className="supervisao-primary-button" type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar lançamento semanal"}
              </button>
              <button className="supervisao-secondary-button" type="button" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </form>
        </Modal>
      </LayoutSupervisao>
    </>
  );
}
