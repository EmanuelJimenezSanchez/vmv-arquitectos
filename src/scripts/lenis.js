import Lenis from 'lenis'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

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

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })

  // Evita que GSAP intente compensar caídas de FPS
  gsap.ticker.lagSmoothing(0)

  return lenis
}
