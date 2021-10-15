import { Coordinates } from 'lazy-brush'
import { UnionFrom } from './helpers/types'
import * as COLORS from './constants/colors'
import { MutableRefObject } from 'react'
import { CanvasInterface } from './hooks/canvas'
import { InterfaceLayerController } from './hooks/layer.interface'
import { StyleProp, ViewStyle } from 'react-native'
import { ToolName } from './tools'
import { LazyBrushInterface } from './hooks/brush'

export type BrushOptions = {
  brushColor: string
  brushRadius: number
}

export type DrawHistoryProps = {
  onStoryEnd?: () => void
  onStop?: () => void
  immediate?: boolean
  tillIndex?: number
}

export type HistoryController = {
  stepForward: () => void
  stepBack: () => void
  togglePlaying: (props?: DrawHistoryProps) => boolean | void
  isPlaying: MutableRefObject<boolean>
}

export const dummyHistoryController: HistoryController = {
  stepBack() {},
  stepForward() {},
  togglePlaying: () => false,
  isPlaying: {
    current: false,
  },
}

export type ActionsController = {
  clear: () => void
}

export type CanvasDrawProps = {
  shapeName?: ToolName
  //shape?: ShapeInterface
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
  style?: StyleProp<ViewStyle>
  //saveData?: string | undefined
  //immediateLoading?: boolean | undefined
  //className?: string | undefined
  //disabled?: boolean | undefined
  //loadTimeOffset?: number | undefined
}

export type CanvasTypes = 'interface' | 'persist' | 'temp' | 'background'
export type CanvasTypesList = { name: CanvasTypes; zIndex: number }[]
export type CanvasList = {
  [name in CanvasTypes]: MutableRefObject<HTMLCanvasElement | null>
}
export type Colors = UnionFrom<typeof COLORS>

export type Point = {
  timeStamp: number
  firstTouch?: true
} & Coordinates

export type Shape = {
  brushColor: string
  brushRadius: number
  points: Point[]
  options?: {
    [key: string]: any
  }
}

export type SpecifiedShape = {
  name: string
  special?: boolean
} & Shape

export type ActionSetting = BrushOptions & {
  width: number
  height: number
  persistLayer: CanvasInterface
  interfaceLayer: InterfaceLayerController
}
export type DrawAction = (
  ctx: CanvasRenderingContext2D | null,
  point: Point[],
  setting: ActionSetting,
) => void

type OnRepeatSettings = {
  withDelay?: boolean
}
export type RepeatAction = (
  ctx: CanvasRenderingContext2D | null,
  shape: Shape,
  settings?: OnRepeatSettings,
) => void

type OnSaveSettings = {
  brush: LazyBrushInterface
}
export type SaveAction = (
  ctx: CanvasRenderingContext2D | null,
  shape: Shape,
  settings: OnSaveSettings,
) => false | Shape | void

export type ToolInterface = {
  name: string
  isLazyAvailable?: boolean
  helperAvailable?: boolean
  onDrawStart?: DrawAction
  onDrawMove: DrawAction
  onDrawEnd?: DrawAction
  onRepeat: RepeatAction
  onSave: SaveAction
  onDrawText?: (text: string) => void
}

export type Size = {
  width: number
  height: number
}

export type CachedHistory = {
  cache: SpecifiedShape[]
  currentIndex: number
} & Size
