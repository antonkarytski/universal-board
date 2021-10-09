import React, { FC, useState } from 'react'
import { StyleSheet } from 'react-native'
import Canvas from './canvas/Canvas'
import { CanvasDrawProps, CanvasList } from './types'
import { canvasTypes, windowHeight, windowWidth } from './constants'
import { useCanvasInteractHandlers } from './hooks/interactHandlers'
import { useLazyBrush } from './hooks/lazyBrush'
import { useBackgroundLayer } from './hooks/layer.background'
import { useInterfaceLayer } from './hooks/layer.interface'
import { useDrawingLayers } from './hooks/layer.drawing'
import ObservableContainer from './ObservableContainer'

const DrawArea: FC<CanvasDrawProps> = React.memo(
  ({
    //onChange = null,
    //loadTimeOffset = 5,
    lazyRadius = 30,
    brushRadius = 10,
    brushColor = '#444',
    catenaryColor = '#0a0302',
    gridColor = 'rgba(150,150,150,0.17)',
    backgroundColor = '#FFF',
    canvasWidth = windowWidth,
    canvasHeight = windowHeight,
    hideGrid = false,
    disabled = false,
    imgSrc = '',
    saveData = '',
    //immediateLoading = false,
    hideInterface = false,
    children,
    style,
  }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const lazyBrush = useLazyBrush({ lazyRadius })
    const { backgroundLayer } = useBackgroundLayer({
      isLoaded,
      gridColor,
      hideGrid,
      imgSrc,
    })
    const { updateInterface, interfaceLayer } = useInterfaceLayer({
      isLoaded,
      brushRadius,
      brushColor,
      hideInterface,
      catenaryColor,
      brush: lazyBrush,
    })

    const { drawShape, saveShape, tempLayer, persistLayer } = useDrawingLayers()

    const layers: CanvasList = {
      temp: tempLayer,
      background: backgroundLayer,
      interface: interfaceLayer,
      persist: persistLayer,
    }

    const { handleDrawStart, handleDrawMove, handleDrawEnd } =
      useCanvasInteractHandlers({
        onFinish: saveShape,
        onMove: updateInterface,
        brushColor,
        brushRadius,
        disabled,
        brush: lazyBrush,
        controlCanvas: interfaceLayer,
        onDraw: drawShape,
      })

    const containerStyle = {
      backgroundColor,
      width: canvasWidth,
      height: canvasHeight,
    }

    return (
      <ObservableContainer style={[style, containerStyle]}>
        {canvasTypes.map(({ name, zIndex }) => {
          const isInterface = name === 'interface'
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
              onTouchStart={isInterface ? handleDrawStart : () => {}}
              onTouchMove={
                isInterface
                  ? (e) => {
                      handleDrawMove(e)
                    }
                  : () => {}
              }
              onTouchEnd={isInterface ? handleDrawEnd : () => {}}
              onTouchCancel={isInterface ? handleDrawEnd : () => {}}
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
