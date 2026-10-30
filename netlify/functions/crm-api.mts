// API para el CRM de Chevrolet Jebla Motors (Ciudad Victoria). Documentación: docs/integracion-crm.md
//   GET  /api/crm/leads                 → lista de leads (paginada, filtros por fecha / pendientes)
//   GET  /api/crm/leads/:folio          → un lead
//   POST /api/crm/leads/confirmar       → el CRM confirma qué folios ya importó
//   POST /api/crm/leads/:folio/estado   → el CRM actualiza el estado comercial (contactado, cita, venta…)
//   GET  /api/crm/resumen               → métricas agregadas para tableros
// Autenticación: header "Authorization: Bearer <CRM_API_KEY>".
import type { Config } from "@netlify/functions";
import { timingSafeEqual } from "node:crypto";
import { db, crmLead, canal, ESTADOS } from "../lib/leads.mts";

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const err = (status: number, error: string) => json({ ok: false, error }, status);

function autorizado(req: Request): boolean {
  const key = Netlify.env.get("CRM_API_KEY");
  if (!key || key.length < 24) return false; // sin llave configurada la API queda cerrada
  const got = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const a = Buffer.from(got), b = Buffer.from(key);
  return a.length === b.length && timingSafeEqual(a, b);
}

const fecha = (v: string | null, def: Date) => { const d = v ? new Date(v) : def; return isNaN(+d) ? def : d; };
const folioOk = (f: string) => /^JV-[A-Z0-9]{4,10}$/.test(f);

