import React from 'react'
import { useGameState } from '../../App'

const NitroMeter: React.FC = () => {
  const state = useGameState()
  const nitro = state.player.nitro
  
  return (
    <div className="flex flex-col items-center w-[240px]">
      <div className="flex justify-between w-full mb-1 px-1">
        <span className="text-[10px] font-mono text-neon-orange font-bold uppercase tracking-widest">Nitro</span>
        <span className="text-[10px] font-mono text-white/40">{Math.round(nitro * 100)}%</span>
      </div>
      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
        <div 
          className="h-full rounded-full transition-all duration-300 relative"
          style={{ 
            width: `${nitro * 100}%`,
            background: 'linear-gradient(90deg, #ff6b00 0%, #00f5ff 100%)',
            boxShadow: nitro > 0.9 ? '0 0 10px #00f5ff' : 'none'
          }}
        >
          {state.player.nitroActive && (
            <div className="absolute inset-0 bg-white/30 animate-pulse-fast" />
          )}
        </div>
      </div>
    </div>
  )
}

export default NitroMeter
