# Landing principal — Chevrolet Jebla Ciudad Victoria

Versión 1 (dummy) · 14 oct 2026

## Cómo verla
Doble clic en `index.html`. Necesita internet para cargar las imágenes, que por ahora vienen del sitio de la planta.

## Archivos
- `index.html` — estructura de la página.
- `css/styles.css` — diseño (mobile-first, colores de marca).
- `js/config.js` — **datos editables**: teléfonos, WhatsApp, horarios, modelos y precios, municipios.
- `js/app.js` — lógica del formulario, carrusel, catálogo y eventos de tracking.
- `assets/` — aquí van fotos, logos y tipografías propias cuando las tengamos.

## Funciones dummy
- El formulario valida y guarda los leads **solo en el navegador**.
- Para ver los leads de prueba: abre la página y agrega `#leads` al final de la dirección. Desde ahí se descargan en CSV.
- Llamada y WhatsApp ya funcionan con los números reales.
- Eventos para Tag Manager en `window.dataLayer`: `cta_click`, `form_start`, `form_step`, `form_error`, `lead_submit`, `category_view`.

## Pendientes (buscar "PENDIENTE" en los archivos)
- Horarios reales de ventas y servicio.
- Aviso de privacidad y razón social del distribuidor.
- Lista oficial de municipios del PMA.
- IDs de tracking (Tag Manager / Meta Pixel / GA4).
- URL del CRM (`JEBLA.crm.endpoint` en `app.js`).
- Imágenes locales y tipografía ChevySans (hoy usa una tipografía de respaldo).
