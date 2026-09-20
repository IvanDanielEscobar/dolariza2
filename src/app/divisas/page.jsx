import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import RatesTable from "../../components/RatesTable";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { TrendingUpIcon, TrendingDownIcon, ShieldCheckIcon } from "../../components/Icons";

export const metadata = {
  title: "Cotizaciones de Divisas Regionales en Argentina | Real, Peso Chileno y Uruguayo",
  description: "Cotización en tiempo real del Real Brasileño, Peso Chileno y Peso Uruguayo frente al Peso Argentino (ARS). Ideal para viajes, comercio y turismo.",
};

export const revalidate = 60;

export default async function DivisasPage() {
  const snapshot = await getMarketSnapshot();
  const { otrasCotizaciones, allRates } = snapshot;

  const regionalCurrencies = otrasCotizaciones.filter((c) => c.moneda !== "EUR");

  return (
    <div className="min-h-screen pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              América Latina • Turismo & Comercio Exterior
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Divisas Regionales en Argentina (ARS)
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Monitoree el valor de las monedas de países limítrofes y socios comerciales 
            (Brasil, Chile y Uruguay) frente al Peso Argentino. Ideal para planificar viajes y compras.
          </p>
        </div>

        {/* Currency Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {regionalCurrencies.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;
            const diffVal = item.variation?.diff ?? 0;

            return (
              <div
                key={item.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition shadow-lg backdrop-blur-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono">
                        {item.moneda} / ARS
                      </span>
                      <h3 className="text-xl font-bold text-white">
                        {item.nombre}
                      </h3>
                    </div>

                    <div
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold ${
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
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80 my-3 font-mono">
                    <div>
                      <span className="text-slate-500 text-[11px] block uppercase font-sans">
                        Compra
                      </span>
                      <span className="text-base font-bold text-slate-200">
                        {formatARS(item.compra)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block uppercase font-sans">
                        Venta
                      </span>
                      <span className="text-lg font-extrabold text-white">
                        {formatARS(item.venta)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>Spread: {formatARS(item.spread?.spread)}</span>
                  <span>Var: {diffVal > 0 ? `+${diffVal}` : diffVal} ARS</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Travel and Tourism Tips */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 text-sm text-slate-300">
          <h3 className="font-bold text-white mb-2 flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            Recomendaciones para Viajes & Turismo
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Para gastos en Brasil (Reales) o países vecinos, suele resultar más conveniente 
            pagar consumos con tarjeta de débito o crédito vinculadas a una cuenta en Dólares MEP, 
            o cambiar divisas en destino a través de dólares billete, minimizando el impacto de los recargos 
            y los spreads de las casas de cambio locales.
          </p>
        </section>

        {/* Dedicated Regional Rates Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Pizarra Detallada de Monedas Regionales
          </h2>
          <RatesTable rates={regionalCurrencies} />
        </section>

        {/* Converter */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">
            Calculadora de Monedas Regionales
          </h2>
          <CurrencyConverter allRates={allRates} />
        </section>
      </div>
    </div>
  );
}
