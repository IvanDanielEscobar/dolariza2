import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { TrendingUpIcon, TrendingDownIcon, EuroIcon, ShieldCheckIcon } from "../../components/Icons";

export const metadata = {
  title: "Cotización del Euro | Dolariza2",
  description: "Precio del Euro en Argentina: Euro Oficial y Euro Blue en tiempo real.",
};

export const revalidate = 60;

export default async function EuroPage() {
  const snapshot = await getMarketSnapshot();
  const { otrasCotizaciones, allRates } = snapshot;

  const euroRates = otrasCotizaciones.filter((c) => c.moneda === "EUR");

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Header Hero */}
        <section className="dark-panel rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                EUR / ARS
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                Mercado Europeo
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
              Cotizaciones del Euro en Argentina
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Seguimiento del Euro Oficial y Euro Blue en pesos argentinos, spreads de compra y venta,
              y simulador de conversión en tiempo real.
            </p>
          </div>
        </section>

        {/* Euro Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 w-full min-w-0">
          {euroRates.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;

            return (
              <div
                key={item.id}
                className="dark-panel dark-panel-interactive rounded-2xl p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block mb-0.5">
                        EUR {item.casa}
                      </span>
                      <h3 className="text-base sm:text-lg font-medium text-white tracking-tight">
                        {item.nombre}
                      </h3>
                    </div>

                    <span
                      className={`text-xs font-mono tabular-nums flex items-center gap-0.5 ${
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

                  {/* Compra / Venta Split Box */}
                  <div className="grid grid-cols-2 gap-3 bg-zinc-900/40 p-4 rounded-xl border border-white/[0.05] my-4 font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px] block uppercase font-sans">
                        Compra
                      </span>
                      <span className="text-base font-medium text-zinc-300 tabular-nums">
                        {formatARS(item.compra)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 text-[10px] block uppercase font-sans">
                        Venta
                      </span>
                      <span className="text-xl font-medium text-white tabular-nums">
                        {formatARS(item.venta)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 hairline-t flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-zinc-500">Spread cambiario:</span>
                  <span className="text-zinc-300 tabular-nums">
                    {formatARS(item.spread?.spread)}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Converter Section */}
        <section className="max-w-3xl mx-auto space-y-3">
          <h2 className="text-base font-medium text-white px-0.5">
            Simulador de Conversión de Euro
          </h2>
          <CurrencyConverter allRates={allRates} />
        </section>
      </div>
    </div>
  );
}
