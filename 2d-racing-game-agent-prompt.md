# 🏎️ Agent Build Prompt: Professional 2D Top-Down Car Racing Game
### A Complete, Step-by-Step Instruction Manual for an AI Coding Agent

---

> **HOW TO USE THIS FILE**
> This document is divided into **10 sequential sub-prompts**. Execute them one at a time, in order. Do not proceed to the next sub-prompt until the current one is fully working, tested, and verified. Each sub-prompt builds on the previous one. The final result should be a production-ready, portfolio-quality 2D racing game web application.

---

## 🗺️ Project Overview

Build a **professional, production-ready, web-based 2D top-down car racing game** as a **React 18 + TypeScript + Tailwind CSS + Vite** application. All game graphics are drawn entirely via the **HTML5 Canvas API** — no external image assets, no game engines (no Phaser, no PixiJS). Everything is hand-crafted code.

The final product must be visually stunning, performant at 60 FPS, and suitable as a **senior developer portfolio showcase**.

---

## 📁 Final Target Folder Structure

Before beginning, understand the architecture you are building toward:

```
/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── index.css
    ├── constants/
    │   ├── gameConstants.ts
    │   └── graphicsConstants.ts
    ├── types/
    │   ├── game.types.ts
    │   └── events.types.ts
    ├── utils/
    │   ├── mathUtils.ts
    │   ├── canvasUtils.ts
    │   └── localStorageUtils.ts
    ├── data/
    │   ├── trackLayout.ts
    │   ├── waypoints.ts
    │   └── tilesets.ts
    ├── engines/
    │   ├── PhysicsEngine.ts
    │   ├── RenderEngine.ts
    │   ├── ParticleEngine.ts
    │   ├── AIEngine.ts
    │   └── CollisionEngine.ts
    ├── hooks/
    │   ├── useGameLoop.ts
    │   ├── useKeyboardControls.ts
    │   ├── useCollisionDetection.ts
    │   ├── useParticleSystem.ts
    │   ├── useCamera.ts
    │   └── useAudio.ts
    └── components/
        ├── GameCanvas.tsx
        ├── HUD/
        │   ├── Speedometer.tsx
        │   ├── LapTimer.tsx
        │   ├── NitroMeter.tsx
        │   ├── MiniMap.tsx
        │   └── PositionDisplay.tsx
        ├── Menus/
        │   ├── StartMenu.tsx
        │   ├── PauseMenu.tsx
        │   ├── RaceFinishedScreen.tsx
        │   └── SettingsPanel.tsx
        └── UI/
            ├── CountdownOverlay.tsx
            ├── MessageToast.tsx
            └── LeaderboardModal.tsx
```

---

---

# SUB-PROMPT 1 — Project Scaffolding & Foundation

## Goal
Set up the complete project structure, all config files, all type definitions, all constants, and all utility files. No game logic yet — just the foundation.

## Instructions

### 1.1 — Initialize Project

Create a new Vite + React + TypeScript project. Install these exact dependencies:

**Dependencies:**
```
react react-dom
```

**Dev Dependencies:**
```
typescript @types/react @types/react-dom
vite @vitejs/plugin-react
tailwindcss postcss autoprefixer
```

