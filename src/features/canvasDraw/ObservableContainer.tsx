import { useResizeObserver } from './hooks/resizeObserver'
import React, { FC, useCallback } from 'react'
import { View } from 'react-native'
import { ObservableContainerProps } from './types'

const ObservableContainer: FC<ObservableContainerProps> = ({
  children,
  style,
}) => {
  const onResize: ResizeObserverCallback = useCallback((entries) => {
    //const savedData = getSaveData()
    for (const entry of entries) {
      //const { width, height } = entry.contentRect
      // setCanvasSize(canvas.current.interface, width, height)
      // setCanvasSize(canvas.current.drawing, width, height)
      // setCanvasSize(canvas.current.temp, width, height)
      // setCanvasSize(canvas.current.grid, width, height)
      //drawGrid(ctxList.current.grid, { width, height })
      //drawImageRequest()
      //loop({ once: true })
    }
    //loadSaveData(savedData, true)
  }, [])

  const { observable: containerRef } = useResizeObserver({ onResize })

  return (
    <View
      style={style}
      ref={(container) => {
        if (!container) return
        containerRef.current = container
      }}
    >
      {children}
    </View>
  )
}

export default ObservableContainer
