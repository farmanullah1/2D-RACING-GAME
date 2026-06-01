import { TileType } from "../types/game.types";
import { COLORS } from "../constants/graphicsConstants";
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT } from "../constants/gameConstants";

export const drawTile = (
  ctx: CanvasRenderingContext2D,
  tileType: TileType,
  col: number,
  row: number,
  variant: number,
  rotation: number
): void => {
  const x = col * TILE_SIZE
  const y = row * TILE_SIZE

  ctx.save()
  ctx.translate(x + TILE_SIZE / 2, y + TILE_SIZE / 2)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.translate(-TILE_SIZE / 2, -TILE_SIZE / 2)

  switch (tileType) {
    case TileType.Road:
      drawRoadTile(ctx, variant)
      break
    case TileType.Grass:
      drawGrassTile(ctx, variant)
      break
    case TileType.Gravel:
      drawGravelTile(ctx, variant)
      break
    case TileType.Wall:
      drawWallTile(ctx, variant)
      break
    case TileType.StartLine:
      drawStartLineTile(ctx, variant)
      break
    case TileType.Checkpoint:
      drawCheckpointTile(ctx, variant)
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

const drawRoadTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  const grad = ctx.createLinearGradient(0, 0, TILE_SIZE, TILE_SIZE)
  grad.addColorStop(0, COLORS.roadDark)
  grad.addColorStop(1, COLORS.roadLight)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // Micro-noise
  ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
  for (let i = 0; i < 20; i++) {
    const rx = ((variant * i + 567) % TILE_SIZE)
    const ry = ((variant * i * 3 + 123) % TILE_SIZE)
    ctx.fillRect(rx, ry, 1, 1)
  }

  // Lane markings
  if (variant % 4 === 0) {
    ctx.fillStyle = COLORS.laneMarkWhite
    ctx.fillRect(TILE_SIZE / 2 - 2, TILE_SIZE / 4, 4, 2)
    ctx.fillRect(TILE_SIZE / 2 - 2, (TILE_SIZE * 3) / 4, 4, 2)
  }
}

const drawGrassTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  const grad = ctx.createRadialGradient(TILE_SIZE / 2, TILE_SIZE / 2, 0, TILE_SIZE / 2, TILE_SIZE / 2, TILE_SIZE)
  grad.addColorStop(0, COLORS.grassLight)
  grad.addColorStop(1, COLORS.grassDark)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  // Texture
  ctx.strokeStyle = 'rgba(0,0,0,0.1)'
  ctx.lineWidth = 1
  for (let i = 0; i < 5; i++) {
    const offset = (variant * i * 13) % TILE_SIZE
    ctx.beginPath()
    ctx.moveTo(offset, 0)
    ctx.lineTo(offset, TILE_SIZE)
    ctx.stroke()
  }
}

const drawGravelTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  ctx.fillStyle = COLORS.gravelLight
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)

  for (let i = 0; i < 10; i++) {
    const rx = (variant * i * 17) % TILE_SIZE
    const ry = (variant * i * 31) % TILE_SIZE
    const size = 2 + (i % 3)
    ctx.fillStyle = i % 2 === 0 ? COLORS.gravelDark : COLORS.gravelLight
    ctx.beginPath()
    ctx.arc(rx, ry, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const drawWallTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  ctx.fillStyle = COLORS.wallColor
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  
  ctx.strokeStyle = 'rgba(255,255,255,0.2)'
  ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)
  
  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fillRect(0, 0, TILE_SIZE, 4)
}

const drawStartLineTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  drawRoadTile(ctx, variant)
  
  const size = 8
  for (let r = 0; r < TILE_SIZE / size; r++) {
    for (let c = 0; c < TILE_SIZE / size; c++) {
      if ((r + c) % 2 === 0) {
        ctx.fillStyle = 'white'
      } else {
        ctx.fillStyle = 'black'
      }
      ctx.fillRect(c * size, r * size, size, size)
    }
  }

  ctx.fillStyle = 'white'
  ctx.font = 'bold 10px Orbitron'
  ctx.textAlign = 'center'
  ctx.fillText('START / FINISH', TILE_SIZE / 2, TILE_SIZE / 2 + 4)
}

const drawCheckpointTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  drawRoadTile(ctx, variant)
  ctx.fillStyle = 'rgba(0, 245, 255, 0.3)'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  
  ctx.strokeStyle = '#00f5ff'
  ctx.setLineDash([4, 4])
  ctx.strokeRect(2, 2, TILE_SIZE - 4, TILE_SIZE - 4)
}

const drawPitLaneTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  ctx.fillStyle = '#2a2a4a'
  ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE)
  ctx.fillStyle = 'white'
  ctx.font = 'bold 12px Rajdhani'
  ctx.textAlign = 'center'
  ctx.fillText('PIT', TILE_SIZE / 2, TILE_SIZE / 2 + 5)
}

const drawRumbleStripTile = (ctx: CanvasRenderingContext2D, variant: number) => {
  const stripeW = 8
  for (let i = 0; i < TILE_SIZE * 2; i += stripeW * 2) {
    ctx.fillStyle = COLORS.curb1
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + stripeW, 0)
    ctx.lineTo(0, i + stripeW)
    ctx.lineTo(0, i)
    ctx.fill()
    
    ctx.fillStyle = COLORS.curb2
    ctx.beginPath()
    ctx.moveTo(i + stripeW, 0)
    ctx.lineTo(i + stripeW * 2, 0)
    ctx.lineTo(0, i + stripeW * 2)
    ctx.lineTo(0, i + stripeW)
    ctx.fill()
  }
}

export const drawTrackDecorations = (ctx: CanvasRenderingContext2D, col: number, row: number): void => {
  const x = col * TILE_SIZE
  const y = row * TILE_SIZE
  const variant = (col + row) % 3

  if (variant === 0) {
    // Tire stack
    ctx.fillStyle = '#111'
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 12, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(x + 16, y + 16, 6, 0, Math.PI * 2); ctx.fillStyle = '#222'; ctx.fill()
  } else if (variant === 1) {
    // Cone
    ctx.fillStyle = '#ff6b00'
    ctx.beginPath()
    ctx.moveTo(x + 10, y + TILE_SIZE - 10)
    ctx.lineTo(x + TILE_SIZE - 10, y + TILE_SIZE - 10)
    ctx.lineTo(x + TILE_SIZE / 2, y + 10)
    ctx.fill()
  }
}

export const buildOffscreenTrack = (grid: number[][]): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = GRID_WIDTH * TILE_SIZE
  canvas.height = GRID_HEIGHT * TILE_SIZE
  const ctx = canvas.getContext('2d')!

  for (let r = 0; r < GRID_HEIGHT; r++) {
    for (let c = 0; c < GRID_WIDTH; c++) {
      drawTile(ctx, grid[r][c], c, r, (r * GRID_WIDTH + c), 0)
      if (grid[r][c] === TileType.Grass && (r + c) % 8 === 0) {
        drawTrackDecorations(ctx, c, r)
      }
    }
  }

  return canvas
}
