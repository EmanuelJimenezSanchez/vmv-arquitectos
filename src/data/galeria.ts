export interface Galeria {
  id: string
  title: string
  description: string
  images: {
    desktop: string
    mobile: string
  }
}

const BUCKET_URL = `${import.meta.env.R2_BUCKET_URL}/galeria`;

export const galeria: Galeria[] = [
  {
    id: 'galeria-01',
    title: 'Galeria de Proyectos',
    description:
      'Explora nuestra galeria de proyectos arquitectonicos y descubre la creatividad y el diseno que nos distingue.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-1.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-1.webp`,
    },
  },
  {
    id: 'galeria-02',
    title: 'Innovacion y Sostenibilidad',
    description:
      'Cada proyecto refleja nuestro compromiso con la innovacion y la sostenibilidad, creando espacios que inspiran y perduran.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-2.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-2.webp`,
    },
  },
  {
    id: 'galeria-03',
    title: 'Diseño Interior',
    description:
      'Nuestros diseños interiores combinan funcionalidad y estetica, creando ambientes acogedores y sofisticados.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-3.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-3.webp`,
    },
  },
  {
    id: 'galeria-04',
    title: 'Espacios Comerciales',
    description:
      'Transformamos espacios comerciales en experiencias unicas que atraen y retienen a los clientes.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-4.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-4.webp`,
    },
  },
  // {
  //   id: 'galeria-05',
  //   title: 'Arquitectura Residencial',
  //   description:
  //     'Creamos hogares que combinan diseño, funcionalidad y confort, adaptados a las necesidades de cada familia.',
  //   image: '/images/galeria/galeria-5.webp',
  // },
  // {
  //   id: 'galeria-06',
  //   title: 'Paisajismo y Exteriores',
  //   description:
  //     'Nuestros proyectos de paisajismo transforman los exteriores en espacios armoniosos y sostenibles.',
  //   image: '/images/galeria/galeria-6.webp',
  // },
  {
    id: 'galeria-05',
    title: 'Proyectos Urbanos',
    description:
      'Participamos en el desarrollo de proyectos urbanos que mejoran la calidad de vida y fomentan la comunidad.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-5.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-5.webp`,
    },
  },
  {
    id: 'galeria-06',
    title: 'Restauración y Conservación',
    description:
      'Nos especializamos en la restauración y conservación de edificios históricos, preservando su valor cultural.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-6.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-6.webp`,
    },
  },
  {
    id: 'galeria-07',
    title: 'Diseño de Interiores Comerciales',
    description:
      'Creamos interiores comerciales que reflejan la identidad de la marca y mejoran la experiencia del cliente.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-7.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-7.webp`,
    },
  },
  {
    id: 'galeria-08',
    title: 'Arquitectura Sostenible',
    description:
      'Implementamos principios de arquitectura sostenible en todos nuestros proyectos, promoviendo un futuro más verde.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-8.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-8.webp`,
    },
  },
  // {
  //   id: 'galeria-11',
  //   title: 'Diseño Minimalista',
  //   description:
  //     'Desarrollamos proyectos de diseño minimalista que priorizan la simplicidad, la luz natural y la funcionalidad.',
  //   image: '/images/galeria/galeria-11.webp',
  // },
  {
    id: 'galeria-09',
    title: 'Viviendas Multifamiliares',
    description:
      'Diseñamos viviendas multifamiliares con soluciones eficientes que equilibran privacidad, confort y comunidad.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-9.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-9.webp`,
    },
  },
  {
    id: 'galeria-10',
    title: 'Espacios Corporativos',
    description: 'Creamos espacios corporativos modernos que potencian la productividad, el bienestar y la identidad empresarial.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-10.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-10.webp`,
    },
  },
  // {
  //   id: 'galeria-14',
  //   title: 'Centros Educativos',
  //   description: 'Proyectamos centros educativos funcionales y flexibles, orientados al aprendizaje y la interacción colaborativa.',
  //   image: '/images/galeria/galeria-14.webp'
  // },
  {
    id: 'galeria-11',
    title: 'Hospitalidad y Turismo',
    description: 'Diseñamos espacios de hospitalidad y turismo que ofrecen experiencias memorables con alto valor estético y operativo.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-11.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-11.webp`,
    },
  },
  {
    id: 'galeria-12',
    title: 'Remodelación Integral',
    description: 'Ejecutamos remodelaciones integrales que actualizan espacios existentes con propuestas contemporáneas y eficientes.',
    images: {
      desktop: `${BUCKET_URL}/galeria-desk-12.webp`,
      mobile: `${BUCKET_URL}/galeria-mobile-12.webp`,
    },
  },
  // {
  //   id: 'galeria-17',
  //   title: 'Arquitectura Bioclimática',
  //   description: 'Aplicamos estrategias bioclimáticas para optimizar el confort térmico y reducir el consumo energético en cada proyecto.',
  //   image: '/images/galeria/galeria-17.webp'
  // },
  // {
  //   id: 'galeria-18',
  //   title: 'Espacios Culturales',
  //   description: 'Diseñamos espacios culturales que fortalecen la identidad local y promueven el encuentro entre arte y comunidad.',
  //   image: '/images/galeria/galeria-18.webp'
  // },
  // {
  //   id: 'galeria-19',
  //   title: 'Diseño de Fachadas',
  //   description: 'Desarrollamos fachadas innovadoras que combinan expresión arquitectónica, eficiencia y control ambiental.',
  //   image: '/images/galeria/galeria-19.webp'
  // },
  // {
  //   id: 'galeria-20',
  //   title: 'Proyectos Institucionales',
  //   description: 'Planificamos proyectos institucionales sólidos y funcionales, adaptados a requerimientos técnicos y de servicio público.',
  //   image: '/images/galeria/galeria-20.webp'
  // },
  // {
  //   id: 'galeria-21',
  //   title: 'Espacios Recreativos',
  //   description: 'Creamos espacios recreativos dinámicos y seguros que fomentan la convivencia y el bienestar de las personas.',
  //   image: '/images/galeria/galeria-21.webp'
  // },
  // {
  //   id: 'galeria-22',
  //   title: 'Arquitectura Modular',
  //   description: 'Implementamos soluciones de arquitectura modular que aceleran los tiempos de ejecución sin sacrificar calidad.',
  //   image: '/images/galeria/galeria-22.webp'
  // },
  // {
  //   id: 'galeria-23',
  //   title: 'Infraestructura Urbana',
  //   description: 'Participamos en proyectos de infraestructura urbana que mejoran la conectividad, accesibilidad y calidad del entorno.',
  //   image: '/images/galeria/galeria-23.webp'
  // },
  // {
  //   id: 'galeria-24',
  //   title: 'Diseño Paramétrico',
  //   description: 'Exploramos el diseño paramétrico para generar propuestas arquitectónicas innovadoras, precisas y adaptables.',
  //   image: '/images/galeria/galeria-24.webp'
  // },
]
