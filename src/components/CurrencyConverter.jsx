"use client";

import { useState, useMemo, useCallback } from "react";
import { CalculatorIcon, ArrowUpDownIcon } from "./Icons";
import { formatARS } from "../lib/formatters";

// Canonical currency list with metadata
const AVAILABLE_CURRENCIES = [
  { id: "ARS", name: "Peso Argentino", symbol: "ARS", flag: "🇦🇷", isBase: true },
  { id: "USD-blue", name: "Dólar Blue", symbol: "USD", rateRef: "blue", flag: "💵", category: "Dólares" },
  { id: "USD-oficial", name: "Dólar Oficial (BNA)", symbol: "USD", rateRef: "oficial", flag: "🏛️", category: "Dólares" },
  { id: "USD-bolsa", name: "Dólar MEP / Bolsa", symbol: "USD", rateRef: "bolsa", flag: "📈", category: "Dólares" },
  { id: "USD-contadoconliqui", name: "Dólar CCL", symbol: "USD", rateRef: "contadoconliqui", flag: "🌐", category: "Dólares" },
  { id: "USD-cripto", name: "Dólar Cripto (USDT)", symbol: "USDT", rateRef: "cripto", flag: "⚡", category: "Dólares" },
  { id: "USD-tarjeta", name: "Dólar Tarjeta / Turista", symbol: "USD", rateRef: "tarjeta", flag: "💳", category: "Dólares" },
  { id: "EUR-oficial", name: "Euro Oficial", symbol: "EUR", rateRef: "EUR-oficial", flag: "🇪🇺", category: "Otras Divisas" },
  { id: "EUR-blue", name: "Euro Blue", symbol: "EUR", rateRef: "EUR-blue", flag: "💶", category: "Otras Divisas" },
  { id: "BRL-oficial", name: "Real Brasileño", symbol: "BRL", rateRef: "BRL-oficial", flag: "🇧🇷", category: "Otras Divisas" },
  { id: "CLP-oficial", name: "Peso Chileno (x100)", symbol: "CLP", rateRef: "CLP-oficial", isPer100: true, flag: "🇨🇱", category: "Otras Divisas" },
  { id: "UYU-oficial", name: "Peso Uruguayo", symbol: "UYU", rateRef: "UYU-oficial", flag: "🇺🇾", category: "Otras Divisas" },
];

