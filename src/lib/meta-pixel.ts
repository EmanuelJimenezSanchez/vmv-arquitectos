/**
 * Envoltorio del Pixel de Meta. Si el pixel no se cargó (sin
 * `PUBLIC_META_PIXEL_ID`, bloqueador de anuncios, dashboard) las llamadas no
 * hacen nada, así que los componentes pueden medir sin comprobarlo antes.
 */

type MetaParams = Record<string, string | number | boolean>

/** Evento estándar de Meta (PageView, ViewContent, Lead, Contact…). */
export const trackMeta = (event: string, params?: MetaParams) => {
  window.fbq?.('track', event, params)
}

/** Evento propio del sitio; en Meta aparece como «personalizado». */
export const trackMetaCustom = (event: string, params?: MetaParams) => {
  window.fbq?.('trackCustom', event, params)
}
