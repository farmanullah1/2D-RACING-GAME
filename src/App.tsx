import React, { useReducer, createContext, useContext, useMemo } from 'react'
import { GameState, GameStatus, GameMode, AIDifficulty, CarState, CarColor } from './types/game.types'
import { GameAction } from './types/events.types'
import { START_POSITION, START_ANGLE } from './data/trackLayout'
import { PLAYER_MAX_SPEED, PLAYER_ACCELERATION, PLAYER_BRAKE_FORCE, TOTAL_LAPS } from './constants/gameConstants'
import GameCanvas from './components/GameCanvas'

const createInitialCar = (id: string, isPlayer: boolean, color: any): any => {
  // Define custom class stats based on vehicle color
  let maxSpeed = PLAYER_MAX_SPEED
  let acceleration = PLAYER_ACCELERATION
  let brakeForce = PLAYER_BRAKE_FORCE
  let grip = 1.0

  if (color === 'red' || color === 'cyan') {
    // HYPERCLASS: High top speeds
    maxSpeed = PLAYER_MAX_SPEED + 50
    acceleration = PLAYER_ACCELERATION - 20
  } else if (color === 'gold' || color === 'orange') {
    // INTERCEPTORS: High launch power
    maxSpeed = PLAYER_MAX_SPEED - 10
    acceleration = PLAYER_ACCELERATION + 80
  } else if (color === 'blue' || color === 'pink') {
    // DRIFT KINGS: Easier sliding and high countersteer control
    maxSpeed = PLAYER_MAX_SPEED - 15
    acceleration = PLAYER_ACCELERATION + 30
    grip = 0.85
  } else if (color === 'green' || color === 'yellow') {
    // LIGHTNINGS: Extremely agile, high top speed & power
    maxSpeed = PLAYER_MAX_SPEED + 30
    acceleration = PLAYER_ACCELERATION + 30
  } else if (color === 'purple') {
    // SUPREME: Balanced premium hybrid
    maxSpeed = PLAYER_MAX_SPEED + 15
    acceleration = PLAYER_ACCELERATION + 15
  } else if (color === 'white') {
    // GLACIER FROST: Specialized frost grip, high launch
    maxSpeed = PLAYER_MAX_SPEED + 10
    acceleration = PLAYER_ACCELERATION + 50
    grip = 1.15
  } else if (color === 'black') {
    // SHADOW STEALTH: Stealth tuning, supreme speed
    maxSpeed = PLAYER_MAX_SPEED + 40
    acceleration = PLAYER_ACCELERATION + 20
    grip = 0.95
  } else if (color === 'silver') {
    // JUGGERNAUT: Heavy armor, offroad resilience, high grip
    maxSpeed = PLAYER_MAX_SPEED
    acceleration = PLAYER_ACCELERATION + 40
    grip = 1.05
  }

  return {
    id,
    position: { ...START_POSITION },
    velocity: { x: 0, y: 0 },
    angle: START_ANGLE,
    angularVelocity: 0,
    speed: 0,
    maxSpeed,
    baseMaxSpeed: maxSpeed,
    acceleration,
    brakeForce,
    grip,
    nitro: 1,
    nitroActive: false,
    state: CarState.Idle,
    lap: 1,
    checkpointsPassed: [],
    lapTimes: [],
    bestLapTime: null,
    totalRaceTime: 0,
    color,
    isPlayer,
    lastValidPosition: { ...START_POSITION },
    damageLevel: 0,
    screenShake: 0,
    driftAngle: 0,
    wheelRotation: 0,
    exhaustTimer: 0,
    collisionRadius: 22
  }
}

const initialState: GameState = {
  status: GameStatus.MainMenu,
  mode: GameMode.AIRace,
  player: createInitialCar('player', true, 'red'),
  aiDrivers: [],
  particles: [],
  skidMarks: [],
  camera: { x: 0, y: 0, zoom: 1, targetZoom: 1, shakeIntensity: 0, shakeDecay: 0.1 },
  raceTime: 0,
  countdownValue: 3,
  totalLaps: TOTAL_LAPS,
  currentDayTime: 0.5,
  isNight: false,
  isRaining: false,
  settings: {
    sfxVolume: 0.7,
    musicVolume: 0.5,
    showMinimap: true,
    showFPS: true,
    weatherEffect: 'none',
    graphicsQuality: 'high',
    dayNightCycle: true,
    screenShake: true,
    playerName: 'PLAYER 1'
  },
  leaderboard: [],
  toastMessage: null,
  toastTimer: 0,
  frameCount: 0,
  fps: 0,
  difficulty: AIDifficulty.Medium,
  selectedColor: 'red',
  selectedTrack: 0,
  powerUps: []
}

