import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const STEPS = [
  {
    title: 'ИНДИВИДУАЛЬНЫЕ КАРТЫ',
    desc: 'Автоматическая фиксация целей обучения студентов и качественный трансфер в профили наставников.',
    code: 'MAPS.AUTO_TRANS'
  },
  {
    title: 'ОБМЕН ЗНАНИЯМИ',
    desc: 'Интерактивные совместные занятия в реальном времени. Векторное позиционирование учебных планов.',
    code: 'VECTOR.EXCHANGE'
  },
  {
    title: 'СТАНДАРТЫ КАЧЕСТВА',
    desc: 'Абсолютный контроль уровня: ручной аудит каждого диплома, сертификата и оффлайн-локации.',
    code: 'QUALITY.AUDIT'
  },
  {
    title: 'ОПТИМАЛЬНЫЙ БАЛАНС',
    desc: 'Резервирование в один клик. Идеальный баланс стоимости и квалификации для каждого студента.',
    code: 'BALANCE.RESERVE'
  }
]

function InteractiveMesh({ shapeType, index, activeStep, position }: { shapeType: string, index: number, activeStep: number, position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const isActive = activeStep === index

  useFrame((state) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 + index
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15

      // Smooth scale interpolation based on active step
      const targetScale = isActive ? 1.35 : 0.8
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1)
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1)
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1)
    }
  })

  // Matte ceramic physical materials with soft pastel colors matching the palette
  return (
    <group position={position}>
      {shapeType === 'torus' && (
        <mesh ref={meshRef}>
          <torusGeometry args={[0.42, 0.14, 16, 64]} />
          <meshPhysicalMaterial 
            color="#6BA8B6" /* Soft Pastel Teal */
            roughness={0.65} 
            metalness={0.02}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>
      )}
      {shapeType === 'sphere' && (
        <mesh ref={meshRef}>
          <sphereGeometry args={[0.38, 32, 32]} />
          <meshPhysicalMaterial 
            color="#7CAEE3" /* Soft Pastel Sky Blue */
            roughness={0.65} 
            metalness={0.02}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>
      )}
      {shapeType === 'octahedron' && (
        <mesh ref={meshRef}>
          <octahedronGeometry args={[0.44]} />
          <meshPhysicalMaterial 
            color="#B2A99A" /* Soft Sand Stone */
            roughness={0.65} 
            metalness={0.02}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>
      )}
      {shapeType === 'cone' && (
        <mesh ref={meshRef}>
          <coneGeometry args={[0.35, 0.65, 32]} />
          <meshPhysicalMaterial 
            color="#FFE7A5" /* Soft Pastel Yellow */
            roughness={0.65} 
            metalness={0.02}
            clearcoat={0.4}
            clearcoatRoughness={0.2}
          />
        </mesh>
      )}
    </group>
  )
}

function InteractiveScene({ activeStep }: { activeStep: number }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08
    }
  })

  // 2x2 grid layout inside the 3D viewport
  const positions = [
    new THREE.Vector3(-1.0, 0.7, 0),
    new THREE.Vector3(1.0, 0.7, 0),
    new THREE.Vector3(-1.0, -0.7, 0),
    new THREE.Vector3(1.0, -0.7, 0),
  ]

  return (
    <group ref={groupRef}>
      <InteractiveMesh shapeType="torus" index={0} activeStep={activeStep} position={positions[0]} />
      <InteractiveMesh shapeType="sphere" index={1} activeStep={activeStep} position={positions[1]} />
      <InteractiveMesh shapeType="octahedron" index={2} activeStep={activeStep} position={positions[2]} />
      <InteractiveMesh shapeType="cone" index={3} activeStep={activeStep} position={positions[3]} />
    </group>
  )
}

export default function ExplodingObjectsSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section
      style={{
        padding: '60px 24px',
        background: 'var(--color-bg-primary)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '95%', margin: '0 auto' }}>
        {/* Soft Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none cinematic-grid" style={{ opacity: 0.15 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          {/* Left Column: Heading & Stepper */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)', borderRadius: '6px', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)', letterSpacing: '0.05em' }}>
                ПАТТЕРНЫ ВЗАИМОДЕЙСТВИЯ
              </span>
            </div>
            <h2 className="serif-title" style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '28px' }}>
              Модели структурированного обучения
            </h2>

            {/* Stepper Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx
                return (
                  <div
                    key={step.title}
                    onMouseEnter={() => setActiveStep(idx)}
                    className="glass-card"
                    style={{
                      padding: '20px 24px',
                      borderRadius: '14px',
                      border: '1px solid',
                      borderColor: isActive ? 'var(--color-accent-primary)' : 'var(--color-border)',
                      boxShadow: isActive ? 'var(--shadow-glow-primary)' : 'var(--shadow-card)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      background: isActive ? 'var(--color-bg-tertiary)' : 'var(--glass-bg)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-tertiary)'
                      }}>
                        0{idx + 1}
                      </span>
                      <h4 className="serif-title" style={{
                        fontSize: '17px',
                        fontWeight: 'bold',
                        color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-primary)'
                      }}>
                        {step.title}
                      </h4>
                    </div>
                    <p style={{
                      fontSize: '13px',
                      color: 'var(--color-text-secondary)',
                      lineHeight: '1.65',
                      marginLeft: '24px'
                    }}>
                      {step.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: 3D Interactive Canvas */}
          <div style={{
            height: '460px',
            background: 'var(--color-bg-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Canvas camera={{ position: [0, 0, 5], fov: 42 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#FFE7A5" />
                <pointLight position={[-10, -10, -10]} intensity={1.0} color="#6BA8B6" />
                <directionalLight position={[0, 5, 2]} intensity={1.2} color="#7CAEE3" />
                
                <Float speed={1.0} rotationIntensity={0.25} floatIntensity={0.25}>
                  <InteractiveScene activeStep={activeStep} />
                </Float>
              </Canvas>
            </div>

            {/* Simulated HUD panel at the bottom of the canvas */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              padding: '10px 16px',
              background: 'var(--glass-bg)',
              border: '1px solid var(--color-border)',
              borderRadius: '10px',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 20
            }}>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                interactive.simulation.active_node: 0{activeStep + 1}
              </span>
              <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-primary)', fontWeight: '700' }}>
                {STEPS[activeStep].code}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
