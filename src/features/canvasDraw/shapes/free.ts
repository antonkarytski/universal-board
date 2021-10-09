import { Point, BrushOptions } from '../types'
import { midPointBtw } from '../helpers'
import { ShapeInterface } from '../types.shapes'

function line(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
  const midPoint = midPointBtw(p1, p2)
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.quadraticCurveTo(p2.x, p2.y, midPoint.x, midPoint.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function setBrushSettings(
  ctx: CanvasRenderingContext2D,
  { brushColor, brushRadius }: BrushOptions
) {
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushRadius * 2
}

export const Free: ShapeInterface = {
  name: '_free',
  isLazyAvailable: true,
  onDrawStart() {},
  onDrawMove(ctx, points, brushSettings) {
    if (!ctx) return
    setBrushSettings(ctx, brushSettings)

    const { length } = points
    if (length < 2) return
    const p1 = points[length - 2]
    const p2 = points[length - 1]
    line(ctx, p1, p2)
  },
  onDrawEnd() {},
  onRepeat(ctx, { points, ...brushSettings }) {
    if (!ctx) return
    setBrushSettings(ctx, brushSettings)
    points.forEach((p2, index) => {
      if (index === 0) return
      const p1 = points[index - 1]
      line(ctx, p1, p2)
    })
  },
  onSave(ctx, { points, ...brushSettings }) {
    if (!ctx) return
    setBrushSettings(ctx, brushSettings)
    points.forEach((p2, index) => {
      if (index === 0) return
      const p1 = points[index - 1]
      line(ctx, p1, p2)
    })
    return true
  },
}
