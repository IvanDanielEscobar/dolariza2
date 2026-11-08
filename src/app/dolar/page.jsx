import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import RatesTable from "../../components/RatesTable";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { TrendingUpIcon, TrendingDownIcon } from "../../components/Icons";

export const metadata = {
  title: "Mercado del Dólar | Dolariza2",
  description: "Todas las cotizaciones del dólar en Argentina: Blue, Oficial, MEP, CCL, Cripto y Tarjeta.",
};

export const revalidate = 60;

export default async function DolarPage() {
  const snapshot = await getMarketSnapshot();
  const { dolares, allRates } = snapshot;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pb-16">
      <TickerBar items={dolares} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Header Hero */}
        <section className="dark-panel rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                USD / ARS
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
              Cotizaciones del Dólar en Argentina
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Seguimiento detallado de todas las cotizaciones del dólar: tipos de cambio oficiales,
              mercado informal (Blue), tipos bursátiles (MEP y CCL) y dólar cripto.
            </p>
          </div>
        </section>

        {/* Detailed Dollar Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0">
          {dolares.map((item) => {
            const isUp = item.variation?.isPositive;
            const isZero = item.variation?.isZero;
            const diffPct = item.variation?.diffPct ?? 0;

            return (
              <div
                key={item.casa || item.id}
                className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
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

                {/* Additional Metrics */}
                <div className="pt-2.5 hairline-t space-y-1 text-xs font-mono">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span className="text-zinc-500">Spread:</span>
                    <span className="text-zinc-300 tabular-nums">
                      {formatARS(item.spread?.spread)}
                    </span>
                  </div>

                  {item.brecha !== undefined && item.casa !== "oficial" && (
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-zinc-500">Brecha c/ Oficial:</span>
                      <span className="text-zinc-300 tabular-nums">
                        {item.brecha >= 0 ? `+${item.brecha}%` : `${item.brecha}%`}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* Rates Board & Converter */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="xl:col-span-7 space-y-3">
            <h2 className="text-base font-medium text-white px-0.5">
              Conversiones del dolar
            </h2>
            <RatesTable rates={dolares} />
          </div>

          <div className="xl:col-span-5 space-y-3">
            <h2 className="text-base font-medium text-white px-0.5">
              Conversor Multidivisa
            </h2>
            <CurrencyConverter allRates={allRates} isSidebar={true} />
          </div>
        </section>
      </div>
    </div>
  );
}
