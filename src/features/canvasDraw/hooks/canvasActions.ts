import { Point } from '../types'
import { midPointBtw } from '../helpers'

export function line(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
  const midPoint = midPointBtw(p1, p2)
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.quadraticCurveTo(p2.x, p2.y, midPoint.x, midPoint.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

export const baseShapes = {
  line,
}
