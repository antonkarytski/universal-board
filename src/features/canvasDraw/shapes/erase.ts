import { setBrushSettings } from './_helpers'
import { DrawFn, penDraw } from './free'
import { ShapeInterface } from '../types'

const eraseDraw: DrawFn = (ctx, p1, p2) => {
  ctx.globalCompositeOperation = 'destination-out'
  penDraw(ctx, p1, p2)
}
export const Erase: ShapeInterface = {
  name: '_erase',
  isLazyAvailable: true,
  onDrawMove(_, points, { persistLayer, ...brushSettings }) {
    if (!persistLayer.ctx.current) return
    setBrushSettings(persistLayer.ctx.current, brushSettings)
    const { length } = points
    if (length < 2) return
    const p1 = points[length - 2]
    const p2 = points[length - 1]
    eraseDraw(persistLayer.ctx.current, p1, p2)
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
      eraseDraw(ctx, p1, p2)
    })
  },
  onSave() {},
}
