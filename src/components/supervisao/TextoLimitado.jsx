import { useMemo } from "react";

function normalizarTexto(value) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return "-";

  return String(value);
}

export default function TextoLimitado({
  label,
  value,
  limite = 120,
  onAbrir,
  className = "",
}) {
  const texto = normalizarTexto(value);

  const textoLimitado = useMemo(() => {
    if (texto.length <= limite) return texto;
    return `${texto.slice(0, limite).trim()}...`;
  }, [texto, limite]);

  const temTextoCompleto = texto !== "-" && texto.length > limite;

  return (
    <div className={`supervisao-texto-limitado ${className}`}>
      {label && <span>{label}</span>}

      <p title={texto}>{textoLimitado}</p>

      {temTextoCompleto && (
        <button
          type="button"
          className="supervisao-texto-limitado-btn"
          onClick={() =>
            onAbrir?.({
              titulo: label || "Informação completa",
              texto,
            })
          }
        >
          Ler tudo
        </button>
      )}
    </div>
  );
}

export function ModalTextoCompleto({ conteudo, onFechar }) {
  if (!conteudo) return null;

  return (
    <div className="supervisao-modal-backdrop" onClick={onFechar}>
      <div
        className="supervisao-modal-card supervisao-modal-texto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="supervisao-modal-head">
          <div>
            <span className="supervisao-kicker">Visualização completa</span>
            <h2>{conteudo.titulo}</h2>
          </div>

          <button type="button" onClick={onFechar}>
            ×
          </button>
        </div>

        <div className="supervisao-modal-texto-body">
          <p>{conteudo.texto}</p>
        </div>
      </div>
    </div>
  );
}