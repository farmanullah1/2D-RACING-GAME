export const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void => {
  if (w < 2 * r) r = w / 2
  if (h < 2 * r) r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export const drawShadow = (
  ctx: CanvasRenderingContext2D,
  fn: () => void,
  blur: number,
  color: string,
  offsetX: number,
  offsetY: number
): void => {
  ctx.save()
  ctx.shadowBlur = blur
  ctx.shadowColor = color
  ctx.shadowOffsetX = offsetX
  ctx.shadowOffsetY = offsetY
  fn()
  ctx.restore()
}

export const drawGlow = (
  ctx: CanvasRenderingContext2D,
  fn: () => void,
  blur: number,
  color: string
): void => {
  ctx.save()
  ctx.shadowBlur = blur
  ctx.shadowColor = color
  ctx.globalCompositeOperation = 'lighter'
  fn()
  ctx.restore()
}

export const createRadialGrad = (
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  stops: { offset: number; color: string }[]
): CanvasGradient => {
  const grad = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1)
  stops.forEach(s => grad.addColorStop(s.offset, s.color))
  return grad
}

export const createLinearGrad = (
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  stops: { offset: number; color: string }[]
): CanvasGradient => {
  const grad = ctx.createLinearGradient(x0, y0, x1, y1)
  stops.forEach(s => grad.addColorStop(s.offset, s.color))
  return grad
}

export const applyVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
): void => {
  const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.sqrt((width / 2) ** 2 + (height / 2) ** 2))
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(1, `rgba(0,0,0,${strength})`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)
}

export const drawDashedLine = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dashLen: number,
  gapLen: number
): void => {
  ctx.save()
  ctx.setLineDash([dashLen, gapLen])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.restore()
}

export const clearCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.clearRect(0, 0, width, height)
}

export const saveRestore = (ctx: CanvasRenderingContext2D, fn: () => void): void => {
  ctx.save()
  fn()
  ctx.restore()
}
