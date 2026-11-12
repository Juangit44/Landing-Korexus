# Diseño: Personalización y Centralización de Canales de Contacto

**Fecha:** 11 de noviembre de 2026  
**Estado:** Aprobado, implementado en `feature/contact-channels` y auditado por `revisor` (0 bloqueantes)  
**Control de versiones:** Rama `feature/contact-channels`; pendiente de confirmación del usuario para commit, merge a `main` y push.

---

## 1. Intención y Propósito

Actualizar todos los canales de contacto directo de Korexus en español e inglés para usar el nuevo correo oficial **`korexussoporte@gmail.com`** y el número de WhatsApp de Bolivia **`+591 71085116`** (`59171085116`), centralizándolos en un único módulo compartido para evitar desincronizaciones entre la página de Inicio, la página de Contacto y el Aviso de Privacidad.

---

## 2. Enfoques Evaluados

1. **Elegido — Módulo central compartido (`src/config/contact.ts`) + paridad bilingüe:**
   - Se crea un único archivo `src/config/contact.ts` con la configuración canónica de correo y WhatsApp, y tanto `ContactSection.astro`, `ContactForm.astro` como las páginas legales (`aviso-de-privacidad.astro` y `en/privacy-policy.astro`) leen de ahí.
   - Se corrige de paso el texto fijo en español `"WhatsApp Chat Directo"` en `ContactForm.astro` mediante una nueva llave bilingüe en `src/i18n/ui.ts`, y se vuelve clicable el correo en `ContactSection.astro`.
   - *Trade-off:* Introduce un archivo pequeño adicional (`src/config/contact.ts`) y una llave en `ui.ts`, a cambio de eliminar la duplicación que causó inconsistencias previas (`geminiprojuan22@gmail.com` vs `contacto@korexus.com`, `5210000000000` vs `59178130974`).
2. **Descartado — Edición aislada por archivo:**
   - Reemplazar manualmente el correo y teléfono dentro de los 4 archivos existentes.
   - *Motivo de descarte:* Mantiene datos duplicados en 4 sitios distintos con alto riesgo de olvidos en futuros cambios (el usuario eligió la Opción 1).

---

## 3. Objetivos, No-Objetivos y Anti-Objetivos

### Objetivos
1. **Fuente única (`src/config/contact.ts`):**
   - Definir constantes base `CONTACT_EMAIL = 'korexussoporte@gmail.com'` y `WHATSAPP_NUMBER = '59171085116'`, y derivar de ellas `CONTACT_CHANNELS` (`as const`) con:
     - `email`: `CONTACT_EMAIL`
     - `emailHref`: `` `mailto:${CONTACT_EMAIL}` ``
     - `whatsappNumber`: `WHATSAPP_NUMBER`
     - `whatsappDisplay`: `'+591 71085116'` (usado en `aria-label` o texto visible si el usuario decide mostrarlo)
     - `whatsappHref`: `` `https://wa.me/${WHATSAPP_NUMBER}` ``
2. **Sección de contacto en Inicio (`src/components/ContactSection.astro`):**
   - Reemplazar los valores locales (`5210000000000` y `contacto@korexus.com`) importando `CONTACT_CHANNELS` desde `'../config/contact'`.
   - Enlazar el botón de WhatsApp a `CONTACT_CHANNELS.whatsappHref` (`target="_blank" rel="noopener noreferrer"`, con `aria-label` que incluya `CONTACT_CHANNELS.whatsappDisplay` si no se muestra en texto).
   - Envolver icono `<Mail>` y `{CONTACT_CHANNELS.email}` en un único `<a href={CONTACT_CHANNELS.emailHref}>` con estilos accesibles (`hover:text-[#FCFCFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC8C4E] rounded`).
3. **Página de contacto (`src/components/ContactForm.astro` y `src/i18n/ui.ts`):**
   - Reemplazar `mailto:geminiprojuan22@gmail.com` y el texto visible `contacto@korexus.com` por `CONTACT_CHANNELS.emailHref` y `CONTACT_CHANNELS.email`.
   - Reemplazar `https://wa.me/59178130974` por `CONTACT_CHANNELS.whatsappHref` (`target="_blank" rel="noopener noreferrer"`).
   - Reemplazar el texto fijo `"WhatsApp Chat Directo"` por `{t('contact.whatsapp_direct')}` con paridad en `src/i18n/ui.ts` (`es`: `'WhatsApp Chat Directo'`, `en`: `'WhatsApp Direct Chat'`; o mostrando `+591 71085116` si el usuario lo prefiere).
