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
    { href: "/", label: "Panel General" },
    { href: "/dolar", label: "Dólar", badge: "7 tipos" },
    { href: "/euro", label: "Euro" },
    { href: "/divisas", label: "Regionales (BRL/CLP/UYU)" },
    { href: "/calculadora", label: "Calculadora" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand with KromaCore signature */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 text-xl font-bold tracking-tight text-white hover:opacity-95 transition-opacity group"
            >
              {/* KromaCore Logo Badge */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 border border-slate-700/80 p-1 flex items-center justify-center shadow-md overflow-hidden group-hover:border-cyan-500/50 transition">
                <Image
                  src="/img/kromacore-icon.png"
                  alt="KromaCore Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="leading-tight font-black text-slate-50 tracking-tight text-lg sm:text-xl">
                    Dolariza<span className="text-emerald-400">2</span>
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider font-mono">
                    by KromaCore
                  </span>
                </div>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                  El núcleo digital de tu negocio
                </span>
              </div>
            </Link>

            {/* Market Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-800 bg-slate-900/80 text-slate-300 ml-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  marketStatus.isOpen
                    ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                    : "bg-amber-400"
                }`}
              />
              <span>{marketStatus.label}</span>
              <span className="text-slate-500 text-[11px] font-normal">
                (10 a 15 hs ART)
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-800/90 text-emerald-400 shadow-inner border border-slate-700/60"
                      : "text-slate-300 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Refresh & Quick CTA */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Actualizar cotizaciones"
              className="p-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50"
            >
              <RefreshIcon
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`}
              />
            </button>

            <Link
              href="/calculadora"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs tracking-wide transition shadow-sm"
            >
              Simular ARS
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden py-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap px-3 py-1 rounded-md transition-colors font-medium ${
                  isActive
                    ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700"
                    : "text-slate-400 hover:text-white"
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

