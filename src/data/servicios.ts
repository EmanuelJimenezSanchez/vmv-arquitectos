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
        description:
            'Construimos y renovamos viviendas con altos estándares de calidad, controlando tiempos, costos y acabados en cada etapa.',
        image: '/images/services/service-1.webp',
        imageAlt: 'Vivienda construida por VMV Arquitectos',
    },
    {
        id: 'servicio-02',
        title: 'Construcción y remodelación comercial',
        description:
            'Locales, oficinas y espacios comerciales ejecutados con precisión, minimizando la interrupción de tu operación.',
        image: '/images/services/service-2.webp',
        imageAlt: 'Espacio comercial construido por VMV Arquitectos',
    },
    {
        id: 'servicio-03',
        title: 'Diseño y construcción de desarrollos verticales',
        description:
            'Proyectamos y edificamos desarrollos en altura, integrando ingeniería, normativa y diseño en cada nivel.',
        image: '/images/services/service-3.webp',
        imageAlt: 'Desarrollo vertical diseñado por VMV Arquitectos',
    },
    {
        id: 'servicio-04',
        title: 'Diseño de interiores',
        description:
            'Creamos ambientes acogedores y sofisticados donde la funcionalidad y la estética conviven en equilibrio.',
        image: '/images/services/service-4.webp',
        imageAlt: 'Interior diseñado por VMV Arquitectos',
    },
]
