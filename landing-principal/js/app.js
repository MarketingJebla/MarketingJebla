/* =========================================================
   Lógica de la landing — funcionalidades DUMMY listas para conectar.
   - Los leads se guardan en el navegador (localStorage) mientras no hay CRM.
   - Para ver los leads de prueba: abre la página con #leads al final de la URL.
   - Para conectar el CRM: llena JEBLA.crm.endpoint (ver sendLead()).
   ========================================================= */
(function () {
  "use strict";
  var C = window.JEBLA;
  C.crm = C.crm || { endpoint: null }; // PENDIENTE: URL del CRM
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Utilidades ---------- */
  function img(path, w) { return C.cdn + path + (w ? "?imwidth=" + w : ""); }
  function money(n) { return "$" + n.toLocaleString("es-MX"); }
  function fmtTel(d) { return d.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3"); }
  function onlyDigits(s) { return (s || "").replace(/\D/g, ""); }
  function track(event, data) {
    var payload = Object.assign({ event: event }, data || {});
    window.dataLayer.push(payload);
    if (window.console && location.hash === "#debug") console.log("[track]", payload);
  }
  function waUrl(text) {
    return "https://wa.me/" + C.dealer.whatsapp + "?text=" + encodeURIComponent(text);
  }
  var WA_DEFAULT = "Hola, vi su página de Chevrolet Jebla Ciudad Victoria y quiero información.";

  /* ---------- UTM / origen ---------- */
  var utm = (function () {
    var keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"];
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem("jebla_utm") || "{}"); } catch (e) {}
    var p = new URLSearchParams(location.search);
    keys.forEach(function (k) { if (p.get(k)) stored[k] = p.get(k); });
    try { sessionStorage.setItem("jebla_utm", JSON.stringify(stored)); } catch (e) {}
    return stored;
  })();

  /* ---------- Enlaces de llamada y WhatsApp ---------- */
  $$(".js-call").forEach(function (a) { a.href = "tel:+52" + C.dealer.telVentas; });
  $$(".js-call-serv").forEach(function (a) { a.href = "tel:+52" + C.dealer.telServicio; });
  $$(".js-wa").forEach(function (a) { a.href = waUrl(WA_DEFAULT); });

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (el) track("cta_click", { cta: el.getAttribute("data-cta") });
  });

  /* ---------- Hero (carrusel) ---------- */
  var track_ = $("#heroTrack"), dots = $("#heroDots");
  C.hero.forEach(function (h, i) {
    var s = document.createElement("div");
    s.className = "slide";
    s.setAttribute("role", "group");
    s.setAttribute("aria-label", (i + 1) + " de " + C.hero.length + ": " + h.modelo);
    s.innerHTML =
      '<picture>' +
        '<source media="(min-width:600px)" srcset="' + img(h.dsk, 1200) + ' 1280w, ' + img(h.dsk, 1920) + ' 2048w" sizes="100vw" width="2048" height="819">' +
        '<img src="' + img(h.mob, 600) + '" srcset="' + img(h.mob, 420) + ' 480w, ' + img(h.mob, 600) + ' 640w" sizes="100vw" alt="' + h.alt + '"' +
        (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ' width="640" height="640">' +
      '</picture>' +
      '<div class="slide__cta"><button class="btn btn--primary btn--lg js-pick" data-model="' + h.modelo + '" data-cta="hero_' + i + '">Cotizar ' + h.modelo + '</button></div>';
    track_.appendChild(s);
    var d = document.createElement("button");
    d.setAttribute("role", "tab");
    d.setAttribute("aria-label", "Ver " + h.modelo);
    d.setAttribute("aria-selected", i === 0 ? "true" : "false");
    d.addEventListener("click", function () { go(i); stop(); });
    dots.appendChild(d);
  });
  var cur = 0, timer = null;
  function go(i) { cur = i; track_.scrollTo({ left: i * track_.clientWidth, behavior: "smooth" }); }
  function stop() { clearInterval(timer); timer = null; }
  track_.addEventListener("scroll", function () {
    var i = Math.round(track_.scrollLeft / track_.clientWidth);
    if (i !== cur) cur = i;
    $$("button", dots).forEach(function (b, j) { b.setAttribute("aria-selected", j === i ? "true" : "false"); });
  }, { passive: true });
  ["touchstart", "pointerdown", "focusin"].forEach(function (ev) { track_.addEventListener(ev, stop, { passive: true }); });
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches && C.hero.length > 1) {
    timer = setInterval(function () { go((cur + 1) % C.hero.length); }, 5500);
  }

  /* ---------- Formulario ---------- */
  var form = $("#leadForm"), sel = $("#modeloSelect"), mun = $("#municipioSelect");
  var state = { interes: "cotizacion", step: 1, started: false };

  // Modelos agrupados por categoría
  Object.keys(C.categorias).forEach(function (cat) {
    var g = document.createElement("optgroup");
    g.label = C.categorias[cat];
    C.modelos.filter(function (m) { return m.cat === cat; }).forEach(function (m) {
      var o = document.createElement("option");
      o.value = m.nombre; o.textContent = m.nombre;
      g.appendChild(o);
    });
    sel.appendChild(g);
  });
  var otro = document.createElement("option");
  otro.value = "Aún no lo decido"; otro.textContent = "Aún no lo decido";
  sel.appendChild(otro);

  C.municipios.forEach(function (m) {
    var o = document.createElement("option"); o.value = m; o.textContent = m; mun.appendChild(o);
  });

  // Chips de interés
  var chipsBox = $("#interestChips");
  C.intereses.forEach(function (it) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = it.label;
    b.setAttribute("role", "radio"); b.dataset.id = it.id;
    b.setAttribute("aria-checked", it.id === state.interes ? "true" : "false");
    b.addEventListener("click", function () { setInterest(it.id); markStart(); });
    chipsBox.appendChild(b);
  });

  var TITLES = {
    cotizacion: ["Cotiza tu Chevrolet", "Recibir mi cotización"],
    prueba: ["Agenda tu prueba de manejo", "Agendar mi prueba"],
    financiamiento: ["Conoce tu plan de financiamiento", "Recibir mi plan"],
    seminuevos: ["Cotiza con tu auto a cuenta", "Recibir mi valuación"],
    servicio: ["Agenda tu cita de servicio", "Solicitar mi cita"]
  };
  function setInterest(id) {
    state.interes = id;
    $$(".chip", chipsBox).forEach(function (c) { c.setAttribute("aria-checked", c.dataset.id === id ? "true" : "false"); });
    $("#formTitle").textContent = TITLES[id][0];
    $("#submitBtn").textContent = TITLES[id][1];
    $(".field .lbl", form).textContent = id === "servicio" ? "Modelo de tu auto" : "Modelo de interés";
    if (id === "financiamiento") form.financiamiento.checked = true;
    if (id === "seminuevos") form.autoACuenta.checked = true;
  }

  function markStart() {
    if (!state.started) { state.started = true; track("form_start", { interes: state.interes }); }
  }
  form.addEventListener("input", markStart);
  form.addEventListener("change", markStart);

  function setStep(n) {
    state.step = n;
    $$(".step", form).forEach(function (s) { s.classList.toggle("is-active", +s.dataset.step === n); });
    $("#progressBar").style.width = n === 1 ? "50%" : "100%";
    $(".form-head", form).style.display = n === 3 ? "none" : "";
    track("form_step", { step: n, interes: state.interes });
  }

  function fieldOk(name, ok) {
    var input = form.elements[name];
    var wrap = input.closest(".field");
    var err = $('.err[data-for="' + name + '"]', form);
    if (wrap) wrap.classList.toggle("is-invalid", !ok);
    if (err) err.classList.toggle("show", !ok);
    return ok;
  }

  $("#toStep2").addEventListener("click", function () {
    if (!fieldOk("modelo", !!sel.value)) { sel.focus(); return; }
    $("#summaryLine").textContent = sel.value + " · cambiar";
    setStep(2);
    form.nombre.focus({ preventScroll: true });
  });
  $("#backStep1").addEventListener("click", function () { setStep(1); });

  // Teléfono: solo dígitos, formato 834 123 4567
  form.telefono.addEventListener("input", function () {
    var d = onlyDigits(this.value);
    if (d.length > 10 && (d.indexOf("52") === 0)) d = d.replace(/^521?/, "");
    d = d.slice(0, 10);
    this.value = d.length > 6 ? d.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3") : d.length > 3 ? d.replace(/(\d{3})(\d+)/, "$1 $2") : d;
  });

  // Validación en vivo después del primer error
  ["nombre", "telefono", "municipio", "correo"].forEach(function (n) {
    form.elements[n].addEventListener("blur", function () { if (state.step === 2 && this.value) validate(n); });
    form.elements[n].addEventListener(n === "municipio" ? "change" : "input", function () {
      var w = this.closest(".field"); if (w && w.classList.contains("is-invalid")) validate(n);
    });
  });
  form.privacidad.addEventListener("change", function () { if (this.checked) validate("privacidad"); });
  sel.addEventListener("change", function () { if (sel.value) fieldOk("modelo", true); });
  function validate(n) {
    var v = form.elements[n].value.trim();
    if (n === "nombre") return fieldOk(n, v.length >= 2);
    if (n === "telefono") return fieldOk(n, onlyDigits(v).length === 10);
    if (n === "municipio") return fieldOk(n, !!v);
    if (n === "correo") return fieldOk(n, !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
    if (n === "privacidad") { var ok = form.privacidad.checked; $('.err[data-for="privacidad"]').classList.toggle("show", !ok); return ok; }
    return true;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var order = ["nombre", "telefono", "municipio", "correo", "privacidad"];
    var bad = order.filter(function (n) { return !validate(n); });
    if (bad.length) {
      if (bad[0] === "correo") form.querySelector(".more").open = true;
      form.elements[bad[0]].focus();
      track("form_error", { campos: bad.join(",") });
      return;
    }
    var btn = $("#submitBtn");
    btn.disabled = true; btn.textContent = "Enviando…";

    var lead = {
      folio: "JV-" + Date.now().toString(36).toUpperCase().slice(-6),
      fecha: new Date().toISOString(),
      interes: state.interes,
      modelo: sel.value,
      nombre: form.nombre.value.trim(),
      telefono: onlyDigits(form.telefono.value),
      municipio: form.municipio.value,
      correo: form.correo.value.trim(),
      autoACuenta: form.autoACuenta.checked,
      financiamiento: form.financiamiento.checked,
      contacto: form.contacto.value,
      origen: "landing-principal",
      pagina: location.href.split("#")[0],
      utm: utm
    };

    sendLead(lead).then(function () {
      track("lead_submit", { interes: lead.interes, modelo: lead.modelo, municipio: lead.municipio, contacto: lead.contacto });
      showSuccess(lead);
    }).catch(function () {
      btn.disabled = false; btn.textContent = TITLES[state.interes][1];
      alert("No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
    });
  });

  /* Envío del lead: DUMMY. Guarda en el navegador.
     Para el CRM: si C.crm.endpoint tiene URL, se hará POST JSON. */
  function sendLead(lead) {
    var saved = [];
    try { saved = JSON.parse(localStorage.getItem("jebla_leads") || "[]"); } catch (e) {}
    saved.push(lead);
    try { localStorage.setItem("jebla_leads", JSON.stringify(saved)); } catch (e) {}
    if (C.crm.endpoint) {
      return fetch(C.crm.endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); });
    }
    return new Promise(function (res) { setTimeout(res, 700); }); // simula red
  }

  function showSuccess(lead) {
    $("#okName").textContent = lead.nombre.split(" ")[0];
    $("#okModelo").textContent = lead.modelo;
    $("#okFolio").textContent = lead.folio;
    var interes = (C.intereses.filter(function (i) { return i.id === lead.interes; })[0] || {}).label;
    $("#okWa").href = waUrl("Hola, soy " + lead.nombre + ". Acabo de solicitar " + (interes || "información").toLowerCase() +
      " de " + lead.modelo + " (folio " + lead.folio + "). Vivo en " + lead.municipio + ".");
    setStep(3);
    $("#formCard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#newLead").addEventListener("click", function () {
    form.reset(); setInterest("cotizacion"); state.started = false;
    var b = $("#submitBtn"); b.disabled = false; b.textContent = TITLES.cotizacion[1];
    $$(".is-invalid", form).forEach(function (x) { x.classList.remove("is-invalid"); });
    $$(".err.show", form).forEach(function (x) { x.classList.remove("show"); });
    setStep(1);
  });

  // Ir al formulario con modelo/interés preseleccionado
  function goToForm(model, interest) {
    if (state.step === 3) $("#newLead").click();
    if (interest) setInterest(interest);
    if (model) { sel.value = model; fieldOk("modelo", true); }
    setStep(1);
    $("#cotizar").scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { (model ? $("#toStep2") : sel).focus({ preventScroll: true }); }, 500);
  }
  document.addEventListener("click", function (e) {
    var p = e.target.closest(".js-pick");
    if (p) { e.preventDefault(); goToForm(p.dataset.model, p.dataset.interest || "cotizacion"); }
    var t = e.target.closest(".js-intent");
    if (t) { e.preventDefault(); goToForm(null, t.dataset.interest); }
    if (e.target.closest(".js-privacy")) { e.preventDefault(); $("#aviso-privacidad").scrollIntoView({ behavior: "smooth" }); }
  });

  /* ---------- Catálogo de modelos ---------- */
  var tabs = $("#catTabs"), rail = $("#modelRail");
  function renderCat(cat) {
    $$(".tab", tabs).forEach(function (t) { t.setAttribute("aria-selected", t.dataset.cat === cat ? "true" : "false"); });
    rail.innerHTML = C.modelos.filter(function (m) { return m.cat === cat; }).map(function (m) {
      return '<article class="mcard">' +
        '<div class="mcard__img">' + (m.badge ? '<span class="badge">' + m.badge + '</span>' : '') +
          '<img src="' + img(m.img, 600) + '" alt="Chevrolet ' + m.nombre + '" loading="lazy" width="640" height="320" onerror="this.replaceWith(Object.assign(document.createElement(\'span\'),{className:\'ph\',textContent:\'Imagen pendiente\'}))">' +
        '</div>' +
        '<div class="mcard__body">' +
          '<h3 class="mcard__name">' + m.nombre + '</h3>' +
          '<p class="mcard__price">Desde <strong>' + money(m.precio) + '*</strong></p>' +
          '<div class="mcard__btns">' +
            '<button class="btn btn--primary js-pick" data-model="' + m.nombre + '" data-cta="card_cotizar">Cotizar</button>' +
            '<a class="btn btn--ghost btn--icon" data-cta="card_whatsapp" target="_blank" rel="noopener" aria-label="Preguntar por ' + m.nombre + ' en WhatsApp" href="' +
              waUrl("Hola, me interesa el Chevrolet " + m.nombre + ". ¿Me pueden dar precio y promociones?") + '"><svg class="ic" aria-hidden="true"><use href="#i-wa"/></svg></a>' +
          '</div>' +
        '</div></article>';
    }).join("");
    rail.scrollLeft = 0;
  }
  Object.keys(C.categorias).forEach(function (cat, i) {
    var b = document.createElement("button");
    b.className = "tab"; b.type = "button"; b.dataset.cat = cat;
    b.setAttribute("role", "tab"); b.textContent = C.categorias[cat];
    b.addEventListener("click", function () { renderCat(cat); track("category_view", { categoria: cat }); });
    tabs.appendChild(b);
  });
  renderCat("suvs");

  /* ---------- Ubicación y cobertura ---------- */
  $("#dirTxt").textContent = C.dealer.direccion;
  $("#horTxt").textContent = C.dealer.horarios;
  $("#telVentasTxt").textContent = fmtTel(C.dealer.telVentas);
  $("#telServTxt").textContent = fmtTel(C.dealer.telServicio);
  $("#mapsBtn").href = C.dealer.mapsUrl;
  $("#sitioLink").href = C.dealer.sitioPrincipal;
  $("#coverageList").innerHTML = C.municipios.filter(function (m) { return m !== "Otro municipio"; })
    .map(function (m) { return "<li>" + m + "</li>"; }).join("");

  /* ---------- Barra fija: se oculta cuando el formulario está a la vista ---------- */
  var dock = $("#dock");
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      dock.classList.toggle("is-hidden", en[0].isIntersecting);
    }, { threshold: 0.35 }).observe($("#formCard"));
  }

  /* ---------- Visor de leads de prueba (#leads) ---------- */
  function showLeads() {
    var leads = [];
    try { leads = JSON.parse(localStorage.getItem("jebla_leads") || "[]"); } catch (e) {}
    var cols = ["folio", "fecha", "interes", "modelo", "nombre", "telefono", "municipio", "correo", "contacto", "autoACuenta", "financiamiento"];
    var box = document.createElement("div");
    box.setAttribute("style", "position:fixed;inset:0;z-index:999;background:#fff;overflow:auto;padding:16px;font-size:13px");
    box.innerHTML = '<h2 style="margin:0 0 8px">Leads de prueba (' + leads.length + ')</h2>' +
      '<p style="margin:0 0 12px;color:#666">Guardados solo en este navegador. Se reemplazará por el CRM.</p>' +
      '<p><button id="lxCsv" class="btn btn--primary btn--sm">Descargar CSV</button> <button id="lxClear" class="btn btn--ghost btn--sm">Borrar todo</button> <button id="lxClose" class="btn btn--ghost btn--sm">Cerrar</button></p>' +
      '<div style="overflow:auto"><table style="border-collapse:collapse;min-width:900px"><thead><tr>' +
      cols.map(function (c) { return '<th style="text-align:left;border-bottom:2px solid #222;padding:6px">' + c + '</th>'; }).join("") +
      '</tr></thead><tbody>' + leads.slice().reverse().map(function (l) {
        return "<tr>" + cols.map(function (c) { return '<td style="border-bottom:1px solid #ddd;padding:6px">' + String(l[c] == null ? "" : l[c]).replace(/</g, "&lt;") + "</td>"; }).join("") + "</tr>";
      }).join("") + "</tbody></table></div>";
    document.body.appendChild(box);
    $("#lxClose").onclick = function () { box.remove(); history.replaceState(null, "", location.pathname + location.search); };
    $("#lxClear").onclick = function () { if (confirm("¿Borrar todos los leads de prueba?")) { localStorage.removeItem("jebla_leads"); box.remove(); showLeads(); } };
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
