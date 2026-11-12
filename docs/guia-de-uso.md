# Guía de Uso: Web de Korexus

**Última actualización:** 11 de noviembre de 2026

---

## 1. ¿Qué hace esta página?

Es la página comercial oficial de **Korexus** en dos idiomas (**Español** en `/` e **Inglés** en `/en/`), pensada para presentar sus servicios y conseguir clientes.

Incluye:
- **Portada interactiva:** muestra la palabra **KOREXUS** con luz cálida que sigue el cursor del ratón (y oscila suavemente en teléfonos móviles) junto con los botones para ver sistemas o ir a contacto.
- **Portafolio de sistemas reales:** incluye el proyecto **Casa Rosa** (`https://casarosa.pages.dev/`) con acceso directo en `"Ver en vivo"` y su ficha técnica completa en español e inglés, además del caso privado/NDA.
- **Identidad en el navegador:** ícono oficial **"K"** de Korexus sobre fondo oscuro redondeado en la pestaña del navegador, marcadores y móviles.
- **Canales de contacto directos:** correo oficial **`korexussoporte@gmail.com`** y WhatsApp de Bolivia **`+591 71085116`**, conectados desde un punto central en Inicio, la página de Contacto y el Aviso de Privacidad (español e inglés).
- **Secciones informativas y contacto:** Servicios, Cómo trabajamos, Equipo, Formulario de contacto (pendiente de clave real para envíos automáticos) y Aviso de privacidad.

---

## 2. ¿Cómo abrirla y probarla en tu computadora paso a paso?

1. Abre una terminal dentro de la carpeta `Landing-Korexus`.
2. Ejecuta:
   ```bash
   npm run dev
   ```
3. Abre tu navegador y entra en [http://localhost:4321](http://localhost:4321).
4. **Para verla desde tu celular:** mira en la terminal la dirección que dice **`Network`** (por ejemplo `http://192.168.100.8:4321`) y ábrela en tu teléfono conectado al mismo Wi-Fi.
5. **Para verificar que todo funciona antes de subir cambios:** ejecuta en la terminal:
   ```bash
   npm test
   ```
   Si todo está bien, verás que se compilan las 12 páginas y todas las pruebas terminan en verde (`fail 0`).

---

## 3. Problemas frecuentes y cómo resolverlos

- **Quiero cambiar el correo o el número de WhatsApp en el futuro:**
  Basta con actualizar un solo archivo (`src/config/contact.ts`) y volver a ejecutar `npm test`. Todas las páginas (Inicio, Contacto y Aviso de Privacidad, en español e inglés) se actualizarán automáticamente.
- **En la pestaña del navegador todavía veo el ícono antiguo (o de Astro):**
  Los navegadores guardan los íconos en memoria. Presiona **`Ctrl + Shift + R`** para forzar la recarga completa o abre la web en una ventana privada/incógnito.
- **Las letras de KOREXUS se ven quietas y no siguen el cursor:**
  Comprueba si tu computadora o teléfono tiene activada la opción de sistema *"Reducir movimiento"* o *"Desactivar animaciones"*. Por accesibilidad, la página respeta ese ajuste dejando la luz fija.
- **No carga la página en el teléfono al probar `Network`:**
  Asegúrate de que el celular y la computadora estén conectados a la misma red Wi-Fi y que el firewall de Windows no esté bloqueando el puerto `4321`.
- **La página en vivo de un proyecto abre en otra pestaña y quiero volver:**
  Los enlaces externos (como Casa Rosa o WhatsApp) se abren automáticamente en una pestaña nueva para que el visitante nunca pierda tu web de Korexus abierta.
