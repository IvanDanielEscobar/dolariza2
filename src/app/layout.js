import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getMarketStatus } from "../services/ratesService";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  title: "Dolariza2 | Monitor Financiero & Mercado Cambiario Argentino",
  description:
    "Monitor minimalista en tiempo real para cotizaciones de tipos de cambio en Argentina (Dólar Blue, Oficial, MEP, CCL, Cripto), divisas regionales, brechas y cables de noticias financieras.",
  keywords: [
    "Ivan Escobar",
    "Dolar Blue",
    "Dolar Hoy",
    "Dolar Oficial",
    "Dolar MEP",
    "Brecha cambiaria",
    "Cotizaciones Argentina",
    "Calculadora Dolar",
    "ArgentinaDatos",
  ],
  authors: [{ name: "Ivan Escobar", url: "https://wa.me/5493585735413" }],
};

export default function RootLayout({ children }) {
  const marketStatus = getMarketStatus();

  return (
    <html lang="es" className="dark h-full antialiased">
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white">
        <div className="relative min-h-full flex flex-col bg-minimal-grid">
          <Navbar marketStatus={marketStatus} />
          <div className="flex-1 w-full max-w-full overflow-x-hidden min-w-0">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