**`vite.config.ts`:**
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
```

**`tailwind.config.ts`:**
```ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        racing: ['Rajdhani', 'Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neon: {
          blue:   '#00f5ff',
          green:  '#00ff88',
          orange: '#ff6b00',
          pink:   '#ff006e',
          yellow: '#ffee00',
        },
        track: {
          asphalt:  '#1a1a2e',
          grass:    '#1a4731',
          gravel:   '#6b5a3e',
          wall:     '#2c2c3e',
          panel:    'rgba(10,10,20,0.85)',
        }
      },
      animation: {
        'pulse-fast': 'pulse 0.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'slide-up':   'slideUp 0.4s ease-out',
        'fade-in':    'fadeIn 0.3s ease-out',
        'glow':       'glow 1.5s ease-in-out infinite alternate',
        'shake':      'shake 0.2s ease-in-out',
        'count-down': 'scaleDown 0.8s ease-out forwards',
      },
      keyframes: {
        slideUp:   { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        glow:      { from: { textShadow: '0 0 5px currentColor' }, to: { textShadow: '0 0 20px currentColor, 0 0 40px currentColor' } },
        shake:     { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-4px)' }, '75%': { transform: 'translateX(4px)' } },
        scaleDown: { '0%': { transform: 'scale(1.5)', opacity: '1' }, '100%': { transform: 'scale(0.5)', opacity: '0' } },
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        neon:       '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px #00f5ff',
        'neon-green': '0 0 10px #00ff88, 0 0 20px #00ff88',
        'neon-orange': '0 0 10px #ff6b00, 0 0 20px #ff6b00',
        panel:      '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
} satisfies Config
```

**`index.html`:**  
Import Google Fonts: `Orbitron`, `Rajdhani`, and `JetBrains Mono` via `<link>` in `<head>`. Add `<meta name="theme-color" content="#0a0a14">`. Set `<title>VelocityX — 2D Racing</title>`.

**`src/index.css`:**  
Import Tailwind directives. Add a global CSS reset. Set `body` background to `#0a0a14`. Define a custom scrollbar with a dark theme. Add a `.canvas-container` class that preserves aspect ratio with `position: relative`.

---

### 1.2 — Type Definitions

**`src/types/game.types.ts`** — Define ALL of these interfaces and enums (strict TypeScript, no `any`):

```ts
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
```

**`src/types/events.types.ts`** — Define all game action types for the reducer:
```ts
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
  | { type: 'SET_DIFFICULTY'; difficulty: AIDifficulty }
  | { type: 'SHOW_TOAST'; message: string }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'RESET_RACE' }
  | { type: 'SET_FPS'; fps: number }
```

---

### 1.3 — Constants

**`src/constants/gameConstants.ts`:**
```ts
export const TILE_SIZE          = 64        // px per tile
export const GRID_WIDTH         = 44        // tiles wide
export const GRID_HEIGHT        = 44        // tiles tall
export const WORLD_WIDTH        = GRID_WIDTH  * TILE_SIZE
export const WORLD_HEIGHT       = GRID_HEIGHT * TILE_SIZE

export const TARGET_FPS         = 60
export const FIXED_TIMESTEP     = 1 / TARGET_FPS

export const PLAYER_MAX_SPEED   = 420       // canvas units/sec (~250 km/h scaled)
export const PLAYER_ACCELERATION = 280
export const PLAYER_BRAKE_FORCE = 520
export const PLAYER_TURN_SPEED  = 2.8       // radians/sec
export const PLAYER_MASS        = 1000      // kg (simulated)

export const FRICTION_ROAD      = 0.96
export const FRICTION_GRASS     = 0.80
export const FRICTION_GRAVEL    = 0.70
export const FRICTION_PIT       = 0.92

export const NITRO_SPEED_MULTIPLIER = 1.55
export const NITRO_DRAIN_RATE   = 0.45     // per second
export const NITRO_REFILL_RATE  = 0.07     // per second
export const NITRO_DRIFT_BONUS  = 0.15     // per drift-second

export const DRIFT_THRESHOLD    = 0.65     // steering angle that triggers drift
export const DRIFT_GRIP_FACTOR  = 0.35

export const COLLISION_BOUNCE   = 0.45
export const WALL_PUSHBACK      = 3.0

export const TOTAL_LAPS         = 3
export const NUM_AI_OPPONENTS   = 3
export const STARTING_GRID_SPACING = 90   // px between cars on grid

export const PARTICLE_MAX       = 600
export const SKID_MARK_MAX      = 300
export const SKID_MARK_LIFETIME = 18      // seconds

export const DAY_CYCLE_DURATION = 60      // seconds for full cycle

export const AI_WAYPOINT_RADIUS = 50      // px, how close AI must get to waypoint
export const AI_SPEEDS = {
  [0]: 0.72,  // Easy
  [1]: 0.88,  // Medium
  [2]: 1.00,  // Hard
}
```

**`src/constants/graphicsConstants.ts`:**
```ts
export const CAR_WIDTH          = 28
export const CAR_HEIGHT         = 50
export const CAR_COLLISION_RADIUS = 22

export const SHADOW_BLUR        = 14
export const SHADOW_OPACITY     = 0.5
export const SHADOW_OFFSET_X    = 4
export const SHADOW_OFFSET_Y    = 6

export const HEADLIGHT_LENGTH   = 120
export const HEADLIGHT_ANGLE    = 0.42   // radians half-angle

export const VIGNETTE_STRENGTH  = 0.45
export const MOTION_BLUR_ALPHA  = 0.25   // trail alpha for speed blur

export const MINIMAP_SIZE       = 160    // px
export const MINIMAP_SCALE      = 0.045  // world-to-minimap scale factor

export const COLORS = {
  carRed:    { body: '#e63946', accent: '#c1121f', rim: '#f1faee' },
  carBlue:   { body: '#1e6091', accent: '#023e8a', rim: '#90e0ef' },
  carSilver: { body: '#adb5bd', accent: '#6c757d', rim: '#dee2e6' },
  carGold:   { body: '#e9c46a', accent: '#f4a261', rim: '#f1faee' },
  carPurple: { body: '#7b2d8b', accent: '#560bad', rim: '#c77dff' },
  carGreen:  { body: '#2d6a4f', accent: '#1b4332', rim: '#95d5b2' },

  roadDark:   '#1a1a2e',
  roadLight:  '#252540',
  laneMarkWhite: '#e8e8e8',
  laneMarkYellow: '#f4d03f',
  grassDark:  '#1a3a2a',
  grassLight: '#1e5233',
  gravelDark: '#4a3728',
  gravelLight: '#6b5a3e',
  wallColor:  '#2c2c54',
  barrierRed: '#c0392b',
  barrierWhite: '#ecf0f1',
  curb1:      '#e74c3c',
  curb2:      '#f8f9fa',

  sky: {
    day:     ['#87ceeb', '#4a90d9'],
    dusk:    ['#ff7043', '#e91e63'],
    night:   ['#0d1b2a', '#1a1a3e'],
  },

  nitroFlame: ['#ff6b00', '#ff9f1c', '#ffee32', '#00f5ff'],
  spark:      ['#fff176', '#ffca28', '#ff8f00'],
  smoke:      'rgba(180,180,180,',
  dust:       'rgba(180,140,80,',
  confetti:   ['#00f5ff', '#ff006e', '#ffee00', '#00ff88', '#ff6b00'],
}
```

---

### 1.4 — Utility Files

**`src/utils/mathUtils.ts`** — Implement all of these:
- `lerp(a, b, t)` — linear interpolation
- `clamp(value, min, max)`
- `angleDiff(a, b)` — shortest angular difference
- `normalizeAngle(a)` — clamp to [-π, π]
- `vecAdd(a, b)`, `vecSub(a, b)`, `vecScale(v, s)`, `vecMag(v)`, `vecNorm(v)`, `vecDot(a, b)`
- `vecRotate(v, angle)` — rotate vector by angle
- `vecDist(a, b)` — distance between two Vector2Ds
- `smoothstep(edge0, edge1, x)` — smooth interpolation
- `lerpAngle(a, b, t)` — lerp that handles angle wrapping correctly
- `randomRange(min, max)`, `randomInt(min, max)`
- `randomSign()` — returns -1 or 1
- `worldToTile(worldX, worldY, tileSize)` — returns `{ col, row }`
- `tileToWorld(col, row, tileSize)` — returns center world position

**`src/utils/canvasUtils.ts`** — Implement all of these:
- `roundedRect(ctx, x, y, w, h, r)` — draw rounded rectangle path
- `drawShadow(ctx, fn, blur, color, offsetX, offsetY)` — wrapper that sets shadow props, calls fn, resets
- `drawGlow(ctx, fn, blur, color)` — wrapper using `globalCompositeOperation = 'lighter'`
- `createRadialGrad(ctx, cx, cy, r0, r1, stops)` — helper for radial gradients
- `createLinearGrad(ctx, x0, y0, x1, y1, stops)` — helper for linear gradients
- `applyVignette(ctx, width, height, strength)` — draws a full-screen vignette overlay
- `drawDashedLine(ctx, x1, y1, x2, y2, dashLen, gapLen)` — draw dashed line
- `clearCanvas(ctx, width, height)` — `clearRect` with no prior fills
- `saveRestore(ctx, fn)` — wraps `ctx.save()`, calls `fn`, `ctx.restore()`

**`src/utils/localStorageUtils.ts`** — Implement:
- `saveLeaderboard(results: RaceResult[])` — JSON.stringify to `'velocityx_leaderboard'`
- `loadLeaderboard(): RaceResult[]` — parse with fallback to `[]`
- `saveBestLap(mode: string, time: number)` — per-mode best lap
- `loadBestLap(mode: string): number | null`
- `saveSettings(settings: GameSettings)`
- `loadSettings(): GameSettings` — with defaults fallback
- `clearAllData()`

---

### 1.5 — Verification Checklist for Sub-Prompt 1
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts the dev server at `localhost:5173` (may show blank or placeholder screen — that is OK)
- [ ] `npm run build` completes with zero TypeScript errors
- [ ] All files exist in the correct folder structure
- [ ] No `any` types, no `@ts-ignore`

---

---

# SUB-PROMPT 2 — Track Data, Tileset Renderer & Static Map

## Goal
Define the full 44×44 track tilemap, implement the tileset draw functions, and render the complete static track to an offscreen canvas.

## Instructions

### 2.1 — Track Layout Data

**`src/data/trackLayout.ts`** — Define a `TRACK_GRID: number[][]` (44 rows × 44 cols).

The track must be a **full circuit** — a closed loop with:
- Two long straight sections (one horizontal, one vertical)
- Four sweeping curves at corners
- Two chicanes (S-bends) in the middle of the straights
- A start/finish line (TileType 4) at the middle of the top straight
- 5 checkpoint tiles (TileType 5) evenly distributed around the circuit (required for valid lap detection)
- Gravel trap tiles (TileType 2) on the outside of corners
- Rumble strip tiles (TileType 7) between gravel and road at corners
- Wall tiles (TileType 3) at the very outer and inner edges
- Grass tiles (TileType 1) filling all non-road areas
- Pit lane (TileType 6) on one straight side (optional but desired)
- The track should be 3–4 tiles wide on straights and 4–5 tiles wide on corners

Design the layout as a real racing circuit. Think of it as: from above, the road winds around a complex rectangular island. The car path should be 2560+ canvas pixels long when traced at tile centers.

Export also:
```ts
export const CHECKPOINTS: number[] = [1, 2, 3, 4, 5]  // checkpoint tile IDs the player must pass
export const START_POSITION: Vector2D = { x: ..., y: ... }  // center of start/finish tile in world coords
export const START_ANGLE: number = 0  // radians, direction car faces on grid
```

### 2.2 — Waypoints Data

**`src/data/waypoints.ts`** — Export an array of `Vector2D` points tracing the **track centerline** at roughly 96px intervals. These are the pathfinding nodes for AI. There should be **at least 60 waypoints** that form a complete loop.

```ts
export const WAYPOINTS: Vector2D[] = [
  { x: ..., y: ... },
  // ... at least 60 entries, evenly spaced along track center
]
```

### 2.3 — Tile Render Functions

**`src/data/tilesets.ts`** — Implement `drawTile(ctx: CanvasRenderingContext2D, tileType: TileType, col: number, row: number, variant: number, rotation: number): void`

Requirements per tile type:

**Road (0):**
- Dark asphalt gradient (`#1a1a2e` → `#252540`)
- Random micro-noise pattern (use `variant` seed to vary slightly)
- On every 4th tile: subtle lane marking dots (white, 4×2px)

**Grass (1):**
- Deep green gradient with a darker fringe at edges
- Subtle cross-hatch texture using semi-transparent thin lines
- Occasional darker patch on some variants

**Gravel (2):**
- Sandy brown base
- Draw 8–12 small irregular pebble shapes per tile (circles/ovals, `#8b7355` / `#6b5a3e`)
- Slight vignette edge darkening

**Wall (3):**
- Dark blue-grey base (`#2c2c54`)
- Concrete block outlines every 32px (lighter stroke)
- Top-edge highlight to suggest 3D raised barrier

**StartLine (4):**
- Base road tile underneath
- Alternating black/white checkerboard pattern (8×8 px squares)
- "START / FINISH" text in a small bold white font

**Checkpoint (5):**
- Road tile underneath
- Translucent cyan stripe across the full tile width
- Dashed edge lines in neon cyan

**PitLane (6):**
- Lighter asphalt (`#2a2a4a`)
- Speed limit line markings in white
- "PIT" text on the tile center

**RumbleStrip (7):**
- Alternating red/white diagonal stripes (45° angle, 8px stripe width)
- Slight roughness texture on the red sections

Also implement:
- `drawTrackDecorations(ctx, col, row)` — adds trackside elements: every 8 tiles along outer wall, draw either a tire stack (3 stacked black circles), a sponsor billboard (rect with gradient), or a cone (orange triangle). Use `(col + row) % 3` to choose which.
- `buildOffscreenTrack(grid: number[][]): HTMLCanvasElement` — renders the entire 44×44 grid to an offscreen canvas and returns it. This is cached and only rendered once.

### 2.4 — Verification Checklist for Sub-Prompt 2
- [ ] Track tilemap is a complete closed circuit
- [ ] Offscreen canvas renders the full map without blank tiles
- [ ] Waypoints form a complete loop that stays on road tiles
- [ ] Checkpoints are evenly distributed around the full circuit
- [ ] No TypeScript errors

---

---

# SUB-PROMPT 3 — Physics Engine & Player Car

## Goal
Implement the complete car physics model including steering, acceleration, braking, drift, nitro, and tile-based friction.

## Instructions

### 3.1 — PhysicsEngine

**`src/engines/PhysicsEngine.ts`** — Export a class `PhysicsEngine` with:

```ts
class PhysicsEngine {
  updateCar(car: Car, input: CarInput, delta: number, currentTile: TileType): void
  applyFriction(car: Car, frictionCoeff: number, delta: number): void
  applyDrift(car: Car, input: CarInput, delta: number): void
  applyNitro(car: Car, delta: number): void
  resolveWallCollision(car: Car, grid: number[][]): void
  resolveCarCollision(carA: Car, carB: Car): void
  getSpeedKmh(car: Car): number
  isOnTrack(car: Car, grid: number[][]): boolean
  getCurrentTile(car: Car, grid: number[][]): TileType
}
```

**`CarInput` interface:**
```ts
interface CarInput {
  accelerate: boolean
  brake: boolean
  steerLeft: boolean
  steerRight: boolean
  nitro: boolean
}
```

**Physics model (implement exactly):**

1. **Steering:** `car.angularVelocity = turnSpeed * steerInput * (1 - speedFactor * 0.6)` where `speedFactor = car.speed / car.maxSpeed`. At high speed, turning radius widens naturally.

2. **Acceleration:** Apply force as `velocity += direction * acceleration * delta` where direction is `{ x: cos(angle), y: sin(angle) }`. Cap at maxSpeed (or `maxSpeed * NITRO_SPEED_MULTIPLIER` if nitro active).

3. **Braking:** Subtract from velocity magnitude: `speed = max(0, speed - brakeForce * delta)`.

4. **Reverse:** Allow negative speed up to 20% of maxSpeed.

5. **Friction:** `velocity *= frictionCoeff^delta` — different coefficients per tile type (see constants).

6. **Drift model:**
   - Calculate tire slip angle: `slipAngle = angleDiff(atan2(vy, vx), angle)`
   - If `abs(slipAngle) > DRIFT_THRESHOLD` AND `(brake OR steerInput > 0.5)`:
     - Set `car.state = CarState.Drifting`
     - Reduce grip: blend velocity direction toward car's nose direction using `DRIFT_GRIP_FACTOR`
     - Add `angularVelocity` proportional to slip angle (countersteering effect)
     - Increment `car.nitro += NITRO_DRIFT_BONUS * delta`

7. **Nitro:**
   - When active: speed bonus, spawn flame particles
   - Drain at `NITRO_DRAIN_RATE` per second
   - Passive refill at `NITRO_REFILL_RATE` per second
   - Clamp between 0 and 1

8. **Wall collision:**
   - Convert car position to tile coordinates
   - Check the 4 surrounding tiles
   - If any are `TileType.Wall`: push car back to `lastValidPosition`, reverse velocity component into wall with `COLLISION_BOUNCE` factor
   - If on `TileType.Grass` or `TileType.Gravel`: reduce velocity by tile friction, spawn dust particles

9. **Car–car collision (elastic):**
   - Detect via `vecDist < CAR_COLLISION_RADIUS * 2`
   - Calculate collision normal and apply impulse:
     ```
     relativeVel = velA - velB
     impulse = dot(relativeVel, normal) * COLLISION_BOUNCE
     velA -= normal * impulse
     velB += normal * impulse
     ```
   - Trigger `car.screenShake = 8` on both cars
   - Emit sparks at collision point

### 3.2 — Keyboard Controls Hook

**`src/hooks/useKeyboardControls.ts`:**
```ts
const useKeyboardControls = (): CarInput => { ... }
```
- Track `keydown` / `keyup` events using a `Set<string>`
- Map: `ArrowUp / W` → accelerate, `ArrowDown / S` → brake, `ArrowLeft / A` → steerLeft, `ArrowRight / D` → steerRight, `Space` → nitro
- Also expose: `isPaused (P)`, `respawn (R)`, `toggleDay (T)`, `toggleWeather (Y)`
- Use `event.preventDefault()` on all game keys to prevent page scrolling
- Clean up listeners on unmount

### 3.3 — Verification Checklist for Sub-Prompt 3
- [ ] Car accelerates, brakes, steers smoothly
- [ ] Drift state activates with correct slip angle calculation
- [ ] Nitro drains and refills correctly
- [ ] Car pushes back from walls
- [ ] Car-to-car collision doesn't cause cars to overlap
- [ ] Speed correctly decreases on grass and gravel tiles

---

---

# SUB-PROMPT 4 — Particle System & Visual Effects Engine

## Goal
Build the complete particle system: skid marks, smoke, sparks, nitro flames, dust, confetti, and exhaust.

## Instructions

### 4.1 — ParticleEngine

**`src/engines/ParticleEngine.ts`** — Export a class `ParticleEngine`:

```ts
class ParticleEngine {
  private pool: Particle[]       // reuse dead particles (object pooling)
  private skidMarks: Particle[]  // persistent skid marks

  emit(type: ParticleType, options: EmitOptions): void
  update(particles: Particle[], delta: number): Particle[]
  updateSkidMarks(car: Car, delta: number): void
  getSkidMarks(): Particle[]
  drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void
  drawAllParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void
  drawSkidMarks(ctx: CanvasRenderingContext2D): void
}
```

**`EmitOptions`:**
```ts
interface EmitOptions {
  x: number; y: number
  count: number
  angle?: number          // emission direction
  spread?: number         // cone spread in radians
  speedMin?: number
  speedMax?: number
  lifeMin?: number
  lifeMax?: number
  sizeMin?: number
  sizeMax?: number
  color?: string
  gravity?: number
  fadeOut?: boolean
}
```

**Particle behavior per type:**

| Type | Count | Life | Visual | Behavior |
|------|-------|------|--------|----------|
| `SkidMark` | 2/frame while drifting | 18s | Dark oval mark (16×6px), near-zero alpha fade | Persistent, world-space, no movement |
| `DriftSmoke` | 8/frame while drifting | 1.2s | White/grey circle, 20–40px | Rises upward (+y bias), fades alpha |
| `DustCloud` | 6/frame on grass/gravel | 0.8s | Brown cloud circle, 15–30px | Slow radial spread, fade |
| `NitroFlame` | 12/frame when nitro active | 0.3s | Orange→blue elongated oval | Shoots backward from exhaust, shrinks |
| `Spark` | 20 on collision | 0.4s | Yellow/white pixel-sized dot | Fast radial burst with gravity |
| `RainSplash` | 4/frame anywhere (if rain) | 0.25s | Cyan ring, 4–10px | Expands and fades |
| `Confetti` | 60 burst on finish | 2.5s | Colored rectangles (6×3px) | Arcs upward with gravity, rotates |
| `ExhaustSmoke` | 3/frame while accelerating | 0.6s | Very small dark grey circle, 4–10px | Shoots backward slightly |

**Skid mark system:**
- On every frame where `car.state === CarState.Drifting` OR `car.speed > 200 AND braking`:
  - Place two skid marks (one per rear tire) at the rear wheels' world positions
  - Rear-left: `position + rotate({x: -8, y: 18}, car.angle)`
  - Rear-right: `position + rotate({x: 8, y: 18}, car.angle)`
  - Each mark is a small rotated ellipse matching the car's heading
  - Cap at `SKID_MARK_MAX`; remove oldest when over limit
  - Marks start at alpha 0.7 and decrease to 0 over `SKID_MARK_LIFETIME` seconds

**Object pooling:**
- Pre-allocate a pool of 600 `Particle` objects
- When emitting: find the first `life <= 0` particle and reinitialize it
- Never `push()` new objects after init; always reuse

### 4.2 — Verification Checklist for Sub-Prompt 4
- [ ] Skid marks appear when drifting and persist for 18 seconds
- [ ] No more than 600 live particles at once
- [ ] Nitro flames appear behind the car during boost
- [ ] Confetti burst triggers on race finish
- [ ] No memory allocation spikes (pool is reused, not reallocated)

---

---

# SUB-PROMPT 5 — AI Engine & Camera System

## Goal
Implement AI drivers that follow waypoints, avoid obstacles, and race competitively. Also implement the smooth follow camera.

## Instructions

### 5.1 — AIEngine

**`src/engines/AIEngine.ts`** — Export a class `AIEngine`:

```ts
class AIEngine {
  updateDriver(ai: AIDriver, allCars: Car[], delta: number, grid: number[][]): CarInput
  getTargetWaypoint(ai: AIDriver): Vector2D
  steerTowardTarget(ai: AIDriver, target: Vector2D): number  // returns -1 to 1
  shouldBrake(ai: AIDriver, target: Vector2D): boolean
  applyRubberBanding(ai: AIDriver, playerCar: Car): void
  avoidCollisions(ai: AIDriver, allCars: Car[]): number  // steering correction
  respawnIfStuck(ai: AIDriver, delta: number): void
}
```

**AI behavior logic:**

1. **Waypoint following:**
   - Always chase the current `targetWaypointIndex` in `WAYPOINTS`
   - When `dist(car.position, waypoint) < AI_WAYPOINT_RADIUS`: advance to next waypoint (wrapping)
   - Look-ahead: calculate the direction to waypoint 2–3 ahead for smoother cornering

2. **Steering:**
   - Calculate angle from car to target waypoint
   - `steerInput = clamp(angleDiff(car.angle, targetAngle) / 0.5, -1, 1)`
   - Add small random deviation (`±0.05`) for human-like imperfection

3. **Braking:**
   - If the waypoint ahead has a sharp curve (angle change > 0.6 rad): start braking 120px early
   - If a car is within 80px in front: brake to avoid collision

4. **Rubber banding:**
   - If AI is more than 300px ahead of player: reduce `maxSpeed` by up to 15%
   - If AI is more than 500px behind player: increase `maxSpeed` by up to 10%
   - Scale factor based on difficulty (Easy has more rubber banding, Hard has less)

5. **Obstacle avoidance:**
   - Detect cars within 100px radius
   - Steer away from cars that are overlapping the AI's path

6. **Stuck detection:**
   - Track last position; if car hasn't moved >10px in 3 seconds: teleport to nearest waypoint facing forward

7. **Nitro usage:**
   - Use nitro on straights (when waypoint angle change is < 0.2 rad) and when nitro > 0.6

**Initial positions of 3 AI cars:**
- Place them behind the player on the starting grid, staggered left/right, using `STARTING_GRID_SPACING`

### 5.2 — Camera System

**`src/hooks/useCamera.ts`** — Export `updateCamera(camera: Camera, target: Car, canvasWidth: number, canvasHeight: number, delta: number): Camera`:

- **Follow with lerp:** `camera.x = lerp(camera.x, target.x - canvasWidth/2, 6 * delta)`, same for Y
- **Clamp to world bounds:** don't scroll past world edges
- **Dynamic zoom:**
  - At low speed: zoom = 1.0
  - At high speed: zoom = 0.85
  - Lerp toward `targetZoom` at rate `3 * delta`
- **Screen shake:**
  - If `camera.shakeIntensity > 0`: add random offset within `±shakeIntensity` pixels
  - Decay: `camera.shakeIntensity *= (1 - camera.shakeDecay * delta * 60)`
- **Zoom toward player** when nitro is active (subtle zoom-in effect)

Also implement `applyCameraTransform(ctx, camera)` and `removeCameraTransform(ctx)`.

### 5.3 — Lap & Checkpoint System

**`src/engines/CollisionEngine.ts`** — Implement:

```ts
class CollisionEngine {
  checkLapCompletion(car: Car, grid: number[][], delta: number): boolean
  checkCheckpoint(car: Car, grid: number[][]): void
  checkOffTrack(car: Car, grid: number[][]): boolean
  getCarBounds(car: Car): Rect
}
```

**Lap detection logic:**
- When car crosses a `TileType.StartLine` tile:
  - Only count if all 5 checkpoints have been passed this lap (`car.checkpointsPassed.length === 5`)
  - Record lap time: `currentLapTime = raceTime - previousLapStartTime`
  - Push to `car.lapTimes`
  - Update `car.bestLapTime` if new record
  - Reset `car.checkpointsPassed` to `[]`
  - Increment `car.lap`
  - If `car.lap > TOTAL_LAPS`: trigger `RaceFinished`

**Checkpoint detection:**
- When car enters a `TileType.Checkpoint` tile: add its index to `car.checkpointsPassed` if not already there

### 5.4 — Verification Checklist for Sub-Prompt 5
- [ ] All 3 AI cars follow waypoints and complete full laps
- [ ] No AI car gets permanently stuck
- [ ] Camera smoothly follows player with shake on collision
- [ ] Lap is only counted after passing all checkpoints
- [ ] Rubber banding keeps races competitive

---

---

# SUB-PROMPT 6 — Render Engine (Complete Visual Layer)

## Goal
Implement the complete canvas rendering pipeline. This is the most visual and detailed sub-prompt.

## Instructions

**`src/engines/RenderEngine.ts`** — Export a class `RenderEngine` with these methods (call them in order each frame):

```ts
class RenderEngine {
  drawBackground(ctx, camera, dayTime)
  drawOffscreenTrack(ctx, offscreenCanvas, camera)
  drawDecorations(ctx, camera, grid)
  drawSkidMarks(ctx, skidMarks, camera)
  drawCarShadow(ctx, car)
  drawCar(ctx, car, isPlayer, isNight)
  drawCarHeadlights(ctx, car, isNight)
  drawParticles(ctx, particles, camera)
  drawHUD(ctx, gameState)        // do NOT use this — HUD is in React overlay
  drawNightOverlay(ctx, cars, camera, dayTime)
  drawRainEffect(ctx, camera, delta)
  drawLensFlare(ctx, camera, dayTime)
  renderFrame(ctx, gameState, offscreenTrack): void  // calls all above in order
}
```

### 6.1 — Background & Sky

`drawBackground(ctx, camera, dayTime)`:
- Interpolate sky colors between day/dusk/night based on `dayTime` (0–1)
- Draw as a full-screen gradient (top = sky color A, bottom = sky color B)
- Draw 3 parallax cloud layers:
  - Layer 1 (far): 5 large white rounded blobs, moves at `camera.x * 0.05`
  - Layer 2 (mid): 8 medium clouds, moves at `camera.x * 0.12`
  - Layer 3 (near): 3 small fast clouds, moves at `camera.x * 0.22`
  - Clouds drift rightward over time (animate `xOffset` by `+20 * delta` each frame)
- At dusk: draw a sun/horizon glow (orange radial gradient at bottom third)
- At night: draw stars (50 small white dots, positions derived from prime numbers for non-uniform distribution)

### 6.2 — Track Rendering

`drawOffscreenTrack(ctx, offscreenCanvas, camera)`:
- Apply camera transform
- `ctx.drawImage(offscreenCanvas, 0, 0)`
- Draw track-ambient occlusion: for each road-edge tile, draw a 8px gradient overlay darkening the edge (improves 3D depth illusion)

### 6.3 — Car Rendering (High Detail)

`drawCar(ctx, car, isPlayer, isNight)`:

Implement with `ctx.save() / ctx.restore()`. Translate to `car.position`, rotate by `car.angle`:

**Body:**
- Metallic paint using linear gradient from `colorSet.body` (center) to `colorSet.accent` (edges)
- `roundedRect(-CAR_WIDTH/2, -CAR_HEIGHT/2, CAR_WIDTH, CAR_HEIGHT, 7)` for the main body
- Specular highlight: thin white line from top-left to center-top: `rgba(255,255,255,0.35)`, width 2px

**Roof / Cabin:**
- Smaller, darker rounded rect centered on car (40% of body size)
- Windshield: translucent blue-grey rect at front: `rgba(150,200,220,0.65)`
- Windshield specular: two diagonal white lines inside it

**Wheels (4 total):**
- Positions: front-left, front-right, rear-left, rear-right
- Each wheel: black oval (8×12px), then a dark grey rim circle (6px), then center hub dot
- `car.wheelRotation` increases with speed: `wheelRotation += speed * delta * 0.18`
- `ctx.rotate(car.wheelRotation)` on front wheels for rolling animation
- Front wheels also steer: add `steerAngle * 0.35` to their rotation for visual steering

**Headlights:**
- Two small yellow/white rectangles at the car's front corners
- Tail lights: two small red rects at rear corners
- If braking: tail lights glow brighter red

**Damage decals** (if `car.damageLevel > 0.1`):
- Draw 2–3 dark scratch marks (irregular lines) on the car body using `car.id` as seed for deterministic positions

**Exhaust pipes:**
- Two small dark circles at rear-center; draw `ExhaustSmoke` particles here every 3 frames when accelerating

**Shadow under car:**
- Before drawing the car body, draw an ellipse shadow offset `(+4, +6)`, size `(car.width * 0.85, car.height * 0.4)`, color `rgba(0,0,0,0.5)`, blur 10px

### 6.4 — Night & Lighting Effects

`drawCarHeadlights(ctx, car, isNight)`:
- Only visible at night or low dayTime
- For each headlight:
  - Create a radial gradient: center = `rgba(255,230,100,0.9)`, edge = `rgba(255,200,50,0)`
  - Radius: `HEADLIGHT_LENGTH`
  - Apply `ctx.clip()` to a forward triangle cone (`HEADLIGHT_ANGLE * 2` wide)
  - Composite mode `'lighter'` for additive glow

`drawNightOverlay(ctx, cars, camera, dayTime)`:
- If `dayTime > 0.7` (approaching night) or `dayTime < 0.3`:
  - Draw a full-screen `rgba(0, 0, 15, darknessAlpha)` overlay to darken
  - `darknessAlpha` = `smoothstep(0.4, 0.8, dayTime) * 0.65`
  - For each car with headlights:
    - Draw a "hole" in the darkness using composite mode `'destination-out'` at car's headlight positions
  - Reset composite mode to `'source-over'`

### 6.5 — Post-Processing Effects

**Motion blur** (when `speed > 0.7 * maxSpeed`):
- Keep the previous frame rendered at `alpha = MOTION_BLUR_ALPHA`
- Achieved by not clearing canvas fully: draw a full-screen rect with `rgba(background, MOTION_BLUR_ALPHA)` instead of `clearRect`

**Screen shake** — handled in camera transform (already done in Sub-Prompt 5)

**Vignette** — call `applyVignette(ctx, w, h, VIGNETTE_STRENGTH)` last in the render pipeline

**Nitro glow** — when player nitro is active:
- Draw a blurred oval behind the car using composite `'lighter'`, orange-to-transparent gradient

**Rain effect** (if `isRaining`):
- Maintain an array of 200 raindrop positions
- Each drop: a thin diagonal line, 10–18px long, `rgba(180,220,255,0.45)`
- Update positions: move `+3x / +9y` per frame; wrap when off-screen
- Draw on a separate pass over the world (not affected by camera zoom)

### 6.6 — Render Frame Order (Mandatory)

```
1. drawBackground (sky, clouds, stars)
2. applyCameraTransform(ctx, camera)
3. drawOffscreenTrack (static map)
4. drawDecorations (trackside elements)
5. drawSkidMarks (persistent, world-space)
6. for each AI car: drawCarShadow, drawCar, drawCarHeadlights
7. drawCarShadow(player), drawCar(player), drawCarHeadlights(player)
8. drawParticles (smoke, sparks, confetti) — world space
9. drawNightOverlay (full-screen darkness with headlight holes)
10. removeCameraTransform(ctx)
11. drawRainEffect (screen-space, no camera)
12. applyVignette (screen-space)
```

### 6.7 — Verification Checklist for Sub-Prompt 6
- [ ] All 4 cars render with full detail (wheels, windshield, lights)
- [ ] Skid marks appear and persist in world space
- [ ] Night mode darkens scene; headlight cones light up the track
- [ ] Particles render correctly (smoke drifts, sparks fly)
- [ ] 60 FPS maintained (use `performance.now()` to verify)

---

---

# SUB-PROMPT 7 — Game Loop, State Management & Core Integration

## Goal
Wire everything together: game loop, state management, collision detection, and the main `GameCanvas` component.

## Instructions

### 7.1 — Game Loop Hook

**`src/hooks/useGameLoop.ts`:**

```ts
const useGameLoop = (
  updateFn: (delta: number) => void,
  renderFn: () => void,
  active: boolean
): { fps: number } => { ... }
```

- Use `requestAnimationFrame`
- Calculate `delta = (now - lastTime) / 1000`
- Clamp delta to `0.033` max (prevents physics explosions on tab switch)
- Track FPS: rolling average over last 30 frames
- When `active === false`: cancel frame, don't update
- Cleanup: `cancelAnimationFrame` on unmount

### 7.2 — State Management

**`src/App.tsx`** — Use `useReducer` with `GameState` and `GameAction`:

Implement the full `gameReducer(state: GameState, action: GameAction): GameState`. Key cases:

- `START_RACE`: Initialize player car at `START_POSITION`, place 3 AI cars behind, set status to `Countdown`, reset all timers
- `TICK_COUNTDOWN`: Decrement `countdownValue`; when 0, transition to `Racing`
- `UPDATE_PHYSICS`: Call `PhysicsEngine.updateCar()` for player and each AI; update `totalRaceTime`
- `UPDATE_AI`: Call `AIEngine.updateDriver()` for each AI
- `UPDATE_PARTICLES`: Call `ParticleEngine.update()`
- `RACE_FINISHED`: Calculate final positions, save to leaderboard, transition to `RaceFinished`
- `PAUSE_TOGGLE`: Toggle between `Paused` and `Racing`

Provide `GameStateContext` and `GameDispatchContext` with React Context.

### 7.3 — Main GameCanvas Component

**`src/components/GameCanvas.tsx`:**

```tsx
const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useGameState()   // context consumer
  const dispatch = useGameDispatch()
  const input = useKeyboardControls()
  
  // Set up canvas sizing (responsive)
  // Initialize engines (useMemo)
  // Game update function (useCallback)
  // Game render function (useCallback)
  // useGameLoop(update, render, state.status === 'Racing' || state.status === 'Countdown')
  
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
```

**Canvas sizing:**
- Target aspect ratio: `16:10`
- On mount and window resize: set `canvas.width` and `canvas.height` to actual pixel dimensions
- Scale canvas to fill its CSS container using CSS `width: 100%; height: 100%`

**Update function (runs 60x/sec):**
```
1. If countdown: tick countdown timer
2. Update player physics with keyboard input
3. Check tile under player for friction coefficient
4. Resolve wall collisions
5. For each AI: update AI, resolve collisions
6. Resolve car–car collisions (player vs AI, AI vs AI)
7. Check lap/checkpoint completion
8. Update particles
9. Update skid marks
10. Update camera
11. Update day/night cycle
12. Dispatch FPS metric every 60 frames
```

**Render function (runs every frame):**
```
1. Clear canvas
2. renderEngine.renderFrame(ctx, state, offscreenTrack)
```

### 7.4 — Verification Checklist for Sub-Prompt 7
- [ ] Game loop runs at stable 60 FPS
- [ ] Player car physics responds to keyboard input
- [ ] AI cars race, avoid obstacles, complete laps
- [ ] Countdown sequence works (3, 2, 1, GO!)
- [ ] Laps are counted correctly with checkpoint validation
- [ ] Race ends after TOTAL_LAPS laps
- [ ] No memory leaks (verify with DevTools)

---

---

# SUB-PROMPT 8 — HUD Components (React Overlay)

## Goal
Build all React/Tailwind HUD components that overlay the canvas.

## Instructions

All HUD components are absolutely positioned over the canvas. Use Tailwind's `backdrop-blur-sm` and `bg-track-panel` classes for glassmorphism panels.

### 8.1 — Speedometer

**`src/components/HUD/Speedometer.tsx`:**
- Canvas-drawn circular gauge (150×150px)
- Outer ring: dark with neon accent tick marks every 20 km/h
- Needle: white line from center rotating based on speed (0 = bottom-left, max = bottom-right)
- Center readout: large digital number (speed in km/h) using `font-mono`
- Below: gear indicator (auto-calculate gear from speed brackets: 1–6 gears)
- Color: needle turns neon orange above 80% max speed; neon red above 95%

### 8.2 — Lap Timer

**`src/components/HUD/LapTimer.tsx`:**
- Large digital display: `MM:SS.mmm` format using `font-racing text-4xl`
- Below: "LAP X / 3" counter
- Below: "BEST: MM:SS.mmm" in smaller text (from localStorage)
- On new best lap: flash green animation for 2 seconds
- Last 3 lap splits displayed as small entries below (if data available)

### 8.3 — Nitro Meter

**`src/components/HUD/NitroMeter.tsx`:**
- Horizontal bar, full width of HUD panel (200px wide × 18px tall)
- Background: dark track panel
- Fill: gradient from `neon-orange` to `neon-blue`
- At 100%: add pulsing glow animation (`animate-glow`)
- Label: "NITRO" above in small caps
- When active: bar shimmers (animated bright spot sweeping left to right)
- Depleted: bar shakes briefly

### 8.4 — Mini-Map

**`src/components/HUD/MiniMap.tsx`:**
- 160×160px canvas element
- Draw the full track outline using a scaled-down version of the tilemap
  - Road tiles: `#3a3a5e`
  - Wall tiles: `#1a1a2e`
  - Grass: `#0d2b18`
  - Start line: white
- Draw player position: blinking neon blue dot (2px radius)
- Draw AI positions: orange dots (2px radius each)
- Outer border: neon blue `1px` with `blur(4px)` glow
- Update every frame

### 8.5 — Position Display

**`src/components/HUD/PositionDisplay.tsx`:**
- Large text: `P1`, `P2`, `P3`, `P4`
- Calculate position by sorting all cars by `(car.lap * 1000 + checkpointsPassed.length * 10 + distanceToNextWaypoint)`
- Color: gold for P1, silver for P2, bronze for P3, white for P4
- Background panel changes color based on position

### 8.6 — HUD Layout

All HUD elements positioned:
- **Top-left:** Lap timer + splits
- **Top-center:** Position indicator (large)
- **Top-right:** FPS counter (small, if `settings.showFPS`)
- **Bottom-left:** Speedometer
- **Bottom-right:** Mini-map
- **Bottom-center:** Nitro meter

Wrap all HUD in `<div className="absolute inset-0 pointer-events-none select-none">` over the canvas.

### 8.7 — Toast Messages

**`src/components/UI/MessageToast.tsx`:**
- Shows centered on screen, below top third
- Messages: "PERFECT DRIFT! +NITRO", "LAP COMPLETE!", "NEW BEST LAP! 🏆", "NITRO READY!"
- Each shows for 2 seconds then fades out
- Large bold text with neon glow matching the message type
- Entrance: `animate-slide-up`

### 8.8 — Verification Checklist for Sub-Prompt 8
- [ ] Speedometer needle moves correctly with car speed
- [ ] Lap timer counts correctly in MM:SS.mmm format
- [ ] Mini-map shows correct positions of all cars
- [ ] Nitro meter fills/drains in sync with game state
- [ ] Position accurately reflects race order
- [ ] Toast messages appear and fade correctly

---

---

# SUB-PROMPT 9 — Menus, Settings, Leaderboard & Game Flow

## Goal
Build all React/Tailwind UI screens: Start Menu, Car Selection, Countdown, Pause Menu, Race Finished Screen, Settings Panel, and Leaderboard.

## Instructions

### 9.1 — Start Menu

**`src/components/Menus/StartMenu.tsx`:**

**Background:**
- A looping mini canvas showing the track scrolling (bird's-eye pan) at 1/8 speed; the offscreen track canvas can be reused
- Dark overlay with animated particles (slowly moving neon dots)

**Logo:**
- "VELOCITYX" in `Orbitron` font, massive (`text-8xl md:text-9xl`), gradient text from neon-blue to neon-orange
- Subtitle: "2D RACING" in smaller spaced caps
- Animated underline that extends on mount

**Mode buttons (glassmorphism cards):**
- "🏁 GRAND PRIX" — AI Race mode
- "⏱ TIME TRIAL" — Time Trial mode
- "🚗 FREE ROAM" — Free Roam mode
- Each card: `backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl hover:border-neon-blue/60 hover:bg-white/10 transition-all duration-300`
- Hover state: neon border glow
- Click animates the card scaling down slightly

**Car Selection row:**
- 6 color swatches rendered as small canvas car drawings (same drawCar function)
- Selected: neon ring around the swatch
- Player name input field (styled with `font-mono`, neon blue bottom border)

**Difficulty selector:**
- Three segmented buttons: EASY / MEDIUM / HARD
- Active: neon background, slight glow

**Best laps panel:**
- Small glassmorphic panel showing top 3 leaderboard entries from localStorage

**Bottom links:**
- "⚙ SETTINGS" and "🏆 LEADERBOARD" as text links

### 9.2 — Countdown Overlay

**`src/components/UI/CountdownOverlay.tsx`:**
- Full-screen semi-transparent overlay
- Large animated number (3, 2, 1) using `animate-count-down` — each number scales in and shrinks to nothing
- "GO!" appears in neon green with `animate-glow`
- Starting grid lights: 5 red dots → lights off = race starts (like F1 lights)
- After GO!, overlay unmounts entirely

### 9.3 — Pause Menu

**`src/components/Menus/PauseMenu.tsx`:**
- Full-screen overlay with heavy `backdrop-blur-xl`
- Centered card: "PAUSED" heading
- Options: "▶ RESUME", "🔄 RESTART RACE", "⚙ SETTINGS", "🏠 MAIN MENU"
- Background shows the frozen game canvas (blur handles it)

### 9.4 — Race Finished Screen

**`src/components/Menus/RaceFinishedScreen.tsx`:**
- Full-screen animated celebration overlay
- Confetti particles (CSS animation, not canvas — use absolutely positioned divs)
- Results card:
  - Final position (large, colored: gold/silver/bronze/white)
  - Total race time
  - Best lap time (highlighted if new personal best)
  - Lap-by-lap breakdown table
  - Comparison vs best previous run
- Podium graphic: 3 simple stepped podium boxes (CSS-drawn) with car color dots
- Buttons: "🔄 RACE AGAIN", "📋 VIEW LEADERBOARD", "🏠 MAIN MENU"

### 9.5 — Settings Panel

**`src/components/Menus/SettingsPanel.tsx`:**
- Modal overlay (accessible from both Start Menu and Pause Menu)
- Sections: AUDIO, GRAPHICS, GAMEPLAY, CONTROLS reference
- **Audio:** SFX volume slider, Music volume slider (styled range inputs with neon fill)
- **Graphics:** Quality select (Low/Medium/High), Day/Night cycle toggle, Rain toggle, Show FPS toggle, Screen Shake toggle
- **Gameplay:** Player name input, Car color picker
- **Controls:** Static table showing all keybindings
- Save button persists to localStorage via `saveSettings()`

### 9.6 — Leaderboard Modal

**`src/components/UI/LeaderboardModal.tsx`:**
- Full modal overlay with glassmorphic background
- Tabs: "TIME TRIAL" / "GRAND PRIX" / "FREE ROAM"
- Table with columns: RANK, NAME, TIME, BEST LAP, DATE
- Top 10 entries per mode, loaded from localStorage
- Row 1: gold background tint; Row 2: silver; Row 3: bronze
- "CLEAR ALL DATA" button (confirmation required)

### 9.7 — Touch Controls (Mobile Bonus)

**`src/components/UI/TouchControls.tsx`:**
- Shown only on touch devices (`'ontouchstart' in window`)
- Left side: virtual D-pad (up/down/left/right arrows as large touch buttons)
- Right side: "NITRO" big circular button
- Semi-transparent overlays with `pointer-events-auto`
- Trigger same `CarInput` interface as keyboard

### 9.8 — Verification Checklist for Sub-Prompt 9
- [ ] Start menu renders with animated background
- [ ] All 3 game modes launch correctly
- [ ] Car color selection works and applies to the car in-game
- [ ] Countdown lights sequence plays before race start
- [ ] Pause menu blurs background and resumes correctly
- [ ] Race finished screen shows correct times and positions
- [ ] Settings persist between sessions
- [ ] Leaderboard correctly loads and displays stored results

---

---

# SUB-PROMPT 10 — Audio, Polish, Testing & README

## Goal
Add Web Audio API sound effects, final visual polish, performance optimizations, and complete documentation.

## Instructions

### 10.1 — Audio Engine

**`src/hooks/useAudio.ts`:**

Use the `AudioContext` API to synthesize all sounds procedurally (no audio files needed):

```ts
const useAudio = (settings: GameSettings) => {
  const playEngineSound(speed: number, maxSpeed: number): void
  const playTireScreech(driftIntensity: number): void
  const playNitroWhoosh(): void
  const playCollision(intensity: number): void
  const playCountdown(number: number): void
  const playLapComplete(isBestLap: boolean): void
  const playRaceFinish(): void
  const stopAll(): void
}
```

**Sound synthesis specs:**

| Sound | Method | Parameters |
|-------|--------|------------|
| Engine | OscillatorNode (sawtooth) | Frequency maps to speed: `120 + (speed/maxSpeed) * 280` Hz. Continuous, volume tracks speed |
| Tire screech | OscillatorNode (white noise) + BiquadFilter | Bandpass at 3000Hz; gain ∝ drift intensity |
| Nitro whoosh | OscillatorNode (sine) swept 200→800Hz | Duration 0.6s, fade in/out |
| Collision | BufferSource with white noise burst | Duration 0.15s, high-pass filter, volume ∝ impact speed |
| Countdown beep | OscillatorNode (sine) at 880Hz | 0.1s; GO! is 1320Hz, 0.3s |
| Lap complete | Two-note ding: 660Hz then 880Hz, 0.2s each | |
| Race finish | Ascending 5-note arpeggio | C5, E5, G5, B5, C6 — 0.15s each |

- All sounds respect `settings.sfxVolume`
- Engine sound updates every 3 frames (not every frame) for performance
- Disconnect and clean up `AudioContext` on unmount

### 10.2 — Performance Optimization Pass

Apply these optimizations across the codebase:

1. **Offscreen canvas caching:** The static track (`buildOffscreenTrack`) is created once in `useMemo` and never redrawn unless settings change.

2. **Particle culling:** Only draw particles within `camera.x ± canvasWidth/2 + 50` range.

3. **Tile visibility culling:** When rendering decorations, skip tiles outside the camera viewport.

4. **`will-change: transform`:** Apply to the `<canvas>` element via inline style or Tailwind.

5. **`requestAnimationFrame` throttling:** When `document.hidden === true`, skip `update()` but still call `cancelAnimationFrame` to pause completely.

6. **Memoization:** Wrap all engine instantiations in `useMemo`; wrap `update` and `render` in `useCallback` with correct dependency arrays.

7. **`ctx.save/restore` audit:** Ensure every `save()` has a matching `restore()`.

8. **FPS display:** Show actual measured FPS in the HUD when `settings.showFPS` is true. Target: 60 FPS on integrated GPU. If FPS drops below 45 consistently, log a warning in dev mode.

### 10.3 — Ghost Car System (Bonus)

**`src/engines/GhostEngine.ts`** (optional but strongly encouraged):
- Record player's best lap: every frame during a lap, push `{ position, angle, timestamp }` to an array
- On next session, load best lap recording from localStorage
- Render the ghost as a translucent (alpha 0.35) car using a grey color scheme
- Ghost follows its recorded path with timestamp interpolation (no physics — just position/angle lerp)

### 10.4 — Final Visual Polish Checklist

Verify and fix each:
- [ ] All fonts load correctly (Orbitron, Rajdhani, JetBrains Mono via Google Fonts)
- [ ] Color palette is consistent across UI and canvas (use `graphicsConstants.COLORS`)
- [ ] All buttons have hover states with transition animations
- [ ] All panels use consistent glassmorphism (`backdrop-blur`, transparent bg, subtle border)
- [ ] Loading screen appears while offscreen canvas is being built
- [ ] Finish line has a banner/flag animation when player crosses it
- [ ] Day/night transition is smooth (no sudden flips)
- [ ] On mobile: layout reflows so HUD elements don't overlap
- [ ] Canvas scales correctly at 16:10 aspect on both 1080p and 4K screens
- [ ] Scroll is prevented globally during gameplay

### 10.5 — README.md

Create a thorough `README.md` at project root:

```markdown
# 🏎️ VelocityX — 2D Top-Down Racing Game

A production-ready, portfolio-quality 2D racing game built with React 18, TypeScript, Tailwind CSS, and the HTML5 Canvas API.

## 🚀 Quick Start
\`\`\`bash
npm install
npm run dev      # → http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
\`\`\`

## 🎮 Controls
| Action | Keys |
|--------|------|
| Accelerate | W / ↑ |
| Brake/Reverse | S / ↓ |
| Steer Left | A / ← |
| Steer Right | D / → |
| Nitro Boost | Spacebar |
| Respawn | R |
| Pause | P |
| Toggle Day/Night | T |
| Toggle Rain | Y |

## 🏁 Game Modes
- **Grand Prix** — Race 3 AI opponents over 3 laps
- **Time Trial** — Solo race against the clock
- **Free Roam** — Practice with no pressure

## ✨ Features
[Full feature list here — cover every feature from this build prompt]

## 🏗️ Architecture
[Describe the engine separation, React/Canvas boundary, state flow]

## 📊 Performance
- 60 FPS target on mid-range hardware
- Object-pooled particle system (600 particles max)
- Offscreen canvas caching for static track layer
- Camera-frustum culling for off-screen elements
```

### 10.6 — Final Integration Verification

Run through this complete checklist before declaring the project done:

**Functionality:**
- [ ] Full race from Menu → Car Select → Countdown → Racing → Finish → Leaderboard flow works
- [ ] All 3 game modes work
- [ ] AI cars complete laps without getting stuck for more than 5 seconds
- [ ] Player can respawn (R key) from any crashed state
- [ ] Settings save and load between browser sessions
- [ ] Leaderboard saves and sorts correctly
- [ ] Best lap time saves per mode

**Visuals:**
- [ ] Game renders at consistent 60 FPS (verified with built-in FPS counter)
- [ ] All visual effects are present: skid marks, smoke, sparks, flames, rain (if enabled)
- [ ] Night mode headlights illuminate the track correctly
- [ ] Start menu animated background works
- [ ] Confetti fires on race completion

**Code Quality:**
- [ ] `npm run build` produces zero TypeScript errors
- [ ] No `console.error` or `console.warn` during normal gameplay
- [ ] No `any` types in the codebase
- [ ] All event listeners are cleaned up on component unmount
- [ ] No memory leaks (run for 10+ minutes, check DevTools Memory tab)

**Responsive Design:**
- [ ] Looks good at 1280×800, 1920×1080, and on mobile (375px wide)
- [ ] HUD doesn't overflow on small screens
- [ ] Touch controls appear and work on mobile

---

---

## 🎯 Final Agent Notes

- **Do not skip any sub-prompt.** Each one builds on the previous.
- **Test after each sub-prompt** before moving to the next.
- **The visual quality bar is high.** The car should look like a real top-view race car, not a colored rectangle.
- **60 FPS is non-negotiable.** Profile and optimize if you hit bottlenecks.
- **TypeScript strict mode must be maintained throughout.** Disable no rules.
- **The game must run from `npm install && npm run dev` with zero extra setup.**

If you encounter a technical decision not covered here, bias toward **higher visual quality** and **cleaner code architecture**.

---

*End of Agent Build Prompt — VelocityX 2D Racing Game*