4. **Aviso de Privacidad (`src/pages/aviso-de-privacidad.astro` y `src/pages/en/privacy-policy.astro`):**
   - Reemplazar el enlace y texto `contacto@korexus.com` por `CONTACT_CHANNELS.emailHref` y `CONTACT_CHANNELS.email`.
5. **Pruebas automatizadas TDD (`tests/contact-channels.test.mjs`):**
   - Verificar `CONTACT_CHANNELS` en `src/config/contact.ts`, que los 4 archivos consumidores importen `CONTACT_CHANNELS`, y la paridad i18n en `src/i18n/ui.ts`.
   - Verificar en las **6 páginas compiladas con correo** (`dist/index.html`, `dist/en/index.html`, `dist/contacto/index.html`, `dist/en/contact/index.html`, `dist/aviso-de-privacidad/index.html`, `dist/en/privacy-policy/index.html`) que exista una etiqueta `<a>` que contenga emparejados `href="mailto:korexussoporte@gmail.com"` y el texto visible `korexussoporte@gmail.com` dentro del mismo enlace.
   - Verificar en las **4 páginas compiladas con WhatsApp** (`dist/index.html`, `dist/en/index.html`, `dist/contacto/index.html`, `dist/en/contact/index.html`) que exista una etiqueta `<a>` con `href="https://wa.me/59171085116"`, `target="_blank"` y `rel="noopener noreferrer"`.
   - Verificar en `dist/contacto/index.html` la presencia de `"WhatsApp Chat Directo"`, y en `dist/en/contact/index.html` la presencia de `"WhatsApp Direct Chat"` junto con la ausencia de `"WhatsApp Chat Directo"`.
   - Barrido completo en **todo `src/`** y en **las 12 páginas HTML de `dist/`** verificando 0 ocurrencias de `geminiprojuan22@gmail.com`, `contacto@korexus.com`, `5210000000000` y `59178130974`.

### No-Objetivos
- No configurar ni activar todavía la clave `access_key` de Web3Forms ni modificar el script de envío del formulario en `ContactForm.astro` (decisión explícita del usuario: queda para una iteración posterior).
- No modificar `BaseLayout.astro` (`https://korexus.com` en etiquetas canónicas/SEO) ni referencias al WhatsApp propio de Casa Rosa en sus casos de estudio.
- No ejecutar `git commit`, `git merge` ni `git push` sin confirmación explícita del usuario.

### Anti-Objetivos (Criterios de Fracaso)
- Que permanezca cualquier referencia a `geminiprojuan22@gmail.com`, `contacto@korexus.com`, `5210000000000` o `59178130974` en `src/` o `dist/`.
- Que el texto visible del correo difiera del destino `mailto:`.
- Que algún enlace de WhatsApp carezca del código de Bolivia `591`, de `target="_blank"` o de `rel="noopener noreferrer"`.
- Que en la versión en inglés (`/en/contact`) aparezca texto en español `"WhatsApp Chat Directo"`.

---

## 4. Decisiones Propuestas para Confirmación

- **Correo clicable en Inicio:** convertir el icono y texto del correo en `ContactSection.astro` en un enlace clicable `mailto:korexussoporte@gmail.com` para facilitar el contacto directo.
- **Etiqueta de WhatsApp en Contacto:** mantener `"WhatsApp Chat Directo"` en español y corregir a `"WhatsApp Direct Chat"` en inglés (con opción de mostrar además `+591 71085116` visible si el usuario lo prefiere).
- **Documentación al cerrar:** actualizar `docs/pendientes.md` (marcar `[x]` la línea 27 de canales de contacto coherentes con `korexussoporte@gmail.com` y `+591 71085116`, y precisar en la línea 26 que Web3Forms enviará a `korexussoporte@gmail.com`) y actualizar `docs/avance.md`.

---

## 5. Archivos a Crear / Modificar
- **Crear:** `src/config/contact.ts`, `tests/contact-channels.test.mjs`, `docs/superpowers/plans/2026-11-11-contact-channels.md`
- **Modificar:** `src/i18n/ui.ts`, `src/components/ContactSection.astro`, `src/components/ContactForm.astro`, `src/pages/aviso-de-privacidad.astro`, `src/pages/en/privacy-policy.astro`, `docs/avance.md`, `docs/pendientes.md`
