export default function StatusMessage({ message }) {
  if (!message?.text) return null;
  return <div className={`supervisao-message ${message.type || "info"}`}>{message.text}</div>;
}
