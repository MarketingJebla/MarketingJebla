// Lógica compartida de leads: limpieza de datos y copia a Google Sheets.
import { getDatabase } from "@netlify/database";
import { createHmac } from "node:crypto";

export const db = getDatabase();

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : v == null ? "" : String(v).slice(0, max));
const digits = (v: unknown) => str(v, 40).replace(/\D/g, "");

// Campos que tienen columna propia; lo demás va a `extra`.
const BASE = new Set(["folio", "fecha", "nombre", "telefono", "correo", "interes", "modelo", "version", "color", "tiempo", "enganche",
  "puntos", "calidad", "plan", "origen", "pagina", "referrer", "utm", "fbp", "fbc", "empresa", "financiamiento"]);

export type Lead = Record<string, any>;

/** Valida y normaliza lo que manda el formulario. Devuelve {lead} o {error}. */
export function cleanLead(input: any): { lead?: Lead; error?: string } {
  if (!input || typeof input !== "object") return { error: "Solicitud inválida" };
  if (str(input.empresa)) return { error: "spam" }; // campo trampa: las personas no lo ven
  const nombre = str(input.nombre, 120);
  let telefono = digits(input.telefono);
  if (telefono.length > 10 && telefono.startsWith("52")) telefono = telefono.replace(/^521?/, "");
  const correo = str(input.correo, 160).toLowerCase();
  if (nombre.length < 2) return { error: "Falta el nombre" };
  if (telefono.length !== 10) return { error: "El teléfono debe tener 10 dígitos" };
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo)) return { error: "Correo inválido" };

  const folio = /^JV-[A-Z0-9]{4,10}$/.test(str(input.folio, 20)) ? str(input.folio, 20) : "JV-" + Date.now().toString(36).toUpperCase().slice(-6);
  const utm = input.utm && typeof input.utm === "object" ? input.utm : {};
  const extra: Record<string, string> = {};
  for (const [k, v] of Object.entries(input)) if (!BASE.has(k) && /^[a-z_]{1,40}$/.test(k)) extra[k] = str(v, 500);
  const puntos = Number.isFinite(+input.puntos) && input.puntos !== "" ? Math.round(+input.puntos) : null;

  return { lead: {
    folio, nombre, telefono, correo: correo || null,
    interes: str(input.interes, 40) || null, modelo: str(input.modelo, 80) || null, version: str(input.version, 120) || null,
    color: str(input.color, 80) || null, tiempo: str(input.tiempo, 80) || null, enganche: str(input.enganche, 80) || null,
    puntos, calidad: str(input.calidad, 20) || null, plan: str(input.plan, 200) || null,
    origen: str(input.origen, 60) || null, pagina: str(input.pagina, 200) || null, referrer: str(input.referrer, 300) || null,
    utm_source: str(utm.utm_source, 120) || null, utm_medium: str(utm.utm_medium, 120) || null, utm_campaign: str(utm.utm_campaign, 200) || null,
    utm_content: str(utm.utm_content, 200) || null, utm_term: str(utm.utm_term, 200) || null,
    gclid: str(utm.gclid, 300) || null, fbclid: str(utm.fbclid, 300) || null,
    fbp: str(input.fbp, 120) || null, fbc: str(input.fbc, 300) || null,
    extra,
    // Leads de prueba: nombre "PRUEBA…" o utm_source=prueba. Se guardan pero el CRM y los reportes los pueden filtrar.
    es_prueba: /^prueba/i.test(nombre) || str(utm.utm_source, 40).toLowerCase() === "prueba",
  } };
}

/** Fila para Google Sheets (mismo orden que los encabezados del Apps Script). */
export function sheetRow(l: Lead) {
  const fecha = new Date(l.creado_en || Date.now()).toLocaleString("es-MX", { timeZone: "America/Mexico_City", hour12: false });
  return {
    folio: l.folio, fecha, calidad: l.calidad || "", nombre: l.nombre, telefono: l.telefono, correo: l.correo || "",
    interes: l.interes || "", modelo: l.modelo || "", version: l.version || "", color: l.color || "", tiempo: l.tiempo || "",
    enganche: l.enganche || "", plan: l.plan || "", origen: l.origen || "", pagina: l.pagina || "",
    utm_source: l.utm_source || "", utm_medium: l.utm_medium || "", utm_campaign: l.utm_campaign || "",
    gclid: l.gclid ? "sí" : "", fbclid: l.fbclid ? "sí" : "",
    extra: l.extra && Object.keys(l.extra).length ? Object.entries(l.extra).map(([k, v]) => `${k}: ${v}`).join(" · ") : "",
  };
}

