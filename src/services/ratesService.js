/**
 * Dolariza2 - Financial Rates & Metrics Resilient Service
 * High-reliability multi-provider currency service for Argentina.
 * Primary: DolarAPI (Live)
 * Secondary: CriptoYa & Bluelytics (Failover Fallback)
 * Tertiary: ArgentinaDatos (Historical series & INDEC macro metrics)
 * Quaternary: In-Memory Resilient Cache & 2026 Baseline
 */

import {
  getHistoricalRatesSeries,
  getMacroEconomicIndicators,
} from "./argentinaDatosService";

// In-memory module cache to survive momentary network drops
let memoryCache = {
  dolares: null,
  cotizaciones: null,
  provider: "Iniciando",
  lastUpdated: null,
};

// Calibrated realistic 2026 baseline data
const FALLBACK_DOLARES = [
  {
    moneda: "USD",
    casa: "oficial",
    nombre: "Oficial (BNA)",
    compra: 1520.00,
    venta: 1570.00,
    previoVenta: 1570.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "USD",
    casa: "blue",
    nombre: "Blue (Libre)",
    compra: 1535.00,
    venta: 1555.00,
    previoVenta: 1565.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "USD",
    casa: "bolsa",
    nombre: "Bolsa / MEP",
    compra: 1530.00,
    venta: 1545.00,
    previoVenta: 1540.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "USD",
    casa: "contadoconliqui",
    nombre: "CCL (Contado con Liq.)",
    compra: 1550.00,
    venta: 1575.00,
    previoVenta: 1580.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "USD",
    casa: "tarjeta",
    nombre: "Tarjeta / Turista",
    compra: 1520.00,
    venta: 2512.00,
    previoVenta: 2512.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "USD",
    casa: "cripto",
    nombre: "Cripto (USDT)",
    compra: 1540.00,
    venta: 1555.00,
    previoVenta: 1550.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "USD",
    casa: "mayorista",
    nombre: "Mayorista (BCRA)",
    compra: 1540.00,
    venta: 1545.50,
    previoVenta: 1546.00,
    fechaActualizacion: new Date().toISOString(),
  },
];

const FALLBACK_COTIZACIONES = [
  {
    moneda: "EUR",
    casa: "oficial",
    nombre: "Euro Oficial",
    compra: 1670.00,
    venta: 1715.00,
    previoVenta: 1710.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "EUR",
    casa: "blue",
    nombre: "Euro Blue",
    compra: 1710.00,
    venta: 1750.00,
    previoVenta: 1745.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "BRL",
    casa: "oficial",
    nombre: "Real Brasileño",
    compra: 275.00,
    venta: 295.00,
    previoVenta: 294.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "CLP",
    casa: "oficial",
    nombre: "Peso Chileno (x100)",
    compra: 160.00,
    venta: 172.00,
    previoVenta: 171.00,
    fechaActualizacion: new Date().toISOString(),
  },
  {
    moneda: "UYU",
    casa: "oficial",
    nombre: "Peso Uruguayo",
    compra: 37.00,
    venta: 41.50,
    previoVenta: 41.20,
    fechaActualizacion: new Date().toISOString(),
  },
];

/**
 * Calculates variation between current and previous values
 */
export function calculateVariation(current, previous) {
  if (!previous || previous === 0 || !current) {
    return { diff: 0, diffPct: 0, isPositive: false, isZero: true };
  }
  const diff = current - previous;
  const diffPct = (diff / previous) * 100;
  return {
    diff: Number(diff.toFixed(2)),
    diffPct: Number(diffPct.toFixed(2)),
    isPositive: diff > 0,
    isZero: Math.abs(diff) < 0.0001,
  };
}

/**
 * Calculates exchange gap (brecha cambiaria) relative to official dollar
 */
export function calculateBrecha(ventaTarget, ventaOficial) {
  if (!ventaOficial || ventaOficial === 0 || !ventaTarget) return 0;
  const brecha = ((ventaTarget - ventaOficial) / ventaOficial) * 100;
  return Number(brecha.toFixed(2));
}

/**
 * Calculates buy/sell spread and its percentage
 */
export function calculateSpread(compra, venta) {
  if (!compra || !venta) return { spread: 0, spreadPct: 0 };
  const spread = venta - compra;
  const spreadPct = compra > 0 ? (spread / compra) * 100 : 0;
  return {
    spread: Number(spread.toFixed(2)),
    spreadPct: Number(spreadPct.toFixed(2)),
  };
}

/**
 * Determines whether Argentine foreign exchange markets are currently operating.
 * Argentine FX market typically operates Mon-Fri 10:00 to 15:00 ART (UTC-3).
 */
