import { useEffect, useRef } from 'react'
import { GameSettings } from '../types/game.types'

export const useAudio = (settings: GameSettings) => {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const engineOscRef = useRef<OscillatorNode | null>(null)
  const engineGainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // Engine sound
        const osc = audioCtxRef.current.createOscillator()
        const gain = audioCtxRef.current.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(100, audioCtxRef.current.currentTime)
        gain.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
        
        osc.connect(gain)
        gain.connect(audioCtxRef.current.destination)
        osc.start()
        
        engineOscRef.current = osc
        engineGainRef.current = gain
      }
    }

    window.addEventListener('mousedown', initAudio)
    window.addEventListener('keydown', initAudio)

    return () => {
      window.removeEventListener('mousedown', initAudio)
      window.removeEventListener('keydown', initAudio)
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
      }
    }
  }, [])

  const updateEngineSound = (speed: number, maxSpeed: number) => {
    if (engineOscRef.current && engineGainRef.current && audioCtxRef.current) {
      const freq = 80 + (Math.abs(speed) / maxSpeed) * 120
      const volume = (Math.abs(speed) / maxSpeed) * 0.1 * settings.sfxVolume
      
      engineOscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.1)
      engineGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1)
    }
  }

  const playCollision = (intensity: number) => {
    if (!audioCtxRef.current) return
    const osc = audioCtxRef.current.createOscillator()
    const gain = audioCtxRef.current.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(100, audioCtxRef.current.currentTime)
    osc.frequency.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1)
    gain.gain.setValueAtTime(intensity * 0.2 * settings.sfxVolume, audioCtxRef.current.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.1)
    
    osc.connect(gain)
    gain.connect(audioCtxRef.current.destination)
    osc.start()
    osc.stop(audioCtxRef.current.currentTime + 0.1)
  }

  return { updateEngineSound, playCollision }
}
