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
- Mantener el aviso de privacidad en todo formulario.
- Mientras `SITE.preview` sea `true`, el sitio no se indexa (franja "Versión de prueba" + noindex).
