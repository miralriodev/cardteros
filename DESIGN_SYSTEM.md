# Sistema de Diseño Atómico CARDTEROS (CARDTEROS Design System)

Este documento especifica el Sistema de Diseño 100% completo para la plataforma de cartas coleccionables, graded slabs y box breaks de alto calibre **CARDTEROS**, estructurado bajo la metodología **Atomic Design** de Brad Frost y optimizado para Astro y Headless Shopify.

---

## 1. Fundamentos e Identidad Visual de Marca

### 1.1. Valores y Personalidad
- **Autenticidad Absoluta, Pasión Deportiva, Exclusividad de Bóveda y Emoción del Break ("Rip & Ship").**
- **Estética:** Dark Obsidian Luxury, reflejos refractores prismáticos (Cyan, Emerald, Trophy Gold), marcos acrílicos simulando slabs de graduación (PSA, Beckett BGS, CGC, SGC) y tipografía deportiva moderna de alto impacto.
- **Filosofía Visual:** Cada carta es una pieza de arte histórica y financiera. El diseño debe tratarlas como joyas en una bóveda blindada, con contrastes nítidos y microinteracciones de refracción holográfica.

### 1.2. Matriz de Design Tokens (Colores Oficiales)

| Nombre Semántico | Token CSS | Valor Hex | Uso Principal | Contraste WCAG |
| :--- | :--- | :--- | :--- | :--- |
| **Obsidian Vault (Base)** | `--color-bg-primary` | `#08090C` | Fondo principal de la aplicación, canvas de bóveda | 19.8:1 vs Blanco |
| **Carbon Surface** | `--color-bg-surface` | `#10131A` | Superficie de tarjetas de cartas, cajas selladas, contenedores | 18.2:1 vs Blanco |
| **Elevated Layer** | `--color-bg-elevated` | `#181D26` | Drawers, modales, barras flotantes, dropdowns | 16.5:1 vs Blanco |
| **Pure White** | `--color-text-primary` | `#FFFFFF` | Títulos principales, nombres de jugadores, precios destacados | 19.8:1 vs Base |
| **Silver Shield** | `--color-text-secondary` | `#D9E2EC` | Subtítulos, nombres de colecciones, metadatos | 12.4:1 vs Base |
| **Prismatic Cyan** | `--color-brand-cyan` | `#00E5FF` | Refractor primario, estados de foco, botones principales, links activos | 13.9:1 vs Base |
| **Emerald Gem Mint** | `--color-brand-emerald` | `#00F5A0` | Badges PSA 10, stock disponible, verificación aprobada, spots libres | 15.6:1 vs Base |
| **SuperFractor Gold** | `--color-brand-gold` | `#FFB800` | Cartas 1/1 One-of-One, trofeos de break, paralelos Gold /10 | 9.8:1 vs Base |
| **Holo Purple** | `--color-brand-purple`| `#9D00FF` | Paralelos numerados, autógrafos raros, tags de rareza épica | 7.1:1 vs Blanco |
| **Live Break Crimson** | `--color-brand-crimson`| `#FF3366` | En vivo ("Live Stream"), spots a punto de agotarse, alertas críticas | Cumple AA |
| **Border Acrylic** | `--color-border-subtle` | `#1E2430` | Bisel perimetral de slabs y divisiones de catálogo | 3.5:1 vs Fondo |

### 1.3. Escalas de Espaciado y Layout (Grilla Base de 8px)
- Base: `4px` (medio paso) y `8px` (paso completo).
- `--space-1`: `4px` (separación compacta entre badges de grado y numeración)
- `--space-2`: `8px` (padding interno de etiquetas)
- `--space-3`: `12px` (gap entre filtros y botones secundarios)
- `--space-4`: `16px` (padding estándar de tarjetas de carta)
- `--space-6`: `24px` (espaciado entre columnas del catálogo)
- `--space-8`: `32px` (márgenes entre secciones temáticas)
- `--space-12`: `48px` (separación entre bloques maestros)
- `--space-16`: `64px` (padding vertical de secciones hero y vitrinas)
- `--space-24`: `96px` (márgenes principales de landing)

### 1.4. Radios de Borde y Proporciones de Cartas
- `--radius-none`: `0px`
- `--radius-xs`: `2px` (esquinas interiores de marcos de carta)
- `--radius-sm`: `4px` (badges de numeración y micro-etiquetas)
- `--radius-md`: `8px` (botones interactivos y píldoras de filtro)
- `--radius-lg`: `12px` (tarjetas slab acrílicas con esquinas biseladas)
- `--radius-xl`: `16px` (cajas de Live Breaks y contenedores de stream)
- `--radius-2xl`: `24px` (modales de zoom de ultra-resolución)
- `--radius-full`: `9999px` (chips circulares, avatares de breakers y contadores)

