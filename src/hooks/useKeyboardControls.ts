import { useState, useEffect } from 'react'
import { CarInput } from '../engines/PhysicsEngine'

export const useKeyboardControls = (): CarInput => {
  const [input, setInput] = useState<CarInput>({
    accelerate: false,
    brake: false,
    steerLeft: false,
    steerRight: false,
    nitro: false,
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setInput(prev => ({ ...prev, accelerate: true }))
          break
        case 's':
        case 'arrowdown':
          setInput(prev => ({ ...prev, brake: true }))
          break
        case 'a':
        case 'arrowleft':
          setInput(prev => ({ ...prev, steerLeft: true }))
          break
        case 'd':
        case 'arrowright':
          setInput(prev => ({ ...prev, steerRight: true }))
          break
        case ' ':
          setInput(prev => ({ ...prev, nitro: true }))
          break
      }
      
      // Prevent scrolling with arrow keys/space
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          setInput(prev => ({ ...prev, accelerate: false }))
          break
        case 's':
        case 'arrowdown':
          setInput(prev => ({ ...prev, brake: false }))
          break
        case 'a':
        case 'arrowleft':
          setInput(prev => ({ ...prev, steerLeft: false }))
          break
        case 'd':
        case 'arrowright':
          setInput(prev => ({ ...prev, steerRight: false }))
          break
        case ' ':
          setInput(prev => ({ ...prev, nitro: false }))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return input
}
