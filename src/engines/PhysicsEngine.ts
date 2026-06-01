import { Car, TileType, Vector2D, CarState } from "../types/game.types";
import { 
  FRICTION_ROAD, FRICTION_GRASS, FRICTION_GRAVEL, FRICTION_PIT,
  NITRO_SPEED_MULTIPLIER, NITRO_DRAIN_RATE, NITRO_REFILL_RATE, NITRO_DRIFT_BONUS,
  DRIFT_THRESHOLD, DRIFT_GRIP_FACTOR, COLLISION_BOUNCE, WALL_PUSHBACK,
  TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, PLAYER_TURN_SPEED
} from "../constants/gameConstants";
import { 
  angleDiff, vecAdd, vecScale, vecMag, vecSub, vecDot, vecNorm, vecDist, normalizeAngle 
} from "../utils/mathUtils";

export interface CarInput {
  accelerate: boolean
  brake: boolean
  steerLeft: boolean
  steerRight: boolean
  nitro: boolean
}

export class PhysicsEngine {
  updateCar(car: Car, input: CarInput, delta: number, grid: number[][]): void {
    const currentTile = this.getCurrentTile(car, grid)
    const frictionCoeff = this.getFrictionForTile(currentTile)

    // 1. Steering
    const speedFactor = Math.abs(car.speed) / car.maxSpeed
    const steerInput = (input.steerRight ? 1 : 0) - (input.steerLeft ? 1 : 0)
    const turnSpeed = PLAYER_TURN_SPEED * steerInput * (1 - speedFactor * 0.6)
    car.angularVelocity = turnSpeed
    car.angle = normalizeAngle(car.angle + car.angularVelocity * delta)

    // 2. Acceleration / Braking
    const direction = { x: Math.cos(car.angle), y: Math.sin(car.angle) }
    
    if (input.accelerate) {
      const accel = car.acceleration * (car.nitroActive ? NITRO_SPEED_MULTIPLIER : 1)
      car.speed += accel * delta
    } else if (input.brake) {
      car.speed -= car.brakeForce * delta
    } else {
      // Natural deceleration if no input
      car.speed *= Math.pow(0.98, delta * 60)
    }

    // 3. Nitro
    this.applyNitro(car, input.nitro, delta)
    
    const maxSpeed = car.maxSpeed * (car.nitroActive ? NITRO_SPEED_MULTIPLIER : 1)
    car.speed = Math.min(car.speed, maxSpeed)
    car.speed = Math.max(car.speed, -car.maxSpeed * 0.2) // Reverse speed limit

    // 4. Drift
    this.applyDrift(car, input, delta)

    // 5. Apply Velocity
    car.velocity = vecScale(direction, car.speed)
    
    // Friction
    this.applyFriction(car, frictionCoeff, delta)

    // Move
    car.position = vecAdd(car.position, vecScale(car.velocity, delta))

    // 6. Wall Collisions
    this.resolveWallCollision(car, grid)
  }

  getFrictionForTile(tile: TileType): number {
    switch (tile) {
      case TileType.Road: return FRICTION_ROAD
      case TileType.Grass: return FRICTION_GRASS
      case TileType.Gravel: return FRICTION_GRAVEL
      case TileType.PitLane: return FRICTION_PIT
      default: return FRICTION_ROAD
    }
  }

  applyFriction(car: Car, frictionCoeff: number, delta: number): void {
    car.velocity = vecScale(car.velocity, Math.pow(frictionCoeff, delta * 60))
    car.speed = vecMag(car.velocity) * (car.speed < 0 ? -1 : 1)
  }

  applyDrift(car: Car, input: CarInput, delta: number): void {
    const velAngle = Math.atan2(car.velocity.y, car.velocity.x)
    const slipAngle = Math.abs(angleDiff(velAngle, car.angle))
    car.driftAngle = slipAngle

    const isBraking = input.brake && car.speed > 100
    const isHardTurning = Math.abs((input.steerRight ? 1 : 0) - (input.steerLeft ? 1 : 0)) > 0.5

    if (slipAngle > DRIFT_THRESHOLD && (isBraking || isHardTurning)) {
      car.state = CarState.Drifting
      // Reduce grip: blend velocity direction toward car's nose
      const noseDir = { x: Math.cos(car.angle), y: Math.sin(car.angle) }
      const currentDir = vecNorm(car.velocity)
      const targetDir = vecNorm(vecAdd(vecScale(currentDir, 1 - DRIFT_GRIP_FACTOR), vecScale(noseDir, DRIFT_GRIP_FACTOR)))
      car.velocity = vecScale(targetDir, Math.abs(car.speed))
      
      // Nitro bonus
      car.nitro = Math.min(1, car.nitro + NITRO_DRIFT_BONUS * delta)
    } else {
      car.state = car.speed > 10 ? CarState.Accelerating : CarState.Idle
    }
  }

  applyNitro(car: Car, nitroRequested: boolean, delta: number): void {
    if (nitroRequested && car.nitro > 0) {
      car.nitroActive = true
      car.nitro -= NITRO_DRAIN_RATE * delta
    } else {
      car.nitroActive = false
      car.nitro = Math.min(1, car.nitro + NITRO_REFILL_RATE * delta)
    }
    if (car.nitro < 0) car.nitro = 0
  }

  resolveWallCollision(car: Car, grid: number[][]): void {
    const col = Math.floor(car.position.x / TILE_SIZE)
    const row = Math.floor(car.position.y / TILE_SIZE)

    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH || grid[row][col] === TileType.Wall) {
      car.position = car.lastValidPosition
      car.speed *= -COLLISION_BOUNCE
      car.screenShake = 8
    } else {
      car.lastValidPosition = { ...car.position }
    }
  }

  resolveCarCollision(carA: Car, carB: Car): void {
    const dist = vecDist(carA.position, carB.position)
    if (dist < carA.collisionRadius + carB.collisionRadius) {
      const normal = vecNorm(vecSub(carA.position, carB.position))
      const relativeVel = vecSub(carA.velocity, carB.velocity)
      const impulse = vecDot(relativeVel, normal) * COLLISION_BOUNCE
      
      carA.velocity = vecSub(carA.velocity, vecScale(normal, impulse))
      carB.velocity = vecAdd(carB.velocity, vecScale(normal, impulse))
      
      carA.speed = vecMag(carA.velocity) * (vecDot(carA.velocity, { x: Math.cos(carA.angle), y: Math.sin(carA.angle) }) > 0 ? 1 : -1)
      carB.speed = vecMag(carB.velocity) * (vecDot(carB.velocity, { x: Math.cos(carB.angle), y: Math.sin(carB.angle) }) > 0 ? 1 : -1)

      carA.screenShake = 8
      carB.screenShake = 8
      
      // Push cars apart to prevent sticking
      const overlap = (carA.collisionRadius + carB.collisionRadius) - dist
      const push = vecScale(normal, overlap / 2 + 1)
      carA.position = vecAdd(carA.position, push)
      carB.position = vecSub(carB.position, push)
    }
  }

  getCurrentTile(car: Car, grid: number[][]): TileType {
    const col = Math.floor(car.position.x / TILE_SIZE)
    const row = Math.floor(car.position.y / TILE_SIZE)
    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) return TileType.Grass
    return grid[row][col] as TileType
  }
  
  getSpeedKmh(car: Car): number {
    return Math.abs(Math.round(car.speed * 0.6)) // Scaled km/h
  }
}
