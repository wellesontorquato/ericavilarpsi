import { useEffect } from "react";

export default function Modal({ open, title, description, children, onClose, size = "default" }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose?.();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="supervisao-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className={`supervisao-modal supervisao-modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="supervisao-modal-header">
          <div>
            <span className="supervisao-kicker">Formulário</span>
            <h2>{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button className="supervisao-modal-close" type="button" onClick={onClose} aria-label="Fechar modal">
            ×
          </button>
        </header>

        <div className="supervisao-modal-body">
          {children}
        </div>
      </section>
    </div>
  );
}
