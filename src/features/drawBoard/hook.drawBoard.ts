import React, { MutableRefObject, useRef } from 'react'
import { GestureResponderEvent } from 'react-native'

type Position = {
  x: number
  y: number
}

export type Point = {
  timeStamp: number
} & Position

export type PointsHistory = ({
  firstClick?: boolean
} & Point)[]

export type UseDrawBoardProps = {
  saveHistoryTo?: MutableRefObject<PointsHistory>
}

export function withMouseEvent(
  handler: (position: Point) => void,
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  const point = {
    x: event.nativeEvent.offsetX,
    y: event.nativeEvent.offsetY,
    timeStamp: event.timeStamp,
  }
  handler(point)
}

export function withNativeTouch(
  handler: (position: Point) => void,
  event: GestureResponderEvent
) {
  const point = {
    x: event.nativeEvent.locationX,
    y: event.nativeEvent.locationY,
    timeStamp: event.timeStamp,
  }
  handler(point)
}

export function useDrawBoard({ saveHistoryTo }: UseDrawBoardProps = {}) {
  const canvasRef = useRef<null | HTMLCanvasElement>(null)
  const prevPosition = useRef<Position | null>(null)

  function resetPosition() {
    prevPosition.current = null
  }

  function drawDot({ x, y, timeStamp }: Point) {
    const ctx = canvasRef.current?.getContext('2d')
    console.log(x, y)
    if (!ctx) return
    ctx.beginPath()
    ctx.arc(x, y, 1, 0, 2 * Math.PI)
    ctx.fill()
    prevPosition.current = { x, y }
    if (saveHistoryTo) {
      saveHistoryTo.current.push({ x, y, timeStamp, firstClick: true })
    }
  }

  function drawLine({ x, y, timeStamp }: Point) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
    ctx.moveTo(prevPosition.current?.x ?? x, prevPosition.current?.y ?? y)
    ctx.lineTo(x, y)
    ctx.stroke()
    prevPosition.current = { x, y }
    if (saveHistoryTo) {
      saveHistoryTo.current.push({ x, y, timeStamp })
    }
  }

  function clear() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    prevPosition.current = null
    ctx.clearRect(0, 0, 500, 500)
  }

  return {
    drawDot,
    drawLine,
    clear,
    resetPosition,
    canvasRef,
  }
}
