# Integración landing ↔ CRM · Chevrolet Jebla Motors Ciudad Victoria

Ficha técnica para el proyecto del CRM. Describe cómo el CRM recibe los leads de la landing
(`https://chevrolet-jebla-victoria.netlify.app`), cómo devuelve el avance comercial y de dónde salen los datos para los tableros.

## 1. Arquitectura

```
Visitante → formulario → POST /api/leads ─┬─> Netlify Database (tabla leads = fuente de verdad)
                                          ├─> Google Sheets (copia de consulta)
                                          └─> Webhook del CRM (opcional, firmado)
CRM ── GET  /api/crm/leads ───────────────> lee leads nuevos (si no usa webhook, o para recuperar faltantes)
CRM ── POST /api/crm/leads/:folio/estado ─> devuelve el avance: contactado, cita, visita, venta, perdido
CRM ── GET  /api/crm/resumen ─────────────> métricas agregadas para tableros
```

- **El folio (`JV-XXXXXX`) es la llave única** del lead en ambos sistemas. También es el `event_id` que reciben Meta y GA4, así que permite cruzar ventas con anuncios.
- Recomendado: **webhook para tiempo real + lectura periódica con `pendientes=1`** como red de seguridad. Si el CRM no tiene URL pública todavía, basta con la lectura periódica (cada 1–5 min).

## 2. Autenticación

| Dirección | Mecanismo | Dónde está la clave |
|---|---|---|
| CRM → landing (API) | Header `Authorization: Bearer <CRM_API_KEY>` | Netlify → chevrolet-jebla-victoria → Environment variables → `CRM_API_KEY` |
| Landing → CRM (webhook) | Firma HMAC-SHA256 en `X-Jebla-Signature` | `CRM_WEBHOOK_SECRET` (se define al activar el webhook) |

La clave nunca va en el código del CRM: se guarda como variable de entorno o secreto del CRM.
Límite: 120 solicitudes por minuto por IP.

## 3. Leer leads — `GET /api/crm/leads`

| Parámetro | Default | Descripción |
|---|---|---|
| `desde`, `hasta` | últimos 30 días | Fechas ISO 8601 |
| `pendientes=1` | — | Solo leads que el CRM aún no confirmó |
| `cursor` | — | Usa `siguiente_cursor` de la respuesta anterior para paginar |
| `limite` | 100 (máx. 500) | Leads por página |
| `incluir_prueba=1` | excluidos | Incluir leads de prueba |

Respuesta: `{ ok, total, leads: [Lead], siguiente_cursor }`. Un lead puntual: `GET /api/crm/leads/JV-XXXXXX`.

**Flujo de importación recomendado**
1. `GET /api/crm/leads?pendientes=1` (repetir con `cursor` mientras `siguiente_cursor` no sea `null`).
2. Crear o actualizar cada lead en el CRM usando `folio` como llave (idempotente).
3. `POST /api/crm/leads/confirmar` con `{"leads":[{"folio":"JV-…","crm_id":"<id interno>"}]}` (máx. 500). Así no vuelven a salir como pendientes.

## 4. Objeto Lead

```json
{
  "folio": "JV-RAZ2KR",
  "creado_en": "2026-10-27T23:14:41.000Z",
  "es_prueba": false,
  "contacto": { "nombre": "Ana López", "telefono": "8341112222", "telefono_e164": "+528341112222", "correo": "ana@correo.mx" },
  "interes": { "tipo": "cotizacion", "modelo": "Onix 2026", "version": null, "color": null,
               "tiempo_compra": "Este mes", "enganche": "Más de $100,000 o de contado", "plan_financiamiento": null },
  "calificacion": { "calidad": "caliente", "puntos": 4 },
  "origen": { "formulario": "modelo-onix", "pagina": "/modelos/onix/", "referrer": "",
              "utm_source": "facebook", "utm_medium": "paid", "utm_campaign": "onix-oct", "utm_content": null, "utm_term": null,
              "gclid": null, "fbclid": "IwAR…", "fbp": "fb.1.…", "fbc": "fb.1.…", "canal": "meta_ads" },
  "extra": { "auto_actual": "Versa 2018" },
  "seguimiento": { "estado": "nuevo", "estado_en": null, "estado_motivo": null, "valor_venta": null,
                   "asesor": null, "crm_id": null, "crm_recibido_en": null }
}
```

