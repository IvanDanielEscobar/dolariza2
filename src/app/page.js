import { getMarketSnapshot } from "../services/ratesService";
import { getFinancialNews } from "../services/newsService";
import TickerBar from "../components/TickerBar";
import MetricsSummary from "../components/MetricsSummary";
import RatesTable from "../components/RatesTable";
import TrendChart from "../components/TrendChart";
import CurrencyConverter from "../components/CurrencyConverter";
import FinancialNewsSection from "../components/FinancialNewsSection";
import { ShieldCheckIcon, ClockIcon } from "../components/Icons";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [snapshot, news] = await Promise.all([
    getMarketSnapshot(),
    getFinancialNews(),
  ]);

  const { allRates, metrics, keyRates } = snapshot;

  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen w-full max-w-full overflow-x-hidden flex flex-col pb-16">
      {/* 1. Ticker continuo */}
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-8 space-y-6 sm:space-y-8 min-w-0">
        {/* 2. Hero Header Minimalista */}
        <section className="dark-panel rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                SISTEMA CAMBIARIO ARS
              </span>
              <span className="text-zinc-500 text-[11px] font-mono flex items-center gap-1">
                <ClockIcon className="w-3 h-3 text-zinc-500" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
              Monitor de Mercado & Cotizaciones
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Seguimiento unificado de tipos de cambio oficiales, bursátiles e informales de Argentina, arbitrajes cruzados y series históricas oficiales.
            </p>
          </div>

          <div className="shrink-0 self-start md:self-auto w-full sm:w-auto">
            <div className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-white/[0.06] flex sm:block items-center justify-between text-right">
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">
                Brecha Oficial / Blue
              </span>
              <span className="text-xl sm:text-2xl font-mono font-medium text-zinc-100 tabular-nums">
                {metrics?.brechaBlue >= 0 ? `+${metrics?.brechaBlue}%` : `${metrics?.brechaBlue}%`}
              </span>
            </div>
          </div>
        </section>

        {/* 3. Métricas Principales */}
        <MetricsSummary snapshot={snapshot} />

        {/* 4. Pizarra */}
          <section className="xl:col-span-7 space-y-3 w-full min-w-0">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h2 className="text-base sm:text-lg font-medium text-white tracking-tight">
                  Pizarra de Cotizaciones
                </h2>
                <p className="text-xs text-zinc-500 font-mono">
                  Valores nominales de compra y venta en Pesos Argentinos (ARS)
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-white/[0.06] text-zinc-400">
                ARS ($)
              </span>
            </div>
            <RatesTable rates={allRates} />
          </section>


        {/* 5. Noticias Financieras en Tiempo Real (Ámbito & El Cronista) */}
        <FinancialNewsSection news={news} />

        {/* 6. Evolución Histórica (ArgentinaDatos) */}
        <section className="space-y-3 pt-1 w-full min-w-0">
          <div className="px-0.5">
            <h2 className="text-base sm:text-lg font-medium text-white tracking-tight">
              Curvas de Evolución Histórica
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Datos oficiales provistos por ArgentinaDatos
            </p>
          </div>
          <TrendChart currentRates={keyRates} />
        </section>
      </div>
    </main>
  );
}
