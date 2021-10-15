import { Point } from '../types'
import { createBaseTool } from './_helpers'
import { Coordinates } from 'lazy-brush'

type PointGenerator = (p1: Coordinates, p2: Coordinates) => Coordinates
function createTriangleDraw(thirdPoint: PointGenerator) {
  return function (ctx: CanvasRenderingContext2D, points: Point[]) {
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
}

const right: PointGenerator = (p1, p2) => ({ x: p1.x, y: p2.y })
const symmetricVertical: PointGenerator = (p1, p2) => ({
  x: 2 * p1.x - p2.x,
  y: p2.y,
})
const symmetricHorizontal: PointGenerator = (p1, p2) => ({
  x: p2.x,
  y: 2 * p1.y - p2.y,
})

export const TriangleRight = createBaseTool({
  name: '_triangleRight',
  draw: createTriangleDraw(right),
})

export const TriangleSymmetricVertical = createBaseTool({
  name: '_triangleSymmetricVertical',
  draw: createTriangleDraw(symmetricVertical),
})

export const TriangleSymmetricHorizontal = createBaseTool({
  name: '_triangleSymmetricVertical',
  draw: createTriangleDraw(symmetricHorizontal),
})
