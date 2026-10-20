/**
 * Envoltorio de Google Analytics 4. Si gtag no se cargó (sin
 * `PUBLIC_GA_MEASUREMENT_ID`, bloqueador, dashboard, cookies rechazadas) las
 * llamadas no hacen nada, igual que en `meta-pixel.ts`.
 */

type GAParams = Record<string, string | number | boolean>

/** Evento de GA4: recomendado (`generate_lead`…) o propio del sitio. */
export const trackGA = (event: string, params?: GAParams) => {
  window.gtag?.('event', event, params)
}

/** Página vista; se llama en cada navegación del ClientRouter. */
export const trackGAPageView = () => {
  trackGA('page_view', {
    page_location: location.href,
    page_title: document.title,
  })
}
