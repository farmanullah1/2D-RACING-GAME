import React, { useRef, useEffect } from 'react'
import { useGameState } from '../../App'

const Speedometer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const state = useGameState()
  const speed = Math.abs(state.player.speed)
  const maxSpeed = state.player.maxSpeed

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const size = 150
    canvas.width = size
    canvas.height = size
    
    ctx.clearRect(0, 0, size, size)
    const centerX = size / 2
    const centerY = size / 2
    const radius = size / 2 - 10

    // Background circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 8
    ctx.stroke()

    // Progress arc
    const angle = 0.75 * Math.PI + (speed / maxSpeed) * 1.5 * Math.PI
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, angle)
    ctx.strokeStyle = speed > maxSpeed * 0.9 ? '#ff006e' : '#00f5ff'
    ctx.lineWidth = 8
    ctx.stroke()

    // Needle
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)
    ctx.strokeStyle = 'white'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(radius - 5, 0)
    ctx.stroke()
    ctx.restore()

    // Center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
  }, [speed, maxSpeed])

  return (
    <div className="relative w-[150px] h-[150px] flex items-center justify-center bg-track-panel backdrop-blur-md rounded-full border border-white/10">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="flex flex-col items-center">
        <span className="text-3xl font-racing font-black text-white leading-none">
          {Math.round(speed * 0.6)}
        </span>
        <span className="text-xs font-mono text-white/40 uppercase tracking-tighter">
          KM/H
        </span>
        <span className="text-lg font-racing font-bold text-neon-blue mt-1">
          G{Math.floor(speed / 80) + 1}
        </span>
      </div>
    </div>
  )
}

export default Speedometer
