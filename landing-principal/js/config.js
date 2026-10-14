/* =========================================================
   CONFIGURACIÓN DE LA LANDING — Chevrolet Jebla Ciudad Victoria
   Edita SOLO este archivo para cambiar datos, modelos y textos.
   Los valores marcados con PENDIENTE deben confirmarse.
   ========================================================= */
window.JEBLA = {
  dealer: {
    nombre: "Chevrolet Jebla Ciudad Victoria",
    direccion: "Libramiento Naciones Unidas S/N, Col. Benito Juárez, Cd. Victoria, Tamaulipas",
    telVentas: "8343182430",          // 83-4318-2430
    telServicio: "8343182435",        // 83-4318-2435
    whatsapp: "5218343113224",        // 83-4311-3224 (formato internacional para wa.me)
    whatsappVisible: "834 311 3224",
    horarios: "Lun a Vie 9:00–19:00 · Sáb 9:00–14:00", // PENDIENTE: confirmar horarios reales
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Chevrolet+Jebla+Libramiento+Naciones+Unidas+Ciudad+Victoria+Tamaulipas",
    avisoPrivacidadUrl: "#aviso-privacidad", // PENDIENTE: URL del aviso de privacidad del distribuidor
    sitioPrincipal: "https://www.chevroletvictoriamotors.com.mx/"
  },

  // Imágenes: por ahora se cargan desde el sitio de la planta.
  // Cuando tengamos los archivos en /assets, cambia "cdn" por "assets/".
  cdn: "https://www.chevroletvictoriamotors.com.mx",

  // Banners del hero (campaña de octubre 2026 del sitio principal)
  hero: [
    { modelo: "Tracker 2026", mob: "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/mob-tracker.jpg", dsk: "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/dsk-tracker.jpg", alt: "Chevrolet Tracker 2026 — promoción de octubre" },
    { modelo: "Captiva 2026", mob: "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/mob-captiva.jpg", dsk: "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/dsk-captiva.jpg", alt: "Chevrolet Captiva 2026 — promoción de octubre" },
    { modelo: "Groove 2027", mob: "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/mob-groove.jpg", dsk: "/content/dam/chevrolet/na/mx/es/index/retail/2026/octubre/v2/dsk-groove.jpg", alt: "Chevrolet Groove — promoción de octubre" }
  ],

  // Portafolio con precios "Desde" tomados del sitio principal (14 oct 2026)
  modelos: [
    { cat: "autos", nombre: "Aveo HB 2026", precio: 228100, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/cars/aveo-hb/01-images/2026-aveohb-selector-v2.png" },
    { cat: "autos", nombre: "Aveo Sedán 2026", precio: 234800, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/cars/aveo-sedan/01-images/AveoSedan-2026.png" },
    { cat: "autos", nombre: "Onix 2026", precio: 257100, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/cars/onix/01-images/2026-onix.png" },
    { cat: "suvs", nombre: "Groove 2027", precio: 353500, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2027/crossovers-and-suvs/groove/00-2027-groove-selector.png", badge: "Nuevo" },
    { cat: "suvs", nombre: "Captiva 2026", precio: 358800, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/crossovers-and-suvs/captiva/01-images/2000x1000-captiva.png", badge: "Promoción" },
    { cat: "suvs", nombre: "Tracker 2026", precio: 425000, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/crossovers-and-suvs/tracker/01-images/tracker-v2.png", badge: "Hasta 48 MSI" },
    { cat: "suvs", nombre: "Trax 2026", precio: 473300, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/crossovers-and-suvs/trax/01-images/trax.png" },
    { cat: "suvs", nombre: "Blazer 2025", precio: 990900, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2025/crossovers-and-suvs/blazer/01-images/Blazer-2025.jpg" },
    { cat: "suvs", nombre: "Traverse 2026", precio: 1073600, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/crossovers-and-suvs/traverse/01-images/traverse.png" },
    { cat: "suvs", nombre: "Tahoe 2026", precio: 1883500, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/crossovers-and-suvs/tahoe/01-images/2026-tahoe-z71-selector-gnt-v4.jpg" },
    { cat: "suvs", nombre: "Suburban 2026", precio: 1916500, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/crossovers-and-suvs/suburban/01-images/2026-suburban.png" },
    { cat: "pickups", nombre: "S10 MAX 2027", precio: 408000, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2027/pickups-and-trucks/s10-max/01-images/2027-s10-selector.png" },
    { cat: "pickups", nombre: "Montana 2026", precio: 483700, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/pickups-and-trucks/montana/01-images/2026-montana.jpg" },
    { cat: "pickups", nombre: "Silverado 2026", precio: 828500, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/pickups-and-trucks/silverado/01-images/2026-silverado-custom-selector-v2.png" },
    { cat: "pickups", nombre: "Colorado 2026", precio: 1044000, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/pickups-and-trucks/colorado/01-images/2026-colorado-zr2.png" },
    { cat: "pickups", nombre: "Cheyenne 2026", precio: 1051100, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/pickups-and-trucks/cheyenne/01-images/2026-cheyenne-zr2-selector.jpg" },
    { cat: "electricos", nombre: "Spark EUV 2026", precio: 389700, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/electric/spark-euv/Spark-EUV.jpg", badge: "Eléctrico" },
    { cat: "electricos", nombre: "Captiva Híbrida 2026", precio: 519900, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/electric/captiva-phev/2026-captiva-phev.png", badge: "Híbrido" },
    { cat: "electricos", nombre: "Equinox EV 2026", precio: 785000, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/electric/equinox-ev/2026-equinox-ev.jpg", badge: "Eléctrico" },
    { cat: "electricos", nombre: "Express MAX EV 2026", precio: 1079000, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/electric/express-max-ev/Express-Max-EV.png", badge: "Eléctrico" },
    { cat: "electricos", nombre: "Blazer EV 2026", precio: 1226500, img: "/content/dam/chevrolet/na/mx/es/vdc-collections/2026/electric/blazer-ev/2026-blazerev-colorizer.jpg", badge: "Eléctrico" }
  ],

  categorias: { autos: "Autos", suvs: "SUVs", pickups: "Pickups", electricos: "Eléctricos" },

  intereses: [
    { id: "cotizacion", label: "Cotización" },
    { id: "prueba", label: "Prueba de manejo" },
    { id: "financiamiento", label: "Financiamiento" },
    { id: "seminuevos", label: "Seminuevos" },
    { id: "servicio", label: "Cita de servicio" }
  ],

  // PENDIENTE: lista provisional leída del mapa de PMA; confirmar con la planta
  municipios: [
    "Victoria", "Güémez", "Padilla", "Hidalgo", "Llera", "Casas", "Jaumave",
    "Soto la Marina", "Jiménez", "San Carlos", "Villagrán", "Mainero",
    "Bustamante", "Miquihuana", "Palmillas", "Otro municipio"
  ]
};