/** Envía un lead al Apps Script del Sheet y marca el resultado en la base. */
export async function syncToSheet(l: Lead): Promise<boolean> {
  const url = Netlify.env.get("SHEETS_WEBHOOK_URL");
  if (!url) { console.warn(`[sheets] ${l.folio}: falta SHEETS_WEBHOOK_URL`); return false; } // queda pendiente para el reintento
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(sheetRow(l)), redirect: "follow" });
    const txt = await res.text();
    if (!res.ok || !/"ok"\s*:\s*true/.test(txt)) throw new Error(`HTTP ${res.status}: ${txt.slice(0, 200)}`);
    await db.sql`UPDATE leads SET sheet_sync_en = NOW(), sheet_error = NULL, sheet_intentos = sheet_intentos + 1 WHERE folio = ${l.folio}`;
    console.log(`[sheets] ${l.folio}: copiado`);
    return true;
  } catch (e: any) {
    console.error(`[sheets] ${l.folio}: error ${String(e?.message || e).slice(0, 300)}`);
    await db.sql`UPDATE leads SET sheet_error = ${String(e?.message || e).slice(0, 500)}, sheet_intentos = sheet_intentos + 1 WHERE folio = ${l.folio}`;
    return false;
  }
}

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------
export const ESTADOS = ["nuevo", "contactado", "cita", "visita", "venta", "perdido"] as const;

/** Lead en el formato público que consume el CRM (ver docs/integracion-crm.md). */
export function crmLead(l: Lead) {
  return {
    folio: l.folio,
    creado_en: new Date(l.creado_en).toISOString(),
    es_prueba: !!l.es_prueba,
    contacto: { nombre: l.nombre, telefono: l.telefono, telefono_e164: "+52" + l.telefono, correo: l.correo },
    interes: {
      tipo: l.interes, modelo: l.modelo, version: l.version, color: l.color,
      tiempo_compra: l.tiempo, enganche: l.enganche, plan_financiamiento: l.plan,
    },
    calificacion: { calidad: l.calidad, puntos: l.puntos },
    origen: {
      formulario: l.origen, pagina: l.pagina, referrer: l.referrer,
      utm_source: l.utm_source, utm_medium: l.utm_medium, utm_campaign: l.utm_campaign, utm_content: l.utm_content, utm_term: l.utm_term,
      gclid: l.gclid, fbclid: l.fbclid, fbp: l.fbp, fbc: l.fbc,
      canal: canal(l),
    },
    extra: l.extra || {},
    seguimiento: {
      estado: l.estado || "nuevo", estado_en: l.estado_en ? new Date(l.estado_en).toISOString() : null,
      estado_motivo: l.estado_motivo || null, valor_venta: l.valor_venta == null ? null : Number(l.valor_venta),
      asesor: l.asesor || null, crm_id: l.crm_id || null,
      crm_recibido_en: l.crm_sync_en ? new Date(l.crm_sync_en).toISOString() : null,
    },
  };
}

/** Canal normalizado para reportes: google_ads, meta_ads, tiktok, organico, directo, otro. */
export function canal(l: Lead): string {
  const src = (l.utm_source || "").toLowerCase(), med = (l.utm_medium || "").toLowerCase();
  if (l.gclid || (src.includes("google") && /cpc|ppc|paid/.test(med))) return "google_ads";
  if (l.fbclid || /facebook|instagram|meta|fb|ig/.test(src)) return "meta_ads";
  if (/tiktok/.test(src)) return "tiktok";
  if (src) return "otro";
  const ref = (l.referrer || "").toLowerCase();
  if (/google\.|bing\.|yahoo\./.test(ref)) return "organico";
  return ref ? "referido" : "directo";
}

/** Envía el lead al webhook del CRM (si está configurado), firmado con HMAC-SHA256. */
export async function syncToCrm(l: Lead): Promise<boolean> {
  const url = Netlify.env.get("CRM_WEBHOOK_URL");
  if (!url) return false; // el CRM aún no recibe por webhook: puede leer con GET /api/crm/leads
  const body = JSON.stringify({ evento: "lead.creado", lead: crmLead(l) });
  const ts = Math.floor(Date.now() / 1000).toString();
  const secret = Netlify.env.get("CRM_WEBHOOK_SECRET") || "";
  const firma = createHmac("sha256", secret).update(`${ts}.${body}`).digest("hex");
  try {
    const res = await fetch(url, { method: "POST", body, headers: {
      "Content-Type": "application/json", "X-Jebla-Timestamp": ts, "X-Jebla-Signature": `sha256=${firma}`, "X-Jebla-Folio": l.folio } });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    let crmId: string | null = null;
    try { const j = await res.json(); crmId = j?.crm_id ? String(j.crm_id).slice(0, 120) : null; } catch {}
    await db.sql`UPDATE leads SET crm_sync_en = NOW(), crm_error = NULL, crm_intentos = crm_intentos + 1, crm_id = COALESCE(${crmId}, crm_id) WHERE folio = ${l.folio}`;
    console.log(`[crm] ${l.folio}: entregado`);
    return true;
  } catch (e: any) {
    console.error(`[crm] ${l.folio}: error ${String(e?.message || e).slice(0, 300)}`);
    await db.sql`UPDATE leads SET crm_error = ${String(e?.message || e).slice(0, 500)}, crm_intentos = crm_intentos + 1 WHERE folio = ${l.folio}`;
    return false;
  }
}
