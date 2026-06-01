import { useEffect, useRef } from 'react'
import { GameSettings } from '../types/game.types'

export const useAudio = (settings: GameSettings) => {
  const audioCtxRef = useRef<AudioContext | null>(null)
  const engineOscRef = useRef<OscillatorNode | null>(null)
  const engineGainRef = useRef<GainNode | null>(null)
  const screechOscRef = useRef<OscillatorNode | null>(null)
  const screechGainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    const initAudio = () => {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // 1. Engine Sound
        const engineOsc = audioCtxRef.current.createOscillator()
        const engineGain = audioCtxRef.current.createGain()
        engineOsc.type = 'sawtooth'
        engineOsc.frequency.setValueAtTime(80, audioCtxRef.current.currentTime)
        engineGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
        
        engineOsc.connect(engineGain)
        engineGain.connect(audioCtxRef.current.destination)
        engineOsc.start()
        
        engineOscRef.current = engineOsc
        engineGainRef.current = engineGain

        // 2. Tire Screech Sound
        const screechOsc = audioCtxRef.current.createOscillator()
        const screechGain = audioCtxRef.current.createGain()
        screechOsc.type = 'triangle'
        screechOsc.frequency.setValueAtTime(850, audioCtxRef.current.currentTime)
        screechGain.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
        
        const filter = audioCtxRef.current.createBiquadFilter()
        filter.type = 'highpass'
        filter.frequency.setValueAtTime(1000, audioCtxRef.current.currentTime)
        
        screechOsc.connect(filter)
        filter.connect(screechGain)
        screechGain.connect(audioCtxRef.current.destination)
        screechOsc.start()

        screechOscRef.current = screechOsc
        screechGainRef.current = screechGain
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
      const ratio = Math.min(1.0, Math.abs(speed) / maxSpeed)
      const freq = 60 + ratio * 160
      const volume = (0.02 + ratio * 0.08) * settings.sfxVolume
      
      engineOscRef.current.frequency.setTargetAtTime(freq, audioCtxRef.current.currentTime, 0.1)
      engineGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.1)
    }
  }

  const updateTireScreech = (driftAngle: number, speed: number) => {
    if (screechGainRef.current && audioCtxRef.current) {
      // Screech only occurs at decent speeds during drift
      const ratio = Math.min(1.0, Math.abs(speed) / 200)
      const volume = (driftAngle > 0.4 && speed > 80)
        ? Math.min(0.12, (driftAngle - 0.4) * 0.25) * ratio * settings.sfxVolume
        : 0
      screechGainRef.current.gain.setTargetAtTime(volume, audioCtxRef.current.currentTime, 0.05)
    }
  }

  const playCollision = (intensity: number) => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()
    
    // Low thud
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(120, ctx.currentTime)
    osc1.frequency.linearRampToValueAtTime(20, ctx.currentTime + 0.25)
    
    // Metallic crash crackle
    osc2.type = 'sawtooth'
    osc2.frequency.setValueAtTime(320, ctx.currentTime)
    osc2.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.18)
    
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, ctx.currentTime)
    
    gain.gain.setValueAtTime(intensity * 0.22 * settings.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28)
    
    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    osc1.start()
    osc2.start()
    osc1.stop(ctx.currentTime + 0.3)
    osc2.stop(ctx.currentTime + 0.3)
  }

  const playMenuTick = () => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1600, ctx.currentTime)
    gain.gain.setValueAtTime(0.04 * settings.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.05)
  }

  const playTransitionSweep = () => {
    if (!audioCtxRef.current) return
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(750, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.32)
    gain.gain.setValueAtTime(0.12 * settings.sfxVolume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32)
    
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.32)
  }

  const playNitroWhoosh = () => {
    if (!audioCtxRef.current) return
    const osc = audioCtxRef.current.createOscillator()
    const gain = audioCtxRef.current.createGain()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(150, audioCtxRef.current.currentTime)
    osc.frequency.exponentialRampToValueAtTime(750, audioCtxRef.current.currentTime + 0.5)
    
    gain.gain.setValueAtTime(0.15 * settings.sfxVolume, audioCtxRef.current.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.5)
    
    const filter = audioCtxRef.current.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(500, audioCtxRef.current.currentTime)
    
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(audioCtxRef.current.destination)
    
    osc.start()
    osc.stop(audioCtxRef.current.currentTime + 0.5)
  }

  const playCountdown = (num: number) => {
    if (!audioCtxRef.current) return
    const osc = audioCtxRef.current.createOscillator()
    const gain = audioCtxRef.current.createGain()
    osc.type = 'sine'
    
    const freq = num === 0 ? 1200 : 750
    const duration = num === 0 ? 0.35 : 0.12
    
    osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime)
    gain.gain.setValueAtTime(0.15 * settings.sfxVolume, audioCtxRef.current.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + duration)
    
    osc.connect(gain)
    gain.connect(audioCtxRef.current.destination)
    
    osc.start()
    osc.stop(audioCtxRef.current.currentTime + duration)
  }

  const playLapComplete = (isBestLap: boolean) => {
    if (!audioCtxRef.current) return
    const playNote = (freq: number, delay: number, dur: number) => {
      const osc = audioCtxRef.current!.createOscillator()
      const gain = audioCtxRef.current!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, audioCtxRef.current!.currentTime + delay)
      gain.gain.setValueAtTime(0.1 * settings.sfxVolume, audioCtxRef.current!.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current!.currentTime + delay + dur)
      
      osc.connect(gain)
      gain.connect(audioCtxRef.current!.destination)
      osc.start(audioCtxRef.current!.currentTime + delay)
      osc.stop(audioCtxRef.current!.currentTime + delay + dur)
    }
    
    playNote(523.25, 0, 0.15) // C5
    playNote(isBestLap ? 783.99 : 659.25, 0.12, 0.25) // G5 or E5
  }

  const playRaceFinish = () => {
    if (!audioCtxRef.current) return
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.50] // C5, E5, G5, B5, C6
    notes.forEach((freq, i) => {
      const osc = audioCtxRef.current!.createOscillator()
      const gain = audioCtxRef.current!.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, audioCtxRef.current!.currentTime + i * 0.1)
      gain.gain.setValueAtTime(0.1 * settings.sfxVolume, audioCtxRef.current!.currentTime + i * 0.1)
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current!.currentTime + i * 0.1 + 0.25)
      
      osc.connect(gain)
      gain.connect(audioCtxRef.current!.destination)
      osc.start(audioCtxRef.current!.currentTime + i * 0.1)
      osc.stop(audioCtxRef.current!.currentTime + i * 0.1 + 0.25)
    })
  }

  const stopAll = () => {
    if (engineGainRef.current) engineGainRef.current.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0)
    if (screechGainRef.current) screechGainRef.current.gain.setValueAtTime(0, audioCtxRef.current?.currentTime || 0)
  }

  return { 
    updateEngineSound, 
    updateTireScreech, 
    playCollision, 
    playNitroWhoosh, 
    playCountdown, 
    playLapComplete, 
    playRaceFinish, 
    playMenuTick,
    playTransitionSweep,
    stopAll 
  }
}
