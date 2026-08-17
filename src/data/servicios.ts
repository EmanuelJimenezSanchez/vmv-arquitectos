export interface Servicio {
    id: string
    title: string
    description: string
    details: string
    footer: string
    image: string
    imageAlt: string
}

const BUCKET_URL = `${import.meta.env.R2_BUCKET_URL}/services`;

export const servicios: Servicio[] = [
    {
        id: 'servicio-01',
        title: 'Casas y residencias',
        description: 'Diseñamos y construimos hogares a la medida de quien los va a vivir.',
        details: 'Cuéntanos tu idea.',
        footer: 'Residencial',
        image: `${BUCKET_URL}/servicio-1.webp`,
        imageAlt: 'Casa construida por VMV Arquitectos',
    },
    {
        id: 'servicio-02',
        title: 'Espacios comerciales',
        description: 'Locales y oficinas pensados para funcionar bien y sentirse bien.',
        details: 'Espacios que acompañan a tu actividad y hablan por sí solos.',
        footer: 'Comercial',
        image: `${BUCKET_URL}/servicio-2.webp`,
        imageAlt: 'Espacio comercial construido por VMV Arquitectos',
    },
    {
        id: 'servicio-03',
        title: 'Desarrollos verticales',
        description: 'Acompañamos a quienes imaginan proyectos de mayor escala.',
        details:
            'Cuidamos cada metro con la misma atención al detalle y a la experiencia de quien habitará el lugar.',
        footer: 'Desarrollos verticales',
        image: `${BUCKET_URL}/servicio-3.webp`,
        imageAlt: 'Desarrollo vertical diseñado por VMV Arquitectos',
    },
    {
        id: 'servicio-04',
        title: 'Interiorismo',
        description: 'El detalle que termina de dar carácter a un espacio.',
        details:
            'Integramos luz, materiales y proporción para que cada lugar se sienta, simplemente, tuyo.',
        footer: 'Interiores',
        image: `${BUCKET_URL}/servicio-4.webp`,
        imageAlt: 'Interior diseñado por VMV Arquitectos',
    },
]
