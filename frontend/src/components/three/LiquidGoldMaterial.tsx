import { extend, useFrame } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

// Define the custom GLSL shader material
const CustomShaderMaterial = shaderMaterial(
  {
    uTime: 0.0,
    uResolution: new THREE.Vector2(),
  },
  // Vertex Shader
  `varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  
  // Rhythmic wave deformation mimicking soft fluid movement
  vec3 pos = position;
  pos.z += sin(pos.x * 1.5 + uTime * 1.0) * 0.12;
  pos.y += cos(pos.z * 1.5 + uTime * 0.8) * 0.08;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,
  // Fragment Shader
  `uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Sophisticated organic clay, sage and marble neutral hues
  vec3 clayBase = vec3(0.92, 0.89, 0.84);  // Warm beige/cream
  vec3 sageBase = vec3(0.68, 0.73, 0.70);  // Soft sage green
  vec3 whiteHighlight = vec3(0.98, 0.97, 0.95); // Pristine linen white
  
  float wave = sin(vUv.x * 5.0 + uTime * 0.5) * cos(vUv.y * 5.0 + uTime * 0.4);
  vec3 finalColor = mix(clayBase, sageBase, wave * 0.5 + 0.5);
  
  // High-end Fresnel highlights based on normals to simulate soft porcelain satin sheen
  float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 4.0);
  finalColor = mix(finalColor, whiteHighlight, fresnel * 0.45);
  
  gl_FragColor = vec4(finalColor, 1.0);
}`
)

extend({ CustomShaderMaterial })

export default function LiquidGoldMaterial(props: any) {
  const materialRef = useRef<any>(null)
  const shaderMatRef = useRef(new CustomShaderMaterial())

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh {...props}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <primitive 
        object={shaderMatRef.current} 
        ref={materialRef} 
        attach="material"
        transparent 
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