| Campo | Valores |
|---|---|
| `interes.tipo` | `cotizacion`, `prueba` (prueba de manejo), `financiamiento`, `seminuevos` (auto a cuenta), `servicio` |
| `calificacion.calidad` | `caliente` (4+ pts), `tibio` (2–3), `frío` (0–1). Sale de tiempo de compra + enganche. Servicio no se califica (`null`). |
| `origen.canal` | `google_ads`, `meta_ads`, `tiktok`, `organico`, `referido`, `directo`, `otro` |
| `extra` | Campos de formularios específicos: `auto_actual`, `anio`, `servicio`, `fecha_pref`, `plazo`, etc. |
| `telefono` | 10 dígitos sin lada país; `telefono_e164` listo para WhatsApp API |

## 5. Webhook (landing → CRM, tiempo real)

Se activa definiendo en Netlify `CRM_WEBHOOK_URL` (URL pública del CRM) y `CRM_WEBHOOK_SECRET`.

- `POST <CRM_WEBHOOK_URL>` con cuerpo `{"evento":"lead.creado","lead":{…Lead…}}`.
- Headers: `X-Jebla-Timestamp` (Unix, segundos), `X-Jebla-Signature: sha256=<hex>`, `X-Jebla-Folio`.
- **Verificación:** `hex(HMAC_SHA256(secret, timestamp + "." + cuerpo_crudo))` debe coincidir con la firma. Rechazar si el timestamp tiene más de 5 minutos.
- Responder `2xx` (opcional `{"crm_id":"…"}`). Cualquier otro código se reintenta cada 15 min hasta 20 veces durante 14 días.
- Puede llegar el mismo folio más de una vez: tratarlo como idempotente.

```js
// Node — verificación
import { createHmac, timingSafeEqual } from "node:crypto";
const esperado = "sha256=" + createHmac("sha256", process.env.CRM_WEBHOOK_SECRET).update(`${ts}.${rawBody}`).digest("hex");
const valido = timingSafeEqual(Buffer.from(esperado), Buffer.from(req.headers["x-jebla-signature"] || ""));
```

## 6. Devolver el avance comercial — `POST /api/crm/leads/:folio/estado`

```json
{ "estado": "venta", "valor_venta": 389900, "asesor": "Luis Pérez", "crm_id": "OPP-1234", "motivo": null, "fecha": "2026-11-05T17:30:00-06:00" }
```

Estados: `nuevo` → `contactado` → `cita` → `visita` → `venta` | `perdido` (con `motivo`).
Llamarlo **cada vez que cambie la etapa** en el CRM. Esto alimenta el embudo de los reportes y, en la siguiente fase,
se enviará a Meta (conjunto "OFFLINE EVENTS - CHJM") y a Google Ads como conversión offline, para que las campañas optimicen por ventas y no solo por formularios.

## 7. Reportes — `GET /api/crm/resumen?desde=&hasta=`

Devuelve (excluye pruebas por defecto, zona horaria America/Mexico_City):
`total_leads`, `embudo` (conteo por estado) y listas `por_dia`, `por_canal`, `por_campana`, `por_fuente`, `por_modelo`, `por_calidad`, `por_interes`, `por_formulario`,
cada elemento con `{clave, leads, calientes, ventas, valor_ventas}`.

**Fuentes para el tablero completo**

| Métrica | Fuente | Cómo se conecta el CRM |
|---|---|---|
| Leads, calidad, embudo, ventas por canal/campaña/modelo | Esta API | `GET /api/crm/resumen` o `GET /api/crm/leads` |
| Visitas, usuarios, fuentes de tráfico, conversión por página | GA4 propiedad `G-70X945VE3C` (ID de propiedad 561093660) | GA4 Data API con cuenta de servicio con permiso de lectura |
| Clics en llamar / WhatsApp, inicio de formulario | GA4 eventos `click_call`, `click_whatsapp`, `form_start`, `generate_lead` | GA4 Data API |
| Inversión, impresiones, clics, CPL Meta | Cuenta publicitaria 4635274443377382 · Pixel 1191007982740078 | Meta Marketing API (token de usuario del sistema) |
| Inversión Google Ads | Cuenta 117-887-9431 (MCC Grupo Jebla 749-608-9762) | Google Ads API (cuando la cuenta esté activa) |

Costo por lead real = inversión del canal / leads de ese canal (esta API). Costo por venta = inversión / ventas (`estado = venta`).

## 8. Checklist de puesta en marcha

1. El CRM guarda `CRM_API_KEY` (copiada de Netlify) en sus secretos.
2. El CRM implementa la importación (sección 3) y la prueba con `incluir_prueba=1`.
3. Opcional: el CRM publica su endpoint de webhook → se definen `CRM_WEBHOOK_URL` y `CRM_WEBHOOK_SECRET` en Netlify.
4. El CRM llama `…/estado` en cada cambio de etapa.
5. Tablero: `/api/crm/resumen` + GA4 Data API + Meta Marketing API.
6. Fase 2 (landing): reenviar `venta`/`cita` a Meta CAPI offline y Google Ads offline conversions.
