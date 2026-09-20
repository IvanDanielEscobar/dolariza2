"use client";

import { useState, useMemo } from "react";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  SearchIcon,
} from "./Icons";
import { formatARS } from "../lib/formatters";

function Sparkline({ points = [], isPositive = true, width = 75, height = 24 }) {
  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const padding = 2;
  const usableHeight = height - padding * 2;
  const usableWidth = width - padding * 2;

  const coordinates = points.map((val, idx) => {
    const x = padding + (idx / (points.length - 1)) * usableWidth;
    const y = height - padding - ((val - min) / range) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${coordinates.join(" L ")}`;
  const strokeColor = isPositive ? "#34d399" : "#f43f5e";

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible inline-block"
      aria-label="Tendencia 7D"
    >
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function RatesTable({ rates = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("default");

  const filteredRates = useMemo(() => {
    let result = [...rates];

    if (activeTab === "dolar") {
      result = result.filter((item) => item.moneda === "USD");
    } else if (activeTab === "divisas") {
      result = result.filter((item) => item.moneda !== "USD");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.nombre?.toLowerCase().includes(q) ||
          item.casa?.toLowerCase().includes(q) ||
          item.moneda?.toLowerCase().includes(q)
      );
    }

    if (sortKey === "venta-desc") {
      result.sort((a, b) => (b.venta || 0) - (a.venta || 0));
    } else if (sortKey === "venta-asc") {
      result.sort((a, b) => (a.venta || 0) - (b.venta || 0));
    } else if (sortKey === "var-desc") {
      result.sort(
        (a, b) =>
          Math.abs(b.variation?.diffPct || 0) -
          Math.abs(a.variation?.diffPct || 0)
      );
    } else if (sortKey === "spread-desc") {
      result.sort(
        (a, b) => (b.spread?.spread || 0) - (a.spread?.spread || 0)
      );
    }

    return result;
  }, [rates, activeTab, searchQuery, sortKey]);

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "all"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700/80 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveTab("dolar")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "dolar"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700/80 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Dólar
          </button>
          <button
            onClick={() => setActiveTab("divisas")}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === "divisas"
                ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700/80 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Divisas
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar cotización..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="h-9 bg-slate-950/80 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
          >
            <option value="default">Orden original</option>
            <option value="venta-desc">Mayor precio</option>
            <option value="venta-asc">Menor precio</option>
            <option value="var-desc">Mayor movimiento</option>
          </select>
        </div>
      </div>

      {/* Desktop Density Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/40 text-[10px] uppercase tracking-wider text-slate-400 font-mono">
              <th className="py-3 px-4 font-semibold">Instrumento</th>
              <th className="py-3 px-3 font-semibold text-right">Compra</th>
              <th className="py-3 px-3 font-semibold text-right">Venta</th>
              <th className="py-3 px-3 font-semibold text-right">Variación 24h</th>
              <th className="py-3 px-3 font-semibold text-right">Brecha</th>
              <th className="py-3 px-3 font-semibold text-center">7D Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredRates.map((item) => {
              const isUp = item.variation?.isPositive;
              const isZero = item.variation?.isZero;
              const diffPct = item.variation?.diffPct ?? 0;

              return (
                <tr
                  key={item.id || item.nombre}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700/60 flex items-center justify-center font-sans font-bold text-[10px] text-slate-300">
                        {item.moneda}
                      </div>
                      <div>
                        <div className="font-sans font-bold text-white group-hover:text-emerald-400 transition-colors text-xs">
                          {item.nombre}
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans capitalize">
                          {item.casa ? `Casa: ${item.casa}` : "Oficial"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Compra */}
                  <td className="py-3 px-3 text-right font-medium text-slate-300">
                    {formatARS(item.compra)}
                  </td>

                  {/* Venta */}
                  <td className="py-3 px-3 text-right font-bold text-white text-sm">
                    {formatARS(item.venta)}
                  </td>

                  {/* Variación 24h */}
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        isZero
                          ? "bg-slate-800 text-slate-400"
                          : isUp
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {isZero ? (
                        <span>0.00%</span>
                      ) : isUp ? (
                        <>
                          <TrendingUpIcon className="w-3 h-3" />
                          <span>+{diffPct}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDownIcon className="w-3 h-3" />
                          <span>{diffPct}%</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Brecha */}
                  <td className="py-3 px-3 text-right">
                    {item.brecha !== undefined && item.casa !== "oficial" ? (
                      <span className="text-emerald-400 font-semibold text-[11px]">
                        +{item.brecha}%
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Sparkline */}
                  <td className="py-3 px-3 text-center">
                    <Sparkline
                      points={item.sparkline}
                      isPositive={isUp || isZero}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked Card View */}
      <div className="sm:hidden divide-y divide-slate-800">
        {filteredRates.map((item) => {
          const isUp = item.variation?.isPositive;
          const isZero = item.variation?.isZero;
          const diffPct = item.variation?.diffPct ?? 0;

          return (
            <div key={item.id || item.nombre} className="p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center">
                    {item.moneda}
                  </span>
                  <span className="font-bold text-white text-sm">
                    {item.nombre}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-bold ${
                    isZero
                      ? "bg-slate-800 text-slate-400"
                      : isUp
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {isZero ? (
                    <span>0.00%</span>
                  ) : isUp ? (
                    <>
                      <TrendingUpIcon className="w-3 h-3" />
                      <span>+{diffPct}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon className="w-3 h-3" />
                      <span>{diffPct}%</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">
                    Compra
                  </span>
                  <span className="text-slate-200 font-semibold">
                    {formatARS(item.compra)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-sans">
                    Venta
                  </span>
                  <span className="text-white font-extrabold text-sm">
                    {formatARS(item.venta)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
                <span>Spread: {formatARS(item.spread?.spread)}</span>
                {item.brecha !== undefined && item.casa !== "oficial" && (
                  <span className="text-emerald-400 font-bold">
                    Brecha: +{item.brecha}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredRates.length === 0 && (
        <div className="py-10 text-center text-slate-500 text-xs">
          No se encontraron resultados para la búsqueda.
        </div>
      )}
    </div>
  );
}
