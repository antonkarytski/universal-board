import { Point } from '../types'
import { createBaseShape } from './_helpers'
import { distanceBetween } from '../helpers/math'

function draw(ctx: CanvasRenderingContext2D, points: Point[]) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  const radius = distanceBetween(p1, p2)
  ctx.beginPath()
  ctx.arc(p1.x, p1.y, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

function drawInterface(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.font = '50px'
  const p1 = points[0]
  const p2 = points[points.length - 1]
  const radius = distanceBetween(p1, p2)
  ctx.fillText(
    Math.abs(radius).toFixed(0),
    p1.x + (p2.x - p1.x) / 2,
    p1.y + (p2.y - p1.y) / 2 - 20
  )
}

export const Circle = createBaseShape({
  name: '_circle',
  draw,
  drawInterface,
})
