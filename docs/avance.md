# Estado de Avance: Web de Korexus

**Última actualización:** 11 de noviembre de 2026

## 1. Lo Terminado
- **Etapa 1 (Hero interactivo):** Tipografía `KOREXUS` interactiva en franja dedicada con iluminación cálida, relieve 3D, soporte móvil/BFCache y retiro del semicírculo relleno.
- **Etapa 2 (Proyecto real Casa Rosa):** Reemplazo completo de Sistema 1 en portada (EN/ES) y fichas de detalle hacia `https://casarosa.pages.dev/`, botón circular naranja no bloqueante y enlace en vivo independiente.
- **Etapa 3 (Favicon oficial "K"):** Nuevo `public/favicon.svg`, reemplazo real de `public/favicon.ico` (`32x32` y `48x48`) y enlaces `?v=2` en `src/layouts/BaseLayout.astro`.
- **Seguridad e higiene para repositorio público:** Auditoría OWASP aprobada (0 vulnerabilidades críticas o altas abiertas); eliminadas menciones literales de rutas internas del cliente y protegidos `.env.*`, `*.pem` y `*.key` en `.gitignore`.
- **Etapa 4 (Canales de contacto personalizados y centralizados):** Nuevo módulo único `src/config/contact.ts` con `korexussoporte@gmail.com` y WhatsApp Bolivia `+591 71085116` (`https://wa.me/59171085116`), conectados a Inicio (`ContactSection.astro`, correo ahora clicable), Contacto (`ContactForm.astro` + traducción EN `"WhatsApp Direct Chat"` en `src/i18n/ui.ts`) y Avisos de Privacidad ES/EN (`aviso-de-privacidad.astro`, `en/privacy-policy.astro`). Suite `npm test` (`27/27`) en verde y revisión de `revisor` aprobada con 0 bloqueantes.

## 2. Etapa en Curso
- Commit en `feature/contact-channels` y merge `--no-ff` a `main` (autorizado por el usuario); pendiente decidir si subir a `origin/main` (`push`).

## 3. Decisiones Abiertas
- Pendiente para próxima iteración: configurar la clave real de Web3Forms conectada a `korexussoporte@gmail.com` en `ContactForm.astro` (y corregir manejo de errores `!res.ok` / `catch`), cabeceras HTTP (`docs/pendientes.md`) y evaluar el rediseño de tarjetas de proyectos.

## 4. Siguiente Paso Concreto
- Con confirmación del usuario, realizar commit en `feature/contact-channels`, integrar en `main` con `--no-ff`, verificar `npm test` en `main` y ejecutar `git push origin main` si lo autoriza.
