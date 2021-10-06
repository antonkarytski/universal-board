import { GestureResponderEvent } from 'react-native'
import { useRef } from 'react'

export function useDrawActions() {
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

  function handleDrawStart(e: GestureResponderEvent) {
    e.preventDefault()
    isPressing.current = true

    const { x, y } = getPointerPos(e)

    if (e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
      lazy.current?.update({ x, y }, { both: true })
    }

    handlePointerMove(x, y)
  }

  function handlePointerMove(x: number, y: number) {
    if (disabled) return
    if (!lazy.current) return

    lazy.current.update({ x, y })
    const isDisabled = !lazy.current.isEnabled()

    if (
      (isPressing.current && !isDrawing.current) ||
      (isDisabled && isPressing.current)
    ) {
      // Start drawing and add point
      isDrawing.current = true
      //@ts-ignore
      pointsCache.current.push(lazy.current.brush.toObject())
    }

    if (isDrawing.current) {
      //@ts-ignore
      pointsCache.current.push(lazy.current.brush.toObject())

      // Draw current points
      drawPoints({
        points: pointsCache.current,
        brushColor,
        brushRadius,
      })
    }

    mouseHasMoved.current = true
  }

  function handleDrawEnd(e: GestureResponderEvent) {
    e.preventDefault()

    handleDrawMove(e)

    isDrawing.current = false
    isPressing.current = false
    saveLine()
  }
}