export default function CurrencyConverter({ allRates = [], isSidebar = false }) {
  const [fromCurrencyId, setFromCurrencyId] = useState("ARS");
  const [toCurrencyId, setToCurrencyId] = useState("USD-blue");
  const [operation, setOperation] = useState("BUY");
  const [amount, setAmount] = useState(100000);

  const getRateFor = useCallback((currencyId, op) => {
    if (currencyId === "ARS") {
      return { price: 1, name: "Peso Argentino", symbol: "ARS", raw: null };
    }

    const cur = AVAILABLE_CURRENCIES.find((c) => c.id === currencyId);
    if (!cur) return { price: 1, name: currencyId, symbol: "ARS", raw: null };

    const matched = allRates.find(
      (r) =>
        r.id === cur.rateRef ||
        r.casa === cur.rateRef ||
        `${r.moneda}-${r.casa}`.toLowerCase() === cur.rateRef.toLowerCase()
    );

    let price = 1;
    if (matched) {
      price = op === "BUY" ? (matched.venta || 1) : (matched.compra || 1);
      if (cur.isPer100) {
        price = price / 100;
      }
    }

    return {
      price: price > 0 ? price : 1,
      name: cur.name,
      symbol: cur.symbol,
      flag: cur.flag,
      raw: matched,
    };
  }, [allRates]);

  const fromInfo = useMemo(() => getRateFor(fromCurrencyId, operation), [fromCurrencyId, operation, getRateFor]);
  const toInfo = useMemo(() => getRateFor(toCurrencyId, operation), [toCurrencyId, operation, getRateFor]);

  const crossRate = useMemo(() => {
    if (!toInfo.price || toInfo.price <= 0) return 0;
    return fromInfo.price / toInfo.price;
  }, [fromInfo.price, toInfo.price]);

  const convertedResult = useMemo(() => {
    const rawNum = Number(amount) || 0;
    return rawNum * crossRate;
  }, [amount, crossRate]);

  const handleSwap = () => {
    const prevFrom = fromCurrencyId;
    const prevTo = toCurrencyId;
    setFromCurrencyId(prevTo);
    setToCurrencyId(prevFrom);

    if (prevFrom === "ARS") {
      setAmount(1);
    } else {
      setAmount(1000);
    }
  };

  const usdComparison = useMemo(() => {
    const num = Number(amount) || 0;
    const isFromArs = fromCurrencyId === "ARS";
    const usdVariants = allRates.filter((r) => r.moneda === "USD");

    return usdVariants
      .map((item) => {
        const price = operation === "BUY" ? (item.venta || 1) : (item.compra || 1);
        const res = isFromArs ? (price > 0 ? num / price : 0) : num * price;

        return {
          id: item.id || item.casa,
          nombre: item.nombre,
          price,
          result: res,
        };
      })
      .sort((a, b) => b.result - a.result);
  }, [allRates, amount, fromCurrencyId, operation]);

  return (
    <div className="w-full max-w-full min-w-0 dark-panel rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
      {/* 1. Encabezado */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 hairline-b">
          <div className="flex items-center gap-2">
            <CalculatorIcon className="w-4 h-4 text-zinc-400" />
            <div>
              <h3 className="text-sm sm:text-base font-medium text-white tracking-tight">
                Conversor de Divisas
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                Cálculo instantáneo a tipo de cambio cruzado
              </p>
            </div>
          </div>

          {/* Operation Toggle */}
          <div className="flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-white/[0.06] text-xs font-mono">
            <button
              type="button"
              onClick={() => setOperation("BUY")}
              className={`px-3 py-1 rounded-lg transition text-xs ${
                operation === "BUY"
                  ? "bg-zinc-800 text-white font-medium border border-white/[0.08]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Comprar
            </button>
            <button
              type="button"
              onClick={() => setOperation("SELL")}
              className={`px-3 py-1 rounded-lg transition text-xs ${
                operation === "SELL"
                  ? "bg-zinc-800 text-white font-medium border border-white/[0.08]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Vender
            </button>
          </div>
        </div>

        {/* 2. Selectores De Moneda */}
        <div className="grid grid-cols-1 sm:grid-cols-11 gap-2.5 items-center my-4">
          {/* Origen */}
          <div className="sm:col-span-5 bg-zinc-900/40 p-3 rounded-xl border border-white/[0.06] min-w-0">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Entregas
              </label>
              {fromCurrencyId !== "ARS" && (
                <span className="text-[10px] text-zinc-400 font-mono tabular-nums">
                  1 = {formatARS(fromInfo.price)}
                </span>
              )}
            </div>
            <select
              value={fromCurrencyId}
              onChange={(e) => setFromCurrencyId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:border-white/[0.2] transition cursor-pointer"
            >
              <option value="ARS">🇦🇷 Peso Argentino (ARS)</option>
              <optgroup label="Dólares (USD)">
                {AVAILABLE_CURRENCIES.filter((c) => c.category === "Dólares").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Otras Divisas">
                {AVAILABLE_CURRENCIES.filter((c) => c.category === "Otras Divisas").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Swap */}
          <div className="sm:col-span-1 flex justify-center py-0.5 sm:py-0">
            <button
              type="button"
              onClick={handleSwap}
              title="Invertir"
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.06] transition flex items-center justify-center group"
            >
              <ArrowUpDownIcon className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />
            </button>
          </div>

          {/* Destino */}
          <div className="sm:col-span-5 bg-zinc-900/40 p-3 rounded-xl border border-white/[0.06] min-w-0">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Recibes
              </label>
              {toCurrencyId !== "ARS" && (
                <span className="text-[10px] text-zinc-400 font-mono tabular-nums">
                  1 = {formatARS(toInfo.price)}
                </span>
              )}
            </div>
            <select
              value={toCurrencyId}
              onChange={(e) => setToCurrencyId(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-zinc-900 border border-white/[0.08] rounded-lg text-xs text-zinc-100 font-mono focus:outline-none focus:border-white/[0.2] transition cursor-pointer"
            >
              <option value="ARS">🇦🇷 Peso Argentino (ARS)</option>
              <optgroup label="Dólares (USD)">
                {AVAILABLE_CURRENCIES.filter((c) => c.category === "Dólares").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Otras Divisas">
                {AVAILABLE_CURRENCIES.filter((c) => c.category === "Otras Divisas").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* 3. Input de Monto */}
        <div className="bg-zinc-900/30 p-3.5 rounded-xl border border-white/[0.06] space-y-2 mb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Ingresar Monto a convertir ({fromInfo.symbol})
            </label>
            <div className="flex items-center gap-1">
              {fromCurrencyId === "ARS" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAmount(10000)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  >
                    10.000
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(500000)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  >
                    100k
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(1000000)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  >
                    1M
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setAmount(100)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  >
                    100
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(500)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  >
                    500
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmount(1000)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 hover:text-white border border-white/[0.06]"
                  >
                    1.000
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-500 pointer-events-none">
              {fromInfo.symbol === "ARS" ? "$" : fromInfo.symbol}
            </span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              className="w-full pl-10 pr-3 py-2 bg-zinc-900 border border-white/[0.08] rounded-lg text-lg font-mono font-medium text-white focus:outline-none focus:border-white/[0.2] transition tabular-nums"
              placeholder="0"
            />
          </div>
        </div>

        {/* 4. Resultado */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/[0.08] mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
              Valor a recibir
            </span>
            <span className="text-[10px] font-mono text-zinc-500">
              1 {fromInfo.symbol} = {crossRate >= 1 ? crossRate.toFixed(2) : crossRate.toFixed(4)} {toInfo.symbol}
            </span>
          </div>

          <div className="text-2xl sm:text-3xl font-mono font-medium text-white tracking-tight tabular-nums">
            {toCurrencyId === "ARS"
              ? formatARS(convertedResult)
              : `${convertedResult.toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${toInfo.symbol}`}
          </div>
        </div>
      </div>
    </div>
  );
}
