import { 
  GameState, Car, Camera, Vector2D, Particle, ParticleType, GameStatus, TileType 
} from "../types/game.types";
import { 
  COLORS, CAR_WIDTH, CAR_HEIGHT, SHADOW_OFFSET_X, SHADOW_OFFSET_Y, 
  SHADOW_BLUR, SHADOW_OPACITY, HEADLIGHT_LENGTH, HEADLIGHT_ANGLE,
  VIGNETTE_STRENGTH, MOTION_BLUR_ALPHA
} from "../constants/graphicsConstants";
import { 
  TILE_SIZE, WORLD_WIDTH, WORLD_HEIGHT, GRID_WIDTH, GRID_HEIGHT 
} from "../constants/gameConstants";
import { applyCameraTransform, removeCameraTransform } from "../hooks/useCamera";
import { roundedRect, applyVignette, saveRestore } from "../utils/canvasUtils";
import { vecRotate, vecAdd } from "../utils/mathUtils";

export class RenderEngine {
  renderFrame(
    ctx: CanvasRenderingContext2D, 
    state: GameState, 
    offscreenTrack: HTMLCanvasElement,
    ghostCar?: any
  ): void {
    const { camera, currentDayTime, player, aiDrivers, particles, skidMarks, isRaining } = state

    // ... (rest of methods)
    
    // 5. Skid Marks
    this.drawSkidMarks(ctx, skidMarks)

    // Ghost Car
    if (ghostCar) {
      this.drawCar(ctx, ghostCar, false, state.isNight, 0.35)
    }

    // 6. Cars
    aiDrivers.forEach(ai => {
      this.drawCarShadow(ctx, ai.car)
      this.drawCar(ctx, ai.car, false, state.isNight)
      this.drawCarHeadlights(ctx, ai.car, state.isNight || state.currentDayTime > 0.7 || state.currentDayTime < 0.3)
    })

    this.drawCarShadow(ctx, player)
    this.drawCar(ctx, player, true, state.isNight)
    this.drawCarHeadlights(ctx, player, state.isNight || state.currentDayTime > 0.7 || state.currentDayTime < 0.3)

    // 7. Particles
    this.drawParticles(ctx, particles)

    // 8. Night Overlay (needs to be in camera space for headlight holes)
    this.drawNightOverlay(ctx, [player, ...aiDrivers.map(ai => ai.car)], camera, currentDayTime)

    // 9. Camera Transform End
    removeCameraTransform(ctx)

    // 10. Screen-space effects
    if (isRaining) this.drawRainEffect(ctx, state.frameCount)
    this.drawVignetteEffect(ctx)
  }

  drawBackground(ctx: CanvasRenderingContext2D, camera: Camera, dayTime: number): void {
    const { width, height } = ctx.canvas
    
    // Sky Gradient
    let skyA, skyB
    if (dayTime < 0.3 || dayTime > 0.7) {
      skyA = COLORS.sky.night[0]; skyB = COLORS.sky.night[1]
    } else if (dayTime < 0.4 || dayTime > 0.6) {
      skyA = COLORS.sky.dusk[0]; skyB = COLORS.sky.dusk[1]
    } else {
      skyA = COLORS.sky.day[0]; skyB = COLORS.sky.day[1]
    }

    const grad = ctx.createLinearGradient(0, 0, 0, height)
    grad.addColorStop(0, skyA)
    grad.addColorStop(1, skyB)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, width, height)

    // Stars at night
    if (dayTime > 0.7 || dayTime < 0.3) {
      ctx.fillStyle = 'white'
      for (let i = 0; i < 50; i++) {
        const x = (i * 137.5) % width
        const y = (i * 243.1) % height
        ctx.fillRect(x, y, 1, 1)
      }
    }
  }

  drawOffscreenTrack(ctx: CanvasRenderingContext2D, offscreenTrack: HTMLCanvasElement): void {
    ctx.drawImage(offscreenTrack, 0, 0)
  }

  drawSkidMarks(ctx: CanvasRenderingContext2D, skidMarks: Particle[]): void {
    skidMarks.forEach(p => {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = 'black'
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation || 0)
      ctx.fillRect(-p.size / 2, -3, p.size, 6)
      ctx.restore()
    })
  }

  drawCarShadow(ctx: CanvasRenderingContext2D, car: Car): void {
    ctx.save()
    ctx.translate(car.position.x + SHADOW_OFFSET_X, car.position.y + SHADOW_OFFSET_Y)
    ctx.rotate(car.angle)
    ctx.fillStyle = `rgba(0,0,0,${SHADOW_OPACITY})`
    ctx.beginPath()
    ctx.ellipse(0, 0, CAR_HEIGHT / 2, CAR_WIDTH / 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  drawCar(ctx: CanvasRenderingContext2D, car: Car, isPlayer: boolean, isNight: boolean, alpha: number = 1): void {
    const colorSet = COLORS[`car${car.color.charAt(0).toUpperCase() + car.color.slice(1)}` as keyof typeof COLORS] as any
    
    saveRestore(ctx, () => {
      ctx.globalAlpha = alpha
      ctx.translate(car.position.x, car.position.y)
      ctx.rotate(car.angle)

      // Body Roll simulation: slight vertical offset based on turning intensity
      const rollAmount = car.angularVelocity * 2.5
      ctx.translate(0, rollAmount)
      ctx.scale(1, 1 - Math.abs(car.angularVelocity) * 0.05)

      // Body
      const grad = ctx.createLinearGradient(-CAR_WIDTH/2, 0, CAR_WIDTH/2, 0)
      grad.addColorStop(0, colorSet.accent)
      grad.addColorStop(0.5, colorSet.body)
      grad.addColorStop(1, colorSet.accent)
      ctx.fillStyle = grad
      roundedRect(ctx, -CAR_HEIGHT / 2, -CAR_WIDTH / 2, CAR_HEIGHT, CAR_WIDTH, 8)
      ctx.fill()

      // Cabin
      ctx.fillStyle = '#111'
      roundedRect(ctx, -CAR_HEIGHT / 6, -CAR_WIDTH / 3, CAR_HEIGHT / 2, (CAR_WIDTH * 2) / 3, 4)
      ctx.fill()

      // Windshield
      ctx.fillStyle = 'rgba(150, 200, 220, 0.6)'
      ctx.fillRect(CAR_HEIGHT / 10, -CAR_WIDTH / 3 + 2, CAR_HEIGHT / 6, (CAR_WIDTH * 2) / 3 - 4)

      // Wheels
      ctx.fillStyle = '#222'
      const wheelW = 12, wheelH = 6
      const wheelX = CAR_HEIGHT / 3, wheelY = CAR_WIDTH / 2
      ctx.fillRect(wheelX - wheelW/2, wheelY - wheelH, wheelW, wheelH)
      ctx.fillRect(wheelX - wheelW/2, -wheelY, wheelW, wheelH)
      ctx.fillRect(-wheelX - wheelW/2, wheelY - wheelH, wheelW, wheelH)
      ctx.fillRect(-wheelX - wheelW/2, -wheelY, wheelW, wheelH)

      // Lights
      ctx.fillStyle = isNight ? '#ffed85' : '#fff'
      ctx.fillRect(CAR_HEIGHT / 2 - 4, -CAR_WIDTH / 2 + 2, 4, 6)
      ctx.fillRect(CAR_HEIGHT / 2 - 4, CAR_WIDTH / 2 - 8, 4, 6)
      
      ctx.fillStyle = car.speed < 0 || car.state === 2 ? '#ff0000' : '#800000'
      ctx.fillRect(-CAR_HEIGHT / 2, -CAR_WIDTH / 2 + 2, 3, 5)
      ctx.fillRect(-CAR_HEIGHT / 2, CAR_WIDTH / 2 - 7, 3, 5)
    })
  }

  drawCarHeadlights(ctx: CanvasRenderingContext2D, car: Car, active: boolean): void {
    if (!active) return
    
    saveRestore(ctx, () => {
      ctx.translate(car.position.x, car.position.y)
      ctx.rotate(car.angle)
      
      const grad = ctx.createRadialGradient(CAR_HEIGHT/2, 0, 0, CAR_HEIGHT/2, 0, HEADLIGHT_LENGTH)
      grad.addColorStop(0, 'rgba(255, 255, 200, 0.6)')
      grad.addColorStop(1, 'rgba(255, 255, 200, 0)')
      
      ctx.fillStyle = grad
      ctx.globalCompositeOperation = 'lighter'
      
      ctx.beginPath()
      ctx.moveTo(CAR_HEIGHT / 2, 0)
      ctx.arc(CAR_HEIGHT / 2, 0, HEADLIGHT_LENGTH, -HEADLIGHT_ANGLE, HEADLIGHT_ANGLE)
      ctx.closePath()
      ctx.fill()
    })
  }

  drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
    particles.forEach(p => {
      ctx.save()
      ctx.globalAlpha = p.alpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  }

  drawNightOverlay(ctx: CanvasRenderingContext2D, cars: Car[], camera: Camera, dayTime: number): void {
    const darkness = dayTime > 0.7 || dayTime < 0.3 ? 0.7 : (dayTime > 0.6 || dayTime < 0.4 ? 0.3 : 0)
    if (darkness === 0) return

    // This is tricky. We need to draw a full-screen dark rect in WORLD space
    // but subtract "holes" for headlights.
    ctx.save()
    ctx.fillStyle = `rgba(0, 0, 20, ${darkness})`
    ctx.fillRect(camera.x, camera.y, WORLD_WIDTH, WORLD_HEIGHT) // Overworld darkness
    
    ctx.globalCompositeOperation = 'destination-out'
    cars.forEach(car => {
      // Simplistic light hole
      const grad = ctx.createRadialGradient(car.position.x, car.position.y, 0, car.position.x, car.position.y, 150)
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.arc(car.position.x, car.position.y, 150, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
  }

  drawRainEffect(ctx: CanvasRenderingContext2D, frameCount: number): void {
    const { width, height } = ctx.canvas
    ctx.strokeStyle = 'rgba(174, 194, 224, 0.4)'
    ctx.lineWidth = 1
    for (let i = 0; i < 100; i++) {
      const x = (i * 123 + frameCount * 5) % width
      const y = (i * 456 + frameCount * 15) % height
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + 2, y + 10)
      ctx.stroke()
    }
  }

  drawVignetteEffect(ctx: CanvasRenderingContext2D): void {
    applyVignette(ctx, ctx.canvas.width, ctx.canvas.height, VIGNETTE_STRENGTH)
  }
}
