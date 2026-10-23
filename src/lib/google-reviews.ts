import type { Locale } from '@/lib/i18n'

/**
 * Reseñas del perfil de Google del despacho, vía Places API (New).
 *
 * Google solo entrega las 5 reseñas más relevantes por lugar; no hay forma de
 * paginar ni de pedir otras. Cada consulta con el campo `reviews` se cobra
 * como Place Details Enterprise + Atmosphere, así que se cachea en memoria
 * varias horas: las reseñas cambian poco y así casi nunca se paga una visita.
 */
const API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY ?? ''
const PLACE_ID = import.meta.env.GOOGLE_PLACE_ID ?? ''

const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const FAILURE_TTL_MS = 5 * 60 * 1000
const REQUEST_TIMEOUT_MS = 4000

/** Solo se muestran reseñas con texto y al menos esta calificación. */
const MIN_RATING = 4

export interface GoogleReview {
  author: string
  authorUrl: string | null
  rating: number
  text: string
  relativeTime: string
  publishTime: string
}

export interface GoogleReviews {
  rating: number
  total: number
  url: string | null
  reviews: GoogleReview[]
}

interface PlacesReview {
  rating?: number
  text?: { text?: string }
  originalText?: { text?: string }
  relativePublishTimeDescription?: string
  publishTime?: string
  authorAttribution?: { displayName?: string; uri?: string }
}

interface PlacesResponse {
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: PlacesReview[]
}

const cache = new Map<Locale, { value: GoogleReviews | null; expiresAt: number }>()

const load = async (locale: Locale): Promise<GoogleReviews | null> => {
  const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=${locale}`

  const response = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': 'rating,userRatingCount,googleMapsUri,reviews',
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })

  if (!response.ok) {
    console.error('[google-reviews] Places API', response.status, await response.text())
    return null
  }

  const data = (await response.json()) as PlacesResponse

  // Se prefiere el texto original: la traducción automática de Google suena
  // rara en reseñas cortas y el cliente escribió en su idioma por algo.
  const reviews = (data.reviews ?? [])
    .map((review) => ({
      author: review.authorAttribution?.displayName?.trim() ?? '',
      authorUrl: review.authorAttribution?.uri ?? null,
      rating: review.rating ?? 0,
      text: (review.originalText?.text ?? review.text?.text ?? '').trim(),
      relativeTime: review.relativePublishTimeDescription ?? '',
      publishTime: review.publishTime ?? '',
    }))
    .filter((review) => review.author && review.text && review.rating >= MIN_RATING)

  if (!reviews.length) {
    return null
  }

  return {
    rating: data.rating ?? 0,
    total: data.userRatingCount ?? 0,
    url: data.googleMapsUri ?? null,
    reviews,
  }
}

/**
 * Devuelve `null` si faltan las credenciales o la API falla: la sección
 * simplemente no se pinta y el resto de la portada no se entera.
 */
export const getGoogleReviews = async (locale: Locale): Promise<GoogleReviews | null> => {
  if (!API_KEY || !PLACE_ID) {
    return null
  }

  const entry = cache.get(locale)
  if (entry && entry.expiresAt > Date.now()) {
    return entry.value
  }

  try {
    const value = await load(locale)
    // Un fallo se reintenta pronto en vez de dejar la sección oculta horas.
    const ttl = value ? CACHE_TTL_MS : FAILURE_TTL_MS
    cache.set(locale, { value, expiresAt: Date.now() + ttl })
    return value
  } catch (error) {
    console.error('[google-reviews]', error)
    const fallback = entry?.value ?? null
    cache.set(locale, { value: fallback, expiresAt: Date.now() + FAILURE_TTL_MS })
    return fallback
  }
}
