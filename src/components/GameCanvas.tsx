import React, { useRef, useEffect, useMemo, useCallback } from 'react'
import { useGameState, useGameDispatch } from '../App'
import { useKeyboardControls } from '../hooks/useKeyboardControls'
import { useGameLoop } from '../hooks/useGameLoop'
import { PhysicsEngine } from '../engines/PhysicsEngine'
import { RenderEngine } from '../engines/RenderEngine'
import { AIEngine } from '../engines/AIEngine'
import { ParticleEngine } from '../engines/ParticleEngine'
import { CollisionEngine } from '../engines/CollisionEngine'
import { updateCamera } from '../hooks/useCamera'
import { TRACKS } from '../data/tracks'
import { buildOffscreenTrack } from '../data/tilesets'
import { GameStatus, GameMode, ParticleType, CarState, TileType } from '../types/game.types'
import Speedometer from './HUD/Speedometer'
import LapTimer from './HUD/LapTimer'
import NitroMeter from './HUD/NitroMeter'
import MiniMap from './HUD/MiniMap'
import PositionDisplay from './HUD/PositionDisplay'
import PauseMenu from './Menus/PauseMenu'
import RaceFinishedScreen from './Menus/RaceFinishedScreen'
import { useAudio } from '../hooks/useAudio'
import { GhostEngine } from '../engines/GhostEngine'
import { CAR_HEIGHT, CAR_WIDTH } from '../constants/graphicsConstants'
import { vecRotate, randomRange, vecAdd, vecDist } from '../utils/mathUtils'

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useGameState()
  const dispatch = useGameDispatch()
  const input = useKeyboardControls()
  const audio = useAudio(state.settings)
  const track = useMemo(() => TRACKS[state.selectedTrack || 0], [state.selectedTrack])
  
  // Engines
  const physics = useMemo(() => new PhysicsEngine(), [])
  const renderer = useMemo(() => new RenderEngine(), [])
  const aiEngine = useMemo(() => new AIEngine(), [])
  const particles = useMemo(() => new ParticleEngine(), [])
  const collisions = useMemo(() => new CollisionEngine(), [])
  const ghost = useMemo(() => new GhostEngine(), [])
  
  const offscreenTrack = useMemo(() => buildOffscreenTrack(track.grid, track.theme), [track])

  useEffect(() => {
    if (state.mode === GameMode.TimeTrial) {
      ghost.loadGhost()
    }
  }, [state.mode, ghost])

  const update = useCallback((delta: number) => {
    if (state.status === GameStatus.Countdown) {
      if (state.frameCount % 60 === 0) {
        audio.playCountdown(state.countdownValue)
        dispatch({ type: 'TICK_COUNTDOWN' })
      }
      if (state.countdownValue === 0 && state.mode === GameMode.TimeTrial) {
        ghost.startRecording()
      }
    }

    if (state.status === GameStatus.Racing) {
      // 1. Player Physics
      const playerWallHit = physics.updateCar(state.player, input, delta, track.grid, track.theme)
      if (playerWallHit) {
        audio.playCollision(0.4)
        const sparkPos = vecAdd(state.player.position, vecRotate({ x: CAR_HEIGHT / 2, y: 0 }, state.player.angle))
        particles.emit(ParticleType.Spark, {
          x: sparkPos.x, y: sparkPos.y,
          count: 10,
          angle: state.player.angle + Math.PI + randomRange(-0.5, 0.5),
          spread: Math.PI / 2,
          speedMin: 50, speedMax: 150,
          lifeMin: 0.2, lifeMax: 0.4,
          sizeMin: 1.5, sizeMax: 3.5,
          color: '#fff176'
        })
      }

      // Ghost recording
      if (state.mode === GameMode.TimeTrial) {
        ghost.recordFrame(state.player, state.raceTime)
      }
      
      // 2. AI Physics & Logic
      state.aiDrivers.forEach(ai => {
        const aiInput = aiEngine.updateDriver(ai, [state.player, ...state.aiDrivers.map(d => d.car)], delta, track.waypoints, state.mode, state.powerUps)
        const aiWallHit = physics.updateCar(ai.car, aiInput, delta, track.grid, track.theme)
        if (aiWallHit) {
          audio.playCollision(0.2)
          const sparkPos = vecAdd(ai.car.position, vecRotate({ x: CAR_HEIGHT / 2, y: 0 }, ai.car.angle))
          particles.emit(ParticleType.Spark, {
            x: sparkPos.x, y: sparkPos.y,
            count: 6,
            angle: ai.car.angle + Math.PI + randomRange(-0.5, 0.5),
            spread: Math.PI / 2,
            speedMin: 50, speedMax: 120,
            lifeMin: 0.2, lifeMax: 0.4,
            sizeMin: 1.5, sizeMax: 3,
            color: '#ffca28'
          })
        }
        aiEngine.applyRubberBanding(ai, state.player)
      })

      // 3. Collisions
      state.aiDrivers.forEach(ai => {
        if (physics.resolveCarCollision(state.player, ai.car, state.mode)) {
          audio.playCollision(0.7)
          const sparkPos = {
            x: (state.player.position.x + ai.car.position.x) / 2,
            y: (state.player.position.y + ai.car.position.y) / 2
          }
          particles.emit(ParticleType.Spark, {
            x: sparkPos.x, y: sparkPos.y,
            count: 12,
            angle: Math.atan2(ai.car.position.y - state.player.position.y, ai.car.position.x - state.player.position.x) + Math.PI / 2,
            spread: Math.PI,
            speedMin: 60, speedMax: 160,
            lifeMin: 0.2, lifeMax: 0.4,
            sizeMin: 2, sizeMax: 3.5,
            color: '#fff176'
          })
        }
      })
      
      // 3.5. Power-ups Harvesting & Respawning (Car Fights Mode)
      if (state.mode === GameMode.CarFights && state.powerUps) {
        const allCars = [state.player, ...state.aiDrivers.map(d => d.car)]
        state.powerUps.forEach(p => {
          if (p.active) {
            allCars.forEach(car => {
              if (car.state !== CarState.Crashed) {
                const d = vecDist(car.position, p)
                if (d < car.collisionRadius + 12) {
                  p.active = false
                  p.respawnTimer = 8.0
                  
                  if (p.type === 'health') {
                    car.damageLevel = Math.max(0.0, car.damageLevel - 0.35)
                    if (car.isPlayer) {
                      audio.playLapComplete(true)
                      dispatch({ type: 'SHOW_TOAST', message: 'HULL REPAIRED +35% 🔧' })
                    }
                  } else {
                    car.nitro = 1.0
                    if (car.isPlayer) {
                      audio.playNitroWhoosh()
                      dispatch({ type: 'SHOW_TOAST', message: 'SUPER NITRO CHARGED! ⚡' })
                    }
                  }
                  
                  particles.emit(ParticleType.Spark, {
                    x: p.x, y: p.y,
                    count: 12,
                    angle: 0,
                    spread: Math.PI * 2,
                    speedMin: 40, speedMax: 120,
                    lifeMin: 0.3, lifeMax: 0.6,
                    sizeMin: 2, sizeMax: 4,
                    color: p.type === 'health' ? '#00ff88' : '#ff00ff'
                  })
                }
              }
            })
          } else {
            p.respawnTimer -= delta
            if (p.respawnTimer <= 0) {
              p.active = true
              p.respawnTimer = 0
            }
          }
        })
      }

      // 3.8. Destruction & Victory Checking (Car Fights Mode)
      if (state.mode === GameMode.CarFights) {
        const allCars = [state.player, ...state.aiDrivers.map(d => d.car)]
        allCars.forEach(car => {
          if (car.damageLevel >= 1.0 && car.state !== CarState.Crashed) {
            car.state = CarState.Crashed
            audio.playCollision(1.0)
            car.screenShake = 24

            // Huge explosion particles
            particles.emit(ParticleType.Spark, {
              x: car.position.x, y: car.position.y,
              count: 35,
              angle: 0,
              spread: Math.PI * 2,
              speedMin: 80, speedMax: 260,
              lifeMin: 0.4, lifeMax: 0.8,
              sizeMin: 3, sizeMax: 6,
              color: '#ff6b00'
            })
            particles.emit(ParticleType.DustCloud, {
              x: car.position.x, y: car.position.y,
              count: 15,
              angle: 0,
              spread: Math.PI * 2,
              speedMin: 30, speedMax: 90,
              lifeMin: 0.6, lifeMax: 1.2,
              sizeMin: 12, sizeMax: 28,
              color: 'rgba(60, 60, 60, 0.45)'
            })

            if (car.isPlayer) {
              dispatch({ type: 'SHOW_TOAST', message: 'CRITICAL DAMAGE! WASTED! 💀' })
              setTimeout(() => {
                dispatch({ type: 'RACE_FINISHED' })
              }, 1800)
            } else {
              dispatch({ type: 'SHOW_TOAST', message: `${car.color.toUpperCase()} AI BLASTED! 💥` })
            }
          }
        })

        if (state.player.state !== CarState.Crashed) {
          const activeAIs = state.aiDrivers.filter(ai => ai.car.state !== CarState.Crashed)
          if (activeAIs.length === 0) {
            audio.playRaceFinish()
            for (let i = 0; i < 5; i++) {
              particles.emit(ParticleType.Confetti, {
                x: state.player.position.x + randomRange(-100, 100),
                y: state.player.position.y + randomRange(-100, 100),
                count: 15,
                angle: -Math.PI / 2,
                spread: Math.PI / 3,
                speedMin: 100, speedMax: 250,
                lifeMin: 1.5, lifeMax: 2.5,
                sizeMin: 4, sizeMax: 8,
                color: ['#00f5ff', '#ff006e', '#ffee00', '#00ff88', '#ff6b00'][Math.floor(Math.random() * 5)]
              })
            }
            dispatch({ type: 'SHOW_TOAST', message: 'VICTORY! ARENA CHAMPION! 🏆' })
            dispatch({ type: 'RACE_FINISHED' })
          }
        }
      }

      // 4. Laps & Checkpoints (Bypassed in Car Fights)
      if (state.mode !== GameMode.CarFights) {
        collisions.checkCheckpoint(state.player, track.grid)
        if (collisions.checkLapCompletion(state.player, track.grid, track.checkpoints.length)) {
          const isBest = state.player.bestLapTime === null || state.player.lapTimes[state.player.lapTimes.length - 1] < state.player.bestLapTime
          audio.playLapComplete(isBest)
          
          dispatch({ type: 'SHOW_TOAST', message: isBest ? "NEW BEST LAP! 🏆" : `LAP ${state.player.lap - 1} COMPLETE!` })
          
          if (state.mode === GameMode.TimeTrial) {
            ghost.stopRecording()
            ghost.startRecording()
          }
          if (state.player.lap > state.totalLaps) {
            if (state.mode === GameMode.TimeTrial) ghost.stopRecording()
            audio.playRaceFinish()
            
            for (let i = 0; i < 5; i++) {
              const confettiX = state.player.position.x + randomRange(-100, 100)
              const confettiY = state.player.position.y + randomRange(-100, 100)
              particles.emit(ParticleType.Confetti, {
                x: confettiX, y: confettiY,
                count: 20,
                angle: -Math.PI / 2,
                spread: Math.PI / 3,
                speedMin: 100, speedMax: 250,
                lifeMin: 1.5, lifeMax: 2.5,
                sizeMin: 4, sizeMax: 8,
                color: ['#00f5ff', '#ff006e', '#ffee00', '#00ff88', '#ff6b00'][Math.floor(Math.random() * 5)]
              })
            }
            dispatch({ type: 'RACE_FINISHED' })
          }
        }
        
        state.aiDrivers.forEach(ai => {
          collisions.checkCheckpoint(ai.car, track.grid)
          collisions.checkLapCompletion(ai.car, track.grid, track.checkpoints.length)
        })
      }

      // 5. Particles Update & Spawning
      const allCarsList = [state.player, ...state.aiDrivers.map(d => d.car)]
      allCarsList.forEach(car => {
        // Exhaust Smoke
        if (state.frameCount % 4 === 0 && Math.abs(car.speed) > 10) {
          const exhaustPos = vecAdd(car.position, vecRotate({ x: -CAR_HEIGHT / 2, y: 0 }, car.angle))
          particles.emit(ParticleType.ExhaustSmoke, {
            x: exhaustPos.x, y: exhaustPos.y,
            count: 1,
            angle: car.angle + Math.PI + randomRange(-0.15, 0.15),
            speedMin: 15, speedMax: 40,
            lifeMin: 0.3, lifeMax: 0.6,
            sizeMin: 3, sizeMax: 6,
            color: 'rgba(150, 150, 150, 0.15)'
          })
        }

        // Nitro Flame
        if (car.nitroActive) {
          const exhaustPos = vecAdd(car.position, vecRotate({ x: -CAR_HEIGHT / 2, y: 0 }, car.angle))
          particles.emit(ParticleType.NitroFlame, {
            x: exhaustPos.x, y: exhaustPos.y,
            count: 3,
            angle: car.angle + Math.PI + randomRange(-0.08, 0.08),
            speedMin: 120, speedMax: 220,
            lifeMin: 0.15, lifeMax: 0.3,
            sizeMin: 5, sizeMax: 9,
            color: ['#ff6b00', '#ff9f1c', '#ffee32', '#00f5ff'][Math.floor(Math.random() * 4)],
            rotation: car.angle + Math.PI
          })
          
          if (car.isPlayer && state.frameCount % 20 === 0) {
            audio.playNitroWhoosh()
          }
        }

        // Drift Smoke
        if (car.state === CarState.Drifting) {
          const rl = vecAdd(car.position, vecRotate({ x: -CAR_HEIGHT / 3, y: -CAR_WIDTH / 2 }, car.angle))
          const rr = vecAdd(car.position, vecRotate({ x: -CAR_HEIGHT / 3, y: CAR_WIDTH / 2 }, car.angle))
          const smokeOptions = {
            count: 2,
            angle: car.angle + Math.PI + randomRange(-0.3, 0.3),
            speedMin: 20, speedMax: 60,
            lifeMin: 0.6, lifeMax: 1.0,
            sizeMin: 8, sizeMax: 16,
            color: 'rgba(230, 230, 230, 0.12)'
          }
          particles.emit(ParticleType.DriftSmoke, { ...smokeOptions, x: rl.x, y: rl.y })
          particles.emit(ParticleType.DriftSmoke, { ...smokeOptions, x: rr.x, y: rr.y })
        }

        // Dust Cloud on Grass/Gravel
        const tile = physics.getCurrentTile(car, track.grid)
        if ((tile === TileType.Grass || tile === TileType.Gravel) && Math.abs(car.speed) > 60) {
          const dustColor = tile === TileType.Grass ? 'rgba(80, 130, 85, 0.18)' : 'rgba(165, 135, 95, 0.18)'
          particles.emit(ParticleType.DustCloud, {
            x: car.position.x, y: car.position.y,
            count: 3,
            angle: car.angle + Math.PI + randomRange(-0.4, 0.4),
            speedMin: 30, speedMax: 80,
            lifeMin: 0.4, lifeMax: 0.7,
            sizeMin: 10, sizeMax: 20,
            color: dustColor
          })
        }
      })

      // Rain Splash
      if (state.isRaining && canvasRef.current) {
        const cam = state.camera
        const width = canvasRef.current.width
        const height = canvasRef.current.height
        for (let i = 0; i < 2; i++) {
          particles.emit(ParticleType.RainSplash, {
            x: cam.x + randomRange(0, width),
            y: cam.y + randomRange(0, height),
            count: 1,
            speedMin: 0, speedMax: 0,
            lifeMin: 0.15, lifeMax: 0.25,
            sizeMin: 3, sizeMax: 7,
            color: 'rgba(150, 220, 255, 0.4)'
          })
        }
      }

      particles.update(delta)
      particles.updateSkidMarks(state.player, delta)
      state.aiDrivers.forEach(ai => particles.updateSkidMarks(ai.car, delta))

      // 6. Camera
      updateCamera(
        state.camera, 
        state.player, 
        canvasRef.current?.width || 800, 
        canvasRef.current?.height || 600, 
        delta
      )
      
      // Audio update
      audio.updateEngineSound(state.player.speed, state.player.maxSpeed)
      audio.updateTireScreech(state.player.driftAngle, state.player.speed)
      
      dispatch({ type: 'UPDATE_PHYSICS', delta })
    }
  }, [state, input, physics, aiEngine, particles, collisions, dispatch, audio, ghost, track])

  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const ghostCar = state.mode === GameMode.TimeTrial ? ghost.getGhostAtTime(state.raceTime) : null

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    renderer.renderFrame(ctx, {
      ...state,
      particles: particles.getParticles(),
      skidMarks: particles.getSkidMarks()
    }, offscreenTrack, ghostCar)
  }, [state, renderer, particles, offscreenTrack, ghost])

  const { fps } = useGameLoop(update, render, state.status === GameStatus.Racing || state.status === GameStatus.Countdown)

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p') {
        dispatch({ type: 'PAUSE_TOGGLE' })
      } else if (e.key.toLowerCase() === 't') {
        dispatch({ type: 'TOGGLE_DAY' })
      } else if (e.key.toLowerCase() === 'y') {
        dispatch({ type: 'TOGGLE_RAIN' })
      }
    }
    window.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyDown)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [dispatch])

  return (
    <div className="canvas-container w-full h-full relative">
      <canvas ref={canvasRef} />

      {state.status === GameStatus.Paused && <PauseMenu />}
      {state.status === GameStatus.RaceFinished && <RaceFinishedScreen />}

      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between select-none">
        {/* Top HUD */}
        <div className="flex justify-between items-start">
          {state.mode === GameMode.CarFights ? (
            <div className="flex flex-col bg-black/50 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 shadow-lg animate-fade-in">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-1">Status</span>
              <div className="text-2xl font-racing font-black text-neon-pink animate-glow italic tracking-wider">
                SURVIVORS: {state.aiDrivers.filter(ai => ai.car.state !== CarState.Crashed).length + (state.player.state !== CarState.Crashed ? 1 : 0)} / 4
              </div>
            </div>
          ) : (
            <LapTimer />
          )}
          <PositionDisplay />
          <div className="w-[180px]" /> {/* Spacer */}
        </div>

        {/* Bottom HUD */}
        <div className="flex justify-between items-end">
          <div className="flex items-end gap-6">
            <Speedometer />
            {state.mode === GameMode.CarFights && (
              <div className="flex flex-col items-start bg-black/50 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10 shadow-lg animate-fade-in mb-1">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-2">Hull Integrity</span>
                <div className="w-[180px] h-4 bg-slate-800 rounded-full overflow-hidden border border-white/15 relative">
                  <div 
                    className={`h-full transition-all duration-300 ${state.player.damageLevel > 0.7 ? 'bg-neon-pink animate-pulse' : state.player.damageLevel > 0.4 ? 'bg-neon-orange' : 'bg-neon-green'}`} 
                    style={{ width: `${Math.max(0, 100 - Math.round(state.player.damageLevel * 100))}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-racing font-bold text-[10px] text-white tracking-widest">
                    {Math.max(0, 100 - Math.round(state.player.damageLevel * 100))}%
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <NitroMeter />
          </div>
          <MiniMap />
        </div>
      </div>

      {state.status === GameStatus.Countdown && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-9xl font-racing font-black text-neon-orange animate-count-down">
            {state.countdownValue > 0 ? state.countdownValue : 'GO!'}
          </span>
        </div>
      )}
      {state.settings.showFPS && (
        <div className="absolute top-4 right-4 font-mono text-neon-green">
          FPS: {fps}
        </div>
      )}
    </div>
  )
}

export default GameCanvas
