import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMarketStatus } from "../services/ratesService";

export const metadata = {
  title: "Dolariza2 by Ivan Escobar | Cotizaciones, Métricas y Brecha Cambiaria en Argentina",
  description:
    "Monitoreo en tiempo real de las cotizaciones del dólar (Blue, Oficial, MEP, CCL, Cripto), divisas internacionales, variaciones, spreads y brechas cambiarias en Argentina. Desarrollado por Ivan Escobar.",
  keywords: [
    "Ivan Escobar",
    "Dolar Blue",
    "Dolar Hoy",
    "Dolar Oficial",
    "Dolar MEP",
    "Brecha cambiaria",
    "Cotizaciones Argentina",
    "Calculadora Dolar",
    "Euro Blue",
  ],
  authors: [{ name: "Ivan Escobar", url: "https://wa.me/5493585735413" }],
};

export default function RootLayout({ children }) {
  const marketStatus = getMarketStatus();

  return (
    <html lang="es" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300">
        <Navbar marketStatus={marketStatus} />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
