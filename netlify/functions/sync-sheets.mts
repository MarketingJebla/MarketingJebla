// Reintento programado: copia al Google Sheet los leads que no se pudieron enviar al momento.
// Corre cada 15 minutos (UTC; la hora local no importa para este intervalo).
import type { Config } from "@netlify/functions";
import { db, syncToSheet } from "../lib/leads.mts";

export default async () => {
  if (!Netlify.env.get("SHEETS_WEBHOOK_URL")) return;
  const pendientes = await db.sql`
    SELECT * FROM leads
    WHERE sheet_sync_en IS NULL AND sheet_intentos < 20 AND creado_en > NOW() - INTERVAL '14 days'
    ORDER BY creado_en ASC LIMIT 25`;
  let ok = 0;
  for (const l of pendientes) if (await syncToSheet(l)) ok++;
  console.log(`sync-sheets: ${ok}/${pendientes.length} leads copiados al Sheet`);
};

export const config: Config = { schedule: "*/15 * * * *" };
