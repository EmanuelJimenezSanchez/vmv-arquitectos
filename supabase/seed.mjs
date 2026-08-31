/**
 * Carga en Supabase el contenido que antes vivía en `src/data/servicios.ts` y
 * `src/data/galeria.ts`. Es idempotente: se puede correr varias veces y hace
 * upsert por `slug`.
 *
 *   node --env-file=.env supabase/seed.mjs
 *
 * Requiere SUPABASE_SERVICE_ROLE_KEY porque escribe saltándose las políticas
 * RLS. Esa clave solo se usa aquí, nunca en el sitio.
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const R2_BUCKET_URL = process.env.R2_BUCKET_URL?.replace(/\/+$/, '')

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !R2_BUCKET_URL) {
  console.error(
    'Faltan variables de entorno. Necesitas PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY y R2_BUCKET_URL.',
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const services = (file) => `${R2_BUCKET_URL}/services/${file}`
const galeriaImg = (file) => `${R2_BUCKET_URL}/galeria/${file}`
const fotoServicio = (index, alt) => ({
  src: services(`galeria-servicio-${index}.webp`),
  alt,
})

const SERVICIOS = [
  {
    slug: 'servicio-01',
    title: 'Casas y residencias',
    description: 'Diseñamos y construimos hogares a la medida de quien los va a vivir.',
    details: 'Cuéntanos tu idea.',
    footer: 'Residencial',
    image_url: services('servicio-1.webp'),
    image_alt: 'Casa construida por VMV Arquitectos',
    gallery: [
      fotoServicio(1, 'Fachada de una residencia construida por VMV Arquitectos'),
      fotoServicio(2, 'Doble altura en una casa proyectada por VMV Arquitectos'),
      fotoServicio(3, 'Terraza de una residencia construida por VMV Arquitectos'),
      fotoServicio(4, 'Estancia principal de una casa VMV Arquitectos'),
      fotoServicio(5, 'Cocina de una residencia diseñada por VMV Arquitectos'),
      fotoServicio(6, 'Dormitorio principal de una casa proyectada por VMV Arquitectos'),
      fotoServicio(7, 'Baño de una residencia construida por VMV Arquitectos'),
      fotoServicio(8, 'Patio interior de una casa diseñada por VMV Arquitectos'),
      fotoServicio(9, 'Sala de estar de una residencia proyectada por VMV Arquitectos'),
      fotoServicio(10, 'Comedor de una casa construida por VMV Arquitectos'),
      fotoServicio(11, 'Área de juegos de una residencia diseñada por VMV Arquitectos'),
      fotoServicio(12, 'Jardín de una casa proyectada por VMV Arquitectos'),
    ],
  },
  {
    slug: 'servicio-02',
    title: 'Espacios comerciales',
    description: 'Locales y oficinas pensados para funcionar bien y sentirse bien.',
    details: 'Espacios que acompañan a tu actividad y hablan por sí solos.',
    footer: 'Comercial',
    image_url: services('servicio-2.webp'),
    image_alt: 'Espacio comercial construido por VMV Arquitectos',
    gallery: [
      fotoServicio(4, 'Local comercial diseñado por VMV Arquitectos'),
      fotoServicio(7, 'Interior comercial con iluminación de acento'),
      fotoServicio(10, 'Oficinas corporativas proyectadas por VMV Arquitectos'),
      fotoServicio(11, 'Área de recepción de un espacio comercial VMV'),
    ],
  },
  {
    slug: 'servicio-03',
    title: 'Desarrollos verticales',
    description: 'Acompañamos a quienes imaginan proyectos de mayor escala.',
    details:
      'Cuidamos cada metro con la misma atención al detalle y a la experiencia de quien habitará el lugar.',
    footer: 'Desarrollos verticales',
    image_url: services('servicio-3.webp'),
    image_alt: 'Desarrollo vertical diseñado por VMV Arquitectos',
    gallery: [
      fotoServicio(5, 'Torre de departamentos diseñada por VMV Arquitectos'),
      fotoServicio(9, 'Vivienda multifamiliar proyectada por VMV Arquitectos'),
      fotoServicio(8, 'Fachada de un desarrollo vertical sustentable'),
      fotoServicio(12, 'Amenidades de un desarrollo vertical VMV'),
    ],
  },
  {
    slug: 'servicio-04',
    title: 'Interiorismo',
    description: 'El detalle que termina de dar carácter a un espacio.',
    details:
      'Integramos luz, materiales y proporción para que cada lugar se sienta, simplemente, tuyo.',
    footer: 'Interiores',
    image_url: services('servicio-4.webp'),
    image_alt: 'Interior diseñado por VMV Arquitectos',
    gallery: [
      fotoServicio(3, 'Interior residencial diseñado por VMV Arquitectos'),
      fotoServicio(7, 'Detalle de materiales en un interior VMV'),
      fotoServicio(12, 'Remodelación integral de un interior VMV'),
      fotoServicio(6, 'Espacio restaurado y ambientado por VMV Arquitectos'),
    ],
  },
]

const GALERIA = [
  ['galeria-01', 'Galeria de Proyectos', 'Explora nuestra galeria de proyectos arquitectonicos y descubre la creatividad y el diseno que nos distingue.', 1],
  ['galeria-02', 'Innovacion y Sostenibilidad', 'Cada proyecto refleja nuestro compromiso con la innovacion y la sostenibilidad, creando espacios que inspiran y perduran.', 2],
  ['galeria-03', 'Diseño Interior', 'Nuestros diseños interiores combinan funcionalidad y estetica, creando ambientes acogedores y sofisticados.', 3],
  ['galeria-04', 'Espacios Comerciales', 'Transformamos espacios comerciales en experiencias unicas que atraen y retienen a los clientes.', 4],
  ['galeria-05', 'Proyectos Urbanos', 'Participamos en el desarrollo de proyectos urbanos que mejoran la calidad de vida y fomentan la comunidad.', 5],
  ['galeria-06', 'Restauración y Conservación', 'Nos especializamos en la restauración y conservación de edificios históricos, preservando su valor cultural.', 6],
  ['galeria-07', 'Diseño de Interiores Comerciales', 'Creamos interiores comerciales que reflejan la identidad de la marca y mejoran la experiencia del cliente.', 7],
  ['galeria-08', 'Arquitectura Sostenible', 'Implementamos principios de arquitectura sostenible en todos nuestros proyectos, promoviendo un futuro más verde.', 8],
  ['galeria-09', 'Viviendas Multifamiliares', 'Diseñamos viviendas multifamiliares con soluciones eficientes que equilibran privacidad, confort y comunidad.', 9],
  ['galeria-10', 'Espacios Corporativos', 'Creamos espacios corporativos modernos que potencian la productividad, el bienestar y la identidad empresarial.', 10],
  ['galeria-11', 'Hospitalidad y Turismo', 'Diseñamos espacios de hospitalidad y turismo que ofrecen experiencias memorables con alto valor estético y operativo.', 11],
  ['galeria-12', 'Remodelación Integral', 'Ejecutamos remodelaciones integrales que actualizan espacios existentes con propuestas contemporáneas y eficientes.', 12],
].map(([slug, title, description, n], index) => ({
  slug,
  title,
  description,
  image_desktop: galeriaImg(`galeria-desk-${n}.webp`),
  image_mobile: galeriaImg(`galeria-mobile-${n}.webp`),
  orden: index,
  publicado: true,
}))

/**
 * Proyectos del portafolio. El texto es el que el despacho manda a las
 * publicaciones; las imágenes (portada, galería y planos) se cargan desde
 * `/dashboard/proyectos`, así que aquí van vacías.
 */
