// Generador estático del sitio. Uso: node build.mjs  →  escribe /public
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { SITE, DEALER, MUNICIPIOS, INTERESES, MODELOS, PORTAFOLIO, CATEGORIAS, HERO_HOME, TIEMPOS, ENGANCHES, TRACKING } from "./src/data.mjs";

const OUT = "public";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
cpSync("src/assets", OUT + "/assets", { recursive: true });

// ---------- utilidades ----------
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const money = n => "$" + n.toLocaleString("en-US");
const img = (p, w) => SITE.cdn + encodeURI(p) + (w ? "?imwidth=" + w : "");
const telFmt = d => d.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
const wa = t => "https://wa.me/" + DEALER.whatsapp + "?text=" + encodeURIComponent(t);
const ic = (n, cls = "ic") => `<svg class="${cls}" aria-hidden="true"><use href="/assets/icons.svg#i-${n}"/></svg>`;
const abs = p => (SITE.url ? SITE.url.replace(/\/$/, "") + p : "");
const dir = DEALER.calle + ", " + DEALER.ciudad + ", " + DEALER.estado;
const pages = [];

// ---------- JSON-LD ----------
const dealerLD = () => ({
  "@context": "https://schema.org", "@type": "AutoDealer", name: DEALER.nombre, brand: "Chevrolet",
  telephone: "+52" + DEALER.telVentas, url: abs("/") || undefined, image: SITE.cdn + SITE.logo,
  address: { "@type": "PostalAddress", streetAddress: DEALER.calle, addressLocality: DEALER.ciudad, addressRegion: DEALER.estado, postalCode: DEALER.cp || undefined, addressCountry: "MX" },
  openingHours: DEALER.horarios.map(h => h.schema),
  areaServed: MUNICIPIOS.map(m => ({ "@type": "City", name: m + ", Tamaulipas" })),
});
const crumbsLD = items => ({ "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: abs(c[1]) || undefined })) });
const faqLD = faq => ({ "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });

// ---------- Google Tag Manager (GA4, Google Ads y Meta viven dentro del contenedor) ----------
// Eventos en dataLayer: cta_click, click_call, click_whatsapp, form_start, form_step, form_error, lead_submit, color_select, version_select, estimator_use, category_view
const G = TRACKING.gtm;
const gtmHead = G ? `
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${G}');</script>` : "";
const gtmBody = G ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${G}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : "";

// ---------- piezas comunes ----------
const NAV = [["/modelos/", "Modelos"], ["/promociones/", "Promociones"], ["/financiamiento/", "Financiamiento"], ["/seminuevos/", "Auto a cuenta"], ["/servicio/", "Servicio"], ["/contacto/", "Contacto"]];

function header(path) {
  return `<header class="topbar" id="top"><div class="wrap topbar__in">
<button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu"><span></span></button>
<a class="brand" href="/" aria-label="${esc(DEALER.nombre)}, inicio"><img class="brand__logo" src="${img(SITE.logo)}" alt="Chevrolet" width="88" height="31"><span class="brand__txt"><strong>${esc(DEALER.corto)}</strong><small>Ciudad Victoria · Distribuidor autorizado</small></span></a>
<nav class="nav" id="menu" aria-label="Principal">${NAV.map(([h, t]) => `<a href="${h}"${path.startsWith(h) ? ' aria-current="page"' : ""}>${t}</a>`).join("")}
<a class="nav__cta" href="/prueba-de-manejo/">Prueba de manejo</a></nav>
<div class="topbar__cta"><a class="btn btn--ghost btn--sm" data-call data-cta="header_call" href="tel:+52${DEALER.telVentas}" aria-label="Llamar a ventas">${ic("phone")}<span class="hide-sm">Llamar</span></a><a class="btn btn--primary btn--sm" data-cta="header_cotizar" href="#cotizar">Cotizar</a></div>
</div></header>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap footer__grid">
<div><p class="footer__brand"><strong>${esc(DEALER.nombre)}</strong><br>Distribuidor autorizado Chevrolet</p>
<p class="footer__info">${ic("pin")} ${esc(dir)}<br>${ic("phone")} Ventas <a href="tel:+52${DEALER.telVentas}" data-cta="footer_call">${telFmt(DEALER.telVentas)}</a> · Servicio <a href="tel:+52${DEALER.telServicio}">${telFmt(DEALER.telServicio)}</a><br>${ic("wa")} <a href="${wa("Hola, quiero información.")}" target="_blank" rel="noopener" data-cta="footer_whatsapp">WhatsApp ${telFmt(DEALER.whatsapp.slice(3))}</a></p></div>
<div><p class="footer__h">Modelos</p><ul>${MODELOS.map(m => `<li><a href="/modelos/${m.slug}/">${esc(m.corto)}</a></li>`).join("")}<li><a href="/modelos/">Ver todos</a></li></ul></div>
<div><p class="footer__h">Te ayudamos</p><ul>${[["/promociones/", "Promociones"], ["/financiamiento/", "Financiamiento"], ["/seminuevos/", "Auto a cuenta"], ["/prueba-de-manejo/", "Prueba de manejo"], ["/servicio/", "Cita de servicio"], ["/contacto/", "Contacto y ubicación"]].map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
</div><div class="wrap">
<p class="legal">*Precios sugeridos de venta al público de la versión de entrada; el precio dependerá de cada modelo y versión. Promociones sujetas a términos, condiciones y vigencia. GENERAL MOTORS DE MÉXICO, S. DE R.L. DE C.V. con domicilio en Avenida Ejército Nacional No. 843-B, Colonia Granada, Delegación Miguel Hidalgo, México, Ciudad de México, C.P. 11520. Consulte los Legales aplicables a la información publicada en este Sitio. Imágenes de carácter ilustrativo.</p>
<p class="legal"><a href="/aviso-de-privacidad/">Aviso de privacidad</a> · <a href="${DEALER.sitioOficial}" target="_blank" rel="noopener">Sitio oficial del distribuidor</a> · Actualizado: ${SITE.updated}</p>
</div></footer>
<div class="dock" id="dock" aria-label="Acciones rápidas"><a class="dock__btn" data-cta="dock_call" href="tel:+52${DEALER.telVentas}">${ic("phone")}Llamar</a><a class="dock__btn dock__btn--wa" data-wa data-cta="dock_whatsapp" href="${wa("Hola, quiero información.")}" target="_blank" rel="noopener">${ic("wa")}WhatsApp</a><a class="dock__btn dock__btn--main" data-cta="dock_cotizar" href="#cotizar">${ic("doc")}Cotizar</a></div>
<a class="fab" data-wa data-cta="fab_whatsapp" href="${wa("Hola, quiero información.")}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">${ic("wa")}</a>`;
}

function crumbs(items) {
  return `<nav class="crumbs wrap" aria-label="Ruta"><a href="/">Inicio</a>${items.map(([t, h], i) => i === items.length - 1 ? ` › <span aria-current="page">${esc(t)}</span>` : ` › <a href="${h}">${esc(t)}</a>`).join("")}</nav>`;
}

function page({ path, title, desc, body, ld = [], ogImage, data = {}, noindex = false }) {
  const robots = SITE.preview || noindex ? `<meta name="robots" content="noindex, nofollow">` : "";
  const canon = abs(path) ? `<link rel="canonical" href="${abs(path)}"><meta property="og:url" content="${abs(path)}">` : "";
  const html = `<!doctype html>
<html lang="es-MX"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">${robots}${canon}
<meta property="og:type" content="website"><meta property="og:locale" content="es_MX"><meta property="og:site_name" content="${esc(DEALER.nombre)}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">${ogImage ? `<meta property="og:image" content="${ogImage}">` : ""}
<meta name="twitter:card" content="summary_large_image"><meta name="theme-color" content="#1a1a1a">
<link rel="icon" href="${img(SITE.logo)}"><link rel="preconnect" href="${SITE.cdn}"><link rel="stylesheet" href="/assets/styles.css">
<script>window.dataLayer=window.dataLayer||[];</script>${gtmHead}
${[dealerLD(), ...ld].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join("")}
</head><body>${gtmBody}
<a class="skip" href="#cotizar">Ir al formulario</a>
${SITE.preview ? `<div class="pbar">VERSIÓN DE PRUEBA · No oficial</div>` : ""}
${header(path)}
<main>${body}</main>
${footer()}
<script id="page-data" type="application/json">${JSON.stringify({ wa: DEALER.whatsapp, ...data }).replace(/</g, "\\u003c")}</script>
<script src="/assets/site.js" defer></script>
</body></html>`;
  const file = path === "/404" ? OUT + "/404.html" : OUT + path + "index.html";
  mkdirSync(file.replace(/\/[^/]+$/, ""), { recursive: true });
  writeFileSync(file, html);
  if (path !== "/404" && !noindex) pages.push(path);
}

// ---------- formulario de leads ----------
const modelOpts = (sel = "") => `<option value="">Selecciona un modelo</option>${Object.entries(CATEGORIAS).map(([c, n]) => `<optgroup label="${n}">${PORTAFOLIO.filter(p => p.cat === c).map(p => `<option${p.nombre === sel ? " selected" : ""}>${esc(p.nombre)}</option>`).join("")}</optgroup>`).join("")}<option>Aún no lo decido</option>`;
const field = (lbl, inner, name, err) => `<label class="field"><span class="lbl">${lbl}</span>${inner}${err ? `<span class="err" data-for="${name}">${err}</span>` : ""}</label>`;
const chips = (name, items, sel) => `<div class="chips" role="radiogroup">${items.map(it => `<label class="chip"><input type="radio" name="${name}" value="${it.id}"${it.id === sel ? " checked" : ""}><span>${esc(it.label)}</span></label>`).join("")}</div>`;
// Opción única obligatoria (calificación del lead)
const choice = (name, lbl, items, err, stack) => `<p class="lbl" id="l-${name}">${lbl}</p><div class="chips${stack ? " chips--stack" : ""}" role="radiogroup" aria-labelledby="l-${name}">${items.map(it => `<label class="chip"><input type="radio" name="${name}" value="${esc(it.id)}" data-pts="${it.pts}" data-req="radio"><span>${esc(it.label)}</span></label>`).join("")}</div><span class="err" data-for="${name}">${err}</span>`;
const qualifyFields = choice("tiempo", "¿Cuándo piensas estrenar?", TIEMPOS, "Elige una opción") + choice("enganche", "Enganche estimado", ENGANCHES, "Elige una opción", true);
const modelField = `${field("Modelo de interés", `<select name="modelo" data-req="select">${modelOpts()}</select>`, "modelo", "Elige un modelo")}`;

const contactFields = `
${field("Nombre completo", `<input name="nombre" type="text" autocomplete="name" placeholder="Nombre y apellido" data-req="nombre">`, "nombre", "Escribe tu nombre completo")}
${field("WhatsApp", `<div class="tel"><span class="tel__pre">+52</span><input name="telefono" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="834 123 4567" data-req="telefono"></div>`, "telefono", "Escribe 10 dígitos")}
${field("Correo", `<input name="correo" type="email" autocomplete="email" inputmode="email" placeholder="tucorreo@ejemplo.com" data-req="email">`, "correo", "Revisa tu correo")}`;

/** opts: {title, sub, interes, origen, model, pickModel (selector de modelo), pre (campos extra al inicio del paso 1), qualify (default true), submit} */
function leadForm(o) {
  const step1 = (o.pickModel ? modelField : "") + (o.pre || "") + (o.qualify === false ? "" : qualifyFields);
  return `<div class="card form-card" id="formCard"><form class="lead-form" novalidate data-origen="${o.origen}" data-interes="${o.interes || "cotizacion"}"${o.model ? ` data-modelo="${esc(o.model)}"` : ""}>
<input type="hidden" name="version"><input type="hidden" name="color">
<div class="form-head"><h2 class="h3" data-title>${esc(o.title)}</h2><p class="form-head__sub">${esc(o.sub || "Paso 1 de 2 · Toma menos de 1 minuto")}</p><div class="progress" aria-hidden="true"><span></span></div></div>
<fieldset class="step is-active" data-step="1"><legend class="sr-only">Paso 1 de 2</legend>${step1}<button type="button" class="btn btn--primary btn--block btn--lg" data-next>Continuar ${ic("arrow")}</button></fieldset>
<fieldset class="step" data-step="2"><legend class="sr-only">Paso 2 de 2: tus datos</legend>
<button type="button" class="back" data-back>${ic("back")} <span data-summary>Volver</span></button>
${contactFields}
<button type="submit" class="btn btn--primary btn--block btn--lg" data-submit>${esc(o.submit || "Recibir mi cotización")}</button>
<p class="consent-line">Al enviar aceptas el <a href="/aviso-de-privacidad/" target="_blank">aviso de privacidad</a> y que ${esc(DEALER.corto)} te contacte. ${ic("lock")}</p></fieldset>
</form></div>`;
}

// ---------- secciones reutilizables ----------
const waBand = (t, p, msg) => `<section class="waband"><div class="wrap waband__in"><div><h2 class="h2">${t}</h2><p>${p}</p></div><a class="btn btn--wa btn--lg" data-cta="band_whatsapp" href="${wa(msg)}" target="_blank" rel="noopener">${ic("wa")} Escribir por WhatsApp</a></div></section>`;

const visit = (h = "Visítanos en Ciudad Victoria") => `<section class="visit" id="visitanos"><div class="wrap visit__grid"><div>
<h2 class="h2">${h}</h2><ul class="info"><li>${ic("pin")}<span>${esc(dir)}</span></li><li>${ic("clock")}<span>${DEALER.horarios.map(x => x.dias + ": " + x.horas).join("<br>")}</span></li><li>${ic("phone")}<span>Ventas: <a href="tel:+52${DEALER.telVentas}" data-cta="visit_call">${telFmt(DEALER.telVentas)}</a><br>Servicio: <a href="tel:+52${DEALER.telServicio}">${telFmt(DEALER.telServicio)}</a></span></li></ul>
<div class="visit__btns"><a class="btn btn--primary" href="${DEALER.maps}" target="_blank" rel="noopener" data-cta="visit_maps">${ic("pin")} Cómo llegar</a><a class="btn btn--ghost" href="/prueba-de-manejo/" data-cta="visit_prueba">${ic("wheel")} Prueba de manejo</a></div></div>
<div class="coverage card"><h3 class="h3">Atendemos toda la región</h3><p>Clientes de estos municipios nos visitan o reciben atención por WhatsApp:</p><ul class="pills">${MUNICIPIOS.map(m => `<li>${m}</li>`).join("")}</ul></div></div></section>`;

const faqSec = (faq, h = "Preguntas frecuentes") => `<section class="faq"><div class="wrap"><h2 class="h2">${h}</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>`;

const leadSection = (copyHtml, formHtml) => `<section class="lead" id="cotizar"><div class="wrap lead__grid"><div class="lead__copy">${copyHtml}</div>${formHtml}</div></section>`;

const checks = list => `<ul class="checks">${list.map(x => `<li>${x}</li>`).join("")}</ul>`;
const trust = `<div class="trust"><span class="trust__item">${ic("shield")}Distribuidor autorizado</span><span class="trust__item">${ic("bolt")}Distribuidor eléctrico</span><span class="trust__item">${ic("wrench")}Servicio certificado</span></div>`;

const modelCard = m => {
  const pg = MODELOS.find(x => x.slug === m.slug);
  return `<article class="mcard"><a class="mcard__img" href="${pg ? `/modelos/${m.slug}/` : "#cotizar"}"${pg ? "" : ` data-pick="${esc(m.nombre)}"`}><img src="${img(m.img, 600)}" alt="Chevrolet ${esc(m.nombre)}" loading="lazy" width="640" height="320"></a>
<div class="mcard__body"><h3 class="mcard__name">${esc(m.nombre)}</h3><p class="mcard__price">Desde <strong>${money(m.precio)}*</strong></p>
<div class="mcard__btns">${pg ? `<a class="btn btn--primary" href="/modelos/${m.slug}/" data-cta="card_ver">Ver modelo</a>` : `<button class="btn btn--primary" data-pick="${esc(m.nombre)}" data-cta="card_cotizar">Cotizar</button>`}<a class="btn btn--ghost btn--icon" href="${wa("Hola, me interesa el Chevrolet " + m.nombre + ". ¿Me dan precio y promociones?")}" target="_blank" rel="noopener" aria-label="Preguntar por ${esc(m.nombre)} en WhatsApp" data-cta="card_whatsapp">${ic("wa")}</a></div></div></article>`;
};
const catalog = (only) => `<div class="tabs" role="tablist" data-tabs>${Object.entries(CATEGORIAS).map(([c, n], i) => `<button class="tab" role="tab" data-cat="${c}" aria-selected="${c === "suvs"}">${n}</button>`).join("")}</div>
${Object.keys(CATEGORIAS).map(c => `<div class="rail" data-panel="${c}"${c === "suvs" ? "" : " hidden"}>${PORTAFOLIO.filter(p => p.cat === c && (!only || p.slug)).map(modelCard).join("")}</div>`).join("")}`;

// =========================================================
// PÁGINAS
// =========================================================

// ---------- INICIO ----------
page({
  path: "/", title: "Chevrolet Jebla Ciudad Victoria | Distribuidor Autorizado · Cotiza tu Chevrolet",
  desc: "Cotiza tu Chevrolet nuevo en Ciudad Victoria, Tamaulipas. Precios, promociones, prueba de manejo, financiamiento y auto a cuenta con Chevrolet Jebla, distribuidor autorizado.",
  ogImage: img(HERO_HOME[0].dsk, 1200),
  body: `<section class="hero" aria-label="Promociones del mes"><div class="hero__track" data-carousel tabindex="0">${HERO_HOME.map((h, i) => `<div class="slide" role="group" aria-label="${i + 1} de ${HERO_HOME.length}: ${h.modelo}"><a href="/modelos/${h.slug}/"><picture><source media="(min-width:600px)" srcset="${img(h.dsk, 1200)} 1280w, ${img(h.dsk, 1920)} 2048w" sizes="100vw" width="2048" height="819"><img src="${img(h.mob, 600)}" alt="Chevrolet ${h.modelo}, promoción de octubre" width="640" height="640"${i ? ' loading="lazy"' : ' fetchpriority="high"'}></picture></a><div class="slide__cta"><a class="btn btn--primary btn--lg" href="/modelos/${h.slug}/#cotizar" data-cta="hero_${i}">Cotizar ${h.modelo}</a></div></div>`).join("")}</div><div class="hero__dots" data-dots></div></section>
${leadSection(`<p class="eyebrow">Ciudad Victoria y municipios de la región</p><h1 class="h1">Estrena tu Chevrolet con el precio y el plan que te conviene</h1>${checks(["Cotización por WhatsApp en minutos, sin compromiso", "Prueba de manejo a tu horario", "Financiamiento y opción de dejar tu auto a cuenta"])}${trust}`,
    leadForm({ title: "Cotiza tu Chevrolet", origen: "inicio", pickModel: true }))}
<section class="models" id="modelos"><div class="wrap"><div class="sec-head"><h2 class="h2">Elige tu Chevrolet</h2><p>Precios desde, en Ciudad Victoria.</p></div>${catalog()}<p class="fine">*Precios sugeridos de venta al público de la versión de entrada.</p><p><a class="link-more" href="/modelos/">Ver catálogo completo →</a></p></div></section>
<section class="shortcuts"><div class="wrap"><div class="sec-head"><h2 class="h2">¿Cómo te ayudamos hoy?</h2></div><div class="tiles">
${[["/financiamiento/", "card", "Financiamiento", "Calcula tu enganche y recibe tu plan"], ["/prueba-de-manejo/", "wheel", "Prueba de manejo", "Agenda el día y la hora que prefieras"], ["/seminuevos/", "swap", "Auto a cuenta", "Valuamos tu auto para tu siguiente Chevrolet"], ["/servicio/", "wrench", "Cita de servicio", "Servicio certificado Chevrolet"]].map(([h, i, t, d]) => `<a class="tile" href="${h}" data-cta="tile_${h.replace(/\//g, "")}">${ic(i, "ic ic--lg")}<strong>${t}</strong><span>${d}</span></a>`).join("")}
</div></div></section>
${waBand("¿Prefieres hablar con un asesor?", "Te respondemos por WhatsApp con precios, inventario y promociones vigentes.", "Hola, vi su página de Chevrolet Jebla Ciudad Victoria y quiero información.")}
${visit()}
${faqSec(FAQ_GEN())}`,
  ld: [faqLD(FAQ_GEN())],
});
function FAQ_GEN() {
  return [["¿Cotizar tiene algún costo o compromiso?", "No. La cotización es gratuita y sin compromiso. Un asesor te comparte precio, versiones y promociones vigentes."],
    ["¿Puedo dejar mi auto actual a cuenta?", "Sí. Valuamos tu auto y aplicamos su valor a tu nuevo Chevrolet."],
    ["¿Atienden si vivo fuera de Ciudad Victoria?", "Sí. Atendemos a clientes de toda la región por WhatsApp y teléfono, y coordinamos tu visita o prueba de manejo."],
    ["¿Cuánto tardan en responder?", "Respondemos en horario de atención; normalmente el mismo día."]];
}

// ---------- CATÁLOGO ----------
page({
  path: "/modelos/", title: "Autos, SUVs, Pickups y Eléctricos Chevrolet 2026 en Ciudad Victoria | Chevrolet Jebla",
  desc: "Catálogo Chevrolet 2026 con precios desde en Ciudad Victoria: Aveo, Onix, Groove, Captiva, Tracker, Trax, pickups y eléctricos. Cotiza con Chevrolet Jebla.",
  ld: [crumbsLD([["Inicio", "/"], ["Modelos", "/modelos/"]])],
  body: `${crumbs([["Modelos", "/modelos/"]])}
<section class="phead"><div class="wrap"><h1 class="h1">Catálogo Chevrolet en Ciudad Victoria</h1><p>Compara precios desde y elige el que va contigo. Toca un modelo para ver colores, versiones y cotizar.</p></div></section>
<section class="models models--page"><div class="wrap">${catalog()}<p class="fine">*Precios sugeridos de venta al público de la versión de entrada, publicados por la marca. Consulta precio por versión con tu asesor.</p></div></section>
${leadSection(`<h2 class="h1">¿No sabes cuál elegir?</h2>${checks(["Cuéntanos qué buscas y te recomendamos", "Comparativa de versiones por WhatsApp", "Te decimos qué tenemos en inventario hoy"])}`, leadForm({ title: "Te ayudamos a elegir", origen: "catalogo", pickModel: true }))}`,
});

// ---------- PÁGINAS DE MODELO ----------
for (const m of MODELOS) {
  const path = `/modelos/${m.slug}/`;
  const faq = [[`¿Cuánto cuesta el Chevrolet ${m.nombre} en Ciudad Victoria?`, `El precio sugerido desde es de ${money(m.precio)}* en su versión de entrada. Pide el precio de la versión que te interesa y las promociones vigentes por WhatsApp o en el formulario.`],
    [`¿Puedo hacer una prueba de manejo del ${m.corto}?`, "Sí. Agenda el día y la hora que prefieras y te esperamos en la agencia en Ciudad Victoria."],
    ["¿Puedo dejar mi auto actual a cuenta?", `Sí. Valuamos tu auto y aplicamos su valor a tu ${m.corto}.`],
    [`¿Tienen ${m.corto} en inventario?`, "Escríbenos por WhatsApp y te confirmamos versiones y colores disponibles hoy en la agencia."]];
  const productLD = { "@context": "https://schema.org", "@type": "Car", name: "Chevrolet " + m.nombre, brand: { "@type": "Brand", name: "Chevrolet" }, model: m.corto, description: m.seo, image: img(m.hero.dsk, 1200), color: m.colores.map(c => c[0]),
    offers: { "@type": "Offer", price: m.precio, priceCurrency: "MXN", availability: "https://schema.org/InStock", seller: { "@type": "AutoDealer", name: DEALER.nombre }, url: abs(path) || undefined } };
  page({
    path, title: `Chevrolet ${m.nombre} en Ciudad Victoria | Desde ${money(m.precio)} · Chevrolet Jebla`, desc: m.seo, ogImage: img(m.hero.dsk, 1200),
    data: { modelo: m.nombre, precio: m.precio, colores: m.colores.map(c => ({ n: c[0], img: img(c[2], 1200) })) },
    ld: [productLD, crumbsLD([["Inicio", "/"], ["Modelos", "/modelos/"], [m.corto, path]]), faqLD(faq)],
    body: `<section class="mhero" aria-labelledby="mh1"><div class="wrap mhero__grid">
<div class="mhero__text"><p class="eyebrow eyebrow--light">${esc(m.lema)}</p><h1 class="mhero__title" id="mh1">Chevrolet ${esc(m.nombre)} <span class="mhero__city">en Ciudad Victoria</span></h1><p class="mhero__price">Desde <strong>${money(m.precio)}</strong><sup>*</sup></p>
${m.promo.length ? `<ul class="promo" aria-label="Promoción vigente">${m.promo.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}</div>
<picture class="mhero__media"><source media="(min-width:600px)" srcset="${img(m.hero.dsk, 1200)} 1280w, ${img(m.hero.dsk, 1920)} 2048w" sizes="(min-width:960px) 60vw, 100vw"><img src="${img(m.hero.mob, 600)}" srcset="${img(m.hero.mob, 600)} 640w, ${img(m.hero.mob, 1000)} 1000w" sizes="100vw" alt="Chevrolet ${esc(m.nombre)}" fetchpriority="high" width="${m.hero.mw}" height="${m.hero.mh}" style="--pos:${m.hero.pos || "75%"}"></picture>
<div class="mhero__btns"><a class="btn btn--primary btn--lg" href="#cotizar" data-cta="hero_cotizar">Cotizar mi ${esc(m.corto)}</a><a class="btn btn--wa btn--lg" href="${wa("Hola, me interesa el Chevrolet " + m.nombre + ". ¿Me dan precio, versiones y promoción del mes?")}" target="_blank" rel="noopener" data-cta="hero_whatsapp" data-wa aria-label="WhatsApp">${ic("wa")}<span class="hide-xs">WhatsApp</span></a></div>
</div></section>
${crumbs([["Modelos", "/modelos/"], [m.corto, path]])}
${leadSection(`<h2 class="h1">${esc(m.lema)} Estrena tu ${esc(m.corto)} con un plan a tu medida</h2><p class="lead__intro">${esc(m.intro)}</p>${checks(["Precio de la versión que elijas, por WhatsApp", "Prueba de manejo a tu horario", "Financiamiento y opción de dejar tu auto a cuenta"])}${trust}`,
      leadForm({ title: "Cotiza tu " + m.corto, origen: "modelo-" + m.slug, model: m.nombre }))}
<section class="feats"><div class="wrap"><h2 class="h2">Lo que más te va a gustar</h2><div class="feats__grid">${m.destacados.map(d => `<div class="feat">${ic(d[0])}<strong>${esc(d[1])}</strong><span>${esc(d[2])}</span></div>`).join("")}</div></div></section>
<section class="colors" id="colores"><div class="wrap"><div class="sec-head"><h2 class="h2">Elige tu color</h2><p>Toca un color para verlo y cotizarlo así.</p></div>
<div class="colors__stage"><img data-color-img src="${img(m.colores[0][2], 1200)}" alt="${esc(m.corto)} en ${esc(m.colores[0][0])}" width="1024" height="512" loading="lazy"></div><p class="colors__name" data-color-name>${esc(m.colores[0][0])}</p>
<div class="swatches" data-colorizer role="radiogroup">${m.colores.map((c, i) => `<button type="button" class="swatch" style="--c:${c[1]}" data-i="${i}" aria-label="${esc(c[0])}" aria-pressed="${i === 0}"></button>`).join("")}</div>
<a class="btn btn--primary btn--lg colors__cta" href="#cotizar" data-color-cta data-cta="color_cotizar">Cotizar en ${esc(m.colores[0][0])}</a></div></section>
${m.versiones ? `<section class="versions" id="versiones"><div class="wrap"><div class="sec-head"><h2 class="h2">Versiones</h2><p>Elige la tuya y te enviamos su precio y la promoción vigente.</p></div><div class="vcards">${m.versiones.map(v => `<article class="vcard">${v.tag ? `<span class="vcard__tag">${esc(v.tag)}</span>` : ""}<h3>${esc(v.nombre)}</h3><p class="vcard__trans">${esc(v.trans)}</p><button class="btn btn--primary btn--block" data-version="${esc(v.nombre + " " + v.trans)}" data-cta="version_${v.id}">Pedir precio de ${esc(v.nombre)}</button></article>`).join("")}</div></div></section>` : ""}
<section class="calc" id="calcula"><div class="wrap calc__grid"><div><h2 class="h2">Calcula tu enganche</h2><p class="calc__lead">Mueve la barra y te enviamos el plan de mensualidades exacto para tu caso.</p></div>
<div class="card" data-calc data-precio="${m.precio}"><label class="lbl">Enganche: <strong data-pct>20%</strong><input type="range" min="10" max="60" step="5" value="20" data-range></label><p class="lbl">Plazo</p><div class="chips">${[24, 36, 48, 60].map(p => `<label class="chip"><input type="radio" name="plazo-${m.slug}" value="${p}"${p === 48 ? " checked" : ""}><span>${p} meses</span></label>`).join("")}</div>
<dl class="calc__out"><div><dt>Precio desde</dt><dd>${money(m.precio)}</dd></div><div><dt>Tu enganche</dt><dd data-eng></dd></div><div class="calc__main"><dt>Monto a financiar</dt><dd data-fin></dd></div></dl>
<a class="btn btn--primary btn--block btn--lg" href="#cotizar" data-calc-cta data-cta="calc_cotizar">Recibir mi plan de mensualidades</a><p class="fine">Cálculo ilustrativo sobre el precio desde. La mensualidad depende de la versión, la institución financiera y la aprobación de crédito.</p></div></div></section>
<section class="gallery"><div class="wrap"><h2 class="h2">Galería</h2></div><div class="gallery__rail">${m.galeria.map((g, i) => `<img src="${img(g, 1200)}" alt="Chevrolet ${esc(m.corto)}, foto ${i + 1}" loading="lazy" width="1200" height="600">`).join("")}</div></section>
${m.specs ? `<section class="specs"><div class="wrap"><h2 class="h2">Especificaciones</h2><dl class="specs__list">${m.specs.map(s => `<div><dt>${esc(s[0])}</dt><dd>${esc(s[1])}</dd></div>`).join("")}</dl><p class="fine"><a href="${img(m.ficha)}" target="_blank" rel="noopener" data-cta="ficha_tecnica">Ver ficha técnica completa (PDF)</a></p></div></section>` : `<section class="specs"><div class="wrap"><p class="fine"><a href="${img(m.ficha)}" target="_blank" rel="noopener" data-cta="ficha_tecnica">Ver ficha técnica completa del ${esc(m.corto)} (PDF)</a></p></div></section>`}
${waBand(`¿Tienes dudas del ${esc(m.corto)}?`, "Pregúntanos por versiones, colores en inventario y la promoción del mes.", "Hola, me interesa el Chevrolet " + m.nombre + ". ¿Me dan precio, versiones y promoción del mes?")}
${faqSec(faq)}
<section class="related"><div class="wrap"><h2 class="h2">También te puede interesar</h2><div class="rail">${PORTAFOLIO.filter(p => p.slug && p.slug !== m.slug && (p.cat === m.cat || true)).slice(0, 4).map(modelCard).join("")}</div></div></section>
${visit("Pruébalo en Ciudad Victoria")}
${m.promo.length ? `<div class="wrap"><p class="legal">${esc(m.promoLegal)}</p></div>` : ""}`,
  });
}

// ---------- 404 y gracias (sin indexar) ----------
page({ path: "/gracias/", noindex: true, title: "¡Gracias! Recibimos tu solicitud | Chevrolet Jebla", desc: "Recibimos tu solicitud. Un asesor de Chevrolet Jebla te contactará pronto.",
  body: `<section class="phead phead--center" data-thanks><div class="wrap"><div class="success__icon">${ic("check")}</div><h1 class="h1">¡Listo<span data-ty-name></span>!</h1>
<p>Recibimos tu solicitud<span data-ty-what></span>. Un asesor te contactará en horario de atención.</p><p class="folio">Folio: <strong data-ty-folio>—</strong></p>
<p class="btnrow"><a class="btn btn--wa btn--lg" data-ty-wa data-cta="thanks_whatsapp" href="${wa("Hola, acabo de dejar mis datos en su página.")}" target="_blank" rel="noopener">${ic("wa")} Adelantar por WhatsApp</a></p></div></section>
<section class="sec sec--alt"><div class="wrap"><h2 class="h2">¿Qué sigue?</h2><ol class="steps"><li><strong>Te contactamos</strong><span>Por WhatsApp o llamada, como lo elegiste.</span></li><li><strong>Resolvemos tus dudas</strong><span>Precio de tu versión, colores en inventario y promociones vigentes.</span></li><li><strong>Te esperamos en la agencia</strong><span>Para tu prueba de manejo o para cerrar tu trato.</span></li></ol>
<p class="btnrow"><a class="btn btn--ghost" href="/modelos/">Seguir viendo modelos</a> <a class="btn btn--ghost" href="/financiamiento/">Calcular mi enganche</a></p></div></section>` });
page({ path: "/404", noindex: true, title: "Página no encontrada | Chevrolet Jebla", desc: "La página que buscas no existe.",
  body: `<section class="phead phead--center"><div class="wrap"><h1 class="h1">No encontramos esta página</h1><p>Puede que el enlace haya cambiado. Te dejamos lo más buscado:</p><p class="btnrow"><a class="btn btn--primary" href="/modelos/">Ver modelos</a> <a class="btn btn--ghost" href="/">Ir al inicio</a></p></div></section>` });

if (existsSync("src/secciones.mjs")) (await import("./src/secciones.mjs")).buildSecciones({ page, leadForm, leadSection, field, chips, checks, trust, crumbs, crumbsLD, faqLD, faqSec, visit, waBand, modelOpts, ic, img, money, wa, telFmt, esc, dir });

// ---------- sitemap y robots ----------
writeFileSync(OUT + "/robots.txt", SITE.preview ? "User-agent: *\nDisallow: /\n" : `User-agent: *\nAllow: /\n${SITE.url ? "Sitemap: " + abs("/sitemap.xml") + "\n" : ""}`);
if (SITE.url) writeFileSync(OUT + "/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p => `<url><loc>${abs(p)}</loc></url>`).join("\n")}\n</urlset>\n`);
console.log("Páginas generadas:", pages.length + 1, pages.join(" "));
