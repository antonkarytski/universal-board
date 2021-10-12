import { StyleProp, ViewStyle } from 'react-native'
import { Coordinates } from 'lazy-brush'
import { UnionFrom } from './helpers/types'
import * as COLORS from './constants/colors'
import { MutableRefObject } from 'react'
import { CanvasInterface } from './hooks/canvas'
import { InterfaceLayerController } from './hooks/layer.interface'

export type ObservableContainerProps = {
  style?: StyleProp<ViewStyle>
}

export type BrushOptions = {
  brushColor: string
  brushRadius: number
}

export type TogglePlayingProps = {
  onStoryEnd?: () => void
}

export type HistoryController = {
  stepForward: () => void
  stepBack: () => void
  togglePlaying: (props?: TogglePlayingProps) => boolean | void
  isPlaying: MutableRefObject<boolean>
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
  options?: {
    [key: string]: any
  }
}

export type SpecifiedShape = {
  name: string
  special?: boolean
} & Shape

export type CanvasTypes = 'interface' | 'persist' | 'temp' | 'background'
export type CanvasTypesList = { name: CanvasTypes; zIndex: number }[]
export type CanvasList = {
  [name in CanvasTypes]: MutableRefObject<HTMLCanvasElement | null>
}
export type Colors = UnionFrom<typeof COLORS>

type OnRepeatSettings = {
  withDelay?: boolean
}

type ActionSetting = BrushOptions & {
  width: number
  height: number
  persistLayer: CanvasInterface
  interfaceLayer: InterfaceLayerController
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
) => false | Shape | void

export type ShapeInterface = {
  name: string
  isLazyAvailable?: boolean
  helperAvailable?: boolean
  onDrawStart?: DrawAction
  onDrawMove: DrawAction
  onDrawEnd?: DrawAction
  onRepeat: RepeatAction
  onSave: SaveAction
  onDrawText?: (text: string) => void
} & (
  | {
      steps?: undefined | 1
    }
  | {
      steps: number
      stepsActions: {}[]
    }
)
