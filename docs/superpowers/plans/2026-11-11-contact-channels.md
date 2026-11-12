# Plan de Implementación: Personalización y Centralización de Canales de Contacto

> **Para trabajadores agénticos:** SUB-SKILL REQUERIDA: Usar `superpowers:subagent-driven-development` para ejecutar este plan en aislamiento (`Workspace: share`) siguiendo TDD estricto. Los pasos usan sintaxis de checkbox (`- [ ]`) para seguimiento.

**Goal:** Centralizar el correo oficial (`korexussoporte@gmail.com`) y el WhatsApp de Bolivia (`59171085116` / `+591 71085116`) en `src/config/contact.ts`, conectar `ContactSection.astro`, `ContactForm.astro`, `aviso-de-privacidad.astro` y `en/privacy-policy.astro`, traducir `"WhatsApp Direct Chat"` en inglés, y verificar todo mediante `tests/contact-channels.test.mjs` y `npm test`.

**Architecture:** Un módulo TypeScript único (`src/config/contact.ts`) exporta `CONTACT_CHANNELS` derivado de constantes base (`CONTACT_EMAIL`, `WHATSAPP_NUMBER`) para que componentes Astro y pruebas Node ESM compartan la misma fuente de verdad sin duplicación. La tarjeta de WhatsApp en Contacto usa una nueva llave bilingüe `'contact.whatsapp_direct'` en `src/i18n/ui.ts` manteniendo paridad exacta ES/EN.

**Tech Stack:** Astro `^7.4.5`, Tailwind CSS `^4.3.4`, TypeScript, Node.js `>=22.23.4` (`node --experimental-strip-types --test`).

**Spec:** `docs/superpowers/specs/2026-11-11-contact-channels-design.md`

## Global Constraints

- **Valores exactos obligatorios:** correo `korexussoporte@gmail.com`, `mailto:korexussoporte@gmail.com`, número WhatsApp Bolivia `59171085116`, formato legible `+591 71085116`, enlace `https://wa.me/59171085116`.
- **Etiquetas WhatsApp aprobadas:** `'WhatsApp Chat Directo'` en español (`es`) y `'WhatsApp Direct Chat'` en inglés (`en`); no mostrar el teléfono escrito en el título de la tarjeta de Contacto (solo usarlo en `aria-label` para accesibilidad).
- **Seguridad en enlaces externos:** Todo enlace a `https://wa.me/59171085116` debe incluir `target="_blank"` y `rel="noopener noreferrer"`.
- **Paridad i18n:** Cada llave añadida en `ui.es` debe existir exactamente igual en `ui.en`.
- **Alcance estricto:** NO modificar `access_key` ni el script Web3Forms de `ContactForm.astro`, NO modificar `BaseLayout.astro` (`https://korexus.com`), NO modificar referencias de Casa Rosa.
- **Restricción Git:** NO ejecutar `git push` ni `git merge`. En entorno sandbox donde `.git` sea de solo lectura, no intentar rodear restricciones ni usar bypass sin aprobación del usuario.

## Review Focus

1. **Páginas de privacidad sin WhatsApp:** Verificar `href="mailto:korexussoporte@gmail.com"` emparejado con el texto `korexussoporte@gmail.com` en las 6 páginas con correo (`index.html`, `en/index.html`, `contacto/index.html`, `en/contact/index.html`, `aviso-de-privacidad/index.html`, `en/privacy-policy/index.html`), sin exigir enlace de WhatsApp en las 2 páginas de privacidad.
2. **Emparejamiento real `href` + texto visible del correo:** Validar dentro del mismo bloque `<a ...>...</a>` que tanto `href="mailto:korexussoporte@gmail.com"` como el texto visible `korexussoporte@gmail.com` aparezcan juntos (evitando la regresión previa de `geminiprojuan22@gmail.com` + `contacto@korexus.com`).
3. **Enlaces WhatsApp en las 4 páginas con contacto directo:** Validar en `index.html`, `en/index.html`, `contacto/index.html` y `en/contact/index.html` la presencia de `<a ... href="https://wa.me/59171085116" ...>` con `target="_blank"` y `rel="noopener noreferrer"`.
4. **Paridad ES/EN en Contacto:** Validar `"WhatsApp Chat Directo"` en `dist/contacto/index.html`, y `"WhatsApp Direct Chat"` junto con ausencia de `"WhatsApp Chat Directo"` en `dist/en/contact/index.html`.
5. **Barrido total de valores obsoletos:** Confirmar 0 ocurrencias de `geminiprojuan22@gmail.com`, `contacto@korexus.com`, `5210000000000` y `59178130974` en todos los archivos de `src/` y en las 12 páginas HTML generadas en `dist/`.

---

### Tarea 1: Escribir pruebas TDD (Rojo) y módulo central `src/config/contact.ts`

**Files:**
- Create: `tests/contact-channels.test.mjs`
- Create: `src/config/contact.ts`

**Interfaces:**
- Produces: `src/config/contact.ts` exportando `CONTACT_CHANNELS` (`{ email, emailHref, whatsappNumber, whatsappDisplay, whatsappHref } as const`).

