/* =========================================================
   Lógica de landing de MODELO — funcionalidades DUMMY.
   - Leads en localStorage ("jebla_leads", compartido con la principal). Ver con #leads.
   - CRM: llena JEBLA.crm.endpoint para enviar POST JSON.
   ========================================================= */
(function () {
  "use strict";
  var C = window.JEBLA, M = window.MODELO;
  C.crm = C.crm || { endpoint: null }; // PENDIENTE: URL del CRM
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function cdn(path) { return C.cdn + path; }
  function mimg(path, w) { return C.cdn + M.base + path + (w ? "?imwidth=" + w : ""); }
  function money(n) { return "$" + Math.round(n).toLocaleString("es-MX"); }
  function fmtTel(d) { return d.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"); }
  function onlyDigits(s) { return (s || "").replace(/\D/g, ""); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function track(event, data) {
    window.dataLayer.push(Object.assign({ event: event, modelo: M.id }, data || {}));
  }
  function waUrl(text) { return "https://wa.me/" + C.dealer.whatsapp + "?text=" + encodeURIComponent(text); }

  var utm = (function () {
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"], stored = {};
    try { stored = JSON.parse(sessionStorage.getItem("jebla_utm") || "{}"); } catch (e) {}
    var p = new URLSearchParams(location.search);
    keys.forEach(function (k) { if (p.get(k)) stored[k] = p.get(k); });
    try { sessionStorage.setItem("jebla_utm", JSON.stringify(stored)); } catch (e) {}
    return stored;
  })();

  /* ---------- Llamada / WhatsApp ---------- */
  var WA_MODEL = "Hola, me interesa el Chevrolet " + M.nombre + ". ¿Me pueden dar precio, versiones y la promoción del mes?";
  $$(".js-call").forEach(function (a) { a.href = "tel:+52" + C.dealer.telVentas; });
  $$(".js-wa-model").forEach(function (a) { a.href = waUrl(WA_MODEL); });
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (el) track("cta_click", { cta: el.getAttribute("data-cta") });
  });

  /* ---------- Hero ---------- */
  $("#heroPic").innerHTML =
    '<source media="(min-width:960px)" srcset="' + mimg(M.hero.dsk, 1200) + ' 1280w, ' + mimg(M.hero.dsk, 1920) + ' 2048w" sizes="100vw">' +
    '<img src="' + mimg(M.hero.mob, 600) + '" srcset="' + mimg(M.hero.mob, 600) + ' 640w, ' + mimg(M.hero.mob, 1000) + ' 1000w" sizes="100vw" alt="Chevrolet ' + esc(M.nombre) + ' en color rojo" fetchpriority="high" width="640" height="960">';
  $("#heroPrice").textContent = money(M.precioDesde);
  $("#promoList").innerHTML = M.promo.puntos.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("");
  $("#promoLegal").textContent = M.promo.legal;

  /* ---------- Estado del formulario ---------- */
  var form = $("#leadForm");
  var state = { version: null, color: null, interes: "cotizacion", step: 1, started: false, plan: null };

  // Versiones (selector en el formulario)
  var vpick = $("#versionPick");
  var vopts = M.versiones.concat([{ id: "nose", nombre: "Aún no lo sé", trans: "Te ayudamos a elegir", precio: null }]);
  vpick.innerHTML = vopts.map(function (v) {
    return '<button type="button" class="vopt" role="radio" aria-checked="false" data-id="' + v.id + '">' +
      '<span><strong>' + esc(v.nombre) + '</strong><small>' + esc(v.trans) + '</small></span>' +
      (v.id !== "nose" ? '<span class="vopt__price">' + (v.precio ? money(v.precio) + "*" : "Pide tu precio") + '</span>' : '') +
      '</button>';
  }).join("");
  function setVersion(id) {
    state.version = id;
    $$(".vopt", vpick).forEach(function (b) { b.setAttribute("aria-checked", b.dataset.id === id ? "true" : "false"); });
    vpick.classList.remove("is-invalid");
    $('.err[data-for="version"]').classList.remove("show");
  }
  vpick.addEventListener("click", function (e) {
    var b = e.target.closest(".vopt"); if (!b) return;
    setVersion(b.dataset.id); markStart(); track("version_select", { version: b.dataset.id, origen: "form" });
  });

  // Intereses
  var TITLES = {
    cotizacion: ["Cotiza tu " + M.nombreCorto, "Recibir mi cotización"],
    prueba: ["Agenda tu prueba de manejo", "Agendar mi prueba"],
    financiamiento: ["Recibe tu plan de mensualidades", "Recibir mi plan"],
    seminuevos: ["Cotiza con tu auto a cuenta", "Recibir mi valuación"]
  };
  var intereses = C.intereses.filter(function (i) { return i.id !== "servicio"; });
  var chipsBox = $("#interestChips");
  chipsBox.innerHTML = intereses.map(function (it) {
    return '<button type="button" class="chip" role="radio" data-id="' + it.id + '" aria-checked="' + (it.id === state.interes) + '">' + esc(it.label) + '</button>';
  }).join("");
  chipsBox.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (b) { setInterest(b.dataset.id); markStart(); }
  });
  function setInterest(id) {
    state.interes = id;
    $$(".chip", chipsBox).forEach(function (c) { c.setAttribute("aria-checked", c.dataset.id === id ? "true" : "false"); });
    $("#formTitle").textContent = TITLES[id][0];
    $("#submitBtn").textContent = TITLES[id][1];
    if (id === "financiamiento") form.financiamiento.checked = true;
    if (id === "seminuevos") form.autoACuenta.checked = true;
  }

  // Colores (formulario + sección de colores)
  function swatchHTML(c) {
    return '<button type="button" class="swatch" role="radio" aria-checked="false" data-color="' + esc(c.nombre) + '" style="background:' + c.hex + '" aria-label="' + esc(c.nombre) + '" title="' + esc(c.nombre) + '"></button>';
  }
  $("#formSwatches").innerHTML = M.colores.map(swatchHTML).join("");
  $("#colorSwatches").innerHTML = M.colores.map(swatchHTML).join("");
  var colorImg = $("#colorImg");
  function setColor(name, fromSection) {
    state.color = name;
    $$(".swatch").forEach(function (s) { s.setAttribute("aria-checked", s.dataset.color === name ? "true" : "false"); });
    if (fromSection !== false) {
      var c = M.colores.filter(function (x) { return x.nombre === name; })[0];
      if (c) {
        colorImg.style.opacity = .3;
        colorImg.onload = function () { colorImg.style.opacity = 1; };
        colorImg.src = mimg(c.img, 1200);
        colorImg.alt = "Aveo Sedán en " + c.nombre;
        $("#colorName").textContent = c.nombre;
        $("#colorCta").textContent = "Cotizar en " + c.nombre;
      }
    }
  }
  document.addEventListener("click", function (e) {
    var s = e.target.closest(".swatch"); if (!s) return;
    var inForm = !!s.closest("#formSwatches");
    var name = s.dataset.color;
    if (inForm && state.color === name) { state.color = null; s.setAttribute("aria-checked", "false"); return; }
    setColor(name, true);
    track("color_select", { color: name, origen: inForm ? "form" : "colorizer" });
  });
  setColor(M.colores[0].nombre, true); state.color = null;
  $$("#formSwatches .swatch").forEach(function (s) { s.setAttribute("aria-checked", "false"); });

  /* ---------- Pasos ---------- */
  function markStart() { if (!state.started) { state.started = true; track("form_start", { interes: state.interes }); } }
  form.addEventListener("input", markStart);

  function setStep(n) {
    state.step = n;
    $$(".step", form).forEach(function (s) { s.classList.toggle("is-active", +s.dataset.step === n); });
    $("#progressBar").style.width = n === 1 ? "50%" : "100%";
    $(".form-head", form).style.display = n === 3 ? "none" : "";
    track("form_step", { step: n, interes: state.interes });
  }
  function versionLabel() {
    var v = vopts.filter(function (x) { return x.id === state.version; })[0];
    return v ? (v.id === "nose" ? M.nombreCorto : M.nombreCorto + " " + v.nombre) : M.nombreCorto;
  }

  $("#toStep2").addEventListener("click", function () {
    if (!state.version) {
      vpick.classList.add("is-invalid"); $('.err[data-for="version"]').classList.add("show");
      $(".vopt", vpick).focus(); return;
    }
    $("#summaryLine").textContent = versionLabel() + (state.color ? " · " + state.color : "") + " · cambiar";
    setStep(2);
    form.nombre.focus({ preventScroll: true });
  });
  $("#backStep1").addEventListener("click", function () { setStep(1); });

  /* ---------- Validación ---------- */
  var mun = $("#municipioSelect");
  C.municipios.forEach(function (m) { var o = document.createElement("option"); o.value = m; o.textContent = m; mun.appendChild(o); });

  form.telefono.addEventListener("input", function () {
    var d = onlyDigits(this.value);
    if (d.length > 10 && d.indexOf("52") === 0) d = d.replace(/^521?/, "");
    d = d.slice(0, 10);
    this.value = d.length > 6 ? d.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3") : d.length > 3 ? d.replace(/(\d{3})(\d+)/, "$1 $2") : d;
  });
  function fieldOk(name, ok) {
    var input = form.elements[name], wrap = input.closest(".field"), err = $('.err[data-for="' + name + '"]', form);
    if (wrap) wrap.classList.toggle("is-invalid", !ok);
    if (err) err.classList.toggle("show", !ok);
    return ok;
  }
  function validate(n) {
    var v = (form.elements[n].value || "").trim();
    if (n === "nombre") return fieldOk(n, v.length >= 2);
    if (n === "telefono") return fieldOk(n, onlyDigits(v).length === 10);
    if (n === "municipio") return fieldOk(n, !!v);
    if (n === "correo") return fieldOk(n, !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
    if (n === "privacidad") { var ok = form.privacidad.checked; $('.err[data-for="privacidad"]').classList.toggle("show", !ok); return ok; }
    return true;
  }
  ["nombre", "telefono", "municipio", "correo"].forEach(function (n) {
    form.elements[n].addEventListener("blur", function () { if (state.step === 2 && this.value) validate(n); });
    form.elements[n].addEventListener(n === "municipio" ? "change" : "input", function () {
      var w = this.closest(".field"); if (w && w.classList.contains("is-invalid")) validate(n);
    });
  });
  form.privacidad.addEventListener("change", function () { if (this.checked) validate("privacidad"); });

  /* ---------- Envío ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = ["nombre", "telefono", "municipio", "correo", "privacidad"].filter(function (n) { return !validate(n); });
    if (bad.length) {
      if (bad[0] === "correo") form.querySelector(".more").open = true;
      form.elements[bad[0]].focus();
      track("form_error", { campos: bad.join(",") });
      return;
    }
    var btn = $("#submitBtn"); btn.disabled = true; btn.textContent = "Enviando…";
    var v = vopts.filter(function (x) { return x.id === state.version; })[0] || {};
    var lead = {
      folio: "JV-" + Date.now().toString(36).toUpperCase().slice(-6),
      fecha: new Date().toISOString(),
      interes: state.interes,
      modelo: M.nombre,
      version: v.id === "nose" ? "Por definir" : (v.nombre + " " + v.trans),
      color: state.color || "",
      plan: state.plan ? ("Enganche " + state.plan.pct + "% (" + money(state.plan.eng) + "), " + state.plan.plazo + " meses") : "",
      nombre: form.nombre.value.trim(),
      telefono: onlyDigits(form.telefono.value),
      municipio: form.municipio.value,
      correo: form.correo.value.trim(),
      autoACuenta: form.autoACuenta.checked,
      financiamiento: form.financiamiento.checked || !!state.plan,
      contacto: form.contacto.value,
      origen: "landing-" + M.id,
      pagina: location.href.split("#")[0],
      utm: utm
    };
    sendLead(lead).then(function () {
      track("lead_submit", { interes: lead.interes, version: lead.version, color: lead.color, municipio: lead.municipio, contacto: lead.contacto });
      showSuccess(lead);
    }).catch(function () {
      btn.disabled = false; btn.textContent = TITLES[state.interes][1];
      alert("No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
    });
  });

  function sendLead(lead) {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem("jebla_leads") || "[]"); } catch (e) {}
    saved.push(lead);
    try { localStorage.setItem("jebla_leads", JSON.stringify(saved)); } catch (e) {}
    if (C.crm.endpoint) {
      return fetch(C.crm.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); });
    }
    return new Promise(function (res) { setTimeout(res, 700); });
  }

  function showSuccess(lead) {
    $("#okName").textContent = lead.nombre.split(" ")[0];
    $("#okModelo").textContent = versionLabel() + (lead.color ? " en " + lead.color : "");
    $("#okFolio").textContent = lead.folio;
    var lbl = (C.intereses.filter(function (i) { return i.id === lead.interes; })[0] || {}).label || "información";
    $("#okWa").href = waUrl("Hola, soy " + lead.nombre + ". Acabo de solicitar " + lbl.toLowerCase() + " del " +
      versionLabel() + (lead.color ? " en " + lead.color : "") + (lead.plan ? " (" + lead.plan + ")" : "") +
      ". Folio " + lead.folio + ". Vivo en " + lead.municipio + ".");
    setStep(3);
    $("#formCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#newLead").addEventListener("click", resetForm);
  function resetForm() {
    form.reset(); setInterest("cotizacion"); state.started = false; state.version = null; state.plan = null;
    $$(".vopt", vpick).forEach(function (b) { b.setAttribute("aria-checked", "false"); });
    var b = $("#submitBtn"); b.disabled = false; b.textContent = TITLES.cotizacion[1];
    $$(".is-invalid", form).forEach(function (x) { x.classList.remove("is-invalid"); });
    $$(".err.show", form).forEach(function (x) { x.classList.remove("show"); });
    setStep(1);
  }

  // Ir al formulario con datos precargados
  function goToForm(opts) {
    if (state.step === 3) resetForm();
    if (opts.interest) setInterest(opts.interest);
    if (opts.version) setVersion(opts.version);
    setStep(1);
    $("#cotizar").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { (state.version ? $("#toStep2") : $(".vopt", vpick)).focus({ preventScroll: true }); }, 500);
  }
  document.addEventListener("click", function (e) {
    var t = e.target.closest(".js-intent");
    if (t) { e.preventDefault(); goToForm({ interest: t.dataset.interest }); }
    var v = e.target.closest(".js-version");
    if (v) { e.preventDefault(); track("version_select", { version: v.dataset.version, origen: "cards" }); goToForm({ version: v.dataset.version, interest: "cotizacion" }); }
    if (e.target.closest(".js-privacy")) { e.preventDefault(); $("#aviso-privacidad").scrollIntoView({ behavior: "smooth" }); }
  });
  $("#colorCta").addEventListener("click", function () { goToForm({}); });

  /* ---------- Destacados ---------- */
  $("#featsGrid").innerHTML = M.destacados.map(function (f) {
    return '<div class="feat"><svg class="ic" aria-hidden="true"><use href="#i-' + f.icon + '"/></svg><strong>' + esc(f.titulo) + '</strong><span>' + esc(f.texto) + '</span></div>';
  }).join("");

  /* ---------- Tarjetas de versiones ---------- */
  $("#versionCards").innerHTML = M.versiones.map(function (v) {
    return '<article class="vcard">' + (v.tag ? '<span class="vcard__tag">' + esc(v.tag) + '</span>' : '') +
      '<h3>' + esc(v.nombre) + '</h3><p class="vcard__trans">' + esc(v.trans) + '</p>' +
      '<p class="vcard__price">' + (v.precio ? 'Desde <strong>' + money(v.precio) + '*</strong>' : '<strong>Pide el precio de esta versión</strong>') + '</p>' +
      '<ul>' + v.puntos.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + '</ul>' +
      '<button class="btn btn--primary btn--block js-version" data-version="' + v.id + '" data-cta="version_' + v.id + '">Cotizar ' + esc(v.nombre) + '</button>' +
      '</article>';
  }).join("");

  /* ---------- Calculadora de enganche ---------- */
  var range = $("#engRange"), plazo = 48, plazos = [24, 36, 48, 60], calcTouched = false;
  $("#plazoChips").innerHTML = plazos.map(function (p) {
    return '<button type="button" class="chip" role="radio" data-p="' + p + '" aria-checked="' + (p === plazo) + '">' + p + ' meses</button>';
  }).join("");
  function calc() {
    var pct = +range.value, eng = M.precioDesde * pct / 100;
    $("#engPct").textContent = pct + "%";
    $("#cPrecio").textContent = money(M.precioDesde);
    $("#cEng").textContent = money(eng);
    $("#cFin").textContent = money(M.precioDesde - eng);
    return { pct: pct, eng: eng, plazo: plazo };
  }
  function touched() { if (!calcTouched) { calcTouched = true; track("estimator_use"); } }
  range.addEventListener("input", function () { calc(); touched(); });
  $("#plazoChips").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    plazo = +b.dataset.p; touched();
    $$("#plazoChips .chip").forEach(function (c) { c.setAttribute("aria-checked", c === b ? "true" : "false"); });
    calc();
  });
  $("#calcCta").addEventListener("click", function () {
    state.plan = calc();
    form.financiamiento.checked = true;
    goToForm({ interest: "financiamiento" });
  });
  calc();

  /* ---------- Galería y specs ---------- */
  $("#galleryRail").innerHTML = M.galeria.map(function (g) {
    return '<img src="' + mimg(g.img, 1200) + '" alt="' + esc(g.alt) + '" loading="lazy" width="1200" height="600">';
  }).join("");
  $("#specsList").innerHTML = M.specs.map(function (s) { return "<div><dt>" + esc(s.k) + "</dt><dd>" + esc(s.v) + "</dd></div>"; }).join("");
  $("#fichaLink").href = M.fichaTecnica;

  /* ---------- Ubicación ---------- */
  $("#dirTxt").textContent = C.dealer.direccion;
  $("#horTxt").textContent = C.dealer.horarios;
  $("#telVentasTxt").textContent = fmtTel(C.dealer.telVentas);
  $("#mapsBtn").href = C.dealer.mapsUrl;
  $("#sitioLink").href = M.paginaOficial;
  $("#coverageList").innerHTML = C.municipios.filter(function (m) { return m !== "Otro municipio"; })
    .map(function (m) { return "<li>" + esc(m) + "</li>"; }).join("");

  /* ---------- Barra fija ---------- */
  var dock = $("#dock");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { dock.classList.toggle("is-hidden", en[0].isIntersecting); }, { threshold: 0.35 }).observe($("#formCard"));
  }

  /* ---------- Visor de leads de prueba (#leads) ---------- */
  function showLeads() {
    var leads = [];
    try { leads = JSON.parse(localStorage.getItem("jebla_leads") || "[]"); } catch (e) {}
    var cols = ["folio", "fecha", "origen", "interes", "modelo", "version", "color", "plan", "nombre", "telefono", "municipio", "correo", "contacto", "autoACuenta", "financiamiento"];
    var box = document.createElement("div");
    box.setAttribute("style", "position:fixed;inset:0;z-index:999;background:#fff;overflow:auto;padding:16px;font-size:13px");
    box.innerHTML = '<h2 style="margin:0 0 8px">Leads de prueba (' + leads.length + ')</h2>' +
      '<p style="margin:0 0 12px;color:#666">Guardados solo en este navegador. Se reemplazará por el CRM.</p>' +
      '<p><button id="lxCsv" class="btn btn--primary btn--sm">Descargar CSV</button> <button id="lxClose" class="btn btn--ghost btn--sm">Cerrar</button></p>' +
      '<div style="overflow:auto"><table style="border-collapse:collapse;min-width:1100px"><thead><tr>' +
      cols.map(function (c) { return '<th style="text-align:left;border-bottom:2px solid #222;padding:6px">' + c + '</th>'; }).join("") +
      '</tr></thead><tbody>' + leads.slice().reverse().map(function (l) {
        return "<tr>" + cols.map(function (c) { return '<td style="border-bottom:1px solid #ddd;padding:6px">' + esc(l[c] == null ? "" : l[c]) + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
    document.body.appendChild(box);
    $("#lxClose").onclick = function () { box.remove(); history.replaceState(null, "", location.pathname + location.search); };
    $("#lxCsv").onclick = function () {
      var csv = [cols.join(",")].concat(leads.map(function (l) { return cols.map(function (c) { return '"' + String(l[c] == null ? "" : l[c]).replace(/"/g, '""') + '"'; }).join(","); })).join("\n");
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
      a.download = "leads-prueba-jebla.csv"; a.click();
    };
  }
  if (location.hash === "#leads") showLeads();
  window.addEventListener("hashchange", function () { if (location.hash === "#leads") showLeads(); });
})();
