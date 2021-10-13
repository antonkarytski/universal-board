import { BrushOptions, Point, ShapeInterface } from '../types'
import { IS_WEB } from '../helpers/platform'
import { distanceBetween } from '../helpers/math'

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
  drawInterface?: (ctx: CanvasRenderingContext2D, points: Point[]) => void
}

type DrawInterfaceSettings = {
  fontSize?: number
}

export function createInterfaceDrawer({
  fontSize = 20,
}: DrawInterfaceSettings = {}) {
  return function (ctx: CanvasRenderingContext2D, points: Point[]) {
    ctx.font = IS_WEB ? `${fontSize}px serif` : '50px'
    const p1 = points[0]
    const p2 = points[points.length - 1]
    const radius = distanceBetween(p1, p2)
    ctx.fillText(
      Math.abs(radius).toFixed(0),
      p1.x + (p2.x - p1.x) / 2,
      p1.y + (p2.y - p1.y) / 2 - 20
    )
  }
}

export const drawBaseShapeInterface = createInterfaceDrawer()

export function createBaseShape({
  name,
  draw,
  drawInterface,
}: CreateBaseShapeProps): ShapeInterface {
  return {
    name,
    isLazyAvailable: false,
    onDrawMove(
      ctx,
      points,
      { width, height, interfaceLayer, ...brushSettings }
    ) {
      if (!ctx || points.length < 2) return
      setBrushSettings(ctx, brushSettings)
      ctx.clearRect(0, 0, width, height)
      draw(ctx, points)
      if (!interfaceLayer.ctx.current || !drawInterface) return
      drawInterface(interfaceLayer.ctx.current, points)
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

export function dummyShape(name: string): ShapeInterface {
  return {
    name,
    isLazyAvailable: false,
    onDrawMove() {},
    onRepeat() {},
    onSave() {},
  }
}
