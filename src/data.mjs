// =========================================================
// DATOS DEL SITIO — Chevrolet Jebla Ciudad Victoria
// Edita este archivo y corre `node build.mjs` para regenerar /public.
// Datos de modelos tomados del sitio del distribuidor (14 oct 2026).
// PENDIENTE = por confirmar con la planta o la agencia.
// =========================================================

export const SITE = {
  url: "",            // PENDIENTE: dominio final (ej. https://www.ejemplo.com). Se usa en canonical y sitemap.
  preview: true,      // true = franja "Versión de prueba" + noindex en todo el sitio
  updated: "14 de octubre de 2026",
  cdn: "https://www.chevroletvictoriamotors.com.mx",
  logo: "/content/dam/chevrolet/global/us/english/primary-navigation-icons/chevrolet-logo-TLD.png",
};

export const DEALER = {
  nombre: "Chevrolet Jebla Ciudad Victoria",
  corto: "Chevrolet Jebla",
  calle: "Libramiento Naciones Unidas S/N, Col. Benito Juárez",
  ciudad: "Ciudad Victoria", estado: "Tamaulipas", cp: "", // PENDIENTE: código postal
  telVentas: "8343182430",
  telServicio: "8343182435",
  whatsapp: "5218343113224",
  horarios: [ // PENDIENTE: confirmar horarios reales
    { dias: "Lunes a viernes", horas: "9:00 a 19:00", schema: "Mo-Fr 09:00-19:00" },
    { dias: "Sábado", horas: "9:00 a 14:00", schema: "Sa 09:00-14:00" },
  ],
  maps: "https://www.google.com/maps/search/?api=1&query=Chevrolet+Jebla+Libramiento+Naciones+Unidas+Ciudad+Victoria+Tamaulipas",
  sitioOficial: "https://www.chevroletvictoriamotors.com.mx/",
};

// PENDIENTE: lista provisional leída del mapa de PMA
export const MUNICIPIOS = ["Victoria", "Güémez", "Padilla", "Hidalgo", "Llera", "Casas", "Jaumave", "Soto la Marina",
  "Jiménez", "San Carlos", "Villagrán", "Mainero", "Bustamante", "Miquihuana", "Palmillas"];

export const INTERESES = [
  { id: "cotizacion", label: "Cotización" },
  { id: "prueba", label: "Prueba de manejo" },
  { id: "financiamiento", label: "Financiamiento" },
  { id: "seminuevos", label: "Auto a cuenta" },
];

const P = "/content/dam/chevrolet/na/mx/es/index/";

// Preferencias para modelos sin versiones publicadas (evita inventar nombres de versión)
const PREFS = [
  { id: "entrada", nombre: "La de mejor precio", trans: "Versión de entrada" },
  { id: "equipada", nombre: "La más equipada", trans: "Tope de gama" },
  { id: "automatica", nombre: "Automática", trans: "Transmisión automática" },
];

const GENERAL_PROMO_LEGAL = "*Consulta términos, condiciones y vigencia en chevrolet.com.mx o con tu asesor.";

