export interface ServicioFoto {
    src: string
    alt: string
}

export interface Servicio {
    id: string
    title: string
    description: string
    details: string
    footer: string
    image: string
    imageAlt: string
    gallery: ServicioFoto[]
}

const BUCKET_URL = `${import.meta.env.R2_BUCKET_URL}/services`;

// TODO: sustituir por las fotos propias de cada servicio cuando estén
// subidas al bucket (`/services/servicio-N-M.webp`). Mientras tanto se
// reutilizan imágenes existentes de la galería para que el modal funcione.
const GALERIA_URL = `${import.meta.env.R2_BUCKET_URL}/services`;

const galeriaFoto = (index: number, alt: string): ServicioFoto => ({
    src: `${GALERIA_URL}/galeria-servicio-${index}.webp`,
    alt,
})

export const servicios: Servicio[] = [
    {
        id: 'servicio-01',
        title: 'Casas y residencias',
        description: 'Diseñamos y construimos hogares a la medida de quien los va a vivir.',
        details: 'Cuéntanos tu idea.',
        footer: 'Residencial',
        image: `${BUCKET_URL}/servicio-1.webp`,
        imageAlt: 'Casa construida por VMV Arquitectos',
        gallery: [
            galeriaFoto(1, 'Fachada de una residencia construida por VMV Arquitectos'),
            galeriaFoto(2, 'Doble altura en una casa proyectada por VMV Arquitectos'),
            galeriaFoto(3, 'Terraza de una residencia construida por VMV Arquitectos'),
            galeriaFoto(4, 'Estancia principal de una casa VMV Arquitectos'),
            galeriaFoto(5, 'Cocina de una residencia diseñada por VMV Arquitectos'),
            galeriaFoto(6, 'Dormitorio principal de una casa proyectada por VMV Arquitectos'),
            galeriaFoto(7, 'Baño de una residencia construida por VMV Arquitectos'),
            galeriaFoto(8, 'Patio interior de una casa diseñada por VMV Arquitectos'),
            galeriaFoto(9, 'Sala de estar de una residencia proyectada por VMV Arquitectos'),
            galeriaFoto(10, 'Comedor de una casa construida por VMV Arquitectos'),
            galeriaFoto(11, 'Área de juegos de una residencia diseñada por VMV Arquitectos'),
            galeriaFoto(12, 'Jardín de una casa proyectada por VMV Arquitectos'),
        ],
    },
    {
        id: 'servicio-02',
        title: 'Espacios comerciales',
        description: 'Locales y oficinas pensados para funcionar bien y sentirse bien.',
        details: 'Espacios que acompañan a tu actividad y hablan por sí solos.',
        footer: 'Comercial',
        image: `${BUCKET_URL}/servicio-2.webp`,
        imageAlt: 'Espacio comercial construido por VMV Arquitectos',
        gallery: [
            galeriaFoto(4, 'Local comercial diseñado por VMV Arquitectos'),
            galeriaFoto(7, 'Interior comercial con iluminación de acento'),
            galeriaFoto(10, 'Oficinas corporativas proyectadas por VMV Arquitectos'),
            galeriaFoto(11, 'Área de recepción de un espacio comercial VMV'),
        ],
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
        gallery: [
            galeriaFoto(5, 'Torre de departamentos diseñada por VMV Arquitectos'),
            galeriaFoto(9, 'Vivienda multifamiliar proyectada por VMV Arquitectos'),
            galeriaFoto(8, 'Fachada de un desarrollo vertical sustentable'),
            galeriaFoto(12, 'Amenidades de un desarrollo vertical VMV'),
        ],
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
        gallery: [
            galeriaFoto(3, 'Interior residencial diseñado por VMV Arquitectos'),
            galeriaFoto(7, 'Detalle de materiales en un interior VMV'),
            galeriaFoto(12, 'Remodelación integral de un interior VMV'),
            galeriaFoto(6, 'Espacio restaurado y ambientado por VMV Arquitectos'),
        ],
    },
]
