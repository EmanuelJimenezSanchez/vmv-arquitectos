import { getConsent } from '@/lib/cookie-consent'

/**
 * Envoltorio del Pinterest Tag. Si el tag no se cargó (sin
 * `PUBLIC_PINTEREST_TAG_ID`, bloqueador, dashboard, cookies rechazadas) las
 * llamadas no hacen nada, igual que en `meta-pixel.ts`.
 *
 * Pinterest no tiene un comando para revocar el consentimiento como Meta o
 * GA, así que el rechazo se respeta aquí: con la elección `denied` no se manda
 * ningún evento aunque el script ya esté cargado en la página.
 */

type PinterestParams = Record<string, unknown>

/** Evento de Pinterest: `pagevisit`, `lead`, `custom`… */
export const trackPinterest = (event: string, params?: PinterestParams) => {
  if (getConsent() === 'denied') {
    return
  }
  window.pintrk?.('track', event, params)
}

/** Página vista; se llama en cada navegación del ClientRouter. */
export const trackPinterestPageView = () => {
  if (getConsent() === 'denied') {
    return
  }
  window.pintrk?.('page')
}
