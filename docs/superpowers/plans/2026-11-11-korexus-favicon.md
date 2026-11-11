# Plan de Implementación: Favicon Oficial "K" de Korexus

> **Para trabajadores agenticos:** SUB-SKILL REQUERIDA: Usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Sustituir el favicon por defecto de Astro (`public/favicon.ico`) y el `public/favicon.svg` actual por el isotipo oficial "K" de Korexus en blanco (`#FCFCFC`) y naranja (`#FD9851`, `#FD7416`) sobre un fondo oscuro redondeado `#141414`, actualizando `BaseLayout.astro` para priorizar el SVG y limpiar caché (`?v=2`).

**Architecture:** Se construye `public/favicon.svg` con los 4 trazos exactos de la "K" tomados de `public/logo-korexus-white.svg` (centrados sobre un `<rect width="64" height="64" rx="14" fill="#141414" />`). Con `.NET System.Drawing` local (sin dependencias ni descargas externas) se rasterizan exactamente esos mismos trazos vectoriales a `32x32` y `48x48` PNG y se empaquetan en un archivo ICO estándar válido `public/favicon.ico`. `src/layouts/BaseLayout.astro` enlaza ambos con `sizes="any"` en el `.ico` y `?v=2`.

**Tech Stack:** SVG, `.NET System.Drawing` (PowerShell nativo para generar ICO multiresolución sin dependencias), Astro 7, Node.js Test Runner.

**Spec:** `docs/superpowers/specs/2026-11-11-korexus-favicon-design.md`

## Global Constraints

- **Restricción estricta de Git:** NO realizar `git commit`, `git push` ni `git merge`.
- **Cero dependencias o descargas externas:** Todo se genera con herramientas locales disponibles (Node.js y PowerShell/.NET).
- **Sin artefactos residuales:** Eliminar completamente el trazo `#FF0000` del `favicon.svg` previo y el archivo `.ico` original de Astro (655 bytes).
- **Compatibilidad de rutas:** Mantener rutas `/favicon.svg?v=2` y `/favicon.ico?v=2` compatibles con `tests/links.test.mjs`.

## Review Focus

1. **Integridad binaria de `public/favicon.ico`:** Verificar cabecera ICO `00 00 01 00`, conteo `2` entradas (`32x32` y `48x48`), firmas PNG válidas dentro del payload y píxeles reales dibujados (fondo `#141414` + trazos naranja/blanco en el centro, sin transparencia total).
2. **Centrado y limpieza de `public/favicon.svg`:** Comprobar que el `viewBox="0 0 64 64"` contiene el `<rect>` `#141414` (`rx="14"`) y los 4 trazos exactos de `logo-korexus-white.svg` sin `#FF0000`.
3. **Prioridad y caché en `BaseLayout.astro` y `dist/`:** Verificar que todas las páginas HTML compiladas en ES y EN incluyen `/favicon.svg?v=2` antes que `/favicon.ico?v=2` con `sizes="any"`, y que `dist/favicon.svg` y `dist/favicon.ico` coinciden con `public/`.

---

### Tarea 1: Crear la prueba TDD en `tests/favicon.test.mjs`

**Files:**
- Create: `tests/favicon.test.mjs`

- [ ] **Paso 1: Escribir el test que falla (Rojo)**
  Verificar:
  - `public/favicon.svg`: `viewBox="0 0 64 64"`, rectángulo `#141414` con `rx="14"`, colores `#FCFCFC`, `#FD9851`, `#FD7416`, ausencia de `#FF0000` y `#171717`.
  - `public/favicon.ico`: tamaño > 655 bytes, cabecera ICO (`0x00, 0x00, 0x01, 0x00`), 2 entradas (`32x32` y `48x48`) con payloads PNG válidos (`89 50 4E 47`).
  - `src/layouts/BaseLayout.astro` y compilados `dist/index.html`, `dist/en/index.html`: `<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2"` antes que `<link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=2"`.
  - `dist/favicon.svg` y `dist/favicon.ico` idénticos a `public/`.

- [ ] **Paso 2: Ejecutar el test para verificar que falla (Rojo)**
  Ejecutar: `node --experimental-strip-types --test tests/favicon.test.mjs`
  Esperado: FALLA contra el `favicon.svg` y `favicon.ico` antiguos.

---

### Tarea 2: Actualizar `public/favicon.svg`, generar `public/favicon.ico` y actualizar `src/layouts/BaseLayout.astro`

**Files:**
- Modify: `public/favicon.svg`
- Modify: `public/favicon.ico`
- Modify: `src/layouts/BaseLayout.astro:54-57`

- [ ] **Paso 1: Escribir `public/favicon.svg`**
  Usar `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">`, `<rect width="64" height="64" rx="14" fill="#141414" />` y `<g transform="translate(-68.63, -5.48) scale(0.22)">` con los 4 trazos exactos de `public/logo-korexus-white.svg`.

- [ ] **Paso 2: Generar `public/favicon.ico` (`32x32` y `48x48`)**
  Mediante un script temporal de PowerShell con `System.Drawing` / `System.Drawing.Drawing2D.GraphicsPath` (con `SmoothingMode.AntiAlias`), dibujar el fondo redondeado `#141414` y los 4 trazos cúbicos Bézier de la "K" con la misma transformación a bitmaps `32x32` y `48x48`, exportarlos a PNG en memoria y escribir el archivo ICO estándar `public/favicon.ico`. Eliminar cualquier script temporal si se creó fuera de `tests/`.

- [ ] **Paso 3: Actualizar `src/layouts/BaseLayout.astro`**
  Reemplazar líneas 55–56 por:
  ```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
    <link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=2" />
  ```

- [ ] **Paso 4: Ejecutar `npm test` (Verde)**
  Ejecutar: `npm test` (`astro build` + toda la suite incluyendo `tests/favicon.test.mjs`, `tests/links.test.mjs`, `tests/i18n.test.mjs`).
  Esperado: 100% de pruebas en verde y `dist/` actualizado.
