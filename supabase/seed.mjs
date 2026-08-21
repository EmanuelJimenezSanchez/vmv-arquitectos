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
}

run().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
