import React from 'react'
import { useGameState, useGameDispatch } from '../../App'

const formatTime = (ms: number) => {
  const min = Math.floor(ms / 60)
  const sec = Math.floor(ms % 60)
  const mmm = Math.floor((ms % 1) * 1000)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${mmm.toString().padStart(3, '0')}`
}

const RaceFinishedScreen: React.FC = () => {
  const state = useGameState()
  const dispatch = useGameDispatch()
  
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-6">
      <div className="bg-track-panel border border-white/10 p-10 rounded-[2.5rem] shadow-panel max-w-2xl w-full text-center animate-slide-up">
        <h2 className="text-6xl font-racing font-black text-neon-green mb-2 italic animate-glow">RACE FINISHED!</h2>
        <p className="text-white/40 font-mono tracking-widest uppercase mb-10">Grand Prix Results</p>
        
        <div className="bg-white/5 rounded-2xl p-8 mb-10">
          <div className="text-7xl font-racing font-black text-white mb-2">1st</div>
          <div className="text-xl font-mono text-neon-blue uppercase mb-6">{state.settings.playerName}</div>
          
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div>
              <div className="text-[10px] font-mono text-white/30 uppercase mb-1">Total Time</div>
              <div className="text-2xl font-racing text-white">{formatTime(state.raceTime)}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/30 uppercase mb-1">Best Lap</div>
              <div className="text-2xl font-racing text-white">
                {state.player.bestLapTime ? formatTime(state.player.bestLapTime) : '--:--.---'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => dispatch({ type: 'START_RACE', mode: state.mode })}
            className="flex-1 py-4 rounded-xl bg-neon-blue text-black font-racing font-bold text-xl hover:bg-neon-green transition-all"
          >
            RACE AGAIN
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'GO_TO_MENU' })}
            className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-racing font-bold text-xl hover:bg-white/10 transition-all"
          >
            MAIN MENU
          </button>
        </div>
      </div>
    </div>
  )
}

export default RaceFinishedScreen
