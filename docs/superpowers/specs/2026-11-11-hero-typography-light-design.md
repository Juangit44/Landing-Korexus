# Diseño: Tipografía Interactiva con Iluminación en Hero (Korexus)

**Fecha:** 11 de noviembre de 2026  
**Estado:** Aprobado con ajuste de ubicación (Camino 1 tras revisión visual)  
**Rama asignada:** `feature/hero-interactive-typography`

---

## 1. Intención y Propósito

Añadir a la portada (Hero) de la landing de Korexus una tipografía interactiva con relieve 3D y juego de luces cálidas, inspirada en la referencia visual "After Hours", **adaptada al diseño y paleta actuales** (fondo claro marfil `#FCFCFC`, acento durazno/naranja `#EC8C4E` / `#F3B47E` y textos oscuros `#141414`).

Tras la primera prueba visual en PC y móvil, el usuario eligió ubicar la tipografía en **su propio espacio limpio entre el subtítulo y el arco inferior de botones** (Camino 1), evitando cualquier superposición con el titular principal (*"Software a medida para hacer crecer tu empresa"*).

---

## 2. Objetivos, No-Objetivos y Anti-Objetivos

### Objetivos
1. **Cero superposición de textos:** Renderizar **KOREXUS** en un escenario dedicado y limpio ubicado entre el subtítulo y la cápsula inferior de botones, tanto en escritorio como en móvil.
2. **Relieve 3D e interactividad:** Al mover el ratón por la sección Hero (o tocar en móvil), un foco de luz cálida ilumina los bordes de las letras y proyecta una sombra direccional sutil en dirección opuesta para dar sensación real de volumen.
3. **Movimiento sutil en reposo (idle drift):** Cuando el cursor no se mueve o sale de la sección, la luz oscila suavemente de forma autónoma.
4. **Eliminación de ruido visual inferior:** Retirar el semicírculo relleno durazno inferior para dejar flotar limpia la cápsula oscura de botones (`Ver sistemas` / `Contáctanos`) haciendo simetría con la barra de navegación superior, ahorrando espacio vertical y añadiendo respiro inferior (`pb-10 sm:pb-14`) antes de la sección oscura siguiente.
5. **Máximo rendimiento:** Implementación ligera en Canvas 2D con `IntersectionObserver` (se pausa automáticamente al salir de pantalla) y `devicePixelRatio` acotado.
6. **Accesibilidad:** `aria-hidden="true"` en el canvas y respeto a `prefers-reduced-motion`.

### No-Objetivos
- No oscurecer toda la web ni convertirla a un "dark mode" forzado.
- No alterar textos, rutas ni el flujo de navegación existente.
- No depender de WebGL pesado ni librerías externas de pago.

### Anti-Objetivos (Criterios de Fracaso)
- Que las letras de KOREXUS se superpongan con el titular o con el arco inferior en cualquier resolución.
- Que el haz de luz se corte bruscamente en los bordes rectangulares de la franja.
- Que genere desbordamiento horizontal en móviles o bloquee el scroll vertical.

---

## 3. Detalles Técnicos Acordados (Ajuste Camino 1)

1. **Estructura en `src/components/Hero.astro`:**
   - Bloque 1: Badge + Titular `<h1>` + Subtítulo `<p>` (`relative z-10`).
   - Bloque 2 (Escenario limpio): Contenedor dedicado (`relative w-full h-24 sm:h-32 md:h-36 my-4 sm:my-6`) que aloja `<HeroTypographyBackground />`.
   - Bloque 3: Escenario de acciones inferior con flancos alineados (`items-center`) y la cápsula oscura dual flotante (`Ver sistemas ↗` / `Contáctanos`), sin el semicírculo relleno durazno.
   - Padding inferior de sección: `pb-10 sm:pb-14` para equilibrar la transición con `#sistemas` en escritorio y móvil.
2. **Comportamiento de `src/components/HeroTypographyBackground.astro`:**
   - Mide las dimensiones exactas de su contenedor (`parentElement`) para dimensionar el canvas y centrar `'KOREXUS'` vertical y horizontalmente.
   - Calcula `fontSize` dinámico con verificación de `ctx.measureText('KOREXUS').width` para asegurar que nunca se recorte en pantallas angostas.
   - Escucha `pointermove`, `pointerdown` y `pointerleave` sobre la sección `#inicio` (`closest('section')`) convirtiendo coordenadas relativas al canvas y acotando verticalmente la luz para que siga el movimiento horizontal en todo el Hero sin desaparecer de la franja.
   - Aplica relieve 3D con sombra direccional opuesta al punto de luz, relleno base sutil y gradiente radial cálido (`#F3B47E`, `#EC8C4E`, `#D0681C`) que se desvanece completamente antes de tocar los bordes de la franja.
3. **Aislamiento en Git:**
   - Trabajo local en la rama `feature/hero-interactive-typography`.
   - Sin commits automáticos ni push a GitHub (el usuario gestionará los commits manualmente).
