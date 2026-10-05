/**
 * Solo lo que no se traduce: el identificador y la imagen de cada etapa.
 *
 * Los textos (título, descripción y alt) viven en `src/lib/i18n`, bajo
 * `process.steps`, y se emparejan con esta lista por posición. Mantener las
 * dos listas del mismo largo es lo único que hay que cuidar al agregar un paso.
 */
export interface PasoProcesoImagen {
  id: string
  image: string
}

export const procesoImagenes: PasoProcesoImagen[] = [
  { id: 'proceso-01', image: '/images/galeria/galeria-5.webp' },
  { id: 'proceso-02', image: '/images/galeria/galeria-6.webp' },
  { id: 'proceso-03', image: '/images/galeria/galeria-11.webp' },
  { id: 'proceso-04', image: '/images/galeria/galeria-14.webp' },
  { id: 'proceso-05', image: '/images/nosotros/nosotros-4.webp' },
]
