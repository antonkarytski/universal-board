import React from 'react'
import {
  useDrawBoard,
  UseDrawBoardProps,
  withNativeTouch,
} from './hook.drawBoard'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import Canvas from '../universalCanvas/Canvas'

type DrawBoardProps = { style?: StyleProp<ViewStyle> } & UseDrawBoardProps

export default function UniversalDrawBoard({
  saveHistoryTo,
  style,
}: DrawBoardProps) {
  const { canvasRef, drawLine, drawDot, resetPosition } = useDrawBoard({
    saveHistoryTo,
  })

  return (
    <View>
      <Canvas
        onTouchStart={(event) => {
          withNativeTouch(drawDot, event)
        }}
        onTouchMove={(event) => withNativeTouch(drawLine, event)}
        onTouchEnd={resetPosition}
        style={[styles.canvas, style]}
        canvasRef={canvasRef}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  canvas: {},
})
