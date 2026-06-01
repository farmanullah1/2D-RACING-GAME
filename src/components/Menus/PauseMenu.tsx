import React from 'react'
import { useGameState, useGameDispatch } from '../../App'

const PauseMenu: React.FC = () => {
  const dispatch = useGameDispatch()
  
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xl">
      <div className="bg-track-panel border border-white/10 p-12 rounded-3xl shadow-panel text-center min-w-[320px]">
        <h2 className="text-5xl font-racing font-black text-white mb-12 italic animate-glow">PAUSED</h2>
        
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => dispatch({ type: 'PAUSE_TOGGLE' })}
            className="w-full py-4 rounded-xl bg-neon-blue text-black font-racing font-bold text-xl hover:bg-neon-green transition-all transform hover:scale-105"
          >
            RESUME
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'RESET_RACE' })}
            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-racing font-bold text-xl hover:bg-white/10 transition-all"
          >
            RESTART RACE
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'GO_TO_MENU' })}
            className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-racing font-bold text-xl hover:bg-white/10 transition-all"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  )
}

export default PauseMenu
