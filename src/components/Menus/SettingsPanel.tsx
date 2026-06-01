import React from 'react'
import { useGameState, useGameDispatch } from '../../App'

const SettingsPanel: React.FC = () => {
  const state = useGameState()
  const dispatch = useGameDispatch()
  
  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-6">
      <div className="bg-track-panel border border-white/10 p-10 rounded-[2.5rem] shadow-panel max-w-lg w-full">
        <h2 className="text-4xl font-racing font-black text-white mb-8 italic">SETTINGS</h2>
        
        <div className="space-y-6 mb-10">
          <div className="flex justify-between items-center">
            <span className="font-mono text-white/60 text-sm uppercase">Show Minimap</span>
            <input 
              type="checkbox" 
              checked={state.settings.showMinimap}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { showMinimap: e.target.checked } })}
              className="w-6 h-6 accent-neon-blue"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-mono text-white/60 text-sm uppercase">Show FPS</span>
            <input 
              type="checkbox" 
              checked={state.settings.showFPS}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { showFPS: e.target.checked } })}
              className="w-6 h-6 accent-neon-blue"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="font-mono text-white/60 text-sm uppercase">Screen Shake</span>
            <input 
              type="checkbox" 
              checked={state.settings.screenShake}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { screenShake: e.target.checked } })}
              className="w-6 h-6 accent-neon-blue"
            />
          </div>
        </div>
        
        <button 
          onClick={() => dispatch({ type: 'GO_TO_MENU' })}
          className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-racing font-bold text-xl hover:bg-white/10 transition-all"
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  )
}

export default SettingsPanel
