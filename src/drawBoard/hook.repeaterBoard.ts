import { MutableRefObject, useRef, useState } from 'react'
import { PointsHistory, useDrawBoard } from './hook.drawBoard'
import { findLastIndex } from './findLastIndex'

type UseDrawBoardHistoryProps = {
  history: MutableRefObject<PointsHistory>
  controller: Omit<ReturnType<typeof useDrawBoard>, 'canvasRef'>
}

export function useDrawBoardHistory({
  history,
  controller,
}: UseDrawBoardHistoryProps) {
  const currentPointIndex = useRef(-1)
  const isPlaying = useRef(false)
  const [isPlayingState, setIsPlayingState] = useState(false)
  const { drawDot, drawLine, resetPosition, clear } = controller

  function draw({ firstClick, ...point }: PointsHistory[0]) {
    if (firstClick) {
      resetPosition()
      drawDot(point)
      return
    }
    drawLine(point)
  }

  function withDelay() {
    if (!isPlaying.current || !history.current?.length) return
    if (currentPointIndex.current >= history.current.length - 1) {
      clear()
      currentPointIndex.current = -1
    }
    const newPointIndex = currentPointIndex.current + 1
    currentPointIndex.current = newPointIndex
    const point = history.current[newPointIndex]
    draw(point)
    if (newPointIndex === history.current.length - 1) {
      pause()
    }
    if (!isPlaying.current) return
    const nextDelay =
      history.current[currentPointIndex.current + 1].timeStamp - point.timeStamp
    const timer = setTimeout(
      () => {
        withDelay()
        clearTimeout(timer)
      },
      nextDelay > 500 ? 500 : nextDelay,
    )
  }

  function togglePlaying() {
    if (!history.current.length) return
    isPlaying.current = !isPlaying.current
    setIsPlayingState(isPlaying.current)
    if (isPlaying.current) withDelay()
  }

  function pause() {
    isPlaying.current = false
    setIsPlayingState(false)
  }

  function stepBack() {
    if (currentPointIndex.current === -1) return
    pause()
    clear()
    const currentStepStartIndex = findLastIndex(
      history.current,
      ({ firstClick }, index) => {
        return !!firstClick && index < currentPointIndex.current
      },
    )
    const lastPrevStepIndex =
      currentStepStartIndex === -1 ? -1 : currentStepStartIndex - 1
    currentPointIndex.current = lastPrevStepIndex
    if (lastPrevStepIndex === -1) return
    history.current.slice(0, lastPrevStepIndex + 1).forEach(draw)
  }

  function stepForward() {
    if (currentPointIndex.current >= history.current.length - 1) return
    pause()
    const nextFirstClick = history.current.findIndex(
      ({ firstClick }, index) => {
        return !!firstClick && index > currentPointIndex.current + 1
      },
    )
    const nextStepIndex =
      nextFirstClick !== -1 ? nextFirstClick - 1 : history.current.length - 1
    history.current
      .slice(currentPointIndex.current + 1, nextStepIndex + 1)
      .forEach(draw)
    currentPointIndex.current = nextStepIndex
  }

  return {
    togglePlaying,
    stepBack,
    stepForward,
    isPlaying: isPlayingState,
  }
}

export function useRepeaterBoard(history: MutableRefObject<PointsHistory>) {
  const { canvasRef, ...controller } = useDrawBoard()
  const historyController = useDrawBoardHistory({ controller, history })

  return { canvasRef, ...historyController }
}
