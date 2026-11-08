/**
 * Dolariza2 - Financial News Service
 * Real-time economic and financial news aggregation for Argentina.
 * Official direct feeds: Ámbito Financiero & El Cronista Comercial.
 * Resilient fallback redundancy with full entity decoding and HTML sanitization.
 */

// In-memory module cache for high performance & rate-smoothing
let newsCache = {
  items: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export const FALLBACK_NEWS = [
  {
    id: "fb-1",
    title: "Mercado cambiario: cómo operan el dólar blue, MEP y CCL tras las últimas medidas del BCRA",
    source: "Ámbito Financiero",
    sourceSlug: "ambito",
    category: "Dólar & Divisas",
    categoryColor: "emerald",
    link: "https://www.ambito.com/finanzas",
    imageUrl: null,
    pubDate: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    timeAgo: "Hace 25 min",
    readTime: "3 min",
    snippet: "La brecha cambiaria se mantiene estable mientras los tipos de cambio financieros arbitran operaciones en la plaza mayorista y bursátil.",
    isBreaking: true,
  },
  {
    id: "fb-2",
    title: "Riesgo país y bonos de la deuda: la respuesta de los inversores ante la licitación del Tesoro",
    source: "El Cronista",
    sourceSlug: "cronista",
    category: "Mercados & Bonos",
    categoryColor: "sky",
    link: "https://www.cronista.com/finanzas-mercados",
    imageUrl: null,
    pubDate: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    timeAgo: "Hace 1 hora",
    readTime: "4 min",
    snippet: "Los títulos soberanos en dólares cotizan con alzas moderadas en Wall Street y la plaza local, en una jornada atenta al tipo de cambio real.",
    isBreaking: false,
  },
  {
    id: "fb-3",
    title: "Tasas de plazo fijo e inflación: cuánto rinde colocar los pesos en los principales bancos",
    source: "El Cronista",
    sourceSlug: "cronista",
    category: "BCRA & Inflación",
    categoryColor: "amber",
    link: "https://www.cronista.com/finanzas-mercados",
    imageUrl: null,
    pubDate: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    timeAgo: "Hace 2 horas",
    readTime: "3 min",
    snippet: "El Banco Central monitorea el ritmo de colocaciones y las tasas de referencia ofrecidas por las entidades bancarias frente a la evolución del IPC.",
    isBreaking: false,
  },
  {
    id: "fb-4",
    title: "Dólar Cripto y stablecoins: el volumen de USDT supera récord en operaciones minoristas",
    source: "Ámbito Financiero",
    sourceSlug: "ambito",
    category: "Cripto & Fintech",
    categoryColor: "indigo",
    link: "https://www.ambito.com/finanzas",
    imageUrl: null,
    pubDate: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    timeAgo: "Hace 3 horas",
    readTime: "2 min",
    snippet: "Las billeteras virtuales y exchanges registran mayor demanda de dólares digitales como cobertura y vía de dolarización sin límites de cupo.",
    isBreaking: false,
  },
];

/**
 * Robust XML & HTML Entity decoder (handles CDATA, named, decimal, and hex entities)
 */
export function decodeHtmlEntities(str = "") {
  if (!str) return "";
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCharCode(dec);
      } catch (e) {
        return "";
      }
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      try {
        return String.fromCharCode(parseInt(hex, 16));
      } catch (e) {
        return "";
      }
    });
}

/**
 * Complete plain-text sanitizer for news titles and descriptions
 */
export function cleanText(input = "") {
  if (!input) return "";
  let text = decodeHtmlEntities(input);
  // Strip all HTML tags
  text = text.replace(/<[^>]*>/g, " ");
  // Strip unparsed URLs
  text = text.replace(/https?:\/\/[^\s]+/gi, " ");
  // Collapse whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

/**
 * URL sanitizer (decodes entities and CDATA while keeping the URL intact)
 */
export function cleanUrl(url = "") {
  if (!url) return "#";
  return url
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, "$1")
    .replace(/&amp;/g, "&")
    .trim();
}

/**
 * Calculates human readable relative time in Spanish
 */
export function getRelativeTimeString(date) {
  if (!date || isNaN(date.getTime())) return "Reciente";
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diffSec < 60) return "Hace un momento";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString("es-AR", { day: "2-digit", month: "short" });
}

/**
 * Classifies headline into a financial sector
 */
export function classifyNews(title = "", snippet = "") {
  const text = `${title} ${snippet}`.toLowerCase();

  if (/d[oó]lar|blue|mep|ccl|divisa|cambiari|tarjeta|tipo de cambio|oficial/.test(text)) {
    return { category: "Dólar & Divisas", color: "emerald" };
  }
  if (/bcra|banco central|inflaci[oó]n|tasa|plazo fijo|reservas|fmi|ipc|lecap|lefi|deuda|tesoro/.test(text)) {
    return { category: "BCRA & Inflación", color: "amber" };
  }
  if (/bonos|acciones|merval|wall street|riesgo pa[ií]s|s&p|adrs|burs[aá]til|licitaci[oó]n/.test(text)) {
    return { category: "Mercados & Bonos", color: "sky" };
  }
  if (/cripto|bitcoin|usdt|usdc|binance|fintech|stablecoin|ethereum/.test(text)) {
    return { category: "Cripto & Fintech", color: "indigo" };
  }
  return { category: "Economía General", color: "cyan" };
}