// ---------- 7 modelos con página propia ----------
export const MODELOS = [
  {
    slug: "aveo-sedan", nombre: "Aveo Sedán 2026", corto: "Aveo Sedán", cat: "autos", precio: 234800,
    hero: { mob: P + "cars/2026-aveo-sedan/mov/01-images/mh/2026-aveo-mh-xs.jpg", dsk: P + "cars/2026-aveo-sedan/mov/01-images/mh/2026-aveo-mh.jpg", mw: 1000, mh: 1500 },
    lema: "Totalmente renovado.",
    intro: "Líneas estilizadas, mayor seguridad, mejor tecnología y conectividad, con el excelente rendimiento de combustible de siempre.",
    seo: "Chevrolet Aveo Sedán 2026 en Ciudad Victoria desde $234,800. Pantalla de 8\", Apple CarPlay, cámara de reversa y 6 bolsas de aire. Cotiza con Chevrolet Jebla.",
    destacados: [["screen", "Pantalla táctil de 8\"", "Infoentretenimiento a color"], ["phone2", "Android Auto™ y Apple CarPlay™", "Tu celular en la pantalla"], ["cam", "Sensores y cámara", "De visión trasera"], ["shield", "6 bolsas de aire", "En todos los paquetes"]],
    promo: ["48 meses sin intereses*", "Año de seguro gratis*", "0% de comisión por apertura*"],
    versiones: [ // PENDIENTE: confirmar con la planta
      { id: "ls-tm", nombre: "LS", trans: "Manual 5 vel." },
      { id: "lt-tm", nombre: "LT", trans: "Manual 5 vel.", tag: "Más equipada" },
      { id: "lt-plus-cvt", nombre: "LT Plus", trans: "Automática CVT", tag: "Automático" },
    ],
    colores: [["Rojo Metálico", "#9e1b20", "colorizer/jellies/rojo-metalico-v2.jpg"], ["Azul Persuasión", "#8fa6b8", "colorizer/jellies/azul-persuacion-v2.jpg"], ["Acero Metálico", "#55595e", "colorizer/jellies/acero-metalico-v2.jpg"], ["Blanco Polar", "#f3f3f1", "colorizer/jellies/blanco-polar-v2.jpg"], ["Plata Metálico", "#b4b7ba", "colorizer/jellies/plata-metalico-v2.jpg"]].map(c => [c[0], c[1], P + "cars/2026-aveo-sedan/" + c[2]]),
    specs: [["Motor", "1.5 L, 4 cilindros"], ["Potencia", "98 hp"], ["Transmisión", "Manual 5 vel. o CVT"], ["Cajuela", "475 litros"], ["Garantía", "3 años o 60,000 km"]], specsPendiente: true,
    galeria: ["mov/01-images/exterior/2025-aveo-sedan-exterior-01.jpg", "mov/01-images/exterior/2025-aveo-sedan-exterior-03.jpg", "mov/01-images/interior/2026-aveo-interior-02.jpg", "mov/01-images/technology/2025-aveo-sedan-tecnologia-01.jpg", "mov/01-images/interior/2026-aveo-interior-04.jpg", "mov/01-images/exterior/2025-aveo-sedan-exterior-05.jpg"].map(g => P + "cars/2026-aveo-sedan/" + g),
    ficha: P + "cars/2026-aveo-sedan/mov/02-pdf/Ficha-Tecnica-Aveo-Sedan-2026.pdf",
    oficial: "/autos/aveo-sedan-2026",
  },
  {
    slug: "aveo-hb", nombre: "Aveo Hatchback 2026", corto: "Aveo HB", cat: "autos", precio: 228100,
    hero: { mob: P + "cars/2026-aveo-hb/mov/01-images/mh/MOB.jpg", dsk: P + "cars/2026-aveo-hb/mov/01-images/mh/DESK.jpg", mw: 1000, mh: 1000 },
    lema: "Renovación en movimiento.",
    intro: "Para que disfrutes más tus trayectos: versatilidad en diseño y tecnología en un hatchback ágil para la ciudad.",
    seo: "Chevrolet Aveo Hatchback 2026 en Ciudad Victoria desde $228,100. Pantalla de 8\", Apple CarPlay, cámara de reversa y 6 bolsas de aire. Cotiza con Chevrolet Jebla.",
    destacados: [["screen", "Pantalla táctil de 8\"", "Infoentretenimiento a color"], ["phone2", "Android Auto® y Apple CarPlay®", "Tu celular en la pantalla"], ["cam", "Sensores y cámara", "De visión trasera"], ["shield", "6 bolsas de aire", "En todos los paquetes"]],
    promo: ["48 meses sin intereses*", "0% de comisión por apertura*"],
    versiones: null,
    colores: [["Acero Metálico", "#484f55", "03-aveohb-acero-metalico-gir.jpg"], ["Rojo Metálico", "#96030d", "02-aveohb-rojo-metalico-grq.jpg"], ["Azul Persuasión", "#7795a4", "04-aveohb-azul-persuasion-ggb.jpg"], ["Blanco Polar", "#f1f1f1", "05-aveohb-blanco-polar-gbn.jpg"], ["Plata Metálico", "#96a0a6", "06-aveohb-plata-metalico-12u.jpg"], ["Track Yellow", "#a2be01", "07-aveohb-track-yellow-98u.jpg"]].map(c => [c[0], c[1], P + "cars/2026-aveo-hb/colorizer/01-images/jellies/" + c[2]]),
    specs: null,
    galeria: ["01", "02", "03", "04", "06"].map(n => P + "cars/2026-aveo-hb/gallery/01-images/portada/2026-aveohb-galeria-" + n + ".jpg").concat([P + "cars/2026-aveo-hb/mov/01-images/interior/2026-aveohb-interior-01.jpg"]),
    ficha: P + "cars/2026-aveo-hb/mov/02-pdf/ficha-tecnica-aveo-hb-2026.pdf",
    oficial: "/autos/aveo-hb-2026",
  },
  {
    slug: "onix", nombre: "Onix 2026", corto: "Onix", cat: "autos", precio: 257100,
    hero: { mob: P + "cars/2026-onix/mov/01-images/mh/mh-2026-onix-1000x1000.png", dsk: P + "cars/2026-onix/mov/01-images/mh/mh-2026-onix-2250x1000.png", mw: 1000, mh: 1500 },
    lema: "Diseño que habla de ti.",
    intro: "Sedán deportivo con motor turbo eficiente: potencia para disfrutar cada kilómetro y tecnología para estar siempre conectado.",
    seo: "Chevrolet Onix 2026 en Ciudad Victoria desde $257,100. Motor 1.0L Turbo de 116 HP, pantalla de 10.25\" y asistente en tráfico. Cotiza con Chevrolet Jebla.",
    destacados: [["bolt", "Motor 1.0L Turbo", "3 cilindros, 116 HP"], ["screen", "Pantalla de 10.25\"", "Infoentretenimiento táctil"], ["phone2", "Apple CarPlay® y Android Auto®", "Smartphone Integration"], ["shield", "Asistente en tráfico", "Conducción más relajada"]],
    promo: [],
    versiones: [
      { id: "ls-mt", nombre: "LS", trans: "Manual 5 vel." },
      { id: "ls-at", nombre: "LS", trans: "Automática 6 vel." },
      { id: "lt-mt", nombre: "LT", trans: "Manual 5 vel." },
      { id: "lt-at", nombre: "LT", trans: "Automática 6 vel.", tag: "Popular" },
      { id: "premier-redline", nombre: "Premier Redline", trans: "Automática 6 vel.", tag: "Tope de gama" },
    ],
    colores: [["Azul Oxford", "#003c68", "2026-onix/colorizer/01-images/jellies/gkt.png"], ["Azul Eléctrico", "#003292", "2026-onix/colorizer/01-images/jellies/gz9.png"], ["Negro", "#0f1012", "2025-onix/colorizer/jelly/negro.jpg"], ["Gris Platino", "#72787c", "2025-onix/colorizer/jelly/gris-platino.jpg"], ["Blanco", "#eef2f4", "2025-onix/colorizer/jelly/blanco.jpg"], ["Rojo Candy", "#8a0a0a", "2025-onix/colorizer/jelly/rojo-candy.jpg"]].map(c => [c[0], c[1], P + "cars/" + c[2]]),
    specs: [["Motor", "1.0 L Turbo (AT) / 1.3 L (MT)"], ["Potencia", "116 HP (turbo)"], ["Torque", "129 lb-pie (turbo)"], ["Transmisión", "Manual 5 vel. o automática 6 vel."], ["Tanque", "44 litros"], ["Pasajeros", "5"]],
    galeria: ["01", "02", "03", "04", "05", "06"].map(n => P + "cars/2025-onix/gallery/mosaico/moz-gal-" + n + ".jpg"),
    ficha: P + "cars/2026-onix/mov/02-pdf/Ficha-Tecnica-Onix-2026-TLD.pdf",
    oficial: "/autos/onix-2026",
  },
  {
    slug: "groove", nombre: "Groove 2027", corto: "Groove", cat: "suvs", precio: 353500,
    hero: { mob: P + "crossovers-suvs/2027-groove/mov/01-images/00-2027-groove-mh-mobile.jpg", dsk: P + "crossovers-suvs/2027-groove/mov/01-images/00-2027-groove-mh-desktop.jpg", mw: 1000, mh: 1500 },
    lema: "Resalta con tu propio estilo.",
    intro: "SUV compacta con motor 1.5L Turbo de 149 HP, pantalla de 10.25\" y asistencias de seguridad ADAS según versión.",
    seo: "Chevrolet Groove 2027 en Ciudad Victoria desde $353,500. SUV con motor 1.5L Turbo de 149 HP, pantalla de 10.25\" y seguridad ADAS. Cotiza con Chevrolet Jebla.",
    destacados: [["bolt", "Motor 1.5L Turbo", "4 cilindros, 149 HP"], ["screen", "Pantalla de 10.25\"", "Infoentretenimiento táctil"], ["phone2", "Apple CarPlay® y Android Auto®", "Smartphone Integration"], ["shield", "Asistente en tráfico", "Y más asistencias ADAS"]],
    promo: [],
    versiones: [
      { id: "lt-tm", nombre: "LT", trans: "Manual 6 vel." },
      { id: "lt-cvt", nombre: "LT", trans: "Automática CVT", tag: "Popular" },
      { id: "rs-cvt", nombre: "RS", trans: "Automática CVT", tag: "Deportiva" },
    ],
    colores: [["Rojo Metálico", "#9a3037", "lt/jellys/14-2027-groove-colorizer-rojo.png"], ["Azul Royal", "#1e47a1", "lt/jellys/16-2027-groove-colorizer-azul-royal.png"], ["Track Yellow", "#c0e927", "lt/jellys/15-2027-groove-colorizer-track-yellow.png"], ["Negro", "#141414", "lt/jellys/17-2027-groove-colorizer-negro.png"], ["Acero Metálico", "#6b6d6e", "lt/jellys/18-2027-groove-colorizer-acero-metalico.png"], ["Blanco Polar", "#eeeeee", "lt/jellys/19-2027-groove-colorizer-blanco.png"], ["Verde Fluo / Negro (RS)", "#819526", "rs/jellys/02-2027-groove-colorizer-verde-fluo-bitono.png"]].map(c => [c[0], c[1], P + "crossovers-suvs/2027-groove/colorizer/" + c[2]]),
    specs: [["Motor", "1.5 L Turbo, 4 cilindros"], ["Potencia", "149 HP"], ["Torque", "188 lb-pie"], ["Transmisión", "Manual 6 vel. o CVT"], ["Rines", "Aluminio de 17\""], ["Garantía", "3 años o 60,000 km"]],
    galeria: ["01", "02", "03", "04", "05", "06"].map(n => P + "crossovers-suvs/2027-groove/gallery/01-images/portada/" + n + "-2027-groove-galeria-portada-" + n + ".jpg"),
    ficha: P + "crossovers-suvs/2027-groove/mov/02-pdf/Ficha-Tecnica-Groove-2027.pdf",
    oficial: "/suvs/groove-2027",
  },
  {
    slug: "captiva", nombre: "Captiva 2026", corto: "Captiva", cat: "suvs", precio: 358800,
    hero: { mob: P + "crossovers-suvs/2026-captiva/mastheads/v2/2026-captiva-mh-xs.jpg", dsk: P + "crossovers-suvs/2026-captiva/mastheads/v2/2026-captiva-mh.jpg", mw: 1000, mh: 1500 },
    lema: "Espacio para toda la familia.",
    intro: "La SUV familiar con capacidad para hasta 7 pasajeros, pantalla de 10.4\" y 6 bolsas de aire.",
    seo: "Chevrolet Captiva 2026 en Ciudad Victoria desde $358,800. SUV familiar hasta 7 pasajeros, pantalla de 10.4\" y 6 bolsas de aire. Cotiza con Chevrolet Jebla.",
    destacados: [["bolt", "Motor 1.5L", "4 cilindros"], ["screen", "Pantalla de 10.4\"", "Con Smartphone Integration"], ["seat", "Hasta 7 pasajeros", "Espacio para la familia"], ["shield", "6 bolsas de aire", "Frontales, laterales y cortina"]],
    promo: ["60 meses sin intereses*", "Bono de $10,000 por tu auto a cuenta*"],
    versiones: null,
    colores: [["Acero Metálico", "#656c72", "acero.jpg"], ["Negro", "#08080a", "negro.jpg"], ["Blanco", "#eeeef0", "blanco.jpg"], ["Plata", "#9a9fa3", "plata.jpg"], ["Azul Royal", "#0a3c92", "azul-royal.jpg"], ["Rojo", "#b50517", "rojo.jpg"]].map(c => [c[0], c[1], P + "crossovers-suvs/2026-captiva/colorizer/01-images/premier/jellys/" + c[2]]),
    specs: null,
    galeria: ["exterior/2026-captiva-diseno-01.jpg", "exterior/2026-captiva-diseno-02.jpg", "exterior/2026-captiva-diseno-trasero.jpg", "interior/2026-captiva-interior-01.jpg", "interior/2026-captiva-interior-02.jpg", "interior/configuraciones/2026-captiva-interior-viaje-01.jpg"].map(g => P + "crossovers-suvs/2026-captiva/mov/01-images/" + g),
    ficha: P + "crossovers-suvs/2026-captiva/mov/02-pdf/v2/Ficha-Tecnica-Captiva-2026.pdf",
    oficial: "/suvs/captiva-2026",
  },
  {
    slug: "tracker", nombre: "Tracker 2026", corto: "Tracker", cat: "suvs", precio: 425000,
    hero: { mob: P + "crossovers-suvs/2026-tracker/mov/01-images/mh/2026-tracker-mh-xs.jpg", dsk: P + "crossovers-suvs/2026-tracker/mov/01-images/mh/2026-tracker-mh.jpg", mw: 1000, mh: 1500 },
    lema: "Tu camino, tu certeza.",
    intro: "Más que una SUV: diseño renovado, conectividad inalámbrica y seguridad activa para llegar más lejos.",
    seo: "Chevrolet Tracker 2026 en Ciudad Victoria desde $425,000. Motor 1.2L Turbo de 130 HP, pantalla HD de 11\" y conectividad inalámbrica. Cotiza con Chevrolet Jebla.",
    destacados: [["star", "Diseño renovado", "Más deportivo"], ["screen", "Pantalla HD de 11\"", "Y clúster de 8\" multicolor"], ["phone2", "Smartphone Integration", "Inalámbrico"], ["bolt", "Motor 1.2L Turbo", "130 HP"]],
    promo: ["Hasta 48 meses sin intereses*", "Año de seguro gratis*", "Empieza a pagar en febrero 2027*"],
    versiones: null,
    colores: [["Plata Eléctrico", "#8d9296", "01-2026-tracker-colorizer-plata-electrico.jpg"], ["Negro", "#121315", "05-2026-tracker-colorizer-negro.jpg"], ["Blanco", "#eef0f2", "03-2026-tracker-colorizer-blanco.jpg"], ["Azul Neptuno", "#1d3a5c", "04-2026-tracker-colorizer-azul-neptuno.jpg"], ["Negro Oxford", "#1e1c1f", "02-2026-tracker-colorizer-negro-oxford.jpg"], ["Rojo Pop", "#9b1b1d", "06-2026-tracker-colorizer-rojo-pop.jpg"]].map(c => [c[0], c[1], P + "crossovers-suvs/2026-tracker/colorizer/01-images/exterior/" + c[2]]),
    specs: [["Motor", "1.2 L Turbo"], ["Potencia", "130 HP"], ["Pantalla", "HD de 11\""], ["Clúster", "8\" multicolor"]],
    galeria: ["1-1", "1-2", "1-3", "2-1", "2-2", "2-3"].map(n => P + "crossovers-suvs/2026-tracker/gallery/01-images/portada/2026-tracker-galeria-portada" + n + ".jpg"),
    ficha: P + "crossovers-suvs/2026-tracker/mov/02-pdf/ficha-tecnica-tracker-2026.pdf",
    oficial: "/suvs/tracker-2026",
  },
  {
    slug: "trax", nombre: "Trax 2026", corto: "Trax", cat: "suvs", precio: 473300,
    hero: { mob: P + "crossovers-suvs/2026-trax/mov/01-images/mh/mh-2026-trax-xs.jpg", dsk: P + "crossovers-suvs/2026-trax/mov/01-images/mh/mh-2026-trax.jpg", mw: 1000, mh: 1500 },
    lema: "Una SUV tan única como tú.",
    intro: "Tecnología, seguridad y estilo que superan tus expectativas, con OnStar y conectividad inalámbrica.",
    seo: "Chevrolet Trax 2026 en Ciudad Victoria desde $473,300. Motor 1.2L Turbo de 137 HP, OnStar 24/7 y Smartphone Integration inalámbrico. Cotiza con Chevrolet Jebla.",
    destacados: [["bolt", "Motor 1.2L Turbo", "137 HP"], ["shield", "OnStar®", "Asistencia personalizada 24/7"], ["phone2", "Smartphone Integration", "Inalámbrico"], ["star", "A/C electrónico", "Controles electrónicos"]],
    promo: [],
    versiones: null,
    colores: [["Gris Tiburón", "#6e7073", "01-2026-trax-rs-gzb.jpg"], ["Azul Amanecer", "#006089", "02-2026-trax-rs-gkn.jpg"], ["Negro Metálico", "#16171a", "03-2026-trax-rs-gb0jpg.jpg"], ["Blanco", "#eef1f2", "04-2026-trax-rs-gaz.jpg"], ["Rojo Candy", "#8a1012", "05-2026-trax-rs-gas.jpg"], ["Blanco Caribe", "#d9d3cd", "06-2026-trax-rs-g42.jpg"], ["Gris Egeo", "#343c3e", "07-2026-trax-lt-gbd.jpg"]].map(c => [c[0], c[1], P + "crossovers-suvs/2026-trax/colorizer/01-images/exterior/" + c[2]]),
    specs: [["Motor", "1.2 L Turbo"], ["Potencia", "137 HP"], ["Conectividad", "OnStar® 24/7"], ["Smartphone", "Inalámbrico"]],
    galeria: ["gallery/01-images/portada/01-port-trax-galeria.jpg", "gallery/01-images/portada/02-port-trax-galeria.jpg", "gallery/01-images/portada/03-port-trax-galeria.jpg", "mov/01-images/tecnologia/01-2026-trax-tecnologia.jpg", "mov/01-images/tecnologia/02-2026-trax-tecnologia-pantalla.jpg", "mov/01-images/tecnologia/03-2026-trax-tecnologia-cluster.jpg"].map(g => P + "crossovers-suvs/2026-trax/" + g),
    ficha: P + "crossovers-suvs/2026-trax/mov/02-pdf/ficha-tecnica-trax-2026.pdf",
    oficial: "/suvs/trax-2026",
  },
].map(m => ({ ...m, prefs: m.versiones ? null : PREFS, promoLegal: GENERAL_PROMO_LEGAL }));

