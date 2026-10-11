# Arquitectura de la Plataforma CARDTEROS (Headless Ecommerce + Astro + Collectibles Vault)

Este documento define la arquitectura de software, directrices de ingeniería, estándares de seguridad de nivel enterprise, accesibilidad (WCAG 2.2 AA), SEO técnico y regulaciones de comercio electrónico para la plataforma de cartas coleccionables, graded slabs y box breaks **CARDTEROS**.

---

## 1. Visión General del Sistema y Stack Tecnológico

El proyecto está diseñado bajo una arquitectura **Headless Commerce & Collectibles Vault de Ultra-Alto Rendimiento**:
- **Frontend / SSG / SSR Island Hub:** [Astro](https://astro.build/) (v5+) aprovechando Server-Driven Islands Architecture, cero JavaScript por defecto en páginas de catálogo y fichas de cartas estáticas, y deshidratación selectiva para componentes transaccionales.
- **Plataforma de Ecommerce / Backend Transaccional:** [Shopify](https://shopify.dev/) mediante la **Storefront GraphQL API (2025+)** para lectura de catálogo, gestión de variantes (singles numerados, cajas selladas, lotes), y creación de carritos de compra (`Cart API`).
- **Módulo de Live Box Breaks & Spots:** Arquitectura ligera orientada a eventos para asignación de equipos/divisiones en vivo con reservas atómicas y estado sincronizado.
- **Checkout y Procesamiento de Pagos:** **Shopify Hosted Checkout Extensibility** (cumplimiento PCI-DSS Nivel 1 garantizado por Shopify, pasarelas de alta confianza con soporte de pagos diferidos y antifraude: Stripe, Mercado Pago, PayPal, SPEI y tarjetas bancarias).
- **Manejo de Estado del Cliente:** [Nanostores](https://github.com/nanostores/nanostores) (`$cartState`, `$isCartOpen`, `$vaultFilterState`, `$breakSpotSelection`) para sincronizar el estado reactivo entre islas Astro independientes sin sobrecarga de frameworks monolíticos.
- **Estilos y Sistema de Diseño:** Tailwind CSS v4 con integración nativa vía `@tailwindcss/vite`, Design Tokens centralizados (`tokens.css`), variables CSS estándar y Atomic Design estricto. Cero dependencias obsoletas de configuración JS.

---

## 2. Diagrama de Arquitectura de Datos y Flujo de Comunicación

```
+-----------------------------------------------------------------------------------+
|                                  CLIENTE (BROWSER)                                |
|  - HTML Estático + CSS Crítico (Astro SSG/SSR)                                    |
|  - Islas Interactivas (client:idle / client:visible)                              |
|  - Nanostores ($cartState, $vaultFilter sincronizados en localStorage)            |
+--------------------------+--------------------------------+-----------------------+
                           |                                |
             (Fetch GraphQL Público)               (Mutaciones / Operaciones Seguras)
                           |                                |
                           v                                v
+--------------------------+----------+     +---------------+-----------------------+
|  Shopify Storefront GraphQL API     |     |   BFF / Astro API Endpoints (/api/*)  |
|  - Catálogo de Cartas & Cajas       |     |   - Anti-Scalper Token Bucket (Drops) |
|  - Inventario de Singles 1/1        |     |   - Input Sanitization & Zod Schemas  |
|  - Carrito público (Cart API)       |     |   - Verificación de Spots de Breaks   |
+--------------------------+----------+     +---------------+-----------------------+
                           |                                |
                           +---------------+----------------+
                                           |
                                           v
                        +-----------------------------------+
                        |   SHOPIFY CORE / HOSTED CHECKOUT  |
                        |   - PCI-DSS Nivel 1               |
                        |   - Protección Antifraude 3D-S    |
                        |   - Envíos Asegurados & Rastreo   |
                        +-----------------------------------+
```

---

## 3. Requerimientos de Seguridad de Nivel Enterprise

Para un marketplace de coleccionables de alto valor (donde piezas individuales pueden superar miles de dólares), la seguridad debe mitigar fraudes transaccionales, scraping abusivo de inventario y manipulación de drops limitados:

### 3.1. Gobernanza de Tokens y Secretos
1. **Storefront API Token (`PUBLIC_SHOPIFY_STOREFRONT_TOKEN`):** Es público por diseño de Shopify, pero sus permisos en la Custom App deben estar estrictamente limitados a lectura de catálogo (`unauthenticated_read_product_listings`) y mutaciones de carrito (`unauthenticated_write_checkouts`).
2. **Admin API Token (`SHOPIFY_ADMIN_TOKEN`):** **NUNCA** debe exponerse al cliente, bundle de JavaScript o repositorios públicos. Solo reside en el entorno seguro de servidor de Astro (`server-side runtime`) para sincronizaciones administrativas, actualización de estados de breaks o webhooks.
3. **Firma de Webhooks (`SHOPIFY_WEBHOOK_SECRET`):** Toda notificación entrante de Shopify (`orders/create`, `inventory_levels/update`) debe verificar su firma HMAC-SHA256 (`X-Shopify-Hmac-Sha256`) antes de procesar el payload.

### 3.2. Content Security Policy (CSP) y Hardening de Cabeceras HTTP
El servidor o middleware de Astro debe emitir cabeceras HTTP de respuesta estrictas:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.shopify.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://cdn.shopify.com https://cardteros.com; connect-src 'self' https://*.myshopify.com/api/ https://monorail-edge.shopifysvc.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self' https://*.myshopify.com;
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(self "https://*.myshopify.com")
```

### 3.3. Mitigación de Ataques Específicos de Coleccionables
- **Protección Anti-Bot y Anti-Scalper en Drops:** Los lanzamientos de Hobby Boxes limitadas (ej. Topps Resurgence, Chrome Update) y cartas 1/1 implementan Rate Limiting por IP (algoritmo Token Bucket) y validación de turnstile para evitar que bots acaparen el inventario en milisegundos.
- **Card Testing / Bot Abuse:** Los endpoints de mutación de carrito implementan fingerprinting y rate limiting para prevenir ataques automatizados de prueba de tarjetas de crédito.
- **Sanitización de Datos (Zod):** Validación rigurosa de todas las entradas del usuario (formularios de contacto, suscripción a drops, filtros facetados y reservas de breaks).
- **Protección de Datos Personales (LFPDPPP / GDPR):** Cifrado en tránsito (TLS 1.3), aviso de privacidad visible en el footer y política estricta de no divulgación de identidades de compradores de cartas de alta gama.

---

## 4. Requerimientos de SEO Técnico y Semántico para Cartas Coleccionables

El nicho de cartas deportivas y coleccionismo requiere un SEO estructurado para indexar piezas individuales, certificar autenticidad y optimizar visibilidad en Google Shopping y Rich Snippets:

### 4.1. Marcado Estructurado JSON-LD (Schema.org)
En cada página de carta individual (`/carta/[slug]` o `/producto/[handle]`):
1. `schema.org/Product` e `IndividualProduct`:
   - `name`: Nombre completo del coleccionable (ej. *"2025 Topps Resurgence Football Arc Flash Rob Gronkowski Auto Red Power Surge /10"*).
   - `image`: URL absoluta del scan de alta resolución en CDN.
   - `description`: Detalles del estado físico, centrado, bordes, esquina, superficie y certificación.
   - `sku` y `mpn`: Folio interno de bóveda o número de certificación de la empresa graduadora.
   - `serialNumber`: Numeración de la carta en el tiraje (ej. *"03/10"*, *"1/1"*).
   - `brand`: `{ "@type": "Brand", "name": "Topps" }`.
   - `offers`: `{ "@type": "Offer", "priceCurrency": "MXN", "price": "8500.00", "availability": "https://schema.org/InStock", "itemCondition": "https://schema.org/NewCondition" }`.
2. `schema.org/BreadcrumbList`: Ruta jerárquica clara: `Inicio > NFL > 2025 Topps Resurgence > Autógrafos > Rob Gronkowski Red Power Surge`.
3. `schema.org/Organization`: Datos de la empresa CARDTEROS, RFC, sellos de autenticidad y perfiles oficiales.

### 4.2. Core Web Vitals (CWV)
- **LCP (Largest Contentful Paint) < 2.5s:** La imagen principal del scan de la carta en la PDP debe usar `loading="eager"`, `fetchpriority="high"`, formato WebP/AVIF y dimensiones nativas explícitas para evitar saltos.
- **CLS (Cumulative Layout Shift) < 0.1:** Dimensiones explícitas basadas en los aspect ratios oficiales (`aspect-[2.5/3.5]` para cartas y `aspect-[3.125/5.375]` para slabs) en todas las tarjetas del catálogo.
- **INP (Interaction to Next Paint) < 200ms:** Cero hidratación en la ficha técnica descriptiva. Solo hidratar con `client:idle` o `client:visible` el visor interactivo de zoom, el selector de spots de break y el botón de compra.

---

## 5. Requerimientos de Accesibilidad (WCAG 2.2 AA / AAA)

La plataforma garantiza una experiencia universal sin barreras para usuarios con discapacidades visuales, motrices o cognitivas:

### 5.1. Ratios de Contraste de Color Oficiales
- **Texto Blanco Puro (`#FFFFFF`) sobre Canvas Obsidian (`#08090C`):** Ratio **19.8:1** (Supera ampliamente el estándar AAA).
- **Acento Prismatic Cyan (`#00E5FF`) sobre Canvas Obsidian (`#08090C`):** Ratio **13.9:1** (Cumple AAA para textos y elementos gráficos).
- **Emerald Gem Mint (`#00F5A0`) sobre Canvas Obsidian (`#08090C`):** Ratio **15.6:1** (Cumple AAA).
- **SuperFractor Gold (`#FFB800`) sobre Carbon Vault (`#10131A`):** Ratio **9.8:1** (Cumple AAA).
- **Texto Plateado (`#D9E2EC`) sobre Carbon Vault (`#10131A`):** Ratio **12.4:1** (Cumple AAA).
- **Bordes y Contornos de Foco:** Mínimo ratio 3:1 contra el fondo adyacente para cumplir WCAG 1.4.11 (Non-text Contrast).

### 5.2. Navegación por Teclado y Focus Management
- Enlace accesible para saltar navegación: `<a href="#main-content" class="skip-link">Saltar a la bóveda principal</a>`.
- Indicadores de foco (`:focus-visible`): Anillo sólido de 2px en color Prismatic Cyan (`#00E5FF`) con separación perimetral `outline-offset: 3px`.
- **Focus Trap en Modales y Cart Drawer:**
  1. El foco del teclado se transfiere automáticamente al primer elemento interactivo al abrir el drawer.
  2. La navegación con `Tab` y `Shift+Tab` permanece confinada dentro del modal/drawer.
  3. La tecla `Escape` cierra el drawer y devuelve el foco al botón que lo originó.
  4. Los atributos `aria-modal="true"` y `role="dialog"` aíslan el contenido de fondo mediante `inert`.

### 5.3. ARIA y Regiones Vivas (Screen Readers)
- **`aria-live="polite"` en Carrito:** Anuncio dinámico para lectores de pantalla: *"Se añadió 1 unidad de Patrick Mahomes String Theory Gold al carrito. Subtotal: $12,500.00 MXN"*.
- **Selector de Spots de Live Breaks:** Implementado como lista accesible con estados `aria-selected` y anuncio inmediato cuando un spot es reservado por otro usuario.
- **Descripciones `alt` precisas en cartas:** Textos que describan año, marca, serie, jugador, versión paralela y grado (ej. *"Carta coleccionable 2025 Topps Resurgence Rob Gronkowski autógrafo paralelo Red Power Surge numerado 3 de 10"*).

---

## 6. Convenciones de Commits Atómicos y Reglas de Desarrollo

- Todo cambio debe integrarse mediante **Commits Atómicos** siguiendo la especificación [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat(scope): descripción concisa`
  - `fix(scope): descripción concisa`
  - `docs(scope): descripción concisa`
  - `style(scope): ajustes visuales o de formato sin lógica`
  - `refactor(scope): refactorización interna`
  - `chore(scope): tareas de mantenimiento, dependencias o tooling`
- Cada commit debe representar una unidad lógica reversible e independiente, con código limpio y sin errores de compilación o linting.
