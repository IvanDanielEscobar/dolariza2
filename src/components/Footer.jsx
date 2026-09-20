import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a10] text-slate-400 text-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: KromaCore Brand Signature */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-md overflow-hidden">
                <Image
                  src="/img/kromacore-icon.png"
                  alt="KromaCore Logo"
                  width={38}
                  height={38}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-slate-100 tracking-tight">
                    Dolariza<span className="text-emerald-400">2</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-widest font-mono">
                    by KromaCore
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  El núcleo digital de tu negocio
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Plataforma fintech de monitoreo cambiario y financiero en tiempo real orientada a empresas, comercios y profesionales en Argentina. Cotizaciones oficiales, paralelas y financieras con base de cálculo en Pesos Argentinos (ARS).
            </p>

            <div className="pt-2 flex flex-col gap-1 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Desarrollo & Consultoría Tecnológica:</span>
              <span>KromaCore • Río Cuarto, Córdoba, Argentina</span>
              <a
                href="https://wa.me/5493585735413"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition inline-flex items-center gap-1.5 mt-1"
              >
                <span>WhatsApp: +54 9 358 573-5413</span>
              </a>
            </div>
          </div>

          {/* Col 3: Cotizaciones & Divisas */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3 font-mono">
              Cotizaciones ARS
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dolar" className="hover:text-emerald-400 transition">
                  Dólar Blue & Oficial
                </Link>
              </li>
              <li>
                <Link href="/dolar" className="hover:text-emerald-400 transition">
                  Dólar Financiero (MEP / CCL)
                </Link>
              </li>
              <li>
                <Link href="/dolar" className="hover:text-emerald-400 transition">
                  Dólar Cripto & Tarjeta
                </Link>
              </li>
              <li>
                <Link href="/euro" className="hover:text-emerald-400 transition">
                  Euro Oficial & Blue
                </Link>
              </li>
              <li>
                <Link href="/divisas" className="hover:text-emerald-400 transition">
                  Real Brasileño (BRL)
                </Link>
              </li>
              <li>
                <Link href="/divisas" className="hover:text-emerald-400 transition">
                  Pesos Chile & Uruguay
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Herramientas */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3 font-mono">
              Herramientas
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/calculadora" className="hover:text-emerald-400 transition">
                  Simulador de Conversión ARS
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  Matriz de Arbitraje y Spreads
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  Monitoreo de Brecha Cambiaria
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-emerald-400 transition">
                  Tendencias Históricas SVG
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Ecosistema KromaCore */}
          <div>
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-xs mb-3 font-mono">
              Ecosistema KromaCore
            </h4>
            <p className="text-[11px] text-slate-400 mb-3">
              Soluciones digitales empresariales de alto rendimiento.
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="font-medium text-slate-300">StockBase POS</span>
                <p className="text-[11px] text-slate-400">Control de stock y punto de venta</p>
              </li>
              <li>
                <span className="font-medium text-slate-300">Fastbarber</span>
                <p className="text-[11px] text-slate-400">Gestión de turnos y estética</p>
              </li>
              <li>
                <span className="font-medium text-slate-300">Kroma Workspace</span>
                <p className="text-[11px] text-slate-400">Automatización operativa B2B</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
            <span>© {currentYear} Dolariza2. Una iniciativa de <strong className="text-slate-300">KromaCore</strong>.</span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span>Río Cuarto, Córdoba, Argentina</span>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right max-w-md">
            Información financiera de carácter informativo público provista vía DolarAPI. No constituye asesoramiento financiero ni recomendación de inversión.
          </div>
        </div>
      </div>
    </footer>
  );
}

