// Secciones secundarias del sitio. Las llama build.mjs con sus utilidades.
import { DEALER, MODELOS, PORTAFOLIO } from "./data.mjs";

export function buildSecciones(h) {
  const { page, leadForm, leadSection, field, chips, checks, trust, crumbs, crumbsLD, faqLD, faqSec, visit, waBand, modelOpts, ic, img, money, wa, telFmt, esc, dir } = h;
  const head = (t, p) => `<section class="phead"><div class="wrap"><h1 class="h1">${t}</h1><p>${p}</p></div></section>`;
  const steps = list => `<ol class="steps">${list.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join("")}</ol>`;
  const years = `<option value="">Año</option>${Array.from({ length: 18 }, (_, i) => 2026 - i).map(y => `<option>${y}</option>`).join("")}<option>Anterior a 2009</option>`;
  const LD = (name, path, faq) => [crumbsLD([["Inicio", "/"], [name, path]]), ...(faq ? [faqLD(faq)] : [])];

  // ---------- PROMOCIONES ----------
  const conPromo = MODELOS.filter(m => m.promo.length);
  const faqP = [["¿Las promociones aplican a todas las versiones?", "Depende de cada promoción. Tu asesor te confirma qué aplica a la versión y forma de pago que elijas."],
    ["¿Hasta cuándo son válidas?", "Las promociones tienen vigencia mensual y están sujetas a términos y condiciones de la marca."],
    ["¿Puedo combinar la promoción con mi auto a cuenta?", "En muchos casos sí; pregúntanos y lo revisamos para tu caso."]];
  page({
    path: "/promociones/", title: "Promociones Chevrolet en Ciudad Victoria | Meses sin intereses · Chevrolet Jebla",
    desc: "Promociones Chevrolet vigentes en Ciudad Victoria: meses sin intereses, seguro gratis y bonos por tu auto a cuenta en Aveo, Captiva, Tracker y más.",
    ld: LD("Promociones", "/promociones/", faqP),
    body: `${crumbs([["Promociones", "/promociones/"]])}
${head("Promociones Chevrolet en Ciudad Victoria", "Ofertas vigentes de la marca para este mes. Pide la tuya y te confirmamos qué aplica a la versión que elijas.")}
<section class="sec"><div class="wrap"><div class="promo-cards">${conPromo.map(m => {
      const p = PORTAFOLIO.find(x => x.slug === m.slug);
      return `<article class="pcard"><a href="/modelos/${m.slug}/"><img src="${img(p.img, 600)}" alt="Chevrolet ${esc(m.nombre)}" loading="lazy" width="320" height="160"></a><div><h3>${esc(m.nombre)}</h3><p class="mcard__price">Desde <strong>${money(m.precio)}*</strong></p><ul>${m.promo.map(x => `<li>${esc(x)}</li>`).join("")}</ul><a class="btn btn--primary" href="/modelos/${m.slug}/#cotizar" data-cta="promo_${m.slug}">Quiero esta promoción</a></div></article>`;
    }).join("")}</div>
<p class="legal">*Promociones publicadas por la marca para octubre de 2026, sujetas a términos, condiciones, vigencia y aprobación de crédito. Consulta en chevrolet.com.mx o con tu asesor.</p></div></section>
${leadSection(`<h2 class="h1">¿Buscas promoción para otro modelo?</h2>${checks(["Te decimos qué promociones aplican hoy", "Comparamos contado vs. financiamiento", "Sumamos el valor de tu auto a cuenta"])}`, leadForm({ title: "Pide tu promoción", origen: "promociones", pickModel: true }))}
${faqSec(faqP)}`,
  });

  // ---------- FINANCIAMIENTO ----------
  const faqF = [["¿Cuánto enganche necesito?", "Depende del plan y la institución financiera. Con la calculadora puedes ver el monto a financiar; tu asesor te comparte las opciones de enganche disponibles."],
    ["¿Puedo usar mi auto como enganche?", "Sí. Valuamos tu auto y su valor puede contar como parte del enganche."],
    ["¿En cuánto tiempo me dan respuesta?", "Depende de la institución financiera. Tu asesor te acompaña en todo el proceso."]];
  page({
    path: "/financiamiento/", title: "Financiamiento de autos Chevrolet en Ciudad Victoria | Calcula tu enganche · Chevrolet Jebla",
    desc: "Calcula tu enganche y recibe tu plan de mensualidades para tu Chevrolet en Ciudad Victoria. Usa tu auto como enganche. Chevrolet Jebla, distribuidor autorizado.",
    ld: LD("Financiamiento", "/financiamiento/", faqF),
    body: `${crumbs([["Financiamiento", "/financiamiento/"]])}
${head("Financiamiento para tu Chevrolet", "Calcula tu enganche en segundos y te enviamos el plan de mensualidades exacto para tu caso.")}
<section class="calc"><div class="wrap calc__grid"><div><h2 class="h2">Calcula tu enganche</h2><p class="calc__lead">Elige el modelo, mueve la barra y pide tu plan.</p>${steps([["Calcula", "Elige modelo, enganche y plazo."], ["Recibe tu plan", "Te enviamos opciones de mensualidad por WhatsApp."], ["Estrena", "Integramos tu solicitud y te acompañamos hasta la entrega."]])}</div>
<div class="card" data-calc data-precio="${MODELOS[0].precio}">${field("Modelo", `<select data-calc-model>${PORTAFOLIO.map(p => `<option value="${p.precio}">${esc(p.nombre)}</option>`).join("")}</select>`)}
<label class="lbl">Enganche: <strong data-pct>20%</strong><input type="range" min="10" max="60" step="5" value="20" data-range></label><p class="lbl">Plazo</p><div class="chips">${[24, 36, 48, 60].map(p => `<label class="chip"><input type="radio" name="plazo" value="${p}"${p === 48 ? " checked" : ""}><span>${p} meses</span></label>`).join("")}</div>
<dl class="calc__out"><div><dt>Precio desde</dt><dd data-price></dd></div><div><dt>Tu enganche</dt><dd data-eng></dd></div><div class="calc__main"><dt>Monto a financiar</dt><dd data-fin></dd></div></dl>
<a class="btn btn--primary btn--block btn--lg" href="#cotizar" data-calc-cta data-cta="calc_cotizar">Recibir mi plan de mensualidades</a><p class="fine">Cálculo ilustrativo sobre el precio desde. La mensualidad depende de la versión, la institución financiera y la aprobación de crédito.</p></div></div></section>
<section class="sec sec--alt"><div class="wrap grid2"><div><h2 class="h2">Documentos que normalmente se piden</h2><ul class="doclist"><li>Identificación oficial vigente</li><li>Comprobante de domicilio reciente</li><li>Comprobantes de ingresos</li></ul><p class="fine">Los requisitos exactos dependen de la institución financiera y del plan. Tu asesor te confirma la lista.</p></div>
<div><h2 class="h2">¿Tienes auto?</h2><p>Puedes usarlo como parte de tu enganche. <a href="/seminuevos/">Valúalo aquí</a>.</p></div></div></section>
${leadSection(`<h2 class="h1">Recibe tu plan de mensualidades</h2>${checks(["Opciones de plazo y enganche para tu caso", "Te ayudamos a integrar tu solicitud", "Sin compromiso"])}`, leadForm({ title: "Recibe tu plan", origen: "financiamiento", interes: "financiamiento", submit: "Recibir mi plan", pickModel: true }))}
${faqSec(faqF)}`,
  });

  // ---------- AUTO A CUENTA / SEMINUEVOS ----------
  const faqS = [["¿Qué autos reciben a cuenta?", "Recibimos autos de cualquier marca. El valor depende del año, kilometraje y estado del vehículo."],
    ["¿La valuación tiene costo?", "No. La valuación es gratuita y sin compromiso."],
    ["¿Qué necesito llevar?", "Tu auto, la factura o documento de propiedad y una identificación oficial. Tu asesor te confirma los detalles."]];
  const preS = field("Tu auto actual", `<input name="auto_actual" type="text" placeholder="Marca, modelo y año (ej. Versa 2018)" data-req="text">`, "auto_actual", "Escribe la marca, modelo y año");
  page({
    path: "/seminuevos/", title: "Deja tu auto a cuenta en Ciudad Victoria | Valuación gratis · Chevrolet Jebla",
    desc: "Valuamos tu auto gratis y lo tomamos a cuenta de tu nuevo Chevrolet en Ciudad Victoria. Cualquier marca. Chevrolet Jebla, distribuidor autorizado.",
    ld: LD("Auto a cuenta", "/seminuevos/", faqS),
    body: `${crumbs([["Auto a cuenta", "/seminuevos/"]])}
${leadSection(`<p class="eyebrow">Valuación gratis</p><h1 class="h1">Deja tu auto a cuenta de tu nuevo Chevrolet</h1>${checks(["Recibimos autos de cualquier marca", "Valuación gratuita y sin compromiso", "Su valor puede contar como parte de tu enganche"])}${steps([["Cuéntanos de tu auto", "Marca, modelo y año."], ["Recibe una valuación", "Te contactamos para revisarlo."], ["Estrena", "Aplicamos su valor a tu nuevo Chevrolet."]])}`,
      leadForm({ title: "Valúa tu auto", origen: "seminuevos", interes: "seminuevos", submit: "Recibir mi valuación", pickModel: true, pre: preS }))}
${waBand("¿Prefieres mandar fotos de tu auto?", "Escríbenos por WhatsApp y envía fotos para darte una idea de su valor.", "Hola, quiero dejar mi auto a cuenta de un Chevrolet nuevo. Les comparto fotos.")}
${faqSec(faqS)}`,
  });

  // ---------- SERVICIO ----------
  const servicios = ["Mantenimiento", "Revisión general", "Frenos", "Diagnóstico", "Otro"].map(s => ({ id: s, label: s }));
  const step1V = `<div class="row2">${field("Modelo de tu Chevrolet", `<input name="auto_actual" type="text" placeholder="Ej. Aveo" data-req="text">`, "auto_actual", "Escribe el modelo")}${field("Año", `<select name="anio" data-req="select">${years}</select>`, "anio", "Elige el año")}</div>
<p class="lbl">Tipo de servicio</p>${chips("servicio", servicios, "Mantenimiento")}
${field("Fecha preferida", `<input name="fecha_pref" type="date" data-req="text">`, "fecha_pref", "Elige una fecha")}`;
  const faqV = [["¿Por qué hacer el servicio en agencia?", "Técnicos certificados por Chevrolet, refacciones originales y procedimientos de la marca."],
    ["¿Cuánto dura un servicio?", "Depende del tipo de servicio. Al agendar te damos un tiempo estimado."]];
  page({
    path: "/servicio/", title: "Cita de servicio Chevrolet en Ciudad Victoria | Servicio certificado · Chevrolet Jebla",
    desc: "Agenda tu cita de servicio Chevrolet en Ciudad Victoria: mantenimiento, frenos y diagnóstico con técnicos certificados y refacciones originales.",
    ld: LD("Servicio", "/servicio/", faqV),
    body: `${crumbs([["Servicio", "/servicio/"]])}
${leadSection(`<p class="eyebrow">Servicio certificado Chevrolet</p><h1 class="h1">Agenda tu cita de servicio</h1>${checks(["Técnicos certificados por Chevrolet", "Refacciones originales", "Te confirmamos la cita por WhatsApp"])}<p>¿Prefieres llamar? Servicio: <a href="tel:+52${DEALER.telServicio}" data-cta="servicio_call"><strong>${telFmt(DEALER.telServicio)}</strong></a></p>`,
      leadForm({ title: "Agenda tu cita", origen: "servicio", interes: "servicio", submit: "Solicitar mi cita", pre: step1V, qualify: false }))}
${faqSec(faqV)}
${visit("Te esperamos en el taller")}`,
  });

  // ---------- PRUEBA DE MANEJO ----------
  page({
    path: "/prueba-de-manejo/", title: "Prueba de manejo Chevrolet en Ciudad Victoria | Agenda hoy · Chevrolet Jebla",
    desc: "Agenda tu prueba de manejo Chevrolet en Ciudad Victoria: Aveo, Onix, Groove, Captiva, Tracker, Trax y más. Elige día y horario.",
    ld: LD("Prueba de manejo", "/prueba-de-manejo/"),
    body: `${crumbs([["Prueba de manejo", "/prueba-de-manejo/"]])}
${leadSection(`<p class="eyebrow">Sin compromiso</p><h1 class="h1">Maneja hoy el Chevrolet que quieres</h1>${checks(["Elige el modelo que quieres manejar", "Acordamos día y hora por WhatsApp", "Resolvemos tus dudas de versiones y precio en la agencia"])}${trust}`,
      leadForm({ title: "Agenda tu prueba de manejo", origen: "prueba-de-manejo", interes: "prueba", submit: "Agendar mi prueba", pickModel: true }))}
${visit("Te esperamos en Ciudad Victoria")}`,
  });

  // ---------- CONTACTO ----------
  page({
    path: "/contacto/", title: "Contacto y ubicación | Chevrolet Jebla Ciudad Victoria",
    desc: `Chevrolet Jebla en ${dir}. Teléfono de ventas ${telFmt(DEALER.telVentas)}, servicio ${telFmt(DEALER.telServicio)} y WhatsApp. Horarios y cómo llegar.`,
    ld: LD("Contacto", "/contacto/"),
    body: `${crumbs([["Contacto", "/contacto/"]])}
${head("Contacto y ubicación", "Escríbenos, llámanos o visítanos. Atendemos a toda la región de Ciudad Victoria.")}
<section class="sec"><div class="wrap"><div class="tiles">
<a class="tile" href="tel:+52${DEALER.telVentas}" data-cta="contacto_ventas">${ic("phone", "ic ic--lg")}<strong>Ventas</strong><span>${telFmt(DEALER.telVentas)}</span></a>
<a class="tile" href="tel:+52${DEALER.telServicio}" data-cta="contacto_servicio">${ic("wrench", "ic ic--lg")}<strong>Servicio</strong><span>${telFmt(DEALER.telServicio)}</span></a>
<a class="tile" href="${wa("Hola, quiero información.")}" target="_blank" rel="noopener" data-cta="contacto_whatsapp">${ic("wa", "ic ic--lg")}<strong>WhatsApp</strong><span>${telFmt(DEALER.whatsapp.slice(3))}</span></a>
<a class="tile" href="${DEALER.maps}" target="_blank" rel="noopener" data-cta="contacto_maps">${ic("pin", "ic ic--lg")}<strong>Cómo llegar</strong><span>Abrir en Google Maps</span></a></div></div></section>
${visit()}
${leadSection(`<h2 class="h1">¿Te llamamos?</h2>${checks(["Déjanos tus datos y un asesor te contacta", "Ventas, financiamiento, auto a cuenta o servicio"])}`, leadForm({ title: "Déjanos tus datos", origen: "contacto", pickModel: true }))}`,
  });

  // ---------- AVISO DE PRIVACIDAD (plantilla) ----------
  page({
    path: "/aviso-de-privacidad/", title: "Aviso de privacidad | Chevrolet Jebla Ciudad Victoria", desc: "Aviso de privacidad de Chevrolet Jebla Ciudad Victoria.",
    body: `${crumbs([["Aviso de privacidad", "/aviso-de-privacidad/"]])}
<section class="sec"><div class="wrap prose"><h1 class="h1">Aviso de privacidad</h1>
<p><strong>PENDIENTE:</strong> este texto es una plantilla de referencia. Debe sustituirse por el aviso de privacidad integral oficial del distribuidor, validado por su área legal.</p>
<h2>Responsable</h2><p>[Razón social del distribuidor], con domicilio en ${esc(dir)}, es responsable del tratamiento de tus datos personales.</p>
<h2>Datos que recabamos</h2><p>Nombre, teléfono, correo electrónico, municipio de residencia y la información que compartas sobre el vehículo de tu interés o tu vehículo actual.</p>
<h2>Finalidades</h2><p>Atender tu solicitud de cotización, prueba de manejo, financiamiento, valuación o servicio, y contactarte por el medio que elijas.</p>
<h2>Derechos ARCO</h2><p>Puedes solicitar el acceso, rectificación, cancelación u oposición al tratamiento de tus datos en [correo o medio de contacto del responsable].</p>
<h2>Cambios al aviso</h2><p>Cualquier cambio se publicará en esta página.</p></div></section>`,
  });
}
