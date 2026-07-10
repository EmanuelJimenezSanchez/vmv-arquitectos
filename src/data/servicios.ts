export interface Servicio {
    id: string
    title: string
    description: string
    image: string
    imageAlt: string
}

export const servicios: Servicio[] = [
    {
        id: 'servicio-01',
        title: 'Construcción y remodelación residencial',
        description: 'Viviendas construidas y renovadas con calidad en cada etapa.',
        image: '/images/services/service-1.webp',
        imageAlt: 'Vivienda construida por VMV Arquitectos',
    },
    {
        id: 'servicio-02',
        title: 'Construcción y remodelación comercial',
        description: 'Locales y oficinas ejecutados con precisión, sin frenar tu operación.',
        image: '/images/services/service-2.webp',
        imageAlt: 'Espacio comercial construido por VMV Arquitectos',
    },
    {
        id: 'servicio-03',
        title: 'Diseño y construcción de desarrollos verticales',
        description: 'Desarrollos en altura que integran ingeniería, normativa y diseño.',
        image: '/images/services/service-3.webp',
        imageAlt: 'Desarrollo vertical diseñado por VMV Arquitectos',
    },
    {
        id: 'servicio-04',
        title: 'Diseño de interiores',
        description: 'Ambientes donde la funcionalidad y la estética conviven en equilibrio.',
        image: '/images/services/service-4.webp',
        imageAlt: 'Interior diseñado por VMV Arquitectos',
    },
]
