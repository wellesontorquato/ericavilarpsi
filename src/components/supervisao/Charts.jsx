import { formatDecimal, formatPercent } from "@/lib/supervisao/format";

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function percent(value, max = 100) {
  if (!max) return 0;
  return Math.max(0, Math.min(100, (safeNumber(value) / safeNumber(max)) * 100));
}

export function ChartPanel({ title, subtitle, children, action }) {
  return (
    <section className="supervisao-chart-card">
      <div className="supervisao-chart-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <span>{action}</span>}
      </div>
      {children}
    </section>
  );
}

export function EmptyChart({ text = "Sem dados suficientes para este gráfico." }) {
  return <p className="supervisao-empty supervisao-chart-empty">{text}</p>;
}

export function ProgressRing({ value, max = 100, label, detail, suffix = "%" }) {
  const normalized = percent(value, max);
  const angle = normalized * 3.6;

  return (
    <div className="supervisao-progress-ring-wrap">
      <div className="supervisao-progress-ring" style={{ "--ring-angle": `${angle}deg` }}>
        <div>
          <strong>{suffix === "%" ? formatPercent(value) : formatDecimal(value)}</strong>
          <span>{label}</span>
        </div>
      </div>
      {detail && <p>{detail}</p>}
    </div>
  );
}

export function HorizontalBars({ items, valueKey = "value", labelKey = "label", max, valueFormatter = formatDecimal }) {
  if (!items?.length) return <EmptyChart />;

  const highest = max || Math.max(...items.map((item) => safeNumber(item[valueKey])), 1);

  return (
    <div className="supervisao-bars">
      {items.map((item) => {
        const value = safeNumber(item[valueKey]);
        return (
          <div className="supervisao-bar-row" key={item.id || item[labelKey]}>
            <div className="supervisao-bar-label">
              <strong>{item[labelKey]}</strong>
              <span>{valueFormatter(value)}</span>
            </div>
            <div className="supervisao-bar-track" aria-hidden="true">
              <span style={{ width: `${percent(value, highest)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ColumnChart({ items, valueKey = "value", labelKey = "label", valueFormatter = formatDecimal }) {
  if (!items?.length) return <EmptyChart />;

  const highest = Math.max(...items.map((item) => safeNumber(item[valueKey])), 1);

  return (
    <div className="supervisao-column-chart">
      {items.map((item) => {
        const value = safeNumber(item[valueKey]);
        return (
          <div className="supervisao-column" key={item.id || item[labelKey]}>
            <span className="supervisao-column-value">{valueFormatter(value)}</span>
            <div className="supervisao-column-track">
              <span style={{ height: `${Math.max(8, percent(value, highest))}%` }} />
            </div>
            <strong>{item[labelKey]}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function TrendLine({ items, valueKey = "value", secondaryKey, labelKey = "label" }) {
  if (!items?.length) return <EmptyChart />;

  const width = 760;
  const height = 260;
  const padding = 34;
  const values = items.flatMap((item) => [safeNumber(item[valueKey]), secondaryKey ? safeNumber(item[secondaryKey]) : 0]);
  const max = Math.max(...values, 1);
  const xStep = items.length === 1 ? 0 : (width - padding * 2) / (items.length - 1);

  function point(item, index, key) {
    const x = padding + index * xStep;
    const y = height - padding - (safeNumber(item[key]) / max) * (height - padding * 2);
    return `${x},${y}`;
  }

  const primaryPoints = items.map((item, index) => point(item, index, valueKey)).join(" ");
  const secondaryPoints = secondaryKey ? items.map((item, index) => point(item, index, secondaryKey)).join(" ") : "";

  return (
    <div className="supervisao-trend-wrap">
      <svg className="supervisao-trend" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Gráfico de tendência">
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);
          return <line key={line} x1={padding} x2={width - padding} y1={y} y2={y} />;
        })}
        {secondaryKey && <polyline className="secondary" points={secondaryPoints} />}
        <polyline points={primaryPoints} />
        {items.map((item, index) => (
          <circle key={`${item[labelKey]}-${index}`} cx={point(item, index, valueKey).split(",")[0]} cy={point(item, index, valueKey).split(",")[1]} r="5" />
        ))}
      </svg>
      <div className="supervisao-trend-labels">
        {items.map((item) => <span key={item.id || item[labelKey]}>{item[labelKey]}</span>)}
      </div>
    </div>
  );
}

export function DonutChart({ items }) {
  if (!items?.length) return <EmptyChart />;

  const total = items.reduce((sum, item) => sum + safeNumber(item.value), 0);
  if (!total) return <EmptyChart />;

  const stops = items.reduce((acc, item, index) => {
    const start = acc.cursor;
    const end = start + (safeNumber(item.value) / total) * 100;
    return {
      cursor: end,
      parts: [...acc.parts, `var(--donut-${index + 1}) ${start}% ${end}%`],
    };
  }, { cursor: 0, parts: [] }).parts.join(", ");

  return (
    <div className="supervisao-donut-wrap">
      <div className="supervisao-donut" style={{ background: `conic-gradient(${stops})` }}>
        <div>
          <strong>{total}</strong>
          <span>total</span>
        </div>
      </div>
      <div className="supervisao-donut-legend">
        {items.map((item, index) => (
          <div key={item.label}>
            <i style={{ "--legend-color": `var(--donut-${index + 1})` }} />
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RadarChart({ items }) {
  if (!items?.length) return <EmptyChart />;

  const size = 280;
  const center = size / 2;
  const radius = 100;
  const max = 5;
  const angleStep = (Math.PI * 2) / items.length;

  function coords(index, value = max) {
    const angle = -Math.PI / 2 + index * angleStep;
    const scaled = (safeNumber(value) / max) * radius;
    return [center + Math.cos(angle) * scaled, center + Math.sin(angle) * scaled];
  }

  const polygon = items.map((item, index) => coords(index, item.value).join(",")).join(" ");
  const outer = items.map((_, index) => coords(index, max).join(",")).join(" ");

  return (
    <div className="supervisao-radar-wrap">
      <svg className="supervisao-radar" viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Radar de competências">
        {[1, 2, 3, 4, 5].map((level) => (
          <polygon key={level} points={items.map((_, index) => coords(index, level).join(",")).join(" ")} />
        ))}
        {items.map((_, index) => {
          const [x, y] = coords(index, max);
          return <line key={index} x1={center} y1={center} x2={x} y2={y} />;
        })}
        <polygon className="value" points={polygon || outer} />
      </svg>
      <div className="supervisao-radar-list">
        {items.map((item) => (
          <div key={item.label}>
            <span>{item.label}</span>
            <strong>{formatDecimal(item.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
