import { GestureResponderEvent } from 'react-native'
import { MutableRefObject, useRef } from 'react'
import { CanvasList } from '../types'
import {Coordinates, LazyBrush, LazyPoint} from 'lazy-brush'
import { CanvasActionInterface } from './canvasActions'

type UseCanvasInteractHandlersProps = {
  disabled: boolean | undefined
  canvas: MutableRefObject<CanvasList>
  pointsCache: MutableRefObject<Coordinates[]>
  lazy: MutableRefObject<LazyBrush>
  mouseHasMoved: MutableRefObject<boolean>
  brushColor: string
  brushRadius: number
  onFinish: () => void
} & CanvasActionInterface

export function useCanvasInteractHandlers({
  disabled,
  canvas,
  lazy,
  pointsCache,
  drawPoints,
  brushColor,
  brushRadius,
  mouseHasMoved,
  onFinish,
}: UseCanvasInteractHandlersProps) {
  const isPressing = useRef(false)
  const isDrawing = useRef(false)

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

    const rect = canvas.current.interface?.getBoundingClientRect()
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

  function handlePointerMove(x: number, y: number) {
    if (disabled) return

    lazy.current.update({ x, y })
    console.log(lazy.current.getBrushCoordinates())
    const isDisabled = !lazy.current.isEnabled()

    if (
      (isPressing.current && !isDrawing.current) ||
      (isDisabled && isPressing.current)
    ) {
      isDrawing.current = true
      //@ts-ignore
      pointsCache.current.push(lazy.current.brush.toObject())
    }

    if (isDrawing.current) {
      pointsCache.current.push(lazy.current.brush.toObject())

      drawPoints({
        points: pointsCache.current,
        brushColor,
        brushRadius,
      })
    }

    mouseHasMoved.current = true
  }

  function handleDrawStart(e: GestureResponderEvent) {
    e.preventDefault()
    isPressing.current = true
    const { x, y } = getPointerPos(e)
    if (e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
      lazy.current.update({ x, y }, { both: true })
    }
    handlePointerMove(x, y)
  }

  function handleDrawMove(e: GestureResponderEvent) {
    e.preventDefault()
    const { x, y } = getPointerPos(e)
    handlePointerMove(x, y)
  }

  function handleDrawEnd(e: GestureResponderEvent) {
    e.preventDefault()
    handleDrawMove(e)
    isDrawing.current = false
    isPressing.current = false
    onFinish()
  }

  return { handleDrawEnd, handleDrawMove, handleDrawStart }
}
