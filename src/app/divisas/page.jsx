import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import RatesTable from "../../components/RatesTable";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { TrendingUpIcon, TrendingDownIcon, ShieldCheckIcon } from "../../components/Icons";

export const metadata = {
  title: "Divisas Regionales | Dolariza2",
  description: "Cotización del Real Brasileño, Peso Chileno y Peso Uruguayo en Argentina.",
};

export const revalidate = 60;

export default async function DivisasPage() {
  const snapshot = await getMarketSnapshot();
  const { otrasCotizaciones, allRates } = snapshot;

  const regionalCurrencies = otrasCotizaciones.filter((c) => c.moneda !== "EUR");

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Header Hero */}
        <section className="dark-panel rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DIVISAS REGIONALES
              </span>
              <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                Brasil • Chile • Uruguay
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
              Divisas de la Región en Argentina
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Cotizaciones de las monedas de países limítrofes:
              Real Brasileño, Peso Chileno y Peso Uruguayo en el mercado oficial.
            </p>
          </div>
        </section>

        {/* Currency Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0">
          {regionalCurrencies.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;

            const flagEmoji =
              item.moneda === "BRL"
                ? "🇧🇷"
                : item.moneda === "CLP"
                ? "🇨🇱"
                : item.moneda === "UYU"
                ? "🇺🇾"
                : "🇺🇸";

            return (
              <div
                key={item.id}
                className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{flagEmoji}</span>
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono block mb-0.5">
                          {item.moneda} OFICIAL
                        </span>
                        <h3 className="text-base font-medium text-white tracking-tight">
                          {item.nombre}
                        </h3>
                      </div>
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
                  <div className="grid grid-cols-2 gap-3 bg-zinc-900/40 p-3.5 rounded-xl border border-white/[0.05] my-3 font-mono">
                    <div>
                      <span className="text-zinc-500 text-[10px] block uppercase font-sans">
                        Compra
                      </span>
                      <span className="text-sm font-medium text-zinc-300 tabular-nums">
                        {formatARS(item.compra)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-500 text-[10px] block uppercase font-sans">
                        Venta
                      </span>
                      <span className="text-lg font-medium text-white tabular-nums">
                        {formatARS(item.venta)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2.5 hairline-t flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span className="text-zinc-500">Spread:</span>
                  <span className="text-zinc-300 tabular-nums">
                    {formatARS(item.spread?.spread)}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Board & Converter */}
        <section className="xl:col-span-7 space-y-3">
          
            <h2 className="text-base font-medium text-white px-0.5">
              Divisas en ARS
            </h2>
            <RatesTable rates={regionalCurrencies} />
          
        </section>
      </div>
    </div>
  );
}
