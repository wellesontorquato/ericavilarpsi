/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { createResource, deleteResource, listResource, updateResource } from "@/lib/supervisao/api";
import StatusMessage from "./StatusMessage";

function buildInitialState(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || "";
    return acc;
  }, {});
}

export default function EntityCrud({ user, resource, fields, columns, emptyText, afterLoad }) {
  const initialState = useMemo(() => buildInitialState(fields), [fields]);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(initialState);
    setEditingId("");
  }

  function handleEdit(item) {
    const nextForm = { ...initialState };
    fields.forEach((field) => {
      nextForm[field.name] = item[field.name] ?? field.defaultValue ?? "";
    });
    setForm(nextForm);
    setEditingId(item.id);
    setMessage({ type: "info", text: "Editando registro selecionado." });
    window.scrollTo({ top: 0, behavior: "smooth" });
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

      resetForm();
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
    <div className="supervisao-grid-two">
      <section className="supervisao-panel">
        <h2>{editingId ? "Editar registro" : "Novo registro"}</h2>
        <StatusMessage message={message} />

        <form className="supervisao-form" onSubmit={handleSubmit}>
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
              {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
            </button>
            {editingId && (
              <button className="supervisao-secondary-button" type="button" onClick={resetForm}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="supervisao-panel">
        <div className="supervisao-section-title">
          <h2>Registros</h2>
          <span>{items.length} encontrado(s)</span>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : items.length === 0 ? (
          <p className="supervisao-empty">{emptyText || "Nenhum registro encontrado."}</p>
        ) : (
          <div className="supervisao-table-wrap">
            <table className="supervisao-table">
              <thead>
                <tr>
                  {columns.map((column) => <th key={column.name}>{column.label}</th>)}
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td key={column.name}>{column.render ? column.render(item) : item[column.name] || "-"}</td>
                    ))}
                    <td>
                      <div className="supervisao-row-actions">
                        <button type="button" onClick={() => handleEdit(item)}>Editar</button>
                        <button type="button" onClick={() => handleDelete(item)}>Excluir</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
