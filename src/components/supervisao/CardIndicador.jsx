export default function CardIndicador({ label, value, detail }) {
  return (
    <article className="supervisao-indicator-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </article>
  );
}
