# Plan de Implementación: Integración de Proyecto Real "Casa Rosa"

> **Para trabajadores agenticos:** SUB-SKILL REQUERIDA: Usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Reemplazar el Sistema 1 de ejemplo por el proyecto real **Casa Rosa** (`https://casarosa.pages.dev/`) en `src/i18n/ui.ts`, `src/components/SystemsSection.astro`, `src/pages/sistemas/sistema-uno.astro` y `src/pages/en/systems/system-one.astro`, con navegación mixta (enlace directo en `Ver en vivo` + ficha del caso de estudio en la tarjeta) y cobertura TDD.

**Architecture:** Se actualizan las traducciones centralizadas en `src/i18n/ui.ts` con llaves nuevas (`systems.s1.tag`, `systems.s1.meta`) para eliminar textos fijos en español en la versión inglesa. En `SystemsSection.astro` se mantiene la estructura visual de tarjeta existente, colocando `relative z-20` únicamente en el enlace `<a>` de `"Ver en vivo"` hacia `https://casarosa.pages.dev/` para que el enlace estirado de la ficha (`<span class="absolute inset-0">`) cubra título, descripción y el círculo naranja `↗` sin anidar etiquetas `<a>`.

**Tech Stack:** Astro 7 (`^7.4.5`), Tailwind CSS 4, TypeScript, Node.js Test Runner.

**Spec:** `docs/superpowers/specs/2026-11-11-casa-rosa-portfolio-design.md`

## Global Constraints

- **Restricción estricta de Git:** NO realizar `git commit`, `git push` ni `git merge`. Todos los commits los ejecuta el usuario manualmente.
- **Sin rediseño de tarjetas:** Conservar las clases visuales actuales de las tarjetas en `SystemsSection.astro`.
- **Sin datos inventados:** Prohibido incluir cifras, métricas de rendimiento no medidas, testimonios ficticios o rutas internas del panel privado administrativo.
- **Paridad i18n:** Cada llave añadida en `ui.es` debe existir exactamente igual en `ui.en`.
- **Seguridad en enlaces externos:** Todo enlace a `https://casarosa.pages.dev/` debe usar `target="_blank" rel="noopener noreferrer"`.

## Review Focus

1. **Ausencia total de textos de ejemplo antiguos:** Confirmar que no quede `"Sistema de Gestión"`, `"hojas de cálculo"`, `"Excel"`, `"bodega"`, `"facturación"`, `"datos sintéticos"`, `"spreadsheets"`, `"warehouse"`, `"invoicing"` ni `href="#"` en tarjeta 1 ni en `sistema-uno.astro` / `system-one.astro`.
2. **HTML válido y clics independientes en `SystemsSection.astro`:** Verificar que el `<a>` de `"Ver en vivo"` (`z-20`) NO está anidado dentro del `<a>` de `system1DetailUrl` y que el círculo naranja `↗` no queda tapado por un `z-20` inactivo.
3. **Coherencia bilingüe en `/en/`:** Verificar que `"Producción 2026"` aparece traducido como `"Production 2026"` en la versión en inglés.
4. **Rutas intactas:** Confirmar que `tests/links.test.mjs` sigue validando todas las rutas generadas en `dist/`.
5. **Privacidad del panel:** Confirmar que se explica la existencia del panel administrativo autoadministrable sin enlazar ni revelar su ruta interna.

---

### Tarea 1: Crear la prueba automatizada TDD en `tests/systems-casarosa.test.mjs`

**Files:**
- Create: `tests/systems-casarosa.test.mjs`

**Interfaces:**
- Consumes: `src/i18n/ui.ts`, `src/components/SystemsSection.astro`, `src/pages/sistemas/sistema-uno.astro`, `src/pages/en/systems/system-one.astro` y salida compilada en `dist/`.
- Produces: Suite de pruebas que falla inicialmente contra el Sistema 1 genérico y pasa tras implementar Casa Rosa.

- [ ] **Paso 1: Escribir el test que falla (Rojo)**
  Crear `tests/systems-casarosa.test.mjs` verificando:
  - Que `ui.es` y `ui.en` tienen `systems.s1.title`, `systems.s1.desc`, `systems.s1.tag`, `systems.s1.meta` con referencias reales a `Casa Rosa` y `2026`.
  - Que `SystemsSection.astro` conecta `Ver en vivo` / `{t('systems.view_live')}` a `https://casarosa.pages.dev/` con `target="_blank"` y `rel="noopener noreferrer"`, usando `relative z-20` en ese enlace sin anidar `<a>` dentro de `<a>` y permitiendo que el círculo `ArrowUpRight` navegue a `system1DetailUrl`.
  - Que `sistema-uno.astro` y `system-one.astro` reemplazan `"El problema que resolvía"` / `"The Problem Solved"` por `"Objetivo del proyecto"` / `"Project Objective"`, enlazan a `https://casarosa.pages.dev/` (raíz pública únicamente, sin subrutas), NO contienen `href="#"`, ni textos antiguos de inventario/Excel/bodega/datos sintéticos.
  - Que los archivos compilados en `dist/index.html`, `dist/en/index.html`, `dist/sistemas/sistema-uno/index.html` y `dist/en/systems/system-one/index.html` reflejan el proyecto Casa Rosa sin `href="#"`.

