import { Vector2D, Car, CarColor } from "../types/game.types";

export interface GhostFrame {
  position: Vector2D
  angle: number
  timestamp: number
}

export class GhostEngine {
  private recording: GhostFrame[] = []
  private playback: GhostFrame[] = []
  private isRecording: boolean = false

  startRecording() {
    this.recording = []
    this.isRecording = true
  }

  stopRecording() {
    this.isRecording = false
    if (this.recording.length > 0) {
      localStorage.setItem('velocityx_ghost', JSON.stringify(this.recording))
    }
  }

  loadGhost() {
    const data = localStorage.getItem('velocityx_ghost')
    if (data) {
      this.playback = JSON.parse(data)
    }
  }

  recordFrame(car: Car, raceTime: number) {
    if (this.isRecording) {
      this.recording.push({
        position: { ...car.position },
        angle: car.angle,
        timestamp: raceTime
      })
    }
  }

  getGhostAtTime(raceTime: number): Partial<Car> | null {
    if (this.playback.length === 0) return null

    // Find the frame closest to raceTime
    // For simplicity, we'll find the first frame where timestamp >= raceTime
    const frame = this.playback.find(f => f.timestamp >= raceTime)
    if (!frame) return null

    return {
      position: frame.position,
      angle: frame.angle,
      color: 'silver' as CarColor,
      isPlayer: false,
      id: 'ghost'
    }
  }
}
