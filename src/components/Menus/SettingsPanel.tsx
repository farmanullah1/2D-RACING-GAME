import React, { useState } from 'react'
import { useGameState, useGameDispatch } from '../../App'
import { AIDifficulty, CarColor, GameStatus } from '../../types/game.types'
import { COLORS } from '../../constants/graphicsConstants'

const SettingsPanel: React.FC = () => {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const [activeTab, setActiveTab] = useState<'audio' | 'graphics' | 'gameplay' | 'controls'>('audio')

  const allColors: CarColor[] = ['red', 'blue', 'silver', 'gold', 'purple', 'green', 'pink', 'cyan', 'yellow', 'white', 'black', 'orange']

  const handleSliderChange = (key: 'sfxVolume' | 'musicVolume', val: number) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: val } })
  }

  const handleCheckboxChange = (key: 'showMinimap' | 'showFPS' | 'screenShake' | 'dayNightCycle', checked: boolean) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: checked } })
  }

  const handleStringChange = (key: 'playerName' | 'weatherEffect', val: string) => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { [key]: val } })
  }

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6 select-none">
      <div className="bg-track-panel border border-white/10 p-8 rounded-[2.5rem] shadow-panel max-w-2xl w-full flex flex-col max-h-[85vh] animate-slide-up">
        <h2 className="text-4xl font-racing font-black text-white mb-6 italic text-center animate-glow">SETTINGS</h2>
        
        {/* Navigation Tabs */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl mb-6">
          {(['audio', 'graphics', 'gameplay', 'controls'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-racing font-bold uppercase transition-all ${activeTab === tab ? 'bg-neon-blue text-black shadow-neon' : 'text-white/60 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Panel */}
        <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar min-h-[250px]">
          {activeTab === 'audio' && (
            <div className="space-y-6 pt-2">
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-white/70 text-sm uppercase">SFX Volume</span>
                  <span className="font-mono text-neon-blue text-sm font-bold">{Math.round(state.settings.sfxVolume * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={state.settings.sfxVolume}
                  onChange={(e) => handleSliderChange('sfxVolume', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-white/70 text-sm uppercase">Music Volume</span>
                  <span className="font-mono text-neon-blue text-sm font-bold">{Math.round(state.settings.musicVolume * 100)}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05"
                  value={state.settings.musicVolume}
                  onChange={(e) => handleSliderChange('musicVolume', parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-neon-blue"
                />
              </div>
            </div>
          )}

          {activeTab === 'graphics' && (
            <div className="space-y-5 pt-2">
              <div className="flex justify-between items-center bg-white/2 p-3 rounded-lg border border-white/5">
                <span className="font-mono text-white/70 text-sm uppercase">Show Minimap</span>
                <input 
                  type="checkbox" 
                  checked={state.settings.showMinimap}
                  onChange={(e) => handleCheckboxChange('showMinimap', e.target.checked)}
                  className="w-5 h-5 accent-neon-blue cursor-pointer"
                />
              </div>
              
              <div className="flex justify-between items-center bg-white/2 p-3 rounded-lg border border-white/5">
                <span className="font-mono text-white/70 text-sm uppercase">Show FPS Counter</span>
                <input 
                  type="checkbox" 
                  checked={state.settings.showFPS}
                  onChange={(e) => handleCheckboxChange('showFPS', e.target.checked)}
                  className="w-5 h-5 accent-neon-blue cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-white/2 p-3 rounded-lg border border-white/5">
                <span className="font-mono text-white/70 text-sm uppercase">Screen Shake on Impact</span>
                <input 
                  type="checkbox" 
                  checked={state.settings.screenShake}
                  onChange={(e) => handleCheckboxChange('screenShake', e.target.checked)}
                  className="w-5 h-5 accent-neon-blue cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-white/2 p-3 rounded-lg border border-white/5">
                <span className="font-mono text-white/70 text-sm uppercase">Day/Night Cycle</span>
                <input 
                  type="checkbox" 
                  checked={state.settings.dayNightCycle}
                  onChange={(e) => handleCheckboxChange('dayNightCycle', e.target.checked)}
                  className="w-5 h-5 accent-neon-blue cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'gameplay' && (
            <div className="space-y-6 pt-2">
              <div className="flex flex-col">
                <span className="font-mono text-white/70 text-sm uppercase mb-2">Driver Name</span>
                <input 
                  type="text" 
                  value={state.settings.playerName}
                  onChange={(e) => handleStringChange('playerName', e.target.value.toUpperCase())}
                  maxLength={10}
                  className="bg-white/5 border border-white/15 text-white font-racing font-bold px-4 py-3 rounded-xl outline-none focus:border-neon-blue tracking-widest text-sm"
                  placeholder="ENTER NAME"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-mono text-white/70 text-sm uppercase mb-3">Car Color Swatch</span>
                <div className="grid grid-cols-6 gap-3 bg-white/2 p-4 rounded-xl border border-white/5">
                  {allColors.map(color => {
                    const bg = COLORS[`car${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof COLORS] as any
                    return (
                      <button 
                        key={color}
                        onClick={() => dispatch({ type: 'SET_COLOR', color })}
                        className={`w-9 h-9 rounded-full border-2 transition-all ${state.selectedColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'}`}
                        style={{ backgroundColor: bg.body }}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="pt-2">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-white/15 text-white/40 uppercase tracking-wider">
                    <th className="pb-2">Action</th>
                    <th className="pb-2 text-right">Keybindings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-white/80">
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Accelerate / Move Forward</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">W / ARROW UP</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Brake / Reverse</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">S / ARROW DOWN</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Steer Left</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">A / ARROW LEFT</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Steer Right</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">D / ARROW RIGHT</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Nitro Boost</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-orange animate-pulse">SPACEBAR</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Pause / Resume</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">P</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Toggle Day / Night</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">T</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold uppercase">Toggle Weather Rain</td>
                    <td className="py-2.5 text-right font-racing font-bold text-neon-blue">Y</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Back Button */}
        <button 
          onClick={() => dispatch({ type: 'SET_STATUS', status: GameStatus.MainMenu })}
          className="w-full py-4 rounded-xl bg-neon-blue text-black font-racing font-bold text-xl hover:bg-neon-green transition-all shadow-neon"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  )
}

export default SettingsPanel
