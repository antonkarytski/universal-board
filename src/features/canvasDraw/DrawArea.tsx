import React, { useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import Canvas from './nativeComponents/Canvas'
import ObservableContainer from './ObservableContainer'
import TextShape from './features/TextShape'
import { CanvasDrawProps, CanvasList } from './types'
import { canvasTypes, windowHeight, windowWidth } from './constants'
import { useBrush } from './hooks/brush'
import { useBackgroundLayer } from './hooks/layer.background'
import { useInterfaceLayer } from './hooks/layer.interface'
import { useDrawingLayers } from './hooks/layer.drawing'
import { useComponentWillMount } from './helpers/hooks'
import { useDrawHistory } from './hooks/history'
import { useShape } from './hooks/shape'
import { clearCanvas } from './helpers'
import { createSpecialShapeRecord } from './helpers/shapes'
import Shapes from './shapes'

type ClearProps = {
  preventSave?: boolean
}

const DrawArea = React.memo(
  ({
    shape = Shapes._free,
    lazyRadius = 10,
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
    style,
    controller: boardController,
    historyController: historyControllerRef,
  }: CanvasDrawProps) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const brush = useBrush({ lazyRadius, brushRadius, brushColor })

    const { background } = useBackgroundLayer({
      isLoaded,
      gridColor,
      hideGrid,
      imgSrc,
    })
    const interfaceLayer = useInterfaceLayer({
      brush,
      isLoaded,
      hideInterface,
      catenaryColor,
    })
    const { temp, persist } = useDrawingLayers()
    const { history, controller: historyController } = useDrawHistory(persist)
    const { controller: interactController } = useShape(shape, {
      temp,
      persist,
      interfaceLayer,
      history,
      brush,
    })

    const clear = useCallback(
      ({ preventSave }: ClearProps = {}) => {
        clearCanvas(temp.canvas.current)
        clearCanvas(persist.canvas.current)
        if (preventSave) return
        history.add(createSpecialShapeRecord({ name: '_clear' }))
      },
      [temp.canvas, persist.canvas, history]
    )

    useComponentWillMount(() => {
      if (historyControllerRef) {
        historyControllerRef.current = historyController
      }
      if (boardController) {
        boardController.current = { clear }
      }
    })

    const layers: CanvasList = {
      temp: temp.canvas,
      background: background.canvas,
      interface: interfaceLayer.canvas,
      persist: persist.canvas,
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
              canvasRef={
                !isLoaded
                  ? (canvasRef) => {
                      if (canvasRef) {
                        layers[name].current = canvasRef
                        layers[name].current!.width = canvasWidth
                        layers[name].current!.height = canvasHeight
                        if (
                          Object.values(layers).every(
                            (layer) => !!layer.current
                          )
                        ) {
                          setIsLoaded(true)
                        }
                      }
                    }
                  : () => {}
              }
              style={[styles.canvas, { zIndex }]}
              width={canvasWidth}
              height={canvasHeight}
              {...canvasController}
            />
          )
        })}
        <TextShape />
      </ObservableContainer>
    )
  },
  (
    { shape, controller, historyController, ...prevProps },
    {
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
