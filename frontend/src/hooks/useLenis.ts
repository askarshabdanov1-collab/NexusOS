import { useEffect } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

export function useLenis() {
  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth acceleration/deceleration
      gestureOrientation: 'vertical',
      smoothWheel: true
    })

    // Bind Lenis animation frame loop
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Handle scroll trigger integration with GSAP!
    // Since Lenis controls the scroll position, we must notify GSAP of every scroll update
    lenis.on('scroll', () => {
      ScrollTrigger.update()
    })

    return () => {
      lenis.destroy()
    }
  }, [])
}
