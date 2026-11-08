"use client";

import { TrendingUpIcon, TrendingDownIcon } from "./Icons";

export default function TickerBar({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full max-w-full bg-[#0c0d10] border-b border-white/[0.06] py-1.5 px-3 sm:px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x">
        <div className="flex items-center gap-2 text-xs font-mono shrink-0">
          {items.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;

            return (
              <div
                key={item.id || item.nombre}
                className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900/60 border border-white/[0.05] shrink-0 hover:border-white/[0.12] transition-colors"
              >
                <span className="text-zinc-400 font-sans text-[11px] whitespace-nowrap">
                  {item.nombre}
                </span>
                <span className="text-zinc-100 font-mono font-medium text-xs whitespace-nowrap tabular-nums">
                  ${Number(item.venta || 0).toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>

                <span
                  className={`flex items-center gap-0.5 text-[10px] font-mono tabular-nums ${
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
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
