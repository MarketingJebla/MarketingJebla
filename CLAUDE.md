# Sitio Chevrolet Jebla Ciudad Victoria — instrucciones para Claude

Sitio estático de captación de leads para Chevrolet Jebla (Ciudad Victoria, Tamaulipas). El dueño no es programador: responde en español, claro y breve.

## Cómo está hecho
- `src/data.mjs`: datos editables (agencia, horarios, municipios, modelos, precios, colores, promociones). `PENDIENTE` = dato por confirmar.
- `build.mjs`: genera todas las páginas (inicio, catálogo, 7 modelos, gracias, 404) y el formulario (`leadForm`).
- `src/secciones.mjs`: promociones, financiamiento, auto a cuenta, servicio, prueba de manejo, contacto, aviso de privacidad.
- `src/assets/`: `styles.css`, `site.js` (formularios, validación, calculadora, colores, dataLayer), `icons.svg`.
- `public/`: salida generada. **No editar a mano**; se regenera.

## Flujo de trabajo
1. Editar archivos en `src/` o `build.mjs`.
2. Correr `node build.mjs` (sin dependencias).
3. Probar: abrir `public/` con un servidor local, revisar celular (320 y 390 px) y escritorio, sin desbordes horizontales ni errores de consola; probar el formulario completo hasta `/gracias/`.
4. Commit y push a `main`. Netlify publica la carpeta `public/` (ver `netlify.toml`).

## Reglas
- Mobile-first y enfocado en conversión: pocos campos, CTAs claros, WhatsApp y llamada siempre a la mano.
- Respetar la marca: colores y estilo del sitio oficial; no inventar precios, versiones ni promociones (usar "Pide tu precio" o marcar PENDIENTE).
- Formularios en modo dummy: los leads se guardan en localStorage (`#leads` para verlos). CRM futuro vía `window.JEBLA_CRM_ENDPOINT`.
- Formularios de ventas (función `leadForm`): paso 1 = tiempo para estrenar + enganche estimado (y selector de modelo donde no se conoce); paso 2 = nombre completo, WhatsApp y correo. Opciones y puntos en `TIEMPOS`/`ENGANCHES` de `src/data.mjs`; cada lead lleva `calidad` caliente/tibio/frío. El formulario de servicio no lleva calificación.
- Mantener el aviso de privacidad en todo formulario (línea de texto con enlace bajo el botón).
- Mientras `SITE.preview` sea `true`, el sitio no se indexa (franja "Versión de prueba" + noindex).

## Medición (GTM, GA4, Google Ads, Meta)
- IDs en `TRACKING` de `src/data.mjs`. El sitio solo carga GTM; GA4, Google Ads y el Pixel de Meta viven dentro del contenedor.
- `node tracking/gtm-container.mjs` genera `tracking/gtm-container.json` para importar en GTM (Combinar → Reemplazar conflictivos).
- `lead_submit` lleva `event_id` (= folio, para deduplicar con API de Conversiones/CRM) y `user_data` (solo Meta y Google Ads, nunca GA4).

## Leads (base de datos + Google Sheets)
- El formulario hace POST a `/api/leads` (`netlify/functions/leads.mts`): valida, descarta spam (campo trampa `empresa`) y guarda en **Netlify Database** (tabla `leads`, migraciones en `netlify/database/migrations/`). Esa tabla es la fuente de verdad para el CRM.
- Copia a Google Sheets: `netlify/lib/leads.mts` → Apps Script (`tracking/apps-script.gs`) cuya URL va en la variable de entorno `SHEETS_WEBHOOK_URL`. `sync-sheets.mts` reintenta pendientes cada 15 min.
- Cambios de esquema: SIEMPRE con una migración nueva (nunca editar una ya aplicada).
- El navegador también guarda copia en localStorage (`#leads` para verla).
