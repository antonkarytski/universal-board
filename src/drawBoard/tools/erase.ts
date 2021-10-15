import { setBrushSettings } from './_helpers'
import { penDraw } from './free'
import { Point, ToolInterface } from '../types'

function eraseDraw(ctx: CanvasRenderingContext2D, points: Point[]) {
  ctx.globalCompositeOperation = 'destination-out'
  penDraw(ctx, points)
}
export const Erase: ToolInterface = {
  name: '_erase',
  isLazyAvailable: true,
  onDrawMove(_, points, { persistLayer, ...brushSettings }) {
    if (!persistLayer.ctx.current) return
    setBrushSettings(persistLayer.ctx.current, brushSettings)
    eraseDraw(persistLayer.ctx.current, points)
  },
  onDrawEnd(_, points, { persistLayer }) {
    if (!persistLayer.ctx.current) return
    persistLayer.ctx.current.globalCompositeOperation = 'source-over'
  },
  onRepeat(ctx, { points, ...brushSettings }) {
    if (!ctx) return
    setBrushSettings(ctx, brushSettings)
    points.forEach((p2, index) => {
      if (index === 0) return
      const p1 = points[index - 1]
      eraseDraw(ctx, [p1, p2])
    })
  },
  onSave() {},
}