export function getMarketStatus() {
  const now = new Date();
  const artString = now.toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
  const artDate = new Date(artString);
  const day = artDate.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = artDate.getHours();
  const minute = artDate.getMinutes();

  const isWeekday = day >= 1 && day <= 5;
  const isBusinessHours = (hour > 10 || (hour === 10 && minute >= 0)) && hour < 15;

  return {
    isOpen: isWeekday && isBusinessHours,
    label: isWeekday && isBusinessHours ? "Mercado Abierto" : "Mercado Cerrado",
    schedule: "Lun a Vie 10:00 - 15:00 hs ART",
    lastCheck: artDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
  };
}

/**
 * Deterministic synthetic 7-day sparkline generator for realistic trend visualization
 */
export function getSparklineData(currentVenta, diffPct) {
  const points = [];
  const start = currentVenta / (1 + (diffPct || 0) / 100);
  const steps = 7;
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    const noise = (Math.sin(i * 1.8) * 0.003) * currentVenta;
    const val = start + (currentVenta - start) * progress + (i === 6 ? 0 : noise);
    points.push(Number(val.toFixed(2)));
  }
  return points;
}

/**
 * Generates historical series for chart comparison using current market baseline
 */
export function getHistoricalComparison(days = 30, currentRates = null) {
  const result = [];
  const now = new Date();

  const targetOficial = currentRates?.oficial?.venta || 1570.00;
  const targetBlue = currentRates?.blue?.venta || 1555.00;
  const targetMep = currentRates?.mep?.venta || 1545.00;

  // Realistic slope backwards
  const baseOficial = targetOficial * 0.94;
  const baseBlue = targetBlue * 0.95;
  const baseMep = targetMep * 0.945;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });

    const factor = (days - i) / days;
    const wave = Math.sin((days - i) * 0.28) * 14;
    const wave2 = Math.cos((days - i) * 0.22) * 11;

    const oficial = Number((baseOficial + (targetOficial - baseOficial) * factor + (i === 0 ? 0 : wave * 0.12)).toFixed(2));
    const blue = Number((baseBlue + (targetBlue - baseBlue) * factor + (i === 0 ? 0 : wave)).toFixed(2));
    const mep = Number((baseMep + (targetMep - baseMep) * factor + (i === 0 ? 0 : wave2)).toFixed(2));

    result.push({
      fecha: dateStr,
      isoDate: d.toISOString().split("T")[0],
      oficial,
      blue,
      mep,
      brecha: Number((((blue - oficial) / oficial) * 100).toFixed(2)),
    });
  }

  return result;
}

/**
 * Helper to fetch with timeout
 */
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 60 },
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/**
 * Secondary Failover: Fetch from CriptoYa
 */
async function fetchFromCriptoYa() {
  try {
    const res = await fetchWithTimeout("https://criptoya.com/api/dolar", 4500);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.blue) return null;

    const timestamp = new Date().toISOString();
    const mappedDolares = [
      {
        moneda: "USD",
        casa: "oficial",
        nombre: "Oficial (BNA)",
        compra: data.oficial?.bid || 1520,
        venta: data.oficial?.ask || data.oficial?.price || 1570,
        previoVenta: (data.oficial?.ask || 1570) * (1 - (data.oficial?.variation || 0) / 100),
        fechaActualizacion: timestamp,
      },
      {
        moneda: "USD",
        casa: "blue",
        nombre: "Blue (Libre)",
        compra: data.blue?.bid || 1535,
        venta: data.blue?.ask || 1555,
        previoVenta: (data.blue?.ask || 1555) * (1 - (data.blue?.variation || 0) / 100),
        fechaActualizacion: timestamp,
      },
      {
        moneda: "USD",
        casa: "bolsa",
        nombre: "Bolsa / MEP",
        compra: (data.mep?.al30?.["24hs"]?.price || 1545) * 0.995,
        venta: data.mep?.al30?.["24hs"]?.price || 1545,
        previoVenta: (data.mep?.al30?.["24hs"]?.price || 1545) * (1 - (data.mep?.al30?.["24hs"]?.variation || 0) / 100),
        fechaActualizacion: timestamp,
      },
      {
        moneda: "USD",
        casa: "contadoconliqui",
        nombre: "CCL (Contado con Liq.)",
        compra: (data.ccl?.al30?.["24hs"]?.price || 1575) * 0.99,
        venta: data.ccl?.al30?.["24hs"]?.price || 1575,
        previoVenta: (data.ccl?.al30?.["24hs"]?.price || 1575) * (1 - (data.ccl?.al30?.["24hs"]?.variation || 0) / 100),
        fechaActualizacion: timestamp,
      },
      {
        moneda: "USD",
        casa: "tarjeta",
        nombre: "Tarjeta / Turista",
        compra: data.oficial?.bid || 1520,
        venta: data.tarjeta?.price || ((data.oficial?.ask || 1570) * 1.6),
        previoVenta: data.tarjeta?.price || ((data.oficial?.ask || 1570) * 1.6),
        fechaActualizacion: timestamp,
      },
      {
        moneda: "USD",
        casa: "cripto",
        nombre: "Cripto (USDT)",
        compra: data.cripto?.usdt?.bid || 1540,
        venta: data.cripto?.usdt?.ask || 1555,
        previoVenta: (data.cripto?.usdt?.ask || 1555) * (1 - (data.cripto?.usdt?.variation || 0) / 100),
        fechaActualizacion: timestamp,
      },
      {
        moneda: "USD",
        casa: "mayorista",
        nombre: "Mayorista (BCRA)",
        compra: (data.mayorista?.price || 1545) * 0.998,
        venta: data.mayorista?.price || 1545.5,
        previoVenta: (data.mayorista?.price || 1545.5) * (1 - (data.mayorista?.variation || 0) / 100),
        fechaActualizacion: timestamp,
      },
    ];

    return mappedDolares;
  } catch (e) {
    return null;
  }
}

