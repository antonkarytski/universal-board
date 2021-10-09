import { GestureResponderEvent } from 'react-native'
import { MutableRefObject, useRef } from 'react'
import { Line, Point } from '../types'
import { Coordinates } from 'lazy-brush'
import { LazyBrushInterface } from './lazyBrush'

type ShapeActionProps = {
  lazy: Coordinates
  isPressing: boolean
  points: Point[]
} & Coordinates

type UseCanvasInteractHandlersProps = {
  disabled: boolean | undefined
  controlCanvas: MutableRefObject<HTMLCanvasElement | null>
  brush: LazyBrushInterface
  brushColor: string
  brushRadius: number
  onFinish: (line: Line) => void
  onMove?: () => void
  onDraw?: (cache: Line) => void

  // shapeInterface: {
  //   type: string
  //   onShapeStart: (props: ShapeActionStartProps) => Point
  //   onShapeMove: () => void
  //   onShapeEnd: () => void
  // }
}

export function useCanvasInteractHandlers({
  controlCanvas,
  disabled,
  brush: { lazy },
  brushColor,
  brushRadius,

  onFinish,
  onMove,
  onDraw,
}: UseCanvasInteractHandlersProps) {
  const isPressing = useRef(false)
  const isDrawing = useRef(false)
  const pointsCache = useRef<Point[]>([])

  function getPointerPos(e: GestureResponderEvent) {
    let clientX = e.nativeEvent.locationX
    let clientY = e.nativeEvent.locationY

    if (
      e.nativeEvent.changedTouches &&
      e.nativeEvent.changedTouches.length > 0
    ) {
      clientX = e.nativeEvent.changedTouches[0].locationX
      clientY = e.nativeEvent.changedTouches[0].locationY
    }

    const rect = controlCanvas.current?.getBoundingClientRect()
    if (!rect) {
      return {
        x: clientX,
        y: clientY,
      }
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  function handlePointerMove(e: GestureResponderEvent) {
    if (disabled) return

    const { x, y } = getPointerPos(e)
    lazy.current.update({ x, y })

    if (isPressing.current && !isDrawing.current) {
      if (e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
        lazy.current.update({ x, y }, { both: true })
      }

      isDrawing.current = true
      pointsCache.current.push({
        ...lazy.current.brush.toObject(),
        timeStamp: e.timeStamp,
        firstTouch: true,
      })
      return
    }

    if (isDrawing.current) {
      pointsCache.current.push({
        ...lazy.current.brush.toObject(),
        timeStamp: e.timeStamp,
      })
      if (onDraw) {
        onDraw({ points: pointsCache.current, brushRadius, brushColor })
      }
    }

    if (onMove) onMove()
  }

  function handleDrawStart(e: GestureResponderEvent) {
    e.preventDefault()
    isPressing.current = true
    handlePointerMove(e)
  }

  function handleDrawMove(e: GestureResponderEvent) {
    e.preventDefault()
    handlePointerMove(e)
  }

  function handleDrawEnd(e: GestureResponderEvent) {
    e.preventDefault()
    isDrawing.current = false
    isPressing.current = false
    onFinish({ points: [...pointsCache.current], brushRadius, brushColor })
    pointsCache.current = []
  }

  return { handleDrawEnd, handleDrawMove, handleDrawStart }
}
