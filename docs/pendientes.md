# Tareas Pendientes: Web de Korexus

Este documento recopila mejoras no bloqueantes surgidas durante las auditorías de código, para ser atendidas en futuras iteraciones de optimización.

## Rendimiento y Animaciones (`HeroTypographyBackground.astro`)
- [ ] **Cachear `getBoundingClientRect` en `pointermove`:** Guardar el rectángulo e invalidarlo en `scroll` y `resize` para ahorrar cálculos en pantallas de alta tasa de refresco (120 Hz).
- [ ] **Pausa explícita con `visibilitychange`:** Detener `requestAnimationFrame` también cuando la pestaña esté oculta (`document.hidden`), no solo al salir del viewport.
- [ ] **Evitar salto de luz en `resize` móvil:** No reiniciar `lightX`/`lightY` cuando `!hasActivePointer` durante eventos `resize` provocados por la barra de direcciones móvil al hacer scroll.
- [ ] **Escalado Y y tope de densidad:** Aplicar `scaleY` simétrico en `updatePointerTarget` y evaluar tope `dpr <= 1.5` en dispositivos de gama baja.

## Cobertura de Pruebas (`tests/hero-typography.test.mjs`)
- [ ] **Ampliar cobertura en runtime:** Probar dinámicamente cambios en tiempo real de `prefers-reduced-motion`, retorno a *idle drift* tras `pointerleave`/2500 ms, `resize` y resolución de `document.fonts.ready`.

## Portafolio y Sistemas (`SystemsSection.astro`, `ui.ts`, fichas)
- [ ] **Paridad i18n y clic en círculo `↗` de Sistema 2:** Traducir `'Privado / NDA'` en `/en/` y revisar `relative z-20` en el contenedor de acciones de Sistema 2 al abordar ese proyecto o el rediseño de tarjetas.
- [ ] **Accesibilidad y movimiento reducido:** Añadir `aria-hidden="true"` y `motion-reduce:animate-none` al punto verde animado de `"Ver en vivo"`, e indicar con `aria-label` o texto oculto que los enlaces externos de las fichas abren en una nueva pestaña.
- [ ] **Deduplicación y limpieza i18n:** Extraer la URL de Casa Rosa a una constante compartida, evaluar una plantilla reutilizable para las fichas de casos de estudio ES/EN, revisar la llave no usada `'systems.details'` y normalizar fines de línea CRLF en `src/i18n/ui.ts`.
- [ ] **Aserciones extra en `tests/systems-casarosa.test.mjs`:** Verificar también sobre `dist/` compilado la ausencia de los textos placeholder antiguos (`Excel`, `bodega`, `facturación`, `datos sintéticos`, etc.).
- [ ] **Enlaces pendientes en Equipo (`TeamSection.astro`):** Reemplazar los enlaces `profileUrl: '#'` de "Perfil profesional" cuando estén listos los enlaces reales del equipo.

## Favicon e Iconos (`public/favicon.*`, `BaseLayout.astro`, `tests/favicon.test.mjs`)
- [ ] **Endurecer validaciones en `tests/favicon.test.mjs`:** Validar coincidencia exacta de atributos `d` contra `logo-korexus-white.svg`, verificación CRC/chunks PNG completos (`IHDR`, `IDAT`, `IEND`) dentro de `public/favicon.ico` y revisión de las 12 páginas en `dist/`.
- [ ] **Iconos complementarios y script reproducible:** Evaluar añadir `apple-touch-icon` (`180x180` PNG) y entrada `16x16` en `.ico`, guardar un script de regeneración de `favicon.ico` desde `favicon.svg` y normalizar formato/CRLF de `public/favicon.svg`.

## Seguridad y Producción (Auditoría OWASP)
- [ ] **Formulario de contacto (`src/components/ContactForm.astro`):** Reemplazar la clave placeholder `'YOUR_ACCESS_KEY_HERE'` por variable de entorno o endpoint propio, eliminar el fallback que muestra éxito falso cuando falla el envío, añadir límites `maxlength` y activar protección anti-bot (Turnstile/hCaptcha).
- [ ] **Canales de contacto coherentes (`ContactForm.astro` / `ContactSection.astro`):** Alinear el `mailto:` con `contacto@korexus.com` y actualizar el número placeholder de WhatsApp en `ContactSection.astro`.
- [ ] **Cabeceras HTTP y configuración (`public/_headers`, `astro.config.mjs`):** Configurar CSP, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy` y definir `site` explícitamente en `astro.config.mjs`.
- [ ] **Protección de `.gitignore` y `npm audit`:** Excluir `.env.*`, `*.pem` y `*.key` en `.gitignore`, y ejecutar `npm audit` en un entorno con conexión a internet antes de publicar a clientes reales.
