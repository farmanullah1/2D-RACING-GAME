import { TileType } from "../types/game.types";
import { COLORS } from "../constants/graphicsConstants";
import { TILE_SIZE } from "../constants/gameConstants";

export const drawTile = (
  ctx: CanvasRenderingContext2D,
  tileType: TileType,
  col: number,
  row: number,
  variant: number,
  rotation: number,
  theme: string = 'forest'
): void => {
  const x = col * TILE_SIZE
  const y = row * TILE_SIZE

  ctx.save()
  ctx.translate(x + TILE_SIZE / 2, y + TILE_SIZE / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-TILE_SIZE / 2, -TILE_SIZE / 2)

  switch (tileType) {
    case TileType.Road:
      drawRoadTile(ctx, col, row, variant, theme)
      break
    case TileType.Grass:
      drawGrassTile(ctx, col, row, variant, theme)
      break
    case TileType.Gravel:
      drawGravelTile(ctx, variant)
      break
    case TileType.Wall:
      drawWallTile(ctx, variant, theme)
      break
    case TileType.StartLine:
      drawStartLineTile(ctx, col, row, variant, theme)
      break
    case TileType.Checkpoint:
      drawCheckpointTile(ctx, variant, theme)
      break
    case TileType.PitLane:
      drawPitLaneTile(ctx, variant)
      break
    case TileType.RumbleStrip:
      drawRumbleStripTile(ctx, variant)
      break
  }

  ctx.restore()
}

const drawRoadTile = (ctx: CanvasRenderingContext2D, col: number, row: number, variant: number, theme: string = 'forest') => {
  if (theme === 'neon') {
    // Futuristic cyber road
    ctx.fillStyle = '#04020a'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    ctx.strokeStyle = 'rgba(0, 245, 255, 0.18)'
    ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(TILE_SIZE, 0); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, TILE_SIZE / 2); ctx.lineTo(TILE_SIZE, TILE_SIZE / 2); ctx.stroke()
    return
  }

  if (theme === 'arctic') {
    // Icy slate road
    const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
    grad.addColorStop(0, '#1c2836')
    grad.addColorStop(0.5, '#243447')
    grad.addColorStop(1, '#1b2533')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    // Glistening frost lines
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(TILE_SIZE, TILE_SIZE)
    ctx.stroke()

    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
    for (let i = 0; i < 20; i++) {
      const rx = ((variant * i + 37) % TILE_SIZE)
      const ry = ((variant * i * 3 + 89) % TILE_SIZE)
      ctx.fillRect(rx, ry, 1.5, 1.5)
    }
    return
  }

  if (theme === 'volcano') {
    // Dark volcanic basalt road
    const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
    grad.addColorStop(0, '#0c0b0e')
    grad.addColorStop(0.5, '#131217')
    grad.addColorStop(1, '#09080b')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    // Volcanic embers
    ctx.fillStyle = 'rgba(255, 77, 0, 0.28)'
    for (let i = 0; i < 25; i++) {
      const rx = ((variant * i + 49) % TILE_SIZE)
      const ry = ((variant * i * 5 + 67) % TILE_SIZE)
      ctx.fillRect(rx, ry, 2, 2)
    }
    return
  }

  // Base dark asphalt with subtle grit gradient
  const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
  grad.addColorStop(0, '#151522')
  grad.addColorStop(0.5, '#1e1e2d')
  grad.addColorStop(1, '#181826')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // 1. Fine-grain asphalt aggregate noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
  for (let i = 0; i < 40; i++) {
    const rx = ((variant * i + 853) % TILE_SIZE)
    const ry = ((variant * i * 7 + 347) % TILE_SIZE)
    ctx.fillRect(rx, ry, 1.2, 1.2)
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)'
  for (let i = 0; i < 30; i++) {
    const rx = ((variant * i * 3 + 129) % TILE_SIZE)
    const ry = ((variant * i * 5 + 613) % TILE_SIZE)
    ctx.fillRect(rx, ry, 1.5, 1.5)
  }

  // 2. Pre-baked dark racing tire skid wear lines
  if ((col + row) % 3 === 0) {
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.lineWidth = 6
    ctx.beginPath()
    ctx.arc(TILE_SIZE * 1.5, TILE_SIZE * 0.5, TILE_SIZE * 1.2, Math.PI * 0.8, Math.PI * 1.2)
    ctx.stroke()
  }

  // 3. Lane markings
  if (variant % 4 === 0) {
    ctx.fillStyle = 'rgba(235, 235, 245, 0.75)'
    ctx.fillRect(TILE_SIZE / 2 - 2, TILE_SIZE / 6, 4, TILE_SIZE / 4)
    ctx.fillRect(TILE_SIZE / 2 - 2, (TILE_SIZE * 7) / 12, 4, TILE_SIZE / 4)
  }
}

