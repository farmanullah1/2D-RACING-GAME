import { Vector2D } from "../types/game.types";
import { TRACK_GRID, CHECKPOINTS, START_POSITION, START_ANGLE } from "./trackLayout";
import { WAYPOINTS } from "./waypoints";

export interface TrackData {
  id: string
  name: string
  grid: number[][]
  checkpoints: number[]
  startPosition: Vector2D
  startAngle: number
  waypoints: Vector2D[]
}

const generateReverseWaypoints = (waypoints: Vector2D[]): Vector2D[] => {
  if (waypoints.length === 0) return []
  const reversed = [...waypoints].reverse()
  // Shift the array so the first waypoint is still in front of the start line.
  // Actually, the AI will just find the closest waypoint on its first frame if we just leave it.
  // But let's rotate the array slightly so index 0 is near the start.
  return reversed
}

export const TRACKS: TrackData[] = [
  {
    id: 'circuit-alpha',
    name: 'Circuit Alpha',
    grid: TRACK_GRID,
    checkpoints: CHECKPOINTS,
    startPosition: START_POSITION,
    startAngle: START_ANGLE,
    waypoints: WAYPOINTS
  },
  {
    id: 'circuit-alpha-reverse',
    name: 'Circuit Alpha (Reverse)',
    grid: TRACK_GRID,
    checkpoints: CHECKPOINTS,
    startPosition: START_POSITION,
    startAngle: Math.PI, // Face the opposite direction
    waypoints: generateReverseWaypoints(WAYPOINTS)
  }
]
