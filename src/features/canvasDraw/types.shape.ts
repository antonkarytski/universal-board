import { BrushOptions, Point, Shape } from './types'

type OnRepeatSettings = {
  withDelay?: boolean
}

type ActionSetting = BrushOptions & {
  width: number
  height: number
  saveCtx: CanvasRenderingContext2D | null
}

type RepeatAction = (
  ctx: CanvasRenderingContext2D | null,
  shape: Shape,
  settings?: OnRepeatSettings
) => void

type DrawAction = (
  ctx: CanvasRenderingContext2D | null,
  point: Point[],
  setting: ActionSetting
) => void

type SaveAction = (
  ctx: CanvasRenderingContext2D | null,
  shape: Shape
) => true | Shape | void

export type ShapeInterface = {
  name: string
  isLazyAvailable?: boolean
  helperAvailable?: boolean
  onDrawStart?: DrawAction
  onDrawMove: DrawAction
  onDrawEnd?: DrawAction
  onRepeat: RepeatAction
  onSave: SaveAction
}
