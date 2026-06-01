import { Vector2D } from "../types/game.types";
import { TILE_SIZE } from "../constants/gameConstants";

const generateWaypoints = (): Vector2D[] => {
  const waypoints: Vector2D[] = []
  const half = TILE_SIZE / 2

  // Top straight: (9.5, 22) -> (9.5, 33.5)
  for (let c = 22; c <= 33; c++) waypoints.push({ x: (c + 0.5) * TILE_SIZE, y: 9.5 * TILE_SIZE })
  
  // Right straight: (9.5, 33.5) -> (33.5, 33.5)
  for (let r = 10; r <= 33; r++) waypoints.push({ x: 33.5 * TILE_SIZE, y: (r + 0.5) * TILE_SIZE })

  // Bottom straight: (33.5, 33.5) -> (33.5, 9.5)
  for (let c = 33; c >= 10; c--) waypoints.push({ x: (c + 0.5) * TILE_SIZE, y: 33.5 * TILE_SIZE })

  // Left straight: (33.5, 9.5) -> (9.5, 9.5)
  for (let r = 33; r >= 10; r--) waypoints.push({ x: 9.5 * TILE_SIZE, y: (r + 0.5) * TILE_SIZE })

  // Top straight finish: (9.5, 9.5) -> (9.5, 21)
  for (let c = 10; c < 22; c++) waypoints.push({ x: (c + 0.5) * TILE_SIZE, y: 9.5 * TILE_SIZE })

  return waypoints
}

export const WAYPOINTS: Vector2D[] = generateWaypoints()
