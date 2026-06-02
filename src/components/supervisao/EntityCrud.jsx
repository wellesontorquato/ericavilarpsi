/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { archiveResource, createResource, listResource, restoreResource, updateResource } from "@/lib/supervisao/api";
import Modal from "./Modal";
import StatusMessage from "./StatusMessage";

function buildInitialState(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});
}

function getPrimaryText(item, columns) {
  const firstColumn = columns?.[0];
  if (!firstColumn) return item.nome || "Registro";
  return firstColumn.render ? firstColumn.render(item) : item[firstColumn.name] || "Registro";
}

function isArchived(item) {
  return item?.arquivado === true || String(item?.statusRegistro || "").toLowerCase() === "arquivado";
}

function statusLabel(item) {
  if (isArchived(item)) return "Arquivado";
  return item.status || item.statusCaso || item.nivelAtencao || "Ativo";
}

export default function EntityCrud({ user, resource, fields, columns, emptyText, afterLoad, entityLabel = "registro" }) {
  const initialState = useMemo(() => buildInitialState(fields), [fields]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ativos");
  const [message, setMessage] = useState({ type: "", text: "" });

  async function loadItems() {
    setLoading(true);
    try {
      const data = await listResource(user, resource);
      setItems(data);
      afterLoad?.(data);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [user, resource]);

  const statusCounts = useMemo(() => {
    const arquivados = items.filter(isArchived).length;
    return {
      todos: items.length,
      ativos: items.length - arquivados,
      arquivados,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((item) => {
      if (statusFilter === "ativos" && isArchived(item)) return false;
      if (statusFilter === "arquivados" && !isArchived(item)) return false;

      if (!query) return true;

      return columns.some((column) => {
        const value = column.render ? column.render(item) : item[column.name];
        return String(value || "").toLowerCase().includes(query);
      });
    });
  }, [items, columns, search, statusFilter]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(initialState);
    setEditingId("");
  }

  function openCreateModal() {
    resetForm();
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  function handleEdit(item) {
    const nextForm = { ...initialState };
    fields.forEach((field) => {
      nextForm[field.name] = item[field.name] ?? field.defaultValue ?? "";
    });
    setForm(nextForm);
    setEditingId(item.id);
    setMessage({ type: "", text: "" });
    setModalOpen(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const requiredField = fields.find((field) => field.required && !String(form[field.name] || "").trim());
      if (requiredField) {
        throw new Error(`Preencha o campo obrigatório: ${requiredField.label}.`);
      }

      if (editingId) {
        await updateResource(user, resource, editingId, form);
        setMessage({ type: "success", text: "Registro atualizado com sucesso." });
      } else {
        await createResource(user, resource, {
          ...form,
          arquivado: false,
          statusRegistro: "Ativo",
        });
        setMessage({ type: "success", text: "Registro salvo com sucesso." });
      }

      closeModal();
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(item) {
    const confirmed = window.confirm(`Deseja arquivar este ${entityLabel}? Ele sairá dos dashboards, mas continuará salvo para consulta.`);
    if (!confirmed) return;

    try {
      await archiveResource(user, resource, item.id);
      setMessage({ type: "success", text: "Registro arquivado com sucesso." });
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    }
  }

  async function handleRestore(item) {
    try {
      await restoreResource(user, resource, item.id);
      setMessage({ type: "success", text: "Registro restaurado com sucesso." });
      await loadItems();
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: error.message });
    }
  }

  return (
    <>
      <StatusMessage message={message} />

      <section className="supervisao-system-toolbar">
        <div>
          <span className="supervisao-kicker">Gestão</span>
          <h2>{statusCounts.ativos} {statusCounts.ativos === 1 ? entityLabel : `${entityLabel}s`} ativo(s)</h2>
          <p>Cadastre, edite e arquive registros sem apagar o histórico da supervisão.</p>
        </div>
        <div className="supervisao-toolbar-actions">
          <label className="supervisao-search-box">
            <span>Buscar</span>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Digite para filtrar..." />
          </label>
          <button className="supervisao-primary-button" type="button" onClick={openCreateModal}>
            + Novo {entityLabel}
          </button>
        </div>
      </section>

      <div className="supervisao-status-tabs" aria-label="Filtro de status dos registros">
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

      <section className="supervisao-panel supervisao-list-panel">
        <div className="supervisao-section-title">
          <h2>Registros</h2>
          <span>{filteredItems.length} encontrado(s)</span>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : filteredItems.length === 0 ? (
          <p className="supervisao-empty">{search ? "Nenhum registro encontrado com esse filtro." : emptyText || "Nenhum registro encontrado."}</p>
        ) : (
          <div className="supervisao-record-grid">
            {filteredItems.map((item) => {
              const archived = isArchived(item);

              return (
                <article className={`supervisao-record-card ${archived ? "archived" : ""}`} key={item.id}>
                  <header>
                    <strong>{getPrimaryText(item, columns)}</strong>
                    <span>{statusLabel(item)}</span>
                  </header>
                  <dl>
                    {columns.slice(1, 4).map((column) => (
                      <div key={column.name}>
                        <dt>{column.label}</dt>
                        <dd>{column.render ? column.render(item) : item[column.name] || "-"}</dd>
                      </div>
                    ))}
                  </dl>
                  {archived && <p>Registro arquivado. Ele não entra nos dashboards ativos, mas pode ser restaurado.</p>}
                  <footer>
                    <button type="button" onClick={() => handleEdit(item)}>Editar</button>
                    {archived ? (
                      <button type="button" onClick={() => handleRestore(item)}>Restaurar</button>
                    ) : (
                      <button type="button" className="danger" onClick={() => handleArchive(item)}>Arquivar</button>
                    )}
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Modal
        open={modalOpen}
        title={editingId ? `Editar ${entityLabel}` : `Novo ${entityLabel}`}
        description="Preencha os campos abaixo e salve. O registro será enviado para a base do sistema."
        onClose={closeModal}
        size="large"
      >
        <StatusMessage message={message} />
        <form className="supervisao-form supervisao-modal-form" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <label key={field.name} className={field.type === "textarea" ? "full" : ""}>
              <span>{field.label}{field.required ? " *" : ""}</span>
              {field.type === "select" ? (
                <select
                  value={form[field.name] || ""}
                  onChange={(event) => setField(field.name, event.target.value)}
                  required={field.required}
                >
                  <option value="">Selecione</option>
                  {(field.options || []).map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={form[field.name] || ""}
                  onChange={(event) => setField(field.name, event.target.value)}
                  placeholder={field.placeholder || ""}
                  rows={field.rows || 4}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  value={form[field.name] || ""}
                  onChange={(event) => setField(field.name, event.target.value)}
                  placeholder={field.placeholder || ""}
                  min={field.min}
                  max={field.max}
                  required={field.required}
                />
              )}
            </label>
          ))}

          <div className="supervisao-form-actions full">
            <button className="supervisao-primary-button" type="submit" disabled={saving}>
              {saving ? "Salvando..." : editingId ? "Atualizar registro" : "Salvar registro"}
            </button>
            <button className="supervisao-secondary-button" type="button" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
