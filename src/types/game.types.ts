// Core math types
export interface Vector2D { x: number; y: number }
export interface Rect { x: number; y: number; width: number; height: number }
export interface Transform { position: Vector2D; angle: number }

// Tile system
export enum TileType {
  Road       = 0,
  Grass      = 1,
  Gravel     = 2,
  Wall       = 3,
  StartLine  = 4,
  Checkpoint = 5,
  PitLane    = 6,
  RumbleStrip = 7,
}

export interface Tile {
  type: TileType
  variant?: number   // for visual variation within same type
  rotation?: number  // 0 | 90 | 180 | 270 for road direction markings
}

// Car types
export enum CarState { Idle, Accelerating, Braking, Drifting, Crashed, Finished }
export type CarColor = 'red' | 'blue' | 'silver' | 'gold' | 'purple' | 'green'

export interface Car {
  id: string
  position: Vector2D
  velocity: Vector2D
  angle: number              // radians
  angularVelocity: number
  speed: number              // current speed in canvas units/sec
  maxSpeed: number
  acceleration: number
  brakeForce: number
  grip: number               // 0.0 – 1.0, lower = more drift
  nitro: number              // 0.0 – 1.0
  nitroActive: boolean
  state: CarState
  lap: number
  checkpointsPassed: number[]
  lapTimes: number[]
  bestLapTime: number | null
  totalRaceTime: number
  color: CarColor
  isPlayer: boolean
  lastValidPosition: Vector2D
  damageLevel: number        // 0.0 – 1.0
  screenShake: number        // remaining shake frames
  driftAngle: number         // current tire slip angle
  wheelRotation: number      // for animated wheels
  exhaustTimer: number
  collisionRadius: number
}

// AI-specific
export interface AIDriver {
  car: Car
  targetWaypointIndex: number
  difficulty: AIDifficulty
  aggression: number         // 0.0 – 1.0
  reactionDelay: number      // frames of delay
  rubberBanding: number      // 0.0 – 1.0 catch-up factor
}

export enum AIDifficulty { Easy = 0, Medium = 1, Hard = 2 }

// Particle types
export enum ParticleType {
  SkidMark, DriftSmoke, DustCloud, NitroFlame,
  Spark, RainSplash, Confetti, ExhaustSmoke, LensFlare
}

export interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number               // 0.0 – 1.0 (1 = brand new, 0 = dead)
  maxLife: number            // seconds
  size: number
  color: string
  alpha: number
  type: ParticleType
  rotation?: number
  rotationSpeed?: number
  scaleX?: number
  scaleY?: number
  attached?: boolean         // skid marks are world-space and don't fade until limit
}

// Camera
export interface Camera {
  x: number; y: number
  zoom: number
  targetZoom: number
  shakeIntensity: number
  shakeDecay: number
}

// Race / game state
export enum GameStatus {
  MainMenu, CarSelect, Countdown, Racing,
  Paused, RaceFinished, GameOver, Settings, Leaderboard
}

export enum GameMode { TimeTrial, AIRace, FreeRoam }

export interface RaceResult {
  position: number
  playerName: string
  totalTime: number
  bestLap: number
  lapsCompleted: number
  mode: GameMode
  date: string
}

export interface GameSettings {
  sfxVolume: number         // 0 – 1
  musicVolume: number       // 0 – 1
  showMinimap: boolean
  showFPS: boolean
  weatherEffect: 'none' | 'rain'
  graphicsQuality: 'low' | 'medium' | 'high'
  dayNightCycle: boolean
  screenShake: boolean
  playerName: string
}

// Global game state (used with useReducer)
export interface GameState {
  status: GameStatus
  mode: GameMode
  player: Car
  aiDrivers: AIDriver[]
  particles: Particle[]
  skidMarks: Particle[]        // persistent, separate from live particles
  camera: Camera
  raceTime: number
  countdownValue: number       // 3, 2, 1, 0 = GO!
  totalLaps: number
  currentDayTime: number       // 0.0 = midnight, 0.5 = noon, 1.0 = midnight
  isNight: boolean
  isRaining: boolean
  settings: GameSettings
  leaderboard: RaceResult[]
  toastMessage: string | null
  toastTimer: number
  frameCount: number
  fps: number
  difficulty: AIDifficulty
  selectedColor: CarColor
}
