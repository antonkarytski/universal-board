import { BrushOptions, Point, Shape } from './types'

type OnRepeatSettings = {
  withDelay?: boolean
}

type RepeatAction = (
  ctx: CanvasRenderingContext2D | null,
  shape: Shape,
  settings?: OnRepeatSettings
) => void

type DrawAction = (
  ctx: CanvasRenderingContext2D | null,
  point: Point[],
  setting: BrushOptions & { width: number; height: number }
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
