import React from 'react'
import { useGameDispatch } from '../../App'
import { GameMode, CarColor, AIDifficulty } from '../../types/game.types'

const StartMenu: React.FC = () => {
  const dispatch = useGameDispatch()
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a14] relative overflow-hidden p-6">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-orange/10 blur-[120px] rounded-full" />

      <h1 className="text-8xl md:text-9xl font-racing font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-orange mb-2 animate-glow">
        VELOCITYX
      </h1>
      <p className="text-xl font-mono text-white/40 tracking-[0.5em] mb-12 uppercase">2D Racing Game</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-12">
        <button 
          onClick={() => dispatch({ type: 'START_RACE', mode: GameMode.AIRace })}
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-neon-blue/50 transition-all"
        >
          <div className="text-4xl mb-4">🏁</div>
          <div className="text-2xl font-racing font-bold text-white group-hover:text-neon-blue">GRAND PRIX</div>
          <p className="text-sm text-white/40 mt-2">Race against 3 AI opponents over 3 laps.</p>
        </button>

        <button 
          onClick={() => dispatch({ type: 'START_RACE', mode: GameMode.TimeTrial })}
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-neon-green/50 transition-all"
        >
          <div className="text-4xl mb-4">⏱️</div>
          <div className="text-2xl font-racing font-bold text-white group-hover:text-neon-green">TIME TRIAL</div>
          <p className="text-sm text-white/40 mt-2">Solo race against the clock for the best lap.</p>
        </button>

        <button 
          onClick={() => dispatch({ type: 'START_RACE', mode: GameMode.FreeRoam })}
          className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-neon-orange/50 transition-all"
        >
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-2xl font-racing font-bold text-white group-hover:text-neon-orange">FREE ROAM</div>
          <p className="text-sm text-white/40 mt-2">No laps, no opponents. Just drive and drift.</p>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-8 bg-track-panel backdrop-blur-xl p-6 rounded-2xl border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Select Color</span>
          <div className="flex gap-3">
            {(['red', 'blue', 'silver', 'gold', 'purple', 'green'] as CarColor[]).map(color => (
              <button 
                key={color}
                onClick={() => dispatch({ type: 'SET_COLOR', color })}
                className="w-8 h-8 rounded-full border-2 border-transparent hover:scale-110 transition-transform"
                style={{ backgroundColor: color === 'silver' ? '#adb5bd' : color === 'gold' ? '#e9c46a' : color }}
              />
            ))}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10" />

        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Difficulty</span>
          <div className="flex gap-2">
            {(['EASY', 'MEDIUM', 'HARD']).map((d, i) => (
              <button 
                key={d}
                onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: i as AIDifficulty })}
                className="px-4 py-1 rounded-md text-xs font-racing font-bold border border-white/10 hover:bg-white/5"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartMenu
