/// <reference types="astro/client" />

import type Lenis from 'lenis'
import type * as maplibre from 'maplibre-gl'

declare global {
  interface Window {
    lenis?: Lenis
    maplibregl?: typeof maplibre
  }
}
