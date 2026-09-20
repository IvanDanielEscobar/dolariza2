"use client";

import { TrendingUpIcon, TrendingDownIcon } from "./Icons";

export default function TickerBar({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
            EN VIVO
          </span>
        </div>

        <div className="flex items-center gap-8 text-xs font-mono shrink-0">
          {items.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;

            return (
              <div
                key={item.id || item.nombre}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition"
              >
                <span className="text-slate-400 font-sans font-medium text-[11px]">
                  {item.nombre}
                </span>
                <span className="text-slate-100 font-semibold">
                  ${Number(item.venta || 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

                <span
                  className={`flex items-center gap-0.5 text-[11px] font-medium ${
                    isZero
                      ? "text-slate-500"
                      : isUp
                      ? "text-emerald-400"
                      : "text-rose-400"
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

