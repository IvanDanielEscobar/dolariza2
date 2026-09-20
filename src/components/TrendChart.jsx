"use client";

import { useState, useMemo } from "react";
import { getHistoricalComparison } from "../services/ratesService";
import { formatARS } from "../lib/formatters";

export default function TrendChart() {
  const [timeframe, setTimeframe] = useState(30); // 7 | 30 | 90
  const [hoverIndex, setHoverIndex] = useState(null);

  const series = useMemo(() => {
    return getHistoricalComparison(timeframe);
  }, [timeframe]);

  // Chart dimensions and bounds
  const width = 800;
  const height = 300;
  const padding = { top: 25, right: 30, bottom: 40, left: 60 };

  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  // Calculate min and max
  const allValues = series.flatMap((d) => [d.oficial, d.blue, d.mep]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  // Round to nice grid boundaries
  const minY = Math.floor(rawMin / 50) * 50;
  const maxY = Math.ceil(rawMax / 50) * 50;
  const rangeY = maxY - minY || 1;

  // Coordinate mappers
  const getX = (idx) => padding.left + (idx / (series.length - 1)) * usableWidth;
  const getY = (val) => height - padding.bottom - ((val - minY) / rangeY) * usableHeight;

  // Path generators
  const makePath = (key) => {
    const points = series.map((d, i) => `${getX(i).toFixed(1)},${getY(d[key]).toFixed(1)}`);
    return `M ${points.join(" L ")}`;
  };

  const makeAreaPath = (key) => {
    const line = makePath(key);
    const lastX = getX(series.length - 1).toFixed(1);
    const firstX = getX(0).toFixed(1);
    const bottomY = (height - padding.bottom).toFixed(1);
    return `${line} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  const pathBlue = makePath("blue");
  const areaBlue = makeAreaPath("blue");
  const pathMep = makePath("mep");
  const pathOficial = makePath("oficial");

  // Grid steps (4 horizontal guide lines)
  const yTicks = [
    minY,
    Math.round(minY + rangeY * 0.33),
    Math.round(minY + rangeY * 0.66),
    maxY,
  ];

  // X-axis ticks (5 labels evenly spaced)
  const xStep = Math.max(1, Math.floor((series.length - 1) / 4));
  const xTicks = [0, xStep, xStep * 2, xStep * 3, series.length - 1];

  const activePoint = hoverIndex !== null ? series[hoverIndex] : series[series.length - 1];

  return (
    <div className="w-full bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-xl backdrop-blur-sm">
      {/* Header with Title and Range Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Evolución Cambiaria y Brecha
            <span className="text-xs font-normal text-slate-400">
              (Dólar Blue vs MEP vs Oficial)
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Analiza la trayectoria y dispersión de precios en el mercado local
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          {[
            { label: "7 Días", val: 7 },
            { label: "30 Días", val: 30 },
            { label: "90 Días", val: 90 },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => {
                setTimeframe(t.val);
                setHoverIndex(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition ${
                timeframe === t.val
                  ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700/80 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Hover Data Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-3 px-4 rounded-lg bg-slate-950/60 border border-slate-800/80 font-mono text-xs mb-4">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-emerald-400" />
            <span className="text-slate-400">Blue:</span>
            <span className="font-bold text-emerald-400">
              {formatARS(activePoint?.blue)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-sky-400" />
            <span className="text-slate-400">MEP:</span>
            <span className="font-bold text-sky-400">
              {formatARS(activePoint?.mep)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-slate-400" />
            <span className="text-slate-400">Oficial:</span>
            <span className="font-bold text-slate-200">
              {formatARS(activePoint?.oficial)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400 font-sans">Brecha:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
            +{activePoint?.brecha}%
          </span>
          <span className="text-slate-500 text-[11px] font-sans">
            Fecha: {activePoint?.fecha}
          </span>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative w-full aspect-[21/9] min-h-[260px] select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="gradientBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines and Y-axis labels */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${val}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {xTicks.map((idx) => {
            const d = series[idx];
            if (!d) return null;
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="sans-serif"
              >
                {d.fecha}
              </text>
            );
          })}

          {/* Area under Dólar Blue */}
          <path d={areaBlue} fill="url(#gradientBlue)" />

          {/* Trend lines */}
          <path
            d={pathOficial}
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="3 3"
          />
          <path
            d={pathMep}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="2.2"
          />
          <path
            d={pathBlue}
            fill="none"
            stroke="#34d399"
            strokeWidth="2.8"
            strokeLinecap="round"
          />

          {/* Crosshair indicator on hover */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={height - padding.bottom}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(series[hoverIndex].blue)}
                r="4.5"
                fill="#34d399"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(series[hoverIndex].mep)}
                r="4"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(series[hoverIndex].oficial)}
                r="3.5"
                fill="#94a3b8"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Invisible hover capture slices */}
          {series.map((_, i) => {
            const stepW = usableWidth / series.length;
            const x = getX(i) - stepW / 2;
            return (
              <rect
                key={i}
                x={Math.max(0, x)}
                y={padding.top}
                width={stepW}
                height={usableHeight}
                fill="transparent"
                className="cursor-crosshair"
                onMouseEnter={() => setHoverIndex(i)}
                onTouchStart={() => setHoverIndex(i)}
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