/**
 * Secondary Failover: Fetch from Bluelytics
 */
async function fetchFromBluelytics() {
  try {
    const res = await fetchWithTimeout("https://api.bluelytics.com.ar/v2/latest", 4500);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.blue) return null;

    const timestamp = new Date().toISOString();
    return {
      dolares: [
        {
          moneda: "USD",
          casa: "oficial",
          nombre: "Oficial (BNA)",
          compra: data.oficial?.value_buy || 1520,
          venta: data.oficial?.value_sell || 1570,
          previoVenta: data.oficial?.value_sell || 1570,
          fechaActualizacion: timestamp,
        },
        {
          moneda: "USD",
          casa: "blue",
          nombre: "Blue (Libre)",
          compra: data.blue?.value_buy || 1535,
          venta: data.blue?.value_sell || 1555,
          previoVenta: data.blue?.value_sell || 1555,
          fechaActualizacion: timestamp,
        },
      ],
      euro: [
        {
          moneda: "EUR",
          casa: "oficial",
          nombre: "Euro Oficial",
          compra: data.oficial_euro?.value_buy || 1670,
          venta: data.oficial_euro?.value_sell || 1715,
          previoVenta: data.oficial_euro?.value_sell || 1715,
          fechaActualizacion: timestamp,
        },
        {
          moneda: "EUR",
          casa: "blue",
          nombre: "Euro Blue",
          compra: data.blue_euro?.value_buy || 1710,
          venta: data.blue_euro?.value_sell || 1750,
          previoVenta: data.blue_euro?.value_sell || 1750,
          fechaActualizacion: timestamp,
        },
      ],
    };
  } catch (e) {
    return null;
  }
}

/**
 * Main fetcher function for Dollar rates with Multi-Provider Failover
 */
export async function getDolares() {
  let rawList = null;
  let sourceProvider = "DolarAPI";

  // Tier 1: Try DolarAPI
  try {
    const res = await fetchWithTimeout("https://dolarapi.com/v1/dolares", 4500);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        rawList = data;
        sourceProvider = "DolarAPI";
      }
    }
  } catch (err) {
    // Silent failover to Tier 2
  }

  // Tier 2: Try CriptoYa
  if (!rawList) {
    const criptoYaData = await fetchFromCriptoYa();
    if (criptoYaData && criptoYaData.length > 0) {
      rawList = criptoYaData;
      sourceProvider = "CriptoYa";
    }
  }

  // Tier 3: Try Bluelytics
  if (!rawList) {
    const bluelyticsData = await fetchFromBluelytics();
    if (bluelyticsData?.dolares) {
      rawList = bluelyticsData.dolares;
      sourceProvider = "Bluelytics";
    }
  }

  // Tier 4: Memory cache
  if (!rawList && memoryCache.dolares) {
    rawList = memoryCache.dolares;
    sourceProvider = "Cache Resiliente";
  }

  // Tier 5: Calibrated fallback
  if (!rawList) {
    rawList = FALLBACK_DOLARES;
    sourceProvider = "Respaldo Calibrado";
  }

  // Update memory cache
  memoryCache.dolares = rawList;
  memoryCache.provider = sourceProvider;
  memoryCache.lastUpdated = new Date().toISOString();

  // Format and enrich with variations, spreads, and sparklines
  return rawList.map((item) => {
    const fallback = FALLBACK_DOLARES.find((f) => f.casa === item.casa) || {};
    const previoVenta = item.previoVenta || fallback.previoVenta || (item.venta ? item.venta * 0.997 : 0);
    const variation = calculateVariation(item.venta, previoVenta);
    const spread = calculateSpread(item.compra, item.venta);

    return {
      ...item,
      id: item.casa || item.nombre,
      nombre: item.nombre || fallback.nombre || item.casa,
      previoVenta,
      variation,
      spread,
      provider: sourceProvider,
      sparkline: getSparklineData(item.venta, variation.diffPct),
    };
  });
}

