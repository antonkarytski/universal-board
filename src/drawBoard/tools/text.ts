import { DrawAction, RepeatAction, SaveAction, ToolInterface } from '../types'
import { drawRectangle } from './rectangle'
import { Coordinates } from 'lazy-brush'

type TextShapeSettings = {
  width: number
  height: number
}

export type TextShapeCreateHandler = (
  point: Coordinates,
  settings: TextShapeSettings
) => void

type TextProps = {
  shapeCreateHandler?: TextShapeCreateHandler
}

export class Text implements ToolInterface {
  name = '_text'
  isLazyAvailable = false
  shapeCreateHandler: TextShapeCreateHandler = () => {}

  constructor({ shapeCreateHandler }: TextProps) {
    if (shapeCreateHandler) this.shapeCreateHandler = shapeCreateHandler
  }

  onDrawEnd: DrawAction = (_, points) => {
    if (!points.length) return
    const aP1 = points[0]
    const aP2 = points[points.length - 1]
    const width = aP2.x - aP1.x
    const height = aP2.y - aP1.y
    const p1 = {
      x: width > 0 ? aP1.x : aP2.x,
      y: height > 0 ? aP1.y : aP2.y,
    }
    this.shapeCreateHandler(p1, { width, height })
  }

  onDrawMove: DrawAction = (ctx, point, { width, height }) => {
    if (!ctx) return
    ctx.lineWidth = 0.25
    ctx.strokeStyle = '#000'
    ctx.setLineDash([3, 2])
    ctx.clearRect(0, 0, width, height)
    drawRectangle(ctx, point)
  }

  onRepeat: RepeatAction = () => {}
  onSave: SaveAction = () => {}
}
