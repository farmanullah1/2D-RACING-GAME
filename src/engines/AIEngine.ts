import { AIDriver, Car, Vector2D, CarState, AIDifficulty } from "../types/game.types";
import { 
  AI_WAYPOINT_RADIUS, AI_SPEEDS, PLAYER_TURN_SPEED 
} from "../constants/gameConstants";
import { 
  vecDist, angleDiff, normalizeAngle, clamp 
} from "../utils/mathUtils";
import { CarInput } from "./PhysicsEngine";

export class AIEngine {
  updateDriver(ai: AIDriver, allCars: Car[], delta: number, waypoints: Vector2D[]): CarInput {
    const car = ai.car
    const target = waypoints[ai.targetWaypointIndex]
    const dist = vecDist(car.position, target)

    // Advance waypoint
    if (dist < AI_WAYPOINT_RADIUS) {
      ai.targetWaypointIndex = (ai.targetWaypointIndex + 1) % waypoints.length
    }

    // Advanced Steering: Look-ahead for smoother cornering
    const targetAngle = Math.atan2(target.y - car.position.y, target.x - car.position.x)
    const lookAheadCount = 3
    let totalX = 0, totalY = 0
    for (let i = 0; i < lookAheadCount; i++) {
      const wp = waypoints[(ai.targetWaypointIndex + i) % waypoints.length]
      const weight = 1 / (i + 1)
      totalX += (wp.x - car.position.x) * weight
      totalY += (wp.y - car.position.y) * weight
    }
    const lookAheadAngle = Math.atan2(totalY, totalX)
    const diff = angleDiff(car.angle, lookAheadAngle)
    const steerInput = clamp(diff / 0.4, -1, 1)

    // Braking for corners: proactive look-ahead
    const nextTarget = waypoints[(ai.targetWaypointIndex + 5) % waypoints.length]
    const nextAngle = Math.atan2(nextTarget.y - target.y, nextTarget.x - target.x)
    const cornerSharpness = Math.abs(angleDiff(targetAngle, nextAngle))
    
    let shouldBrake = cornerSharpness > 0.4 && car.speed > 250

    // Collision avoidance
    allCars.forEach(other => {
      if (other.id !== car.id) {
        const d = vecDist(car.position, other.position)
        if (d < 100) {
          // Check if other is in front
          const toOther = Math.atan2(other.position.y - car.position.y, other.position.x - car.position.x)
          if (Math.abs(angleDiff(car.angle, toOther)) < 0.5) {
            shouldBrake = true
          }
        }
      }
    })

    // Difficulty scaling
    const speedMult = AI_SPEEDS[ai.difficulty]
    const accelerate = !shouldBrake && car.speed < car.maxSpeed * speedMult

    // Nitro
    const nitro = !shouldBrake && cornerSharpness < 0.2 && car.nitro > 0.8

    // Stuck detection
    this.respawnIfStuck(ai, delta, waypoints)

    return {
      accelerate,
      brake: shouldBrake,
      steerLeft: steerInput < -0.1,
      steerRight: steerInput > 0.1,
      nitro
    }
  }

  respawnIfStuck(ai: AIDriver, delta: number, waypoints: Vector2D[]): void {
    const car = ai.car
    if (car.speed < 10 && car.state !== CarState.Idle) {
      ai.reactionDelay += delta
      if (ai.reactionDelay > 3) {
        const wp = waypoints[ai.targetWaypointIndex]
        car.position = { ...wp }
        car.speed = 0
        ai.reactionDelay = 0
      }
    } else {
      ai.reactionDelay = 0
    }
  }

  applyRubberBanding(ai: AIDriver, playerCar: Car): void {
    const dist = vecDist(ai.car.position, playerCar.position)
    const isAhead = ai.car.totalRaceTime < playerCar.totalRaceTime // Simplified
    
    if (isAhead && dist > 500) {
      ai.car.maxSpeed *= 0.9
    } else if (!isAhead && dist > 500) {
      ai.car.maxSpeed *= 1.1
    }
  }
}