const PROYECTOS = [
  {
    slug: 'casa-gt',
    title: 'Casa GT',
    tagline: 'Calidez, elegancia y convivencia en un fraccionamiento de Guadalajara.',
    resumen:
      'Una arquitectura contemporánea donde los materiales naturales, la iluminación y los detalles interiores generan una atmósfera acogedora.',
    descripcion: [
      'Ubicada en un fraccionamiento residencial de Guadalajara, Jalisco, Casa GT surge de la intención de crear un espacio que combine calidez, elegancia y convivencia. El concepto parte de una arquitectura contemporánea donde los materiales naturales, la iluminación y los detalles interiores adquieren un papel fundamental para generar una atmósfera acogedora. La chimenea se integra como uno de los elementos centrales de la propuesta, acompañada por una iluminación cálida y luz indirecta en plafones que enfatiza las texturas y aporta profundidad a los espacios.',
      'Uno de los principales retos del proyecto fue encontrar el equilibrio entre amplitud, funcionalidad y carácter arquitectónico. Al tratarse de una vivienda pensada para la convivencia, fue fundamental crear espacios generosos y conectados entre sí, sin perder la sensación de intimidad y confort. La solución se desarrolló mediante una distribución abierta y elementos arquitectónicos que permiten establecer relaciones visuales entre las diferentes áreas de la casa, haciendo que la experiencia espacial sea continua y dinámica.',
      'Las escaleras representan uno de los puntos de mayor importancia dentro del proyecto y fueron concebidas como un elemento protagonista de la vivienda. Para lograrlo, se incorporó un árbol como punto focal, alrededor del cual se desarrolla la composición. Las escaleras flotadas refuerzan la sensación de ligereza, mientras que la iluminación indirecta integrada en cada escalón acentúa su geometría. El muro frontal, revestido con lambrín, genera un fondo cálido y texturizado que complementa la composición y convierte este espacio en uno de los elementos distintivos de Casa GT.',
      'La materialidad responde a una búsqueda de equilibrio entre lo natural y lo contemporáneo. El concreto aparente aporta solidez y carácter, mientras que las vigas de WPC, el lambrín y el cristal introducen calidez, textura y transparencia. Constructivamente, se utilizaron muros de block y losas de vigueta y bovedilla, sistemas que contribuyen al confort interior y al desempeño de la vivienda.',
      'La configuración espacial se planteó para favorecer la amplitud y la convivencia. La sala y el comedor se desarrollan en doble altura, generando un espacio central de gran presencia que se conecta directamente con las áreas sociales exteriores. La relación con la terraza permite extender las actividades hacia el exterior y establecer una continuidad entre la sala, el comedor y los espacios de convivencia al aire libre. El resultado es una vivienda contemporánea y acogedora, donde arquitectura, materialidad e iluminación se integran para crear una experiencia cálida, funcional y atemporal.',
    ].join('\n\n'),
    cover_url: null,
    cover_alt: 'Casa GT, vivienda residencial de VMV Arquitectos en Guadalajara',
    firma: 'VMV Arquitectos',
    tipologia: 'Casa residencial',
    anio: 2026,
    area: '350 m²',
    ubicacion: 'Guadalajara, Jalisco, México',
    niveles: '2 y roof',
    creditos: [
      { rol: 'Diseño arquitectónico', nombre: 'Víctor Manuel Medina Vela' },
      { rol: 'Diseño arquitectónico', nombre: 'Orlando Toache' },
      { rol: 'Diseño arquitectónico', nombre: 'Fabiola Martín del Campo Flores' },
      { rol: 'Fotografías', nombre: 'Miriam Pérez' },
    ],
  },
  {
    slug: 'casa-dm',
    title: 'Casa DM',
    tagline: 'Un legado familiar transformado bajo la filosofía Wabi-Sabi.',
    resumen:
      'Casa DM retoma una estructura existente de diez años heredada por la familia y la convierte en una vivienda contemporánea de líneas simples y materiales honestos.',
    descripcion: [
      'Ubicada en un exclusivo club de golf de la Ciudad de México, el concepto central de Casa DM se enfoca en la transformación y el respeto por el legado familiar. El proyecto consistió en retomar y aprovechar casi en su totalidad una estructura existente con diez años de antigüedad que pertenecía a los abuelos de los clientes, adaptándola a un estilo moderno inspirado en la filosofía Wabi-Sabi, donde predominan las líneas simples y la honestidad de los materiales.',
      'El principal desafío radicó en la gran escala de la construcción original; los clientes buscaban conservar la mayor cantidad de área construida, lo que limitó los metros cuadrados de nuevo diseño a pequeñas demoliciones estratégicas para liberar la estructura actual sin comprometer su estabilidad.',
      'Para resolver los espacios comunes de grandes claros y plantas abiertas, se implementó técnicamente un sistema de losas aligeradas, logrando una espectacular altura y media en las zonas de sala y comedor. La paleta material destaca por el uso de acabados en chukum y la integración de celosías prefabricadas, elementos seleccionados por su textura y ligereza visual.',
      'Aprovechando las dimensiones de un terreno de 909 m² para una construcción de 526 m², la configuración espacial priorizó el confort térmico y la ventilación cruzada. Esto se logró mediante el diseño de dos pasillos laterales que funcionan como conectores de aire y luz, vinculando el interior con un enorme patio posterior que aísla la vivienda y consolida un refugio contemporáneo lleno de serenidad.',
    ].join('\n\n'),
    cover_url: null,
    cover_alt: 'Casa DM, vivienda residencial de VMV Arquitectos en la Ciudad de México',
    firma: 'VMV Arquitectos',
    tipologia: 'Casa residencial',
    anio: 2026,
    area: '526 m²',
    ubicacion: 'Ciudad de México, México',
    niveles: '',
    creditos: [{ rol: 'Renders', nombre: 'Orlando Toache' }],
  },
  {
    slug: 'casa-arenal',
    title: 'Casa Arenal',
    tagline: 'La fusión de una estructura preexistente con una nueva residencia.',
    resumen:
      'Casa Arenal integra la etapa original del terreno con una propuesta contemporánea para que ambas funcionen como una sola pieza arquitectónica.',
    descripcion: [
      'Ubicada en una zona residencial del Arenal, Jalisco, Casa Arenal surge bajo la premisa formal de la fusión, buscando integrar, adaptar y aprovechar al máximo una estructura preexistente que ya se encontraba edificada en el terreno. La intención principal del proyecto fue consolidar una nueva residencia de 354 m² de construcción, logrando un acoplamiento limpio donde la etapa original y la nueva propuesta se conectan para funcionar como una sola pieza arquitectónica. El resultado es una vivienda que conserva la memoria del lugar mientras incorpora una imagen contemporánea, equilibrada y funcional.',
      'El principal contratiempo y desafío del proyecto radicó en responder de manera inteligente a un entorno urbano complejo y poco consolidado visualmente en esta región de Jalisco. Esta condición particular del sitio exigió el diseño de una fachada sólida, segura y de marcada horizontalidad, cuya volumetría lograra mantener una proporción geométrica clara y equilibrada a lo largo de las generosas dimensiones del predio. La composición arquitectónica buscó transmitir privacidad hacia el exterior sin perder la sensación de amplitud y conexión con el entorno inmediato.',
      'Para lograr este equilibrio de resguardo sin recurrir al uso de una fachada completamente ciega o aislada de la vía pública, la configuración espacial aprovechó estratégicamente la amplitud de un terreno de 488 m² para priorizar la iluminación natural en cada rincón. Esto se resolvió mediante una distribución funcional de ventanas en distintas alturas y grandes ventanales orientados hacia jardines perimetrales y patios exteriores, logrando inundar los interiores de luz natural constante mientras se controlan las vistas directas hacia la calle. Esta estrategia también favorece una relación continua entre los espacios interiores y las áreas exteriores, mejorando la experiencia cotidiana de los usuarios.',
      'Técnicamente, la obra solucionó el empalme de ambas etapas constructivas mediante un sistema estructural mixto de cubiertas, compuesto por losas aligeradas y losas prefabricadas de vigueta y bovedilla, optimizando el cálculo de los grandes claros y el desempeño estructural. El proyecto emplea materiales de la región como el ladrillo e incorpora de manera precisa elementos de acero estructural, fachaletas y lambrines que aportan calidez, ritmo y una absoluta coherencia a la integración final del edificio.',
    ].join('\n\n'),
    cover_url: null,
    cover_alt: 'Casa Arenal, vivienda residencial de VMV Arquitectos en El Arenal, Jalisco',
    firma: 'VMV Arquitectos',
    tipologia: 'Casa residencial',
    anio: null,
    area: '354 m²',
    ubicacion: 'El Arenal, Jalisco, México',
    niveles: '',
    creditos: [],
  },
  {
    slug: 'casa-gl',
    title: 'Casa GL',
    tagline: 'Orden, elegancia y una paleta monocromática en Ciudad Juárez.',
    resumen:
      'Un ejercicio de simplificación arquitectónica: volúmenes de líneas rectas y una estética limpia y atemporal pensada para el descanso absoluto.',
    descripcion: [
      'Ubicada en una zona residencial de Ciudad Juárez, Chihuahua, Casa GL se proyecta como un ejercicio de simplificación arquitectónica donde el orden y la elegancia se vuelven protagonistas. El concepto nace de la búsqueda de un entorno de descanso absoluto, logrado a través de volúmenes de líneas rectas y una paleta monocromática que define una estética limpia y atemporal.',
      'El desafío principal del proyecto surgió desde el suelo: un terreno plano situado por debajo del nivel de la calle que obligó a elevar el desplante de la obra. Esta complejidad topográfica se resolvió mediante un diseño inteligente de taludes, logrando una integración armónica que cumplió con el reto de mantener un presupuesto optimizado sin comprometer la visión arquitectónica.',
      'Para responder a las exigencias del clima extremo de la región, se implementó un sistema constructivo mixto que prioriza la eficiencia térmica. Mientras que el exterior destaca por una fachada sobria de concreto aparente en tonos oscuros y muros de block, el núcleo de la vivienda utiliza tecnología de ecomuro y losas de vigueta y bovedilla para garantizar el confort interior. El exterior se equilibra con una selección de materiales internos como mármol, lambrín y aluminio, que generan calidez y sofisticación a cada rincón.',
      'Finalmente, la configuración espacial de la casa se rige por una circulación lineal y áreas abiertas que eliminan las jerarquías visuales, fomentando una convivencia familiar fluida en un espacio que no solo aporta orden al perfil urbano, sino que se convierte en un santuario de serenidad para quienes lo habitan.',
    ].join('\n\n'),
    cover_url: null,
    cover_alt: 'Casa GL, vivienda residencial de VMV Arquitectos en Ciudad Juárez',
    firma: 'VMV Arquitectos',
    tipologia: 'Casa residencial',
    anio: null,
    area: '',
    ubicacion: 'Ciudad Juárez, Chihuahua, México',
    niveles: '',
    creditos: [],
  },
]

