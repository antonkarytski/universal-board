import { Point } from '../types'
import { createBaseShape, drawBaseShapeInterface } from './_helpers'

function draw(ctx: CanvasRenderingContext2D, points: Point[]) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  ctx.beginPath()
  ctx.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
  ctx.stroke()
}

export const Rectangle = createBaseShape({
  name: '_rectangle',
  draw,
  drawInterface: drawBaseShapeInterface,
})
