import { Point, ShapeInterface } from '../types'
import { createBaseShape, setBrushSettings } from './_helpers'
import { distanceBetween } from '../helpers/math'

function draw(ctx: CanvasRenderingContext2D, points: Point[]) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function drawInterface(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.font = '50px'
  const p1 = points[0]
  const p2 = points[points.length - 1]
  const lineLength = distanceBetween(p1, p2)
  ctx.fillText(
    Math.abs(lineLength).toFixed(0),
    p1.x + (p2.x - p1.x) / 2,
    p1.y + (p2.y - p1.y) / 2 - 20
  )
}

export const Line = createBaseShape({
  name: '_line',
  draw,
  drawInterface,
})
