# Diseño: Integración de Proyecto Real "Casa Rosa" en Sistemas

**Fecha:** 11 de noviembre de 2026  
**Estado:** Completo para aprobación del usuario  
**URL del proyecto:** `https://casarosa.pages.dev/`

---

## 1. Intención y Propósito

Reemplazar el **Sistema 1** de ejemplo (textos genéricos de "Sistema de Gestión y Operaciones" y enlace `#`) por el proyecto real **Casa Rosa** (*Cafetería y pastelería artesanal en Vallegrande, Bolivia*), cumpliendo el principio del plan de trabajo de Korexus de no mostrar sistemas ni datos ficticios.

El diseño visual actual de las tarjetas se conserva intacto en esta etapa; su rediseño se abordará posteriormente por separado.

---

## 2. Objetivos, No-Objetivos y Anti-Objetivos

### Objetivos
1. **Reemplazo completo en ES y EN:** Actualizar tarjeta 1 (`src/components/SystemsSection.astro` y `src/i18n/ui.ts`) y su ficha de detalle (`src/pages/sistemas/sistema-uno.astro` y `src/pages/en/systems/system-one.astro`) con la información real verificada de **Casa Rosa**.
2. **Navegación mixta (Opción 1 aprobada por el usuario):**
   - Únicamente la pastilla **`Ver en vivo`** / **`Live demo`** dentro de la tarjeta 1 tiene `relative z-20` y funciona como enlace directo externo (`href="https://casarosa.pages.dev/"`, `target="_blank" rel="noopener noreferrer"`), sin anidar etiquetas `<a>`.
   - Hacer clic en la tarjeta (título, descripción o el botón circular naranja `↗`) navega a la ficha de caso de estudio de Korexus (`/sistemas/sistema-uno` o `/en/systems/system-one`), donde el botón principal también apunta a `https://casarosa.pages.dev/`.
3. **Objetivo del proyecto sin ficción:** Replantear la sección `"El problema que resolvía"` / `"The Problem Solved"` a **`"Objetivo del proyecto"` / `"Project Objective"`**, redactada únicamente a partir de las capacidades verificadas en `https://casarosa.pages.dev/`.
4. **Vista previa limpia sin imágenes:** En la sección `"Vista previa en vivo"` / `"Live Preview"` de las páginas de detalle, mostrar una tarjeta elegante sin capturas locales que ofrezca acceso directo a `https://casarosa.pages.dev/` en pestaña nueva y aclare que el panel administrativo es privado.
5. **Etiquetas reales e idioma:** Usar la categoría `"Web App"` (o `"Plataforma Web"` / `"Web Platform"`) y la etiqueta `"Producción 2026"` / `"Production 2026"` (año confirmado en el pie de página real `© 2026 Casa Rosa`) desde `src/i18n/ui.ts` para conservar paridad en ES y EN.
6. **Respeto estricto a rutas y tests:** Conservar `/sistemas/sistema-uno` y `/en/systems/system-one`, paridad de llaves `es`/`en` y paso limpio de toda la suite `npm test`.

### No-Objetivos
- No rediseñar la estructura visual ni la estética de las tarjetas de proyectos en esta etapa.
- No modificar el Sistema 2 (privado/NDA).
- No inventar cifras, métricas, testimonios ni exponer rutas o detalles internos del panel administrativo privado.
- No realizar `git commit` ni `git push` automáticos (el usuario gestiona sus commits manualmente).

### Anti-Objetivos (Criterios de Fracaso)
- Que quede cualquier referencia de ejemplo ("hojas de Excel", "bodega", "facturación", "datos sintéticos") o enlaces `href="#"` en la ficha o tarjeta del proyecto 1.
- Que una etiqueta `<a>` quede anidada dentro de otra etiqueta `<a>` en `SystemsSection.astro`.

---

## 3. Contenido Real Verificado de Casa Rosa

Datos observados directamente en `https://casarosa.pages.dev/`:
- **Nombre y giro:** Casa Rosa — Cafetería y pastelería artesanal en Vallegrande, Bolivia (`© 2026 Casa Rosa`).
- **Lo construido:**
  1. **Presencia web y catálogo de productos estrella:** Exhibición visual de productos artesanales e historia del negocio.
  2. **Conexión directa a WhatsApp:** Botones en los productos para consultar o iniciar pedidos directamente en el chat de WhatsApp del negocio.
  3. **Información práctica del local:** Horarios de atención, dirección física, detalle de estacionamiento y mapa de ubicación integrado.
  4. **Panel privado autoadministrable:** Área interna protegida para que el equipo de Casa Rosa actualice sus productos estrella, fotografías, horarios y datos de contacto de forma autónoma sin tocar código.

---

## 4. Decisiones Menores Tomadas por el Coordinador (para confirmar en lectura)
1. **Círculo naranja `↗` en tarjeta 1:** Dejar `relative z-20` solo en la pastilla `"Ver en vivo"` para que el círculo naranja `↗` mantenga coherencia visual y navegue a la ficha de Korexus igual que el resto de la tarjeta (y la tarjeta 2).
2. **Etiqueta `"Producción 2026"` / `"Production 2026"`:** Moverla a `src/i18n/ui.ts` en español e inglés (antes estaba fija en español incluso en `/en/`), respaldada por el `© 2026 Casa Rosa` verificado en la web publicada.
3. **Categoría de tarjeta:** Mantener `"Web App"` (o `"Plataforma Web"` / `"Web Platform"` en `ui.ts`) por ser breve y describir con precisión un sitio React con panel privado.

---

## 5. Archivos a Modificar / Crear
- `src/i18n/ui.ts`: llaves `systems.s1.title`, `systems.s1.desc`, `systems.s1.tag`, `systems.s1.meta` en español e inglés.
- `src/components/SystemsSection.astro`: usar llaves actualizadas, `relative z-20` exclusivo en enlace `"Ver en vivo"` apuntando a `https://casarosa.pages.dev/` (`target="_blank" rel="noopener noreferrer"`).
- `src/pages/sistemas/sistema-uno.astro` y `src/pages/en/systems/system-one.astro`: contenido real de Casa Rosa (`Objetivo del proyecto`, `Qué construyó Korexus`, `Vista previa en vivo` con enlace real a `https://casarosa.pages.dev/` y sin `href="#"`).
- `tests/systems-casarosa.test.mjs` (nuevo test TDD): verifica contenido real de Casa Rosa en ambos idiomas, enlace a `https://casarosa.pages.dev/` con `target="_blank" rel="noopener noreferrer"`, ausencia de `href="#"`, ausencia de etiquetas `<a>` anidadas y ausencia de textos placeholder antiguos, además de validar la compilación en `dist/`.
