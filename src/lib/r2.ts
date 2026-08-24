import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const ACCOUNT_ID = import.meta.env.R2_ACCOUNT_ID
const ACCESS_KEY_ID = import.meta.env.R2_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = import.meta.env.R2_SECRET_ACCESS_KEY
const BUCKET = import.meta.env.R2_BUCKET_NAME
const PUBLIC_URL = import.meta.env.R2_BUCKET_URL?.replace(/\/+$/, '')

/** Tipos permitidos en la subida; evita que el bucket reciba cualquier archivo. */
export const ALLOWED_MIME_TYPES = ['image/webp', 'image/jpeg', 'image/png', 'image/avif'] as const

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/avif': 'avif',
}

let client: S3Client | null = null

const getClient = () => {
  if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY || !BUCKET) {
    throw new Error(
      'Faltan credenciales de R2 (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME).',
    )
  }

  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY_ID,
      secretAccessKey: SECRET_ACCESS_KEY,
    },
  })

  return client
}

/** URL pública final de un objeto del bucket. */
export const publicUrl = (key: string) => `${PUBLIC_URL}/${key}`

/** Deriva la key a partir de una URL pública; null si la URL no es del bucket. */
export const keyFromPublicUrl = (url: string) => {
  if (!PUBLIC_URL || !url.startsWith(`${PUBLIC_URL}/`)) {
    return null
  }
  return url.slice(PUBLIC_URL.length + 1)
}

/** Marcas diacríticas combinantes (U+0300–U+036F) que deja `normalize('NFD')`. */
const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'imagen'

/**
 * Construye una key única y legible: `carpeta/nombre-timestamp-random.ext`.
 * El sufijo evita colisiones y hace que sustituir una imagen no quede servida
 * desde el cache del CDN con el contenido anterior.
 */
export const buildObjectKey = (folder: string, fileName: string, contentType: string) => {
  const base = slugify(fileName.replace(/\.[^.]+$/, ''))
  const extension = EXTENSION_BY_MIME[contentType] ?? 'bin'
  const suffix = crypto.randomUUID().slice(0, 8)
  return `${slugify(folder)}/${base}-${suffix}.${extension}`
}

/** URL firmada para que el navegador suba el archivo directo a R2 (PUT). */
export const createUploadUrl = async (key: string, contentType: string, expiresIn = 300) =>
  getSignedUrl(
    getClient(),
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn },
  )

export const deleteObject = async (key: string) => {
  await getClient().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}
