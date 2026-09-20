import { getMarketSnapshot } from "../services/ratesService";
import TickerBar from "../components/TickerBar";
import MetricsSummary from "../components/MetricsSummary";
import RatesTable from "../components/RatesTable";
import TrendChart from "../components/TrendChart";
import CurrencyConverter from "../components/CurrencyConverter";
import { ShieldCheckIcon, ClockIcon, DollarIcon } from "../components/Icons";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const snapshot = await getMarketSnapshot();
  const { allRates, metrics } = snapshot;

  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen flex flex-col pb-16">
      {/* 1. Ticker continuo en tiempo real */}
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-8 space-y-8">
        {/* 2. Encabezado Ejecutivo */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Desarrollado por Ivan Escobar
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Moneda Base: Peso Argentino (ARS)
              </span>
              <span className="text-slate-500 text-xs flex items-center gap-1 font-mono">
                <ClockIcon className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Monitor de Cotizaciones y Brecha Cambiaria
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
              Supervisión en tiempo real de tipos de cambio oficiales y paralelos, 
              variaciones porcentuales, spreads de compra/venta y calculadora de arbitraje.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">
                Brecha Oficial / Blue
              </span>
              <span className="text-xl sm:text-2xl font-mono font-black text-emerald-400">
                +{metrics?.brechaBlue}%
              </span>
            </div>
          </div>
        </section>

        {/* 3. Tarjetas Principales Jerarquizadas (Tier 1 Hero + Tier 2 Secundarias) */}
        <MetricsSummary snapshot={snapshot} />

        {/* 4. Workspace Central en 2 Columnas (Pizarra + Calculadora Inmediata) */}
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda (7 cols): Pizarra Detallada */}
          <div className="xl:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Pizarra General de Cotizaciones
              </h2>
              <span className="text-xs text-slate-400 font-mono">
                Valores en ARS ($)
              </span>
            </div>
            <RatesTable rates={allRates} />
          </div>

          {/* Columna Derecha (5 cols): Calculadora de Conversión & Arbitraje */}
          <div className="xl:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Conversor Inmediato
              </h2>
              <span className="text-xs text-emerald-400 font-semibold">
                Compra / Venta
              </span>
            </div>
            <CurrencyConverter allRates={allRates} isSidebar={true} />
          </div>
        </section>

        {/* 5. Evolución Histórica y Análisis de Tendencias */}
        <section className="space-y-3 pt-2">
          <TrendChart />
        </section>

        {/* 6. Consideraciones Financieras para Argentina */}
        <section className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/20 via-slate-900/40 to-slate-950 p-5 sm:p-6 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              <h4 className="text-sm font-bold text-white">
                Guía Rápida para el Usuario en Argentina
              </h4>
              <p>
                • <strong>Para Ahorrar Legalmente:</strong> El <strong>Dólar MEP</strong> permite adquirir divisas de forma bancarizada, legal y sin límite mediante bonos (ej. AL30) con acreditación en tu cuenta en dólares.
              </p>
              <p>
                • <strong>Para Viajes y Compras:</strong> Si realizas consumos en moneda extranjera, el <strong>Dólar Tarjeta</strong> adiciona recargos impositivos. Conviene saldar el resumen en dólares previamente adquiridos por MEP para reducir costos hasta un 25%.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
