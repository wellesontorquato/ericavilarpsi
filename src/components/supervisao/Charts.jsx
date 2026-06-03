import { useState } from "react";
import { formatDecimal, formatPercent } from "@/lib/supervisao/format";

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function safeText(value, fallback = "-") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "object") return fallback;
  return String(value);
}

function safeItems(items) {
  return Array.isArray(items) ? items : [];
}

function percent(value, max = 100) {
  const safeMax = safeNumber(max) || 1;
  return Math.max(0, Math.min(100, (safeNumber(value) / safeMax) * 100));
}

export function ChartPanel({ title, subtitle, children, action }) {
  return (
    <section className="supervisao-chart-card">
      <div className="supervisao-chart-head">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {action !== undefined && action !== null && action !== "" && (
          <span>{action}</span>
        )}
      </div>

      {children}
    </section>
  );
}

export function EmptyChart({
  text = "Sem dados suficientes para este gráfico.",
}) {
  return <p className="supervisao-empty supervisao-chart-empty">{text}</p>;
}

export function ProgressRing({
  value,
  max = 100,
  label,
  detail,
  suffix = "%",
}) {
  const normalized = percent(value, max);
  const angle = normalized * 3.6;

  return (
    <div className="supervisao-progress-ring-wrap">
      <div
        className="supervisao-progress-ring"
        style={{ "--ring-angle": `${angle}deg` }}
      >
        <div>
          <strong>
            {suffix === "%" ? formatPercent(value) : formatDecimal(value)}
          </strong>
          <span>{label}</span>
        </div>
      </div>

      {detail && <p>{detail}</p>}
    </div>
  );
}

