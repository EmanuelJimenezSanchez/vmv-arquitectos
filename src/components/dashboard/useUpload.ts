import { useCallback, useState } from 'react'
import { actions } from 'astro:actions'
import { optimizeImage } from './optimizeImage'

export type UploadFolder = 'services' | 'galeria' | 'proyectos' | 'planos'

export interface UploadResult {
  url: string
  /** Medidas del archivo subido; null si el navegador no pudo leerlas. */
  width: number | null
  height: number | null
}

const ALLOWED = ['image/webp', 'image/jpeg', 'image/png', 'image/avif'] as const
const ALLOWED_DOCUMENTS = ['application/pdf'] as const
type AllowedMime = (typeof ALLOWED)[number] | (typeof ALLOWED_DOCUMENTS)[number]
const MAX_BYTES = 8 * 1024 * 1024
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024

const isDocument = (type: string): boolean =>
  (ALLOWED_DOCUMENTS as readonly string[]).includes(type)

/**
 * Sube archivos directo a R2 con una URL firmada que emite el servidor.
 * El binario nunca pasa por la función serverless, así que no hay límite
 * práctico de payload y la subida es más rápida.
 */
export const useUpload = () => {
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (original: File, folder: UploadFolder): Promise<
    UploadResult | null
  > => {
    const documento = isDocument(original.type)

    // El PDF solo se acepta como plano descargable; en las demás carpetas el
    // archivo se termina pintando en un <img>.
    if (documento && folder !== 'planos') {
      setError(`«${original.name}»: los PDF solo se admiten como documentos técnicos.`)
      return null
    }
    if (!documento && !(ALLOWED as readonly string[]).includes(original.type)) {
      setError(`«${original.name}»: formato no permitido. Usa WebP, JPG, PNG o AVIF.`)
      return null
    }

    setError(null)
    setUploading((count) => count + 1)

    try {
      // Las imágenes se reescalan y reencodean antes de medir el peso: el
      // límite aplica a lo que se va a guardar, no al original de cámara.
      const { file, width, height } = documento
        ? { file: original, width: null, height: null }
        : await optimizeImage(original)

      const maxBytes = documento ? MAX_DOCUMENT_BYTES : MAX_BYTES
      if (file.size > maxBytes) {
        const mb = Math.round(maxBytes / (1024 * 1024))
        setError(
          documento
            ? `«${original.name}»: supera los ${mb} MB. Comprime el PDF antes de subirlo.`
            : `«${original.name}»: sigue pasando de ${mb} MB tras comprimirla. Reduce sus dimensiones antes de subirla.`,
        )
        return null
      }

      const { data, error: signError } = await actions.uploads.sign({
        folder,
        fileName: file.name,
        contentType: file.type as AllowedMime,
        size: file.size,
      })

      if (signError || !data) {
        setError(signError?.message ?? 'No se pudo preparar la subida.')
        return null
      }

      const response = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })

      if (!response.ok) {
        setError(`No se pudo subir «${original.name}» a R2 (${response.status}).`)
        return null
      }

      return { url: data.url, width, height }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error inesperado al subir la imagen.')
      return null
    } finally {
      setUploading((count) => count - 1)
    }
  }, [])

  return {
    upload,
    uploading: uploading > 0,
    uploadError: error,
    clearUploadError: () => setError(null),
  }
}
