import React from 'react'
import { View } from 'react-native'
//@ts-ignore
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

  const size = {
    width,
    height,
  }

  return (
    <View {...viewProps} style={[style, styles.container]}>
      <GCanvasView
        onIsReady={(value: boolean) => console.log('READY', value)}
        onCanvasCreate={setRef}
        style={size}
      />
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}