/**
 * Main fetcher function for foreign currencies (Euro, Real, CLP, UYU)
 */
export async function getOtrasCotizaciones() {
  let rawList = null;
  let sourceProvider = "DolarAPI";

  try {
    const res = await fetchWithTimeout("https://dolarapi.com/v1/cotizaciones", 4500);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        rawList = data;
        sourceProvider = "DolarAPI";
      }
    }
  } catch (err) {
    // Failover
  }

  // Tier 2: Try Bluelytics for Euros if missing
  if (!rawList) {
    const bluelytics = await fetchFromBluelytics();
    if (bluelytics?.euro) {
      // Merge bluelytics euros with regional currencies from baseline
      rawList = [
        ...bluelytics.euro,
        ...FALLBACK_COTIZACIONES.filter((c) => c.moneda !== "EUR"),
      ];
      sourceProvider = "Bluelytics";
    }
  }

  if (!rawList && memoryCache.cotizaciones) {
    rawList = memoryCache.cotizaciones;
    sourceProvider = "Cache Resiliente";
  }

  if (!rawList) {
    rawList = FALLBACK_COTIZACIONES;
    sourceProvider = "Respaldo Calibrado";
  }

  memoryCache.cotizaciones = rawList;

  return rawList.map((item) => {
    const fallback = FALLBACK_COTIZACIONES.find((f) => f.moneda === item.moneda && f.casa === item.casa) ||
      FALLBACK_COTIZACIONES.find((f) => f.moneda === item.moneda) || {};
    const previoVenta = item.previoVenta || fallback.previoVenta || (item.venta ? item.venta * 0.996 : 0);
    const variation = calculateVariation(item.venta, previoVenta);
    const spread = calculateSpread(item.compra, item.venta);

    return {
      ...item,
      id: `${item.moneda}-${item.casa || 'oficial'}`,
      nombre: item.nombre || fallback.nombre || `${item.moneda} Oficial`,
      previoVenta,
      variation,
      spread,
      provider: sourceProvider,
      sparkline: getSparklineData(item.venta, variation.diffPct),
    };
  });
}

export { getHistoricalRatesSeries, getMacroEconomicIndicators };

/**
 * Combined financial snapshot with executive metrics & failover telemetry
 */
export async function getMarketSnapshot() {
  const [dolares, otrasCotizaciones, macro] = await Promise.all([
    getDolares(),
    getOtrasCotizaciones(),
    getMacroEconomicIndicators(),
  ]);

  const oficial = dolares.find((d) => d.casa === "oficial") || dolares[0];
  const blue = dolares.find((d) => d.casa === "blue") || dolares[1];
  const mep = dolares.find((d) => d.casa === "bolsa") || dolares[2];
  const ccl = dolares.find((d) => d.casa === "contadoconliqui");
  const cripto = dolares.find((d) => d.casa === "cripto");
  const tarjeta = dolares.find((d) => d.casa === "tarjeta");

  // Enrich dolares with brecha relative to official
  const enrichedDolares = dolares.map((d) => ({
    ...d,
    brecha: calculateBrecha(d.venta, oficial ? oficial.venta : 0),
  }));

  const brechaBlue = calculateBrecha(blue?.venta, oficial?.venta);
  const brechaMep = calculateBrecha(mep?.venta, oficial?.venta);

  // Pure arbitrage (Puré): MEP vs Blue profit margin
  let pureMargin = 0;
  if (mep && blue && mep.venta > 0 && blue.compra > 0) {
    pureMargin = Number((((blue.compra - mep.venta) / mep.venta) * 100).toFixed(2));
  }

  const marketStatus = getMarketStatus();

  return {
    dolares: enrichedDolares,
    otrasCotizaciones,
    allRates: [...enrichedDolares, ...otrasCotizaciones],
    keyRates: {
      oficial,
      blue,
      mep,
      ccl,
      cripto,
      tarjeta,
    },
    metrics: {
      brechaBlue,
      brechaMep,
      pureMargin,
      marketStatus,
      macro,
      provider: dolares[0]?.provider || "DolarAPI",
      lastUpdated: memoryCache.lastUpdated || new Date().toISOString(),
      highestRate: [...dolares].sort((a, b) => b.venta - a.venta)[0],
      lowestRate: [...dolares].sort((a, b) => a.venta - b.venta)[0],
    },
  };
}
