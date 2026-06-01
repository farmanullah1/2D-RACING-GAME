import { AIDifficulty, CarColor, GameMode, GameSettings, GameStatus } from "./game.types"

export type GameAction =
  | { type: 'START_RACE'; mode: GameMode }
  | { type: 'PAUSE_TOGGLE' }
  | { type: 'GO_TO_MENU' }
  | { type: 'UPDATE_PHYSICS'; delta: number }
  | { type: 'UPDATE_PARTICLES'; delta: number }
  | { type: 'UPDATE_AI'; delta: number }
  | { type: 'TICK_COUNTDOWN' }
  | { type: 'RACE_FINISHED' }
  | { type: 'SET_COLOR'; color: CarColor }
  | { type: 'SET_TRACK'; trackIndex: number }
  | { type: 'SET_DIFFICULTY'; difficulty: AIDifficulty }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'TOGGLE_DAY' }
  | { type: 'TOGGLE_RAIN' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_RACE' }
  | { type: 'SET_FPS'; fps: number }
  | { type: 'SET_STATUS'; status: GameStatus }
