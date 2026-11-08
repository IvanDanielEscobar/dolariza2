import Link from "next/link";
import { ArrowRightIcon } from "./Icons";

export default function FinancialNewsSection({ news = [] }) {
  if (!news || news.length === 0) return null;

  const displayNews = news.slice(0, 4);

  return (
    <section className="space-y-3.5 pt-2 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-0.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-medium text-white tracking-tight">
              Noticias Financieras
            </h2>
          </div>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Monitoreo en tiempo real de divisas, deuda soberana y Banco Central
          </p>
        </div>

        <Link
          href="/noticias"
          className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1.5 self-start sm:self-auto group transition py-1"
        >
          <span>VER TODAS</span>
          <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 w-full min-w-0">
        {displayNews.map((item) => (
          <a
            key={item.id}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between dark-panel dark-panel-interactive rounded-2xl p-4 sm:p-5 min-w-0"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono uppercase text-zinc-400 bg-zinc-900/80 px-2 py-0.5 rounded border border-white/[0.06]">
                  {item.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {item.timeAgo}
                </span>
              </div>

              <h3 className="text-xs sm:text-sm font-medium text-zinc-100 group-hover:text-white transition-colors line-clamp-3 leading-snug mb-2">
                {item.title}
              </h3>

              {item.snippet && (
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                  {item.snippet}
                </p>
              )}
            </div>

            <div className="pt-2.5 hairline-t flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span className="font-medium text-zinc-300 truncate max-w-[130px]">
                {item.source}
              </span>
              <span>{item.readTime}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
