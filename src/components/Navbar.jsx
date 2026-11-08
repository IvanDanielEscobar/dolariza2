"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RefreshIcon } from "./Icons";

export default function Navbar({ marketStatus = { isOpen: false, label: "Mercado Cerrado" } }) {
  const pathname = usePathname();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const navLinks = [
    { href: "/", label: "Mercado" },
    { href: "/dolar", label: "Dólar" },
    { href: "/euro", label: "Euro" },
    { href: "/divisas", label: "Divisas" },
    { href: "/calculadora", label: "Calculadora" },
    { href: "/noticias", label: "Noticias", hasLiveDot: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full border-b border-white/[0.07] bg-[#09090b]/90 backdrop-blur-md text-zinc-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* 1. Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity shrink-0 min-w-0"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-white/[0.1] flex items-center justify-center p-1.5 shrink-0 shadow-sm">
              <Image
                src="/img/dolar-icon.png"
                alt="Dolariza2"
                width={28}
                height={28}
                priority
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-baseline gap-1.5 min-w-0">
              <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                DOLARIZA<span className="text-emerald-400 font-extrabold">2</span>
              </span>
              <span className="text-[10px] font-mono uppercase text-zinc-500 font-medium px-1.5 py-0.2 bg-zinc-900/90 rounded border border-white/[0.06] hidden sm:inline-block">
                ARS
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links (Segmented Minimalist Bar) */}
          <nav className="hidden lg:flex items-center gap-0.5 p-1 rounded-xl bg-zinc-900/60 border border-white/[0.06]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-zinc-800 text-white shadow-sm border border-white/[0.08]"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
                  }`}
                >
                  {link.label}
                  {link.hasLiveDot && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Utility Actions (Market Status + Refresh) */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Market Status */}
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-mono border border-white/[0.06] bg-zinc-900/50 text-zinc-400"
              title="Horario oficial mercado bancario: Lunes a Viernes de 10:00 a 15:00 hs ART"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  marketStatus.isOpen ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                }`}
              />
              <span className="text-[11px] uppercase tracking-wider text-zinc-300">
                {marketStatus.label}
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Actualizar cotizaciones"
              className="h-8 px-2.5 rounded-lg border border-white/[0.08] bg-zinc-900 text-zinc-300 hover:text-white hover:border-white/[0.18] transition-all flex items-center justify-center gap-1.5 text-xs font-mono disabled:opacity-50 shrink-0"
            >
              <RefreshIcon
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : "text-zinc-400"}`}
              />
              <span className="hidden md:inline text-[11px] uppercase font-medium">ACTUALIZAR</span>
            </button>
          </div>
        </div>

        {/* 4. Mobile Navigation Bar */}
        <div className="lg:hidden py-1.5 border-t border-white/[0.06] flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth touch-pan-x -mx-4 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap shrink-0 px-3 py-1 rounded-lg transition-all font-medium text-xs flex items-center gap-1.5 ${
                  isActive
                    ? "bg-zinc-800 text-white border border-white/[0.08]"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {link.label}
                {link.hasLiveDot && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
