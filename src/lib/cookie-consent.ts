import { trackGAPageView } from '@/lib/google-analytics'

/**
 * Elección del visitante sobre las cookies de medición y publicidad.
 *
 * El modelo es opt-out (suficiente en México): sin elección guardada el Pixel
 * de Meta y Google Analytics se cargan y el aviso se muestra; «Rechazar» los
 * apaga y la elección persiste.
 *
 * La clave se repite en los scripts inline de `MetaPixel.astro` y
 * `GoogleAnalytics.astro`, que corren antes de que exista cualquier módulo:
 * si cambia aquí, hay que cambiarla allá.
 */
export const CONSENT_STORAGE_KEY = 'vmv-cookie-consent'

export type CookieConsent = 'granted' | 'denied'

export const getConsent = (): CookieConsent | null => {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    return stored === 'granted' || stored === 'denied' ? stored : null
  } catch {
    return null
  }
}

const saveConsent = (value: CookieConsent) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // Sin almacenamiento la elección vale solo para esta página.
  }
}

const GA_MEASUREMENT_ID = import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? ''

/** Cookies propias que dejan el pixel (`_fbp`, `_fbc`) y GA (`_ga`, `_ga_<ID>`). */
const isTrackingCookie = (name: string) =>
  name === '_fbp' || name === '_fbc' || name === '_ga' || name.startsWith('_ga_')

const deleteTrackingCookies = () => {
  // Ambos las escriben en el dominio raíz (`.vmvarquitectos.com`), así que
  // se borran en el host actual y en cada dominio padre.
  const parts = location.hostname.split('.')
  const domains = parts.map((_, index) => parts.slice(index).join('.'))

  document.cookie
    .split(';')
    .map((cookie) => cookie.split('=')[0].trim())
    .filter(isTrackingCookie)
    .forEach((name) => {
      document.cookie = `${name}=; Max-Age=0; path=/`
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`
      })
    })
}

/** Bandera oficial de gtag.js para detener todos los envíos de esta propiedad. */
const setGADisabled = (disabled: boolean) => {
  if (GA_MEASUREMENT_ID) {
    ;(window as unknown as Record<string, unknown>)[`ga-disable-${GA_MEASUREMENT_ID}`] = disabled
  }
}

const grantMetaPixel = () => {
  if (window.fbq) {
    window.fbq('consent', 'grant')
    return
  }

  // Rechazó en una visita anterior y el pixel nunca se cargó: se carga ahora
  // y se cuenta la página actual, que se perdió al entrar.
  window.vmvLoadMetaPixel?.()
  window.fbq?.('track', 'PageView')
}

const grantGoogleAnalytics = () => {
  setGADisabled(false)

  if (window.gtag) {
    window.gtag('consent', 'update', { analytics_storage: 'granted' })
    return
  }

  // Igual que con el pixel: se carga ahora y se cuenta la página actual.
  window.vmvLoadGoogleAnalytics?.()
  trackGAPageView()
}

export const grantConsent = () => {
  saveConsent('granted')
  grantMetaPixel()
  grantGoogleAnalytics()
}

export const denyConsent = () => {
  saveConsent('denied')
  // `revoke` y `ga-disable` detienen los envíos al instante sin recargar.
  window.fbq?.('consent', 'revoke')
  window.gtag?.('consent', 'update', { analytics_storage: 'denied' })
  setGADisabled(true)
  deleteTrackingCookies()
}
