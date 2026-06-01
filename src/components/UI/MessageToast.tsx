import React from 'react'
import { useGameState } from '../../App'

const MessageToast: React.FC = () => {
  const state = useGameState()
  
  if (!state.toastMessage) return null

  return (
    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-[70] pointer-events-none animate-slide-up">
      <div className="bg-neon-blue/20 backdrop-blur-xl border border-neon-blue/40 px-8 py-3 rounded-full shadow-neon">
        <span className="text-2xl font-racing font-black text-white italic tracking-wider uppercase drop-shadow-md">
          {state.toastMessage}
        </span>
      </div>
    </div>
  )
}

export default MessageToast
