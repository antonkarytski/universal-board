import React from 'react'
import {
  useDrawBoard,
  UseDrawBoardProps,
  withNativeTouch,
} from './hook.drawBoard'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Canvas from '../canvasDraw/canvas/Canvas'

type DrawBoardProps = { style?: StyleProp<ViewStyle> } & UseDrawBoardProps

export default function DrawBoard({ saveHistoryTo, style }: DrawBoardProps) {
  const { canvasRef, drawLine, drawDot, resetPosition } = useDrawBoard({
    saveHistoryTo,
  })

  return (
    <Canvas
      height={500}
      width={500}
      onTouchStart={(event) => withNativeTouch(drawDot, event)}
      onTouchMove={(event) => withNativeTouch(drawLine, event)}
      onTouchEnd={resetPosition}
      style={[styles.canvas, style]}
      canvasRef={canvasRef}
    />
  )
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: 'white',
    height: 500,
    width: 400,
  },
})
