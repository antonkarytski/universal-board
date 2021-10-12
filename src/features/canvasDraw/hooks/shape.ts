import { useRef } from 'react'
import { Point, Shape, ShapeInterface } from '../types'
import { GestureResponderEvent } from 'react-native'
import { getPointerPos } from '../helpers'
import { LazyBrushInterface } from './brush'
import { getWindowSize } from '../helpers/platform'
import { CacheInterface } from './history'
import { CanvasInterface } from './canvas'

export type UseShapeProps = {
  persist: CanvasInterface
  temp: CanvasInterface
  brush: LazyBrushInterface
  history: CacheInterface
  onMove?: () => void
}

export function useShape(
  {
    name,
    isLazyAvailable,
    onDrawStart,
    onDrawMove,
    onDrawEnd,
    onSave,
    onDrawText,
  }: ShapeInterface,
  {
    onMove,
    temp,
    persist,
    history,
    brush: { lazy, brushColor, brushRadius, chainLength },
  }: UseShapeProps
) {
  const pointsCache = useRef<Point[]>([])
  const isPressing = useRef(false)
  const isDrawing = useRef(false)

  function handlePointerMove(e: GestureResponderEvent) {
    const { x, y } = getPointerPos(e, persist.canvas)
    const sizes = persist.canvas.current || getWindowSize()

    lazy.current.update({ x, y })

    if (isPressing.current && !isDrawing.current) {
      if (e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
        if (!isLazyAvailable) {
          lazy.current.setRadius(10000)
        } else {
          lazy.current.setRadius(chainLength)
        }
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
        onDrawStart(temp.ctx.current, [...pointsCache.current], {
          saveCtx: persist.ctx.current,
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
      onDrawMove(temp.ctx.current, [...pointsCache.current], {
        saveCtx: persist.ctx.current,
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
    const sizes = persist.canvas.current || getWindowSize()
    e.preventDefault()
    isDrawing.current = false
    isPressing.current = false
    const points = [...pointsCache.current]
    if (onDrawEnd) {
      onDrawEnd(temp.ctx.current, points, {
        saveCtx: persist.ctx.current,
        brushRadius,
        brushColor,
        ...sizes,
      })
    }
    const shape: Shape = { points, brushRadius, brushColor }
    const result = onSave(persist.ctx.current, shape)
    if (result !== false) {
      const namedShape =
        typeof result === 'object' ? { name, ...result } : { name, ...shape }
      history.add(namedShape)
    }

    const delay = setTimeout(() => {
      const width = persist.canvas.current?.width
      const height = persist.canvas.current?.height
      temp.ctx.current?.clearRect(0, 0, width || 0, height || 0)
      pointsCache.current = []
      clearTimeout(delay)
    }, 10)
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
