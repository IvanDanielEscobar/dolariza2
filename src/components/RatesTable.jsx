"use client";

import { useState, useMemo } from "react";
import { TrendingUpIcon, TrendingDownIcon, SearchIcon } from "./Icons";
import { formatARS } from "../lib/formatters";

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
    }

    return result;
  }, [rates, activeTab, searchQuery, sortKey]);

  return (
    <div className="w-full max-w-full min-w-0 dark-panel rounded-2xl overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-3.5 sm:p-4 hairline-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Category Tabs */}
        

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
          <div className="relative flex-1 sm:w-48 min-w-0">
            <SearchIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/[0.2] transition font-mono"
            />
          </div>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="h-8 bg-zinc-900 border border-white/[0.08] text-zinc-300 text-xs rounded-lg px-2.5 focus:outline-none focus:border-white/[0.2] transition cursor-pointer shrink-0 font-mono"
          >
            <option value="default">Ordenar</option>
            <option value="venta-desc">Mayor cotización</option>
            <option value="venta-asc">Menor cotización</option>
            <option value="var-desc">Mayor variación</option>
          </select>
        </div>
      </div>

      {/* Desktop Density Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="hairline-b bg-zinc-950/40 text-[10px] uppercase font-mono tracking-wider text-zinc-500 font-medium">
              <th className="py-2.5 px-4">Moneda</th>
              <th className="py-2.5 px-4 text-right">Compra</th>
              <th className="py-2.5 px-4 text-right">Venta</th>
              <th className="py-2.5 px-4 text-right">Variación</th>
              <th className="py-2.5 px-4 text-right">Brecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.03] font-mono text-xs">
            {filteredRates.map((item) => {
              const isUp = item.variation?.isPositive;
              const isZero = item.variation?.isZero;
              const diffPct = item.variation?.diffPct ?? 0;

              return (
                <tr
                  key={item.id || item.nombre}
                  className="hover:bg-zinc-800/30 transition-colors group"
                >
                  {/* Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded bg-zinc-900 border border-white/[0.06] flex items-center justify-center font-mono text-[10px] text-zinc-400 shrink-0">
                        {item.moneda}
                      </span>
                      <div>
                        <div className="font-sans font-medium text-white group-hover:text-emerald-400 transition-colors text-xs">
                          {item.nombre}
                        </div>
                        <div className="text-[10px] text-zinc-500 capitalize">
                          {item.casa ? item.casa : "Oficial"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Compra */}
                  <td className="py-3 px-4 text-right text-zinc-400 tabular-nums">
                    {formatARS(item.compra)}
                  </td>

                  {/* Venta */}
                  <td className="py-3 px-4 text-right font-medium text-white text-sm tabular-nums">
                    {formatARS(item.venta)}
                  </td>

                  {/* Variación 24h */}
                  <td className="py-3 px-4 text-right tabular-nums">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs ${
                        isZero
                          ? "text-zinc-500"
                          : isUp
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {isZero ? (
                        <span>0.00%</span>
                      ) : isUp ? (
                        <>
                          <TrendingUpIcon className="w-2.5 h-2.5" />
                          <span>+{diffPct}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDownIcon className="w-2.5 h-2.5" />
                          <span>{diffPct}%</span>
                        </>
                      )}
                    </span>
                  </td>

                  {/* Brecha */}
                  <td className="py-3 px-4 text-right tabular-nums">
                    {item.brecha !== undefined && item.casa !== "oficial" ? (
                      <span className="text-zinc-400 text-xs">
                        {item.brecha >= 0 ? `+${item.brecha}%` : `${item.brecha}%`}
                      </span>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden divide-y divide-white/[0.04]">
        {filteredRates.map((item) => {
          const isUp = item.variation?.isPositive;
          const isZero = item.variation?.isZero;
          const diffPct = item.variation?.diffPct ?? 0;

          return (
            <div key={item.id || item.nombre} className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-zinc-900 border border-white/[0.06] flex items-center justify-center font-mono text-[10px] text-zinc-400 shrink-0">
                    {item.moneda}
                  </span>
                  <div>
                    <h4 className="font-medium text-white text-xs">{item.nombre}</h4>
                    <span className="text-[10px] text-zinc-500 capitalize">{item.casa || "Oficial"}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-medium font-mono text-white block tabular-nums">
                    {formatARS(item.venta)}
                  </span>
                  <span
                    className={`text-[10px] font-mono tabular-nums ${
                      isZero ? "text-zinc-500" : isUp ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isUp ? "+" : ""}{diffPct}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1 border-t border-white/[0.03]">
                <span>Compra: {formatARS(item.compra)}</span>
                {item.brecha !== undefined && item.casa !== "oficial" && (
                  <span>Brecha: {item.brecha}%</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
