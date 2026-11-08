"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { SearchIcon, ArrowRightIcon } from "../../components/Icons";

export default function NewsClient({ initialNews = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "Todas las Noticias" },
    { id: "Dólar & Divisas", label: "Dólar & Divisas" },
    { id: "BCRA & Inflación", label: "BCRA & Inflación" },
    { id: "Mercados & Bonos", label: "Mercados & Bonos" },
    { id: "Cripto & Fintech", label: "Cripto & Fintech" },
  ];

  const filteredNews = useMemo(() => {
    return initialNews.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.snippet && item.snippet.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [initialNews, selectedCategory, searchQuery]);

  const featured = filteredNews.length > 0 ? filteredNews[0] : null;
  const regularList = filteredNews.slice(1);

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Search Bar & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 dark-panel p-3.5 sm:p-4 rounded-2xl">
        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 md:pb-0 bg-zinc-900/60 p-1 rounded-xl border border-white/[0.06]">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-zinc-800 text-white font-medium border border-white/[0.08]"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <SearchIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cables o palabras clave..."
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/[0.2] transition font-mono"
          />
        </div>
      </div>

      {filteredNews.length === 0 ? (
        <div className="text-center py-14 dark-panel rounded-2xl">
          <p className="text-zinc-500 text-xs font-mono">
            No se encontraron reportes con los filtros seleccionados.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-mono text-zinc-300 bg-zinc-900 rounded-lg hover:bg-zinc-800 border border-white/[0.08] transition"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-6 w-full min-w-0">
          {/* Featured Breaking News Card */}
          {featured && (
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden dark-panel dark-panel-interactive rounded-2xl p-5 sm:p-7 transition-all"
            >
              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
                {featured.imageUrl && (
                  <div className="relative w-full md:w-64 h-44 rounded-xl overflow-hidden shrink-0 border border-white/[0.08] bg-zinc-900">
                    <Image
                      src={featured.imageUrl}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 256px"
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      DESTACADA
                    </span>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                      {featured.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {featured.timeAgo}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-2xl font-medium text-white group-hover:text-zinc-200 transition-colors leading-snug mb-2.5 tracking-tight">
                    {featured.title}
                  </h2>

                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
                    {featured.snippet}
                  </p>

                  <div className="flex items-center justify-between text-xs text-zinc-500 pt-3 hairline-t font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-300 font-medium">{featured.source}</span>
                      <span>•</span>
                      <span>{featured.readTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400 group-hover:text-white transition-colors">
                      <span>LEER ARTÍCULO</span>
                      <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          )}

          {/* Grid of Other Articles */}
          {regularList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-w-0">
              {regularList.map((item) => (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col justify-between dark-panel dark-panel-interactive rounded-2xl p-4 sm:p-5 transition-all min-w-0"
                >
                  <div>
                    {item.imageUrl && (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 border border-white/[0.06] bg-zinc-900">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-white/[0.06]">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {item.timeAgo}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-medium text-white group-hover:text-zinc-200 transition-colors line-clamp-3 leading-snug mb-2">
                      {item.title}
                    </h3>

                    {item.snippet && (
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {item.snippet}
                      </p>
                    )}
                  </div>

                  <div className="pt-2.5 hairline-t flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="font-medium text-zinc-300 truncate max-w-[140px]">
                      {item.source}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