const drawGrassTile = (ctx: CanvasRenderingContext2D, col: number, row: number, variant: number, theme: string = 'forest') => {
  if (theme === 'desert') {
    // Beautiful golden sand dunes
    const grad = ctx.createRadialGradient(TILE_SIZE / 2, TILE_SIZE / 2, 2, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE * 0.8)
    grad.addColorStop(0, '#e9c46a') // desert sand yellow
    grad.addColorStop(0.5, '#f4a261') // warm orange dunes
    grad.addColorStop(1, '#e76f51') // deep canyon terracotta
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    // Sand ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.lineWidth = 1.2
    for (let i = 0; i < 4; i++) {
      const offset = (variant * i * 9) % TILE_SIZE
      ctx.beginPath()
      ctx.arc(offset, TILE_SIZE / 2, TILE_SIZE / 3, 0, Math.PI, true)
      ctx.stroke()
    }
    return
  }

  if (theme === 'neon') {
    // Cyber green grid lines!
    ctx.fillStyle = '#020008'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)' // Cyber cyan grid outline
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE)
    return
  }

  if (theme === 'arctic') {
    // Glistening snow/ice fields
    const grad = ctx.createRadialGradient(TILE_SIZE / 2, TILE_SIZE / 2, 2, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE * 0.8)
    grad.addColorStop(0, '#ffffff')
    grad.addColorStop(0.5, '#e3f7fa')
    grad.addColorStop(1, '#bde6ed')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    // Snowflake particles (procedural crystals)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      const rx = (variant * i * 23 + 17) % TILE_SIZE
      const ry = (variant * i * 19 + 29) % TILE_SIZE
      ctx.beginPath(); ctx.moveTo(rx - 3, ry); ctx.lineTo(rx + 3, ry); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(rx, ry - 3); ctx.lineTo(rx, ry + 3); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(rx - 2, ry - 2); ctx.lineTo(rx + 2, ry + 2); ctx.stroke()
    }

    // Ice cracks
    ctx.strokeStyle = 'rgba(0, 200, 255, 0.16)'
    ctx.beginPath()
    ctx.moveTo(0, TILE_SIZE / 3)
    ctx.lineTo(TILE_SIZE / 2, TILE_SIZE / 2)
    ctx.lineTo(TILE_SIZE, TILE_SIZE / 2 - 5)
    ctx.stroke()
    return
  }

  if (theme === 'volcano') {
    // Dark volcanic basalt ash
    const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
    grad.addColorStop(0, '#100f12')
    grad.addColorStop(1, '#17161c')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    // Flowing molten magma crack
    ctx.save()
    ctx.shadowColor = '#ff4d00'
    ctx.shadowBlur = 8
    ctx.strokeStyle = 'rgba(255, 120, 0, 0.85)'
    ctx.lineWidth = 3
    ctx.beginPath()
    const seed = (col * 7 + row * 13) % 4
    if (seed === 0) {
      ctx.moveTo(0, TILE_SIZE / 2)
      ctx.lineTo(TILE_SIZE / 3, TILE_SIZE / 2 - 5)
      ctx.lineTo(TILE_SIZE * 0.7, TILE_SIZE / 2 + 5)
      ctx.lineTo(TILE_SIZE, TILE_SIZE / 2)
    } else if (seed === 1) {
      ctx.moveTo(TILE_SIZE / 2, 0)
      ctx.lineTo(TILE_SIZE / 2 - 6, TILE_SIZE / 3)
      ctx.lineTo(TILE_SIZE / 2 + 4, TILE_SIZE * 0.7)
      ctx.lineTo(TILE_SIZE / 2, TILE_SIZE)
    } else if (seed === 2) {
      ctx.moveTo(0, 0)
      ctx.lineTo(TILE_SIZE / 2, TILE_SIZE / 2)
      ctx.lineTo(TILE_SIZE, TILE_SIZE)
    } else {
      ctx.moveTo(TILE_SIZE, 0)
      ctx.lineTo(TILE_SIZE / 2, TILE_SIZE / 2)
      ctx.lineTo(0, TILE_SIZE)
    }
    ctx.stroke()

    // Inner bright yellow magma core
    ctx.shadowBlur = 0
    ctx.strokeStyle = '#ffee00'
    ctx.lineWidth = 1.0
    ctx.stroke()
    ctx.restore()
    return
  }

  // Rich organic grass gradient
  const grad = ctx.createRadialGradient(TILE_SIZE / 2, TILE_SIZE / 2, 2, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE * 0.8)
  grad.addColorStop(0, '#1c4524')
  grad.addColorStop(0.5, '#16381c')
  grad.addColorStop(1, '#0e2613')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // 1. Shaded organic leaf shapes/specks
  ctx.fillStyle = 'rgba(40, 95, 48, 0.45)'
  for (let i = 0; i < 15; i++) {
    const rx = (variant * i * 19) % TILE_SIZE
    const ry = (variant * i * 37) % TILE_SIZE
    ctx.beginPath()
    ctx.ellipse(rx, ry, 3, 1.5, (variant + i) * 0.2, 0, Math.PI * 2)
    ctx.fill()
  }

  // 2. Darker leaf patches
  ctx.fillStyle = 'rgba(10, 30, 15, 0.35)'
  for (let i = 0; i < 10; i++) {
    const rx = (variant * i * 13) % TILE_SIZE
    const ry = (variant * i * 53) % TILE_SIZE
    ctx.beginPath()
    ctx.arc(rx, ry, 2, 0, Math.PI * 2)
    ctx.fill()
  }
}

const drawGravelTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  // Sandy rock base
  const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
  grad.addColorStop(0, '#5e4e3e')
  grad.addColorStop(1, '#473a2e')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // Render highly-detailed distinct pebbles with drop shadows
  for (let i = 0; i < 22; i++) {
    const rx = (variant * i * 23 + 49) % TILE_SIZE
    const ry = (variant * i * 47 + 81) % TILE_SIZE
    const r = 2.5 + (i % 3)
    const seed = (variant + i) % 4

    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowBlur = 2
    ctx.shadowOffsetX = 1
    ctx.shadowOffsetY = 1.5

    if (seed === 0) ctx.fillStyle = '#8f7b6b'
    else if (seed === 1) ctx.fillStyle = '#7a6656'
    else if (seed === 2) ctx.fillStyle = '#4f3e33'
    else ctx.fillStyle = '#baa99b'

    ctx.beginPath()
    ctx.ellipse(rx, ry, r, r * 0.8, (variant + i) * 0.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

const drawWallTile = (ctx: CanvasRenderingContext2D, variant: number, theme: string = 'forest') => {
  if (theme === 'neon') {
    ctx.fillStyle = '#080015'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    ctx.strokeStyle = '#ff006e' // Neon pink glowing grid rail
    ctx.lineWidth = 3
    ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)
    
    // Add specular white neon highlight
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, TILE_SIZE, 3)
    return
  }

  if (theme === 'arctic') {
    // High-tech glowing frozen barrier
    ctx.fillStyle = '#1e384d'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    // Inner icy core
    ctx.fillStyle = '#397fa6'
    ctx.fillRect(4, 4, TILE_SIZE - 8, TILE_SIZE - 8)

    // Frosted bevels
    ctx.fillStyle = 'rgba(255,255,255,0.45)'
    ctx.fillRect(4, 4, TILE_SIZE - 8, 3)
    ctx.fillRect(4, 4, 3, TILE_SIZE - 8)

    // Cyan neon light band
    ctx.save()
    ctx.shadowColor = '#00f5ff'
    ctx.shadowBlur = 6
    ctx.fillStyle = '#00f5ff'
    ctx.fillRect(6, TILE_SIZE / 2 - 2, TILE_SIZE - 12, 4)
    ctx.restore()
    return
  }

  if (theme === 'volcano') {
    // Obsidian ash barrier block
    ctx.fillStyle = '#1c1b1f'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    ctx.fillStyle = '#2c2b30'
    ctx.fillRect(4, 4, TILE_SIZE - 8, TILE_SIZE - 8)

    // Lava safety red stripes
    ctx.save()
    ctx.shadowColor = '#ff2b00'
    ctx.shadowBlur = 6
    ctx.fillStyle = '#ff3c00'
    const stripeW = 8
    for (let i = 8; i < TILE_SIZE - 8; i += stripeW * 3) {
      ctx.beginPath()
      ctx.moveTo(i, 6)
      ctx.lineTo(i + stripeW, 6)
      ctx.lineTo(i + stripeW + 4, TILE_SIZE - 6)
      ctx.lineTo(i + 4, TILE_SIZE - 6)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
    return
  }

  // Base concrete grey barrier
  ctx.fillStyle = '#2d2d3d'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // 3D Block look: Inner beveling
  ctx.fillStyle = '#424256'
  ctx.fillRect(0, 0, TILE_SIZE, 5)
  ctx.fillRect(0, 0, 5, TILE_SIZE)

  ctx.fillStyle = '#1b1b26'
  ctx.fillRect(0, TILE_SIZE - 5, TILE_SIZE, 5)
  ctx.fillRect(TILE_SIZE - 5, 0, 5, TILE_SIZE)

  // Safety chevrons (Yellow & Black)
  ctx.fillStyle = '#ffb703'
  const stripeW = 8
  for (let i = 8; i < TILE_SIZE - 8; i += stripeW * 3) {
    ctx.beginPath()
    ctx.moveTo(i, 8)
    ctx.lineTo(i + stripeW, 8)
    ctx.lineTo(i + stripeW + 6, TILE_SIZE - 8)
    ctx.lineTo(i + 6, TILE_SIZE - 8)
    ctx.closePath()
    ctx.fill()
  }

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  ctx.lineWidth = 1
  ctx.strokeRect(5, 5, TILE_SIZE - 10, TILE_SIZE - 10)
}

const drawStartLineTile = (ctx: CanvasRenderingContext2D, col: number, row: number, variant: number, theme: string = 'forest') => {
  drawRoadTile(ctx, col, row, variant, theme)
  
  const size = 8
  const checkRows = TILE_SIZE / size
  const checkCols = TILE_SIZE / size
  
  for (let r = 2; r < checkRows - 2; r++) {
    for (let c = 0; c < checkCols; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 15, 25, 0.85)'
      ctx.fillRect(c * size, r * size, size, size)
    }
  }

  if (theme === 'neon') ctx.fillStyle = '#ff006e'
  else if (theme === 'volcano') ctx.fillStyle = '#ff3300'
  else if (theme === 'arctic') ctx.fillStyle = '#00f5ff'
  else ctx.fillStyle = '#ffee00'
  ctx.fillRect(0, size * 2, TILE_SIZE, 2)
  ctx.fillRect(0, TILE_SIZE - size * 2, TILE_SIZE, 2)

  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.9)'
  ctx.shadowBlur = 4
  ctx.fillStyle = '#ffffff'
  ctx.font = 'black 9px Orbitron'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('START / FINISH', TILE_SIZE / 2, TILE_SIZE / 2)
  ctx.restore()
}

