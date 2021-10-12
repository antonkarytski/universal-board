import React, { CSSProperties } from 'react'
import { CanvasProps } from './types'
import { mouseEventAdapter, touchEventAdapter } from './webAdapters'
import { View } from 'react-native'

export default function WebCanvas({
  canvasRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onTouchCancel,
  width,
  height,
  style,
}: CanvasProps) {
  console.log(style)

  return (
    <View style={style}>
      <canvas
        width={width}
        height={height}
        onTouchStart={(event) => touchEventAdapter(event, onTouchStart)}
        onTouchMove={(event) => touchEventAdapter(event, onTouchMove)}
        onTouchEnd={(event) => touchEventAdapter(event, onTouchEnd)}
        onTouchCancel={(event) => touchEventAdapter(event, onTouchCancel)}
        onMouseDown={(event) => mouseEventAdapter(event, onTouchStart)}
        onMouseMove={(event) => mouseEventAdapter(event, onTouchMove)}
        onMouseUp={(event) => mouseEventAdapter(event, onTouchEnd)}
        onMouseOut={(event) => mouseEventAdapter(event, onTouchCancel)}
        ref={canvasRef}
      />
    </View>
  )
}
