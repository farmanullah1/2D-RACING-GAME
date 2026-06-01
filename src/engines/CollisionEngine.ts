import { Car, TileType, Rect } from "../types/game.types";
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TOTAL_LAPS } from "../constants/gameConstants";
import { CAR_WIDTH, CAR_HEIGHT } from "../constants/graphicsConstants";

export class CollisionEngine {
  checkLapCompletion(car: Car, grid: number[][], requiredCheckpoints: number = 5): boolean {
    const col = Math.floor(car.position.x / TILE_SIZE)
    const row = Math.floor(car.position.y / TILE_SIZE)
    
    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) return false
    
    const tile = grid[row][col]
    if (tile === TileType.StartLine) {
      // Must pass all checkpoints of the track
      if (car.checkpointsPassed.length >= requiredCheckpoints) {
        car.lap++
        car.checkpointsPassed = []
        return true
      }
    }
    return false
  }

  checkCheckpoint(car: Car, grid: number[][]): void {
    const col = Math.floor(car.position.x / TILE_SIZE)
    const row = Math.floor(car.position.y / TILE_SIZE)
    
    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) return
    
    const tile = grid[row][col]
    if (tile === TileType.Checkpoint) {
      const checkpointId = row * GRID_WIDTH + col
      if (!car.checkpointsPassed.includes(checkpointId)) {
        car.checkpointsPassed.push(checkpointId)
      }
    }
  }

  checkOffTrack(car: Car, grid: number[][]): boolean {
    const col = Math.floor(car.position.x / TILE_SIZE)
    const row = Math.floor(car.position.y / TILE_SIZE)
    if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) return true
    const tile = grid[row][col]
    return tile === TileType.Grass || tile === TileType.Gravel
  }

  getCarBounds(car: Car): Rect {
    return {
      x: car.position.x - CAR_WIDTH / 2,
      y: car.position.y - CAR_HEIGHT / 2,
      width: CAR_WIDTH,
      height: CAR_HEIGHT
    }
  }
}
