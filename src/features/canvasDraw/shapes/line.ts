import { Point } from '../types'
import { createBaseShape, drawBaseShapeInterface } from './_helpers'

function draw(ctx: CanvasRenderingContext2D, points: Point[]) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

export const Line = createBaseShape({
  name: '_line',
  draw,
  drawInterface: drawBaseShapeInterface,
})
