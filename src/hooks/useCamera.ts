import { Camera, Car } from "../types/game.types";
import { lerp } from "../utils/mathUtils";
import { WORLD_WIDTH, WORLD_HEIGHT } from "../constants/gameConstants";

export const updateCamera = (
  camera: Camera,
  target: Car,
  canvasWidth: number,
  canvasHeight: number,
  delta: number
): Camera => {
  const targetX = target.position.x - canvasWidth / (2 * camera.zoom)
  const targetY = target.position.y - canvasHeight / (2 * camera.zoom)

  // Follow with lerp
  camera.x = lerp(camera.x, targetX, 6 * delta)
  camera.y = lerp(camera.y, targetY, 6 * delta)

  // Dynamic zoom
  const speedFactor = Math.abs(target.speed) / target.maxSpeed
  camera.targetZoom = 1.0 - speedFactor * 0.15
  if (target.nitroActive) camera.targetZoom += 0.05
  
  camera.zoom = lerp(camera.zoom, camera.targetZoom, 3 * delta)

  // Screen shake
  if (target.screenShake > 0) {
    camera.shakeIntensity = target.screenShake * 2
    // target.screenShake is handled in update loop
  }

  if (camera.shakeIntensity > 0) {
    camera.shakeIntensity *= (1 - camera.shakeDecay * delta * 60)
    if (camera.shakeIntensity < 0.1) camera.shakeIntensity = 0
  }

  return camera
}

export const applyCameraTransform = (ctx: CanvasRenderingContext2D, camera: Camera): void => {
  ctx.save()
  if (camera.shakeIntensity > 0) {
    const sx = (Math.random() - 0.5) * camera.shakeIntensity
    const sy = (Math.random() - 0.5) * camera.shakeIntensity
    ctx.translate(sx, sy)
  }
  ctx.scale(camera.zoom, camera.zoom)
  ctx.translate(-camera.x, -camera.y)
}

export const removeCameraTransform = (ctx: CanvasRenderingContext2D): void => {
  ctx.restore()
}
