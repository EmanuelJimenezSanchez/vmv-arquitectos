export interface Project {
  id: string
  title: string
  summary: string
  location: string
  year: number
  services: string[]
  coverImage: string
  content: string[]
}

export const projects: Project[] = [
  {
    id: 'casa-loma-01',
    title: 'Casa Loma',
    summary:
      'Vivienda unifamiliar con enfoque bioclimatico, ventilacion cruzada y materiales de bajo mantenimiento.',
    location: 'Lima, Peru',
    year: 2025,
    services: ['Arquitectura', 'Interiorismo', 'Supervision de obra'],
    coverImage: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1400&q=80',
    content: [
      'El proyecto se organiza en torno a un patio central para maximizar luz natural.',
      'La distribucion prioriza areas sociales abiertas y una relacion directa con el jardin.',
      'Se implementaron estrategias pasivas para reducir consumo energetico anual.'
    ]
  },
  {
    id: 'oficinas-norte-02',
    title: 'Oficinas Norte',
    summary:
      'Remodelacion integral de oficinas corporativas con enfoque en flexibilidad y colaboracion.',
    location: 'Bogota, Colombia',
    year: 2024,
    services: ['Arquitectura', 'Diseno de mobiliario', 'Gestion de contratistas'],
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=80',
    content: [
      'Se plantearon modulos adaptables para reuniones, trabajo individual y espacios hibridos.',
      'La propuesta mejora el confort acustico mediante superficies absorbentes y particiones estrategicas.',
      'La ejecucion se realizo por etapas para mantener la continuidad operativa del cliente.'
    ]
  },
  {
    id: 'hotel-costa-03',
    title: 'Hotel Costa',
    summary:
      'Anteproyecto de hotel boutique frente al mar, centrado en experiencia y eficiencia operativa.',
    location: 'Manta, Ecuador',
    year: 2026,
    services: ['Arquitectura', 'Concepto de marca espacial', 'Planificacion'],
    coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
    content: [
      'La volumetria escalonada optimiza visuales y asoleamiento para todas las habitaciones.',
      'Se integraron sistemas de captacion pluvial y sombreados para reducir cargas termicas.',
      'El esquema funcional separa flujos de huespedes y servicio para mejorar operacion interna.'
    ]
  }
]

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id)
}
