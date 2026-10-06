/**
 * Diccionario en español. Es la referencia: `en.ts` se tipa contra este objeto,
 * así que cualquier clave que se agregue aquí y falte allá rompe el build.
 *
 * Las marcas `{algo}` son huecos que se rellenan con `format()`.
 */
export const es = {
  common: {
    brand: 'VMV Arquitectos',
  },

  nav: {
    home: 'Inicio',
    about: 'Nosotros',
    services: 'Servicios',
    projects: 'Proyectos',
    process: 'Proceso',
    contact: 'Contacto',
    homeAria: 'Inicio VMV Arquitectos',
    mainAria: 'Navegación principal',
    openMenu: 'Abrir menú',
    writeToUs: 'Escríbenos',
  },

  language: {
    label: 'Idioma',
    switchAria: 'Cambiar idioma',
  },

  theme: {
    toggleTitle: 'Cambiar tema',
    toDark: 'Activar modo oscuro',
    toLight: 'Activar modo claro',
  },

  hero: {
    sectionAria: 'Hero principal',
    title: 'Arquitectura, diseño y construcción',
    phrases: [
      'Más de 14 años de experiencia',
      'Más de 500 proyectos',
      'Con base en Guadalajara · Proyectos en todo México',
    ],
    description: 'Cuando decides construir, lo importante es sentirte acompañado.',
  },

  about: {
    heading: 'NOSOTROS',
    cta: 'Conócenos',
    reveal: 'El lujo está en el detalle. Nosotros lo cuidamos por ti.',
    imageLeftAlt: 'Diseño arquitectónico VMV Arquitectos',
    imageRightAlt: 'Construcción de lujo VMV Arquitectos',
  },

  services: {
    sectionAria: 'Servicios de la constructora',
    overline: 'Lo que hacemos',
    title: 'Acompañamos cada etapa de tu proyecto',
    body: 'Del concepto a la obra terminada, cuidamos el diseño, los tiempos y cada acabado.',
    cta: 'Cuéntanos tu idea',
    viewImages: 'Ver imágenes',
    viewGalleryOf: 'Ver galería de {title}',
    prev: 'Servicio anterior',
    next: 'Servicio siguiente',
    galleryClose: 'Cerrar galería del servicio',
    galleryPrev: 'Foto anterior',
    galleryNext: 'Foto siguiente',
    galleryPhotos: 'Fotos del servicio',
    galleryFooter: 'Servicios',
  },

  coverage: {
    overline: 'Dónde construimos',
    title: 'Alcance',
    body: 'Ejecutamos obra y supervisión en toda la República. Pasa el cursor sobre un estado para ubicarlo en el mapa.',
  },

  process: {
    sectionAria: 'Nuestro proceso de trabajo',
    overline: 'Nuestro proceso',
    title: 'De la idea a la obra terminada',
    body: 'Cinco etapas claras que acompañan tu proyecto desde la primera conversación hasta la última entrega. Pasa el cursor sobre cada paso para conocer los detalles.',
    steps: [
      {
        title: 'Detección de necesidades',
        description: 'Entrevista para evaluar el proyecto y sus necesidades.',
        imageAlt: 'Reunión inicial para detectar las necesidades del proyecto',
      },
      {
        title: 'Anteproyecto',
        description: 'Elaboración de propuestas para resolver las necesidades.',
        imageAlt: 'Propuestas de anteproyecto elaboradas por VMV Arquitectos',
      },
      {
        title: 'Proyecto ejecutivo e imágenes 3D',
        description:
          'Una vez autorizada la propuesta, se crea toda la volumetría y 3D necesarias para el proyecto.',
        imageAlt: 'Volumetría e imágenes 3D del proyecto ejecutivo',
      },
      {
        title: 'Cotización',
        description:
          'Todas nuestras cotizaciones están hechas por precios unitarios que son el desglose de todas las actividades del proyecto.',
        imageAlt: 'Desglose de precios unitarios de la cotización',
      },
      {
        title: 'Ejecución de obra',
        description:
          'Supervisión de actividades por parte de arquitectos e ingenieros para garantizar la calidad de cada proyecto.',
        imageAlt: 'Supervisión de la ejecución de obra por arquitectos e ingenieros',
      },
    ],
  },

  contact: {
    sectionAria: 'Formulario de contacto',
    overline: 'Contacto',
    title: 'Conversemos tu proyecto',
    body: 'Cuéntanos un poco sobre lo que tienes en mente. Nos pondremos en contacto contigo por WhatsApp o e-mail para conversar los siguientes pasos.',
    modalClose: 'Cerrar formulario de contacto',
  },

  form: {
    firstName: 'Nombre(s)',
    lastName: 'Apellido(s)',
    email: 'E-mail',
    phone: 'Teléfono',
    consideringBuilding: '¿Estás considerando construir?',
    hasLand: '¿Ya cuentas con un terreno?',
    yes: 'Sí',
    no: 'No',
    message: 'Mensaje',
    messagePlaceholder: 'Cuéntanos sobre tu proyecto.',
    note: 'Te contactaremos por WhatsApp o e-mail en las próximas horas.',
    submit: 'Enviar',
    successTitle: 'Gracias por escribirnos',
    successBody:
      'Hemos recibido tu mensaje. Te contactaremos por WhatsApp o e-mail en las próximas horas.',
    sendAnother: 'Enviar otro mensaje',
    sendError: 'No se pudo enviar el mensaje. Escríbenos a ventas@vmvarquitectos.com.',
    privacyBefore: 'Al enviar aceptas nuestro ',
    privacyLink: 'aviso de privacidad',
    privacyAfter: '.',
  },

  footer: {
    sectionAria: 'Pie de página',
    tagline:
      'Diseñamos y construimos espacios funcionales y estéticos, cuidando cada detalle del proyecto hasta la entrega final.',
    backToTop: 'Volver arriba',
    navHeading: 'Navegación',
    navAria: 'Navegación del pie de página',
    contactHeading: 'Contacto',
    socialHeading: 'Síguenos',
    paymentsIntro: 'Pregunta por nuestras formas de pago.',
    paymentsHighlight: 'Meses sin intereses',
    paymentsAria: 'Métodos de pago',
    rights: '© {year} VMV Arquitectos. Todos los derechos reservados.',
    signature: 'Diseño y construcción',
    privacy: 'Aviso de privacidad',
    cookiePreferences: 'Preferencias de cookies',
  },

  cookies: {
    aria: 'Aviso de cookies',
    message:
      'Usamos cookies para medir las visitas y mostrar anuncios de VMV Arquitectos. Puedes rechazarlas sin que cambie tu navegación. Más información en nuestro',
    privacyLink: 'aviso de privacidad',
    accept: 'Aceptar',
    reject: 'Rechazar',
  },

  loader: {
    aria: 'Cargando VMV Arquitectos',
    phrases: ['Espacios pensados para habitar', 'Diseño, detalle y oficio'],
  },

  gallery: {
    sectionAria: 'Galería visual de proyectos',
  },

  projects: {
    overline: 'Portafolio',
    title: 'Proyectos',
    body: 'Espacios residenciales y comerciales donde diseño, interiorismo y obra se resuelven con un solo equipo.',
    countLabel: '{count} proyectos',
    listOverline: 'Obra construida',
    listTitle: 'Selección de trabajos',
    viewProject: 'Ver proyecto',
    viewProjectAria: 'Ver proyecto {title}',
    levels: '{count} niveles',
    ctaOverline: 'Siguiente proyecto',
    ctaTitle: '¿Empezamos con el tuyo?',
    ctaBody:
      'Cuéntanos qué tienes en mente y te acompañamos desde el primer trazo hasta la entrega.',
    ctaButton: 'Cuéntanos tu idea',
  },

  project: {
    counter: 'Proyecto {index} / {total}',
    breadcrumbAria: 'Migas de pan',
    allProjects: 'Todos los proyectos',
    bodyHeading: 'El proyecto',
    cta: 'Cuéntanos tu idea',
    viewAll: 'Ver todas',
    galleryClose: 'Cerrar galería',
    galleryPrev: 'Anterior',
    galleryNext: 'Siguiente',
    galleryThumbs: 'Miniaturas',
    sheetHeading: 'Ficha técnica',
    collaborators: 'Colaboradores',
    galleryOverline: 'Galería',
    galleryHeading: 'El proyecto por dentro',
    plansOverline: 'Documentos técnicos',
    plansHeading: 'Planos del proyecto',
    photoLabel: 'Fotografía {index}',
    zoomPlan: 'Ampliar el plano {title}',
    planAlt: 'Plano {title} del proyecto {project}',
    nextOverline: 'Explora el siguiente proyecto',
    closingOverline: 'Hablemos',
    closingTitle: 'Tu proyecto puede ser el siguiente',
    notFoundTitle: 'Proyecto no encontrado',
    notFoundCta: 'Ver todos los proyectos',
    notFoundBody: 'El identificador solicitado no existe o aún no está publicado.',
    sheet: {
      firma: 'Firma',
      tipologia: 'Tipología',
      anio: 'Año de construcción',
      area: 'Área útil',
      ubicacion: 'Localización',
      niveles: 'Niveles',
    },
    heroData: {
      ubicacion: 'Ubicación',
      anio: 'Año',
      area: 'Área',
    },
  },

  notFound: {
    overline: 'Error 404',
    title: 'Esta página no existe',
    body: 'Puede que el enlace haya cambiado. Vuelve al inicio o revisa el portafolio de proyectos.',
    home: 'Ir al inicio',
    projects: 'Ver proyectos',
  },

  seo: {
    homeTitle: 'VMV Arquitectos | Diseño y construcción de espacios para habitar',
    homeDescription:
      'Despacho de arquitectura, interiorismo y construcción. Espacios residenciales y comerciales pensados para vivirse. Con base en Guadalajara y proyectos en todo México.',
    projectsTitle: 'Proyectos de arquitectura e interiorismo | VMV Arquitectos',
    projectsDescription:
      'Portafolio de VMV Arquitectos: obra construida de arquitectura, interiorismo y construcción en proyectos residenciales y comerciales en Guadalajara y todo México.',
    projectTitle: '{title} | Proyecto | VMV Arquitectos',
    projectNotFoundTitle: 'Proyecto no encontrado | VMV Arquitectos',
    projectNotFoundDescription: 'El proyecto que buscas no está disponible.',
    projectFallbackDescription: '{title}: proyecto de {type} de VMV Arquitectos{location}{year}.',
    projectFallbackType: 'arquitectura',
    projectFallbackLocation: ' en {location}',
    projectFallbackYear: ' ({year})',
    notFoundTitle: 'Página no encontrada | VMV Arquitectos',
    notFoundDescription: 'La página que buscas no existe o cambió de dirección.',
    privacyTitle: 'Aviso de privacidad | VMV Arquitectos',
    privacyDescription:
      'Cómo VMV Arquitectos recaba, usa y protege tus datos personales, qué cookies usa el sitio y cómo ejercer tus derechos ARCO.',
    ogAlt: 'VMV Arquitectos — Diseño y construcción de espacios para habitar',
    organizationDescription:
      'Despacho de arquitectura, interiorismo y construcción. Espacios residenciales y comerciales pensados para vivirse. Con base en Guadalajara y proyectos en todo México.',
    country: 'México',
    knowsAbout: [
      'Arquitectura residencial',
      'Arquitectura comercial',
      'Interiorismo',
      'Construcción',
      'Remodelación',
    ],
    servicesCatalog: 'Servicios de VMV Arquitectos',
  },
} as const

/**
 * `as const` congela cada texto en su propio tipo literal, lo que impediría que
 * otro idioma escribiera algo distinto. Esto ensancha los literales a `string`
 * conservando la forma, de modo que `en.ts` queda obligado a tener exactamente
 * las mismas claves pero libre en su contenido.
 */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly Widen<Item>[]
    : { readonly [K in keyof T]: Widen<T[K]> }

export type Dictionary = Widen<typeof es>
