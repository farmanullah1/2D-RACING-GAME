import React from 'react'
import { useGameState, useGameDispatch } from '../../App'
import { GameMode } from '../../types/game.types'

const formatTime = (ms: number) => {
  const min = Math.floor(ms / 60)
  const sec = Math.floor(ms % 60)
  const mmm = Math.floor((ms % 1) * 1000)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${mmm.toString().padStart(3, '0')}`
}

const RaceFinishedScreen: React.FC = () => {
  const state = useGameState()
  const dispatch = useGameDispatch()

  const allCars = [state.player, ...state.aiDrivers.map(ai => ai.car)]
  const sorted = [...allCars].sort((a, b) => {
    if (a.lap !== b.lap) return b.lap - a.lap
    return b.checkpointsPassed.length - a.checkpointsPassed.length
  })
  const position = sorted.findIndex(c => c.id === 'player') + 1

  const formatPosition = (pos: number) => {
    if (state.mode === GameMode.TimeTrial) return 'TIME TRIAL'
    if (state.mode === GameMode.FreeRoam) return 'FREE ROAM'
    if (pos === 1) return '1ST PLACE'
    if (pos === 2) return '2ND PLACE'
    if (pos === 3) return '3RD PLACE'
    return `${pos}TH PLACE`
  }

  const titleText = state.mode === GameMode.TimeTrial ? 'TIME TRIAL COMPLETE!' : (state.mode === GameMode.FreeRoam ? 'SESSION COMPLETED' : 'RACE FINISHED!')
  const subText = state.mode === GameMode.TimeTrial ? 'Time Trial Stats' : (state.mode === GameMode.FreeRoam ? 'Free Roam Stats' : 'Grand Prix Results')

  const textColors = ['text-neon-yellow', 'text-slate-300', 'text-amber-600', 'text-white']
  const rankColor = state.mode === GameMode.AIRace ? (textColors[position - 1] || 'text-white') : 'text-neon-blue'

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-2xl p-6 select-none">
      <div className="bg-track-panel border border-white/10 p-10 rounded-[2.5rem] shadow-panel max-w-2xl w-full text-center animate-slide-up">
        <h2 className="text-6xl font-racing font-black text-neon-green mb-2 italic animate-glow">{titleText}</h2>
        <p className="text-white/40 font-mono tracking-widest uppercase mb-10">{subText}</p>
        
        <div className="bg-white/5 rounded-2xl p-8 mb-10">
          <div className={`text-6xl font-racing font-black mb-2 animate-glow ${rankColor}`}>
            {formatPosition(position)}
          </div>
          <div className="text-xl font-mono text-white/55 uppercase mb-6">{state.settings.playerName}</div>
          
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/10">
            <div>
              <div className="text-[10px] font-mono text-white/30 uppercase mb-1">Total Time</div>
              <div className="text-2xl font-racing text-white tabular-nums">{formatTime(state.raceTime)}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/30 uppercase mb-1">Best Lap</div>
              <div className="text-2xl font-racing text-neon-green tabular-nums">
                {state.player.bestLapTime ? formatTime(state.player.bestLapTime) : '--:--.---'}
              </div>
            </div>
          </div>

          {/* Grand Prix Final Standings */}
          {state.mode === GameMode.AIRace && state.aiDrivers.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10 text-left">
              <span className="text-[10px] font-mono text-white/40 uppercase block mb-3 tracking-widest">Final Standings</span>
              <div className="space-y-2">
                {sorted.map((car, idx) => {
                  let badgeColor = 'text-white'
                  if (idx === 0) badgeColor = 'text-neon-yellow font-bold'
                  else if (idx === 1) badgeColor = 'text-slate-300 font-bold'
                  else if (idx === 2) badgeColor = 'text-amber-600 font-bold'

                  return (
                    <div key={car.id} className="flex justify-between items-center text-xs font-mono py-2 px-3 rounded hover:bg-white/5">
                      <span className={badgeColor}>
                        #{idx + 1} {car.isPlayer ? `${state.settings.playerName} (YOU)` : `AI OPPONENT (${car.color.toUpperCase()})`}
                      </span>
                      <span className="text-white font-racing font-bold tabular-nums">
                        {car.bestLapTime ? formatTime(car.bestLapTime) : '--:--.---'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => dispatch({ type: 'RESET_RACE' })}
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
