import { BrushOptions, Point, ShapeInterface } from '../types'

export function setBrushSettings(
  ctx: CanvasRenderingContext2D,
  { brushColor, brushRadius }: BrushOptions
) {
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = brushColor
  ctx.lineWidth = brushRadius * 2
}

type CreateBaseShapeProps = {
  name: string
  draw: (ctx: CanvasRenderingContext2D, points: Point[]) => void
}

export function createBaseShape({
  name,
  draw,
}: CreateBaseShapeProps): ShapeInterface {
  return {
    name,
    isLazyAvailable: false,
    onDrawMove(ctx, points, { width, height, ...brushSettings }) {
      if (!ctx || points.length < 2) return
      setBrushSettings(ctx, brushSettings)
      ctx.clearRect(0, 0, width, height)
      draw(ctx, points)
    },
    onRepeat(ctx, { points, ...brushSettings }) {
      if (!ctx || points.length < 2) return
      setBrushSettings(ctx, brushSettings)
      draw(ctx, points)
    },
    onSave(ctx, { points, ...brushSettings }) {
      if (!ctx || points.length < 2) return false
      setBrushSettings(ctx, brushSettings)
      draw(ctx, points)
    },
  }
}