// ---------- Portafolio completo (catálogo) ----------
const V = "/content/dam/chevrolet/na/mx/es/vdc-collections/";
export const PORTAFOLIO = [
  ["autos", "Aveo HB 2026", 228100, V + "2026/cars/aveo-hb/01-images/2026-aveohb-selector-v2.png", "aveo-hb"],
  ["autos", "Aveo Sedán 2026", 234800, V + "2026/cars/aveo-sedan/01-images/AveoSedan-2026.png", "aveo-sedan"],
  ["autos", "Onix 2026", 257100, V + "2026/cars/onix/01-images/2026-onix.png", "onix"],
  ["suvs", "Groove 2027", 353500, V + "2027/crossovers-and-suvs/groove/00-2027-groove-selector.png", "groove"],
  ["suvs", "Captiva 2026", 358800, V + "2026/crossovers-and-suvs/captiva/01-images/2000x1000-captiva.png", "captiva"],
  ["suvs", "Tracker 2026", 425000, V + "2026/crossovers-and-suvs/tracker/01-images/tracker-v2.png", "tracker"],
  ["suvs", "Trax 2026", 473300, V + "2026/crossovers-and-suvs/trax/01-images/trax.png", "trax"],
  ["suvs", "Blazer 2025", 990900, V + "2025/crossovers-and-suvs/blazer/01-images/Blazer-2025.jpg"],
  ["suvs", "Traverse 2026", 1073600, V + "2026/crossovers-and-suvs/traverse/01-images/traverse.png"],
  ["suvs", "Tahoe 2026", 1883500, V + "2026/crossovers-and-suvs/tahoe/01-images/2026-tahoe-z71-selector-gnt-v4.jpg"],
  ["suvs", "Suburban 2026", 1916500, V + "2026/crossovers-and-suvs/suburban/01-images/2026-suburban.png"],
  ["pickups", "S10 MAX 2027", 408000, V + "2027/pickups-and-trucks/s10-max/01-images/2027-s10-selector.png"],
  ["pickups", "Montana 2026", 483700, V + "2026/pickups-and-trucks/montana/01-images/2026-montana.jpg"],
  ["pickups", "Silverado 2026", 828500, V + "2026/pickups-and-trucks/silverado/01-images/2026-silverado-custom-selector-v2.png"],
  ["pickups", "Colorado 2026", 1044000, V + "2026/pickups-and-trucks/colorado/01-images/2026-colorado-zr2.png"],
  ["pickups", "Cheyenne 2026", 1051100, V + "2026/pickups-and-trucks/cheyenne/01-images/2026-cheyenne-zr2-selector.jpg"],
  ["electricos", "Spark EUV 2026", 389700, V + "2026/electric/spark-euv/Spark-EUV.jpg"],
  ["electricos", "Captiva Híbrida 2026", 519900, V + "2026/electric/captiva-phev/2026-captiva-phev.png"],
  ["electricos", "Equinox EV 2026", 785000, V + "2026/electric/equinox-ev/2026-equinox-ev.jpg"],
  ["electricos", "Express MAX EV 2026", 1079000, V + "2026/electric/express-max-ev/Express-Max-EV.png"],
  ["electricos", "Blazer EV 2026", 1226500, V + "2026/electric/blazer-ev/2026-blazerev-colorizer.jpg"],
].map(([cat, nombre, precio, img, slug]) => ({ cat, nombre, precio, img, slug: slug || null }));

