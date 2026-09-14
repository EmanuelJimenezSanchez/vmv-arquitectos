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

  /** Elemento al que apunta el hash actual, si existe en la página. */
  const hashTarget = (hash) => {
    if (!hash || hash === '#') {
      return null
    }
    try {
      return document.getElementById(decodeURIComponent(hash.slice(1)))
    } catch {
      return null
    }
  }

  const scrollToHash = (target, immediate) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const y = target.getBoundingClientRect().top + window.scrollY

    // Las secciones con scroll secuestrado (la intro de Nosotros bloquea el
    // scroll mientras se reproduce) necesitan saber que viene un salto
    // programático, o lo frenan a medio camino.
    window.dispatchEvent(new CustomEvent('vmv:anchor-scroll', { detail: { y } }))

    lenis.scrollTo(target, { immediate: immediate || reduceMotion, force: true })
  }

  /**
   * Los enlaces internos se resuelven aquí en lugar de dejar el salto nativo:
   * Lenis mantiene su propia posición animada y en el siguiente frame revertía
   * el salto, dejando la página en la sección anterior. Va delegado en
   * `document` para cubrir header, menú móvil y footer sin re-registrar nada
   * tras cada navegación de Astro.
   */
  document.addEventListener(
    'click',
    (event) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return
      }

      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!link || link.target === '_blank' || link.hasAttribute('data-anchor-manual')) {
        return
      }

      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
        return
      }

      const target = hashTarget(url.hash)
      if (!target) {
        return
      }

      // `stopPropagation` deja fuera al ClientRouter de Astro, que también
      // escucha los clics en enlaces y haría su propio salto nativo.
      event.preventDefault()
      event.stopPropagation()
      history.pushState(null, '', url.hash)
      scrollToHash(target, false)
    },
    // En captura, porque el listener del ClientRouter está en `document` y
    // en burbuja se adelantaría a este.
    true,
  )

  // Un `scrollTo` en vuelo (la inercia de un scroll suave, o el salto a un
  // ancla) sobrevive al cambio de página y sigue animando hasta el destino de
  // la página anterior: se entraba al proyecto ya scrolleado. `stop()` corta
  // esa animación antes de que Astro intercambie el documento.
  document.addEventListener('astro:before-swap', () => {
    lenis.stop()
  })

  document.addEventListener('astro:page-load', () => {
    // Tras el swap, Astro reposiciona el scroll por su cuenta; Lenis mantiene
    // su propio valor animado y volvería a la posición de la página anterior.
    lenis.resize()
    lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    lenis.start()

    // Las secciones montan sus pins en su propio listener de page-load; el rAF
    // deja que todos corran antes de recalcular las medidas de ScrollTrigger.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()

      // Llegar con hash (navegación desde otra página o recarga directa) exige
      // reposicionar después del refresh: los pins reservan scroll y el salto
      // nativo del navegador se calculó sobre las medidas previas.
      const target = hashTarget(window.location.hash)
      if (target) {
        scrollToHash(target, true)
      }
    })
  })

  return lenis
}
