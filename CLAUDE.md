# Directrices de Desarrollo y Reglas de Ingeniería - CARDTEROS Collectibles

## 1. Convenciones y Reglas de Desarrollo

- **Perfil de Ingeniería:** Desarrollo Fullstack riguroso. Prohibido código superficial ("vibecoding") o atajos sin tipado, validación o semántica.
- **Commits Atómicos:** Todo cambio debe comitearse de forma atómica siguiendo la especificación [Conventional Commits](https://www.conventionalcommits.org/):
  - `feat`: Nuevas características o componentes del sistema de diseño.
  - `fix`: Corrección de bugs o fallas de accesibilidad/estilo.
  - `docs`: Documentación técnica o guías de diseño.
  - `style`: Ajustes cosméticos o formato sin impacto en lógica de negocio.
  - `refactor`: Mejoras de arquitectura o reestructuración interna.
  - `chore`: Tareas de dependencias, scripts o mantenimiento.
- **Sistema de Diseño Atómico:** Todo componente UI debe pertenecer estrictamente a uno de los niveles de Atomic Design:
  - `src/components/atoms/` (Botones, inputs, badges de graduación [PSA, BGS, SGC, CGC], iconos, slab borders, shimmer refractors).
  - `src/components/molecules/` (Tarjetas de cartas coleccionables, tarjetas de Live Breaks, selectores de spots, desglose de precio, barras de progreso).
  - `src/components/organisms/` (Navbar/Header, Cart Drawer, Parrilla de Breaks en Vivo, Bóveda de Cartas Graduadas, Filtros de Rareza, Footer).
  - `src/components/templates/` (Layouts maestros y estructuras de página).
- **Tailwind CSS v4 (Uso 100% Obligatorio y Mejores Prácticas):**
  - Se utiliza estrictamente **Tailwind CSS v4** integrado vía `@tailwindcss/vite`.
  - Prohibido crear archivos obsoletos `tailwind.config.js`. La configuración del tema reside en `src/styles/global.css` mediante la directiva `@theme`.
  - **Tipografía Oficial:**
    - Títulos y encabezados deportivos/impacto: `Outfit` (`font-heading`).
    - Cuerpo de texto y especificaciones: `Inter` (`font-body`).
    - Seriales de cartas, folios de certificación y métricas: `JetBrains Mono` (`font-mono`).
  - **Geometría y Estilo:**
    - Proporción oficial de carta deportiva: `aspect-[2.5/3.5]`.
    - Proporción de slabs acrílicos graduados: `aspect-[3.125/5.375]`.
    - Estructura de contenedor Slab: Utilidad `slab-card` con reflejo interior acrílico y bisel perimetral sutil.
    - Efectos de Refracción / Holográficos: Utilizar `holo-shimmer` para simular acabados Prizm, Chrome y Superfractor sin degradar el rendimiento (acelerado por hardware GPU).
  - Utilizar clases utilitarias de Tailwind directamente en componentes para máxima cohesión y evitar abusos de `@apply`.
- **Accesibilidad Obligatoria (WCAG 2.2 AA):**
  - Todo elemento interactivo debe tener `:focus-visible` claramente identificable con anillo cian (`#00E5FF`) y `outline-offset: 3px`.
  - Toda imagen de carta coleccionable debe contar con texto `alt` descriptivo exhaustivo (Jugador, deporte, año, set, variante, paralelismo y grado de certificación).
  - El carrito de compras y la reserva de spots en Live Breaks deben implementar `aria-live="polite"` para anunciar actualizaciones a lectores de pantalla.
  - Los drawers de carrito y modales de autenticidad deben implementar Focus Trap y cierre con tecla `Escape`.
- **Seguridad en Marketplace y Headless Ecommerce:**
  - Tokens administrativos (`SHOPIFY_ADMIN_TOKEN` o claves de API de bases de datos/bóveda) solo pueden utilizarse en el runtime del servidor (`src/pages/api/*`). Jamás exponer al cliente.
  - Toda entrada de usuario (búsquedas, filtros, checkout, selección de breaks) debe validarse estrictamente con esquemas Zod.
  - Mitigación de bots y scalpers en drops de Hobby Boxes limitadas y cartas 1/1 mediante Rate Limiting (Token Bucket).
  - Respetar cabeceras CSP estrictas y sanitización contra inyecciones XSS.
- **SEO para Cartas Coleccionables y Memorabilia:**
  - Cada PDP de carta o caja debe incluir Schema.org (`Product`, `IndividualProduct`, `Offer` con moneda MXN/USD, `SportsMemorabilia`, `BreadcrumbList`).
  - Metadatos clave de coleccionismo en el marcado: `serialNumber`, `itemCondition` (NewCondition para selladas, UsedCondition para singles), `certificateOfAuthenticity`.
  - Core Web Vitals estrictos: LCP < 2.5s para imágenes de alta resolución mediante optimización de Astro (`loading="eager"` en héroes, WebP/AVIF).

---

## 2. Documentos de Referencia del Proyecto

- [Arquitectura de Software y Seguridad](file:///c:/Dev/cardteros/client/ARCHITECTURE.md)
- [Sistema de Diseño Atómico CARDTEROS](file:///c:/Dev/cardteros/client/DESIGN_SYSTEM.md)
- [Tokens de Diseño Oficiales](file:///c:/Dev/cardteros/client/src/styles/tokens.css)
- [Estilos Globales y Tailwind v4](file:///c:/Dev/cardteros/client/src/styles/global.css)

---

## 3. Reglas de Integración con Figma (MCP)
- Cuando se proporcione una URL o nodo de Figma, ejecuta DIRECTAMENTE la herramienta MCP `figma.view_node` en memoria.
- PROHIBIDO crear scripts temporales en Node/Bun (`fetch.js`, `parse.js`, etc.) para llamar a la API de Figma.
- PROHIBIDO escribir respuestas JSON completas de Figma a disco (`scratch/`, `figma_node.json`, etc.).
- Extrae únicamente la semántica, espaciados, colores, tokens de rareza y tipografías necesarios para generar los componentes Astro/Tailwind.

---

## 4. Comandos de Desarrollo

Cuando inicies el servidor de desarrollo, utiliza el modo background según las reglas del entorno:

```sh
astro dev --background
```

Gestiona el servidor en segundo plano con:
- `astro dev status`
- `astro dev logs`
- `astro dev stop`

Comandos de construcción y chequeo de tipos:
```sh
npm run dev
npm run build
npm run preview
npx astro check
```

---

## 5. Documentación Oficial de Referencia

- [Astro Documentation](https://docs.astro.build)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
- [Nanostores Documentation](https://github.com/nanostores/nanostores)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
