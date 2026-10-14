/* Chevrolet Jebla Ciudad Victoria — comportamiento del sitio (funciones DUMMY listas para conectar).
   - Leads: se guardan en el navegador (localStorage "jebla_leads"). Verlos: agrega #leads a cualquier URL.
   - CRM: define window.JEBLA_CRM_ENDPOINT (o edita CRM abajo) para enviar POST JSON. */
(function () {
  "use strict";
  var CRM = window.JEBLA_CRM_ENDPOINT || null; // PENDIENTE: URL del CRM
  var D = {}; try { D = JSON.parse(document.getElementById("page-data").textContent); } catch (e) {}
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + Math.round(n).toLocaleString("en-US"); };
  var digits = function (s) { return (s || "").replace(/\D/g, ""); };
  function track(ev, data) { window.dataLayer.push(Object.assign({ event: ev, pagina: location.pathname }, data || {})); }
  function waUrl(t) { return "https://wa.me/" + D.wa + "?text=" + encodeURIComponent(t); }

  // UTM / origen de campaña (se guarda durante la sesión)
  var utm = {};
  try { utm = JSON.parse(sessionStorage.getItem("jebla_utm") || "{}"); } catch (e) {}
  new URLSearchParams(location.search).forEach(function (v, k) { if (/^(utm_|gclid|fbclid)/.test(k)) utm[k] = v; });
  try { sessionStorage.setItem("jebla_utm", JSON.stringify(utm)); } catch (e) {}

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (el) track("cta_click", { cta: el.getAttribute("data-cta") });
  });

  // ---------- Menú móvil ----------
  var burger = $("#burger"), menu = $("#menu");
  if (burger) burger.addEventListener("click", function () {
    var open = burger.getAttribute("aria-expanded") !== "true";
    burger.setAttribute("aria-expanded", open); menu.style.top = $(".topbar").getBoundingClientRect().bottom + "px"; menu.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  // ---------- Carrusel ----------
  $$("[data-carousel]").forEach(function (track_) {
    var dots = track_.parentNode.querySelector("[data-dots]"), n = track_.children.length, cur = 0, timer;
    for (var i = 0; i < n; i++) (function (i) {
      var b = document.createElement("button"); b.setAttribute("aria-label", "Ver promoción " + (i + 1));
      b.addEventListener("click", function () { go(i); stop(); }); dots.appendChild(b);
    })(i);
    function mark() { $$("button", dots).forEach(function (b, j) { b.setAttribute("aria-selected", j === cur); }); }
    function go(i) { cur = i; track_.scrollTo({ left: i * track_.clientWidth, behavior: "smooth" }); mark(); }
    function stop() { clearInterval(timer); }
    track_.addEventListener("scroll", function () { cur = Math.round(track_.scrollLeft / track_.clientWidth); mark(); }, { passive: true });
    ["touchstart", "pointerdown", "focusin"].forEach(function (ev) { track_.addEventListener(ev, stop, { passive: true }); });
    mark();
    if (n > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) timer = setInterval(function () { go((cur + 1) % n); }, 5500);
  });

  // ---------- Pestañas del catálogo ----------
  $$("[data-tabs]").forEach(function (tabs) {
    tabs.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]"); if (!b) return;
      $$("[data-cat]", tabs).forEach(function (t) { t.setAttribute("aria-selected", t === b); });
      $$("[data-panel]", tabs.parentNode).forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== b.getAttribute("data-cat"); });
      track("category_view", { categoria: b.getAttribute("data-cat") });
    });
  });

  // ---------- Formulario de leads ----------
  var form = $(".lead-form");
  var TITLES = { cotizacion: "Recibir mi cotización", prueba: "Agendar mi prueba", financiamiento: "Recibir mi plan", seminuevos: "Recibir mi valuación", servicio: "Solicitar mi cita" };
  if (form) {
    var started = false, step = 1, steps = $$(".step", form), plan = null;
    var bar = $(".progress span", form);
    var go = function (n) {
      step = n; steps.forEach(function (s) { s.classList.toggle("is-active", +s.getAttribute("data-step") === n); });
      if (bar) bar.style.width = n === 1 ? "50%" : "100%";
      track("form_step", { step: n, origen: form.dataset.origen });
    };
    var start = function () { if (!started) { started = true; track("form_start", { origen: form.dataset.origen }); } };
    form.addEventListener("input", start); form.addEventListener("change", start);

    // Prefill por URL (?modelo=…&interes=…)
    var qs = new URLSearchParams(location.search);
    if (qs.get("modelo") && form.modelo) form.modelo.value = qs.get("modelo");
    if (qs.get("interes")) setInteres(qs.get("interes"));

    function setInteres(id) {
      var r = form.querySelector('input[name="interes"][value="' + id + '"]');
      if (r) r.checked = true;
      form.dataset.interes = id;
      var s = $("[data-submit]", form); if (s && TITLES[id]) s.textContent = TITLES[id];
      if (id === "financiamiento" && form.financiamiento) form.financiamiento.checked = true;
      if (id === "seminuevos" && form.autoACuenta) form.autoACuenta.checked = true;
    }
    form.addEventListener("change", function (e) { if (e.target.name === "interes") setInteres(e.target.value); });

    // Teléfono: 10 dígitos con formato
    if (form.telefono) form.telefono.addEventListener("input", function () {
      var d = digits(this.value); if (d.length > 10 && d.indexOf("52") === 0) d = d.replace(/^521?/, ""); d = d.slice(0, 10);
      this.value = d.length > 6 ? d.replace(/(\d{3})(\d{3})(\d+)/, "$1 $2 $3") : d.length > 3 ? d.replace(/(\d{3})(\d+)/, "$1 $2") : d;
    });

    function check(el) {
      var t = el.getAttribute("data-req"), v = (el.value || "").trim(), ok = true;
      if (t === "nombre") ok = v.length >= 2;
      else if (t === "telefono") ok = digits(v).length === 10;
      else if (t === "select" || t === "text") ok = !!v;
      else if (t === "check") ok = el.checked;
      else if (t === "email-opt") ok = !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      else if (t === "radio") ok = !!form.querySelector('input[name="' + el.name + '"]:checked');
      var wrap = el.closest(".field") || el.closest(".vpick");
      if (wrap) wrap.classList.toggle("is-invalid", !ok);
      var err = form.querySelector('.err[data-for="' + el.name + '"]'); if (err) err.classList.toggle("show", !ok);
      return ok;
    }
    function validStep(n) {
      var seen = {}, bad = [];
      $$('.step[data-step="' + n + '"] [data-req]', form).forEach(function (el) {
        if (el.type === "radio") { if (seen[el.name]) return; seen[el.name] = 1; }
        if (!check(el)) bad.push(el);
      });
      if (bad.length) {
        if (bad[0].closest(".more")) bad[0].closest(".more").open = true;
        bad[0].focus(); track("form_error", { campos: bad.map(function (b) { return b.name; }).join(",") });
      }
      return !bad.length;
    }
    form.addEventListener("input", function (e) { var w = e.target.closest(".is-invalid"); if (w && e.target.hasAttribute("data-req")) check(e.target); });
    form.addEventListener("change", function (e) { if (e.target.hasAttribute("data-req") && (e.target.closest(".is-invalid") || e.target.type === "checkbox" || e.target.type === "radio")) check(e.target); });

    var next = $("[data-next]", form);
    if (next) next.addEventListener("click", function () {
      if (!validStep(1)) return;
      var v = form.querySelector('input[name="version"]:checked'), c = form.querySelector('input[name="color"]:checked');
      var sum = [form.auto_actual && form.auto_actual.value, form.dataset.modelo || (form.modelo && form.modelo.value), v && v.value, c && c.value].filter(Boolean).join(" · ");
      $("[data-summary]", form).textContent = sum ? sum + " · cambiar" : "Volver al paso 1";
      var sub = $(".form-head__sub", form); if (sub && /^Paso 1/.test(sub.textContent)) { sub.dataset.p1 = sub.textContent; sub.textContent = "Paso 2: tus datos de contacto"; }
      go(2); form.nombre.focus({ preventScroll: true });
    });
    var back = $("[data-back]", form); if (back) back.addEventListener("click", function () { var sub = $(".form-head__sub", form); if (sub && sub.dataset.p1) sub.textContent = sub.dataset.p1; go(1); });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validStep(step)) return;
      var btn = $("[data-submit]", form); btn.disabled = true; btn.textContent = "Enviando…";
      var fd = new FormData(form), lead = {};
      fd.forEach(function (v, k) { lead[k] = v; });
      lead.folio = "JV-" + Date.now().toString(36).toUpperCase().slice(-6);
      lead.fecha = new Date().toISOString();
      lead.interes = lead.interes || form.dataset.interes;
      lead.modelo = form.dataset.modelo || lead.modelo || "";
      lead.telefono = digits(lead.telefono);
      lead.autoACuenta = !!lead.autoACuenta; lead.financiamiento = !!lead.financiamiento || !!plan;
      if (plan) lead.plan = "Enganche " + plan.pct + "% (" + money(plan.eng) + "), " + plan.plazo + " meses";
      lead.origen = form.dataset.origen; lead.pagina = location.pathname; lead.utm = utm;
      delete lead.privacidad;
      save(lead).then(function () {
        track("lead_submit", { interes: lead.interes, modelo: lead.modelo, version: lead.version || "", municipio: lead.municipio, origen: lead.origen });
        try { sessionStorage.setItem("jebla_last", JSON.stringify({ nombre: lead.nombre, modelo: lead.modelo, version: lead.version, color: lead.color, folio: lead.folio, interes: lead.interes, municipio: lead.municipio, plan: lead.plan })); } catch (e) {}
        location.href = "/gracias/?i=" + encodeURIComponent(lead.interes || "cotizacion");
      }).catch(function () {
        btn.disabled = false; btn.textContent = TITLES[form.dataset.interes] || "Enviar";
        alert("No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp.");
      });
    });

    function save(lead) {
      var all = []; try { all = JSON.parse(localStorage.getItem("jebla_leads") || "[]"); } catch (e) {}
      all.push(lead); try { localStorage.setItem("jebla_leads", JSON.stringify(all)); } catch (e) {}
      if (CRM) return fetch(CRM, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) }).then(function (r) { if (!r.ok) throw r; });
      return new Promise(function (res) { setTimeout(res, 600); });
    }

    // Botones que llevan al formulario con datos precargados
    window.jeblaGoForm = function (o) {
      if (o.modelo && form.modelo) form.modelo.value = o.modelo;
      if (o.version) { var r = form.querySelector('input[name="version"][value="' + o.version + '"]'); if (r) r.checked = true; }
      if (o.color) { var c = form.querySelector('input[name="color"][value="' + o.color + '"]'); if (c) c.checked = true; }
      if (o.interes) setInteres(o.interes);
      if (o.plan) plan = o.plan;
      go(1);
      $("#cotizar").scrollIntoView({ behavior: "smooth", block: "start" });
    };
    document.addEventListener("click", function (e) {
      var p = e.target.closest("[data-pick]"); if (p) { e.preventDefault(); jeblaGoForm({ modelo: p.getAttribute("data-pick") }); }
      var v = e.target.closest("[data-version]"); if (v) { e.preventDefault(); track("version_select", { version: v.getAttribute("data-version") }); jeblaGoForm({ version: v.getAttribute("data-version"), interes: "cotizacion" }); }
    });

    // Barra fija: se oculta cuando el formulario está a la vista
    var dock = $("#dock");
    if (dock && "IntersectionObserver" in window) new IntersectionObserver(function (en) { dock.classList.toggle("is-hidden", en[0].isIntersecting); }, { threshold: .3 }).observe($("#formCard"));
  }

  // ---------- Selector de colores ----------
  var colz = $("[data-colorizer]");
  if (colz && D.colores) {
    var cImg = $("[data-color-img]"), cName = $("[data-color-name]"), cCta = $("[data-color-cta]"), sel = D.colores[0].n;
    colz.addEventListener("click", function (e) {
      var b = e.target.closest(".swatch"); if (!b) return;
      var c = D.colores[+b.getAttribute("data-i")]; sel = c.n;
      $$(".swatch", colz).forEach(function (s) { s.setAttribute("aria-pressed", s === b); });
      cImg.style.opacity = .3; cImg.onload = function () { cImg.style.opacity = 1; };
      cImg.src = c.img; cImg.alt = D.modelo + " en " + c.n; cName.textContent = c.n; cCta.textContent = "Cotizar en " + c.n;
      track("color_select", { color: c.n });
    });
    cCta.addEventListener("click", function (e) { if (window.jeblaGoForm) { e.preventDefault(); jeblaGoForm({ color: sel }); } });
  }

  // ---------- Calculadora de enganche ----------
  $$("[data-calc]").forEach(function (box) {
    var price = +box.getAttribute("data-precio"), range = $("[data-range]", box), used = false, priceSel = $("[data-calc-model]", box);
    function calc() {
      if (priceSel) price = +priceSel.value;
      var pct = +range.value, eng = price * pct / 100, pl = box.querySelector('input[type=radio]:checked');
      $("[data-pct]", box).textContent = pct + "%"; $("[data-eng]", box).textContent = money(eng); $("[data-fin]", box).textContent = money(price - eng);
      var pr = $("[data-price]", box); if (pr) pr.textContent = money(price);
      return { pct: pct, eng: eng, plazo: pl ? pl.value : 48 };
    }
    box.addEventListener("input", function () { calc(); if (!used) { used = true; track("estimator_use"); } });
    box.addEventListener("change", calc);
    var cta = $("[data-calc-cta]", box);
    if (cta) cta.addEventListener("click", function (e) {
      if (!window.jeblaGoForm) return; e.preventDefault();
      var o = { interes: "financiamiento", plan: calc() };
      if (priceSel) o.modelo = priceSel.options[priceSel.selectedIndex].text;
      jeblaGoForm(o);
    });
    calc();
  });

  // ---------- Página de gracias ----------
  var ty = $("[data-thanks]");
  if (ty) {
    var L = {}; try { L = JSON.parse(sessionStorage.getItem("jebla_last") || "{}"); } catch (e) {}
    if (L.nombre) $("[data-ty-name]").textContent = ", " + L.nombre.split(" ")[0];
    if (L.folio) $("[data-ty-folio]").textContent = L.folio;
    var what = [L.modelo, L.version, L.color && "en " + L.color].filter(Boolean).join(" ");
    if (what) $("[data-ty-what]").textContent = " de " + what;
    $("[data-ty-wa]").href = waUrl("Hola" + (L.nombre ? ", soy " + L.nombre : "") + ". Acabo de dejar mis datos en su página" + (what ? " para " + what : "") + (L.plan ? " (" + L.plan + ")" : "") + (L.folio ? ". Folio " + L.folio : "") + (L.municipio ? ". Vivo en " + L.municipio : "") + ".");
  }

  // ---------- Visor de leads de prueba (#leads) ----------
  function showLeads() {
    var leads = []; try { leads = JSON.parse(localStorage.getItem("jebla_leads") || "[]"); } catch (e) {}
    var cols = ["folio", "fecha", "origen", "interes", "modelo", "version", "color", "plan", "nombre", "telefono", "municipio", "correo", "contacto", "autoACuenta", "financiamiento", "auto_actual", "anio", "km", "servicio", "fecha_pref", "horario"];
    var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
    var box = document.createElement("div");
    box.setAttribute("style", "position:fixed;inset:0;z-index:999;background:#fff;overflow:auto;padding:16px;font-size:13px");
    box.innerHTML = '<h2 style="margin:0 0 8px">Leads de prueba (' + leads.length + ')</h2><p style="color:#666">Guardados solo en este navegador. Se reemplazará por el CRM.</p><p><button class="btn btn--primary btn--sm" data-x="csv">Descargar CSV</button> <button class="btn btn--ghost btn--sm" data-x="close">Cerrar</button></p><div style="overflow:auto"><table style="border-collapse:collapse;min-width:1400px"><tr>' +
      cols.map(function (c) { return '<th style="text-align:left;border-bottom:2px solid #222;padding:6px">' + c + "</th>"; }).join("") + "</tr>" +
      leads.slice().reverse().map(function (l) { return "<tr>" + cols.map(function (c) { return '<td style="border-bottom:1px solid #ddd;padding:6px">' + esc(l[c]) + "</td>"; }).join("") + "</tr>"; }).join("") + "</table></div>";
    document.body.appendChild(box);
    box.addEventListener("click", function (e) {
      var x = e.target.getAttribute("data-x");
      if (x === "close") { box.remove(); history.replaceState(null, "", location.pathname + location.search); }
      if (x === "csv") {
        var csv = [cols.join(",")].concat(leads.map(function (l) { return cols.map(function (c) { return '"' + String(l[c] == null ? "" : l[c]).replace(/"/g, '""') + '"'; }).join(","); })).join("\n");
        var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" })); a.download = "leads-prueba-jebla.csv"; a.click();
      }
    });
  }
  if (location.hash === "#leads") showLeads();
  window.addEventListener("hashchange", function () { if (location.hash === "#leads") showLeads(); });
})();
