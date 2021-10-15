import {Point} from '../types'
import {createBaseTool, drawBaseShapeInterface} from './_helpers'

export function drawRectangle(ctx: CanvasRenderingContext2D, points: Point[]) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  ctx.beginPath()
  ctx.rect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y)
  ctx.stroke()
}

export const Rectangle = createBaseTool({
  name: '_rectangle',
  draw: drawRectangle,
  drawInterface: drawBaseShapeInterface,
})