export function HorizontalBars({
  items,
  valueKey = "value",
  labelKey = "label",
  max,
  valueFormatter = formatDecimal,
}) {
  const rows = safeItems(items);

  if (!rows.length) return <EmptyChart />;

  const highest =
    max || Math.max(...rows.map((item) => safeNumber(item?.[valueKey])), 1);

  return (
    <div className="supervisao-bars">
      {rows.map((item, index) => {
        const value = safeNumber(item?.[valueKey]);
        const rowMax = item?.max || highest;
        const label = safeText(item?.[labelKey], "Sem nome");

        return (
          <div
            className="supervisao-bar-row"
            key={item?.id || `${label}-${index}`}
          >
            <div className="supervisao-bar-label">
              <strong>{label}</strong>
              <span>{valueFormatter(value)}</span>
            </div>

            <div className="supervisao-bar-track" aria-hidden="true">
              <span style={{ width: `${percent(value, rowMax)}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ColumnChart({
  items,
  valueKey = "value",
  labelKey = "label",
  valueFormatter = formatDecimal,
}) {
  const rows = safeItems(items);

  if (!rows.length) return <EmptyChart />;

  const highest = Math.max(
    ...rows.map((item) => safeNumber(item?.[valueKey])),
    1
  );

  return (
    <div className="supervisao-column-chart">
      {rows.map((item, index) => {
        const value = safeNumber(item?.[valueKey]);
        const label = safeText(item?.[labelKey], "Sem nome");

        return (
          <div
            className="supervisao-column"
            key={item?.id || `${label}-${index}`}
          >
            <span className="supervisao-column-value">
              {valueFormatter(value)}
            </span>

            <div className="supervisao-column-track">
              <span
                style={{
                  height: `${Math.max(8, percent(value, highest))}%`,
                }}
              />
            </div>

            <strong>{label}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function TrendLine({
  items,
  valueKey = "value",
  secondaryKey,
  labelKey = "label",
}) {
  const rows = safeItems(items);

  if (!rows.length) return <EmptyChart />;

  const width = 760;
  const height = 260;
  const padding = 34;

  const values = rows.flatMap((item) => [
    safeNumber(item?.[valueKey]),
    secondaryKey ? safeNumber(item?.[secondaryKey]) : 0,
  ]);

  const max = Math.max(...values, 1);
  const xStep =
    rows.length === 1 ? 0 : (width - padding * 2) / (rows.length - 1);

  function point(item, index, key) {
    const x = padding + index * xStep;
    const y =
      height -
      padding -
      (safeNumber(item?.[key]) / max) * (height - padding * 2);

    return { x, y };
  }

  const primaryPoints = rows
    .map((item, index) => {
      const { x, y } = point(item, index, valueKey);
      return `${x},${y}`;
    })
    .join(" ");

  const secondaryPoints = secondaryKey
    ? rows
        .map((item, index) => {
          const { x, y } = point(item, index, secondaryKey);
          return `${x},${y}`;
        })
        .join(" ")
    : "";

  return (
    <div className="supervisao-trend-wrap">
      <svg
        className="supervisao-trend"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Gráfico de tendência"
      >
        {[0, 1, 2, 3].map((line) => {
          const y = padding + line * ((height - padding * 2) / 3);

          return (
            <line
              key={line}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
            />
          );
        })}

        {secondaryKey && (
          <polyline className="secondary" points={secondaryPoints} />
        )}

        <polyline points={primaryPoints} />

        {rows.map((item, index) => {
          const { x, y } = point(item, index, valueKey);

          return (
            <circle
              key={`${safeText(item?.[labelKey], "item")}-${index}`}
              cx={x}
              cy={y}
              r="5"
            />
          );
        })}
      </svg>

      <div className="supervisao-trend-labels">
        {rows.map((item, index) => (
          <span
            key={item?.id || `${safeText(item?.[labelKey], "item")}-${index}`}
          >
            {safeText(item?.[labelKey])}
          </span>
        ))}
      </div>
    </div>
  );
}

export function DonutChart({ items }) {
  const rows = safeItems(items);

  if (!rows.length) return <EmptyChart />;

  const total = rows.reduce((sum, item) => sum + safeNumber(item?.value), 0);

  if (!total) return <EmptyChart />;

  const stops = rows
    .slice(0, 5)
    .reduce(
      (acc, item, index) => {
        const start = acc.cursor;
        const end = start + (safeNumber(item?.value) / total) * 100;

        return {
          cursor: end,
          parts: [
            ...acc.parts,
            `var(--donut-${index + 1}) ${start}% ${end}%`,
          ],
        };
      },
      { cursor: 0, parts: [] }
    )
    .parts.join(", ");

  return (
    <div className="supervisao-donut-wrap">
      <div
        className="supervisao-donut"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div>
          <strong>{total}</strong>
          <span>total</span>
        </div>
      </div>

      <div className="supervisao-donut-legend">
        {rows.slice(0, 5).map((item, index) => (
          <div key={item?.id || safeText(item?.label, `item-${index}`)}>
            <i style={{ "--legend-color": `var(--donut-${index + 1})` }} />
            <span>{safeText(item?.label)}</span>
            <strong>{safeNumber(item?.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RadarChart({ items }) {
  const [activeItem, setActiveItem] = useState(null);

  const rows = safeItems(items);

  if (!rows.length) return <EmptyChart />;

  const radarLabels = {
    qualidadeConceitualizacao: "Conceitualização cognitiva",
    planejamentoTerapeutico: "Planejamento terapêutico",
    aplicacaoTecnicasTcc: "Aplicação de técnicas TCC",
    manejoSessao: "Manejo da sessão",
    posturaTerapeutica: "Postura terapêutica",
    formulacaoHipoteses: "Formulação de hipóteses",
  };

  const size = 320;
  const center = size / 2;
  const radius = 100;
  const labelRadius = 128;
  const max = 5;
  const angleStep = (Math.PI * 2) / rows.length;

  function itemKey(item, index = 0) {
    return item?.id || item?.label || `radar-${index}`;
  }

  function getFullLabel(item) {
    return radarLabels[item?.id] || safeText(item?.fullLabel || item?.label);
  }

  function coords(index, value = max, customRadius = radius) {
    const angle = -Math.PI / 2 + index * angleStep;
    const safeValue = Math.max(0, Math.min(max, safeNumber(value)));
    const scaled = (safeValue / max) * customRadius;

    return [
      center + Math.cos(angle) * scaled,
      center + Math.sin(angle) * scaled,
    ];
  }

  function labelCoords(index) {
    const angle = -Math.PI / 2 + index * angleStep;

    return [
      center + Math.cos(angle) * labelRadius,
      center + Math.sin(angle) * labelRadius,
    ];
  }

  const polygon = rows
    .map((item, index) => coords(index, item?.value).join(","))
    .join(" ");

  const selected = activeItem || rows[0];
  const selectedKey = itemKey(selected);

  return (
    <div className="supervisao-radar-wrap supervisao-radar-wrap-interactive">
      <div className="supervisao-radar-visual">
        <svg
          className="supervisao-radar supervisao-radar-interactive"
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Radar de competências"
        >
          {[1, 2, 3, 4, 5].map((level) => (
            <polygon
              key={level}
              points={rows
                .map((_, index) => coords(index, level).join(","))
                .join(" ")}
            />
          ))}

          {rows.map((_, index) => {
            const [x, y] = coords(index, max);

            return (
              <line
                key={`line-${index}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
              />
            );
          })}

          <polygon className="value" points={polygon} />

          {rows.map((item, index) => {
            const [x, y] = coords(index, item?.value);
            const [labelX, labelY] = labelCoords(index);
            const key = itemKey(item, index);
            const isActive = selectedKey === key;

            return (
              <g
                key={key}
                className={isActive ? "active" : ""}
                tabIndex={0}
                role="button"
                aria-label={`${getFullLabel(item)}: ${formatDecimal(
                  item?.value
                )}/5`}
                onMouseEnter={() => setActiveItem(item)}
                onFocus={() => setActiveItem(item)}
                onClick={() => setActiveItem(item)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setActiveItem(item);
                  }
                }}
              >
                <text
                  className="supervisao-radar-axis-label"
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {safeText(item?.label)}
                </text>

                <circle
                  className="supervisao-radar-point-hit"
                  cx={x}
                  cy={y}
                  r="14"
                />

                <circle
                  className="supervisao-radar-point"
                  cx={x}
                  cy={y}
                  r={isActive ? "6" : "4.5"}
                />
              </g>
            );
          })}
        </svg>

        {selected && (
          <div className="supervisao-radar-tooltip">
            <span>{getFullLabel(selected)}</span>
            <strong>{formatDecimal(selected?.value)}/5</strong>
          </div>
        )}
      </div>

      <div className="supervisao-radar-list supervisao-radar-list-clickable">
        {rows.map((item, index) => {
          const key = itemKey(item, index);
          const isActive = selectedKey === key;

          return (
            <button
              type="button"
              key={key}
              className={isActive ? "active" : ""}
              onMouseEnter={() => setActiveItem(item)}
              onFocus={() => setActiveItem(item)}
              onClick={() => setActiveItem(item)}
            >
              <span>{safeText(item?.label)}</span>
              <strong>{formatDecimal(item?.value)}</strong>
            </button>
          );
        })}
      </div>
    </div>
  );
}