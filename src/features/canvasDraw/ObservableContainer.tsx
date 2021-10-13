import { useResizeObserver } from './hooks/resizeObserver'
import React, { FC } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

export type ObservableContainerProps = {
  style?: StyleProp<ViewStyle>
  onResize: ResizeObserverCallback
  isLoaded?: boolean
}

const ObservableContainer: FC<ObservableContainerProps> = ({
  children,
  style,
  onResize,
  isLoaded,
}) => {
  const { observable: containerRef } = useResizeObserver({
    onResize,
    isLoaded,
  })

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