**Proporciones Oficiales:**
- Proporción Estándar de Carta (Trading Card): `aspect-[2.5/3.5]` (ancho:alto = 1 : 1.4).
- Proporción de Graded Slab Holder: `aspect-[3.125/5.375]` (soporte acrílico para etiquetas de certificación).

---

## 2. Guía de Ubicación y Estructura de Activos de Cartas y Logos

Para asegurar rendimiento, modularidad y orden estricto:

```
client/
├── public/
│   ├── favicon.ico                         <- Multi-resolución (16x16, 32x32, 48x48)
│   ├── favicon.svg                         <- Isotipo vectorial Cardteros para navegadores modernos
│   ├── site.webmanifest                    <- Manifiesto PWA
│   ├── branding/
│   │   ├── cardteros-logo-full.svg         <- Imagotipo horizontal completo
│   │   ├── cardteros-isotipo.svg           <- Isotipo prisma de diamante/carta
│   │   └── cardteros-og-default.jpg        <- 1200x630 para OpenGraph / Redes Sociales
│   └── images/
│       ├── cards/                          <- Scans de cartas en alta resolución (WebP)
│       │   ├── topps-resurgence-mahomes.webp
│       │   ├── topps-gronkowski-auto.jpg
│       │   ├── curry-moments-gold.webp
│       │   └── jabbar-chrome-auto.webp
│       └── breaks/                         <- Cajas de Hobby Breaks y Value Boxes
│           ├── resurgence-hobby-box.webp
│           └── chrome-basketball-box.webp
│
└── src/
    ├── assets/                             <- Assets procesables por Vite/Astro
    ├── components/                         <- Componentes bajo Atomic Design
    ├── stores/                             <- Estado reactivo Nanostores
    └── styles/                             <- Design Tokens y Tailwind CSS v4
```

---

## 3. Catálogo Completo de Componentes Atómicos (100% de Especificación)

### 3.1. Átomos (Primitivas Fundamentales)
1. **`Button.astro`:** Botón accesible con variantes (`primary` [Cian brillante], `secondary` [Carbón elevado], `gold` [SuperFractor 1/1], `outline`, `ghost`), soporte de tamaños (`sm`, `md`, `lg`), estados (`default`, `hover`, `active`, `loading`, `disabled`) y `:focus-visible`.
2. **`GradingBadge.astro`:** Insignia oficial de certificación de cartas con formato y colores de empresas líderes:
   - `PSA 10`: Cabecera roja con texto blanco y etiqueta "GEM MT 10".
   - `BGS 9.5`: Placa dorada con texto oscuro y desglose de subgrados.
   - `CGC 10`: Placa azul con tipografía nítida "PRISTINE 10".
   - `SGC 10`: Placa negra estilo "Tuxedo" de alto contraste.
   - `RAW`: Placa plateada/gris neutro para cartas sin graduar inspeccionadas.
3. **`RarityBadge.astro`:** Badges de rareza y tiraje especial:
   - `1/1 SuperFractor`: Acabado dorado metálico con pulso.
   - `Numbered /10`, `/25`, `/99`: Monocromo en `JetBrains Mono`.
   - `Rookie Card (RC)`: Acento deportivo emblemático.
   - `On-Card Auto`: Distintivo de firma directa en la tarjeta.
   - `Game-Worn Patch`: Reliquia de uniforme utilizada en juego.
4. **`Input.astro`:** Campo de entrada de texto accesible con labels semánticos, indicador cian en foco y soporte para autocompletado de búsqueda de cartas.
5. **`Icon.astro`:** Wrapper de iconos SVG optimizados con `aria-hidden="true"` (carta, bóveda, candado de seguridad, fuego de break, lupa, carrito, estrella, trofeo, flecha).
6. **`Heading.astro` & `Text.astro`:** Primitivas tipográficas con jerarquía semántica (`h1` a `h6`, `p`, `span`) en `Outfit` e `Inter`.
7. **`CardSlabFrame.astro`:** Marco acrílico protector con bisel de refracción perimetral simulando el estuche hermético de una carta de colección.
8. **`ShimmerEffect.astro`:** Capa de brillo holográfico acelerada por hardware GPU que reacciona suavemente al cursor.
9. **`Spinner.astro`:** Indicador giratorio de carga con `role="status"` y texto oculto accesible `sr-only`.
10. **`Skeleton.astro`:** Marcador de posición de carga con brillo suave y atributo `aria-busy="true"`.

