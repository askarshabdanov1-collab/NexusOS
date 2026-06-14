import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Star, Shield, ArrowRight, Zap } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PARALLAX_TUTORS = [
  {
    id: 1,
    name: 'Арман Сериков',
    subject: 'Высшая математика & ИИ',
    rating: '5.0',
    experience: '8 лет опыта',
    price: '1,500 сом',
    avatar: 'A',
    university: 'АУЦА (AUCA) / University of Birmingham',
    accent: '#6C7E72',
    spec: 'MATH.AI_CORE'
  },
  {
    id: 2,
    name: 'Айзат Кусаинова',
    subject: 'Full-Stack Web (React/Node.js)',
    rating: '4.9',
    experience: '6 лет опыта',
    price: '1,800 сом',
    avatar: 'A',
    university: 'КРСУ имени Б.Н. Ельцина',
    accent: '#C38B7B',
    spec: 'DEV.FULL_STACK'
  },
  {
    id: 3,
    name: 'Дмитрий Власов',
    subject: 'Квантовая физика & Олимпиадные задачи',
    rating: '5.0',
    experience: '12 лет опыта',
    price: '2,200 сом',
    avatar: 'D',
    university: 'КНУ им. Ж. Баласагына / МФТИ',
    accent: '#A69E8F',
    spec: 'PHYS.QUANTUM'
  },
  {
    id: 4,
    name: 'Мария Леманн',
    subject: 'Академический английский & IELTS Prep',
    rating: '5.0',
    experience: '9 лет опыта',
    price: '1,600 сом',
    avatar: 'M',
    university: 'АУЦА / University of Oxford',
    accent: '#D29D56',
    spec: 'LANG.IELTS_PREP'
  }
]

export default function TutorParallaxSlider() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    if (!container || !track) return

    const getScrollAmount = () => {
      return track.scrollWidth - window.innerWidth + (window.innerWidth * 0.08)
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${getScrollAmount() * 1.1}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        }
      })

      // Horizontal track movement
      tl.to(track, {
        x: () => -getScrollAmount(),
        ease: 'none'
      }, 0)

      // Parallax effect for background letters (moves slowly to the left)
      tl.to('.parallax-layer-bg', {
        x: -60,
        ease: 'none'
      }, 0)

      // Parallax effect for foreground panels (moves to the right)
      tl.to('.parallax-layer-fg', {
        x: 60,
        ease: 'none'
      }, 0)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: '100vh', 
        position: 'relative', 
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}
    >
      <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Soft grid background overlay */}
        <div className="absolute inset-0 pointer-events-none cinematic-grid" style={{ opacity: 0.2 }} />

        {/* Title */}
        <div style={{ position: 'absolute', top: '8%', left: '8%', zIndex: 20 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent-primary)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            НАСТАВНИКИ ПЛАТФОРМЫ // VEO 3 & NANOBANANA
          </div>
          <h2 className="serif-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginTop: '6px' }}>
            Элитный преподавательский состав
          </h2>
        </div>

        {/* Horizontal Scroll Track */}
        <div 
          ref={trackRef}
          style={{ 
            display: 'flex', 
            width: 'max-content', 
            height: '100%', 
            alignItems: 'center', 
            paddingLeft: '8vw', 
            paddingRight: '8vw',
            gap: '6vw', 
            zIndex: 10, 
            position: 'relative' 
          }}
        >
          {PARALLAX_TUTORS.map((tutor) => (
            <div
              key={tutor.id}
              className="parallax-slide-card"
              style={{
                width: '680px',
                height: '420px',
                flexShrink: 0,
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                background: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              {/* 1️⃣ Background Layer: Giant stylized letter & grid overlays (Moves Slowest) */}
              <div
                className="parallax-layer-bg"
                style={{
                  position: 'absolute', inset: 0, zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.03, pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: '420px', fontWeight: '900', color: 'var(--color-accent-primary)', fontFamily: 'var(--font-mono)' }}>
                  {tutor.avatar}
                </div>
              </div>

              {/* 2️⃣ Middle Layer: Active content frame & tutor details (Moves Normal) */}
              <div
                className="parallax-layer-mid"
                style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', borderRadius: '6px', marginBottom: '16px' }}>
                    <Shield size={12} color="var(--color-accent-primary)" />
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', letterSpacing: '0.05em' }}>{tutor.spec}</span>
                  </div>

                  <h3 className="serif-title" style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--color-text-primary)', letterSpacing: '-0.01em' }}>
                    {tutor.name}
                  </h3>
                  
                  <p style={{ fontSize: '16px', color: 'var(--color-accent-primary)', marginTop: '6px', fontWeight: '600' }}>
                    {tutor.subject}
                  </p>

                  <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '12px', maxWidth: '380px', lineHeight: '1.6' }}>
                    Выпускник {tutor.university}. Специализированная подготовка по международным стандартам.
                  </p>
                </div>

                {/* Action Button */}
                <div>
                  <Link
                    to={`/tutors/${tutor.id}`}
                    className="btn-secondary"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      padding: '12px 24px', borderRadius: '10px', textDecoration: 'none'
                    }}
                  >
                    Подробнее о наставнике <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* 3️⃣ Foreground Layer: Glassmorphic Floating HUD overlay (Moves Fastest) */}
              <div
                className="parallax-layer-fg"
                style={{
                  position: 'absolute', right: '48px', top: '15%', zIndex: 3,
                  width: '180px', height: '240px',
                  background: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', color: 'var(--color-text-tertiary)', letterSpacing: '0.05em' }}>
                    METRICS_DATA
                  </div>
                  <div style={{ marginTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={14} fill="var(--color-accent-gold)" color="var(--color-accent-gold)" />
                      <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{tutor.rating}</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Рейтинг наставника</div>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-text-primary)' }}>{tutor.price}</div>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>Стоимость урока</div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <Zap size={12} color="var(--color-accent-primary)" />
                    <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-accent-primary)' }}>ONLINE_READY</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
