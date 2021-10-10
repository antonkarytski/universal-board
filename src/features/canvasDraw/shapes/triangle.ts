import { Point } from '../types'
import { ShapeInterface } from '../types.shape'
import { setBrushSettings } from './_helpers'
import { Coordinates } from 'lazy-brush'

type PointGenerator = (p1: Coordinates, p2: Coordinates) => Coordinates
type CreateTriangleProps = {
  name: string
  thirdPoint: PointGenerator
}

function draw(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  thirdPoint: PointGenerator
) {
  const p1 = points[0]
  const p2 = points[points.length - 1]
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  const { x, y } = thirdPoint(p1, p2)
  ctx.lineTo(x, y)
  ctx.lineTo(p1.x, p1.y)
  ctx.stroke()
}

function createTriangle({
  name,
  thirdPoint,
}: CreateTriangleProps): ShapeInterface {
  return {
    name,
    isLazyAvailable: false,
    onDrawMove(ctx, points, { width, height, ...brushSettings }) {
      if (!ctx || points.length < 2) return
      setBrushSettings(ctx, brushSettings)
      ctx.clearRect(0, 0, width, height)
      draw(ctx, points, thirdPoint)
    },
    onRepeat(ctx, { points, ...brushSettings }) {
      if (!ctx || points.length < 2) return
      setBrushSettings(ctx, brushSettings)
      draw(ctx, points, thirdPoint)
    },
    onSave(ctx, { points, ...brushSettings }) {
      if (!ctx || points.length < 2) return
      setBrushSettings(ctx, brushSettings)
      draw(ctx, points, thirdPoint)
      return true
    },
  }
}

const right: PointGenerator = (p1, p2) => ({ x: p1.x, y: p2.y })
export const TriangleRight = createTriangle({
  name: '_triangleRight',
  thirdPoint: right,
})

const symmetricVertical: PointGenerator = (p1, p2) => ({
  x: 2 * p1.x - p2.x,
  y: p2.y,
})
export const TriangleSymmetricVertical = createTriangle({
  name: '_triangleSymmetricVertical',
  thirdPoint: symmetricVertical,
})

const symmetricHorizontal: PointGenerator = (p1, p2) => ({
  x: p2.x,
  y: 2 * p1.y - p2.y,
})

export const TriangleSymmetricHorizontal = createTriangle({
  name: '_triangleSymmetricVertical',
  thirdPoint: symmetricHorizontal,
})
