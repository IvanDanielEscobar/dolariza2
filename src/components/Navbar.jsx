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
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* 1. Brand Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-95 transition-opacity group shrink-0"
          >
            {/* Solo el isotipo del dólar sin bordes ni encapsulado */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Image
                src="/img/dolar-icon.png"
                alt="Dolariza2 Logo"
                width={40}
                height={40}
                priority
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="leading-tight font-black text-slate-50 tracking-tight text-lg sm:text-xl">
                Dolariza<span className="text-emerald-400">2</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 border border-slate-700/80 uppercase tracking-wider font-mono">
                by Ivan Escobar
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation Links (Segmented Bar) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/90 shadow-inner">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center ${
                    isActive
                      ? "bg-slate-800 text-emerald-400 border border-slate-700/80 shadow-sm font-bold"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Utility Actions (Market Status + Refresh) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Live Market Status Pill */}
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border border-slate-800 bg-slate-900/80 text-slate-300"
              title="Horario oficial mercado bancario y cambiario: Lunes a Viernes de 10:00 a 15:00 hs ART"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  marketStatus.isOpen
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              <span className="text-slate-200 font-semibold">{marketStatus.label}</span>
              <span className="text-slate-500 text-[11px] font-normal hidden xl:inline">
                (10 a 15 hs)
              </span>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Actualizar cotizaciones en vivo"
              className="h-9 px-3 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2 text-xs font-semibold disabled:opacity-50"
            >
              <RefreshIcon
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`}
              />
              <span className="hidden md:inline">Actualizar</span>
            </button>
          </div>
        </div>

        {/* 4. Mobile & Tablet Navigation Bar */}
        <div className="lg:hidden py-2.5 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-lg transition-all font-semibold text-xs ${
                  isActive
                    ? "bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 bg-slate-900/50 border border-transparent"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
