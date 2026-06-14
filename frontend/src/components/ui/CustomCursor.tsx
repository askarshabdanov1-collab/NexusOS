import { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [hidden, setHidden] = useState(true)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    if (!dot || !ring) return

    // Track mouse coordinates
    const onMouseMove = (e: MouseEvent) => {
      setHidden(false)
      
      // Animate dot instantly
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power3.out'
      })

      // Animate outer ring with a slight premium lag/lerp!
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: 'power2.out'
      })
    }

    const onMouseEnter = () => setHidden(false)
    const onMouseLeave = () => setHidden(true)

    // Handle hover states on interactive buttons/links
    const addHoverListeners = () => {
      const targets = document.querySelectorAll('a, button, [role="button"], .interactive-node, .hud-border, input, select, textarea')
      targets.forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    
    // Add hover listeners immediately and check for dynamic nodes periodically
    addHoverListeners()
    const interval = setInterval(addHoverListeners, 1500)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      clearInterval(interval)
    }
  }, [])

  return (
    <>
      {/* 🔴 Custom Cursor Outer Ring (Sage Pastel Accent) */}
      <div
        ref={cursorRingRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovered ? '44px' : '20px',
          height: hovered ? '44px' : '20px',
          border: hovered ? '1.5px solid #6C7E72' : '1px solid rgba(29, 30, 32, 0.2)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          opacity: hidden ? 0 : 1,
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border 0.25s, background 0.25s',
          background: hovered ? 'rgba(108, 126, 114, 0.12)' : 'transparent',
          boxShadow: 'none'
        }}
      />

      {/* 🔴 Custom Cursor Core Dot (Charcoal Ink) */}
      <div
        ref={cursorDotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: hovered ? '6px' : '4px',
          height: hovered ? '6px' : '4px',
          backgroundColor: '#1D1E20',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 100000,
          opacity: hidden ? 0 : 1,
          transition: 'width 0.15s ease, height 0.15s ease'
        }}
      />
    </>
  )
}
