# Estado de Avance: Web de Korexus

**Última actualización:** 11 de noviembre de 2026

## 1. Lo Terminado
- **Etapa 1 (Hero interactivo):** Tipografía `KOREXUS` interactiva en franja dedicada con iluminación cálida, relieve 3D, soporte móvil/BFCache y retiro del semicírculo relleno.
- **Etapa 2 (Proyecto real Casa Rosa):** Reemplazo completo de Sistema 1 en portada (EN/ES) y fichas de detalle hacia `https://casarosa.pages.dev/`, botón circular naranja no bloqueante y enlace en vivo independiente.
- **Etapa 3 (Favicon oficial "K"):** Nuevo `public/favicon.svg`, reemplazo real de `public/favicon.ico` (`32x32` y `48x48`) y enlaces `?v=2` en `src/layouts/BaseLayout.astro`.
- **Seguridad e higiene para repositorio público:** Auditoría OWASP aprobada (0 vulnerabilidades críticas o altas abiertas); eliminadas menciones literales de rutas internas del cliente y protegidos `.env.*`, `*.pem` y `*.key` en `.gitignore`.
- **Entregables finales:** Creada `docs/guia-de-uso.md` y actualizada `docs/pendientes.md`.

## 2. Etapa en Curso
- Commit en `feature/hero-interactive-typography`, merge `--no-ff` a `main`, verificación de suite completa en `main` y push a `origin/main` (autorizado por el usuario).

## 3. Decisiones Abiertas
- Pendiente para próxima sesión: configurar la clave real de Web3Forms en `ContactForm.astro` / cabeceras HTTP (`docs/pendientes.md`) y evaluar el rediseño de tarjetas de proyectos.

## 4. Siguiente Paso Concreto
- Ejecutar commit, merge a `main`, suite completa en `main` y `git push origin main`.
