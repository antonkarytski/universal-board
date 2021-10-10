import { useRef, useState } from 'react'
import { SpecifiedShape } from '../types'
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
    ...cache,
    currentIndex: currentIndex.current,
    add,
  }
}

export type CacheInterface = ReturnType<typeof useCache>

export function useDrawHistory({ clear, ctx }: CanvasInterface) {
  const cache = useCache()
  const currentPointIndex = useRef(-1)
  const isPlaying = useRef(false)
  const [isPlayingState, setIsPlayingState] = useState(false)

  function pause() {
    isPlaying.current = false
    setIsPlayingState(false)
  }

  function stepBack() {
    if (cache.currentIndex === -1) return
    pause()
    clear()
    cache.current
      .slice(0, currentPointIndex.current + 1)
      .forEach(({ name, ...shape }) => {
        Shapes[name as ShapeName].onRepeat(ctx.current, shape)
      })
  }

  function stepForward() {
    if (cache.currentIndex >= cache.current.length - 1) return
    pause()
    const { name, ...shape } = cache.current[cache.currentIndex + 1]
    Shapes[name as ShapeName].onRepeat(ctx.current, shape)
    currentPointIndex.current = cache.currentIndex + 1
  }

  return {
    cache,
    controller: {
      stepBack,
      stepForward,
    },
  }
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
