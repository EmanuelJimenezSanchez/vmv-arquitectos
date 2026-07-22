import Lenis from 'lenis'
import Snap from 'lenis/snap'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { $$ } from '@/lib/dom-selector'

export function initLenis() {
  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({
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

  const isPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!isPrefersReducedMotion) {
    const snap = new Snap(lenis, {
      type: 'proximity',
      duration: 1,
    })

    const sections = $$('#main-content > section')
    snap.addElements(sections, { align: ['start'] })
  }

  return lenis
}
