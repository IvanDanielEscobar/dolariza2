"use client";

import { useState, useMemo } from "react";
import { CalculatorIcon, ArrowUpDownIcon } from "./Icons";
import { formatARS } from "../lib/formatters";

export default function CurrencyConverter({ allRates = [], isSidebar = false }) {
  // Mode: 'ARS_TO_FOREIGN' or 'FOREIGN_TO_ARS'
  const [direction, setDirection] = useState("ARS_TO_FOREIGN");
  // Operation: 'BUY' (uses Venta price) or 'SELL' (uses Compra price)
  const [operation, setOperation] = useState("BUY");
  // Selected rate id
  const [selectedRateId, setSelectedRateId] = useState("blue");
  // Input amount
  const [amount, setAmount] = useState(100000);

  const selectedRate = useMemo(() => {
    return allRates.find((r) => r.id === selectedRateId || r.casa === selectedRateId) || allRates[0];
  }, [allRates, selectedRateId]);

  const activePrice = useMemo(() => {
    if (!selectedRate) return 1;
    return operation === "BUY" ? (selectedRate.venta || 1) : (selectedRate.compra || 1);
  }, [selectedRate, operation]);

  // Conversion math
  const convertedResult = useMemo(() => {
    const num = Number(amount) || 0;
    if (direction === "ARS_TO_FOREIGN") {
      return activePrice > 0 ? num / activePrice : 0;
    } else {
      return num * activePrice;
    }
  }, [amount, activePrice, direction]);

  // Comparative Arbitrage Matrix for USD variants
  const usdComparison = useMemo(() => {
    const usdVariants = allRates.filter((r) => r.moneda === "USD");
    const num = Number(amount) || 0;

    return usdVariants.map((item) => {
      const price = operation === "BUY" ? item.venta : item.compra;
      const result = direction === "ARS_TO_FOREIGN"
        ? (price > 0 ? num / price : 0)
        : (num * price);

      return {
        id: item.id || item.casa,
        nombre: item.nombre,
        price,
        result,
      };
    }).sort((a, b) => b.result - a.result);
  }, [allRates, amount, direction, operation]);

  const handleSwapDirection = () => {
    setDirection((prev) =>
      prev === "ARS_TO_FOREIGN" ? "FOREIGN_TO_ARS" : "ARS_TO_FOREIGN"
    );
    if (direction === "ARS_TO_FOREIGN") {
      setAmount(100);
    } else {
      setAmount(100000);
    }
  };

  const symbol = selectedRate?.moneda || "USD";

  return (
    <div className="w-full bg-slate-900/60 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between">
      {/* Header & Controls */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CalculatorIcon className="w-4 h-4" />
              </div>
              Calculadora de Conversión
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulador en pesos argentinos (ARS)
            </p>
          </div>

          {/* Operation Selector */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setOperation("BUY")}
              className={`px-3 py-1.5 rounded-lg transition ${
                operation === "BUY"
                  ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700/80 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              Comprar (Venta)
            </button>
            <button
              onClick={() => setOperation("SELL")}
              className={`px-3 py-1.5 rounded-lg transition ${
                operation === "SELL"
                  ? "bg-slate-800 text-emerald-400 font-bold border border-slate-700/80 shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              Vender (Compra)
            </button>
          </div>
        </div>

        {/* Inputs Layout */}
        <div className="space-y-4 my-5">
          {/* Amount Box */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {direction === "ARS_TO_FOREIGN" ? "Monto a Convertir (ARS)" : `Monto en ${symbol}`}
              </label>
              <button
                onClick={handleSwapDirection}
                className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 font-medium"
              >
                <ArrowUpDownIcon className="w-3 h-3" />
                Invertir
              </button>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-base font-bold text-slate-500">
                {direction === "ARS_TO_FOREIGN" ? "$" : symbol}
              </span>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700/70 rounded-lg text-lg sm:text-xl font-mono font-bold text-white focus:outline-none focus:border-emerald-500 transition"
                placeholder="0"
              />
            </div>
          </div>

          {/* Rate Selector Dropdown */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Cotización de Referencia
              </label>
              <span className="text-[11px] text-emerald-400 font-mono font-semibold">
                1 {symbol} = {formatARS(activePrice)}
              </span>
            </div>

            <select
              value={selectedRateId}
              onChange={(e) => setSelectedRateId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700/70 rounded-lg text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition cursor-pointer"
            >
              <optgroup label="Cotizaciones del Dólar (ARS)">
                {allRates
                  .filter((r) => r.moneda === "USD")
                  .map((r) => (
                    <option key={r.id || r.casa} value={r.id || r.casa}>
                      Dólar {r.nombre} (
                      {operation === "BUY" ? `Venta: ${formatARS(r.venta)}` : `Compra: ${formatARS(r.compra)}`}
                      )
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Otras Divisas">
                {allRates
                  .filter((r) => r.moneda !== "USD")
                  .map((r) => (
                    <option key={r.id || r.casa} value={r.id || r.casa}>
                      {r.nombre} (
                      {operation === "BUY" ? `Venta: ${formatARS(r.venta)}` : `Compra: ${formatARS(r.compra)}`}
                      )
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>

          {/* Big Converted Result Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-slate-950 border border-emerald-500/30">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block mb-1">
              Resultado Estimado
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-white">
              {direction === "ARS_TO_FOREIGN"
                ? `${convertedResult.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })} ${symbol}`
                : formatARS(convertedResult)}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Arbitrage Ranking */}
      <div className="pt-3 border-t border-slate-800/80">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2">
          Comparativa Rápida de Opciones
        </span>
        <div className="grid grid-cols-3 gap-2 text-center font-mono">
          {usdComparison.slice(0, 3).map((comp, idx) => {
            const isBest = idx === 0;
            return (
              <div
                key={comp.id}
                onClick={() => setSelectedRateId(comp.id)}
                className={`p-2 rounded-lg border cursor-pointer transition text-left ${
                  selectedRateId === comp.id
                    ? "bg-slate-800 border-slate-600"
                    : isBest
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold truncate">
                  <span>{comp.nombre}</span>
                  {isBest && (
                    <span className="text-[8px] bg-emerald-400 text-slate-950 px-1 rounded font-bold">
                      TOP
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {formatARS(comp.price)}
                </div>
                <div className="text-xs font-bold text-white mt-1 truncate">
                  {direction === "ARS_TO_FOREIGN"
                    ? `${comp.result.toLocaleString("es-AR", { maximumFractionDigits: 0 })} USD`
                    : formatARS(comp.result)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
