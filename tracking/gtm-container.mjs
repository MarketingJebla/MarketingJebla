// Genera tracking/gtm-container.json para importar en Google Tag Manager
// (Administrar → Importar contenedor → "Combinar" → "Reemplazar los conflictivos").
// Uso: node tracking/gtm-container.mjs   — toma los IDs de TRACKING en src/data.mjs
import { writeFileSync } from "node:fs";
import { TRACKING as T } from "../src/data.mjs";

const A = { accountId: "0", containerId: "0" };
const tpl = (key, value) => ({ type: "TEMPLATE", key, value: String(value) });
const bool = (key, value) => ({ type: "BOOLEAN", key, value: String(value) });
const ALL_PAGES = "2147479553";

// ---------- Variables ----------
let vid = 0;
const variables = [];
const constant = (name, value) => variables.push({ ...A, variableId: String(++vid), name, type: "c", parameter: [tpl("value", value)] });
const dlv = (name, key) => variables.push({ ...A, variableId: String(++vid), name, type: "v",
  parameter: [{ type: "INTEGER", key: "dataLayerVersion", value: "2" }, bool("setDefaultValue", true), tpl("defaultValue", ""), tpl("name", key)] });

constant("CONST - GA4 ID", T.ga4 || "G-XXXXXXXXXX");
constant("CONST - Google Ads ID", (T.googleAds || "AW-XXXXXXXXXX").replace(/^AW-/, ""));
constant("CONST - Ads label Lead", T.adsLabelLead || "ETIQUETA_LEAD");
constant("CONST - Ads label Contacto", T.adsLabelContacto || "ETIQUETA_CONTACTO");
constant("CONST - Meta Pixel ID", T.metaPixel);
[["event_id", "event_id"], ["interes", "interes"], ["modelo", "modelo"], ["version", "version"], ["calidad", "calidad"], ["tiempo", "tiempo"],
 ["enganche", "enganche"], ["origen", "origen"], ["cta", "cta"], ["pagina", "pagina"], ["email", "user_data.email"],
 ["telefono", "user_data.phone_number"], ["nombre", "user_data.first_name"]].forEach(([n, k]) => dlv("DLV - " + n, k));
// Datos del usuario para conversiones mejoradas de Google Ads (solo cuando hay conversión de Ads)
if (T.googleAds && T.adsLabelLead) variables.push({ ...A, variableId: String(++vid), name: "UPD - Datos del lead", type: "awec", parameter: [
  tpl("mode", "MANUAL"), tpl("email", "{{DLV - email}}"), tpl("phone_number", "{{DLV - telefono}}"), tpl("first_name", "{{DLV - nombre}}")] });

// ---------- Activadores ----------
let trid = 100;
const triggers = [], TR = {};
const ce = (ev, extra = []) => {
  const id = String(++trid);
  triggers.push({ ...A, triggerId: id, name: "CE - " + ev, type: "CUSTOM_EVENT",
    customEventFilter: [{ type: "EQUALS", parameter: [tpl("arg0", "{{_event}}"), tpl("arg1", ev)] }], ...(extra.length ? { filter: extra } : {}) });
  return (TR[ev] = id);
};
["lead_submit", "click_call", "click_whatsapp", "form_start", "estimator_use", "color_select", "version_select"].forEach(e => ce(e));

// ---------- Etiquetas ----------
let tid = 200;
const tags = [];
const tag = (name, type, parameter, firing, extra = {}) => tags.push({ ...A, tagId: String(++tid), name, type, parameter,
  firingTriggerId: firing, tagFiringOption: "ONCE_PER_EVENT", ...extra });
const html = code => [tpl("html", code), bool("supportDocumentWrite", false)];
const ga4Event = (name, event, params, trig) => tag(name, "gaawe", [
  bool("sendEcommerceData", false), tpl("eventName", event), tpl("measurementIdOverride", "{{CONST - GA4 ID}}"),
  ...(params.length ? [{ type: "LIST", key: "eventSettingsTable", list: params.map(([k, v]) => ({ type: "MAP", map: [tpl("parameter", k), tpl("parameterValue", v)] })) }] : []),
], trig);

// Google: etiqueta de Google (GA4), vinculador de conversiones, eventos y conversiones de Ads
tag("Google - Etiqueta GA4", "googtag", [tpl("tagId", "{{CONST - GA4 ID}}")], [ALL_PAGES]);
tag("Google Ads - Vinculador de conversiones", "gclidw", [bool("enableCrossDomain", false), bool("enableUrlPassthrough", false), bool("enableCookieOverrides", false)], [ALL_PAGES]);
const leadParams = [["interes", "{{DLV - interes}}"], ["modelo", "{{DLV - modelo}}"], ["version", "{{DLV - version}}"], ["calidad_lead", "{{DLV - calidad}}"],
  ["tiempo_compra", "{{DLV - tiempo}}"], ["enganche", "{{DLV - enganche}}"], ["origen_formulario", "{{DLV - origen}}"], ["lead_id", "{{DLV - event_id}}"]];
