# Plan de Implementación: Tipografía Interactiva con Iluminación en Hero

> **Para trabajadores agenticos:** SUB-SKILL REQUERIDA: Usar `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para implementar este plan tarea por tarea. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Integrar en el fondo de la sección Hero la palabra KOREXUS en gran formato con relieve 3D interactivo e iluminación que sigue el ratón en tonos cálidos durazno/naranja, respetando todo el contenido existente y sin impacto en rendimiento.

**Architecture:** Componente aislado Astro (`HeroTypographyBackground.astro`) que renderiza un `<canvas>` acelerado por hardware posicionado detrás del contenido actual del Hero (`z-0`, `pointer-events-none`). El script cliente calcula en tiempo real la posición del cursor respecto a la sección para proyectar un foco de luz cálida y sombras direccionales sobre la tipografía KOREXUS, con movimiento autónomo suave (idle drift) cuando no hay interacción y desactivación elegante si el usuario tiene `prefers-reduced-motion`.

**Tech Stack:** Astro 5, HTML5 Canvas 2D API (aceleración por hardware), Tailwind CSS 4, Node.js Test Runner.

**Spec:** `docs/superpowers/specs/2026-11-11-hero-typography-light-design.md`

## Global Constraints

- **Restricción estricta de Git solicitada por el usuario:** NO realizar `git push` a GitHub ni commits automáticos en git. Los cambios se dejan listos y verificados localmente en los archivos para que el usuario haga los commits manualmente tras su inspección visual.
- **Sin dependencias pesadas:** Recreación nativa sin WebGL pesado, Three.js ni paquetes externos que aumenten el peso del bundle.
- **No interferencia:** El titular, subtítulo, columnas laterales y arco inferior de botones CTA deben permanecer 100% legibles e interactivos (`z-10`).
- **Paleta de marca:** Fondo marfil claro (`#FCFCFC`), iluminación y acentos durazno/naranja (`#EC8C4E`, `#F3B47E`), texto frontal oscuro (`#141414`).
- **Respeto a accesibilidad:** `aria-hidden="true"` en el canvas y respeto a `prefers-reduced-motion`.

## Review Focus

1. **Rendimiento y ciclo de vida:** Asegurar que los listeners de `pointermove` y `resize` se registren y limpien adecuadamente y que el `requestAnimationFrame` se detenga si la pestaña se oculta (`visibilitychange`).
2. **Escala en pantallas pequeñas:** Evitar desbordamiento horizontal en móviles (`overflow-hidden`, cálculo dinámico de `fontSize` relativo al ancho).
3. **Contraste y legibilidad:** La palabra de fondo debe tener una opacidad calibrada (máximo 0.08 a 0.15 en base) para que nunca opaque el texto frontal del titular.
4. **Comportamiento táctil en móviles:** En pantallas táctiles, no bloquear el gesto de scroll vertical de la página.
5. **Compatibilidad SSR:** El código de manipulación de DOM/Window debe ejecutarse únicamente en el cliente (`typeof window !== 'undefined'`).

---

### Tarea 1: Crear la prueba automatizada para el componente de fondo

**Files:**
- Create: `tests/hero-typography.test.mjs`

**Interfaces:**
- Consumes: Componentes de Astro y suite existente de Node test runner.
- Produces: Test automatizado que valida la existencia de `HeroTypographyBackground.astro`, su atributo `aria-hidden="true"` y su inclusión en `Hero.astro`.

- [ ] **Paso 1: Escribir el test que falla (Rojo)**
  Crear `tests/hero-typography.test.mjs` verificando que el archivo `src/components/HeroTypographyBackground.astro` existe, exporta la estructura esperada y está integrado en `src/components/Hero.astro`.

- [ ] **Paso 2: Ejecutar el test para comprobar que falla**
  Ejecutar: `node --experimental-strip-types --test tests/hero-typography.test.mjs`
  Esperado: FALLA porque el componente aún no existe.

---

### Tarea 2: Implementar el componente `HeroTypographyBackground.astro`

**Files:**
- Create: `src/components/HeroTypographyBackground.astro`

**Interfaces:**
- Consumes: Tipografía Urbanist ya cargada en el proyecto, colores de marca `#FCFCFC`, `#EC8C4E`, `#F3B47E`.
- Produces: Componente `<HeroTypographyBackground />` con canvas interactivo optimizado.

- [ ] **Paso 1: Implementar el marcado y estilos del componente**
  Crear el contenedor absoluto `absolute inset-0 overflow-hidden pointer-events-none select-none z-0` con un elemento `<canvas>` que ocupe el 100% del área y `aria-hidden="true"`.

- [ ] **Paso 2: Implementar la lógica cliente de renderizado y seguimiento de luz**
  - Inicialización con `devicePixelRatio` acotado (máximo 1.5).
  - Cálculo de la posición del puntero relativa a la sección Hero.
  - Efecto de iluminación cálida en tonos `#EC8C4E` y `#F3B47E` con sombra dimensional.
  - Oscilación suave ("idle drift") con `Math.sin` cuando no hay movimiento de cursor.
  - Verificación de `window.matchMedia('(prefers-reduced-motion: reduce)')`.

- [ ] **Paso 3: Integrar `HeroTypographyBackground.astro` dentro de `src/components/Hero.astro`**
  Modificar `src/components/Hero.astro` para importar el nuevo componente y montarlo de fondo asegurando que las capas frontales tengan `relative z-10`.

- [ ] **Paso 4: Ejecutar el test unitario para verificar que pasa (Verde)**
  Ejecutar: `node --experimental-strip-types --test tests/hero-typography.test.mjs`
  Esperado: PASA.

---

### Tarea 3: Verificación de la suite completa y compilación de producción