/**
 * Parses single RSS feed XML string
 */
function parseFeedItems(xmlString, sourceMeta) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match;

  while ((match = itemRegex.exec(xmlString)) !== null) {
    const itemXml = match[1];

    const rawTitle = /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i.exec(itemXml)?.[1] || "";
    const rawLink = /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i.exec(itemXml)?.[1] || "";
    const rawDesc = /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i.exec(itemXml)?.[1] || "";
    const rawDate = /<pubDate>([\s\S]*?)<\/pubDate>/i.exec(itemXml)?.[1] || "";

    // Image extraction from enclosure or media:content
    const imgMatch =
      /<enclosure[^>]*url="([^"]*)"/i.exec(itemXml) ||
      /<media:content[^>]*url="([^"]*)"/i.exec(itemXml);
    const imageUrl = imgMatch ? cleanUrl(imgMatch[1]) : null;

    const title = cleanText(rawTitle);
    let snippet = cleanText(rawDesc);
    const link = cleanUrl(rawLink);
    const pubDate = rawDate ? new Date(rawDate) : new Date();

    if (!title || title.length < 12) continue;

    // In case description was empty or too short, generate contextual summary
    const { category, color } = classifyNews(title, snippet);
    if (!snippet || snippet.length < 20 || snippet.toLowerCase() === title.toLowerCase()) {
      if (category === "Dólar & Divisas") {
        snippet = "Seguimiento en tiempo real de las cotizaciones cambiarias, brecha oficial / blue y operatoria en los mercados financieros.";
      } else if (category === "BCRA & Inflación") {
        snippet = "Análisis de las resoluciones del Banco Central, nivel de reservas netas, tasas de referencia y evolución de la inflación.";
      } else if (category === "Mercados & Bonos") {
        snippet = "Evolución de los títulos de deuda soberana, riesgo país elaborado por J.P. Morgan e índices bursátiles del Merval y Wall Street.";
      } else if (category === "Cripto & Fintech") {
        snippet = "Comportamiento del dólar digital, demanda de stablecoins y tendencias en las principales plataformas fintech del país.";
      } else {
        snippet = "Principales variables macroeconómicas, balance fiscal y coyuntura financiera de la economía argentina.";
      }
    }

    const words = title.split(" ").length;
    const readTime = `${Math.max(2, Math.min(5, Math.ceil(words / 4)))} min`;

    items.push({
      id: `${sourceMeta.slug}-${Math.random().toString(36).substring(2, 9)}`,
      title,
      snippet,
      link,
      imageUrl,
      source: sourceMeta.name,
      sourceSlug: sourceMeta.slug,
      sourceUrl: sourceMeta.site,
      pubDate: pubDate.toISOString(),
      timestamp: isNaN(pubDate.getTime()) ? Date.now() : pubDate.getTime(),
      timeAgo: getRelativeTimeString(pubDate),
      category,
      categoryColor: color,
      readTime,
      isBreaking: false,
    });
  }

  return items;
}

/**
 * Main fetcher function for Financial News from Ámbito and El Cronista
 */
export async function getFinancialNews(limit = 24) {
  const now = Date.now();
  if (newsCache.items && now - newsCache.timestamp < CACHE_TTL_MS) {
    return newsCache.items.slice(0, limit);
  }

  const sources = [
    {
      name: "El Cronista",
      slug: "cronista",
      site: "https://www.cronista.com",
      url: "https://www.cronista.com/files/rss/finanzas.xml",
    },
    {
      name: "Ámbito Financiero",
      slug: "ambito",
      site: "https://www.ambito.com",
      url: "https://www.ambito.com/rss/finanzas.xml",
    },
  ];

  try {
    const results = await Promise.allSettled(
      sources.map(async (src) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(src.url, {
          signal: controller.signal,
          next: { revalidate: 180 }, // Revalidate every 3 minutes
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
          },
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const xml = await res.text();
        return parseFeedItems(xml, src);
      })
    );

    let combined = [];
    for (const r of results) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        combined.push(...r.value);
      }
    }

    if (combined.length > 0) {
      // Sort chronologically descending (freshest first)
      combined.sort((a, b) => b.timestamp - a.timestamp);

      // De-duplicate any near-identical titles
      const seen = new Set();
      const deduplicated = [];
      for (const item of combined) {
        const key = item.title.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 40);
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated.push(item);
        }
      }

      if (deduplicated.length > 0) {
        deduplicated[0].isBreaking = true;
      }

      newsCache.items = deduplicated;
      newsCache.timestamp = now;
      return deduplicated.slice(0, limit);
    }

    return newsCache.items || FALLBACK_NEWS;
  } catch (err) {
    console.error("[newsService] Error fetching feeds:", err.message);
    return newsCache.items || FALLBACK_NEWS;
  }
}
