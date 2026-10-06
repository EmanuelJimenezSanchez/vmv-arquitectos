/**
 * Elección del visitante sobre las cookies de medición y publicidad.
 *
 * El modelo es opt-out (suficiente en México): sin elección guardada el pixel
 * se carga y el aviso se muestra; «Rechazar» lo apaga y la elección persiste.
 *
 * La clave se repite en el script inline de `MetaPixel.astro`, que corre antes
 * de que exista cualquier módulo: si cambia aquí, hay que cambiarla allá.
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

/** Cookies propias que deja el pixel en el dominio del sitio. */
const META_COOKIES = ['_fbp', '_fbc']

const deleteMetaCookies = () => {
  // El pixel las escribe en el dominio raíz (`.vmv-arquitectos.com`), así que
  // se borran en el host actual y en cada dominio padre.
  const parts = location.hostname.split('.')
  const domains = parts.map((_, index) => parts.slice(index).join('.'))

  META_COOKIES.forEach((name) => {
    document.cookie = `${name}=; Max-Age=0; path=/`
    domains.forEach((domain) => {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${domain}`
    })
  })
}

export const grantConsent = () => {
  saveConsent('granted')

  if (window.fbq) {
    window.fbq('consent', 'grant')
    return
  }

  // Rechazó en una visita anterior y el pixel nunca se cargó: se carga ahora
  // y se cuenta la página actual, que se perdió al entrar.
  window.vmvLoadMetaPixel?.()
  window.fbq?.('track', 'PageView')
}

export const denyConsent = () => {
  saveConsent('denied')
  // `revoke` detiene los envíos al instante sin tener que recargar.
  window.fbq?.('consent', 'revoke')
  deleteMetaCookies()
}
