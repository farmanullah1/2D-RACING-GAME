import React, { useRef, useEffect } from 'react'
import { useGameState } from '../../App'
import { TRACKS } from '../../data/tracks'
import { TILE_SIZE } from '../../constants/gameConstants'
import { TileType } from '../../types/game.types'

const MiniMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useGameState()
  const track = TRACKS[state.selectedTrack || 0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 160
    canvas.width = size
    canvas.height = size
    
    ctx.clearRect(0, 0, size, size)
    
    const grid = track.grid
    const gridHeight = grid.length
    const gridWidth = grid[0].length
    const scale = size / (gridWidth * TILE_SIZE)

    // Draw Track
    for (let r = 0; r < gridHeight; r++) {
      for (let c = 0; c < gridWidth; c++) {
        const tile = grid[r][c]
        if (tile === TileType.Road || tile === TileType.StartLine || tile === TileType.Checkpoint) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
          ctx.fillRect(c * TILE_SIZE * scale, r * TILE_SIZE * scale, TILE_SIZE * scale, TILE_SIZE * scale)
        }
      }
    }

    // Player
    ctx.fillStyle = '#00f5ff'
    ctx.beginPath()
    ctx.arc(state.player.position.x * scale, state.player.position.y * scale, 3, 0, Math.PI * 2)
    ctx.fill()
    
    // AI
    ctx.fillStyle = '#ff6b00'
    state.aiDrivers.forEach(ai => {
      ctx.beginPath()
      ctx.arc(ai.car.position.x * scale, ai.car.position.y * scale, 2, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [state.player.position, state.aiDrivers, track])

  return (
    <div className="bg-track-panel backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-panel overflow-hidden">
      <canvas ref={canvasRef} />
    </div>
  )
}

export default MiniMap
