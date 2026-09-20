import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { TrendingUpIcon, TrendingDownIcon, EuroIcon, ShieldCheckIcon } from "../../components/Icons";

export const metadata = {
  title: "Cotización del Euro en Argentina | Euro Oficial y Euro Blue",
  description: "Precio del Euro en Argentina: Euro Oficial y Euro Blue en tiempo real. Variaciones, spread de compra y venta, y conversión a Pesos Argentinos (ARS).",
};

export const revalidate = 60;

export default async function EuroPage() {
  const snapshot = await getMarketSnapshot();
  const { otrasCotizaciones, allRates } = snapshot;

  const euroRates = otrasCotizaciones.filter((c) => c.moneda === "EUR");

  return (
    <div className="min-h-screen pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <EuroIcon className="w-3.5 h-3.5" />
              Mercado Europeo en Argentina
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cotizaciones del Euro en Argentina (EUR / ARS)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Consulte la cotización del Euro Oficial y Euro Blue en pesos argentinos. 
            Supervise aumentos, descensos, costos de intermediación y utilice la calculadora 
            para convertir divisas de la Unión Europea.
          </p>
        </div>

        {/* Euro Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {euroRates.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;
            const diffVal = item.variation?.diff ?? 0;

            return (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition shadow-xl backdrop-blur-sm"
              >
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                      <EuroIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {item.nombre}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">
                        Código: EUR • Base ARS
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold ${
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
                        <TrendingUpIcon className="w-3.5 h-3.5" />
                        <span>+{diffPct}%</span>
                      </>
                    ) : (
                      <>
                        <TrendingDownIcon className="w-3.5 h-3.5" />
                        <span>{diffPct}%</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 my-4 font-mono">
                  <div>
                    <span className="text-slate-500 text-xs block uppercase font-sans">
                      Precio de Compra
                    </span>
                    <span className="text-xl font-bold text-slate-200">
                      {formatARS(item.compra)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-xs block uppercase font-sans">
                      Precio de Venta
                    </span>
                    <span className="text-2xl font-extrabold text-white">
                      {formatARS(item.venta)}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Spread: {formatARS(item.spread?.spread)}</span>
                  <span>Variación: {diffVal > 0 ? `+${diffVal}` : diffVal} ARS</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* European Parity Insight */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            Paridad EUR / ARS y Dólar
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Al igual que ocurre con el dólar, en el mercado cambiario argentino existen dos 
            circuitos para el Euro: el oficial (regulado por entidades bancarias con recargos tributarios) 
            y el Euro Blue (negociado libremente en el mercado informal). La brecha entre ambos 
            suele seguir una dinámica correlacionada con la del Dólar Blue.
          </p>
        </section>

        {/* Currency Converter */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Calculadora de Conversión para Euro (EUR / ARS)
          </h2>
          <CurrencyConverter allRates={allRates} />
        </section>
      </div>
    </div>
  );
}