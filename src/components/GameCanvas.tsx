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
import { TRACK_GRID } from '../data/trackLayout'
import { buildOffscreenTrack } from '../data/tilesets'
import { GameStatus, GameMode } from '../types/game.types'
import Speedometer from './HUD/Speedometer'
import LapTimer from './HUD/LapTimer'
import NitroMeter from './HUD/NitroMeter'
import MiniMap from './HUD/MiniMap'
import PositionDisplay from './HUD/PositionDisplay'
import PauseMenu from './Menus/PauseMenu'
import RaceFinishedScreen from './Menus/RaceFinishedScreen'
import { useAudio } from '../hooks/useAudio'
import { GhostEngine } from '../engines/GhostEngine'

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useGameState()
  const dispatch = useGameDispatch()
  const input = useKeyboardControls()
  const audio = useAudio(state.settings)
  
  // Engines
  const physics = useMemo(() => new PhysicsEngine(), [])
  const renderer = useMemo(() => new RenderEngine(), [])
  const aiEngine = useMemo(() => new AIEngine(), [])
  const particles = useMemo(() => new ParticleEngine(), [])
  const collisions = useMemo(() => new CollisionEngine(), [])
  const ghost = useMemo(() => new GhostEngine(), [])
  
  const offscreenTrack = useMemo(() => buildOffscreenTrack(TRACK_GRID), [])

  useEffect(() => {
    if (state.mode === GameMode.TimeTrial) {
      ghost.loadGhost()
    }
  }, [state.mode, ghost])

  const update = useCallback((delta: number) => {
    if (state.status === GameStatus.Countdown) {
      if (state.frameCount % 60 === 0) dispatch({ type: 'TICK_COUNTDOWN' })
      if (state.countdownValue === 0 && state.mode === GameMode.TimeTrial) {
        ghost.startRecording()
      }
    }

    if (state.status === GameStatus.Racing) {
      // 1. Player Physics
      physics.updateCar(state.player, input, delta, TRACK_GRID)

      // Ghost recording
      if (state.mode === GameMode.TimeTrial) {
        ghost.recordFrame(state.player, state.raceTime)
      }
      
      // 2. AI Physics & Logic
      state.aiDrivers.forEach(ai => {
        const aiInput = aiEngine.updateDriver(ai, [state.player, ...state.aiDrivers.map(d => d.car)], delta)
        physics.updateCar(ai.car, aiInput, delta, TRACK_GRID)
        aiEngine.applyRubberBanding(ai, state.player)
      })

      // 3. Collisions
      state.aiDrivers.forEach(ai => {
        physics.resolveCarCollision(state.player, ai.car)
      })
      
      // 4. Laps & Checkpoints
      collisions.checkCheckpoint(state.player, TRACK_GRID)
      if (collisions.checkLapCompletion(state.player, TRACK_GRID)) {
        dispatch({ type: 'SHOW_TOAST', message: `LAP ${state.player.lap - 1} COMPLETE!` })
        if (state.mode === GameMode.TimeTrial) {
          ghost.stopRecording()
          ghost.startRecording()
        }
        if (state.player.lap > state.totalLaps) {
          if (state.mode === GameMode.TimeTrial) ghost.stopRecording()
          dispatch({ type: 'RACE_FINISHED' })
        }
      }
      
      state.aiDrivers.forEach(ai => {
        collisions.checkCheckpoint(ai.car, TRACK_GRID)
        collisions.checkLapCompletion(ai.car, TRACK_GRID)
      })

      // 5. Particles
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
      
      dispatch({ type: 'UPDATE_PHYSICS', delta })
    }
  }, [state, input, physics, aiEngine, particles, collisions, dispatch, audio, ghost])

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
      <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
        {/* Top HUD */}
        <div className="flex justify-between items-start">
          <LapTimer />
          <PositionDisplay />
          <div className="w-[180px]" /> {/* Spacer */}
        </div>

        {/* Bottom HUD */}
        <div className="flex justify-between items-end">
          <Speedometer />
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
