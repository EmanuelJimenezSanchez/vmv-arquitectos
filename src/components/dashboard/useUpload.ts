import { useCallback, useState } from 'react'
import { actions } from 'astro:actions'

export type UploadFolder = 'services' | 'galeria'

const ALLOWED = ['image/webp', 'image/jpeg', 'image/png', 'image/avif'] as const
type AllowedMime = (typeof ALLOWED)[number]
const MAX_BYTES = 8 * 1024 * 1024

/**
 * Sube archivos directo a R2 con una URL firmada que emite el servidor.
 * El binario nunca pasa por la función serverless, así que no hay límite
 * práctico de payload y la subida es más rápida.
 */
export const useUpload = () => {
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(async (file: File, folder: UploadFolder): Promise<string | null> => {
    if (!ALLOWED.includes(file.type as AllowedMime)) {
      setError(`«${file.name}»: formato no permitido. Usa WebP, JPG, PNG o AVIF.`)
      return null
    }
    if (file.size > MAX_BYTES) {
      setError(`«${file.name}»: supera los 8 MB. Comprime la imagen antes de subirla.`)
      return null
    }

    setError(null)
    setUploading((count) => count + 1)

    try {
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
        setError(`No se pudo subir «${file.name}» a R2 (${response.status}).`)
        return null
      }

      return data.url
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Error inesperado al subir la imagen.')
      return null
    } finally {
      setUploading((count) => count - 1)
    }
  }, [])

  return { upload, uploading: uploading > 0, uploadError: error, clearUploadError: () => setError(null) }
}
