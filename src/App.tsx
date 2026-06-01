import React, { useReducer, createContext, useContext, useMemo } from 'react'
import { GameState, GameStatus, GameMode, AIDifficulty, CarState } from './types/game.types'
import { GameAction } from './types/events.types'
import { START_POSITION, START_ANGLE } from './data/trackLayout'
import { PLAYER_MAX_SPEED, PLAYER_ACCELERATION, PLAYER_BRAKE_FORCE, TOTAL_LAPS } from './constants/gameConstants'
import GameCanvas from './components/GameCanvas'

const createInitialCar = (id: string, isPlayer: boolean, color: any): any => ({
  id,
  position: { ...START_POSITION },
  velocity: { x: 0, y: 0 },
  angle: START_ANGLE,
  angularVelocity: 0,
  speed: 0,
  maxSpeed: PLAYER_MAX_SPEED,
  acceleration: PLAYER_ACCELERATION,
  brakeForce: PLAYER_BRAKE_FORCE,
  grip: 1,
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
})

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
  selectedColor: 'red'
}

import StartMenu from './components/Menus/StartMenu'
import MessageToast from './components/UI/MessageToast'

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_RACE':
      return {
        ...state,
        status: GameStatus.Countdown,
        mode: action.mode,
        countdownValue: 3,
        raceTime: 0,
        player: createInitialCar('player', true, state.selectedColor),
        aiDrivers: action.mode === GameMode.AIRace ? [
          { car: createInitialCar('ai1', false, 'blue'), targetWaypointIndex: 0, difficulty: state.difficulty, aggression: 0.5, reactionDelay: 0, rubberBanding: 0.5 },
          { car: createInitialCar('ai2', false, 'silver'), targetWaypointIndex: 0, difficulty: state.difficulty, aggression: 0.5, reactionDelay: 0, rubberBanding: 0.5 },
          { car: createInitialCar('ai3', false, 'gold'), targetWaypointIndex: 0, difficulty: state.difficulty, aggression: 0.5, reactionDelay: 0, rubberBanding: 0.5 },
        ] : []
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
    case 'RACE_FINISHED':
      return { ...state, status: GameStatus.RaceFinished }
    case 'RESET_RACE':
      return gameReducer(state, { type: 'START_RACE', mode: state.mode })
    case 'SET_COLOR':
      return { ...state, selectedColor: action.color }
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty }
    case 'SET_FPS':
      return { ...state, fps: action.fps }
    case 'GO_TO_MENU':
      return { ...state, status: GameStatus.MainMenu }
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
          {(state.status === GameStatus.Racing || 
            state.status === GameStatus.Countdown || 
            state.status === GameStatus.Paused) && <GameCanvas />}
        </div>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
