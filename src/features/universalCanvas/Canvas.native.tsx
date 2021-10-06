import React from 'react'
import { View } from 'react-native'
import { GCanvasView } from '@flyskywhy/react-native-gcanvas'
import { CanvasProps } from './types'

export default function NativeCanvas({
  canvasRef,
  width,
  height,
  onLayout,
  style,
  ...viewProps
}: CanvasProps) {
  function setRef(canvas: HTMLCanvasElement) {
    if (typeof canvasRef === 'function') {
      canvasRef(canvas)
      return
    }
    canvasRef.current = canvas
  }

  return (
    <View {...viewProps}>
      <GCanvasView onCanvasCreate={setRef} width={width} height={height} />
    </View>
  )
}
