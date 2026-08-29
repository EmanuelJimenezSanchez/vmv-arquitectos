/**
 * Comprime en el navegador antes de subir a R2.
 *
 * El bucket guarda el archivo tal cual llega y lo sirve con cache inmutable,
 * así que lo que se sube es exactamente lo que descarga el visitante: una foto
 * de cámara de 6000 px acabaría pesando varios MB en la galería de un
 * proyecto. Reescalar y reencodear aquí evita montar un pipeline de
 * transformación en el servidor y, de paso, deja las medidas reales de la
 * imagen para poder escribir `width`/`height` en el markup.
 */

/** Lado máximo del resultado. Cubre pantallas 2x sin llegar a ser un original. */
const MAX_EDGE = 2400

const QUALITY = 0.82

/** Formatos que sabemos decodificar y reencodear con canvas. */
const OPTIMIZABLE = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

export interface OptimizedImage {
  file: File
  /** Medidas reales del archivo que se sube; null si no se pudo leer. */
  width: number | null
  height: number | null
}

const asIs = (file: File): OptimizedImage => ({ file, width: null, height: null })

/**
 * `createImageBitmap` respeta la orientación EXIF, pero no está en todos los
 * navegadores con esa opción: si falla se cae a un `<img>`, que en los
 * navegadores actuales ya aplica la orientación por su cuenta.
 */
const decode = async (file: File): Promise<ImageBitmap | HTMLImageElement> => {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    const url = URL.createObjectURL(file)
    try {
      const image = new Image()
      image.src = url
      await image.decode()
      return image
    } finally {
      // El bitmap ya está decodificado en memoria; el blob URL puede liberarse.
      URL.revokeObjectURL(url)
    }
  }
}

const toBlob = (canvas: HTMLCanvasElement, type: string): Promise<Blob | null> =>
  new Promise((resolve) => canvas.toBlob(resolve, type, QUALITY))

const renamed = (name: string, extension: string) =>
  `${name.replace(/\.[^.]+$/, '') || 'imagen'}.${extension}`

export const optimizeImage = async (file: File): Promise<OptimizedImage> => {
  if (!OPTIMIZABLE.includes(file.type)) {
    return asIs(file)
  }

  let source: ImageBitmap | HTMLImageElement
  try {
    source = await decode(file)
  } catch {
    // Un archivo corrupto o un formato que el navegador no abre: que siga su
    // camino y falle (o no) en la validación de la subida, no aquí.
    return asIs(file)
  }

  const naturalWidth = 'naturalWidth' in source ? source.naturalWidth : source.width
  const naturalHeight = 'naturalHeight' in source ? source.naturalHeight : source.height

  if (!naturalWidth || !naturalHeight) {
    return asIs(file)
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(naturalWidth, naturalHeight))
  const width = Math.round(naturalWidth * scale)
  const height = Math.round(naturalHeight * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    return { file, width: naturalWidth, height: naturalHeight }
  }

  context.drawImage(source, 0, 0, width, height)
  if ('close' in source) {
    source.close()
  }

  const blob = await toBlob(canvas, 'image/webp')

  // Un original ya optimizado (WebP/AVIF pequeño) puede salir más pesado tras
  // el reencode. En ese caso se conserva el archivo tal cual: lo único que
  // aporta esta función entonces son las medidas.
  if (!blob || (blob.size >= file.size && scale === 1)) {
    return { file, width: naturalWidth, height: naturalHeight }
  }

  // Un navegador sin encoder WebP devuelve PNG sin avisar, así que el nombre
  // y el content-type se toman del blob: si no coincidieran, R2 serviría un
  // PNG anunciado como WebP.
  const type = blob.type || 'image/png'
  const extension = type === 'image/webp' ? 'webp' : 'png'

  return {
    file: new File([blob], renamed(file.name, extension), { type }),
    width,
    height,
  }
}
