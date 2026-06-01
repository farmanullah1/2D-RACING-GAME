import React, { useRef, useEffect, useMemo } from 'react'
import { useGameState, useGameDispatch } from '../../App'
import { GameMode, CarColor, AIDifficulty, GameStatus } from '../../types/game.types'
import { TRACKS } from '../../data/tracks'
import { COLORS } from '../../constants/graphicsConstants'
import { buildOffscreenTrack } from '../../data/tilesets'
import { useAudio } from '../../hooks/useAudio'

const StartMenu: React.FC = () => {
  const state = useGameState()
  const dispatch = useGameDispatch()
  const audio = useAudio(state.settings)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const allColors: CarColor[] = ['red', 'blue', 'silver', 'gold', 'purple', 'green', 'pink', 'cyan', 'yellow', 'white', 'black', 'orange']

  // 1. Scrolling background animation
  const track = useMemo(() => TRACKS[state.selectedTrack || 0], [state.selectedTrack])
  const offscreenTrack = useMemo(() => buildOffscreenTrack(track.grid, track.theme), [track])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let offset = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Pan diagonal direction slowly (1/8 speed as requested)
      offset += 0.4
      
      ctx.save()
      ctx.globalAlpha = 0.16
      ctx.translate(-Math.floor(offset % offscreenTrack.width), -Math.floor(offset % offscreenTrack.height))
      
      // Tile offscreen canvas
      for (let x = 0; x < canvas.width + offscreenTrack.width * 2; x += offscreenTrack.width) {
        for (let y = 0; y < canvas.height + offscreenTrack.height * 2; y += offscreenTrack.height) {
          ctx.drawImage(offscreenTrack, x, y)
        }
      }
      ctx.restore()
      
      animationId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [offscreenTrack])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a14] relative overflow-hidden p-6 select-none">
      {/* Animated scrolling canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 animate-fade-in" />
      
      {/* Background radial gradients for extra depth */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-orange/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Container overlay */}
      <div className="flex flex-col items-center z-10 w-full max-w-5xl animate-slide-up">
        <h1 className="text-8xl md:text-9xl font-racing font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-pink to-neon-orange mb-2 animate-glow select-none">
          VELOCITYX
        </h1>
        <p className="text-xl font-mono text-white/40 tracking-[0.5em] mb-12 uppercase select-none">2D Racing Game</p>

        {/* Mode Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full mb-8">
          <button 
            onMouseEnter={() => audio.playMenuTick()}
            onClick={() => { audio.playTransitionSweep(); dispatch({ type: 'START_RACE', mode: GameMode.AIRace }) }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-neon-blue/50 transition-all duration-300 hover:scale-102 hover:bg-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl mb-3">🏁</div>
              <div className="text-lg font-racing font-bold text-white group-hover:text-neon-blue">GRAND PRIX</div>
              <p className="text-[10px] text-white/40 mt-1">Race 3 AI opponents over 3 laps.</p>
            </div>
          </button>

          <button 
            onMouseEnter={() => audio.playMenuTick()}
            onClick={() => { audio.playTransitionSweep(); dispatch({ type: 'START_RACE', mode: GameMode.TimeTrial }) }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-neon-green/50 transition-all duration-300 hover:scale-102 hover:bg-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl mb-3">⏱️</div>
              <div className="text-lg font-racing font-bold text-white group-hover:text-neon-green">TIME TRIAL</div>
              <p className="text-[10px] text-white/40 mt-1">Solo race against the clock with personal ghosts.</p>
            </div>
          </button>

          <button 
            onMouseEnter={() => audio.playMenuTick()}
            onClick={() => { audio.playTransitionSweep(); dispatch({ type: 'START_RACE', mode: GameMode.FreeRoam }) }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-neon-orange/50 transition-all duration-300 hover:scale-102 hover:bg-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl mb-3">🚗</div>
              <div className="text-lg font-racing font-bold text-white group-hover:text-neon-orange">FREE ROAM</div>
              <p className="text-[10px] text-white/40 mt-1">No laps, no opponents. Just drift and play.</p>
            </div>
          </button>

          <button 
            onMouseEnter={() => audio.playMenuTick()}
            onClick={() => { audio.playTransitionSweep(); dispatch({ type: 'START_RACE', mode: GameMode.CarFights }) }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-neon-pink/50 transition-all duration-300 hover:scale-102 hover:bg-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl mb-3">💀</div>
              <div className="text-lg font-racing font-bold text-white group-hover:text-neon-pink">CAR FIGHTS</div>
              <p className="text-[10px] text-white/40 mt-1">Ram opponents and collect repair wrenches.</p>
            </div>
          </button>

          <button 
            onMouseEnter={() => audio.playMenuTick()}
            onClick={() => { audio.playTransitionSweep(); dispatch({ type: 'START_RACE', mode: GameMode.MegaGrid }) }}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:border-neon-yellow/50 transition-all duration-300 hover:scale-102 hover:bg-white/10 flex flex-col justify-between"
          >
            <div>
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-lg font-racing font-bold text-white group-hover:text-neon-yellow animate-glow">MEGA GRID</div>
              <p className="text-[10px] text-white/40 mt-1">Race against a staggered F1 grid of 15 AIs!</p>
            </div>
          </button>
        </div>

        {/* Customization & Settings Panel Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 bg-track-panel backdrop-blur-xl p-6 rounded-2xl border border-white/10 w-full shadow-panel">
          {/* Player Name */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Player Name</span>
            <input 
              type="text"
              value={state.settings.playerName}
              onChange={(e) => dispatch({ type: 'UPDATE_SETTINGS', settings: { playerName: e.target.value.toUpperCase() } })}
              maxLength={10}
              className="bg-white/5 border border-white/15 text-white font-racing font-bold text-center px-4 py-2 rounded-md outline-none focus:border-neon-blue/80 tracking-widest text-sm w-[150px] transition-all"
              placeholder="ENTER NAME"
            />
          </div>

          <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

          {/* Select Track */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Select Track</span>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {TRACKS.map((t, i) => (
                <button 
                  key={t.id}
                  onMouseEnter={() => audio.playMenuTick()}
                  onClick={() => { audio.playMenuTick(); dispatch({ type: 'SET_TRACK', trackIndex: i }) }}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-racing font-bold border transition-all ${state.selectedTrack === i ? 'border-neon-blue bg-neon-blue/20 text-white shadow-neon' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
                >
                  {t.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

          {/* Select Color */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Select Color</span>
            <div className="grid grid-cols-6 gap-2">
              {allColors.map(color => {
                const bg = COLORS[`car${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof COLORS] as any
                return (
                  <button 
                    key={color}
                    onMouseEnter={() => audio.playMenuTick()}
                    onClick={() => { audio.playMenuTick(); dispatch({ type: 'SET_COLOR', color }) }}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${state.selectedColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105 opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: bg.body }}
                  />
                )
              })}
            </div>
          </div>

          <div className="h-10 w-[1px] bg-white/10 hidden lg:block" />

          {/* Difficulty */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-mono text-white/40 uppercase mb-3">Difficulty</span>
            <div className="flex gap-2">
              {(['EASY', 'MEDIUM', 'HARD']).map((d, i) => (
                <button 
                  key={d}
                  onMouseEnter={() => audio.playMenuTick()}
                  onClick={() => { audio.playMenuTick(); dispatch({ type: 'SET_DIFFICULTY', difficulty: i as AIDifficulty }) }}
                  className={`px-4 py-2 rounded-md text-xs font-racing font-bold border transition-all ${state.difficulty === i ? 'border-neon-orange bg-neon-orange/20 text-white shadow-neon-orange' : 'border-white/10 hover:bg-white/5 text-white/60'}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Spec HUD */}
        {(() => {
          const getVehicleClassDetails = (color: CarColor) => {
            switch (color) {
              case 'red':
              case 'cyan':
                return {
                  name: 'Hyperclass',
                  speed: 95,
                  accel: 60,
                  grip: 70,
                  special: 'Extreme top speed straightaways'
                }
              case 'gold':
              case 'orange':
                return {
                  name: 'Interceptor',
                  speed: 70,
                  accel: 95,
                  grip: 80,
                  special: 'Rocket launch torque power'
                }
              case 'blue':
              case 'pink':
                return {
                  name: 'Drift King',
                  speed: 65,
                  accel: 75,
                  grip: 50,
                  special: 'Enhanced countersteer slip angle'
                }
              case 'green':
              case 'yellow':
                return {
                  name: 'Lightning',
                  speed: 85,
                  accel: 85,
                  grip: 85,
                  special: 'Ultra agile balanced engine'
                }
              case 'purple':
                return {
                  name: 'Supreme',
                  speed: 78,
                  accel: 78,
                  grip: 80,
                  special: 'Premium balanced hybrid tuning'
                }
              case 'white':
                return {
                  name: 'Glacier Frost',
                  speed: 75,
                  accel: 90,
                  grip: 95,
                  special: 'Active thermal tire traction control'
                }
              case 'black':
                return {
                  name: 'Shadow Stealth',
                  speed: 90,
                  accel: 80,
                  grip: 75,
                  special: 'Refilled nitro fuel combustion core'
                }
              case 'silver':
                return {
                  name: 'Raging Juggernaut',
                  speed: 70,
                  accel: 85,
                  grip: 88,
                  special: 'High push mass collision defense'
                }
              default:
                return {
                  name: 'Standard',
                  speed: 70,
                  accel: 70,
                  grip: 70,
                  special: 'Factory stock package tuning'
                }
            }
          }
          const specs = getVehicleClassDetails(state.selectedColor)
          return (
            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in z-10 select-none">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Vehicle Classification</span>
                <h2 className="text-3xl font-racing font-black text-white italic tracking-wide animate-glow uppercase">{specs.name}</h2>
                <p className="text-xs font-mono text-neon-blue mt-1">SPECIALTY: {specs.special.toUpperCase()}</p>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-[450px]">
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
                    <span>TOP VELOCITY</span>
                    <span className="text-white font-racing font-bold">{specs.speed}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-300" style={{ width: `${specs.speed}%` }} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
                    <span>ACCELERATION TORQUE</span>
                    <span className="text-white font-racing font-bold">{specs.accel}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-300" style={{ width: `${specs.accel}%` }} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between text-[10px] font-mono text-white/60 mb-1">
                    <span>STEERING GRIP & DAMPING</span>
                    <span className="text-white font-racing font-bold">{specs.grip}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-pink transition-all duration-300" style={{ width: `${specs.grip}%` }} />
                  </div>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Bottom Nav Links */}
        <div className="flex gap-10 mt-10 z-10 select-none">
          <button 
            onMouseEnter={() => audio.playMenuTick()}
            onClick={() => { audio.playTransitionSweep(); dispatch({ type: 'SET_STATUS', status: GameStatus.Settings }) }}
            className="font-racing font-bold text-sm tracking-widest text-white/40 hover:text-neon-blue transition-all duration-300 hover:scale-105"
          >
            ⚙️ SETTINGS
          </button>
          <button 
            onClick={() => dispatch({ type: 'SET_STATUS', status: GameStatus.Leaderboard })}
            className="font-racing font-bold text-sm tracking-widest text-white/40 hover:text-neon-green transition-all duration-300 hover:scale-105"
          >
            🏆 LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  )
}

export default StartMenu