- [ ] **Paso 2: Ejecutar el test para confirmar fallo (Rojo)**
  Ejecutar: `node --experimental-strip-types --test tests/systems-casarosa.test.mjs`
  Esperado: FALLA contra los textos y enlaces `#` actuales.

---

### Tarea 2: Actualizar `src/i18n/ui.ts` y `src/components/SystemsSection.astro`

**Files:**
- Modify: `src/i18n/ui.ts`
- Modify: `src/components/SystemsSection.astro`

**Interfaces:**
- Consumes: Traducciones `ui.es` y `ui.en` en `src/i18n/ui.ts`.
- Produces: Tarjeta 1 con datos de Casa Rosa en ambos idiomas y enlace directo independiente en `"Ver en vivo"`.

- [ ] **Paso 1: Actualizar `src/i18n/ui.ts`**
  - En `es`:
    - `'systems.s1.tag': 'Web App'`
    - `'systems.s1.meta': 'Producción 2026'`
    - `'systems.s1.title': 'Casa Rosa — Cafetería y Pastelería'`
    - `'systems.s1.desc': 'Sitio web comercial con catálogo de productos estrella, pedidos por WhatsApp y panel privado autoadministrable.'`
  - En `en`:
    - `'systems.s1.tag': 'Web App'`
    - `'systems.s1.meta': 'Production 2026'`
    - `'systems.s1.title': 'Casa Rosa — Café & Artisanal Bakery'`
    - `'systems.s1.desc': 'Commercial web platform featuring a star-product catalog, WhatsApp ordering, and a private self-managed admin panel.'`

- [ ] **Paso 2: Actualizar Tarjeta 1 en `src/components/SystemsSection.astro`**
  - Reemplazar `Web App` y `Producción 2026` fijos por `{t('systems.s1.tag')}` y `{t('systems.s1.meta')}`.
  - Quitar `relative z-20` del contenedor `<div class="flex items-center gap-3 self-end sm:self-center">` y mover `relative z-20` únicamente al enlace `<a href="https://casarosa.pages.dev/" target="_blank" rel="noopener noreferrer" ...>` de `{t('systems.view_live')}` (con estilo interactivo sutil y punto verde), dejando el círculo naranja `↗` debajo del enlace estirado de `system1DetailUrl`.

---

### Tarea 3: Actualizar fichas de caso de estudio en ES y EN

**Files:**
- Modify: `src/pages/sistemas/sistema-uno.astro`
- Modify: `src/pages/en/systems/system-one.astro`

**Interfaces:**
- Consumes: `BaseLayout.astro` y diseño aprobado de Casa Rosa.
- Produces: Páginas `/sistemas/sistema-uno` y `/en/systems/system-one` con el caso real de Casa Rosa, sin placeholders ni `href="#"`.

- [ ] **Paso 1: Actualizar `src/pages/sistemas/sistema-uno.astro`**
  - Metadatos (`title`, `description`): `"Casa Rosa — Caso de estudio Korexus"` y descripción real.
  - Badges: `"En producción • Público"` y `"Cafetería y pastelería • Vallegrande, Bolivia"`.
  - Titular `<h1>`: `"Casa Rosa — Plataforma Web y Panel"`.
  - Botón `"Ver sistema en vivo"`: `href="https://casarosa.pages.dev/" target="_blank" rel="noopener noreferrer"`.
  - Sección `"Objetivo del proyecto"`: explicar la necesidad de mostrar su café y pastelería artesanal de forma atractiva, conectar consultas directo a WhatsApp y dar autonomía al dueño para actualizar carta, horarios y ubicación sin soporte técnico constante.
  - Sección `"Qué construyó Korexus"`: 4 puntos reales (Catálogo de productos estrella e historia, Integración directa con WhatsApp, Horarios/ubicación/estacionamiento con mapa, Panel privado autoadministrable).
  - Sección `"Vista previa en vivo"`: bloque oscuro con enlace/botón directo a `https://casarosa.pages.dev/` y nota indicando que el panel administrativo interno permanece privado para proteger la operación del negocio.

- [ ] **Paso 2: Actualizar `src/pages/en/systems/system-one.astro`**
  - Traducción fiel y natural al inglés de los mismos 4 bloques, etiquetas (`"In Production • Public"`, `"Café & Artisanal Bakery • Vallegrande, Bolivia"`), título (`"Casa Rosa — Web Platform & Admin Panel"`), `"Project Objective"`, `"What Korexus Built"`, `"Live Preview"` y enlace `https://casarosa.pages.dev/` (`target="_blank" rel="noopener noreferrer"`).

---

### Tarea 4: Verificación completa y entrega

- [ ] **Paso 1: Ejecutar la suite completa y build**
  Ejecutar: `npm test`
  Esperado: 100% de pruebas pasan (`systems-casarosa.test.mjs`, `hero-typography.test.mjs`, `i18n.test.mjs`, `links.test.mjs`) y `astro build` genera las 12 páginas sin errores.
