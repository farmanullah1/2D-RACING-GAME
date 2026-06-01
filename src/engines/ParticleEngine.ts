import { Particle, ParticleType, Car, Vector2D } from "../types/game.types";
import { 
  PARTICLE_MAX, SKID_MARK_MAX, SKID_MARK_LIFETIME 
} from "../constants/gameConstants";
import { vecRotate, vecAdd, randomRange } from "../utils/mathUtils";

interface EmitOptions {
  x: number; y: number
  count: number
  angle?: number
  spread?: number
  speedMin?: number
  speedMax?: number
  lifeMin?: number
  lifeMax?: number
  sizeMin?: number
  sizeMax?: number
  color?: string
  gravity?: number
  fadeOut?: boolean
  rotation?: number
  rotationSpeed?: number
}

export class ParticleEngine {
  private pool: Particle[] = []
  private skidMarks: Particle[] = []

  constructor() {
    // Pre-allocate pool
    for (let i = 0; i < PARTICLE_MAX; i++) {
      this.pool.push(this.createEmptyParticle())
    }
  }

  private createEmptyParticle(): Particle {
    return {
      x: 0, y: 0, vx: 0, vy: 0,
      life: 0, maxLife: 0,
      size: 0, color: '', alpha: 0,
      type: ParticleType.ExhaustSmoke
    }
  }

  emit(type: ParticleType, options: EmitOptions): void {
    let emitted = 0
    for (let i = 0; i < PARTICLE_MAX && emitted < options.count; i++) {
      if (this.pool[i].life <= 0) {
        const p = this.pool[i]
        const angle = (options.angle || 0) + (Math.random() - 0.5) * (options.spread || 0)
        const speed = randomRange(options.speedMin || 0, options.speedMax || 0)
        const life = randomRange(options.lifeMin || 1, options.lifeMax || 1)

        p.x = options.x
        p.y = options.y
        p.vx = Math.cos(angle) * speed
        p.vy = Math.sin(angle) * speed
        p.life = 1.0
        p.maxLife = life
        p.size = randomRange(options.sizeMin || 1, options.sizeMax || 1)
        p.color = options.color || 'white'
        p.alpha = 1.0
        p.type = type
        p.rotation = options.rotation || 0
        p.rotationSpeed = options.rotationSpeed || 0
        
        emitted++
      }
    }
  }

  update(delta: number): void {
    for (let i = 0; i < PARTICLE_MAX; i++) {
      const p = this.pool[i]
      if (p.life > 0) {
        p.x += p.vx * delta
        p.y += p.vy * delta
        p.life -= delta / p.maxLife
        p.alpha = p.life
        
        if (p.type === ParticleType.Spark) {
          p.vy += 200 * delta // gravity
        }
      }
    }

    // Update skid marks
    for (let i = this.skidMarks.length - 1; i >= 0; i--) {
      const p = this.skidMarks[i]
      p.life -= delta / SKID_MARK_LIFETIME
      p.alpha = p.life * 0.7
      if (p.life <= 0) {
        this.skidMarks.splice(i, 1)
      }
    }
  }

  updateSkidMarks(car: Car, delta: number): void {
    const isDrifting = car.state === 3 // Drifting
    const isBrakingHard = car.speed > 200 && car.state === 2 // Braking

    if (isDrifting || isBrakingHard) {
      const rl = vecAdd(car.position, vecRotate({ x: -10, y: 15 }, car.angle))
      const rr = vecAdd(car.position, vecRotate({ x: 10, y: 15 }, car.angle))
      
      this.addSkidMark(rl.x, rl.y, car.angle)
      this.addSkidMark(rr.x, rr.y, car.angle)
    }
  }

  private addSkidMark(x: number, y: number, angle: number): void {
    if (this.skidMarks.length >= SKID_MARK_MAX) {
      this.skidMarks.shift()
    }
    this.skidMarks.push({
      x, y, vx: 0, vy: 0,
      life: 1.0, maxLife: SKID_MARK_LIFETIME,
      size: 14, color: 'rgba(0,0,0,', alpha: 0.7,
      type: ParticleType.SkidMark,
      rotation: angle
    })
  }

  getParticles(): Particle[] {
    return this.pool.filter(p => p.life > 0)
  }

  getSkidMarks(): Particle[] {
    return this.skidMarks
  }

  drawParticle(ctx: CanvasRenderingContext2D, p: Particle): void {
    ctx.save()
    ctx.globalAlpha = p.alpha
    ctx.fillStyle = p.color
    
    if (p.type === ParticleType.SkidMark) {
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation || 0)
      ctx.fillRect(-p.size / 2, -3, p.size, 6)
    } else {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }
}
