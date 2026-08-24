import Lenis from 'lenis'
import Snap from 'lenis/snap'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { $$ } from '@/lib/dom-selector'

let lenis = null
let snap = null

const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const destroySnap = () => {
  snap?.destroy()
  snap = null
}

// El snap guarda una referencia a cada <section> de la página actual (con su
// ResizeObserver). Tras una navegación con ClientRouter esos nodos quedan
// huérfanos y el snap sigue calculando posiciones sobre ellos, así que hay que
// reconstruirlo con las secciones del documento nuevo en cada page-load.
const buildSnap = () => {
  destroySnap()

  if (!lenis || isReducedMotion()) {
    return
  }

  const sections = $$('#main-content > section:not([data-no-snap])')
  if (sections.length === 0) {
    return
  }

  snap = new Snap(lenis, {
    type: 'proximity',
    duration: 1,
  })
  snap.addElements(sections, { align: ['start'] })
}

export function initLenis() {
  gsap.registerPlugin(ScrollTrigger)

  // Este módulo solo se ejecuta en la primera carga: ClientRouter no vuelve a
  // ejecutar scripts ya cargados. Todo lo que dependa del documento se
  // recalcula desde los eventos de Astro.
  if (lenis) {
    return lenis
  }

  lenis = new Lenis({
    duration: 1.5,
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
    overscroll: true,
    easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  })

  window.lenis = lenis

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  // Evita que GSAP intente compensar caídas de FPS
  gsap.ticker.lagSmoothing(0)

  buildSnap()

  document.addEventListener('astro:before-swap', destroySnap)

  document.addEventListener('astro:page-load', () => {
    // Tras el swap, Astro reposiciona el scroll por su cuenta; Lenis mantiene
    // su propio valor animado y volvería a la posición de la página anterior.
    lenis.resize()
    lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    buildSnap()

    // Las secciones montan sus pins en su propio listener de page-load; el rAF
    // deja que todos corran antes de recalcular las medidas de ScrollTrigger.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  })

  return lenis
}
