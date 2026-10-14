/* =========================================================
   DATOS DEL MODELO — Aveo Sedán 2026
   Precio "desde", promo y colores: sitio principal (14 oct 2026).
   Versiones y especificaciones: PENDIENTE confirmar con la ficha técnica.
   ========================================================= */
window.MODELO = {
  id: "aveo-sedan-2026",
  nombre: "Aveo Sedán 2026",
  nombreCorto: "Aveo Sedán",
  precioDesde: 234800,
  base: "/content/dam/chevrolet/na/mx/es/index/cars/2026-aveo-sedan/",

  hero: { mob: "mov/01-images/mh/2026-aveo-mh-xs.jpg", dsk: "mov/01-images/mh/2026-aveo-mh.jpg" },

  // Promoción vigente publicada en el sitio principal (octubre 2026)
  promo: {
    titulo: "Promoción de octubre",
    puntos: ["48 meses sin intereses*", "Año de seguro gratis*", "0% de comisión por apertura*"],
    legal: "*Consulta términos, condiciones y vigencia en chevrolet.com.mx o con tu asesor."
  },

  // PENDIENTE: confirmar nombres y precios por versión con la planta.
  // Si se conoce el precio, ponlo en "precio"; si es null se muestra "Pide tu precio".
  versiones: [
    { id: "ls-tm", nombre: "LS", trans: "Manual 5 vel.", precio: null,
      puntos: ["6 bolsas de aire", "Control de estabilidad", "Rines de aluminio de 15\"", "Aire acondicionado"] },
    { id: "lt-tm", nombre: "LT", trans: "Manual 5 vel.", precio: null, tag: "Más equipada",
      puntos: ["Pantalla táctil de 8\"", "Android Auto™ y Apple CarPlay™", "Cámara y sensores de reversa", "A/C electrónico"] },
    { id: "lt-plus-cvt", nombre: "LT Plus", trans: "Automática CVT", precio: null, tag: "Automático",
      puntos: ["Equipamiento de la versión LT", "Transmisión automática CVT"] }
  ],

  colores: [
    { nombre: "Rojo Metálico", hex: "#9e1b20", img: "colorizer/jellies/rojo-metalico-v2.jpg" },
    { nombre: "Azul Persuasión", hex: "#8fa6b8", img: "colorizer/jellies/azul-persuacion-v2.jpg" },
    { nombre: "Acero Metálico", hex: "#55595e", img: "colorizer/jellies/acero-metalico-v2.jpg" },
    { nombre: "Blanco Polar", hex: "#f3f3f1", img: "colorizer/jellies/blanco-polar-v2.jpg" },
    { nombre: "Plata Metálico", hex: "#b4b7ba", img: "colorizer/jellies/plata-metalico-v2.jpg" }
  ],

  // Equipamiento destacado (publicado en el sitio principal)
  destacados: [
    { icon: "screen", titulo: "Pantalla táctil de 8\"", texto: "Infoentretenimiento a color" },
    { icon: "phone2", titulo: "Android Auto™ y Apple CarPlay™", texto: "Tu celular en la pantalla" },
    { icon: "cam", titulo: "Cámara y sensores", texto: "Visión trasera para estacionarte fácil" },
    { icon: "shield", titulo: "6 bolsas de aire", texto: "En todos los paquetes" }
  ],

  // PENDIENTE: validar contra la ficha técnica oficial
  specs: [
    { k: "Motor", v: "1.5 L, 4 cilindros" },
    { k: "Potencia", v: "98 hp" },
    { k: "Transmisión", v: "Manual 5 vel. o CVT" },
    { k: "Cajuela", v: "475 litros" },
    { k: "Garantía", v: "3 años o 60,000 km" }
  ],

  galeria: [
    { img: "mov/01-images/exterior/2025-aveo-sedan-exterior-01.jpg", alt: "Aveo Sedán exterior" },
    { img: "mov/01-images/exterior/2025-aveo-sedan-exterior-03.jpg", alt: "Aveo Sedán vista lateral" },
    { img: "mov/01-images/interior/2026-aveo-interior-02.jpg", alt: "Interior del Aveo Sedán" },
    { img: "mov/01-images/technology/2025-aveo-sedan-tecnologia-01.jpg", alt: "Pantalla táctil del Aveo Sedán" },
    { img: "mov/01-images/interior/2026-aveo-interior-04.jpg", alt: "Asientos del Aveo Sedán" },
    { img: "mov/01-images/exterior/2025-aveo-sedan-exterior-05.jpg", alt: "Aveo Sedán vista trasera" }
  ],

  fichaTecnica: "https://www.chevroletvictoriamotors.com.mx/content/dam/chevrolet/na/mx/es/index/cars/2026-aveo-sedan/mov/02-pdf/Ficha-Tecnica-Aveo-Sedan-2026.pdf",
  paginaOficial: "https://www.chevroletvictoriamotors.com.mx/autos/aveo-sedan-2026"
};
