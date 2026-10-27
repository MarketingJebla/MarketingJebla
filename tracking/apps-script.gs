/**
 * Receptor de leads → Google Sheets (copia de la base de Netlify).
 * Se pega en Extensiones → Apps Script del Sheet "Leads · Chevrolet Jebla Victoria"
 * y se implementa como App web (Ejecutar como: yo · Acceso: cualquier usuario).
 * La URL de la implementación va en la variable SHEETS_WEBHOOK_URL de Netlify.
 */
const HOJA = "Leads";
const COLUMNAS = [
  ["folio", "Folio"], ["fecha", "Fecha"], ["calidad", "Calidad"], ["nombre", "Nombre"], ["telefono", "WhatsApp"],
  ["correo", "Correo"], ["interes", "Interés"], ["modelo", "Modelo"], ["version", "Versión"], ["color", "Color"],
  ["tiempo", "Cuándo estrena"], ["enganche", "Enganche"], ["plan", "Plan calculadora"], ["origen", "Formulario"],
  ["pagina", "Página"], ["utm_source", "Fuente"], ["utm_medium", "Medio"], ["utm_campaign", "Campaña"],
  ["gclid", "Clic Google Ads"], ["fbclid", "Clic Meta"], ["extra", "Datos adicionales"],
];

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(HOJA);
  if (!sh) sh = ss.insertSheet(HOJA);
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLUMNAS.map(c => c[1]));
    sh.getRange(1, 1, 1, COLUMNAS.length).setFontWeight("bold").setBackground("#1a1a1a").setFontColor("#ffffff");
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d.folio || !/^JV-[A-Z0-9]+$/.test(d.folio)) return respuesta_({ ok: false, error: "folio" });
    const sh = hoja_();
    // Evita duplicados si el servidor reintenta el mismo folio
    const ya = sh.getRange("A:A").createTextFinder(d.folio).matchEntireCell(true).findNext();
    if (!ya) {
      // Teléfono como texto para que no pierda formato
      sh.appendRow(COLUMNAS.map(([k]) => (k === "telefono" && d[k] ? "'" + d[k] : d[k] == null ? "" : String(d[k]))));
    }
    return respuesta_({ ok: true, duplicado: !!ya });
  } catch (err) {
    return respuesta_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return respuesta_({ ok: true, servicio: "leads-chevrolet-jebla" }); }

function respuesta_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
