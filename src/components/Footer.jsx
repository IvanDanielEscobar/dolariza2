import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-full overflow-hidden hairline-t bg-[#07080a] text-zinc-500 text-xs mt-16 sm:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1 & 2: Author Signature */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-white/[0.08] flex items-center justify-center p-1 shrink-0">
                <Image
                  src="/img/dolar-icon.png"
                  alt="Dolariza2"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-bold text-white tracking-tight text-sm">
                  DOLARIZA<span className="text-emerald-400">2</span>
                </span>
                <span className="text-[10px] text-zinc-500 font-mono ml-2">by Ivan Escobar</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Monitor de cotizaciones y herramientas de cálculo cambiario en tiempo real para Argentina.
              Diseñado con arquitectura de redundancia continua y fuentes oficiales.
            </p>

            <div className="pt-1 flex flex-col gap-0.5 text-[11px] font-mono text-zinc-500">
              <span>Desarrollo & Arquitectura: Ivan Escobar</span>
              <span>Río Cuarto, Córdoba, Argentina</span>
            </div>
          </div>

          {/* Col 3: Mercados */}
          <div>
            <h4 className="font-medium text-zinc-300 uppercase tracking-wider text-[11px] mb-3 font-mono">
              MERCADOS
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>
                <Link href="/dolar" className="hover:text-white transition">
                  Dólar Blue & Oficial
                </Link>
              </li>
              <li>
                <Link href="/dolar" className="hover:text-white transition">
                  Dólar Bursátil (MEP / CCL)
                </Link>
              </li>
              <li>
                <Link href="/dolar" className="hover:text-white transition">
                  Dólar Cripto & Tarjeta
                </Link>
              </li>
              <li>
                <Link href="/euro" className="hover:text-white transition">
                  Euro Oficial & Blue
                </Link>
              </li>
              <li>
                <Link href="/divisas" className="hover:text-white transition">
                  Divisas de la Región
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Herramientas */}
          <div>
            <h4 className="font-medium text-zinc-300 uppercase tracking-wider text-[11px] mb-3 font-mono">
              SERVICIOS
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li>
                <Link href="/noticias" className="hover:text-white transition">
                  Noticias Financieras
                </Link>
              </li>
              <li>
                <Link href="/calculadora" className="hover:text-white transition">
                  Conversor Multidivisa
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Fuentes & APIs */}
          <div>
            <h4 className="font-medium text-zinc-300 uppercase tracking-wider text-[11px] mb-3 font-mono">
              FUENTES DE DATOS
            </h4>
            <ul className="space-y-1.5 text-xs text-zinc-400 font-mono text-[11px]">
              <li>• DolarAPI (Live)</li>
              <li>• ArgentinaDatos (Histórico & INDEC)</li>
              <li>• Ámbito Financiero (Cables)</li>
              <li>• El Cronista Comercial (Cables)</li>
              <li>• CriptoYa (Respaldo)</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 hairline-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>
            <span>© {currentYear} Dolariza2 • Desarrollado por <strong className="text-zinc-300 font-medium">Ivan Escobar</strong>.</span>
          </div>
          <div className="text-[11px] font-mono text-zinc-600 text-center sm:text-right">
            Precios de referencia orientativos con actualización continua.
          </div>
        </div>
      </div>
    </footer>
  );
}
