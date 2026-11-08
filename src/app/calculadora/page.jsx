import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { CalculatorIcon, ShieldCheckIcon } from "../../components/Icons";

export const metadata = {
  title: "Calculadora de Divisas & Arbitraje | Dolariza2",
  description:
    "Simulador de conversión entre Pesos Argentinos (ARS), variantes del Dólar (Blue, Oficial, MEP, CCL, Cripto), Euro y monedas de la región.",
};

export const revalidate = 60;

export default async function CalculadoraPage() {
  const snapshot = await getMarketSnapshot();
  const { allRates, metrics, keyRates } = snapshot;
  const { blue, mep, tarjeta, oficial } = keyRates || {};

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Header Hero */}
        <section className="dark-panel rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row md:items-end justify-between gap-5">
          <div className="space-y-2 max-w-2xl min-w-0">
            
            <h1 className="text-xl sm:text-3xl font-medium text-white tracking-tight leading-snug">
              Calculadora de Conversión 
            </h1>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
              Selecciona cualquier par de monedas para calcular la liquidación a precio de compra y venta
            </p>
          </div>
        </section>

        {/* Arbitrage Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 w-full min-w-0">
          {/* C1: MEP vs Blue */}
          <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  MEP vs. Blue
                </span>
                <span className="text-xs font-mono text-emerald-400 tabular-nums">
                  +{metrics?.pureMargin}%
                </span>
              </div>
              <div className="text-lg font-medium text-white mb-1.5">
                {mep && blue && mep.venta < blue.compra ? (
                  <span className="text-emerald-400">Arbitraje Positivo</span>
                ) : (
                  <span>Mercado Nivelado</span>
                )}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Comprar MEP ({formatARS(mep?.venta)}) y liquidar en Blue ({formatARS(blue?.compra)}) 
                genera un diferencial neto de {metrics?.pureMargin}%.
              </p>
            </div>
          </div>

          {/* C2: Tarjeta vs MEP */}
          <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Ahorro con Dólar MEP
                </span>
                <span className="text-xs font-mono text-zinc-300 tabular-nums">
                  ~{tarjeta && mep ? Math.round(((tarjeta.venta - mep.venta) / tarjeta.venta) * 100) : 0}%
                </span>
              </div>
              <div className="text-lg font-medium text-white mb-1.5">
                Resumen de Tarjeta
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Pagar gastos en el exterior depositando Dólar MEP ({formatARS(mep?.venta)}) evita recargos
                frente a liquidar al Dólar Tarjeta ({formatARS(tarjeta?.venta)}).
              </p>
            </div>
          </div>

          {/* C3: Brecha */}
          <div className="dark-panel dark-panel-interactive rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase text-zinc-400 tracking-wider">
                  Brecha Oficial vs. Blue
                </span>
                <span className="text-xs font-mono text-zinc-300 tabular-nums">
                  +{metrics?.brechaBlue}%
                </span>
              </div>
              <div className="text-lg font-medium text-white mb-1.5">
                Dispersión Cambiaria
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Diferencial entre la pizarra minorista BNA ({formatARS(oficial?.venta)}) 
                y el mercado libre informal ({formatARS(blue?.venta)}).
              </p>
            </div>
          </div>
        </div>

        {/* widget del conversor */}
        <section className="max-w-3xl mx-auto">
          <CurrencyConverter allRates={allRates} />
        </section>

        {/* Financial Education & Methodology */}
        <section className="dark-panel rounded-2xl p-5 sm:p-6 text-xs text-zinc-400 space-y-3">
          <h4 className="text-sm font-medium text-white flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            Criterios de Conversión
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.05]">
              <strong className="text-zinc-200 block mb-1 font-mono text-[11px]">PRECIO DE VENTA (COMPRAR DIVISA)</strong>
              Cotización que abonas cuando entregas pesos argentinos para adquirir moneda extranjera.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-white/[0.05]">
              <strong className="text-zinc-200 block mb-1 font-mono text-[11px]">PRECIO DE COMPRA (VENDER DIVISA)</strong>
              Cotización que la entidad o casa te abona al liquidar tus dólares u otras monedas.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
