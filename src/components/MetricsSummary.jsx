import { TrendingUpIcon, TrendingDownIcon, ArrowUpDownIcon } from "./Icons";
import { formatARS } from "../lib/formatters";

export default function MetricsSummary({ snapshot }) {
  if (!snapshot) return null;

  const { keyRates, metrics } = snapshot;
  const { blue, oficial, mep, ccl, cripto, tarjeta } = keyRates || {};
  const macro = metrics?.macro;

  const blueVariation = blue?.variation;
  const oficialVariation = oficial?.variation;
  const brechaVal = metrics?.brechaBlue ?? 0;

  return (
    <section className="space-y-3.5 sm:space-y-4 w-full min-w-0">
      {/* 4-Card Minimalist Terminal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full min-w-0">
        {/* 1. DÓLAR BLUE */}
        <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Dólar Blue
              </span>

              {blueVariation && (
                <span
                  className={`text-[11px] font-mono tabular-nums flex items-center gap-0.5 ${
                    blueVariation.isZero
                      ? "text-zinc-500"
                      : blueVariation.isPositive
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {blueVariation.isPositive ? "+" : ""}
                  {blueVariation.diffPct}%
                </span>
              )}
            </div>

            <div className="my-2">
              <span className="text-xs text-zinc-500 font-mono block mb-0.5">Venta</span>
              <div className="text-3xl sm:text-4xl font-mono font-medium text-white tracking-tight tabular-nums">
                {formatARS(blue?.venta)}
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Compra</span>
              <span className="text-zinc-300 font-medium">{formatARS(blue?.compra)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase">Spread</span>
              <span className="text-zinc-300 font-medium">{formatARS(blue?.spread?.spread)}</span>
            </div>
          </div>
        </div>

        {/* 2. DÓLAR OFICIAL */}
        <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                Oficial BNA
              </span>

              {oficialVariation && (
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    oficialVariation.isZero
                      ? "text-zinc-500"
                      : oficialVariation.isPositive
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {oficialVariation.isPositive ? "+" : ""}
                  {oficialVariation.diffPct}%
                </span>
              )}
            </div>

            <div className="my-2">
              <span className="text-xs text-zinc-500 font-mono block mb-0.5">Venta</span>
              <div className="text-3xl sm:text-4xl font-mono font-medium text-white tracking-tight tabular-nums">
                {formatARS(oficial?.venta)}
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Compra</span>
              <span className="text-zinc-300 font-medium">{formatARS(oficial?.compra)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase">Tarjeta</span>
              <span className="text-zinc-300 font-medium">{formatARS(tarjeta?.venta)}</span>
            </div>
          </div>
        </div>

        {/* 3. DÓLAR MEP & CCL */}
        <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                MEP / Bolsa
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">AL30 24hs</span>
            </div>

            <div className="my-2">
              <span className="text-xs text-zinc-500 font-mono block mb-0.5">Venta</span>
              <div className="text-3xl sm:text-4xl font-mono font-medium text-white tracking-tight tabular-nums">
                {formatARS(mep?.venta)}
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t flex items-center justify-between text-xs font-mono text-zinc-400">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">CCL (Cable)</span>
              <span className="text-zinc-300 font-medium">{formatARS(ccl?.venta)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase">Arbitraje Financiero</span>
              <span className="text-emerald-400 font-medium">+{metrics?.pureMargin ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* 4. MACRO & BRECHA (ArgentinaDatos / INDEC) */}
        <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                Macro & Brecha
              </span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">INDEC</span>
            </div>

            <div className="my-2">
              <span className="text-xs text-zinc-500 font-mono block mb-0.5">Brecha Oficial / Blue</span>
              <div className="text-3xl sm:text-4xl font-mono font-medium text-zinc-100 tracking-tight tabular-nums">
                {brechaVal >= 0 ? `+${brechaVal}%` : `${brechaVal}%`}
              </div>
            </div>
          </div>

          <div className="pt-3 hairline-t flex items-center justify-between text-xs font-mono text-zinc-400">
            <div>
              <span className="text-[10px] text-zinc-500 block uppercase">Inflación Mes</span>
              <span className="text-zinc-300 font-medium">{macro?.inflacionMensual ?? "1.9"}%</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-500 block uppercase">Interanual</span>
              <span className="text-zinc-300 font-medium">{macro?.inflacionInteranual ?? "33.4"}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
