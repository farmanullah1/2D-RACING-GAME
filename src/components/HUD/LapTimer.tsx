import React from 'react'
import { useGameState } from '../../App'

const formatTime = (ms: number) => {
  const min = Math.floor(ms / 60)
  const sec = Math.floor(ms % 60)
  const mmm = Math.floor((ms % 1) * 1000)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${mmm.toString().padStart(3, '0')}`
}

const LapTimer: React.FC = () => {
  const state = useGameState()
  
  return (
    <div className="bg-track-panel backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-panel min-w-[180px]">
      <div className="flex justify-between items-baseline mb-1">
        <span className="text-xs font-mono text-white/40 uppercase">Lap</span>
        <span className="text-2xl font-racing font-bold text-neon-blue">
          {state.player.lap} / {state.totalLaps}
        </span>
      </div>
      <div className="text-4xl font-racing font-black text-white tabular-nums">
        {formatTime(state.raceTime)}
      </div>
      {state.player.bestLapTime && (
        <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
          <span className="text-[10px] font-mono text-white/30 uppercase">Best</span>
          <span className="text-sm font-racing text-neon-green">
            {formatTime(state.player.bestLapTime)}
          </span>
        </div>
      )}
    </div>
  )
}

export default LapTimer
