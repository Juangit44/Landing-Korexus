# Diseño: Favicon Oficial "K" de Korexus

**Fecha:** 11 de noviembre de 2026  
**Estado:** Aprobado e implementado (sin commits ni push)  
**Rama:** `feature/hero-interactive-typography` (sin commits ni push automáticos)

---

## 1. Intención y Propósito

Reemplazar el favicon por defecto de Astro (`public/favicon.ico`) y actualizar `public/favicon.svg` para que la pestaña del navegador, marcadores y accesos directos muestren el isotipo oficial **"K"** de Korexus con contraste nítido en cualquier tema (claro u oscuro).

---

## 2. Objetivos, No-Objetivos y Anti-Objetivos

### Objetivos
1. **Isotipo oficial "K" sobre fondo oscuro redondeado (Opción 1 aprobada):**
   - `public/favicon.svg`: Lienzo cuadrado `viewBox="0 0 64 64"` con fondo redondeado oscuro `#141414` (`rx="14"`) y los 4 trazos exactos de la "K" de `public/logo-korexus-white.svg` (`#FCFCFC`, `#FD9851`, `#FD7416`) centrados con margen equilibrado y libres del artefacto rojo (`#FF0000`) que tenía el SVG anterior.
2. **Reemplazo real de `public/favicon.ico`:**
   - Generar un archivo `public/favicon.ico` válido (resoluciones `32x32` y `48x48`) dibujando exactamente la misma "K" blanca y naranja sobre el fondo `#141414` redondeado, eliminando por completo los bytes del cohete de Astro.
3. **Prioridad SVG y limpieza de caché en `src/layouts/BaseLayout.astro`:**
   - Declarar `<link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />` y `<link rel="icon" type="image/x-icon" sizes="any" href="/favicon.ico?v=2" />` para que navegadores modernos usen el SVG vectorial y rompan la caché previa del cohete de Astro.
4. **Cobertura de prueba automatizada (TDD):**
   - Crear `tests/favicon.test.mjs` validando `public/favicon.svg` (fondo `#141414`, trazos `#FCFCFC`/`#FD9851`/`#FD7416`, ausencia de `#FF0000`), la estructura binaria ICO de `public/favicon.ico` (diferente al Astro default de 655 bytes y con cabecera ICO válida `00 00 01 00` de 2 entradas `32x32` y `48x48`), y los `<link rel="icon">` en `BaseLayout.astro` y en las páginas compiladas en `dist/`.

### No-Objetivos
- No modificar el logotipo completo del encabezado (`src/components/Header.astro` ya usa `/Logo-korexus.svg`).
- No instalar dependencias de terceros ni descargar software de internet.
- No realizar `git commit` ni `git push` automáticos.

### Anti-Objetivos (Criterios de Fracaso)
- Que `public/favicon.ico` siga conteniendo el cohete de Astro.
- Que la "K" en `public/favicon.svg` conserve trazos `#FF0000` o quede recortada/descentrada en el cuadro `64x64`.

---

## 3. Archivos a Modificar / Crear
- `public/favicon.svg`: SVG cuadrado con fondo `#141414` redondeado y la "K" oficial centrada.
- `public/favicon.ico`: Archivo ICO válido (`32x32` + `48x48`) con la misma "K" oficial sobre fondo `#141414` redondeado (reemplaza el archivo de Astro; requiere confirmación del usuario por tratarse de reemplazo de un archivo existente en `public/` según §9).
- `src/layouts/BaseLayout.astro`: Actualización de los `<link rel="icon">` con `sizes="any"` y `?v=2`.
- `tests/favicon.test.mjs`: Suite TDD de verificación en fuente y en `dist/`.
