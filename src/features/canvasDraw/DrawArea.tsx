import React, { FC, useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import Canvas from './canvas/Canvas'
import { CanvasDrawProps, CanvasList, SpecifiedShape } from './types'
import { canvasTypes, windowHeight, windowWidth } from './constants'
import { useBrush } from './hooks/brush'
import { useBackgroundLayer } from './hooks/layer.background'
import { useInterfaceLayer } from './hooks/layer.interface'
import { useDrawingLayers } from './hooks/layer.drawing'
import ObservableContainer from './ObservableContainer'
import { useShape } from './hooks/shape'
import { Free } from './shapes/free'
import { Line } from './shapes/line'
import { Circle } from './shapes/circle'
import {
  TriangleRight,
  TriangleSymmetricHorizontal,
  TriangleSymmetricVertical,
} from './shapes/triangle'
import { Rectangle } from './shapes/rectangle'

const DrawArea: FC<CanvasDrawProps> = React.memo(
  ({
    lazyRadius = 30,
    brushRadius = 5,
    brushColor = '#444',
    catenaryColor = '#0a0302',
    gridColor = 'rgba(150,150,150,0.17)',
    backgroundColor = '#FFF',
    canvasWidth = windowWidth,
    canvasHeight = windowHeight,
    hideGrid = false,
    imgSrc = '',
    hideInterface = false,
    children,
    style,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const cache = useRef<SpecifiedShape[]>([])
    const brush = useBrush({ lazyRadius, brushRadius, brushColor })

    const { backgroundLayer } = useBackgroundLayer({
      isLoaded,
      gridColor,
      hideGrid,
      imgSrc,
    })
    const { updateInterface, interfaceLayer } = useInterfaceLayer({
      isLoaded,
      hideInterface,
      catenaryColor,
      brush,
    })

    const { tempLayer, persistLayer, tempCtx, persistCtx } = useDrawingLayers()

    const { controller } = useShape(Rectangle, {
      onMove: updateInterface,
      sizeCanvas: interfaceLayer,
      persistCtx,
      tempCtx,
      cache,
      brush,
    })

    const layers: CanvasList = {
      temp: tempLayer,
      background: backgroundLayer,
      interface: interfaceLayer,
      persist: persistLayer,
    }

    const containerStyle = {
      backgroundColor,
      width: canvasWidth,
      height: canvasHeight,
    }

    return (
      <ObservableContainer style={[style, containerStyle]}>
        {canvasTypes.map(({ name, zIndex }) => {
          const isInterface = name === 'interface'
          const canvasController = isInterface ? controller : {}
          return (
            <Canvas
              key={name}
              canvasRef={(canvasRef) => {
                if (canvasRef) {
                  layers[name].current = canvasRef
                  layers[name].current!.width = canvasWidth || windowWidth
                  layers[name].current!.height = canvasHeight || windowWidth
                  if (Object.values(layers).every((layer) => !!layer.current)) {
                    if (!isLoaded) setIsLoaded(true)
                  }
                }
              }}
              style={[styles.canvas, { zIndex }]}
              width={canvasWidth}
              height={canvasHeight}
              {...canvasController}
            />
          )
        })}
        {children}
      </ObservableContainer>
    )
  },
  ({ children, ...prevProps }, { children: nextChildren, ...nextProps }) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
  }
)

export default DrawArea

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
  },
})
