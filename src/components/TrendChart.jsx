"use client";

import { useState, useMemo, useEffect } from "react";
import { getHistoricalComparison } from "../services/ratesService";
import { formatARS } from "../lib/formatters";

export default function TrendChart({ currentRates = null }) {
  const [timeframe, setTimeframe] = useState(30); // 7 | 30 | 90
  const [hoverIndex, setHoverIndex] = useState(null);
  const [realSeries, setRealSeries] = useState(null);

  // Fetch real historical series from ArgentinaDatos via our internal API route
  useEffect(() => {
    let isMounted = true;
    async function loadRealData() {
      try {
        const res = await fetch(`/api/historico?days=${timeframe}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setRealSeries(json.data);
          }
        }
      } catch (e) {
        // Fallback gracefully to calculated baseline
      }
    }
    loadRealData();
    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  const series = useMemo(() => {
    if (realSeries && realSeries.length > 0) {
      return realSeries;
    }
    return getHistoricalComparison(timeframe, currentRates);
  }, [realSeries, timeframe, currentRates]);

  // Chart dimensions and bounds
  const width = 800;
  const height = 280;
  const padding = { top: 20, right: 25, bottom: 35, left: 55 };

  const usableWidth = width - padding.left - padding.right;
  const usableHeight = height - padding.top - padding.bottom;

  // Calculate min and max
  const allValues = series.flatMap((d) => [d.oficial, d.blue, d.mep]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const minY = Math.floor(rawMin / 50) * 50;
  const maxY = Math.ceil(rawMax / 50) * 50;
  const rangeY = maxY - minY || 1;

  // Coordinate mappers
  const getX = (idx) => padding.left + (idx / Math.max(1, series.length - 1)) * usableWidth;
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

  const yTicks = [
    minY,
    Math.round(minY + rangeY * 0.33),
    Math.round(minY + rangeY * 0.66),
    maxY,
  ];

  const xStep = Math.max(1, Math.floor((series.length - 1) / 4));
  const xTicks = [0, xStep, xStep * 2, xStep * 3, series.length - 1];

  const activePoint = hoverIndex !== null ? series[hoverIndex] : series[series.length - 1];

  return (
    <div className="w-full max-w-full min-w-0 dark-panel rounded-2xl p-5 sm:p-6 overflow-hidden">
      {/* Header with Title and Range Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-medium text-white tracking-tight">
              Evolución de Cotizaciones
            </h3>
            <span className="text-[10px] font-mono text-zinc-500 uppercase px-1.5 py-0.5 rounded bg-zinc-900 border border-white/[0.06]">
              ArgentinaDatos
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5 font-mono">
            Histórico oficial diario (Blue vs MEP vs Oficial)
          </p>
        </div>

        {/* Timeframe Buttons */}
        <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-white/[0.06] text-xs font-mono">
          {[
            { label: "7D", val: 7 },
            { label: "30D", val: 30 },
            { label: "90D", val: 90 },
          ].map((t) => (
            <button
              key={t.val}
              onClick={() => {
                setTimeframe(t.val);
                setHoverIndex(null);
              }}
              className={`px-3 py-1 rounded-lg transition text-xs ${
                timeframe === t.val
                  ? "bg-zinc-800 text-white font-medium border border-white/[0.08]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Hover Data Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-2.5 px-3.5 rounded-xl bg-zinc-900/40 border border-white/[0.05] font-mono text-xs mb-4 w-full min-w-0">
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-zinc-500 text-xs">Blue:</span>
            <span className="text-zinc-100 font-medium tabular-nums">
              {formatARS(activePoint?.blue)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            <span className="text-zinc-500 text-xs">MEP:</span>
            <span className="text-zinc-100 font-medium tabular-nums">
              {formatARS(activePoint?.mep)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            <span className="text-zinc-500 text-xs">Oficial:</span>
            <span className="text-zinc-300 font-medium tabular-nums">
              {formatARS(activePoint?.oficial)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1.5 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
          <span className="text-zinc-500 text-xs">Brecha:</span>
          <span className="text-zinc-300 font-medium tabular-nums">
            {activePoint?.brecha >= 0 ? `+${activePoint?.brecha}%` : `${activePoint?.brecha}%`}
          </span>
          <span className="text-zinc-500 text-[11px]">
            {activePoint?.fecha}
          </span>
        </div>
      </div>

      {/* Minimalist SVG Chart */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[200px] select-none max-w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="gradientBlueMinimal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {yTicks.map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.04)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#71717a"
                  fontSize="9"
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
                fill="#71717a"
                fontSize="9"
                fontFamily="monospace"
              >
                {d.fecha}
              </text>
            );
          })}

          {/* Area under Blue line */}
          <path d={areaBlue} fill="url(#gradientBlueMinimal)" />

          {/* Oficial line */}
          <path
            d={pathOficial}
            fill="none"
            stroke="#71717a"
            strokeWidth="1.5"
            strokeDasharray="4 2"
          />

          {/* MEP line */}
          <path
            d={pathMep}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.5"
          />

          {/* Blue line (Hero) */}
          <path
            d={pathBlue}
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Interactive hover crosshair */}
          {hoverIndex !== null && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={height - padding.bottom}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(series[hoverIndex].blue)}
                r="3.5"
                fill="#10b981"
                stroke="#09090b"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Transparent touch/mouse tracking rects */}
          {series.map((_, i) => {
            const step = usableWidth / series.length;
            const x = padding.left + i * step - step / 2;
            return (
              <rect
                key={i}
                x={x}
                y={0}
                width={step}
                height={height}
                fill="transparent"
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