const run = async () => {
  for (const [index, { gallery, ...servicio }] of SERVICIOS.entries()) {
    const { data, error } = await supabase
      .from('servicios')
      .upsert({ ...servicio, orden: index, publicado: true }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (error) {
      throw new Error(`servicios/${servicio.slug}: ${error.message}`)
    }

    await supabase.from('servicio_fotos').delete().eq('servicio_id', data.id)

    if (gallery.length > 0) {
      const { error: fotosError } = await supabase.from('servicio_fotos').insert(
        gallery.map((foto, orden) => ({
          servicio_id: data.id,
          src: foto.src,
          alt: foto.alt,
          orden,
        })),
      )
      if (fotosError) {
        throw new Error(`servicio_fotos/${servicio.slug}: ${fotosError.message}`)
      }
    }

    console.log(`✓ ${servicio.slug} (${gallery.length} fotos)`)
  }

  const { error: galeriaError } = await supabase
    .from('galeria')
    .upsert(GALERIA, { onConflict: 'slug' })

  if (galeriaError) {
    throw new Error(`galeria: ${galeriaError.message}`)
  }
  console.log(`✓ galería (${GALERIA.length} entradas)`)

  for (const [index, { creditos, ...proyecto }] of PROYECTOS.entries()) {
    const { data, error } = await supabase
      .from('proyectos')
      .upsert({ ...proyecto, orden: index, publicado: true }, { onConflict: 'slug' })
      .select('id')
      .single()

    if (error) {
      throw new Error(`proyectos/${proyecto.slug}: ${error.message}`)
    }

    await supabase.from('proyecto_creditos').delete().eq('proyecto_id', data.id)

    if (creditos.length > 0) {
      const { error: creditosError } = await supabase.from('proyecto_creditos').insert(
        creditos.map((credito, orden) => ({
          proyecto_id: data.id,
          rol: credito.rol,
          nombre: credito.nombre,
          orden,
        })),
      )
      if (creditosError) {
        throw new Error(`proyecto_creditos/${proyecto.slug}: ${creditosError.message}`)
      }
    }

    console.log(`✓ ${proyecto.slug} (${creditos.length} colaboradores)`)
  }
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
