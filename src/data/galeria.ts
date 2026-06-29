export interface Galeria {
    id: string
    title: string
    description: string
    image: string
}

export const galeria: Galeria[] = [
    {
        id: 'galeria-01',
        title: 'Galeria de Proyectos',
        description: 'Explora nuestra galeria de proyectos arquitectonicos y descubre la creatividad y el diseno que nos distingue.',
        image: '/images/hero/hero-1.webp'
    },
    {
        id: 'galeria-02',
        title: 'Innovacion y Sostenibilidad',
        description: 'Cada proyecto refleja nuestro compromiso con la innovacion y la sostenibilidad, creando espacios que inspiran y perduran.',
        image: '/images/hero/hero-2.webp'
    },
    {
        id: 'galeria-03',
        title: 'Diseño Interior',
        description: 'Nuestros diseños interiores combinan funcionalidad y estetica, creando ambientes acogedores y sofisticados.',
        image: '/images/hero/hero-3.webp'
    },
    {
        id: 'galeria-04',
        title: 'Espacios Comerciales',
        description: 'Transformamos espacios comerciales en experiencias unicas que atraen y retienen a los clientes.',
        image: '/images/hero/hero-4.webp'
    },
]