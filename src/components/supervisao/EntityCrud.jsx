/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  archiveResource,
  createResource,
  listResource,
  restoreResource,
  updateResource,
} from "@/lib/supervisao/api";
import Modal from "./Modal";
import StatusMessage from "./StatusMessage";

const PAGE_SIZE = 15;

function isMultipleField(field) {
  return field.multiple === true || field.type === "multiselect";
}

function buildInitialState(fields) {
  return fields.reduce((acc, field) => {
    acc[field.name] = isMultipleField(field)
      ? Array.isArray(field.defaultValue)
        ? field.defaultValue
        : []
      : field.defaultValue ?? "";

    return acc;
  }, {});
}

function buildPlural(label = "registro") {
  if (label.endsWith("a")) return `${label}s`;
  if (label.endsWith("e")) return `${label}s`;
  if (label.endsWith("o")) return `${label}s`;

  return `${label}s`;
}

function getCellValue(item, column) {
  const value = column.render
    ? column.render(item)
    : item[column.name];

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "-";
  }

  return value;
}

function normalizeSearchValue(value) {
  if (Array.isArray(value)) {
    return value
      .map(normalizeSearchValue)
      .join(" ");
  }

  if (
    ["string", "number", "boolean"].includes(typeof value)
  ) {
    return String(value);
  }

  return "";
}

function getSearchValue(item, column) {
  if (column.searchValue) {
    return normalizeSearchValue(
      column.searchValue(item)
    );
  }

  return normalizeSearchValue(item[column.name]);
}

function renderCellValue(value, primary = false) {
  const isText = ["string", "number"].includes(
    typeof value
  );

  if (!isText) {
    return value;
  }

  return primary
    ? <strong>{value}</strong>
    : <span>{value}</span>;
}

function isArchived(item) {
  return (
    item?.arquivado === true ||
    String(item?.statusRegistro || "")
      .toLowerCase() === "arquivado"
  );
}

function statusLabel(item) {
  if (isArchived(item)) {
    return "Arquivado";
  }

  return (
    item.status ||
    item.statusCaso ||
    item.nivelAtencao ||
    "Ativo"
  );
}