- [x] **Paso 1: Escribir el test que falla (`tests/contact-channels.test.mjs`)**
  - Usar carga dinámica `await import('../src/config/contact.ts')` dentro del test unitario de configuración (comprobando antes `fs.existsSync`) para que todos los tests de la suite se ejecuten y fallen por aserción en fase Roja.
  - Cubrir:
    1. `CONTACT_CHANNELS` en `src/config/contact.ts` coincide con `korexussoporte@gmail.com`, `mailto:korexussoporte@gmail.com`, `59171085116`, `+591 71085116`, `https://wa.me/59171085116`, y los 4 consumidores (`ContactSection.astro`, `ContactForm.astro`, `aviso-de-privacidad.astro`, `en/privacy-policy.astro`) importan `CONTACT_CHANNELS`.
    2. `ui.es['contact.whatsapp_direct'] === 'WhatsApp Chat Directo'` y `ui.en['contact.whatsapp_direct'] === 'WhatsApp Direct Chat'`.
    3. Las 6 páginas en `dist/` con correo contienen un único `<a>` que empareja `href="mailto:korexussoporte@gmail.com"` con `korexussoporte@gmail.com` dentro de `<a ...>...</a>`.
    4. Las 4 páginas en `dist/` con WhatsApp contienen `<a ... href="https://wa.me/59171085116" ...>` con `target="_blank"` y `rel="noopener noreferrer"`.
    5. `dist/contacto/index.html` contiene `WhatsApp Chat Directo`, y `dist/en/contact/index.html` contiene `WhatsApp Direct Chat` y NO contiene `WhatsApp Chat Directo`.
    6. Todos los archivos en `src/` y todas las páginas HTML en `dist/` (mínimo 12) están completamente libres de `geminiprojuan22@gmail.com`, `contacto@korexus.com`, `5210000000000` y `59178130974`.

- [x] **Paso 2: Ejecutar el test en solitario para confirmar fallo (Rojo)**
  Run: `node --experimental-strip-types --test tests/contact-channels.test.mjs`
  Expected: FAIL por módulo faltante, llave i18n faltante y strings antiguos en `src/` y `dist/`.

- [x] **Paso 3: Crear `src/config/contact.ts`**
  Definir constantes base `CONTACT_EMAIL = 'korexussoporte@gmail.com'` y `WHATSAPP_NUMBER = '59171085116'`, y exportar `CONTACT_CHANNELS` derivando `emailHref` y `whatsappHref` mediante template literals (`whatsappDisplay: '+591 71085116'`).

---

### Tarea 2: Conectar componentes, páginas legales e i18n y verificar Verde completo

**Files:**
- Modify: `src/i18n/ui.ts:106-110,230-234`
- Modify: `src/components/ContactSection.astro:1-16,45-62`
- Modify: `src/components/ContactForm.astro:1-13,30-58`
- Modify: `src/pages/aviso-de-privacidad.astro:1-9,54-60`
- Modify: `src/pages/en/privacy-policy.astro:1-9,54-60`

**Interfaces:**
- Consumes: `CONTACT_CHANNELS` desde `'../config/contact'` (en componentes y página ES) o `'../../config/contact'` (en `src/pages/en/privacy-policy.astro`), y `t('contact.whatsapp_direct')` desde `src/i18n/ui.ts`.

- [x] **Paso 1: Actualizar `src/i18n/ui.ts`**
  Añadir `'contact.whatsapp_direct': 'WhatsApp Chat Directo'` en `ui.es` y `'contact.whatsapp_direct': 'WhatsApp Direct Chat'` en `ui.en`.

- [x] **Paso 2: Actualizar `src/components/ContactSection.astro`**
  Importar `CONTACT_CHANNELS` desde `'../config/contact'`, eliminar `whatsappNumber` y `contactEmail` locales, enlazar el botón WhatsApp a `CONTACT_CHANNELS.whatsappHref` con `aria-label={`${t('contact.btn_whatsapp')} (${CONTACT_CHANNELS.whatsappDisplay})`}`, y envolver icono `<Mail>` + `{CONTACT_CHANNELS.email}` en `<a href={CONTACT_CHANNELS.emailHref} class="inline-flex items-center gap-2 hover:text-[#FCFCFC] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EC8C4E] rounded">`.

- [x] **Paso 3: Actualizar `src/components/ContactForm.astro`**
  Importar `CONTACT_CHANNELS` desde `'../config/contact'`; en la tarjeta de correo usar `href={CONTACT_CHANNELS.emailHref}` y texto `{CONTACT_CHANNELS.email}`; en la tarjeta de WhatsApp usar `href={CONTACT_CHANNELS.whatsappHref}`, `aria-label={`${t('contact.whatsapp_direct')} (${CONTACT_CHANNELS.whatsappDisplay})`}` y texto `{t('contact.whatsapp_direct')}`. Mantener sin cambios el formulario y script Web3Forms.

- [x] **Paso 4: Actualizar `src/pages/aviso-de-privacidad.astro` y `src/pages/en/privacy-policy.astro`**
  Importar `CONTACT_CHANNELS` (`'../config/contact'` y `'../../config/contact'` respectivamente) y reemplazar el enlace `mailto:` y texto de contacto por `{CONTACT_CHANNELS.emailHref}` y `{CONTACT_CHANNELS.email}`.

- [x] **Paso 5: Ejecutar build y suite completa (Verde)**
  Run: `npm test`
  Expected: `astro build` completa sin errores y el 100% de las pruebas en `tests/**/*.test.mjs` (`contact-channels.test.mjs`, `i18n.test.mjs`, `links.test.mjs`, `favicon.test.mjs`, `hero-typography.test.mjs`, `systems-casarosa.test.mjs`) pasan con 0 fallos.
