import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import SceneBackground from '../components/three/SceneBackground'
import Footer from '../components/layout/Footer'

// Premium UI elements
import DecryptedText from '../components/ui/DecryptedText'
import ShinyButton from '../components/ui/ShinyButton'
import LiquidGoldMaterial from '../components/three/LiquidGoldMaterial'
import AboutSection from '../components/sections/AboutSection'
import TutorParallaxSlider from '../components/sections/TutorParallaxSlider'
import ExplodingObjectsSection from '../components/sections/ExplodingObjectsSection'
import { useGsapReveal } from '../hooks/useGsapReveal'

// 3D Canvas elements
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Float } from '@react-three/drei'
import * as THREE from 'three'

import {
  ArrowRight, Star, Shield, Globe, ChevronRight, Cpu, Compass, HardDrive, GraduationCap
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '10,000+', label: 'Студентов в базе', key: 'STUDENTS', desc: 'Успешно прошедших обучение' },
  { value: '1,500+', label: 'Экспертов-тьюторов', key: 'TUTORS', desc: 'Прошедших жесткий отбор' },
  { value: '98%', label: 'Удовлетворенность', key: 'SATISFACTION', desc: 'По оценкам регулярных опросов' },
  { value: '50+', label: 'Дисциплин', key: 'SUBJECTS', desc: 'От школьной математики до ИИ' },
]

const FEATURES = [
  {
    icon: Cpu,
    title: 'Интеллектуальный подбор',
    desc: 'Наши алгоритмы анализируют цели обучения и связывают вас с наставниками оптимального вектора.',
    code: '01'
  },
  {
    icon: Shield,
    title: 'Верификация документов',
    desc: 'Каждое портфолио, диплом и резюме проверяются вручную нашими специалистами по качеству.',
    code: '02'
  },
  {
    icon: Compass,
    title: 'Удобное расписание',
    desc: 'Интеграция слотов времени. Резервируйте уроки без лишних переписок и звонков.',
    code: '03'
  },
  {
    icon: Globe,
    title: 'Гибридный формат',
    desc: 'Проводите уроки в нашей интерактивной комнате или планируйте оффлайн-сессии в удобной геолокации.',
    code: '04'
  },
]

const SUBJECTS = [
  { name: 'Математика', emoji: '📐', count: 234, key: 'math', spec: 'MATH' },
  { name: 'Английский', emoji: '🇬🇧', count: 189, key: 'english', spec: 'LANG.ENG' },
  { name: 'Физика', emoji: '⚡', count: 145, key: 'physics', spec: 'PHYS' },
  { name: 'Химия', emoji: '🧪', count: 98, key: 'chemistry', spec: 'CHEM' },
  { name: 'Программирование', emoji: '💻', count: 167, key: 'programming', spec: 'CODE' },
  { name: 'История', emoji: '📜', count: 112, key: 'history', spec: 'HIST' },
  { name: 'Биология', emoji: '🔬', count: 88, key: 'biology', spec: 'BIO' },
  { name: 'Музыка', emoji: '🎵', count: 54, key: 'music', spec: 'SOUND' },
]

function CustomCube(props: any) {
  const meshRef = useRef<any>(null)
  const { scene } = useGLTF('/models/cube.glb')

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15
    }
  })

  return (
    <primitive ref={meshRef} object={scene} {...props} />
  )
}