export default function EntityCrud({
  user,
  resource,
  fields,
  columns,
  emptyText,
  afterLoad,
  entityLabel = "registro",
}) {
  const initialState = useMemo(
    () => buildInitialState(fields),
    [fields]
  );

  const pluralLabel = useMemo(
    () => buildPlural(entityLabel),
    [entityLabel]
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialState);
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("ativos");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  async function loadItems() {
    setLoading(true);

    try {
      const data = await listResource(
        user,
        resource
      );

      setItems(data);
      afterLoad?.(data);
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Não foi possível carregar os registros.",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, [user, resource]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, items.length]);

  const statusCounts = useMemo(() => {
    const arquivados = items.filter(
      isArchived
    ).length;

    return {
      todos: items.length,
      ativos: items.length - arquivados,
      arquivados,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return items.filter((item) => {
      if (
        statusFilter === "ativos" &&
        isArchived(item)
      ) {
        return false;
      }

      if (
        statusFilter === "arquivados" &&
        !isArchived(item)
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      return columns.some((column) => {
        const value = getSearchValue(
          item,
          column
        );

        return value
          .toLowerCase()
          .includes(query);
      });
    });
  }, [
    items,
    columns,
    search,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredItems.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const startIndex =
    (currentPage - 1) * PAGE_SIZE;

  const endIndex =
    startIndex + PAGE_SIZE;

  const paginatedItems =
    filteredItems.slice(
      startIndex,
      endIndex
    );

  const gridTemplateColumns = useMemo(() => {
    const extraColumns = Math.max(
      columns.length - 1,
      0
    );

    return (
      `minmax(220px, 1.35fr) ` +
      `repeat(${extraColumns}, minmax(132px, 1fr)) ` +
      `minmax(170px, auto)`
    );
  }, [columns.length]);

  function setField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(initialState);
    setEditingId("");
  }

  function openCreateModal() {
    resetForm();

    setMessage({
      type: "",
      text: "",
    });

    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    resetForm();
  }

  function handleEdit(item) {
    const nextForm = {
      ...initialState,
    };

    fields.forEach((field) => {
      if (isMultipleField(field)) {
        nextForm[field.name] = Array.isArray(
          item[field.name]
        )
          ? item[field.name]
          : Array.isArray(field.defaultValue)
            ? field.defaultValue
            : [];

        return;
      }

      nextForm[field.name] =
        item[field.name] ??
        field.defaultValue ??
        "";
    });

    setForm(nextForm);
    setEditingId(item.id);

    setMessage({
      type: "",
      text: "",
    });

    setModalOpen(true);
  }

  function findRequiredField() {
    return fields.find((field) => {
      if (!field.required) {
        return false;
      }

      const value = form[field.name];

      if (isMultipleField(field)) {
        return (
          !Array.isArray(value) ||
          value.length === 0
        );
      }

      return !String(value ?? "").trim();
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    setMessage({
      type: "",
      text: "",
    });

    try {
      const requiredField =
        findRequiredField();

      if (requiredField) {
        throw new Error(
          `Preencha o campo obrigatório: ${requiredField.label}.`
        );
      }

      if (editingId) {
        await updateResource(
          user,
          resource,
          editingId,
          form
        );

        setMessage({
          type: "success",
          text: "Registro atualizado com sucesso.",
        });
      } else {
        await createResource(
          user,
          resource,
          {
            ...form,
            arquivado: false,
            statusRegistro: "Ativo",
          }
        );

        setMessage({
          type: "success",
          text: "Registro salvo com sucesso.",
        });
      }

      closeModal();
      await loadItems();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Não foi possível salvar o registro.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleArchive(item) {
    const confirmed = window.confirm(
      `Deseja arquivar este ${entityLabel}? ` +
      "Ele sairá dos dashboards, mas continuará salvo para consulta."
    );

    if (!confirmed) {
      return;
    }

    try {
      await archiveResource(
        user,
        resource,
        item.id
      );

      setMessage({
        type: "success",
        text: "Registro arquivado com sucesso.",
      });

      await loadItems();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Não foi possível arquivar o registro.",
      });
    }
  }

  async function handleRestore(item) {
    try {
      await restoreResource(
        user,
        resource,
        item.id
      );

      setMessage({
        type: "success",
        text: "Registro restaurado com sucesso.",
      });

      await loadItems();
    } catch (error) {
      console.error(error);

      setMessage({
        type: "error",
        text:
          error?.message ||
          "Não foi possível restaurar o registro.",
      });
    }
  }

  return (
    <>
      <StatusMessage message={message} />

      <section className="supervisao-list-hero">
        <div className="supervisao-list-hero-copy">
          <span className="supervisao-kicker">
            Cadastros
          </span>

          <h2>
            {pluralLabel
              .charAt(0)
              .toUpperCase() +
              pluralLabel.slice(1)}
          </h2>

          <p>
            Visualize os registros em lista,
            filtre rapidamente e mantenha a
            base organizada mesmo com alto
            volume de dados.
          </p>
        </div>

        <button
          className="supervisao-primary-button"
          type="button"
          onClick={openCreateModal}
        >
          + Novo {entityLabel}
        </button>
      </section>

      <section
        className="supervisao-list-stats"
        aria-label="Resumo dos registros"
      >
        <article>
          <span>Ativos</span>
          <strong>
            {statusCounts.ativos}
          </strong>
          <small>
            em uso nos dashboards
          </small>
        </article>

        <article>
          <span>Arquivados</span>
          <strong>
            {statusCounts.arquivados}
          </strong>
          <small>
            fora dos dashboards ativos
          </small>
        </article>

        <article>
          <span>Total</span>
          <strong>
            {statusCounts.todos}
          </strong>
          <small>
            registros na base
          </small>
        </article>
      </section>

      <section className="supervisao-list-controls">
        <label className="supervisao-search-box supervisao-search-box-wide">
          <span>
            Buscar {entityLabel}
          </span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar por nome, clínica, status ou informação da lista..."
          />
        </label>

        <div
          className="supervisao-status-tabs"
          aria-label="Filtro de status dos registros"
        >
          <button
            type="button"
            className={
              statusFilter === "ativos"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("ativos")
            }
          >
            Ativos{" "}
            <span>
              {statusCounts.ativos}
            </span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "arquivados"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter(
                "arquivados"
              )
            }
          >
            Arquivados{" "}
            <span>
              {statusCounts.arquivados}
            </span>
          </button>

          <button
            type="button"
            className={
              statusFilter === "todos"
                ? "active"
                : ""
            }
            onClick={() =>
              setStatusFilter("todos")
            }
          >
            Todos{" "}
            <span>
              {statusCounts.todos}
            </span>
          </button>
        </div>
      </section>

      <section className="supervisao-panel supervisao-list-panel supervisao-list-panel-table">
        <div className="supervisao-section-title supervisao-list-section-title">
          <div>
            <h2>
              Lista de registros
            </h2>

            <p>
              {loading
                ? "Carregando..."
                : `${filteredItems.length} encontrado(s). Exibindo ${paginatedItems.length} nesta página.`}
            </p>
          </div>

          {filteredItems.length >
            PAGE_SIZE && (
            <span>
              Página {currentPage} de{" "}
              {totalPages}
            </span>
          )}
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : filteredItems.length === 0 ? (
          <p className="supervisao-empty">
            {search
              ? "Nenhum registro encontrado com esse filtro."
              : emptyText ||
                "Nenhum registro encontrado."}
          </p>
        ) : (
          <>
            <div className="supervisao-entity-list-wrap">
              <div
                className="supervisao-entity-list"
                style={{
                  "--entity-grid":
                    gridTemplateColumns,
                }}
              >
                <div className="supervisao-entity-row supervisao-entity-row-head">
                  {columns.map(
                    (column) => (
                      <div
                        key={column.name}
                      >
                        {column.label}
                      </div>
                    )
                  )}

                  <div>Ações</div>
                </div>

                {paginatedItems.map(
                  (item) => {
                    const archived =
                      isArchived(item);

                    return (
                      <article
                        className={
                          `supervisao-entity-row ${
                            archived
                              ? "archived"
                              : ""
                          }`
                        }
                        key={item.id}
                      >
                        {columns.map(
                          (
                            column,
                            index
                          ) => {
                            const value =
                              getCellValue(
                                item,
                                column
                              );

                            const isPrimary =
                              index === 0;

                            return (
                              <div
                                key={
                                  column.name
                                }
                                className={
                                  isPrimary
                                    ? "primary"
                                    : ""
                                }
                                data-label={
                                  column.label
                                }
                              >
                                {isPrimary ? (
                                  <>
                                    {renderCellValue(
                                      value,
                                      true
                                    )}

                                    <span
                                      className={
                                        `supervisao-inline-status ${
                                          archived
                                            ? "archived"
                                            : ""
                                        }`
                                      }
                                    >
                                      {statusLabel(
                                        item
                                      )}
                                    </span>
                                  </>
                                ) : (
                                  renderCellValue(
                                    value
                                  )
                                )}
                              </div>
                            );
                          }
                        )}

                        <div
                          className="actions"
                          data-label="Ações"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                item
                              )
                            }
                          >
                            Editar
                          </button>

                          {archived ? (
                            <button
                              type="button"
                              onClick={() =>
                                handleRestore(
                                  item
                                )
                              }
                            >
                              Restaurar
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="danger"
                              onClick={() =>
                                handleArchive(
                                  item
                                )
                              }
                            >
                              Arquivar
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>

            {filteredItems.length >
              PAGE_SIZE && (
              <div className="supervisao-pagination">
                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                >
                  Anterior
                </button>

                <span>
                  {startIndex + 1}-
                  {Math.min(
                    endIndex,
                    filteredItems.length
                  )}{" "}
                  de{" "}
                  {filteredItems.length}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
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
        title={
          editingId
            ? `Editar ${entityLabel}`
            : `Novo ${entityLabel}`
        }
        description="Preencha os campos abaixo e salve. O registro será enviado para a base do sistema."
        onClose={closeModal}
        size="large"
      >
        <StatusMessage message={message} />

        <form
          className="supervisao-form supervisao-modal-form"
          onSubmit={handleSubmit}
        >
          {fields.map((field) => {
            const multiple =
              isMultipleField(field);

            const fieldClassName =
              field.type === "textarea" ||
              multiple ||
              field.fullWidth
                ? "full"
                : "";

            return (
              <label
                key={field.name}
                className={fieldClassName}
              >
                <span>
                  {field.label}
                  {field.required
                    ? " *"
                    : ""}
                </span>

                {field.type ===
                  "select" ||
                field.type ===
                  "multiselect" ? (
                  <select
                    value={
                      multiple
                        ? form[
                            field.name
                          ] || []
                        : form[
                            field.name
                          ] || ""
                    }
                    onChange={(
                      event
                    ) =>
                      setField(
                        field.name,
                        multiple
                          ? Array.from(
                              event
                                .target
                                .selectedOptions,
                              (
                                option
                              ) =>
                                option.value
                            )
                          : event
                              .target
                              .value
                      )
                    }
                    required={
                      field.required
                    }
                    multiple={multiple}
                    size={
                      multiple
                        ? Math.min(
                            Math.max(
                              (
                                field.options ||
                                []
                              ).length,
                              3
                            ),
                            7
                          )
                        : undefined
                    }
                    disabled={
                      field.disabled
                    }
                  >
                    {!multiple && (
                      <option value="">
                        Selecione
                      </option>
                    )}

                    {(
                      field.options ||
                      []
                    ).map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      )
                    )}
                  </select>
                ) : field.type ===
                  "textarea" ? (
                  <textarea
                    value={
                      form[
                        field.name
                      ] || ""
                    }
                    onChange={(
                      event
                    ) =>
                      setField(
                        field.name,
                        event.target
                          .value
                      )
                    }
                    placeholder={
                      field.placeholder ||
                      ""
                    }
                    rows={
                      field.rows || 4
                    }
                    maxLength={
                      field.maxLength
                    }
                    required={
                      field.required
                    }
                    disabled={
                      field.disabled
                    }
                  />
                ) : (
                  <input
                    type={
                      field.type ||
                      "text"
                    }
                    value={
                      form[
                        field.name
                      ] || ""
                    }
                    onChange={(
                      event
                    ) =>
                      setField(
                        field.name,
                        event.target
                          .value
                      )
                    }
                    placeholder={
                      field.placeholder ||
                      ""
                    }
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    maxLength={
                      field.maxLength
                    }
                    required={
                      field.required
                    }
                    readOnly={
                      field.readOnly
                    }
                    disabled={
                      field.disabled
                    }
                    autoComplete={
                      field.autoComplete
                    }
                  />
                )}

                {field.help && (
                  <small className="supervisao-field-help">
                    {field.help}
                  </small>
                )}
              </label>
            );
          })}

          <div className="supervisao-form-actions full">
            <button
              className="supervisao-primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Salvando..."
                : editingId
                  ? "Atualizar registro"
                  : "Salvar registro"}
            </button>

            <button
              className="supervisao-secondary-button"
              type="button"
              onClick={closeModal}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}