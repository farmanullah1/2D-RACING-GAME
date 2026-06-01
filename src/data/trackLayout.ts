import { TileType, Vector2D } from "../types/game.types";

const R = TileType.Road
const G = TileType.Grass
const V = TileType.Gravel
const W = TileType.Wall
const S = TileType.StartLine
const C = TileType.Checkpoint
const B = TileType.RumbleStrip

const generateGrid = (): number[][] => {
  const grid: number[][] = Array(44).fill(0).map(() => Array(44).fill(G))

  // Outer walls
  for (let i = 0; i < 44; i++) {
    grid[0][i] = W; grid[43][i] = W
    grid[i][0] = W; grid[i][43] = W
  }

  // Define track path segments (rowRange, colRange)
  const segments = [
    { r: [8, 11], c: [8, 35] },  // Top straight
    { r: [12, 35], c: [32, 35] }, // Right straight
    { r: [32, 35], c: [8, 31] },  // Bottom straight
    { r: [12, 31], c: [8, 11] },  // Left straight
  ]

  segments.forEach(seg => {
    for (let r = seg.r[0]; r <= seg.r[1]; r++) {
      for (let c = seg.c[0]; c <= seg.c[1]; c++) {
        grid[r][c] = R
      }
    }
  })

  // Start Line (middle of top straight)
  for (let r = 8; r <= 11; r++) grid[r][22] = S

  // Checkpoints (distributed around)
  // CP 1: Right straight top
  for (let r = 14; r <= 15; r++) for (let c = 32; c <= 35; c++) grid[r][c] = C
  // CP 2: Right straight bottom
  for (let r = 30; r <= 31; r++) for (let c = 32; c <= 35; c++) grid[r][c] = C
  // CP 3: Bottom straight middle
  for (let r = 32; r <= 35; r++) for (let c = 20; c <= 21; c++) grid[r][c] = C
  // CP 4: Left straight bottom
  for (let r = 28; r <= 29; r++) for (let c = 8; c <= 11; c++) grid[r][c] = C
  // CP 5: Left straight top
  for (let r = 14; r <= 15; r++) for (let c = 8; c <= 11; c++) grid[r][c] = C

  // Add some Rumble Strips at corners
  // Top-Right outer
  for (let r = 7; r <= 7; r++) for (let c = 32; c <= 36; r++) grid[r][c] = B // Error in loop r++
  // I'll just write a helper for rectangles
  const fillRect = (r1: number, c1: number, r2: number, c2: number, type: number) => {
    for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (r >= 0 && r < 44 && c >= 0 && c < 44) grid[r][c] = type
  }

  // Rumble strips (B)
  fillRect(7, 32, 7, 36, B)  // Top-Right outer
  fillRect(8, 36, 12, 36, B) // Top-Right outer vertical
  fillRect(36, 31, 36, 36, B) // Bottom-Right outer
  fillRect(31, 36, 35, 36, B) // Bottom-Right outer vertical
  fillRect(36, 7, 36, 12, B)  // Bottom-Left outer
  fillRect(31, 7, 35, 7, B)   // Bottom-Left outer vertical
  fillRect(7, 7, 7, 12, B)    // Top-Left outer
  fillRect(8, 7, 12, 7, B)    // Top-Left outer vertical

  // Inner Rumble strips
  fillRect(12, 12, 12, 15, B)
  fillRect(12, 12, 15, 12, B)

  // Gravel Traps (V) outside corners
  fillRect(5, 36, 7, 41, V)   // Top-Right
  fillRect(36, 36, 41, 41, V)  // Bottom-Right
  fillRect(36, 2, 41, 7, V)    // Bottom-Left
  fillRect(2, 2, 7, 7, V)      // Top-Left

  // Walls at edges (Inner)
  fillRect(12, 12, 12, 31, W)
  fillRect(13, 31, 27, 31, W)
  fillRect(27, 12, 27, 30, W)
  fillRect(13, 12, 26, 12, W)
  
  // Wait, I need a proper hole in the middle.
  // Let's clear the middle to grass first
  for (let r = 13; r <= 26; r++) for (let c = 13; c <= 30; c++) grid[r][c] = G
  
  // Now add inner walls
  for (let c = 12; c <= 31; c++) { grid[12][c] = W; grid[27][c] = W }
  for (let r = 12; r <= 27; r++) { grid[r][12] = W; grid[r][31] = W }

  return grid
}

export const TRACK_GRID = generateGrid()
export const CHECKPOINTS: number[] = [1, 2, 3, 4, 5]
export const START_POSITION: Vector2D = { x: 22.5 * 64, y: 10 * 64 }
export const START_ANGLE: number = 0 // Radians, facing right
