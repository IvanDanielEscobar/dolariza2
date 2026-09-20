import {
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpDownIcon,
  ShieldCheckIcon,
  DollarIcon,
} from "./Icons";
import { formatARS } from "../lib/formatters";

export default function MetricsSummary({ snapshot }) {
  if (!snapshot) return null;

  const { keyRates, metrics } = snapshot;
  const { blue, oficial, mep, cripto, tarjeta } = keyRates || {};

  // Tier 1: Primary Economic Anchors
  const blueVariation = blue?.variation;
  const oficialVariation = oficial?.variation;

  return (
    <section className="space-y-4 w-full">
      {/* Tier 1: Hero Cards Grid (Blue, Oficial, Brecha) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {/* 1. DÓLAR BLUE (Hero Primary Card) */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-slate-900/80 to-slate-950 p-5 sm:p-6 shadow-xl shadow-emerald-950/30">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Principal
              </span>
            </div>
            {/* 24h Variation Pill */}
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                blueVariation?.isZero
                  ? "bg-slate-800 text-slate-400"
                  : blueVariation?.isPositive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {blueVariation?.isZero ? (
                <span>0.00%</span>
              ) : blueVariation?.isPositive ? (
                <>
                  <TrendingUpIcon className="w-3.5 h-3.5" />
                  <span>+{blueVariation?.diffPct}%</span>
                </>
              ) : (
                <>
                  <TrendingDownIcon className="w-3.5 h-3.5" />
                  <span>{blueVariation?.diffPct}%</span>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5">
              Dólar Blue
              <span className="text-xs font-semibold text-slate-400 font-normal">
                (Informal / Libre)
              </span>
            </h3>
          </div>

          {/* Venta Prominente (La cifra que todos buscan) */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Precio de Venta
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white tracking-tight">
              {formatARS(blue?.venta)}
            </div>
          </div>

          {/* Compra y Spread */}
          <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
            <div>
              <span className="text-slate-500 mr-1.5 font-sans">Compra:</span>
              <span className="font-bold text-slate-200">
                {formatARS(blue?.compra)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5 font-sans">Spread:</span>
              <span className="text-slate-300">
                {formatARS(blue?.spread?.spread)}
              </span>
            </div>
          </div>
        </div>

        {/* 2. DÓLAR OFICIAL (Referencia Banco Nación) */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Referencia Banco Central
            </span>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                oficialVariation?.isZero
                  ? "bg-slate-800 text-slate-400"
                  : oficialVariation?.isPositive
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {oficialVariation?.isZero ? (
                <span>0.00%</span>
              ) : oficialVariation?.isPositive ? (
                <>
                  <TrendingUpIcon className="w-3.5 h-3.5" />
                  <span>+{oficialVariation?.diffPct}%</span>
                </>
              ) : (
                <>
                  <TrendingDownIcon className="w-3.5 h-3.5" />
                  <span>{oficialVariation?.diffPct}%</span>
                </>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Dólar Oficial
              <span className="text-xs font-semibold text-slate-400 font-normal ml-1.5">
                (Minorista BNA)
              </span>
            </h3>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
              Precio de Venta
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-slate-100 tracking-tight">
              {formatARS(oficial?.venta)}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-slate-300">
            <div>
              <span className="text-slate-500 mr-1.5 font-sans">Compra:</span>
              <span className="font-bold text-slate-200">
                {formatARS(oficial?.compra)}
              </span>
            </div>
            <div>
              <span className="text-slate-500 mr-1.5 font-sans">Spread:</span>
              <span className="text-slate-300">
                {formatARS(oficial?.spread?.spread)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. BRECHA CAMBIARIA & ARBITRAJE (Gauge Card) */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-lg backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <ArrowUpDownIcon className="w-3.5 h-3.5" />
                Diferencial Cambiario
              </span>
              <span
                className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                  (metrics?.brechaBlue || 0) > 30
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                    : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                }`}
              >
                {(metrics?.brechaBlue || 0) > 30 ? "Presión Alta" : "Estable"}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-white mb-4">
              Brecha Oficial vs. Blue
            </h3>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 mb-3">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Dispersión Porcentual
              </span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 tracking-tight">
                +{metrics?.brechaBlue ?? 0}%
              </div>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
              Diferencia nominal:
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {formatARS((blue?.venta || 0) - (oficial?.venta || 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Tier 2: Secondary Cards (MEP, Cripto, Tarjeta) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* MEP */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-4 hover:border-slate-700 transition flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span className="text-xs font-bold text-white">Dólar MEP (Bolsa)</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Ahorro legal vía bonos
            </span>
            <div className="text-xl font-mono font-black text-sky-400 mt-2">
              {formatARS(mep?.venta)}
            </div>
          </div>
          <div className="text-right text-xs font-mono">
            <span className="text-slate-500 block text-[10px]">Brecha Oficial</span>
            <span className="text-sky-300 font-bold">+{metrics?.brechaMep}%</span>
          </div>
        </div>

        {/* Cripto */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-4 hover:border-slate-700 transition flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-white">Dólar Cripto</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              USDT / USDC (24/7)
            </span>
            <div className="text-xl font-mono font-black text-emerald-400 mt-2">
              {formatARS(cripto?.venta)}
            </div>
          </div>
          <div className="text-right text-xs font-mono">
            <span className="text-slate-500 block text-[10px]">Compra</span>
            <span className="text-slate-300 font-semibold">{formatARS(cripto?.compra)}</span>
          </div>
        </div>

        {/* Tarjeta */}
        <div className="rounded-xl border border-slate-800/90 bg-slate-900/40 p-4 hover:border-slate-700 transition flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-xs font-bold text-white">Dólar Tarjeta</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Consumos en el exterior
            </span>
            <div className="text-xl font-mono font-black text-rose-400 mt-2">
              {formatARS(tarjeta?.venta)}
            </div>
          </div>
          <div className="text-right text-xs font-mono">
            <span className="text-slate-500 block text-[10px]">Recargo AFIP</span>
            <span className="text-rose-300 font-bold">+60% aprox</span>
          </div>
        </div>
      </div>
    </section>
  );
}
