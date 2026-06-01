import React from 'react'
import { useGameState, useGameDispatch } from '../../App'
import { GameMode, CarColor, AIDifficulty } from '../../types/game.types'
import { TRACKS } from '../../data/tracks'
import { COLORS } from '../../constants/graphicsConstants'

const StartMenu: React.FC = () => {
  const state = useGameState()
  const dispatch = useGameDispatch()
  
  const allColors: CarColor[] = ['red', 'blue', 'silver', 'gold', 'purple', 'green', 'pink', 'cyan', 'yellow', 'white', 'black', 'orange']

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a14] relative overflow-hidden p-6">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-orange/10 blur-[120px] rounded-full" />

      <h1 className="text-8xl md:text-9xl font-racing font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-orange mb-2 animate-glow">
        VELOCITYX
      </h1>
      <p className="text-xl font-mono text-white/40 tracking-[0.5em] mb-12 uppercase">2D Racing Game</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-8">
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

      <div className="flex flex-wrap items-center justify-center gap-8 bg-track-panel backdrop-blur-xl p-6 rounded-2xl border border-white/10 max-w-5xl w-full">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Select Track</span>
          <div className="flex gap-2">
            {TRACKS.map((t, i) => (
              <button 
                key={t.id}
                onClick={() => dispatch({ type: 'SET_TRACK', trackIndex: i })}
                className={`px-4 py-2 rounded-md text-xs font-racing font-bold border transition-all ${state.selectedTrack === i ? 'border-neon-blue bg-neon-blue/20 text-white shadow-neon' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
              >
                {t.name.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Select Color</span>
          <div className="grid grid-cols-6 gap-2">
            {allColors.map(color => {
              const bg = COLORS[`car${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof COLORS] as any
              return (
                <button 
                  key={color}
                  onClick={() => dispatch({ type: 'SET_COLOR', color })}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${state.selectedColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'}`}
                  style={{ backgroundColor: bg.body }}
                />
              )
            })}
          </div>
        </div>

        <div className="h-10 w-[1px] bg-white/10 hidden md:block" />

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Difficulty</span>
          <div className="flex gap-2">
            {(['EASY', 'MEDIUM', 'HARD']).map((d, i) => (
              <button 
                key={d}
                onClick={() => dispatch({ type: 'SET_DIFFICULTY', difficulty: i as AIDifficulty })}
                className={`px-4 py-2 rounded-md text-xs font-racing font-bold border transition-all ${state.difficulty === i ? 'border-neon-orange bg-neon-orange/20 text-white shadow-neon-orange' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
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
