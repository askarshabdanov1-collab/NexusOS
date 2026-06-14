import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  triggerSelector: string
  targetSelector: string
  staggerDelay?: number
  duration?: number
}

export function useGsapReveal({
  triggerSelector,
  targetSelector,
  staggerDelay = 0.12,
  duration = 0.8
}: RevealOptions) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(targetSelector,
        {
          opacity: 0,
          y: 40,
          scale: 0.96
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: duration,
          stagger: staggerDelay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: triggerSelector,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )
    })

    return () => ctx.revert()
  }, [triggerSelector, targetSelector, staggerDelay, duration])
}
