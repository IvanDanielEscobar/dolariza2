import { getFinancialNews } from "../../services/newsService";
import { getMarketSnapshot } from "../../services/ratesService";
import TickerBar from "../../components/TickerBar";
import NewsClient from "./NewsClient";
import { ClockIcon } from "../../components/Icons";

export const metadata = {
  title: "Noticias Financieras & Economía en Vivo | Dolariza2",
  description:
    "Cables en tiempo real sobre el mercado cambiario, cotizaciones del dólar, Banco Central, inflación y finanzas en Argentina. Fuentes oficiales de Ámbito Financiero y El Cronista.",
};

export const revalidate = 180; // Revalidate every 3 minutes

export default async function NoticiasPage() {
  const [snapshot, news] = await Promise.all([
    getMarketSnapshot(),
    getFinancialNews(40),
  ]);

  const { allRates } = snapshot;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden pb-16">
      <TickerBar items={allRates} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8 min-w-0">
        {/* Client-Side Interactive News Portal */}
        <NewsClient initialNews={news} />
      </div>
    </div>
  );
}