### 3.2. Moléculas (Unidades Funcionales Compuestas)
1. **`TradingCardItem.astro`:** Tarjeta de carta completa con proporción 2.5:3.5, scan en alta definición, insignia de graduación superior, nombre del deportista, año, colección, numeración de serie, precio en MXN/USD y botón rápido para añadir a la bóveda.
2. **`BoxBreakCard.astro`:** Tarjeta de Live Box Break que muestra la caja sellada de colección (Hobby Box), fecha y hora del stream en vivo, precio por spot/equipo, y barra de llenado en tiempo real.
3. **`BreakProgressBar.astro`:** Barra reactiva que ilustra cuántos spots han sido vendidos y cuántos faltan para que la caja sea abierta en directo (ej. *"28 de 32 spots ocupados - ¡Faltan 4 para abrir en vivo!"*).
4. **`PriceDisplay.astro`:** Desglose del valor de la carta, precio comparativo de mercado reciente (Comps de subastas eBay/Goldin) y estimación de plusvalía.
5. **`SearchBar.astro`:** Barra de búsqueda global con icono, botón de borrado rápido (`clear`), debounce y soporte ARIA para sugerencias instantáneas.
6. **`FilterPill.astro`:** Píldoras de filtrado rápido por Deporte (NFL, NBA, MLB, Soccer, F1), Tipo (Graded Slabs, Singles Raw, Cajas Selladas) y Rareza (1/1, Autógrafos).
7. **`CartItemPreview.astro`:** Fila de coleccionable dentro del carrito con miniatura, nombre del jugador, grado de certificación, control de cantidad y botón accesible de eliminación.
8. **`SocialProofToast.astro`:** Alerta discreta flotante de confianza comunitaria (ej. *"Coleccionista en CDMX acaba de adquirir Patrick Mahomes 2025 Gold /10"*).

### 3.3. Organismos (Estructuras de Alto Nivel)
1. **`Header.astro`:** Barra de navegación superior con barra de envíos asegurados y blindados, Imagotipo de CARDTEROS con acento prismático, selector de deportes, enlace a Live Breaks, buscador global y botón interactivo del carrito con contador reactivo.
2. **`CartDrawer.astro`:** Slideover lateral accesible con focus-trap, lista reactiva de productos, sello de garantía de autenticidad de la bóveda, cálculo de envío asegurado con paquetería express y botón de Checkout Seguro de Shopify.
3. **`HeroVaultSection.astro`:** Sección principal de portada con exhibidor tridimensional de cartas icónicas (Rob Gronkowski Auto, Patrick Mahomes String Theory, Stephen Curry Refractor), resplandor ambiental y llamada a la acción para explorar la bóveda.
4. **`LiveBreaksGrid.astro`:** Parrilla interactiva de breaks en vivo organizados por fecha y estado (Abierto, Últimos Spots, En Vivo Ahora, Sold Out).
5. **`FeaturedSlabsGrid.astro`:** Vitrina de cartas de alto grado (PSA 10 Gem Mint y BGS Pristine) con filtros rápidos por categoría y ordenamiento por valor.
6. **`VaultTrustBadges.astro`:** Sección de sellos de confianza de nivel coleccionista:
   - 100% Autenticidad Certificada por expertos.
   - Empaque Blindado: Todas las cartas individuales viajan en Penny Sleeve + TopLoader rígido o MagHolder magnético, selladas contra humedad.
   - Envíos Asegurados a todo México con cobertura del 100% del valor comercial.
   - Pagos Encriptados y soporte de meses sin intereses.
7. **`Footer.astro`:** Pie de página con Imagotipo en blanco puro, enlaces a políticas legales (Autenticidad, Envíos Blindados, Devoluciones, Privacidad), métodos de pago aceptados y glosario del coleccionista.

### 3.4. Templates (Diseños Maestros)
1. **`MainLayout.astro`:** Layout maestro con metadatos SEO, OpenGraph para coleccionables, fuentes tipográficas Google Fonts (`Outfit` e `Inter`), Header, Main con `id="main-content"`, CartDrawer y Footer.
2. **`VaultCollectionTemplate.astro`:** Layout de catálogo con panel de filtros multifacéticos y rejilla adaptable de cartas.
3. **`CardDetailTemplate.astro`:** Layout de ficha técnica con visor de ultra-zoom, historial de ventas similares, datos de certificación y buy box.
4. **`LiveBreakDetailTemplate.astro`:** Layout dedicado para la transmisión de Box Breaks con selector interactivo de equipos/divisiones.

### 3.5. Páginas (Rutas de la Aplicación)
- `/`: Portada de la Bóveda CARDTEROS con hero inmersivo, breaks destacados, vitrina de slabs y sellos de confianza.
- `/boveda`: Catálogo general de cartas graduadas y piezas de colección individuales.
- `/live-breaks`: Calendario y venta de spots para Box Breaks y Case Breaks.
- `/cajas-selladas`: Hobby Boxes, Blaster Boxes y Mega Boxes selladas de fábrica.
- `/autenticidad-y-envios`: Explicación detallada del empaque blindado, certificación y póliza de seguro de transporte.
