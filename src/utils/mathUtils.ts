import { Vector2D } from "../types/game.types"

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value))

export const angleDiff = (a: number, b: number): number => {
  const diff = (b - a + Math.PI) % (Math.PI * 2) - Math.PI
  return diff < -Math.PI ? diff + Math.PI * 2 : diff
}

export const normalizeAngle = (a: number): number => {
  let angle = a % (Math.PI * 2)
  if (angle > Math.PI) angle -= Math.PI * 2
  if (angle < -Math.PI) angle += Math.PI * 2
  return angle
}

export const vecAdd = (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y })
export const vecSub = (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y })
export const vecScale = (v: Vector2D, s: number): Vector2D => ({ x: v.x * s, y: v.y * s })
export const vecMag = (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y)
export const vecNorm = (v: Vector2D): Vector2D => {
  const mag = vecMag(v)
  return mag === 0 ? { x: 0, y: 0 } : vecScale(v, 1 / mag)
}
export const vecDot = (a: Vector2D, b: Vector2D): number => a.x * b.x + a.y * b.y

export const vecRotate = (v: Vector2D, angle: number): Vector2D => {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: v.x * cos - v.y * sin,
    y: v.x * sin + v.y * cos
  }
}

export const vecDist = (a: Vector2D, b: Vector2D): number => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

export const smoothstep = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export const lerpAngle = (a: number, b: number, t: number): number => {
  const diff = angleDiff(a, b)
  return normalizeAngle(a + diff * t)
}

export const randomRange = (min: number, max: number): number => Math.random() * (max - min) + min
export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min
export const randomSign = (): number => Math.random() > 0.5 ? 1 : -1

export const worldToTile = (worldX: number, worldY: number, tileSize: number) => ({
  col: Math.floor(worldX / tileSize),
  row: Math.floor(worldY / tileSize)
})

export const tileToWorld = (col: number, row: number, tileSize: number): Vector2D => ({
  x: (col + 0.5) * tileSize,
  y: (row + 0.5) * tileSize
})
