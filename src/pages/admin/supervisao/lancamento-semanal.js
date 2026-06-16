/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import AuthGuard from "@/components/supervisao/AuthGuard";
import LayoutSupervisao from "@/components/supervisao/LayoutSupervisao";
import CardIndicador from "@/components/supervisao/CardIndicador";
import Modal from "@/components/supervisao/Modal";
import StatusMessage from "@/components/supervisao/StatusMessage";
import { archiveResource, createResource, listResource, restoreResource, updateResource } from "@/lib/supervisao/api";
import { average, formatDecimal, mesNome, meses, semanas } from "@/lib/supervisao/format";

const PAGE_SIZE = 15;
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

function isArchived(item) {
  return item?.arquivado === true || String(item?.statusRegistro || "").toLowerCase() === "arquivado";
}

function normalizeLaunchForm(item = {}) {
  return Object.keys(initialForm).reduce((acc, key) => {
    acc[key] = item[key] === undefined || item[key] === null ? initialForm[key] : String(item[key]);
    return acc;
  }, {});
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
  const [editingId, setEditingId] = useState("");
  const [clinicas, setClinicas] = useState([]);
  const [terapeutas, setTerapeutas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [lancamentos, setLancamentos] = useState([]);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ativos");
  const [page, setPage] = useState(1);
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

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, lancamentos.length]);

  const clinicasAtivas = useMemo(() => clinicas.filter((item) => !isArchived(item)), [clinicas]);
  const terapeutasAtivos = useMemo(() => terapeutas.filter((item) => !isArchived(item)), [terapeutas]);
  const pacientesAtivos = useMemo(() => pacientes.filter((item) => !isArchived(item)), [pacientes]);

  const terapeutasFiltrados = useMemo(() => {
    if (!form.clinicaId) return terapeutasAtivos;
    return terapeutasAtivos.filter((item) => item.clinicaId === form.clinicaId);
  }, [terapeutasAtivos, form.clinicaId]);

  const pacientesFiltrados = useMemo(() => {
    return pacientesAtivos.filter((item) => {
      if (form.clinicaId && item.clinicaId !== form.clinicaId) return false;
      if (form.terapeutaId && item.terapeutaId !== form.terapeutaId) return false;
      return true;
    });
  }, [pacientesAtivos, form.clinicaId, form.terapeutaId]);

  const statusCounts = useMemo(() => {
    const arquivados = lancamentos.filter(isArchived).length;
    return {
      todos: lancamentos.length,
      ativos: lancamentos.length - arquivados,
      arquivados,
    };
  }, [lancamentos]);

  const lancamentosFiltrados = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lancamentos.filter((item) => {
      if (statusFilter === "ativos" && isArchived(item)) return false;
      if (statusFilter === "arquivados" && !isArchived(item)) return false;

      if (!query) return true;

      return [
        item.pacienteNome,
        item.terapeutaNome,
        item.clinicaNome,
        item.recomendacao,
        item.observacao,
        item.statusPlano,
      ]
        .some((value) => String(value || "").toLowerCase().includes(query));
    });
  }, [lancamentos, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(lancamentosFiltrados.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const lancamentosPaginados = lancamentosFiltrados.slice(startIndex, endIndex);

  const lancamentosAtivos = useMemo(() => lancamentos.filter((item) => !isArchived(item)), [lancamentos]);

  const resumo = useMemo(() => {
    return {
      total: lancamentosAtivos.length,
      terapeutas: new Set(lancamentosAtivos.map((item) => item.terapeutaId).filter(Boolean)).size,
      pacientes: new Set(lancamentosAtivos.map((item) => item.pacienteId).filter(Boolean)).size,
      competencia: average(lancamentosAtivos.map(competenciaMedia)),
    };
  }, [lancamentosAtivos]);

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

  function openCreateModal() {
    setEditingId("");
    setForm(initialForm);
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm(normalizeLaunchForm(item));
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId("");
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

      if (editingId) {
        await updateResource(user, "lancamentos", editingId, payload);
        setMessage({ type: "success", text: "Lançamento semanal atualizado com sucesso." });
      } else {
        await createResource(user, "lancamentos", {
          ...payload,
          arquivado: false,
          statusRegistro: "Ativo",
        });
        setMessage({ type: "success", text: "Lançamento semanal salvo com sucesso." });
      }

      closeModal();
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(item) {
    const confirmed = window.confirm("Deseja arquivar este lançamento semanal? Ele sairá dos dashboards ativos, mas continuará salvo no histórico.");
    if (!confirmed) return;

    try {
      await archiveResource(user, "lancamentos", item.id);
      setMessage({ type: "success", text: "Lançamento arquivado com sucesso." });
      await loadData();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    }
  }

  async function handleRestore(item) {
    try {
      await restoreResource(user, "lancamentos", item.id);
      setMessage({ type: "success", text: "Lançamento restaurado com sucesso." });
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
        description="Registre, edite e arquive supervisões semanais sem perder o histórico clínico."
        user={user}
        onLogout={onLogout}
        actions={<button className="supervisao-primary-button" type="button" onClick={openCreateModal}>+ Novo lançamento</button>}
      >
        <StatusMessage message={message} />

        <section className="supervisao-indicator-grid launch-summary">
          <CardIndicador label="Lançamentos ativos" value={resumo.total} detail="registros em dashboard" />
          <CardIndicador label="Terapeutas" value={resumo.terapeutas} detail="com lançamento ativo" />
          <CardIndicador label="Pacientes/Casos" value={resumo.pacientes} detail="acompanhados" />
          <CardIndicador label="Média competência" value={formatDecimal(resumo.competencia)} detail="escala de 1 a 5" />
        </section>

        <section className="supervisao-system-toolbar compact">
          <div>
            <span className="supervisao-kicker">Histórico</span>
            <h2>{lancamentosFiltrados.length} lançamento(s)</h2>
            <p>Use a busca e os filtros para revisar registros antigos ou restaurar itens arquivados.</p>
          </div>
          <div className="supervisao-toolbar-actions">
            <label className="supervisao-search-box">
              <span>Buscar</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Paciente, terapeuta, clínica..." />
            </label>
          </div>
        </section>

        <div className="supervisao-status-tabs" aria-label="Filtro dos lançamentos">
          <button type="button" className={statusFilter === "ativos" ? "active" : ""} onClick={() => setStatusFilter("ativos")}>
            Ativos <span>{statusCounts.ativos}</span>
          </button>
          <button type="button" className={statusFilter === "arquivados" ? "active" : ""} onClick={() => setStatusFilter("arquivados")}>
            Arquivados <span>{statusCounts.arquivados}</span>
          </button>
          <button type="button" className={statusFilter === "todos" ? "active" : ""} onClick={() => setStatusFilter("todos")}>
            Todos <span>{statusCounts.todos}</span>
          </button>
        </div>

        <section className="supervisao-panel supervisao-list-panel supervisao-list-panel-table">
          <div className="supervisao-section-title supervisao-list-section-title">
            <div>
              <h2>Histórico de lançamentos</h2>
              <p>
                {lancamentosFiltrados.length} salvo(s). Exibindo {lancamentosPaginados.length} nesta página.
              </p>
            </div>
            {lancamentosFiltrados.length > PAGE_SIZE && (
              <span>Página {currentPage} de {totalPages}</span>
            )}
          </div>

          {lancamentosFiltrados.length === 0 ? (
            <p className="supervisao-empty">Nenhum lançamento semanal encontrado para o filtro selecionado.</p>
          ) : (
            <>
              <div className="supervisao-entity-list-wrap">
                <div className="supervisao-entity-list supervisao-launch-list">
                  <div className="supervisao-entity-row supervisao-entity-row-head">
                    <div>Paciente/Caso</div>
                    <div>Período</div>
                    <div>Terapeuta</div>
                    <div>Competência</div>
                    <div>Ações</div>
                  </div>

                  {lancamentosPaginados.map((item) => {
                    const archived = isArchived(item);

                    return (
                      <article className={`supervisao-entity-row ${archived ? "archived" : ""}`} key={item.id}>
                        <div className="primary" data-label="Paciente/Caso">
                          <strong>{item.pacienteNome || "Paciente/caso"}</strong>
                          <span className={`supervisao-inline-status ${archived ? "archived" : ""}`}>
                            {archived ? "Arquivado" : item.statusPlano || "Ativo"}
                          </span>
                        </div>

                        <div data-label="Período">
                          <span>{item.ano} · {mesNome(item.mes)} · Semana {item.semana}</span>
                        </div>

                        <div data-label="Terapeuta">
                          <span>{item.terapeutaNome || "-"}</span>
                          {item.clinicaNome && <small className="supervisao-row-muted">{item.clinicaNome}</small>}
                        </div>

                        <div data-label="Competência">
                          <span>{formatDecimal(competenciaMedia(item))}/5</span>
                        </div>

                        <div className="actions" data-label="Ações">
                          <button type="button" onClick={() => openEditModal(item)}>Editar</button>
                          {archived ? (
                            <button type="button" onClick={() => handleRestore(item)}>Restaurar</button>
                          ) : (
                            <button type="button" className="danger" onClick={() => handleArchive(item)}>Arquivar</button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              {lancamentosFiltrados.length > PAGE_SIZE && (
                <div className="supervisao-pagination">
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                  <span>
                    {startIndex + 1}-{Math.min(endIndex, lancamentosFiltrados.length)} de {lancamentosFiltrados.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <Modal
          open={modalOpen}
          title={editingId ? "Editar lançamento semanal" : "Novo lançamento semanal"}
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
                {clinicasAtivas.map((clinica) => <option key={clinica.id} value={clinica.id}>{clinica.nome}</option>)}
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
                {saving ? "A salvar..." : editingId ? "Atualizar lançamento" : "Salvar lançamento semanal"}
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