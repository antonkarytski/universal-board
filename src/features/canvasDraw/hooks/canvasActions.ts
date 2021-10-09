import {  Line, Point } from '../types'
import { midPointBtw } from '../helpers'

type DrawPointsSettings = {
  lastPart?: boolean
}

export function line(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
  const midPoint = midPointBtw(p1, p2)
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.quadraticCurveTo(p2.x, p2.y, midPoint.x, midPoint.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}
export function free(
  ctx: CanvasRenderingContext2D,
  { points, brushColor, brushRadius }: Line,
  { lastPart }: DrawPointsSettings = {}
) {
  return new Promise<boolean>((res) => {
    if (!ctx) {
      res(false)
      return
    }

    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.strokeStyle = brushColor
    ctx.lineWidth = brushRadius * 2

    if (lastPart) {
      const { length } = points
      if (length < 2) return
      const p1 = points[length - 2]
      const p2 = points[length - 1]
      line(ctx, p1, p2)
      res(true)
      return
    }

    points.forEach((p2, index) => {
      if (index === 0) return
      const p1 = points[index - 1]
      line(ctx, p1, p2)
      if (index === points.length - 1) res(true)
    })
  })
}

export type CanvasActionInterface = typeof baseShapes

export const baseShapes = {
  line,
  free,
}
