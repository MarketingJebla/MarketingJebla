# Sitio Chevrolet Jebla Ciudad Victoria (vista previa)

- **Datos editables:** `src/data.mjs` (agencia, horarios, municipios, modelos, precios, colores, promociones).
- **Generar el sitio:** `node build.mjs` → escribe la carpeta `public/`, que es la que publica Netlify.
- **Estilos y comportamiento:** `src/assets/styles.css`, `src/assets/site.js`, `src/assets/icons.svg`.
- **Leads de prueba:** se guardan en el navegador; agrega `#leads` a cualquier URL para verlos y descargarlos en CSV.
- **CRM:** definir `window.JEBLA_CRM_ENDPOINT` para enviar cada lead por POST JSON.
- **Lanzamiento:** en `src/data.mjs` poner `SITE.url` y `SITE.preview = false`; en `netlify.toml` quitar el encabezado `X-Robots-Tag`.