const drawCheckpointTile = (ctx: CanvasRenderingContext2D, variant: number, theme: string = 'forest') => {
  if (theme === 'neon') {
    ctx.fillStyle = '#1e002a'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    ctx.fillStyle = 'rgba(255, 0, 110, 0.15)'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    
    ctx.strokeStyle = '#ff006e' // Neon pink grid line
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)

    ctx.save()
    ctx.shadowColor = '#ff006e'
    ctx.shadowBlur = 8
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 10px Orbitron'
    ctx.textAlign = 'center'
    ctx.fillText('PORTAL', TILE_SIZE / 2, TILE_SIZE / 2 + 3)
    ctx.restore()
    return
  }

  if (theme === 'arctic') {
    // Ice Gate portal
    ctx.fillStyle = '#0c1a26'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    ctx.fillStyle = 'rgba(0, 245, 255, 0.12)'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    ctx.strokeStyle = '#00f5ff'
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)

    ctx.save()
    ctx.shadowColor = '#00f5ff'
    ctx.shadowBlur = 8
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 9px Orbitron'
    ctx.textAlign = 'center'
    ctx.fillText('ICE GATE', TILE_SIZE / 2, TILE_SIZE / 2 + 3)
    ctx.restore()
    return
  }

  if (theme === 'volcano') {
    // Lava arch portal
    ctx.fillStyle = '#1f0d06'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
    ctx.fillStyle = 'rgba(255, 110, 0, 0.15)'
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

    ctx.strokeStyle = '#ff6b00'
    ctx.lineWidth = 2
    ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)

    ctx.save()
    ctx.shadowColor = '#ff6b00'
    ctx.shadowBlur = 8
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 9px Orbitron'
    ctx.textAlign = 'center'
    ctx.fillText('LAVA ARCH', TILE_SIZE / 2, TILE_SIZE / 2 + 3)
    ctx.restore()
    return
  }

  // Road base
  const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
  grad.addColorStop(0, '#111827')
  grad.addColorStop(1, '#0f172a')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = 'rgba(0, 245, 255, 0.16)'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.strokeStyle = 'rgba(0, 245, 255, 0.35)'
  ctx.lineWidth = 1
  for (let i = 8; i < TILE_SIZE; i += 16) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, TILE_SIZE); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(TILE_SIZE, i); ctx.stroke()
  }
  
  ctx.strokeStyle = '#00f5ff'
  ctx.lineWidth = 2.5
  ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)

  ctx.save()
  ctx.shadowColor = '#00f5ff'
  ctx.shadowBlur = 6
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 10px Orbitron'
  ctx.textAlign = 'center'
  ctx.fillText('CHECKPOINT', TILE_SIZE / 2, TILE_SIZE / 2 + 3)
  ctx.restore()
}

const drawPitLaneTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  ctx.fillStyle = '#222233'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  ctx.fillStyle = 'rgba(0,0,0,0.15)'
  for (let i = 0; i < TILE_SIZE; i += 8) {
    ctx.fillRect(i, 0, 1, TILE_SIZE)
    ctx.fillRect(0, i, TILE_SIZE, 1)
  }

  ctx.fillStyle = '#ff6b00'
  ctx.fillRect(0, 0, TILE_SIZE, 3)
  ctx.fillRect(0, TILE_SIZE - 3, TILE_SIZE, 3)

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
  ctx.font = 'black 11px Rajdhani'
  ctx.textAlign = 'center'
  ctx.fillText('PIT LIMIT', TILE_SIZE / 2, TILE_SIZE / 2 + 4)
}

const drawRumbleStripTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  const stripeW = 8
  
  ctx.fillStyle = '#1e1e24'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  for (let i = -TILE_SIZE; i < TILE_SIZE * 2; i += stripeW * 2) {
    ctx.fillStyle = COLORS.curb1
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + stripeW, 0)
    ctx.lineTo(i + stripeW - 20, TILE_SIZE)
    ctx.lineTo(i - 20, TILE_SIZE)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(0,0,0,0.25)'
    ctx.beginPath()
    ctx.moveTo(i - 20, TILE_SIZE)
    ctx.lineTo(i + stripeW - 20, TILE_SIZE)
    ctx.lineTo(i + stripeW - 20, TILE_SIZE - 3)
    ctx.lineTo(i - 20, TILE_SIZE - 3)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = COLORS.curb2
    ctx.beginPath()
    ctx.moveTo(i + stripeW, 0)
    ctx.lineTo(i + stripeW * 2, 0)
    ctx.lineTo(i + stripeW * 2 - 20, TILE_SIZE)
    ctx.lineTo(i + stripeW - 20, TILE_SIZE)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fillRect(i + stripeW, 0, stripeW, 2)
  }
}

export const drawTrackDecorations = (ctx: CanvasRenderingContext2D, col: number, row: number): void => {
  const x = col * TILE_SIZE
  const y = row * TILE_SIZE
  const variant = (col + row) % 3

  if (variant === 0) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
    ctx.shadowBlur = 5
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 3

    ctx.fillStyle = '#111116'
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 11, 0, Math.PI * 2); ctx.fill()
    ctx.strokeStyle = '#25252b'
    ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 8, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = '#0a0a0c'
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 5, 0, Math.PI * 2); ctx.fill()

    ctx.fillStyle = '#1b1b22'
    ctx.beginPath(); ctx.arc(x + 22, y + 24, 11, 0, Math.PI * 2); ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#0d0d10'
    ctx.beginPath(); ctx.arc(x + 22, y + 24, 5, 0, Math.PI * 2); ctx.fill()
    ctx.restore()
  } else if (variant === 1) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowBlur = 3
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2

    ctx.fillStyle = '#c84b00'
    ctx.fillRect(x + 10, y + TILE_SIZE - 20, 24, 6)

    ctx.fillStyle = '#ff6b00'
    ctx.beginPath()
    ctx.moveTo(x + 13, y + TILE_SIZE - 20)
    ctx.lineTo(x + 31, y + TILE_SIZE - 20)
    ctx.lineTo(x + 22, y + 12)
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.moveTo(x + 17, y + TILE_SIZE - 26)
    ctx.lineTo(x + 27, y + TILE_SIZE - 26)
    ctx.lineTo(x + 25, y + TILE_SIZE - 34)
    ctx.lineTo(x + 19, y + TILE_SIZE - 34)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }
}

export const buildOffscreenTrack = (grid: number[][], theme: string = 'forest'): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const gridHeight = grid.length
  const gridWidth = grid[0].length
  canvas.width = gridWidth * TILE_SIZE
  canvas.height = gridHeight * TILE_SIZE
  const ctx = canvas.getContext('2d')!

  for (let r = 0; r < gridHeight; r++) {
    for (let c = 0; c < gridWidth; c++) {
      drawTile(ctx, grid[r][c], c, r, (r * gridWidth + c), 0, theme)
      if (grid[r][c] === TileType.Grass && (r + c) % 8 === 0) {
        drawTrackDecorations(ctx, c, r)
      }
    }
  }

  return canvas
}
