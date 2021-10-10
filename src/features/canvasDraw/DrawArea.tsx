import React, { FC, useState } from 'react'
import { StyleSheet } from 'react-native'
import Canvas from './canvas/Canvas'
import { CanvasDrawProps, CanvasList } from './types'
import { canvasTypes, windowHeight, windowWidth } from './constants'
import { useBrush } from './hooks/brush'
import { useBackgroundLayer } from './hooks/layer.background'
import { useInterfaceLayer } from './hooks/layer.interface'
import { useDrawingLayers } from './hooks/layer.drawing'
import ObservableContainer from './ObservableContainer'
// import { Line } from './shapes/line'
// import { Circle } from './shapes/circle'
// import {
//   TriangleRight,
//   TriangleSymmetricHorizontal,
//   TriangleSymmetricVertical,
// } from './shapes/triangle'
// import { Rectangle } from './shapes/rectangle'
// import { Erase } from './shapes/erase'

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

    const brush = useBrush({ lazyRadius, brushRadius, brushColor })

    const { backgroundLayer } = useBackgroundLayer({
      isLoaded,
      gridColor,
      hideGrid,
      imgSrc,
    })
    const { updateInterface, interfaceLayer } = useInterfaceLayer({
      brush,
      isLoaded,
      hideInterface,
      catenaryColor,
    })

    const { tempLayer, persistLayer, interactController } = useDrawingLayers({
      onMove: updateInterface,
      brush,
    })

    // const { controller } = useShape(Free, {
    //   onMove: updateInterface,
    //   sizeCanvas: interfaceLayer,
    //   persistCtx,
    //   tempCtx,
    //   cache,
    //   brush,
    // })

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
          const canvasController = isInterface ? interactController : {}
          return (
            <Canvas
              key={name}
              canvasRef={(canvasRef) => {
                if (canvasRef) {
                  layers[name].current = canvasRef
                  layers[name].current!.width = canvasWidth || windowWidth
                  layers[name].current!.height = canvasHeight || windowWidth
                  if (Object.values(layers).every((layer) => !!layer.current)) {
                    setIsLoaded(true)
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
