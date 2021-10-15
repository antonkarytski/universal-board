import React, { useCallback, useMemo, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Canvas from './nativeComponents/Canvas'
import TextLayer from './features/TextLayer/TextLayer'
import { CanvasDrawProps, CanvasList, CanvasTypes } from './types'
import { canvasTypes, windowHeight, windowWidth } from './constants'
import { useBrush } from './hooks/brush'
import { useBackgroundLayer } from './hooks/layer.background'
import { useInterfaceLayer } from './hooks/layer.interface'
import { useDrawingLayers } from './hooks/layer.drawing'
import { useComponentWillMount } from './helpers/hooks'
import { useDrawHistory } from './hooks/history'
import { clearCanvas, setCanvasSize } from './helpers'
import { createSpecialShapeRecord } from './helpers/shapes'
import { ToolsSet } from './tools'
import { useTool } from './hooks/tool'
import { useResizeObserver } from './hooks/resizeObserver'
import { Text } from './tools/text'
import { useTextLayer } from './hooks/layer.text'

type ClearProps = {
  preventSave?: boolean
}

const DrawArea = React.memo(
  ({
    shapeName = '_free',
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
    const background = useBackgroundLayer({
      isLoaded,
      gridColor,
      hideGrid,
      imgSrc,
    })
    const interfaceLayer = useInterfaceLayer({
      isLoaded,
      brush,
      hideInterface,
      catenaryColor,
    })
    const { temp, persist } = useDrawingLayers()
    const { addTextShape, textController } = useTextLayer()

    const toolsSet = useRef(
      new ToolsSet({ _text: new Text({ shapeCreateHandler: addTextShape }) })
    )

    const { history, persistHistory, serializeHistory, historyController } =
      useDrawHistory(persist, toolsSet)

    const interactController = useTool(toolsSet.current[shapeName], {
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
        textController.clear()
        if (preventSave) return
        history.add(createSpecialShapeRecord({ name: '_clear' }))
      },
      [temp.canvas, persist.canvas, history, textController]
    )

    useComponentWillMount(() => {
      if (historyControllerRef) {
        historyControllerRef.current = historyController
      }
      if (boardController) {
        boardController.current = { clear }
      }
    })

    const layers: CanvasList = useMemo(
      () => ({
        temp: temp.canvas,
        background: background.canvas,
        interface: interfaceLayer.canvas,
        persist: persist.canvas,
      }),
      [temp.canvas, background.canvas, interfaceLayer.canvas, persist.canvas]
    )

    const onResize: ResizeObserverCallback = useCallback(
      (entries) => {
        const cachedHistory = persistHistory({
          width: canvasWidth,
          height: canvasHeight,
        })
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          Object.values(layers).forEach((canvas) => {
            if (!canvas.current) return
            setCanvasSize(canvas.current, width, height)
          })
          background.drawGrid()
          //drawImageRequest()
        }
        serializeHistory(cachedHistory, {
          width: canvasWidth,
          height: canvasHeight,
        })
      },
      [
        background,
        layers,
        serializeHistory,
        persistHistory,
        canvasWidth,
        canvasHeight,
      ]
    )

    const { observable } = useResizeObserver({ onResize, isLoaded })

    const containerStyle = {
      backgroundColor,
    }

    function canvasRefCb(ref: HTMLCanvasElement, name: CanvasTypes) {
      if (isLoaded || !ref) return
      layers[name].current = ref
      layers[name].current!.width = canvasWidth
      layers[name].current!.height = canvasHeight
      if (Object.values(layers).every((layer) => !!layer.current)) {
        setIsLoaded(true)
      }
    }

    return (
      <View
        style={[styles.container, style, containerStyle]}
        ref={(container) => {
          if (!container) return
          observable.current = container
        }}
      >
        {canvasTypes.map(({ name, zIndex }) => {
          const isInterface = name === 'interface'
          const canvasController = isInterface ? interactController : {}
          return (
            <Canvas
              key={name}
              canvasRef={(ref) => canvasRefCb(ref, name)}
              style={[styles.canvas, { zIndex }]}
              width={canvasWidth}
              height={canvasHeight}
              {...canvasController}
            />
          )
        })}
        <TextLayer
          controller={textController}
          isActive={shapeName === '_text'}
        />
      </View>
    )
  },
  (
    { controller, historyController, ...prevProps },
    { controller: _1, historyController: _2, ...nextProps }
  ) => JSON.stringify(prevProps) === JSON.stringify(nextProps)
)

export default DrawArea

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
  canvas: {
    position: 'absolute',
  },
})
