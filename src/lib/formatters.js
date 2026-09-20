/**
 * Financial Formatting Utilities for Argentine Peso (ARS)
 */

export function formatARS(value) {
  if (value === undefined || value === null || isNaN(value)) return "$0,00";
  return `$${Number(value).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPct(value) {
  if (value === undefined || value === null || isNaN(value)) return "0.00%";
  const num = Number(value);
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
}

