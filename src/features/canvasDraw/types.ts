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

export type CanvasDrawProps = {
  loadTimeOffset?: number | undefined
  lazyRadius?: number | undefined
  brushRadius?: number | undefined
  brushColor?: string | undefined
  catenaryColor?: string | undefined
  gridColor?: string | undefined
  backgroundColor?: string | undefined
  hideGrid?: boolean | undefined
  canvasWidth?: number | undefined
  canvasHeight?: number | undefined
  disabled?: boolean | undefined
  imgSrc?: string | undefined
  saveData?: string | undefined
  immediateLoading?: boolean | undefined
  hideInterface?: boolean | undefined
  className?: string | undefined
} & Omit<ObservableContainerProps, 'height' | 'width'>

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
  name: string
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
