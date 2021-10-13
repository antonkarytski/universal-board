import { useCallback, useRef } from 'react'
import { SpecifiedShape, DrawHistoryProps } from '../types'
import { CanvasInterface } from './canvas'
import Shapes, { ShapeName } from '../shapes'

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

export function useDrawHistory(canvas: CanvasInterface) {
  const history = useCache()
  const { currentIndex: currentShapeIndex } = history
  const isPlaying = useRef(false)
  const forceStop = useRef(false)

  function stepBack() {
    if (currentShapeIndex.current === -1) return
    isPlaying.current = false
    canvas.clear()

    const delay = setTimeout(() => {
      history.cache.current
        .slice(0, currentShapeIndex.current)
        .forEach((shape) => shapeHandler(canvas, shape))
      currentShapeIndex.current -= 1
      clearTimeout(delay)
    }, 50)
  }

  function stepForward() {
    if (currentShapeIndex.current >= history.cache.current.length - 1) return
    isPlaying.current = false
    const shape = history.cache.current[currentShapeIndex.current + 1]
    shapeHandler(canvas, shape)
    currentShapeIndex.current += 1
  }

  const redrawHistory = useCallback(
    ({ initial = true, tillIndex }: RedrawHistoryProps = {}) => {
      if (!history.cache.current.length) return
      if (initial) {
        forceStop.current = true
        currentShapeIndex.current = -1
        canvas.clear()
        const delay = setTimeout(() => {
          redrawHistory({ initial: false })
          clearTimeout(delay)
        }, 100)
        return
      }
      if (
        currentShapeIndex.current >= history.cache.current.length - 1 ||
        (tillIndex !== undefined && currentShapeIndex.current === tillIndex)
      ) {
        return
      }

      const newShapeIndex = currentShapeIndex.current + 1
      const shape = history.cache.current[newShapeIndex]
      shapeHandler(canvas, shape)
      redrawHistory({ initial: false })
    },
    [canvas, currentShapeIndex, history.cache]
  )

  function byShapes(props: DrawHistoryProps) {
    if (forceStop.current) {
      if (props.onStop) props.onStop()
      return
    }
    if (!isPlaying.current || !history.cache.current.length) return
    if (currentShapeIndex.current >= history.cache.current.length - 1) {
      canvas.clear()
      currentShapeIndex.current = -1
    }
    const newShapeIndex = currentShapeIndex.current + 1
    currentShapeIndex.current = newShapeIndex
    const shape = history.cache.current[newShapeIndex]
    if (newShapeIndex === 0) {
      const delay = setTimeout(() => {
        shapeHandler(canvas, shape)
        clearTimeout(delay)
      }, 100)
    } else {
      shapeHandler(canvas, shape)
    }

    const isStoryEnd = newShapeIndex === history.cache.current.length - 1
    const isEndByIndex =
      props.tillIndex !== undefined && props.tillIndex === newShapeIndex
    const isEnd = isEndByIndex || isStoryEnd || forceStop.current
    if (isEnd) {
      isPlaying.current = false
      forceStop.current = false
      if (props.onStop) props.onStop()
    }
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

  return {
    history,
    controller: {
      isPlaying,
      stepBack,
      stepForward,
      togglePlaying,
    },
    redrawHistory,
  }
}

function shapeHandler(
  { ctx, clear }: CanvasInterface,
  { name, special, ...shape }: SpecifiedShape
) {
  if (special) {
    if (name === '_clear') {
      clear()
    }
    return
  }
  Shapes[name as ShapeName].onRepeat(ctx.current, shape)
}

//Navigation inside shape back
// const currentStepStartIndex = findLastIndex(
//   history.current,
//   ({ firstClick }, index) => {
//     return !!firstClick && index < currentPointIndex.current
//   }
// )
// const lastPrevStepIndex =
//   currentStepStartIndex === -1 ? -1 : currentStepStartIndex - 1
// currentPointIndex.current = lastPrevStepIndex
// if (lastPrevStepIndex === -1) return

//Navigation inside shape forward
// const nextFirstClick = history.current.findIndex(
//   ({ firstClick }, index) => {
//     return !!firstClick && index > currentPointIndex.current + 1
//   }
// )
// const nextStepIndex =
//   nextFirstClick !== -1 ? nextFirstClick - 1 : history.current.length - 1
