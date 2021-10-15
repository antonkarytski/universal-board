import { MutableRefObject, useCallback, useRef } from 'react'
import { CachedHistory, DrawHistoryProps, Size, SpecifiedShape } from '../types'
import { CanvasInterface } from './canvas'
import { ToolName, ToolsSet } from '../tools'
import { withMobileDelay } from '../helpers'

export function useCache() {
  const currentIndex = useRef(-1)
  const cache = useRef<SpecifiedShape[]>([])

  function add(shape: SpecifiedShape) {
    if (currentIndex.current !== cache.current.length - 1) {
      cache.current = cache.current.slice(0, currentIndex.current + 1)
    }
    cache.current.push(shape)
    currentIndex.current += 1
  }

  return {
    cache,
    currentIndex,
    add,
  }
}

export type CacheInterface = ReturnType<typeof useCache>
type RedrawHistoryProps = {
  initial?: boolean
} & DrawHistoryProps
type ByPointsSettings = {
  initial?: boolean
  onComplete?: () => void
}

export function useDrawHistory(
  canvas: CanvasInterface,
  toolSet: MutableRefObject<ToolsSet>
) {
  const history = useCache()
  const { currentIndex: currentShapeIndex } = history
  const currentPointIndex = useRef(-1)
  const isPlaying = useRef(false)
  const forceStopMarker = useRef(false)

  function stepBack() {
    if (currentShapeIndex.current === -1) return
    isPlaying.current = false
    canvas.clear()
    withMobileDelay(() => {
      history.cache.current
        .slice(0, currentShapeIndex.current)
        .forEach((shape) => shapeHandler(canvas, toolSet, shape))
      currentShapeIndex.current -= 1
    })
  }

  function stepForward() {
    if (currentShapeIndex.current >= history.cache.current.length - 1) return
    isPlaying.current = false
    const shape = history.cache.current[currentShapeIndex.current + 1]
    shapeHandler(canvas, toolSet, shape)
    currentShapeIndex.current += 1
  }

  const stopHistoryPlaying = useCallback((onStop?: () => void) => {
    forceStopMarker.current = false
    isPlaying.current = false
    if (onStop) onStop()
  }, [])

  const redrawHistory = useCallback(
    ({ initial = true, tillIndex }: RedrawHistoryProps = {}) => {
      if (!history.cache.current.length) return
      if (initial) {
        if (isPlaying.current) {
          forceStopMarker.current = true
        }
        currentShapeIndex.current = -1
        canvas.clear()
        withMobileDelay(() => redrawHistory({ initial: false }))
        return
      }
      if (
        currentShapeIndex.current >= history.cache.current.length - 1 ||
        currentShapeIndex.current === tillIndex
      ) {
        return
      }

      const newShapeIndex = currentShapeIndex.current + 1
      currentShapeIndex.current = newShapeIndex
      const shape = history.cache.current[newShapeIndex]
      shapeHandler(canvas, toolSet, shape)
      redrawHistory({ initial: false })
    },
    [canvas, currentShapeIndex, history.cache, toolSet]
  )

  function byPoints(
    shape: SpecifiedShape,
    { initial = true, onComplete }: ByPointsSettings = {}
  ) {
    if (!isPlaying.current || !shape.points.length) return
    const tool = toolSet.current[shape.name as ToolName]
    if (initial) currentPointIndex.current = -1
    const newPointIndex = currentPointIndex.current + 1
    currentPointIndex.current = newPointIndex
    tool.onRepeat(canvas.ctx.current, {
      ...shape,
      points: shape.points.slice(0, newPointIndex + 1),
    })
    if (newPointIndex === shape.points.length - 1) {
      stopHistoryPlaying()
      return true
    }
    if (!isPlaying.current) return
    const nextDelay =
      shape.points[currentPointIndex.current + 1].timeStamp -
      shape.points[newPointIndex].timeStamp
    const timer = setTimeout(
      () => {
        byPoints(shape, { initial: false, onComplete })
        clearTimeout(timer)
      },
      nextDelay > 500 ? 500 : nextDelay
    )
  }

  function byShapes(props: DrawHistoryProps) {
    if (forceStopMarker.current) return stopHistoryPlaying(props.onStop)
    if (!isPlaying.current || !history.cache.current.length) return
    if (currentShapeIndex.current >= history.cache.current.length - 1) {
      canvas.clear()
      currentShapeIndex.current = -1
    }
    const newShapeIndex = currentShapeIndex.current + 1
    currentShapeIndex.current = newShapeIndex
    const shape = history.cache.current[newShapeIndex]
    if (newShapeIndex === 0) {
      withMobileDelay(() => shapeHandler(canvas, toolSet, shape))
    } else {
      shapeHandler(canvas, toolSet, shape)
    }

    const isStoryEnd = newShapeIndex === history.cache.current.length - 1
    const isEndByIndex =
      props.tillIndex !== undefined && props.tillIndex === newShapeIndex
    const isEnd = isEndByIndex || isStoryEnd || forceStopMarker.current
    if (isEnd) stopHistoryPlaying(props.onStop)
    if (!isPlaying.current) return
    if (props.immediate) {
      byShapes(props)
      return
    }
    const timer = setTimeout(() => {
      byShapes(props)
      clearTimeout(timer)
    }, 500)
  }

  function togglePlaying(props: DrawHistoryProps = {}) {
    if (!history.cache.current.length) return
    isPlaying.current = !isPlaying.current
    if (isPlaying.current) byShapes(props)
    return isPlaying.current
  }

  const persistHistory = useCallback(
    ({ width, height }) => {
      return JSON.stringify({
        cache: history.cache.current,
        currentIndex: history.currentIndex.current,
        width,
        height,
      })
    },
    [history.currentIndex, history.cache]
  )

  const serializeHistory = useCallback(
    (cachedHistory: string, size: Size) => {
      const { cache, currentIndex, width, height } = JSON.parse(
        cachedHistory
      ) as CachedHistory
      history.currentIndex.current = currentIndex
      if (width === size.width && height === size.height) {
        history.cache.current = cache
      } else {
        const scaleX = size.width / width
        const scaleY = size.height / height
        const scaleAvg = (scaleX + scaleY) / 2
        history.cache.current = cache.map(({ points, ...shapeOptions }) => {
          return {
            points: points.map(({ x, y, ...options }) => {
              return { x: x * scaleX, y: y * scaleY, ...options }
            }),
            ...shapeOptions,
            brushRadius: shapeOptions.brushRadius * scaleAvg,
          }
        })
      }
      redrawHistory({ tillIndex: history.currentIndex.current })
    },
    [history.cache, history.currentIndex, redrawHistory]
  )

  return {
    history,
    historyController: {
      isPlaying,
      stepBack,
      stepForward,
      togglePlaying,
    },
    serializeHistory,
    persistHistory,
    redrawHistory,
  }
}

function shapeHandler(
  { ctx, clear }: CanvasInterface,
  toolSet: MutableRefObject<ToolsSet>,
  { name, special, ...shape }: SpecifiedShape
) {
  if (special) {
    if (name === '_clear') clear()
    return
  }
  toolSet.current[name as ToolName].onRepeat(ctx.current, shape)
}
