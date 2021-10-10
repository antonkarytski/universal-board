import { useRef } from 'react'
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
    cache,
    currentIndex,
    add,
  }
}

export type CacheInterface = ReturnType<typeof useCache>

export function useDrawHistory(canvas: CanvasInterface) {
  const history = useCache()
  const { currentIndex: currentShapeIndex } = history
  //const currentPointIndex = useRef(-1)
  const isPlaying = useRef(false)
  //const [isPlayingState, setIsPlayingState] = useState(false)

  function pause() {
    isPlaying.current = false
    //setIsPlayingState(false)
  }

  function stepBack() {
    if (currentShapeIndex.current === -1) return
    pause()
    canvas.clear()

    setTimeout(() => {
      history.cache.current
        .slice(0, currentShapeIndex.current)
        .forEach((shape) => shapeHandler(canvas, shape))
      currentShapeIndex.current -= 1
    }, 10)
  }

  function stepForward() {
    if (currentShapeIndex.current >= history.cache.current.length - 1) return
    pause()
    const shape = history.cache.current[currentShapeIndex.current + 1]
    shapeHandler(canvas, shape)
    currentShapeIndex.current += 1
  }

  return {
    history,
    controller: {
      stepBack,
      stepForward,
    },
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
