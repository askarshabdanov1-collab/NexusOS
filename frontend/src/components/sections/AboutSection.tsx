import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { Cpu, Shield, Zap, Globe, Sparkles } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

// 3D Satin Ceramic Knot representing structural continuity
function SatinCeramicCore({ scrollProgress }: { scrollProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = scrollProgress * Math.PI * 2
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.15
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.3}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1.1, 0.38, 120, 16]} />
        <MeshDistortMaterial
          color="#6C7E72" /* Sage green porcelain */
          roughness={0.65}
          metalness={0.05}
          distort={0.2}
          speed={2.2}
          clearcoat={0.15}
          clearcoatRoughness={0.4}
          transmission={0.35}
          thickness={0.8}
        />
      </mesh>
    </Float>
  )
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const container = containerRef.current
    if (!container) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
          
          if (video && video.duration && !videoError) {
            const targetTime = self.progress * video.duration
            gsap.to(video, {
              currentTime: targetTime,
              duration: 0.1,
              ease: 'none'
            })
          }
        }
      }
    })

    // Timeline phases for cards stagger entrance and exit:
    tl.fromTo('.hud-card-1',
      { opacity: 0, x: -50, scale: 0.96 },
      { opacity: 1, x: 0, scale: 1, duration: 1.5 }
    )
    
    tl.to('.hud-card-1', { opacity: 0, y: -50, duration: 1.2 }, '+=0.5')
    tl.fromTo('.hud-card-2',
      { opacity: 0, x: 50, scale: 0.96 },
      { opacity: 1, x: 0, scale: 1, duration: 1.5 },
      '-=0.2'
    )

    tl.to('.hud-card-2', { opacity: 0, y: -50, duration: 1.2 }, '+=0.5')
    tl.fromTo('.hud-card-3',
      { opacity: 0, y: 50, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5 },
      '-=0.2'
    )

    tl.to({}, { duration: 0.8 })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [videoError])

  const handleVideoLoaded = () => {
    setVideoLoaded(true)
    setVideoError(false)
  }

  const handleVideoError = () => {
    setVideoError(true)
  }

  return (
    <div 
      ref={containerRef} 
      className="about-scrub-container" 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        overflow: 'hidden'
      }}
    >
      {/* Soft warm sage lighting behind character */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(108, 126, 114, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} 
      />

      {/* Option A: 3D Video Scrubbing (if exists) */}
      {!videoError && (
        <video
          ref={videoRef}
          src="/video/tutor_rotation.mp4"
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={handleVideoLoaded}
          onError={handleVideoError}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '85vh',
            width: 'auto',
            objectFit: 'contain',
            zIndex: 2,
            opacity: videoLoaded ? 0.65 : 0,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Option B: Elegant Satin R3F Knot Fallback */}
      {(videoError || !videoLoaded) && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 2
          }}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2.0} color="#6C7E72" />
            <pointLight position={[-10, -10, -10]} intensity={1.0} color="#C38B7B" />
            <SatinCeramicCore scrollProgress={scrollProgress} />
          </Canvas>
        </div>
      )}

      {/* 2. ELEGANT EDITORIAL LABELS */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', padding: '40px' }}>
        {/* Top-Left Info */}
        <div style={{ position: 'absolute', top: '100px', left: '40px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)', lineHeight: '1.7' }}>
          ILLUSTRATIONS: GOOGLE VEO 3<br />
          ANIMATIONS: NANOBANANA CORE<br />
          ROTATION_DEGREES: {(scrollProgress * 360).toFixed(0)}°
        </div>

        {/* Bottom-Right Diagnostics */}
        <div style={{ position: 'absolute', bottom: '100px', right: '40px', fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)', textAlign: 'right', lineHeight: '1.7' }}>
          ENGINE: VEO_3_RENDER_GATE<br />
          MATERIAL: SATIN_CERAMIC_KNOT
        </div>

        {/* Centered Scroll Progress Bar */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '2px', background: 'var(--color-border)' }}>
          <div style={{ width: `${scrollProgress * 100}%`, height: '100%', background: 'var(--color-accent-primary)', transition: 'width 0.1s ease' }} />
        </div>
      </div>

      {/* 3. EDITORIAL MINIMAL CARDS (Controlled by GSAP) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '95%', padding: '0 24px', position: 'relative', height: '100%' }}>
          
          {/* Card 1: Top-Left */}
          <div 
            className="hud-card-1 glass-card" 
            style={{
              position: 'absolute',
              top: '25%',
              left: '5%',
              width: '380px',
              padding: '32px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              pointerEvents: 'auto',
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(108,126,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={14} color="var(--color-accent-primary)" />
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>I. МЕНТАЛЬНЫЙ ПОДХОД</span>
            </div>
            <h3 className="serif-title" style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>ИНТЕЛЛЕКТУАЛЬНЫЙ ТРАНСФЕР</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Наша миссия — соединить лучшие умы страны через качественные каналы связи и индивидуальный подбор. Обучение нового поколения лидеров.
            </p>
          </div>

          {/* Card 2: Right-Center */}
          <div 
            className="hud-card-2 glass-card" 
            style={{
              position: 'absolute',
              top: '35%',
              right: '5%',
              width: '380px',
              padding: '32px',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-card)',
              pointerEvents: 'auto',
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(108,126,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={14} color="var(--color-accent-primary)" />
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>II. ГАРАНТИЯ КАЧЕСТВА</span>
            </div>
            <h3 className="serif-title" style={{ fontSize: '22px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>ТЩАТЕЛЬНЫЙ АУДИТ</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
              Мы верифицируем каждого тьютора, проверяя квалификацию по международным стандартам. Мгновенное бронирование без лишней переписки.
            </p>
          </div>

          {/* Card 3: Center-Bottom Final CTA Card */}
          <div 
            className="hud-card-3 glass-card" 
            style={{
              position: 'absolute',
              bottom: '18%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '460px',
              padding: '36px',
              border: '1px solid var(--color-border)',
              textAlign: 'center',
              boxShadow: 'var(--shadow-elevated)',
              pointerEvents: 'auto',
              opacity: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <div style={{ display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(108,126,114,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={14} color="var(--color-accent-primary)" />
              </div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>III. ЭКОСИСТЕМА РАЗВИТИЯ</span>
            </div>
            <h3 className="serif-title" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>ГИБРИДНАЯ СРЕДА</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '12px' }}>
              Интерактивные классы, виртуальные инструменты обучения и оффлайн-локации в один клик. Начните свое движение уже сегодня.
            </p>
            <a href="/tutors" className="btn-primary" style={{ padding: '12px 28px' }}>
              Найти наставника
            </a>
          </div>

        </div>
      </div>

    </div>
  )
}
