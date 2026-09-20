import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import CurrencyConverter from "../../components/CurrencyConverter";
import { formatARS } from "../../lib/formatters";
import { CalculatorIcon, ShieldCheckIcon, TrendingUpIcon } from "../../components/Icons";

export const metadata = {
  title: "Calculadora de Dólar y Arbitraje Cambiario en Argentina | Dolariza2",
  description: "Simulador de conversión ARS a Dólar (Blue, MEP, Tarjeta, Cripto), Euro y divisas regionales con cálculo de arbitraje y desglose impositivo.",
};

export const revalidate = 60;

export default async function CalculadoraPage() {
  const snapshot = await getMarketSnapshot();
  const { allRates, metrics, keyRates } = snapshot;
  const { blue, mep, tarjeta, oficial } = keyRates;

  return (
    <div className="min-h-screen pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <CalculatorIcon className="w-3.5 h-3.5" />
              Simulador Financiero ARS
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Calculadora de Conversión & Arbitraje
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
            Convierta cualquier monto en Pesos Argentinos (ARS) a las distintas cotizaciones del 
            dólar o divisas extranjeras, calculando automáticamente dónde obtiene mayor rendimiento 
            por su dinero.
          </p>
        </div>

        {/* Arbitrage Scenario Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase text-emerald-400 font-bold block mb-1">
              Arbitraje MEP vs. Blue
            </span>
            <div className="text-xl font-bold text-white mb-2">
              {mep && blue && mep.venta < blue.compra ? (
                <span className="text-emerald-400">Oportunidad Positiva</span>
              ) : (
                <span>Mercado Nivelado</span>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Comprar en MEP ({formatARS(mep?.venta)}) y vender en Blue ({formatARS(blue?.compra)}) 
              ofrece un margen de <strong>{metrics?.pureMargin}%</strong>.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase text-sky-400 font-bold block mb-1">
              Dólar Tarjeta vs. MEP
            </span>
            <div className="text-xl font-bold text-white mb-2">
              Ahorro con MEP: ~{tarjeta && mep ? Math.round(((tarjeta.venta - mep.venta) / tarjeta.venta) * 100) : 0}%
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pagar resúmenes de tarjeta en USD comprando MEP ({formatARS(mep?.venta)}) resulta 
              significativamente más económico que liquidar al Dólar Tarjeta ({formatARS(tarjeta?.venta)}).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
            <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block mb-1">
              Brecha Cambiaria Máxima
            </span>
            <div className="text-xl font-mono font-bold text-white mb-2">
              +{metrics?.brechaBlue}%
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diferencia porcentual entre el Dólar Oficial de referencia ({formatARS(oficial?.venta)}) 
              y el Dólar Blue libre ({formatARS(blue?.venta)}).
            </p>
          </div>
        </div>

        {/* The Converter Widget */}
        <section>
          <CurrencyConverter allRates={allRates} />
        </section>

        {/* Methodology Notes */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-xs text-slate-400 space-y-3">
          <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
            Metodología de Cálculo
          </h4>
          <p className="leading-relaxed">
            • <strong>Precio de Venta:</strong> Se aplica cuando usted entrega Pesos Argentinos (ARS) para adquirir moneda extranjera (la casa de cambio o banco le vende a usted).
          </p>
          <p className="leading-relaxed">
            • <strong>Precio de Compra:</strong> Se aplica cuando usted entrega moneda extranjera para recibir Pesos Argentinos (ARS) (la casa de cambio le compra sus billetes).
          </p>
          <p className="leading-relaxed">
            • <strong>Dólar Tarjeta:</strong> Incluye el valor oficial mayorista/minorista más las percepciones impositivas vigentes dictadas por la AFIP/ARCA para consumo en el exterior.
          </p>
        </section>
      </div>
    </div>
  );
}
