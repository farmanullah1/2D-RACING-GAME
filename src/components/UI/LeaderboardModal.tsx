import React, { useState, useEffect } from 'react'
import { useGameDispatch } from '../../App'
import { GameMode, RaceResult, GameStatus } from '../../types/game.types'
import { loadLeaderboard, clearAllData } from '../../utils/localStorageUtils'

const formatTime = (ms: number) => {
  const min = Math.floor(ms / 60)
  const sec = Math.floor(ms % 60)
  const mmm = Math.floor((ms % 1) * 1000)
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${mmm.toString().padStart(3, '0')}`
}

const LeaderboardModal: React.FC = () => {
  const dispatch = useGameDispatch()
  const [activeTab, setActiveTab] = useState<GameMode>(GameMode.AIRace)
  const [results, setResults] = useState<RaceResult[]>([])
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    setResults(loadLeaderboard())
  }, [])

  const filteredResults = results
    .filter(r => r.mode === activeTab)
    .sort((a, b) => a.totalTime - b.totalTime)
    .slice(0, 10)

  const handleClear = () => {
    if (confirmClear) {
      clearAllData()
      setResults([])
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6">
      <div className="bg-track-panel border border-white/10 p-10 rounded-[2.5rem] shadow-panel max-w-3xl w-full flex flex-col max-h-[85vh] animate-slide-up">
        <h2 className="text-5xl font-racing font-black text-white mb-6 italic text-center animate-glow">LEADERBOARD</h2>

        {/* Tabs */}
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl mb-6">
          <button
            onClick={() => { setActiveTab(GameMode.AIRace); setConfirmClear(false) }}
            className={`flex-1 py-3 rounded-lg text-sm font-racing font-bold transition-all ${activeTab === GameMode.AIRace ? 'bg-neon-blue text-black shadow-neon' : 'text-white/60 hover:text-white'}`}
          >
            GRAND PRIX
          </button>
          <button
            onClick={() => { setActiveTab(GameMode.TimeTrial); setConfirmClear(false) }}
            className={`flex-1 py-3 rounded-lg text-sm font-racing font-bold transition-all ${activeTab === GameMode.TimeTrial ? 'bg-neon-green text-black shadow-neon-green' : 'text-white/60 hover:text-white'}`}
          >
            TIME TRIAL
          </button>
          <button
            onClick={() => { setActiveTab(GameMode.FreeRoam); setConfirmClear(false) }}
            className={`flex-1 py-3 rounded-lg text-sm font-racing font-bold transition-all ${activeTab === GameMode.FreeRoam ? 'bg-neon-orange text-black shadow-neon-orange' : 'text-white/60 hover:text-white'}`}
          >
            FREE ROAM
          </button>
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
          {filteredResults.length === 0 ? (
            <div className="text-center py-16 text-white/30 font-mono text-sm uppercase">
              No lap times recorded yet. Go set a record!
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-mono text-white/40 uppercase tracking-widest text-left">
                  <th className="pb-3 pl-4">Rank</th>
                  <th className="pb-3">Driver</th>
                  <th className="pb-3">Total Time</th>
                  <th className="pb-3">Best Lap</th>
                  <th className="pb-3 pr-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-racing">
                {filteredResults.map((r, index) => {
                  let bgClass = 'hover:bg-white/5'
                  let rankColor = 'text-white'
                  if (index === 0) {
                    bgClass = 'bg-neon-yellow/10 hover:bg-neon-yellow/15 border-l-4 border-neon-yellow'
                    rankColor = 'text-neon-yellow font-black'
                  } else if (index === 1) {
                    bgClass = 'bg-slate-300/10 hover:bg-slate-300/15 border-l-4 border-slate-300'
                    rankColor = 'text-slate-300 font-black'
                  } else if (index === 2) {
                    bgClass = 'bg-amber-600/10 hover:bg-amber-600/15 border-l-4 border-amber-600'
                    rankColor = 'text-amber-600 font-bold'
                  }

                  return (
                    <tr key={index} className={`transition-all text-sm ${bgClass}`}>
                      <td className={`py-4 pl-4 font-mono ${rankColor}`}>#{index + 1}</td>
                      <td className="py-4 font-bold text-white uppercase">{r.playerName}</td>
                      <td className="py-4 text-white tabular-nums">{formatTime(r.totalTime)}</td>
                      <td className="py-4 text-neon-green tabular-nums">{formatTime(r.bestLap)}</td>
                      <td className="py-4 pr-4 text-right text-white/40 font-mono text-xs">{r.date}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => dispatch({ type: 'SET_STATUS', status: GameStatus.MainMenu })}
            className="flex-1 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-racing font-bold text-xl hover:bg-white/10 transition-all"
          >
            CLOSE
          </button>
          
          <button
            onClick={handleClear}
            className={`px-6 py-4 rounded-xl font-racing font-bold text-sm border transition-all ${confirmClear ? 'bg-red-600 border-red-500 text-white animate-pulse' : 'bg-transparent border-red-500/30 text-red-500 hover:bg-red-500/10'}`}
          >
            {confirmClear ? 'CONFIRM CLEAR?' : 'CLEAR DATA'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardModal
