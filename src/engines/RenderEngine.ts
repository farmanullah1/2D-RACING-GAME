import { 
  GameState, Car, Camera, Vector2D, Particle, ParticleType, GameStatus, TileType, CarState, GameMode 
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

    // 1. Background
    this.drawBackground(ctx, camera, currentDayTime)

    // 2. Camera Transform Start
    applyCameraTransform(ctx, camera)

    // 3. Draw Track
    this.drawOffscreenTrack(ctx, offscreenTrack)
    
    // 5. Skid Marks
    this.drawSkidMarks(ctx, skidMarks)

    // Ghost Car
    if (ghostCar) {
      this.drawCar(ctx, ghostCar, false, state.isNight, 0.35)
    }

    // 5.5. Draw Combat Power-ups
    if (state.mode === GameMode.CarFights && state.powerUps) {
      state.powerUps.forEach(p => {
        if (p.active) {
          ctx.save()
          const floatOffset = Math.sin(state.frameCount * 0.06 + p.x) * 4
          ctx.translate(p.x, p.y + floatOffset)
          ctx.shadowColor = p.type === 'health' ? '#00ff88' : '#ff00ff'
          ctx.shadowBlur = 10
          ctx.rotate(state.frameCount * 0.02)
          
          if (p.type === 'health') {
            ctx.fillStyle = '#00ff88'
            ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill()
            ctx.strokeStyle = '#ffffff'
            ctx.lineWidth = 2.5
            ctx.beginPath(); ctx.moveTo(-5, -5); ctx.lineTo(5, 5); ctx.stroke()
          } else {
            ctx.fillStyle = '#ff00ff'
            ctx.fillRect(-5, -8, 10, 16)
            ctx.fillStyle = '#ffffff'
            ctx.fillRect(-2.5, -11, 5, 3)
          }
          ctx.restore()
        }
      })
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

    // 6.5. Draw Above-Car Health Bars (Combat Mode)
    if (state.mode === GameMode.CarFights) {
      const drawHealthBar = (car: Car) => {
        if (car.state === CarState.Crashed) return
        ctx.save()
        ctx.translate(car.position.x, car.position.y - 34)
        
        ctx.fillStyle = 'rgba(0,0,0,0.6)'
        ctx.fillRect(-18, -3, 36, 5)
        
        const healthRatio = Math.max(0, 1.0 - car.damageLevel)
        ctx.fillStyle = healthRatio > 0.5 ? '#00ff88' : healthRatio > 0.25 ? '#ffee00' : '#ff006e'
        ctx.fillRect(-18, -3, 36 * healthRatio, 5)
        
        ctx.strokeStyle = 'rgba(255,255,255,0.45)'
        ctx.lineWidth = 0.8
        ctx.strokeRect(-18, -3, 36, 5)
        ctx.restore()
      }
      aiDrivers.forEach(ai => drawHealthBar(ai.car))
      drawHealthBar(player)
    }

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

  drawCloudShadows(ctx: CanvasRenderingContext2D, camera: Camera, frameCount: number): void {
    ctx.save()
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)' // very soft cloud shadow
    
    const cloudSpeed = 0.45
    const driftX = (frameCount * cloudSpeed)
    const driftY = (frameCount * cloudSpeed * 0.35)
    
    // Render 5 large shifting clouds looping across map boundaries (up to 4000x4000)
    const clouds = [
      { x: 300 + driftX, y: 200 + driftY, rx: 260, ry: 130 },
      { x: 1400 + driftX, y: 700 + driftY, rx: 340, ry: 170 },
      { x: 2500 + driftX, y: 150 + driftY, rx: 280, ry: 140 },
      { x: 900 + driftX, y: 1600 + driftY, rx: 380, ry: 190 },
      { x: 1900 + driftX, y: 2100 + driftY, rx: 310, ry: 155 },
    ]
    
    clouds.forEach(c => {
      const mapX = c.x % 4200
      const mapY = c.y % 3200
      
      ctx.beginPath()
      ctx.ellipse(mapX, mapY, c.rx, c.ry, 0.35, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
  }

  drawDynamicDecorations(ctx: CanvasRenderingContext2D, grid: number[][], camera: Camera, frameCount: number): void {
    const TILE_SIZE = 64
    if (!grid || grid.length === 0) return

    // Viewport frustum culling boundaries
    const startCol = Math.max(0, Math.floor((camera.x - window.innerWidth / 2) / TILE_SIZE) - 2)
    const endCol = Math.min(grid[0].length - 1, Math.floor((camera.x + window.innerWidth / 2) / TILE_SIZE) + 2)
    const startRow = Math.max(0, Math.floor((camera.y - window.innerHeight / 2) / TILE_SIZE) - 2)
    const endRow = Math.min(grid.length - 1, Math.floor((camera.y + window.innerHeight / 2) / TILE_SIZE) + 2)

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        // Draw elegant wind turbines on certain Grass tiles
        if (grid[r][c] === TileType.Grass && (r * 7 + c * 13) % 17 === 0) {
          const x = c * TILE_SIZE + TILE_SIZE / 2
          const y = r * TILE_SIZE + TILE_SIZE / 2

          ctx.save()
          // Soft 3D mast shadow
          ctx.shadowColor = 'rgba(0,0,0,0.32)'
          ctx.shadowBlur = 4
          ctx.shadowOffsetX = 3
          ctx.shadowOffsetY = 4

          // Turbine mast (metallic white)
          ctx.strokeStyle = '#e2e8f0'
          ctx.lineWidth = 2.5
          ctx.beginPath()
          ctx.moveTo(x, y + 16)
          ctx.lineTo(x, y - 12)
          ctx.stroke()

          // Center rotating hub
          ctx.fillStyle = '#cbd5e1'
          ctx.beginPath()
          ctx.arc(x, y - 12, 3.2, 0, Math.PI * 2)
          ctx.fill()

          // Spinning blades
          const angle = (frameCount * 0.032) + (r * 0.6)
          ctx.strokeStyle = '#ffffff'
          ctx.lineWidth = 1.2

          for (let b = 0; b < 3; b++) {
            ctx.save()
            ctx.translate(x, y - 12)
            ctx.rotate(angle + (b * Math.PI * 2) / 3)
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(0, -18) // Blade length
            ctx.stroke()
            ctx.restore()
          }
          ctx.restore()
        }
      }
    }
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

      // 1. Body Roll & G-Force Simulation
      const rollAmount = car.angularVelocity * 2.8
      ctx.translate(0, rollAmount)
      ctx.scale(1, 1 - Math.abs(car.angularVelocity) * 0.06)

      // 2. Base metallic chassis paint gradient
      const bodyGrad = ctx.createLinearGradient(-CAR_HEIGHT/2, 0, CAR_HEIGHT/2, 0)
      bodyGrad.addColorStop(0, colorSet.accent)
      bodyGrad.addColorStop(0.3, colorSet.body)
      bodyGrad.addColorStop(0.7, colorSet.body)
      bodyGrad.addColorStop(1, colorSet.accent)
      ctx.fillStyle = bodyGrad
      
      // Aerodynamic rounded chassis shape
      roundedRect(ctx, -CAR_HEIGHT / 2, -CAR_WIDTH / 2, CAR_HEIGHT, CAR_WIDTH, 10)
      ctx.fill()

      // 3. Specular highlight paint sweeps (gloss reflection)
      const specGrad = ctx.createLinearGradient(-CAR_HEIGHT/2, -CAR_WIDTH/2, CAR_HEIGHT/2, CAR_WIDTH/2)
      specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.0)')
      specGrad.addColorStop(0.48, 'rgba(255, 255, 255, 0.0)')
      specGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.22)') // Sharp glossy glare
      specGrad.addColorStop(0.52, 'rgba(255, 255, 255, 0.0)')
      ctx.fillStyle = specGrad
      roundedRect(ctx, -CAR_HEIGHT / 2, -CAR_WIDTH / 2, CAR_HEIGHT, CAR_WIDTH, 10)
      ctx.fill()

      // 4. Aerodynamic Hood Vents (Carbon-Fiber slots)
      ctx.fillStyle = 'rgba(15, 15, 20, 0.75)'
      ctx.fillRect(CAR_HEIGHT / 6, -CAR_WIDTH / 5, 8, 2.5)
      ctx.fillRect(CAR_HEIGHT / 6, CAR_WIDTH / 5 - 2.5, 8, 2.5)
      ctx.fillRect(CAR_HEIGHT / 4, -CAR_WIDTH / 4, 6, 2)
      ctx.fillRect(CAR_HEIGHT / 4, CAR_WIDTH / 4 - 2, 6, 2)

      // 5. Carbon-Fiber Rear Spoiler / Wing
      ctx.fillStyle = '#111116' // Carbon black
      ctx.fillRect(-CAR_HEIGHT / 2 - 4, -CAR_WIDTH / 2 - 2, 5, CAR_WIDTH + 4) // Wing blade
      // Spoiler mount brackets
      ctx.fillStyle = '#22222b'
      ctx.fillRect(-CAR_HEIGHT / 2, -CAR_WIDTH / 4, 4, 2)
      ctx.fillRect(-CAR_HEIGHT / 2, CAR_WIDTH / 4 - 2, 4, 2)

      // 6. 3D Cabin Canopy
      ctx.fillStyle = '#15151e' // Sleek black cabin frame
      roundedRect(ctx, -CAR_HEIGHT / 6, -CAR_WIDTH / 3, CAR_HEIGHT / 2, (CAR_WIDTH * 2) / 3, 6)
      ctx.fill()

      // Windshield glossy glass
      const glassGrad = ctx.createLinearGradient(0, -CAR_WIDTH/3, 0, CAR_WIDTH/3)
      glassGrad.addColorStop(0, 'rgba(110, 180, 210, 0.85)')
      glassGrad.addColorStop(0.5, 'rgba(150, 220, 245, 0.85)')
      glassGrad.addColorStop(1, 'rgba(110, 180, 210, 0.85)')
      ctx.fillStyle = glassGrad
      ctx.fillRect(CAR_HEIGHT / 10, -CAR_WIDTH / 3 + 2.5, CAR_HEIGHT / 6, (CAR_WIDTH * 2) / 3 - 5)

      // Specular cabin stripes (glare reflection)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(CAR_HEIGHT / 10 + 2, -CAR_WIDTH / 3 + 5)
      ctx.lineTo(CAR_HEIGHT / 4 - 2, 0)
      ctx.stroke()

      // 7. Dynamic Animated Alloy Wheels (4 wheels)
      const drawWheel = (wx: number, wy: number, steer: boolean) => {
        ctx.save()
        ctx.translate(wx, wy)
        // If front wheels, apply visual steering angle based on angular velocity
        if (steer) {
          ctx.rotate(car.angularVelocity * 0.3)
        }
        
        // Spin wheels based on speed
        const spinAngle = (car.wheelRotation || 0) * (wx > 0 ? 1 : 0.8)
        ctx.rotate(spinAngle)

        // Tires
        ctx.fillStyle = '#18181e'
        ctx.fillRect(-8, -4, 16, 8)

        // Rims (Alloy silver center)
        ctx.fillStyle = colorSet.rim || '#dee2e6'
        ctx.beginPath()
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2)
        ctx.fill()

        // 3D spokes on Rims
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)'
        ctx.lineWidth = 1
        for (let s = 0; s < 4; s++) {
          ctx.beginPath()
          ctx.moveTo(0, 0)
          ctx.lineTo(Math.cos(s * Math.PI / 2) * 3.5, Math.sin(s * Math.PI / 2) * 3.5)
          ctx.stroke()
        }
        ctx.restore()
      }

      const wheelX = CAR_HEIGHT / 3.5
      const wheelY = CAR_WIDTH / 2.2
      drawWheel(wheelX, -wheelY, true)  // Front Left
      drawWheel(wheelX, wheelY, true)   // Front Right
      drawWheel(-wheelX, -wheelY, false) // Rear Left
      drawWheel(-wheelX, wheelY, false)  // Rear Right

      // 8. Headlights (small bulbs)
      ctx.fillStyle = isNight ? '#ffee32' : '#ffffff'
      ctx.fillRect(CAR_HEIGHT / 2 - 3, -CAR_WIDTH / 2 + 3, 3, 5)
      ctx.fillRect(CAR_HEIGHT / 2 - 3, CAR_WIDTH / 2 - 8, 3, 5)
      
      // 9. Tail Lights / Brake Lights
      const isBraking = car.speed < 0 || car.state === CarState.Braking
      ctx.fillStyle = isBraking ? '#ff0055' : '#a80000'
      if (isBraking) {
        // Glowing red brake lights
        ctx.shadowColor = '#ff0055'
        ctx.shadowBlur = 8
      }
      ctx.fillRect(-CAR_HEIGHT / 2, -CAR_WIDTH / 2 + 3, 3, 4)
      ctx.fillRect(-CAR_HEIGHT / 2, CAR_WIDTH / 2 - 7, 3, 4)
      ctx.shadowBlur = 0 // Reset shadow

      // 10. Glowing dual chrome exhausts
      ctx.fillStyle = '#adb5bd'
      ctx.fillRect(-CAR_HEIGHT / 2 - 2, -5, 2, 2)
      ctx.fillRect(-CAR_HEIGHT / 2 - 2, 3, 2, 2)
      if (car.nitroActive) {
        ctx.fillStyle = '#00f5ff' // Plasma glow exhaust
        ctx.fillRect(-CAR_HEIGHT / 2 - 3, -5, 2, 2)
        ctx.fillRect(-CAR_HEIGHT / 2 - 3, 3, 2, 2)
      }
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

      switch (p.type) {
        case ParticleType.DriftSmoke:
        case ParticleType.ExhaustSmoke:
          // Fluffy smoke circles
          ctx.fillStyle = p.color || 'rgba(180, 180, 180, 0.3)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case ParticleType.DustCloud:
          // Fluffy dust clouds
          ctx.fillStyle = p.color || 'rgba(180, 140, 80, 0.3)'
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          break

        case ParticleType.NitroFlame:
          // Glowing elongated fire oval shooting backward
          ctx.translate(p.x, p.y)
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
          grad.addColorStop(0, '#ffffff')
          grad.addColorStop(0.2, '#ffee00')
          grad.addColorStop(0.6, '#ff6b00')
          grad.addColorStop(1.0, 'rgba(0, 245, 255, 0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.6, p.rotation || 0, 0, Math.PI * 2)
          ctx.fill()
          break

        case ParticleType.Spark:
          // Motion blurred bright streak along velocity vector
          ctx.strokeStyle = p.color || '#fff176'
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x - p.vx * 0.05, p.y - p.vy * 0.05)
          ctx.stroke()
          break

        case ParticleType.RainSplash:
          // Expanding ripple ring
          ctx.strokeStyle = p.color || 'rgba(0, 245, 255, 0.6)'
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * (1 + (1 - p.life) * 2), 0, Math.PI * 2)
          ctx.stroke()
          break

        case ParticleType.Confetti:
          // Rotating tiny colorful sheets
          ctx.fillStyle = p.color || '#ff006e'
          ctx.translate(p.x, p.y)
          ctx.rotate((p.rotation || 0) + p.life * 10)
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
          break

        default:
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
      }

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
