import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

let lenis = null

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

  document.addEventListener('astro:page-load', () => {
    // Tras el swap, Astro reposiciona el scroll por su cuenta; Lenis mantiene
    // su propio valor animado y volvería a la posición de la página anterior.
    lenis.resize()
    lenis.scrollTo(window.scrollY, { immediate: true, force: true })

    // Las secciones montan sus pins en su propio listener de page-load; el rAF
    // deja que todos corran antes de recalcular las medidas de ScrollTrigger.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  })

  return lenis
}
