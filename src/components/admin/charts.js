"use client";

/**
 * Dependency-free, responsive SVG charts for the admin Reports panel.
 * Each chart scales to its container via viewBox and avoids any runtime libs.
 */

export function formatINR(value) {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
}

function niceTicks(max, count = 4) {
  const ticks = [];
  for (let i = 0; i <= count; i += 1) ticks.push(Math.round((max / count) * i));
  return ticks;
}

export function LineChart({ data = [], series = [], height = 240, formatValue = formatNumber }) {
  const width = 760;
  const pad = { top: 16, right: 18, bottom: 30, left: 52 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const n = data.length;

  const maxVal = Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)));
  const xFor = (i) => pad.left + (n <= 1 ? innerW / 2 : (i / (n - 1)) * innerW);
  const yFor = (v) => pad.top + innerH - (v / maxVal) * innerH;
  const ticks = niceTicks(maxVal);

  const labelEvery = Math.max(1, Math.ceil(n / 7));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.left} y1={yFor(t)} x2={width - pad.right} y2={yFor(t)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={pad.left - 8} y={yFor(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
            {formatValue(t)}
          </text>
        </g>
      ))}

      {series.map((s) => {
        const points = data.map((d, i) => `${xFor(i)},${yFor(Number(d[s.key]) || 0)}`).join(" ");
        const areaPoints =
          n > 0
            ? `${xFor(0)},${yFor(0)} ${points} ${xFor(n - 1)},${yFor(0)}`
            : "";
        return (
          <g key={s.key}>
            {s.fill ? <polygon points={areaPoints} fill={s.color} opacity="0.08" /> : null}
            <polyline points={points} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => (
              <circle key={i} cx={xFor(i)} cy={yFor(Number(d[s.key]) || 0)} r="2.5" fill={s.color}>
                <title>{`${d.label ?? d.date ?? i}: ${formatValue(Number(d[s.key]) || 0)}`}</title>
              </circle>
            ))}
          </g>
        );
      })}

      {data.map((d, i) =>
        i % labelEvery === 0 || i === n - 1 ? (
          <text key={i} x={xFor(i)} y={height - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {(d.label ?? d.date ?? "").toString().slice(5)}
          </text>
        ) : null
      )}
    </svg>
  );
}

export function BarChart({ data = [], valueKey = "value", color = "#0056D2", height = 240, formatValue = formatNumber }) {
  const width = 760;
  const pad = { top: 16, right: 18, bottom: 30, left: 52 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const n = data.length;

  const maxVal = Math.max(1, ...data.map((d) => Number(d[valueKey]) || 0));
  const ticks = niceTicks(maxVal);
  const slot = n > 0 ? innerW / n : innerW;
  const barW = Math.max(2, Math.min(40, slot * 0.6));
  const yFor = (v) => pad.top + innerH - (v / maxVal) * innerH;
  const labelEvery = Math.max(1, Math.ceil(n / 12));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.left} y1={yFor(t)} x2={width - pad.right} y2={yFor(t)} stroke="#e2e8f0" strokeWidth="1" />
          <text x={pad.left - 8} y={yFor(t) + 4} textAnchor="end" fontSize="11" fill="#94a3b8">
            {formatValue(t)}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const v = Number(d[valueKey]) || 0;
        const x = pad.left + slot * i + (slot - barW) / 2;
        const y = yFor(v);
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={pad.top + innerH - y} rx="3" fill={color}>
              <title>{`${d.label ?? d.date ?? i}: ${formatValue(v)}`}</title>
            </rect>
            {i % labelEvery === 0 || i === n - 1 ? (
              <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="10" fill="#94a3b8">
                {(d.label ?? d.date ?? "").toString().slice(5)}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({ data = [], size = 200, thickness = 30 }) {
  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = data.map((d) => {
    const value = Number(d.value) || 0;
    const fraction = total > 0 ? value / total : 0;
    const seg = {
      ...d,
      value,
      dash: fraction * circumference,
      gap: circumference - fraction * circumference,
      rotation: (offset / (total || 1)) * 360
    };
    offset += value;
    return seg;
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="shrink-0" role="img">
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#eef2f7" strokeWidth={thickness} />
        {total > 0
          ? segments.map((s, i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={radius}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeDasharray={`${s.dash} ${s.gap}`}
                strokeDashoffset={-(s.rotation / 360) * circumference}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="butt"
              >
                <title>{`${s.label}: ${s.value}`}</title>
              </circle>
            ))
          : null}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a">
          {formatNumber(total)}
        </text>
        <text x={cx} y={cy + 16} textAnchor="middle" fontSize="11" fill="#94a3b8">
          Total
        </text>
      </svg>
      <ul className="space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2 text-slate-600">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="font-medium text-slate-800">{d.label}</span>
            <span className="text-slate-400">·</span>
            <span>{formatNumber(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
