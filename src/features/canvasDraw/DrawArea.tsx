import React, { FC, useState } from 'react'
import { StyleSheet } from 'react-native'
import Canvas from './canvas/Canvas'
import ObservableContainer from './ObservableContainer'
import { CanvasDrawProps, CanvasList } from './types'
import { canvasTypes, windowHeight, windowWidth } from './constants'
import { useBrush } from './hooks/brush'
import { useBackgroundLayer } from './hooks/layer.background'
import { useInterfaceLayer } from './hooks/layer.interface'
import { useDrawingLayers } from './hooks/layer.drawing'
import { useComponentWillMount } from './helpers/hooks'
import Shapes from './shapes'
import TextShape from './features/TextShape'

const DrawArea: FC<CanvasDrawProps> = React.memo(
  ({
    shape = Shapes._free,
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
    controller: boardController,
    historyController: historyControllerRef,
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

    const {
      tempLayer,
      persistLayer,
      interactController,
      historyController,
      clear,
    } = useDrawingLayers({
      onMove: updateInterface,
      brush,
      shape,
    })

    useComponentWillMount(() => {
      if (historyControllerRef) {
        historyControllerRef.current = historyController
      }
      if (boardController) {
        boardController.current = { clear }
      }
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

    // useEffect(() => {
    //   if (!isTextMode && shape.name === '_text') {
    //     setTextMode(true)
    //     return
    //   }
    //   if (isTextMode && shape.name !== 'text') {
    //     setTextMode(false)
    //   }
    // }, [shape, isTextMode])

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
                  layers[name].current!.width = canvasWidth
                  layers[name].current!.height = canvasHeight
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
        <TextShape />
        {children}
      </ObservableContainer>
    )
  },
  (
    { children, shape, controller, historyController, ...prevProps },
    {
      children: nextChildren,
      shape: nextShape,
      controller: nextController,
      historyController: nextHistoryController,
      ...nextProps
    }
  ) => {
    return (
      JSON.stringify(prevProps) === JSON.stringify(nextProps) &&
      shape === nextShape
    )
  }
)

export default DrawArea

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
  },
})