export const CATEGORIAS = { autos: "Autos", suvs: "SUVs", pickups: "Pickups", electricos: "Eléctricos" };

// Banners de campaña del sitio principal (octubre 2026)
const R = "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/";
export const HERO_HOME = [
  { slug: "tracker", modelo: "Tracker 2026", mob: R + "mob-tracker.jpg", dsk: R + "dsk-tracker.jpg" },
  { slug: "captiva", modelo: "Captiva 2026", mob: R + "mob-captiva.jpg", dsk: R + "dsk-captiva.jpg" },
  { slug: "groove", modelo: "Groove 2027", mob: R + "mob-groove.jpg", dsk: R + "dsk-groove.jpg" },
];

// ---------- Preguntas de calificación del lead (formularios de ventas) ----------
// "pts" alimenta la calidad del lead: caliente (≥4), tibio (2–3), frío (≤1).
export const TIEMPOS = [
  { id: "Este mes", label: "Este mes", pts: 2 },
  { id: "De 2 a 3 meses", label: "De 2 a 3 meses", pts: 1 },
  { id: "Solo estoy cotizando", label: "Solo estoy cotizando", pts: 0 },
];
export const ENGANCHES = [
  { id: "Más de $100,000 o de contado", label: "Más de $100,000 o de contado", pts: 3 },
  { id: "De $50,000 a $100,000", label: "De $50,000 a $100,000", pts: 2 },
  { id: "Menos de $50,000", label: "Menos de $50,000", pts: 1 },
  { id: "Busco el enganche mínimo", label: "Busco el enganche mínimo", pts: 0 },
];
