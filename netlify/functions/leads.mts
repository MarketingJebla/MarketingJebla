// POST /api/leads — recibe el formulario, guarda en Netlify Database y copia a Google Sheets.
import type { Config, Context } from "@netlify/functions";
import { db, cleanLead, syncToSheet, syncToCrm } from "../lib/leads.mts";

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export default async (req: Request, context: Context) => {
  let input: any;
  try { input = await req.json(); } catch { return json({ ok: false, error: "Solicitud inválida" }, 400); }

  const { lead, error } = cleanLead(input);
  if (error === "spam") return json({ ok: true, folio: "JV-OK" }); // no le avisamos al bot
  if (!lead) return json({ ok: false, error }, 422);

  const ua = (req.headers.get("user-agent") || "").slice(0, 300) || null;
  const rows = await db.sql`
    INSERT INTO leads (folio, nombre, telefono, correo, interes, modelo, version, color, tiempo, enganche, puntos, calidad, plan,
      origen, pagina, referrer, utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, fbp, fbc, user_agent, extra, es_prueba)
    VALUES (${lead.folio}, ${lead.nombre}, ${lead.telefono}, ${lead.correo}, ${lead.interes}, ${lead.modelo}, ${lead.version}, ${lead.color},
      ${lead.tiempo}, ${lead.enganche}, ${lead.puntos}, ${lead.calidad}, ${lead.plan}, ${lead.origen}, ${lead.pagina}, ${lead.referrer},
      ${lead.utm_source}, ${lead.utm_medium}, ${lead.utm_campaign}, ${lead.utm_content}, ${lead.utm_term}, ${lead.gclid}, ${lead.fbclid},
      ${lead.fbp}, ${lead.fbc}, ${ua}, ${JSON.stringify(lead.extra)}::jsonb, ${lead.es_prueba})
    ON CONFLICT (folio) DO NOTHING
    RETURNING *`;

  // Si el folio ya existía (reintento del navegador), respondemos ok sin duplicar.
  if (!rows.length) return json({ ok: true, folio: lead.folio, duplicado: true });

  // Copias al Sheet y al CRM: no retrasan la respuesta al cliente
  context.waitUntil(Promise.all([syncToSheet(rows[0]), syncToCrm(rows[0])]));
  return json({ ok: true, folio: lead.folio }, 201);
};

export const config: Config = {
  path: "/api/leads",
  method: "POST",
  rateLimit: { windowLimit: 8, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
