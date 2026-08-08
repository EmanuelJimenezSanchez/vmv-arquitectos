export interface PasoProceso {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
}

export const proceso: PasoProceso[] = [
  {
    id: 'proceso-01',
    title: 'Detección de necesidades',
    description: 'Entrevista para evaluar el proyecto y sus necesidades.',
    image: '/images/galeria/galeria-5.webp',
    imageAlt: 'Reunión inicial para detectar las necesidades del proyecto',
  },
  {
    id: 'proceso-02',
    title: 'Anteproyecto',
    description: 'Elaboración de propuestas para resolver las necesidades.',
    image: '/images/galeria/galeria-6.webp',
    imageAlt: 'Propuestas de anteproyecto elaboradas por VMV Arquitectos',
  },
  {
    id: 'proceso-03',
    title: 'Proyecto ejecutivo e imágenes 3D',
    description:
      'Una vez autorizada la propuesta, se crea toda la volumetría y 3D necesarias para el proyecto.',
    image: '/images/galeria/galeria-11.webp',
    imageAlt: 'Volumetría e imágenes 3D del proyecto ejecutivo',
  },
  {
    id: 'proceso-04',
    title: 'Cotización',
    description:
      'Todas nuestras cotizaciones están hechas por precios unitarios que son el desglose de todas las actividades del proyecto.',
    image: '/images/galeria/galeria-14.webp',
    imageAlt: 'Desglose de precios unitarios de la cotización',
  },
  {
    id: 'proceso-05',
    title: 'Ejecución de obra',
    description:
      'Supervisión de actividades por parte de arquitectos e ingenieros para garantizar la calidad de cada proyecto.',
    image: '/images/nosotros/nosotros-4.webp',
    imageAlt: 'Supervisión de la ejecución de obra por arquitectos e ingenieros',
  },
]