function TacticalOrbPanel() {
  return (
    <div style={{ height: '140px', width: '100%', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '12px', position: 'relative', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2.0} />
        
        {/* Floating Satin Material sphere */}
        <Float speed={2.0} rotationIntensity={0.8} floatIntensity={0.8}>
          <LiquidGoldMaterial 
            position={[-1.2, 0, 0]} 
            scale={[0.7, 0.7, 0.7] as any} 
          />
        </Float>

        {/* Floating 3D Cube */}
        <Float speed={2.5} rotationIntensity={1.0} floatIntensity={0.6}>
          <CustomCube 
            position={[1.2, 0, 0]} 
            scale={[1.8, 1.8, 1.8] as any} 
          />
        </Float>
      </Canvas>
    </div>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const terminalEndRef = useRef<HTMLDivElement>(null)

  // Stagger reveals for subjects and cards
  useGsapReveal({
    triggerSelector: '.cyber-features-section',
    targetSelector: '.cyber-feature-card',
    staggerDelay: 0.12,
    duration: 0.8
  })

  useGsapReveal({
    triggerSelector: '.cyber-subjects-section',
    targetSelector: '.subject-chip-node',
    staggerDelay: 0.08,
    duration: 0.6
  })

  // Terminal boot logs sequence
  useEffect(() => {
    const initialLogs = [
      'ASSISTANT v1.2: INITIALIZING...',
      'CONNECTING TO ENROLLMENT DATALINK... SUCCESS',
      'QUALIFIED_TUTORS: 1,500+ ACTIVE NODES',
      'READY FOR SEARCH QUERY.'
    ]

    initialLogs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
      }, index * 250)
    })
  }, [])

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [terminalLogs])

  // Scroll shutter reveal gate animation
  useEffect(() => {
    const revealTL = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero-hud-section',
        start: 'top top',
        end: '+=280px',
        scrub: true,
        invalidateOnRefresh: true,
      }
    })

    revealTL.to('.reveal-gate-left', {
      xPercent: -100,
      ease: 'none'
    }, 0)
    revealTL.to('.reveal-gate-right', {
      xPercent: 100,
      ease: 'none'
    }, 0)
    revealTL.to('.reveal-gate-border', {
      opacity: 0,
      scale: 1.4,
      ease: 'none'
    }, 0)

    return () => {
      revealTL.scrollTrigger?.kill()
      revealTL.kill()
    }
  }, [])

  // Custom Interactive Console commands
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentInput.trim()) return

    const input = currentInput.trim().toLowerCase()
    let response = ''

    setTerminalLogs(prev => [...prev, `> guest@assistant:~# ${currentInput}`])

    if (input === 'help') {
      response = 'ДОСТУПНЫЕ КОМАНДЫ: [search] (поиск предмета, напр: search math), [stats] (метрики), [status] (статус), [clear]'
    } else if (input.startsWith('search ')) {
      const query = input.replace('search ', '')
      response = `ПОИСК ПО НАПРАВЛЕНИЮ [${query.toUpperCase()}]. НАЙДЕНО: ${Math.floor(Math.random() * 50) + 10}. Перенаправление...`
      setTimeout(() => {
        navigate(`/tutors?subject=${query}`)
      }, 1200)
    } else if (input === 'stats') {
      response = 'СТАТИСТИКА: СТУДЕНТОВ: 10,000+ | НАСТАВНИКОВ: 1,500+ | УСПЕШНОСТЬ: 98%'
    } else if (input === 'status') {
      response = 'СИСТЕМА: АКТИВНА | 3D CANVAS: СТАБИЛЕН'
    } else if (input === 'clear') {
      setTerminalLogs([])
      setCurrentInput('')
      return
    } else {
      response = `КОМАНДА [${currentInput}] НЕ НАЙДЕНА. Введите 'help' для справки.`
    }

    setTimeout(() => {
      setTerminalLogs(prev => [...prev, `[SYSTEM] ${response}`])
    }, 200)

    setCurrentInput('')
  }

  // Hovering a subject simulates database queries in terminal logs
  const handleSubjectHover = (spec: string, count: number) => {
    setTerminalLogs(prev => [
      ...prev,
      `[QUERY] СКАНИРОВАНИЕ НАПРАВЛЕНИЯ: ${spec} | АКТИВНЫХ НАСТАВНИКОВ: ${count}`
    ])
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-primary)', overflowX: 'hidden', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>
      
      <style>{`
        .cinematic-grid {
          background-size: 50px 50px;
          background-image: 
            linear-gradient(to right, rgba(29, 30, 32, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(29, 30, 32, 0.015) 1px, transparent 1px);
        }
      `}</style>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none cinematic-grid" style={{ zIndex: 1 }} />
      
      {/* 3D WebGL Background Scene */}
      <SceneBackground style={{ zIndex: 0 }} />

      {/* ═══ NAV BAR ═══ */}
      <header style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, padding: '24px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ maxWidth: '95%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px',
              background: 'var(--color-accent-primary)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={16} color="#FAF6F0" />
            </div>
            <span className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Nexus Academy
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link to="/tutors" className="btn-secondary" style={{ padding: '8px 18px', borderRadius: '8px' }}>
              Поиск
            </Link>
            <Link to="/login" className="btn-ghost" style={{ padding: '8px 18px' }}>
              Войти
            </Link>
            <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '8px' }}>
              Создать кабинет
            </Link>
          </div>
        </div>
      </header>
 
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-hud-section" style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden',
        paddingTop: '100px', paddingBottom: '60px'
      }}>
        {/* 🔴 Editorial Shutter Gate */}
        <div className="reveal-gate-container" style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none',
          zIndex: 30,
          overflow: 'hidden',
          display: 'flex'
        }}>
          {/* Left Wing Shutter */}
          <div className="reveal-gate-left" style={{
            width: '50%',
            height: '100%',
            background: 'var(--color-bg-secondary)',
            borderRight: '1px solid var(--color-border)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '32px',
            boxShadow: '10px 0 30px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)', letterSpacing: '0.08em' }}>
              NEXUS ACADEMY // L.CORE
            </div>
          </div>

          {/* Right Wing Shutter */}
          <div className="reveal-gate-right" style={{
            width: '50%',
            height: '100%',
            background: 'var(--color-bg-secondary)',
            borderLeft: '1px solid var(--color-border)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: '32px',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--color-text-secondary)', letterSpacing: '0.08em' }}>
              NEXUS ACADEMY // R.CORE
            </div>
          </div>

          {/* Shutter ring */}
          <div className="reveal-gate-border" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-secondary)', textAlign: 'center', lineHeight: '1.4' }}>
              [ SCROLL ]<br/>
              ENTER<br/>
              CORE
            </div>
          </div>
        </div>
        
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 40%, rgba(108,126,114,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(195,139,123,0.03) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '95%', margin: '0 auto', width: '100%', padding: '0 24px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '48px', alignItems: 'stretch' }}>
            
            {/* Title / Info Column */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', borderRadius: '6px', marginBottom: '24px' }}>
                <Cpu size={12} color="var(--color-accent-primary)" />
                <DecryptedText 
                  text="Интеллектуальная система подбора" 
                  speed={30} 
                  className="text-[10px] font-mono tracking-[0.05em] text-var(--color-accent-primary) uppercase" 
                />
              </div>

              <div>
                <h1 className="serif-title" style={{
                  fontSize: 'clamp(2.5rem, 5.5vw, 5.0rem)',
                  fontWeight: 'bold',
                  lineHeight: '0.95',
                  letterSpacing: '-0.03em',
                  color: 'var(--color-text-primary)',
                  marginBottom: '20px'
                }}>
                  <DecryptedText text="Найдите свой" speed={30} delay={0} /><br />
                  <DecryptedText text="образовательный" speed={35} delay={100} className="serif-title italic font-light" /><br />
                  <DecryptedText text="путь" speed={30} delay={200} />
                </h1>
              </div>

              <p style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.65',
                marginBottom: '36px',
                maxWidth: '540px'
              }}>
                Децентрализованная премиальная система наставников в Кыргызстане. Интерактивная среда обучения, высококвалифицированные эксперты и качественный трансфер знаний.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <ShinyButton 
                  text="Найти наставника" 
                  onClick={() => navigate('/tutors')}
                />
                
                <Link to="/register?role=tutor" className="btn-secondary" style={{ padding: '16px 32px', borderRadius: '12px' }}>
                  Стать наставником
                </Link>
              </div>
            </div>

            {/* Interactive Console Module Column */}
            <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-elevated)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c98b82' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D29D56' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8CA693' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', marginLeft: '8px' }}>поисковый ассистент</span>
                </div>
              </div>

              {/* 3D Canvas */}
              <TacticalOrbPanel />

              {/* Console logs screen */}
              <div style={{
                height: '140px', overflowY: 'auto', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: '8px',
                padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-text-primary)', lineHeight: '1.6'
              }}>
                {terminalLogs.map((log, i) => {
                  let logColor = 'var(--color-accent-primary)'
                  if (log.includes('SYSTEM')) logColor = 'var(--color-accent-gold)'
                  if (log.includes('ERROR')) logColor = 'var(--color-accent-rose)'
                  return (
                    <div key={i} style={{ color: logColor }}>
                      {log}
                    </div>
                  )
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Console Input Prompt */}
              <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center' }}>&gt;</span>
                <input
                  type="text"
                  value={currentInput}
                  onChange={e => setCurrentInput(e.target.value)}
                  placeholder="Команда: help или search math..."
                  className="input-glass"
                  style={{
                    flex: 1, padding: '8px 12px', fontSize: '12px', fontFamily: 'var(--font-mono)'
                  }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  Найти
                </button>
              </form>
            </div>

            {/* Column 3: Generative Graphics (Google Veo 3) */}
            <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-elevated)', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>veo3.generative_ui</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/veo3_illustration.png" alt="Veo 3 Illustration" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ marginTop: '12px' }}>
                <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Адаптивные нейро-иллюстрации</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  Интеграция высокотехнологичных генеративных моделей от Google Veo 3 для построения интерактивных учебных планов и графиков.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ METRICS SECTION ═══ */}
      <section className="cyber-stats-section" style={{ padding: '60px 24px', position: 'relative', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        <div style={{ maxWidth: '95%', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', backgroundColor: 'var(--color-border)' }}>
            {STATS.map(({ value, label, key, desc }, index) => (
              <div key={key} className="cyber-stat-node" style={{ padding: '32px', backgroundColor: 'var(--color-bg-primary)', transition: 'all 0.3s ease' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-accent-primary)', letterSpacing: '0.05em' }}>
                  0{index + 1} // METRIC
                </div>
                <div className="serif-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', lineHeight: '1', margin: '12px 0' }}>
                  {value}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-accent-secondary)', fontFamily: 'var(--font-primary)' }}>{label}</div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Video Scrubbing About section */}
      <AboutSection />

      {/* ═══ SUBJECTS SECTION ═══ */}
      <section className="cyber-subjects-section" style={{ padding: '100px 24px', position: 'relative' }}>
        <div style={{ maxWidth: '95%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
              <Compass size={12} /> Направления обучения
            </div>
            <h2 className="serif-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Выберите направление обучения
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
            {SUBJECTS.map((s) => (
              <Link key={s.key} to={`/tutors?subject=${s.key}`} style={{ textDecoration: 'none' }}
                onMouseEnter={() => handleSubjectHover(s.spec, s.count)}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="subject-chip-node glass-card"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px',
                    border: '1px solid var(--color-border)', borderRadius: '12px',
                    cursor: 'pointer', transition: 'all 0.3s'
                  }}
                  onHoverStart={e => {
                    const el = (e.target as HTMLElement)
                    el.style.borderColor = 'var(--color-accent-primary)'
                    el.style.boxShadow = 'var(--shadow-glow-primary)'
                  }}
                  onHoverEnd={e => {
                    const el = (e.target as HTMLElement)
                    el.style.borderColor = 'var(--color-border)'
                    el.style.boxShadow = 'var(--shadow-card)'
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{s.emoji}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{s.spec}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{s.name} ({s.count} тьюторов)</div>
                  </div>
                  <ChevronRight size={14} color="var(--color-text-tertiary)" />
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES SECTION ═══ */}
      <section className="cyber-features-section" style={{ padding: '80px 24px', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div style={{ maxWidth: '95%', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
              <HardDrive size={12} /> Наш подход
            </div>
            <h2 className="serif-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
              Экосистема Nexus Academy
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:col-span-2">
              {FEATURES.map((f) => (
                <div key={f.title} className="cyber-feature-card glass-card" style={{ padding: '36px', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{
                      width: '48px', height: '48px', background: 'rgba(108,126,114,0.1)', border: '1px solid rgba(108,126,114,0.15)',
                      borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <f.icon size={20} color="var(--color-accent-primary)" />
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-tertiary)' }}>{f.code}</span>
                  </div>
                  <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '12px' }}>{f.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Column 3: Generative Graphics (Nanobanana) */}
            <div className="glass-card" style={{ padding: '32px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-elevated)', display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-secondary)' }} />
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>nanobanana.generative_ui</span>
                </div>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/nanobanana_illustration.png" alt="Nanobanana Illustration" style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--color-border)' }} />
              </div>
              <div style={{ marginTop: '12px' }}>
                <h3 className="serif-title" style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Абстрактная 3D визуализация</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                  Генерация эстетических 3D иллюстраций в стиле Nanobanana для визуализации траекторий развития и синергии наставников.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Exploding Objects Section */}
      <ExplodingObjectsSection />

      {/* 3D Horizontal Parallax Tutor Slider */}
      <TutorParallaxSlider />

      {/* ═══ CTA SYSTEM INTERFACE ═══ */}
      <section style={{ padding: '120px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '95%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div className="glass-card" style={{ padding: '60px 32px', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-elevated)' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
              НАЧАТЬ ОБУЧЕНИЕ
            </div>
            <h2 className="serif-title" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '20px' }}>
              Готовы начать обучение с лучшими наставниками?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px', lineHeight: '1.7' }}>
              Создайте учетную запись, выберите подходящую дисциплину и начните взаимодействовать с лучшими преподавателями страны.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
              <ShinyButton 
                text="Создать аккаунт" 
                onClick={() => navigate('/register')}
              />
              
              <Link to="/tutors" className="btn-secondary" style={{ padding: '16px 36px', borderRadius: '12px' }}>
                Поиск наставников
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
