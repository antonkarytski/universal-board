import { Point } from '../types'
import { createBaseShape } from './_helpers'
import { distanceBetween } from '../helpers/math'

function draw(ctx: CanvasRenderingContext2D, points: Point[]) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  const radius = distanceBetween(p1, p2)
  ctx.arc(p1.x, p1.y, radius, 0, 2 * Math.PI)
  ctx.stroke()
}

export const Circle = createBaseShape({
  name: '_circle',
  draw,
})
