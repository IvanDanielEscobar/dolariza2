import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import RatesTable from "../../components/RatesTable";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { TrendingUpIcon, TrendingDownIcon } from "../../components/Icons";

export const metadata = {
  title: "Mercado del Dólar en Argentina | Oficial, Blue, MEP, CCL y Cripto",
  description: "Análisis profundo de todas las cotizaciones del dólar en Argentina: Blue, Oficial, MEP, CCL, Cripto y Tarjeta, con métricas de variaciones y brechas.",
};

export const revalidate = 60;

export default async function DolarPage() {
  const snapshot = await getMarketSnapshot();
  const { dolares, allRates } = snapshot;

  return (
    <div className="min-h-screen pb-16">
      <TickerBar items={dolares} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Argentina • Sistema Multicambiario
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Mercado del Dólar en Argentina (USD / ARS)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Consulte todas las variantes del dólar en el mercado argentino. Compare precios 
            de compra y venta, márgenes de spread, variaciones diarias y la brecha cambiaria respecto 
            al tipo de cambio oficial del BCRA.
          </p>
        </div>

        {/* Detailed Dollar Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {dolares.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;
            const diffVal = item.variation?.diff ?? 0;

            return (
              <div
                key={item.casa || item.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col justify-between backdrop-blur-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-400 font-mono">
                        Dólar {item.casa}
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {item.nombre}
                      </h3>
                    </div>

                    {/* 24h Variation Pill */}
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono font-semibold ${
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

                  {/* Compra / Venta Split Box */}
                  <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 my-3 font-mono">
                    <div>
                      <span className="text-slate-500 text-[11px] block uppercase font-sans">
                        Compra
                      </span>
                      <span className="text-base sm:text-lg font-bold text-slate-200">
                        {formatARS(item.compra)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block uppercase font-sans">
                        Venta
                      </span>
                      <span className="text-lg sm:text-xl font-extrabold text-white">
                        {formatARS(item.venta)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Additional Metrics: Brecha & Spread */}
                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="font-sans">Spread (Venta - Compra):</span>
                    <span className="text-slate-200 font-semibold">
                      {formatARS(item.spread?.spread)}{" "}
                      <span className="text-slate-500">
                        ({item.spread?.spreadPct?.toFixed(1)}%)
                      </span>
                    </span>
                  </div>

                  {item.brecha !== undefined && item.casa !== "oficial" && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-sans">Brecha vs. Oficial:</span>
                      <span className="text-emerald-400 font-bold">
                        +{item.brecha}%
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 font-sans">
                    <span>Movimiento nominal:</span>
                    <span className="font-mono">
                      {diffVal > 0 ? `+${diffVal}` : diffVal} ARS
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Dedicated Dollar Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Matriz Comparativa de Variaciones
          </h2>
          <RatesTable rates={dolares} />
        </section>

        {/* Currency Converter */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Simulador de Compra / Venta
          </h2>
          <CurrencyConverter allRates={allRates} />
        </section>
      </div>
    </div>
  );
}