import { ViewProps } from 'react-native'
import { MutableRefObject } from 'react'

type GeneralCanvasProps = {
  width?: number
  height?: number
}

export type CanvasProps = ViewProps &
  GeneralCanvasProps & {
    canvasRef:
      | ((ref: HTMLCanvasElement) => void)
      | MutableRefObject<HTMLCanvasElement | null>
  }
