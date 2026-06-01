import { Vector2D } from "../types/game.types";
import { TRACK_GRID, CHECKPOINTS, START_POSITION, START_ANGLE } from "./trackLayout";
import { WAYPOINTS } from "./waypoints";
import { PRO_TRACK } from "./proTrack";
import { DESERT_TRACK } from "./desertTrack";
import { NEON_TRACK } from "./neonTrack";
import { ARCTIC_TRACK } from "./arcticTrack";
import { VOLCANO_TRACK } from "./volcanoTrack";

export interface TrackData {
  id: string
  name: string
  grid: number[][]
  checkpoints: number[]
  startPosition: Vector2D
  startAngle: number
  waypoints: Vector2D[]
  theme?: 'forest' | 'desert' | 'neon' | 'arctic' | 'volcano'
}

const generateReverseWaypoints = (waypoints: Vector2D[]): Vector2D[] => {
  if (waypoints.length === 0) return []
  return [...waypoints].reverse()
}

export const TRACKS: TrackData[] = [
  ARCTIC_TRACK,
  PRO_TRACK,
  DESERT_TRACK,
  NEON_TRACK,
  VOLCANO_TRACK,
  {
    id: 'circuit-alpha',
    name: 'Circuit Alpha (Simple)',
    grid: TRACK_GRID,
    checkpoints: CHECKPOINTS,
    startPosition: START_POSITION,
    startAngle: START_ANGLE,
    waypoints: WAYPOINTS,
    theme: 'forest'
  },
  {
    id: 'circuit-alpha-reverse',
    name: 'Circuit Alpha (Reverse)',
    grid: TRACK_GRID,
    checkpoints: CHECKPOINTS,
    startPosition: START_POSITION,
    startAngle: Math.PI, // Face the opposite direction
    waypoints: generateReverseWaypoints(WAYPOINTS),
    theme: 'forest'
  }
]
