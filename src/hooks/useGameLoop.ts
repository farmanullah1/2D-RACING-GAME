import { useEffect, useRef, useState } from 'react'

export const useGameLoop = (
  updateFn: (delta: number) => void,
  renderFn: () => void,
  active: boolean
): { fps: number } => {
  const [fps, setFps] = useState(0)
  const lastTimeRef = useRef<number>(0)
  const frameCountRef = useRef<number>(0)
  const lastFpsUpdateRef = useRef<number>(0)
  const requestRef = useRef<number>()

  const loop = (time: number) => {
    if (lastTimeRef.current !== 0) {
      const delta = Math.min((time - lastTimeRef.current) / 1000, 0.033) // cap at 30fps
      
      if (active) {
        updateFn(delta)
        renderFn()
      }

      // FPS calculation
      frameCountRef.current++
      if (time - lastFpsUpdateRef.current > 1000) {
        setFps(frameCountRef.current)
        frameCountRef.current = 0
        lastFpsUpdateRef.current = time
      }
    }
    
    lastTimeRef.current = time
    requestRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    if (active) {
      requestRef.current = requestAnimationFrame(loop)
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      lastTimeRef.current = 0
    }
    
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [active, updateFn, renderFn])

  return { fps }
}