import { TRACKS } from './data/tracks'
import StartMenu from './components/Menus/StartMenu'
import MessageToast from './components/UI/MessageToast'
import SettingsPanel from './components/Menus/SettingsPanel'
import LeaderboardModal from './components/UI/LeaderboardModal'
import { loadLeaderboard, saveLeaderboard, saveBestLap, loadBestLap, saveSettings, loadSettings } from './utils/localStorageUtils'

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_RACE': {
      const track = TRACKS[state.selectedTrack]
      const noseDir = { x: Math.cos(track.startAngle), y: Math.sin(track.startAngle) }
      const rightDir = { x: -Math.sin(track.startAngle), y: Math.cos(track.startAngle) }
      
      let aiDriversList: any[] = []

      if (action.mode === GameMode.AIRace || action.mode === GameMode.CarFights) {
        // Standard staggered 3 AI lineup
        aiDriversList = [
          { car: { ...createInitialCar('ai1', false, 'blue'), position: { x: track.startPosition.x - 85 * noseDir.x - 30 * rightDir.x, y: track.startPosition.y - 85 * noseDir.y - 30 * rightDir.y }, angle: track.startAngle }, targetWaypointIndex: 0, difficulty: state.difficulty, aggression: 0.5, reactionDelay: 0, rubberBanding: 0.5 },
          { car: { ...createInitialCar('ai2', false, 'silver'), position: { x: track.startPosition.x - 85 * noseDir.x + 30 * rightDir.x, y: track.startPosition.y - 85 * noseDir.y + 30 * rightDir.y }, angle: track.startAngle }, targetWaypointIndex: 0, difficulty: state.difficulty, aggression: 0.5, reactionDelay: 0, rubberBanding: 0.5 },
          { car: { ...createInitialCar('ai3', false, 'gold'), position: { x: track.startPosition.x - 170 * noseDir.x - 30 * rightDir.x, y: track.startPosition.y - 170 * noseDir.y - 30 * rightDir.y }, angle: track.startAngle }, targetWaypointIndex: 0, difficulty: state.difficulty, aggression: 0.5, reactionDelay: 0, rubberBanding: 0.5 },
        ]
      } else if (action.mode === GameMode.MegaGrid) {
        // Massive 15 AI grid lineup (16 cars total)
        const aiColors: CarColor[] = ['blue', 'silver', 'gold', 'purple', 'green', 'pink', 'cyan', 'yellow', 'white', 'black', 'orange', 'blue', 'silver', 'gold', 'purple']
        for (let i = 0; i < 15; i++) {
          const rowIdx = Math.floor(i / 2) + 1
          const colSign = i % 2 === 0 ? -1 : 1
          const pos = {
            x: track.startPosition.x - (rowIdx * 90) * noseDir.x + (colSign * 32) * rightDir.x,
            y: track.startPosition.y - (rowIdx * 90) * noseDir.y + (colSign * 32) * rightDir.y
          }
          aiDriversList.push({
            car: { ...createInitialCar(`ai${i + 1}`, false, aiColors[i]), position: pos, angle: track.startAngle },
            targetWaypointIndex: 0,
            difficulty: state.difficulty,
            aggression: 0.4 + (i % 3) * 0.12,
            reactionDelay: 0,
            rubberBanding: 0.45 + (i % 3) * 0.08
          })
        }
      }

      return {
        ...state,
        status: GameStatus.Countdown,
        mode: action.mode,
        countdownValue: 3,
        raceTime: 0,
        player: { ...createInitialCar('player', true, state.selectedColor), position: { ...track.startPosition }, angle: track.startAngle },
        aiDrivers: aiDriversList,
        powerUps: action.mode === GameMode.CarFights ? [
          { id: 'repair1', x: 10 * 64 + 32, y: 5 * 64 + 32, type: 'health', active: true, respawnTimer: 0 },
          { id: 'repair2', x: 32 * 64 + 32, y: 13 * 64 + 32, type: 'health', active: true, respawnTimer: 0 },
          { id: 'nitro1', x: 10 * 64 + 32, y: 13 * 64 + 32, type: 'nitro', active: true, respawnTimer: 0 },
          { id: 'nitro2', x: 32 * 64 + 32, y: 5 * 64 + 32, type: 'nitro', active: true, respawnTimer: 0 },
        ] : []
      }
    }
    case 'TICK_COUNTDOWN':
      if (state.countdownValue > 0) {
        return { ...state, countdownValue: state.countdownValue - 1 }
      }
      return { ...state, status: GameStatus.Racing }
    case 'PAUSE_TOGGLE':
      return { 
        ...state, 
        status: state.status === GameStatus.Paused ? GameStatus.Racing : GameStatus.Paused 
      }
    case 'UPDATE_PHYSICS':
      const newToastTimer = Math.max(0, state.toastTimer - action.delta)
      return {
        ...state,
        raceTime: state.raceTime + action.delta,
        frameCount: state.frameCount + 1,
        toastTimer: newToastTimer,
        toastMessage: newToastTimer === 0 ? null : state.toastMessage
      }
    case 'SHOW_TOAST':
      return { ...state, toastMessage: action.message, toastTimer: 2.0 }
    case 'TOGGLE_DAY':
      return { ...state, isNight: !state.isNight, currentDayTime: state.isNight ? 0.5 : 0.9 }
    case 'TOGGLE_RAIN':
      return { ...state, isRaining: !state.isRaining }
    case 'RACE_FINISHED': {
      const allCars = [state.player, ...state.aiDrivers.map(ai => ai.car)]
      const sorted = [...allCars].sort((a, b) => {
        if (a.lap !== b.lap) return b.lap - a.lap
        return b.checkpointsPassed.length - a.checkpointsPassed.length
      })
      const playerPos = sorted.findIndex(c => c.id === 'player') + 1

      if (state.player.bestLapTime !== null) {
        const prevBest = loadBestLap(state.mode.toString())
        if (prevBest === null || state.player.bestLapTime < prevBest) {
          saveBestLap(state.mode.toString(), state.player.bestLapTime)
        }
      }

      const newResult = {
        position: playerPos,
        playerName: state.settings.playerName || 'PLAYER 1',
        totalTime: state.raceTime,
        bestLap: state.player.bestLapTime || 0,
        lapsCompleted: Math.min(state.totalLaps, state.player.lap - 1),
        mode: state.mode,
        date: new Date().toLocaleDateString()
      }
      
      const currentLeaderboard = loadLeaderboard()
      const updatedLeaderboard = [...currentLeaderboard, newResult]
        .sort((a, b) => a.totalTime - b.totalTime)
        .slice(0, 10)

      saveLeaderboard(updatedLeaderboard)

      return { 
        ...state, 
        status: GameStatus.RaceFinished, 
        leaderboard: updatedLeaderboard 
      }
    }
    case 'RESET_RACE':
      return gameReducer(state, { type: 'START_RACE', mode: state.mode })
    case 'SET_COLOR':
      return { ...state, selectedColor: action.color }
    case 'SET_TRACK':
      return { ...state, selectedTrack: action.trackIndex }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty }
    case 'SET_FPS':
      return { ...state, fps: action.fps }
    case 'GO_TO_MENU':
      return { ...state, status: GameStatus.MainMenu }
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.settings }
      saveSettings(newSettings)
      return { ...state, settings: newSettings }
    }
    case 'SET_STATUS':
      return { ...state, status: action.status }
    default:
      return state
  }
}

const StateContext = createContext<GameState>(initialState)
const DispatchContext = createContext<React.Dispatch<GameAction>>(() => null)

export const useGameState = () => useContext(StateContext)
export const useGameDispatch = () => useContext(DispatchContext)

const App: React.FC = () => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <div className="w-full h-screen bg-black overflow-hidden relative font-racing">
          <MessageToast />
          {state.status === GameStatus.MainMenu && <StartMenu />}
          {state.status === GameStatus.Settings && <SettingsPanel />}
          {state.status === GameStatus.Leaderboard && <LeaderboardModal />}
          {(state.status === GameStatus.Racing || 
            state.status === GameStatus.Countdown || 
            state.status === GameStatus.Paused ||
            state.status === GameStatus.RaceFinished) && <GameCanvas />}
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
