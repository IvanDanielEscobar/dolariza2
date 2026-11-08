# Dolariza2 💵🇦🇷
> **Terminal Analítica Financiera para el Monitoreo en Tiempo Real de Cotizaciones, Arbitraje Multidivisa y Noticias Económicas en Argentina.**  
> *Desarrollado por [Ivan Escobar] • Río Cuarto, Córdoba, Argentina.*

---

## 📌 Descripción General

**Dolariza2** es una plataforma analítica fintech de alto rendimiento diseñada con una estética ejecutiva inspirada en terminales financieras profesionales (Bloomberg / TradingView). Sitúa al **Peso Argentino (ARS)** como eje central de liquidez, permitiendo supervisar tipos de cambio oficiales y paralelos, variaciones en tiempo real, brechas cambiarias, realizar conversiones multidivisa cruzadas y acceder a noticias económicas en vivo.

---

## 🚀 Nuevas Capacidades y Mejoras Implementadas

### 1. Arquitectura API (Multi-Provider Resilient Pipeline)
Dolariza2 implementa un pipeline de respaldo en cascada (Failover multinivel):
- **Proveedor Primario (Tier 1)**: `DolarAPI` (Endpoints oficiales en tiempo real de dólares y divisas).
- **Proveedor Secundario (Tier 2)**: `CriptoYa API` (Fallo transparente hacia endpoints de alta frecuencia con cotizaciones de arbitraje, oficial, blue, mep, ccl y stablecoins).
- **Proveedor Terciario (Tier 3)**: `Bluelytics API` (Respaldo para cotizaciones oficiales y paralelas del dólar y euro).
- **Caché Resiliente en Memoria (Tier 4)**: Preserva en memoria del servidor la última respuesta exitosa en caso de microcortes de red.

### 2. Calculadora Multimoneda & Arbitraje Cruzado
- **Selección Libre de Divisas**: Ahora el usuario puede elegir cualquier **Moneda de Origen** y cualquier **Moneda de Destino**:
  - *ARS, Dólar Blue, Oficial, MEP, CCL, Cripto (USDT), Tarjeta/Turista, Euro Oficial, Euro Blue, Real Brasileño, Peso Chileno y Peso Uruguayo*.
- **Tipo de Cambio Cruzado**: Cálculo automático del arbitraje exacto (ej. convertir de Dólar Blue a Euros o de USDT a Reales).
- **Botón Invertir (Swap)**: Intercambio instantáneo de origen y destino en un clic.
- **Modos de Operación**: *Comprar (usa precio de Venta)* o *Vender (usa precio de Compra)*.
- **Acceso Rápido a Montos (Presets)**: Botones directos (+100k, +500k, +1M ARS / +100, +500, +1.000 USD/EUR).

### 3. Sección de Noticias Financieras
- **Agregador en Tiempo Real**: Ingesta continua de noticias económicas y financieras desde agencias y diarios especializados (Ámbito Financiero, El Cronista, Infobae, iProfesional, La Nación, Bloomberg en Español).
- **Clasificación Automática por Rubro**: Filtro por categorías clave:
  - *Dólar & Divisas*
  - *BCRA & Inflación*
  - *Mercados & Bonos*
  - *Cripto & Fintech*
  - *Economía General*
- **Buscador Interactivo**: Filtrado en vivo por palabras clave en titulares y resúmenes.
- **Métricas de Lectura**: Cálculo de tiempo relativo (*"Hace 35 min"*).

### 4. Estilo Ejecutivo, Serio y Elegante
- **Paleta Dark Terminal**: Fondo azul noche profundo (`#090d16`), bordes sutiles en pizarra y esmeralda, micro-sombras y acabados translúcidos (*glassmorphism*).
- **Tipografía Tabular Financiera**: Números alineados monoespaciados (`font-mono font-variant-numeric: tabular-nums`) para evitar saltos visuales al actualizarse las cifras.
- **Micro-Interacciones**: Estados hover suaves, badges con pulsos de actividad y curvas SVG matemáticas sin librerías pesadas.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 | SSR, ISR y optimización de producción. |
| **Biblioteca UI** | React 19 | Server y Client Components con arquitectura desacoplada. |
| **Estilos** | Tailwind CSS 4 | Sistema de diseño empresarial responsivo en dark mode. |
| **APIs Cambiarias** | DolarAPI + CriptoYa + Bluelytics | Pipeline multi-proveedor tolerante a fallos. |
| **Feed de Noticias** | Google Financial RSS / Syndication | Cobertura en vivo de economía argentina. |
| **Visualización** | SVG Canvas Puro | Curvas matemáticas interpoladas para series históricas (7D, 30D, 90D). |

---

## 📂 Estructura del Proyecto

```text
dolariza2/
├── public/
│   └── img/
│       └── dolar-icon.png         # Isotipo oficial
├── src/
│   ├── app/
│   │   ├── calculadora/
│   │   │   └── page.jsx           # Vista del simulador multidivisa y arbitraje
│   │   ├── divisas/
│   │   │   └── page.jsx           # Monedas regionales (BRL, CLP, UYU)
│   │   ├── dolar/
│   │   │   └── page.jsx           # Pizarra completa de los 7 tipos de dólar
│   │   ├── euro/
│   │   │   └── page.jsx           # Euro Oficial y Blue
│   │   ├── noticias/
│   │   │   ├── NewsClient.jsx     # Buscador interactivo y filtros de categorías
│   │   │   └── page.jsx           # Portal principal de noticias financieras
│   │   ├── globals.css            # Tipografía tabular y directivas Tailwind
│   │   ├── layout.js              # Shell con Navbar, Footer y SEO
│   │   └── page.js                # Dashboard ejecutivo con KPIs y noticias
│   ├── components/
│   │   ├── CurrencyConverter.jsx  # Calculadora multidivisa universal
│   │   ├── FinancialNewsSection.jsx # Módulo de noticias en el dashboard
│   │   ├── Footer.jsx             # Pie de página institucional
│   │   ├── Icons.jsx              # Iconografía SVG modular
│   │   ├── MetricsSummary.jsx     # Tarjetas de cotizaciones principales
│   │   ├── Navbar.jsx             # Navegación con estado de mercado y badge live
│   │   ├── RatesTable.jsx         # Pizarra detallada de cotizaciones con filtros
│   │   ├── TickerBar.jsx          # Ticker continuo en tiempo real
│   │   └── TrendChart.jsx         # Gráfico histórico comparativo
│   ├── lib/
│   │   └── formatters.js          # Formateadores monetarios ARS y porcentajes
│   └── services/
│       ├── newsService.js         # Agregador y clasificador de noticias financieras
│       └── ratesService.js        # Pipeline multi-proveedor de cotizaciones
```

---

## 👨‍💻 Autor
**Ivan Escobar**  
- Localidad: Río Cuarto, Córdoba, Argentina.
