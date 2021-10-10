import { MutableRefObject, useRef } from 'react'
import { Point, Shape, SpecifiedShape } from '../types'
import { GestureResponderEvent } from 'react-native'
import { getPointerPos } from '../helpers'
import { LazyBrushInterface } from './brush'
import { ShapeInterface } from '../types.shape'
import { getWindowSize } from '../helpers/platform'

export type UseShapeProps = {
  brush: LazyBrushInterface
  tempCtx: MutableRefObject<CanvasRenderingContext2D | null>
  persistCtx: MutableRefObject<CanvasRenderingContext2D | null>
  sizeCanvas: MutableRefObject<HTMLCanvasElement | null>
  cache: MutableRefObject<SpecifiedShape[]>
  onMove?: () => void
}

export function useShape(
  {
    name,
    onDrawStart,
    onDrawMove,
    onDrawEnd,
    onSave,
    isLazyAvailable,
  }: ShapeInterface,
  {
    onMove,
    tempCtx,
    persistCtx,
    sizeCanvas,
    cache,
    brush: { lazy, brushColor, brushRadius },
  }: UseShapeProps
) {
  const pointsCache = useRef<Point[]>([])
  const isPressing = useRef(false)
  const isDrawing = useRef(false)

  function handlePointerMove(e: GestureResponderEvent) {
    const { x, y } = getPointerPos(e, sizeCanvas)
    const sizes = sizeCanvas.current || getWindowSize()
    lazy.current.update({ x, y })

    if (isPressing.current && !isDrawing.current) {
      if (e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
        lazy.current.update({ x, y }, { both: true })
      }

      isDrawing.current = true
      const coordinates = isLazyAvailable
        ? lazy.current.brush.toObject()
        : { x, y }
      const point: Point = {
        ...coordinates,
        timeStamp: e.timeStamp,
        firstTouch: true,
      }
      pointsCache.current.push(point)

      if (onDrawStart) {
        onDrawStart(tempCtx.current, [...pointsCache.current], {
          brushColor,
          brushRadius,
          ...sizes,
        })
      }

      return
    }

    if (isDrawing.current) {
      const coordinates = isLazyAvailable
        ? lazy.current.brush.toObject()
        : { x, y }
      const point: Point = {
        ...coordinates,
        timeStamp: e.timeStamp,
        firstTouch: true,
      }
      pointsCache.current.push(point)
      onDrawMove(tempCtx.current, [...pointsCache.current], {
        brushRadius,
        brushColor,
        ...sizes,
      })
    }

    if (onMove) onMove()
  }

  function onTouchStart(e: GestureResponderEvent) {
    e.preventDefault()
    isPressing.current = true
    handlePointerMove(e)
  }

  function onTouchMove(e: GestureResponderEvent) {
    e.preventDefault()
    handlePointerMove(e)
  }

  function onTouchEnd(e: GestureResponderEvent) {
    const sizes = sizeCanvas.current || getWindowSize()
    e.preventDefault()
    isDrawing.current = false
    isPressing.current = false
    const points = [...pointsCache.current]
    if (onDrawEnd) {
      onDrawEnd(tempCtx.current, points, {
        brushRadius,
        brushColor,
        ...sizes,
      })
    }
    const shape: Shape = { points, brushRadius, brushColor }
    const result = onSave(persistCtx.current, shape)
    if (result) {
      const namedShape =
        typeof result === 'boolean' ? { name, ...shape } : { name, ...result }
      cache.current.push(namedShape)
    }

    const width = sizeCanvas.current?.width
    const height = sizeCanvas.current?.height
    tempCtx.current?.clearRect(0, 0, width || 0, height || 0)
    pointsCache.current = []
  }

  return {
    controller: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel: onTouchEnd,
    },
  }
}
