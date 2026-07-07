export interface Servicio {
    id: string
    title: string
    description: string
    features: string[]
    image: string
    imageAlt: string
}

export const servicios: Servicio[] = [
    {
        id: 'servicio-01',
        title: 'Diseño arquitectónico',
        description:
            'Proyectamos espacios funcionales y estéticos a partir de tus necesidades, cuidando cada decisión desde el anteproyecto hasta el plano ejecutivo.',
        features: [
            'Anteproyecto y conceptualización',
            'Planos ejecutivos y detalles',
            'Visualización 3D y renders',
        ],
        image: '/images/hero/hero-1.webp',
        imageAlt: 'Proyecto arquitectónico diseñado por VMV Arquitectos',
    },
    {
        id: 'servicio-02',
        title: 'Construcción integral',
        description:
            'Ejecutamos obra nueva con estándares altos de calidad, controlando tiempos, costos y acabados en cada etapa del proyecto.',
        features: [
            'Obra gris y acabados finos',
            'Gestión de proveedores y materiales',
            'Control de calidad en obra',
        ],
        image: '/images/hero/hero-2.webp',
        imageAlt: 'Obra en construcción ejecutada por VMV Arquitectos',
    },
    {
        id: 'servicio-03',
        title: 'Remodelación y ampliación',
        description:
            'Transformamos espacios existentes para darles nueva vida, optimizando la distribución y elevando el valor de tu propiedad.',
        features: [
            'Diagnóstico y levantamiento del estado actual',
            'Rediseño de distribución',
            'Ampliaciones estructuradas y seguras',
        ],
        image: '/images/hero/hero-3.webp',
        imageAlt: 'Espacio remodelado por VMV Arquitectos',
    },
    {
        id: 'servicio-04',
        title: 'Diseño de interiores',
        description:
            'Creamos ambientes acogedores y sofisticados donde la funcionalidad y la estética conviven en equilibrio.',
        features: [
            'Concepto y paleta de materiales',
            'Mobiliario e iluminación a medida',
            'Acompañamiento en la implementación',
        ],
        image: '/images/hero/hero-4.webp',
        imageAlt: 'Interior diseñado por VMV Arquitectos',
    },
]
