import { StyleProp, ViewStyle } from 'react-native'
import { Coordinates } from 'lazy-brush'
import { UnionFrom } from './helpers/types'
import * as COLORS from './constants/colors'
import { MutableRefObject } from 'react'

export type ObservableContainerProps = {
  style?: StyleProp<ViewStyle>
}

export type BrushOptions = {
  brushColor: string
  brushRadius: number
}

export type HistoryController = {
  stepForward: () => void
  stepBack: () => void
}

export type ActionsController = {
  clear: () => void
}

export type CanvasDrawProps = {
  shape?: ShapeInterface
  controller?: MutableRefObject<ActionsController | null>
  historyController?: MutableRefObject<HistoryController | null>
  brushRadius?: number | undefined
  brushColor?: string | undefined
  lazyRadius?: number | undefined
  gridColor?: string | undefined
  backgroundColor?: string | undefined
  hideGrid?: boolean | undefined
  catenaryColor?: string | undefined
  canvasWidth?: number | undefined
  canvasHeight?: number | undefined
  hideInterface?: boolean | undefined
  imgSrc?: string | undefined

  //saveData?: string | undefined
  //immediateLoading?: boolean | undefined
  //className?: string | undefined
  //disabled?: boolean | undefined
  //loadTimeOffset?: number | undefined
} & ObservableContainerProps

export type Point = {
  timeStamp: number
  firstTouch?: true
} & Coordinates

export type Shape = {
  brushColor: string
  brushRadius: number
  points: Point[]
}

export type SpecifiedShape = {
  special?: boolean
  name: string
  options?: {
    [key: string]: any
  }
} & Shape

export type LineSettings = Partial<Pick<Shape, 'brushRadius' | 'brushColor'>>

export type CanvasTypes = 'interface' | 'persist' | 'temp' | 'background'
export type CanvasTypesList = { name: CanvasTypes; zIndex: number }[]
export type CanvasList = {
  [name in CanvasTypes]: MutableRefObject<HTMLCanvasElement | null>
}
export type Colors = UnionFrom<typeof COLORS>

export type CanvasLayer = {
  ctx: CanvasRenderingContext2D | null
  canvas: HTMLCanvasElement | null
  isLoaded: boolean
}
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
