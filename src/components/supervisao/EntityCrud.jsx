/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { createResource, deleteResource, listResource, updateResource } from "@/lib/supervisao/api";
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

export default function EntityCrud({ user, resource, fields, columns, emptyText, afterLoad, entityLabel = "registro" }) {
  const initialState = useMemo(() => buildInitialState(fields), [fields]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
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

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((item) => {
      return columns.some((column) => {
        const value = column.render ? column.render(item) : item[column.name];
        return String(value || "").toLowerCase().includes(query);
      });
    });
  }, [items, columns, search]);

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
        await createResource(user, resource, form);
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

  async function handleDelete(item) {
    const confirmed = window.confirm("Deseja realmente excluir este registro?");
    if (!confirmed) return;

    try {
      await deleteResource(user, resource, item.id);
      setMessage({ type: "success", text: "Registro excluído com sucesso." });
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
          <h2>{items.length} {items.length === 1 ? entityLabel : `${entityLabel}s`}</h2>
          <p>Cadastre, edite e acompanhe os registros em uma tela de sistema.</p>
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
            {filteredItems.map((item) => (
              <article className="supervisao-record-card" key={item.id}>
                <header>
                  <strong>{getPrimaryText(item, columns)}</strong>
                  {(item.status || item.statusCaso || item.nivelAtencao) && (
                    <span>{item.status || item.statusCaso || item.nivelAtencao}</span>
                  )}
                </header>
                <dl>
                  {columns.slice(1, 4).map((column) => (
                    <div key={column.name}>
                      <dt>{column.label}</dt>
                      <dd>{column.render ? column.render(item) : item[column.name] || "-"}</dd>
                    </div>
                  ))}
                </dl>
                <footer>
                  <button type="button" onClick={() => handleEdit(item)}>Editar</button>
                  <button type="button" onClick={() => handleDelete(item)}>Excluir</button>
                </footer>
              </article>
            ))}
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
