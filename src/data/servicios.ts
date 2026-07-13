export interface Servicio {
    id: string
    title: string
    description: string
    details: string
    footer: string
    image: string
    imageAlt: string
}

export const servicios: Servicio[] = [
    {
        id: 'servicio-01',
        title: 'Construcción y remodelación residencial',
        description: 'Viviendas construidas y renovadas con calidad en cada etapa.',
        details:
            'Gestionamos permisos, materiales y cuadrillas propias para que tu casa avance sin sorpresas, del levantamiento inicial hasta el último acabado.',
        footer: 'Residencial',
        image: '/images/services/service-1.webp',
        imageAlt: 'Vivienda construida por VMV Arquitectos',
    },
    {
        id: 'servicio-02',
        title: 'Construcción y remodelación comercial',
        description: 'Locales y oficinas ejecutados con precisión, sin frenar tu operación.',
        details:
            'Planificamos por etapas y horarios para minimizar el impacto en tu negocio, cuidando normativa, plazos y presupuesto acordado.',
        footer: 'Comercial',
        image: '/images/services/service-2.webp',
        imageAlt: 'Espacio comercial construido por VMV Arquitectos',
    },
    {
        id: 'servicio-03',
        title: 'Diseño y construcción de desarrollos verticales',
        description: 'Desarrollos en altura que integran ingeniería, normativa y diseño.',
        details:
            'Acompañamos desde el anteproyecto y la factibilidad hasta la entrega, coordinando estructura, instalaciones y control de calidad en cada nivel.',
        footer: 'Desarrollos verticales',
        image: '/images/services/service-3.webp',
        imageAlt: 'Desarrollo vertical diseñado por VMV Arquitectos',
    },
    {
        id: 'servicio-04',
        title: 'Diseño de interiores',
        description: 'Ambientes donde la funcionalidad y la estética conviven en equilibrio.',
        details:
            'Definimos paleta, materiales y mobiliario a la medida de cómo vives o trabajas, con visualizaciones previas antes de construir.',
        footer: 'Interiores',
        image: '/images/services/service-4.webp',
        imageAlt: 'Interior diseñado por VMV Arquitectos',
    },
]