ga4Event("GA4 - generate_lead", "generate_lead", leadParams, [TR.lead_submit]);
ga4Event("GA4 - click_call", "click_call", [["cta", "{{DLV - cta}}"]], [TR.click_call]);
ga4Event("GA4 - click_whatsapp", "click_whatsapp", [["cta", "{{DLV - cta}}"]], [TR.click_whatsapp]);
ga4Event("GA4 - form_start", "form_start", [["origen_formulario", "{{DLV - origen}}"]], [TR.form_start]);
ga4Event("GA4 - estimator_use", "estimator_use", [], [TR.estimator_use]);
ga4Event("GA4 - color_select", "color_select", [], [TR.color_select]);
ga4Event("GA4 - version_select", "version_select", [], [TR.version_select]);

const awct = (name, label, trig, orderId) => tag(name, "awct", [
  tpl("conversionId", "{{CONST - Google Ads ID}}"), tpl("conversionLabel", label), ...(orderId ? [tpl("orderId", orderId)] : []),
  tpl("currencyCode", "MXN"), bool("enableConversionLinker", true), bool("enableProductReporting", false),
  bool("enableNewCustomerReporting", false), bool("enableShippingData", false), bool("rdp", false),
  ...(orderId ? [bool("enableEnhancedConversion", true), tpl("cssProvidedEnhancedConversionValue", "{{UPD - Datos del lead}}")] : []),
], trig);
// Las conversiones de Ads solo se incluyen cuando ya existen sus IDs (evita etiquetas que fallen).
if (T.googleAds && T.adsLabelLead) awct("Google Ads - Conversión Lead formulario", "{{CONST - Ads label Lead}}", [TR.lead_submit], "{{DLV - event_id}}");
if (T.googleAds && T.adsLabelContacto) awct("Google Ads - Conversión Llamada / WhatsApp", "{{CONST - Ads label Contacto}}", [TR.click_call, TR.click_whatsapp]);

// Meta Pixel
tag("Meta - Pixel base (PageView)", "html", html(`<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{{CONST - Meta Pixel ID}}');
fbq('track', 'PageView');
</script>`), [ALL_PAGES], { priority: { type: "INTEGER", key: "priority", value: "10" } });
tag("Meta - Lead", "html", html(`<script>
(function () {
  if (!window.fbq) return;
  var am = {}, em = {{DLV - email}}, ph = {{DLV - telefono}}, fn = {{DLV - nombre}};
  if (em) am.em = em; if (ph) am.ph = ph.replace(/\\D/g, ''); if (fn) am.fn = fn.toLowerCase();
  fbq('init', '{{CONST - Meta Pixel ID}}', am); // coincidencia avanzada (el pixel cifra los datos)
  var p = { content_name: {{DLV - modelo}} || 'Sin modelo', content_category: {{DLV - interes}}, lead_quality: {{DLV - calidad}}, lead_source: {{DLV - origen}}, currency: 'MXN', value: 0 };
  fbq('track', 'Lead', p, { eventID: {{DLV - event_id}} });
  if ({{DLV - interes}} === 'prueba' || {{DLV - interes}} === 'servicio') fbq('track', 'Schedule', p, { eventID: {{DLV - event_id}} + '-s' });
})();
</script>`), [TR.lead_submit]);
tag("Meta - Contact (llamada / WhatsApp)", "html", html(`<script>
if (window.fbq) fbq('track', 'Contact', { content_name: {{Event}} === 'click_call' ? 'Llamada' : 'WhatsApp', content_category: {{DLV - cta}} });
</script>`), [TR.click_call, TR.click_whatsapp]);

const container = {
  exportFormatVersion: 2,
  exportTime: new Date().toISOString().replace("T", " ").slice(0, 19),
  containerVersion: {
    path: "accounts/0/containers/0/versions/0", ...A, containerVersionId: "0",
    container: { path: "accounts/0/containers/0", ...A, name: "Chevrolet Jebla Victoria", publicId: T.gtm || "GTM-XXXXXXX", usageContext: ["WEB"] },
    tag: tags, trigger: triggers, variable: variables,
    builtInVariable: [["PAGE_URL", "Page URL"], ["PAGE_HOSTNAME", "Page Hostname"], ["PAGE_PATH", "Page Path"], ["REFERRER", "Referrer"], ["EVENT", "Event"]]
      .map(([type, name]) => ({ ...A, type, name })),
  },
};
writeFileSync(new URL("./gtm-container.json", import.meta.url), JSON.stringify(container, null, 2));
const missing = ["gtm", "ga4", "googleAds", "adsLabelLead"].filter(k => !T[k]);
console.log(`Contenedor generado: ${tags.length} etiquetas, ${triggers.length} activadores, ${variables.length} variables.` +
  (missing.length ? `\nPENDIENTE en src/data.mjs → TRACKING: ${missing.join(", ")}` : ""));
