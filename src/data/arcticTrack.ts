import { TileType, Vector2D } from "../types/game.types";
import { TILE_SIZE } from "../constants/gameConstants";
import { TrackData } from "./tracks";

const charMap: Record<string, TileType> = {
  'W': TileType.Wall,
  'G': TileType.Grass, // Will be snowy glacier fields in arctic theme!
  'V': TileType.Gravel, // Slushy ice patches
  'B': TileType.RumbleStrip,
  'R': TileType.Road,
  'S': TileType.StartLine,
  'C': TileType.Checkpoint,
};

const mapStr = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
  "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
  "WGGGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVGGGGW",
  "WGGGVBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBVGGGGW",
  "WGGGVBRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBRVGGGGW",
  "WGGGVBRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBRVGGGGW",
  "WGGGVBRRRRBBBBBBBBBBBBBBBBBBBBBBBRRRBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBCCCCBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVCCCCBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBSSSSBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBGVGGGGGGGGGGGGGGGGVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBGVVVVVVVVVVVVVVVVVVBBVRRRBRVGGGGW",
  "WGGGVBRRRRBBBBBBBBBBBBBBBBBBBBBBVRRRBRVGGGGW",
  "WGGGVBRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBRVGGGGW",
  "WGGGVBCCCCRRRRRRRRRRRRRRRRRRRRRRRRRRBRVGGGGW",
  "WGGGVVBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBVVGGGGW",
  "WGGGGVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVGGGGGW",
  "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

const grid = mapStr.map(row => row.split('').map(char => charMap[char] ?? TileType.Grass));

const waypoints: Vector2D[] = [];

// Trace path around the track centerline:
// Start is at col 7.5, row 14.5 going UP.
for(let r=14; r>=6; r--) waypoints.push({x: 7.5*TILE_SIZE, y: (r + 0.5)*TILE_SIZE});
waypoints.push({x: 8*TILE_SIZE, y: 5.5*TILE_SIZE});
waypoints.push({x: 9*TILE_SIZE, y: 5.5*TILE_SIZE});

for(let c=10; c<=35; c++) waypoints.push({x: (c + 0.5)*TILE_SIZE, y: 5.5*TILE_SIZE});
waypoints.push({x: 36*TILE_SIZE, y: 5.5*TILE_SIZE});
waypoints.push({x: 36.5*TILE_SIZE, y: 7*TILE_SIZE});

for(let r=8; r<=19; r++) waypoints.push({x: 36.5*TILE_SIZE, y: (r + 0.5)*TILE_SIZE});
waypoints.push({x: 36*TILE_SIZE, y: 20.5*TILE_SIZE});
waypoints.push({x: 35*TILE_SIZE, y: 20.5*TILE_SIZE});

for(let c=34; c>=9; c--) waypoints.push({x: (c + 0.5)*TILE_SIZE, y: 20.5*TILE_SIZE});
waypoints.push({x: 8*TILE_SIZE, y: 20*TILE_SIZE});
waypoints.push({x: 7.5*TILE_SIZE, y: 19*TILE_SIZE});

for(let r=18; r>=15; r--) waypoints.push({x: 7.5*TILE_SIZE, y: (r + 0.5)*TILE_SIZE});

export const ARCTIC_TRACK: TrackData = {
  id: 'circuit-arctic',
  name: 'Glacier Run',
  grid,
  checkpoints: [1, 2, 3],
  startPosition: { x: 7.5 * TILE_SIZE, y: 14.5 * TILE_SIZE },
  startAngle: -Math.PI / 2, // Facing UP
  waypoints,
  theme: 'arctic'
};
