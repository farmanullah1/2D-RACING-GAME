import { TileType, Vector2D } from "../types/game.types";
import { TILE_SIZE } from "../constants/gameConstants";
import { TrackData } from "./tracks";

const charMap: Record<string, TileType> = {
  'W': TileType.Wall,
  'G': TileType.Grass, // Will be ash/lava basalt in volcano theme!
  'V': TileType.Gravel, // Hot volcanic gravel
  'B': TileType.RumbleStrip,
  'R': TileType.Road,
  'S': TileType.StartLine,
  'C': TileType.Checkpoint,
};

const mapStr = [
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
  "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
  "WGGWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWGGW",
  "WGWWRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRWWWWWRRRRRRRRRRRRRRRRWWWWWRRRRRWWGW",
  "WGWWRRRRWWWWWRRRRRRRRRRRRRRRRWWWWWRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRVVVVVRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRVVVVVRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRVVVVVRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRWWWWWRRRRRRRRRRRRRRRRWWWWWRRRRRWWGW",
  "WGWWRRRRWWWWWRRRRRRRRRRRRRRRRWWWWWRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRRRRRRRRRSSSSSSSSSRRRRRRRRRRRRRRWWGW",
  "WGWWRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRWWGW",
  "WGGWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWGGW",
  "WGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGW",
  "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW"
];

const grid = mapStr.map(row => row.split('').map(char => charMap[char] ?? TileType.Grass));

const waypoints: Vector2D[] = [];

// Tracing simple circle for AI fallback seeking:
for(let c=5; c<=38; c+=3) waypoints.push({x: c*TILE_SIZE, y: 5*TILE_SIZE});
for(let r=6; r<=13; r+=2) waypoints.push({x: 38*TILE_SIZE, y: r*TILE_SIZE});
for(let c=37; c>=6; c-=3) waypoints.push({x: c*TILE_SIZE, y: 13*TILE_SIZE});
for(let r=12; r>=6; r-=2) waypoints.push({x: 5*TILE_SIZE, y: r*TILE_SIZE});

export const VOLCANO_TRACK: TrackData = {
  id: 'arena-thunderdome',
  name: 'Thunderdome Arena',
  grid,
  checkpoints: [1],
  startPosition: { x: 20 * TILE_SIZE, y: 14.5 * TILE_SIZE },
  startAngle: -Math.PI / 2, // Facing UP
  waypoints,
  theme: 'volcano'
};
