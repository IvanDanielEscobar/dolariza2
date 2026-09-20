# Dolariza2 💵🇦🇷
> **Plataforma analítica fintech para el monitoreo en tiempo real de cotizaciones, spreads, métricas y brecha cambiaria en Argentina.**  
> *Desarrollado por [Ivan Escobar](https://wa.me/5493585735413) • Río Cuarto, Córdoba, Argentina.*

---

## 📌 Descripción General

**Dolariza2** es una solución web empresarial diseñada para seguir la dinámica cambiaria argentina de forma clara, ágil y confiable. A diferencia de convertidores genéricos internacionales que toman como pivote el dólar estadounidense, **Dolariza2 sitúa al Peso Argentino (ARS) como moneda base central**, calculando todas las cotizaciones, variaciones y operaciones de compra/venta respecto al mercado local.

La aplicación provee métricas ejecutivas, análisis de brechas cambiarias, matriz de arbitraje en tiempo real y gráficos de tendencia histórica con cero dependencias externas de librerías de gráficos.

---

## 🚀 Características Principales

### 1. Monitoreo en Tiempo Real y Métricas Cambiarias
- **7 tipos de cotizaciones del dólar**: Dólar Blue, Oficial, MEP (Bolsa), CCL (Contado con Liquidación), Tarjeta/Turista, Cripto y Mayorista.
- **Divisas Regionales e Internacionales**: Euro (Oficial y Blue), Real Brasileño (BRL), Peso Chileno (CLP) y Peso Uruguayo (UYU).
- **Métricas 24h en Vivo**: Variación nominal en ARS y variación porcentual con micro-indicadores direccionales (subas/bajas/estabilidad).
- **Spreads de Compra/Venta**: Cálculo exacto del margen de intermediación para cada cotización.
- **Monitoreo de Brecha Cambiaria**: Seguimiento instantáneo de la brecha porcentual entre el Dólar Oficial y las cotizaciones paralelas/financieras.

### 2. Calculadora de Conversión y Arbitraje ARS
- **Simulación Bidireccional**:
  - *Quiero Comprar Divisas*: Calcula la cantidad de moneda extranjera que obtienes entregando ARS al precio de **venta**.
  - *Quiero Vender Divisas*: Calcula la cantidad de ARS que recibes entregando moneda extranjera al precio de **compra**.
- **Ranking de Arbitraje**: Tabla comparativa interactiva que calcula automáticamente el retorno en ARS para un monto determinado a través de todos los mercados disponibles, identificando la mejor y peor opción de cambio.

### 3. Tendencias Históricas en SVG Nativo
- Gráfico interactivo responsivo de evolución temporal (7 días, 30 días, 90 días) comparando **Blue**, **Oficial** y **MEP**.
- Desarrollado íntegramente en SVG matemático puro (sin Chart.js ni Recharts), garantizando un peso de bundle mínimo, carga ultrarrápida y consistencia visual en dark mode.

### 4. Experiencia de Usuario y Arquitectura Visual
- **Ticker Continuo en Tiempo Real**: Cinta ribbon superior con cotizaciones rápidas y fluctuaciones.
- **Estado del Mercado Cambiario**: Indicador dinámico de apertura/cierre basado en el horario del BCRA y mercado financiero argentino (Lunes a Viernes de 10:00 a 15:00 hs ART).
- **Diseño Responsive Empresarial**: Jerarquía visual en patrón F adaptada para desktop, tablets y dispositivos móviles con Tailwind CSS.

### 5. Resiliencia y Rendimiento
- **Incremental Static Regeneration (ISR)**: Revalidación en background cada 60 segundos (`next: { revalidate: 60 }`), optimizando la velocidad de respuesta y evitando el consumo excesivo de APIs externas.
- **Motor de Fallback Determinista**: Si la API externa no responde o se excede la cuota de peticiones, el servicio entra en modo de contingencia con datos financieros de respaldo para asegurar una disponibilidad del 100%.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Alto rendimiento, renderizado híbrido (SSR/ISR) y optimización de producción. |
| **Biblioteca UI** | React 19 | Arquitectura basada en Server Components y Client Components optimizados. |
| **Estilos** | Tailwind CSS 4 | Sistema de diseño empresarial en Dark Theme (#090d16) y utilidades responsivas. |
| **Iconografía** | SVG Nativo Modular | Micro-iconos financieros creados a medida sin paquetes npm pesados. |
| **Visualización** | SVG Canvas Puro | Curvas y áreas interactivas con cálculo de coordenadas algebraicas en React. |
| **Fuente de Datos** | DolarAPI REST API | Cotizaciones públicas del mercado cambiario argentino. |

---

## 📂 Estructura del Proyecto

```text
dolariza2/
├── public/
│   └── img/
│       └── kromacore-icon.png     # Isotipo de la plataforma
├── src/
│   ├── app/
│   │   ├── calculadora/
│   │   │   └── page.jsx           # Vista dedicada del simulador de cambio y arbitraje
│   │   ├── divisas/
│   │   │   └── page.jsx           # Cotizaciones de monedas regionales (BRL, CLP, UYU)
│   │   ├── dolar/
│   │   │   └── page.jsx           # Tablero exhaustivo de los 7 tipos de dólar
│   │   ├── euro/
│   │   │   └── page.jsx           # Cotizaciones de Euro Oficial y Euro Blue
│   │   ├── globals.css            # Configuración tipográfica tabular y directivas Tailwind
│   │   ├── layout.js              # Shell principal con SEO, metadata, Navbar y Footer
│   │   └── page.js                # Dashboard central con KPIs, matriz y gráficos
│   ├── components/
│   │   ├── CurrencyConverter.jsx  # Calculadora y ranking de arbitraje (Client Component)
│   │   ├── Footer.jsx             # Pie de página institucional y enlaces
│   │   ├── Icons.jsx              # Colección de iconos SVG financieros
│   │   ├── MetricsSummary.jsx     # Tarjetas ejecutivas KPI (Blue, Oficial, Brecha, etc.)
│   │   ├── Navbar.jsx             # Navegación, selector de rutas y estado de mercado
│   │   ├── RatesTable.jsx         # Tabla interactiva con filtros, búsqueda y sparklines
│   │   ├── TickerBar.jsx          # Cinta ticker de cotizaciones en tiempo real
│   │   └── TrendChart.jsx         # Gráfico histórico SVG interactivo con selectores de rango
│   ├── lib/
│   │   └── formatters.js          # Utilidades puras para formato de moneda ARS, porcentajes y fechas
│   └── services/
│       └── ratesService.js        # Integración con APIs, cálculo de spreads, brechas y fallback
├── next.config.mjs                # Configuración de orígenes permitidos y redirecciones
├── package.json                   # Dependencias y scripts del proyecto
└── README.md                      # Documentación técnica
```

---

## ⚙️ Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js 18.18+ o Node.js 20+
- npm, pnpm o yarn

### Pasos de ejecución

1. **Clonar el repositorio o ingresar al directorio**:
   ```bash
   cd dolariza2
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma.

4. **Compilar para producción**:
   ```bash
   npm run build
   ```

5. **Iniciar en entorno productivo**:
   ```bash
   npm start
   ```

---

## 📈 Lógica Financiera Implementada

- **Cálculo de Spread**:
  $$\text{Spread Nominal} = \text{Venta} - \text{Compra}$$
  $$\text{Spread \%} = \left( \frac{\text{Venta} - \text{Compra}}{\text{Compra}} \right) \times 100$$
- **Cálculo de Brecha Cambiaria**:
  $$\text{Brecha \%} = \left( \frac{\text{Cotización Destino} - \text{Dólar Oficial Venta}}{\text{Dólar Oficial Venta}} \right) \times 100$$
- **Horario de Mercado Financiero (BCRA)**:
  - Apertura: 10:00 ART
  - Cierre: 15:00 ART
  - Días hábiles: Lunes a Viernes

---

## 👤 Autor

**Ivan Daniel Escobar**  
- **Ubicación**: Río Cuarto, Córdoba, Argentina  
- **WhatsApp**: [+54 9 358 573-5413](https://wa.me/5493585735413)  
- **Repositorio**: [IvanDanielEscobar/dolariza2](https://github.com/IvanDanielEscobar/dolariza2)  

---

## 📄 Licencia

Este proyecto fue desarrollado con fines informativos y profesionales. La información financiera es provista para uso público de referencia y no constituye asesoramiento financiero ni recomendación de inversión.