export default async (req: Request) => {
  if (!autorizado(req)) return err(401, "No autorizado");
  const url = new URL(req.url);
  const partes = url.pathname.replace(/^\/api\/crm\/?/, "").split("/").filter(Boolean);
  const q = url.searchParams;
  const incluirPrueba = q.get("incluir_prueba") === "1";

  // ---------- GET /api/crm/leads ----------
  if (req.method === "GET" && partes[0] === "leads" && partes.length === 1) {
    const desde = fecha(q.get("desde"), new Date(Date.now() - 30 * 864e5));
    const hasta = fecha(q.get("hasta"), new Date(Date.now() + 60e3));
    const limite = Math.min(Math.max(parseInt(q.get("limite") || "100", 10) || 100, 1), 500);
    const despuesDe = parseInt(q.get("cursor") || "0", 10) || 0; // id interno del último lead recibido
    const pendientes = q.get("pendientes") === "1";
    const rows = await db.sql`
      SELECT * FROM leads
      WHERE creado_en >= ${desde} AND creado_en < ${hasta} AND id > ${despuesDe}
        AND (${incluirPrueba} OR NOT es_prueba)
        AND (NOT ${pendientes} OR crm_sync_en IS NULL)
      ORDER BY id ASC LIMIT ${limite + 1}`;
    const pagina = rows.slice(0, limite);
    return json({ ok: true, total: pagina.length, leads: pagina.map(crmLead),
      siguiente_cursor: rows.length > limite ? String(pagina[pagina.length - 1].id) : null });
  }

  // ---------- GET /api/crm/leads/:folio ----------
  if (req.method === "GET" && partes[0] === "leads" && partes.length === 2) {
    if (!folioOk(partes[1])) return err(400, "Folio inválido");
    const [l] = await db.sql`SELECT * FROM leads WHERE folio = ${partes[1]}`;
    return l ? json({ ok: true, lead: crmLead(l) }) : err(404, "No existe ese folio");
  }

  // ---------- POST /api/crm/leads/confirmar ----------
  if (req.method === "POST" && partes[0] === "leads" && partes[1] === "confirmar") {
    let b: any; try { b = await req.json(); } catch { return err(400, "JSON inválido"); }
    const items: { folio: string; crm_id?: string }[] = Array.isArray(b?.leads) ? b.leads
      : Array.isArray(b?.folios) ? b.folios.map((f: string) => ({ folio: f })) : [];
    if (!items.length || items.length > 500) return err(400, "Envía 'folios' (1 a 500)");
    let n = 0;
    for (const it of items) {
      if (!folioOk(String(it.folio))) continue;
      const crmId = it.crm_id ? String(it.crm_id).slice(0, 120) : null;
      const r = await db.sql`UPDATE leads SET crm_sync_en = COALESCE(crm_sync_en, NOW()), crm_id = COALESCE(${crmId}, crm_id), crm_error = NULL
        WHERE folio = ${it.folio} RETURNING id`;
      n += r.length;
    }
    return json({ ok: true, confirmados: n });
  }

  // ---------- POST /api/crm/leads/:folio/estado ----------
  if (req.method === "POST" && partes[0] === "leads" && partes.length === 3 && partes[2] === "estado") {
    const folio = partes[1];
    if (!folioOk(folio)) return err(400, "Folio inválido");
    let b: any; try { b = await req.json(); } catch { return err(400, "JSON inválido"); }
    const estado = String(b?.estado || "").toLowerCase();
    if (!(ESTADOS as readonly string[]).includes(estado)) return err(422, `Estado inválido. Usa: ${ESTADOS.join(", ")}`);
    const valor = b?.valor_venta == null || b.valor_venta === "" ? null : Number(b.valor_venta);
    if (valor != null && (!isFinite(valor) || valor < 0)) return err(422, "valor_venta inválido");
    const motivo = b?.motivo ? String(b.motivo).slice(0, 300) : null;
    const asesor = b?.asesor ? String(b.asesor).slice(0, 120) : null;
    const crmId = b?.crm_id ? String(b.crm_id).slice(0, 120) : null;
    const cuando = fecha(b?.fecha || null, new Date());
    const [l] = await db.sql`
      UPDATE leads SET estado = ${estado}, estado_en = ${cuando}, estado_motivo = ${motivo},
        valor_venta = COALESCE(${valor}, valor_venta), asesor = COALESCE(${asesor}, asesor),
        crm_id = COALESCE(${crmId}, crm_id), crm_sync_en = COALESCE(crm_sync_en, NOW())
      WHERE folio = ${folio} RETURNING *`;
    return l ? json({ ok: true, lead: crmLead(l) }) : err(404, "No existe ese folio");
  }

  // ---------- GET /api/crm/resumen ----------
  if (req.method === "GET" && partes[0] === "resumen") {
    const desde = fecha(q.get("desde"), new Date(Date.now() - 30 * 864e5));
    const hasta = fecha(q.get("hasta"), new Date(Date.now() + 60e3));
    const rows = await db.sql`
      SELECT creado_en, utm_source, utm_medium, utm_campaign, gclid, fbclid, referrer, modelo, interes, calidad, origen, estado, valor_venta
      FROM leads WHERE creado_en >= ${desde} AND creado_en < ${hasta} AND (${incluirPrueba} OR NOT es_prueba)`;
    const cuenta = (f: (r: any) => string) => {
      const m: Record<string, { leads: number; calientes: number; ventas: number; valor_ventas: number }> = {};
      for (const r of rows) {
        const k = f(r) || "(sin dato)"; const o = (m[k] ||= { leads: 0, calientes: 0, ventas: 0, valor_ventas: 0 });
        o.leads++; if (r.calidad === "caliente") o.calientes++;
        if (r.estado === "venta") { o.ventas++; o.valor_ventas += Number(r.valor_venta || 0); }
      }
      return Object.entries(m).map(([clave, v]) => ({ clave, ...v })).sort((a, b) => b.leads - a.leads);
    };
    const dia = (r: any) => new Date(r.creado_en).toLocaleDateString("en-CA", { timeZone: "America/Mexico_City" });
    const embudo: Record<string, number> = Object.fromEntries(ESTADOS.map(e => [e, 0]));
    for (const r of rows) embudo[r.estado] = (embudo[r.estado] || 0) + 1;
    return json({
      ok: true, desde: desde.toISOString(), hasta: hasta.toISOString(), zona_horaria: "America/Mexico_City",
      total_leads: rows.length, embudo,
      por_dia: cuenta(dia).sort((a, b) => a.clave.localeCompare(b.clave)),
      por_canal: cuenta(canal), por_campana: cuenta(r => r.utm_campaign), por_fuente: cuenta(r => r.utm_source),
      por_modelo: cuenta(r => r.modelo), por_calidad: cuenta(r => r.calidad), por_interes: cuenta(r => r.interes),
      por_formulario: cuenta(r => r.origen),
    });
  }

  return err(404, "Ruta no encontrada");
};

export const config: Config = {
  path: "/api/crm/*",
  rateLimit: { windowLimit: 120, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
