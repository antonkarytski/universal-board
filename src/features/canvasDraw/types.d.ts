import { ViewStyle } from 'react-native'
import { Coordinates } from 'lazy-brush'

export interface CanvasDrawProps {
  onChange?: ((canvas: CanvasDraw) => void) | null | undefined
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
  style?: ViewStyle | undefined
}

interface CanvasDraw {
  /**
   * Returns the drawing's save-data as a stringified object.
   */
  getSaveData(): string

  /**
   * Loads a previously saved drawing using the saveData string, as well as an optional boolean
   * flag to load it immediately, instead of live-drawing it.
   */
  loadSaveData(saveData: string, immediate?: boolean): void

  /**
   * Clears the canvas completely.
   */
  clear(): void
}

export type Point = {
  timeStamp: number
  firstTouch?: true
} & Coordinates

export type Line = {
  brushColor: string
  brushRadius: number
  points: Point[]
}

export type LineSettings = Partial<Pick<Line, 'brushRadius' | 'brushColor'>>

export type CanvasTypes = 'interface' | 'drawing' | 'temp' | 'grid'
export type CanvasTypesList = { name: CanvasTypes; zIndex: number }[]
export type CanvasList = {
  [name in CanvasTypes]: HTMLCanvasElement | null
}
export type ContextList = {
  [name in CanvasTypes]: CanvasRenderingContext2D | null
}
