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
export const AI_SPEEDS: { [key: number]: number } = {
  0: 0.72,  // Easy
  1: 0.88,  // Medium
  2: 1.00,  // Hard
}
