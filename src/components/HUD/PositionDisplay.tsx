import React from 'react'
import { useGameState } from '../../App'

const PositionDisplay: React.FC = () => {
  const state = useGameState()
  
  // Simplified position calculation
  const allCars = [state.player, ...state.aiDrivers.map(ai => ai.car)]
  const sorted = [...allCars].sort((a, b) => {
    if (a.lap !== b.lap) return b.lap - a.lap
    return b.checkpointsPassed.length - a.checkpointsPassed.length
  })
  const position = sorted.findIndex(c => c.id === 'player') + 1

  const colors = ['text-neon-yellow', 'text-slate-300', 'text-amber-600', 'text-white']
  const color = colors[position - 1] || 'text-white'

  return (
    <div className="flex flex-col items-center">
      <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Position</span>
      <div className={`text-6xl font-racing font-black italic ${color} animate-glow`}>
        P{position}
      </div>
    </div>
  )
}

export default PositionDisplay
