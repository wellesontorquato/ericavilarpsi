/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { createResource, deleteResource, listResource } from "@/lib/supervisao/api";
import { meses, semanas, mesNome } from "@/lib/supervisao/format";

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

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
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
      setForm(initialForm);
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
        title="Lançamento semanal"
        description="Registre a avaliação da supervisão, competências clínicas e evolução do caso em uma única tela."
        user={user}
        onLogout={onLogout}
      >
        <StatusMessage message={message} />

        <div className="supervisao-grid-two wide-left">
          <section className="supervisao-panel">
            <form className="supervisao-form" onSubmit={handleSubmit}>
              <div className="supervisao-form-group full">
                <h2>Identificação do acompanhamento</h2>
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
                <h2>Competências clínicas do terapeuta</h2>
                <p>Escala de 1 a 5, seguindo a matriz da supervisão.</p>
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
                <h2>Evolução do paciente</h2>
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
                <h2>Plano de desenvolvimento e devolutiva</h2>
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

              <div className="supervisao-form-actions full">
                <button className="supervisao-primary-button" type="submit" disabled={saving}>
                  {saving ? "Salvando..." : "Salvar lançamento semanal"}
                </button>
              </div>
            </form>
          </section>

          <section className="supervisao-panel">
            <div className="supervisao-section-title">
              <h2>Últimos lançamentos</h2>
              <span>{lancamentos.length}</span>
            </div>

            <div className="supervisao-timeline">
              {lancamentos.slice(0, 8).map((item) => (
                <article key={item.id}>
                  <strong>{item.pacienteNome || "Paciente/caso"}</strong>
                  <span>{item.terapeutaNome || "Terapeuta"} · {mesNome(item.mes)} / {item.ano} · Semana {item.semana}</span>
                  <p>{item.recomendacao || item.observacao || "Sem observação."}</p>
                  <button type="button" onClick={() => handleDelete(item)}>Excluir</button>
                </article>
              ))}
              {lancamentos.length === 0 && <p className="supervisao-empty">Nenhum lançamento semanal salvo ainda.</p>}
            </div>
          </section>
        </div>
      </LayoutSupervisao>
    </>
  );
}
