import { useEffect, useState, useRef } from 'react'

export function useAudioReactive(audioUrl?: string) {
  const [audioData, setAudioData] = useState({ bass: 0, mid: 0, treble: 0, volume: 0 })
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const animationFrameId = useRef<number>(0)

  const setupAudio = (audioElement: HTMLAudioElement) => {
    if (audioContextRef.current) return // Already configured

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    const context = new AudioContextClass()
    const analyser = context.createAnalyser()
    analyser.fftSize = 256
    
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const source = context.createMediaElementSource(audioElement)
    source.connect(analyser)
    analyser.connect(context.destination)
    
    audioContextRef.current = context
    analyserRef.current = analyser
    dataArrayRef.current = dataArray
    sourceRef.current = source

    // Update loop
    const update = () => {
      if (!analyserRef.current || !dataArrayRef.current) return
      
      analyserRef.current.getByteFrequencyData(dataArrayRef.current as any)
      
      const data = dataArrayRef.current
      
      // Calculate frequency bands
      // Bass: indices 0 to 10
      let bassSum = 0
      for (let i = 0; i < 10; i++) bassSum += data[i]
      const bass = bassSum / 10 / 255
      
      // Mids: indices 10 to 50
      let midSum = 0
      for (let i = 10; i < 50; i++) midSum += data[i]
      const mid = midSum / 40 / 255
      
      // Treble: indices 50 to 100
      let trebleSum = 0
      for (let i = 50; i < 100; i++) trebleSum += data[i]
      const treble = trebleSum / 50 / 255
      
      // Combined volume
      let total = 0
      for (let i = 0; i < data.length; i++) total += data[i]
      const volume = total / data.length / 255

      setAudioData({ bass, mid, treble, volume })
      animationFrameId.current = requestAnimationFrame(update)
    }
    
    update()
  }

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return { audioData, setupAudio }
}