**Files:**
- Test: `tests/**/*.test.mjs`
- Build: `astro build`

**Interfaces:**
- Consumes: Todo el proyecto con los nuevos componentes.
- Produces: Build estático sin errores y 100% de tests pasando.

- [ ] **Paso 1: Ejecutar la suite completa de tests**
  Ejecutar: `npm test`
  Esperado: Todos los tests pasan (i18n completeness, internal links y hero-typography).

- [ ] **Paso 2: Verificar la ausencia de desbordamiento horizontal y estabilidad visual**
  Comprobar que `dist/index.html` contiene el canvas y los assets requeridos sin advertencias de compilación.

- [ ] **Paso 3: Informe para el usuario**
  Notificar al usuario que los archivos están listos en su entorno local para que pueda iniciar el servidor con `npm run dev`, revisarlo en su navegador y realizar su commit manual.

---

### Tarea 4: Reubicación en franja dedicada sin superposición (Camino 1)

**Files:**
- Modify: `tests/hero-typography.test.mjs`
- Modify: `src/components/HeroTypographyBackground.astro`
- Modify: `src/components/Hero.astro`

**Interfaces:**
- Consumes: Contenedor dedicado en `Hero.astro` ubicado entre el subtítulo y el arco inferior.
- Produces: Escenario independiente donde `'KOREXUS'` se centra sin tocar otros textos, con sombra direccional 3D, ajuste automático de ancho (`measureText`), respuesta a `pointerdown` en móvil y espaciado inferior (`pb-8 md:pb-0`) en `Hero.astro`.

- [ ] **Paso 1: Actualizar el test automatizado (Rojo)**
  Añadir aserciones en `tests/hero-typography.test.mjs` para verificar que:
  - `Hero.astro` ubica `<HeroTypographyBackground />` dentro de su propia franja dedicada entre el subtítulo y el arco inferior, con `pb-8 md:pb-0` en la sección.
  - `HeroTypographyBackground.astro` mide `parentElement`, calcula el tamaño evitando desborde con `measureText`, escucha `pointerdown` de forma pasiva y proyecta sombra direccional opuesta a la luz.

- [ ] **Paso 2: Ejecutar los tests para comprobar que las nuevas aserciones fallan**
  Ejecutar: `node --experimental-strip-types --test tests/hero-typography.test.mjs`

- [ ] **Paso 3: Actualizar `HeroTypographyBackground.astro` y `Hero.astro` (Verde)**
  - En `Hero.astro`: mover `<HeroTypographyBackground />` dentro de un contenedor dedicado `<div class="relative w-full h-24 sm:h-32 md:h-40 my-4 sm:my-6">` entre el bloque de título/subtítulo y el bloque de flancos/arco; añadir `pb-8 md:pb-0` a `<section id="inicio">`; compactar ligeramente el margen superior del arco (`mt-2 sm:mt-4`) para conservar armonía de altura en pantalla.
  - En `HeroTypographyBackground.astro`: dimensionar el canvas según `canvas.parentElement` (sin mínimo artificial de 400 px), centrar el texto verticalmente (`height * 0.5`), ajustar `fontSize` con `ctx.measureText`, proyectar sombra direccional 3D sutil opuesta al foco, escuchar `pointermove` y `pointerdown` sobre `heroSection` traduciendo coordenadas al canvas sin cortes en bordes.

- [ ] **Paso 4: Ejecutar la suite completa y verificar**
  Ejecutar: `npm test`
  Esperado: Todos los tests pasan (0 fallos).

---

### Tarea 5: Retirar el semicírculo relleno inferior y dejar flotando la cápsula de botones (Opción 1)

**Files:**
- Modify: `tests/hero-typography.test.mjs`
- Modify: `src/components/Hero.astro`

**Interfaces:**
- Consumes: `HeroTypographyBackground.astro` y `src/i18n/ui.ts`.
- Produces: Sección `#inicio` sin el arco durazno sólido (`rounded-t-[175px]`), con la cápsula oscura dual flotante alineada limpiamente con los flancos (`items-center`) y margen inferior simétrico (`pb-10 sm:pb-14`).

- [ ] **Paso 1: Actualizar el test en `tests/hero-typography.test.mjs` (Rojo)**
  Actualizar las aserciones sobre `Hero.astro` y `dist/index.html` para:
  - Verificar que `<section id="inicio">` incluye `pb-10 sm:pb-14`.
  - Verificar que la franja dedicada tiene `h-24 sm:h-32 md:h-36`.
  - Verificar que NO existe el semicírculo relleno `rounded-t-[175px]` ni `h-[160px] sm:h-[190px]`, manteniendo ambos botones CTA (`hero.cta_systems` y `hero.cta_contact`) y flancos alineados con `items-center`.

- [ ] **Paso 2: Ejecutar los tests para verificar que fallan (Rojo)**
  Ejecutar: `node --experimental-strip-types --test tests/hero-typography.test.mjs`

- [ ] **Paso 3: Actualizar `src/components/Hero.astro` (Verde)**
  - Cambiar `<section id="inicio" class="pt-10 sm:pt-14 pb-10 sm:pb-14 overflow-hidden relative">`.
  - Ajustar franja tipográfica a `class="relative w-full h-24 sm:h-32 md:h-36 my-4 sm:my-6 overflow-hidden"`.
  - Retirar el contenedor del arco durazno (`rounded-t-[175px]`), centrando la cápsula oscura dual entre los flancos con `items-center` y limpiando los `pb-8` antiguos de los flancos.

- [ ] **Paso 4: Ejecutar la suite completa y confirmar**
  Ejecutar: `npm test`
  Esperado: Todos los tests pasan (0 fallos, 0 saltados) y compilación limpia.
