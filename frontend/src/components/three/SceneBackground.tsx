import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Clean custom shader or dynamic math-deformed wireframe grid representing structural waves
function DigitalTerrain() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { mouse } = useThree()
  
  const size = 35
  const segments = 35
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.015
      
      const geo = meshRef.current.geometry as THREE.PlaneGeometry
      const posAttr = geo.attributes.position
      const v = new THREE.Vector3()
      
      for (let i = 0; i < posAttr.count; i++) {
        v.fromBufferAttribute(posAttr, i)
        
        const dist = Math.sqrt(v.x * v.x + v.y * v.y)
        const wave1 = Math.sin(dist * 0.25 - t * 0.5) * 0.5
        const wave2 = Math.cos(v.x * 0.12 + t * 0.4) * Math.sin(v.y * 0.12 + t * 0.3) * 0.8
        const mouseFactor = (1 - Math.min(dist / 15, 1)) * (mouse.x * v.x + mouse.y * v.y) * 0.4
        
        posAttr.setZ(i, wave1 + wave2 + mouseFactor)
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 3.2, 0, 0]} position={[0, -2.5, -3]}>
      <planeGeometry args={[size, size, segments, segments]} />
      <meshBasicMaterial
        color="#6C7E72" /* Sage green grid line */
        wireframe
        transparent
        opacity={0.06}
      />
    </mesh>
  )
}

// Elegant tactile particle dust wave showing organic orbital paths
function QuantumDataCloud({ count = 2500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const { mouse } = useThree()

  // Generate particle positions on a curved dimensional field
  const [positions, initialY] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const initY = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const radius = 4 + Math.random() * 10
      const x = Math.cos(theta) * radius
      const y = (Math.random() - 0.5) * 12
      const z = (Math.random() - 0.5) * 6 - radius * 0.2
      
      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      initY[i] = y
    }
    return [pos, initY]
  }, [count])

  // Custom multi-tone color gradient for particles
  const colors = useMemo(() => {
    const col = new Float32Array(count * 3)
    const colorSage = new THREE.Color('#6C7E72')
    const colorClay = new THREE.Color('#C38B7B')
    const colorSand = new THREE.Color('#A69E8F')
    const colorCharcoal = new THREE.Color('#8E9296')

    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      let c = colorSand
      if (rand < 0.25) c = colorSage
      else if (rand < 0.5) c = colorClay
      else if (rand < 0.75) c = colorCharcoal
      
      col[i * 3] = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return col
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.008 + mouse.x * 0.04
      pointsRef.current.rotation.x = mouse.y * 0.02
      
      const posAttr = pointsRef.current.geometry.attributes.position
      const positionsArray = posAttr.array as Float32Array
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = positionsArray[i3]
        const z = positionsArray[i3 + 2]
        
        const noise = Math.sin(t * 0.3 + x * 0.15) * Math.cos(t * 0.2 + z * 0.15) * 0.006
        positionsArray[i3 + 1] = initialY[i] + noise * 30
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
      />
    </Points>
  )
}

// Specialty nodes orbiting in 3D using organic clay tones
function SpecialtyOrbitalNodes() {
  const groupRef = useRef<THREE.Group>(null!)
  
  const nodes = useMemo(() => [
    { pos: new THREE.Vector3(-4.5, 2.0, -2.5), color: '#6C7E72', scale: 0.18 }, // Sage
    { pos: new THREE.Vector3(5.5, -1.2, -3.5), color: '#C38B7B', scale: 0.22 }, // Terracotta
    { pos: new THREE.Vector3(2.0, 3.0, -4.0), color: '#D29D56', scale: 0.16 },  // Gold
    { pos: new THREE.Vector3(-4.0, -2.8, -1.8), color: '#A69E8F', scale: 0.2 },  // Sand
  ], [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.03
      
      groupRef.current.children.forEach((child, index) => {
        const speed = 0.4 + index * 0.15
        child.position.y = nodes[index].pos.y + Math.sin(t * speed) * 0.2
        child.position.x = nodes[index].pos.x + Math.cos(t * speed * 0.7) * 0.15
      })
    }
  })

  return (
    <group ref={groupRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.pos}>
          {/* Main sphere core */}
          <mesh>
            <sphereGeometry args={[node.scale, 16, 16]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.45} />
          </mesh>
          
          {/* Surrounding clean ring */}
          <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
            <torusGeometry args={[node.scale * 2.0, 0.005, 4, 32]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.2} />
          </mesh>

          {/* Connected thin data vector to center */}
          <line>
            <bufferGeometry>
              <float32BufferAttribute
                attach="attributes-position"
                args={[new Float32Array([0, 0, 0, -node.pos.x, -node.pos.y, -node.pos.z]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={node.color} transparent opacity={0.03} />
          </line>
        </group>
      ))}
    </group>
  )
}

interface SceneBackgroundProps {
  className?: string
  style?: React.CSSProperties
}

export default function SceneBackground({ className, style }: SceneBackgroundProps) {
  return (
    <div
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        ...style,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fdx: 60 } as any}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        {/* Soft cream fog that fades elements into background primary */}
        <fog attach="fog" args={['#FAF6F0', 6, 18]} />
        
        <ambientLight intensity={1.5} />
        
        {/* Immersive background wave terrain */}
        <DigitalTerrain />
        
        {/* Orbital particles cloud */}
        <QuantumDataCloud count={2000} />
        
        {/* Floating specialty nodes */}
        <SpecialtyOrbitalNodes />
      </Canvas>
    </div>
  )
}