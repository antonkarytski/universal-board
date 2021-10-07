import React, { useCallback, useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Canvas from './canvas/Canvas'
import UniImage from './canvas/UniImage'
import { CanvasDrawProps, CanvasList, ContextList, Line } from './types'
import {
  canvasTypes,
  defaultCanvasList,
  defaultContextList,
  windowHeight,
  windowWidth,
} from './constants'
import { useResizeObserver } from './hooks/resizeObserver'
import { drawImage } from './helpers'
import { useCanvasActions, useCanvasInterfaceDraw } from './hooks/canvasActions'
import { useCanvasInteractHandlers } from './hooks/interactHandlers'
import { useLazyBrush } from './hooks/lazyBrush'

function setCanvasSize(
  canvas: HTMLCanvasElement | null,
  width: number | string,
  height: number | string
) {
  if (!canvas) return
  canvas.width = +width
  canvas.height = +height
  canvas.style.width = width + ''
  canvas.style.height = height + ''
}

const DrawArea = React.memo(
  ({
    onChange = null,
    loadTimeOffset = 5,
    lazyRadius = 12,
    brushRadius = 10,
    brushColor = '#444',
    catenaryColor = '#0a0302',
    gridColor = 'rgba(150,150,150,0.17)',
    backgroundColor = '#FFF',
    canvasWidth = windowWidth,
    canvasHeight = windowHeight,
    style,
    hideGrid = false,
    disabled = false,
    imgSrc = '',
    saveData = '',
    immediateLoading = false,
    hideInterface = false,
  }: CanvasDrawProps) => {
    const [isLoaded, setIsLoaded] = useState(false)

    const canvas = useRef<CanvasList>(defaultCanvasList)
    const ctxList = useRef<ContextList>(defaultContextList)

    const linesCache = useRef<Line[]>([])
    const mouseHasMoved = useRef(true)
    const valuesChanged = useRef(true)

    const { chainLength, lazy } = useLazyBrush({ lazyRadius })

    const triggerOnChangeProxy = useRef(() => {})

    const drawImageRequest = useCallback(() => {
      if (!imgSrc) return
      const img = new UniImage()
      img.crossOrigin = 'anonymous'
      img.onload = () => drawImage({ ctx: ctxList.current.grid, img })
      img.src = imgSrc
    }, [imgSrc])
    const { drawMassive } = useCanvasActions({ ctxList })

    const saveLine = useCallback(
      (line: Line) => {
        if (
          line.points.length < 2 ||
          !ctxList.current.drawing ||
          !canvas.current.temp
        )
          return

        linesCache.current.push(line)

        drawMassive(line, { customContext: ctxList.current.drawing })
        const width = canvas.current.temp.width
        const height = canvas.current.temp.height
        ctxList.current.temp?.clearRect(0, 0, width, height)
        triggerOnChangeProxy.current()
      },
      [linesCache, canvas, ctxList, triggerOnChangeProxy, drawMassive]
    )

    const { drawGrid, drawInterface } = useCanvasInterfaceDraw({
      gridColor,
      hideGrid,
      brushRadius,
      brushColor,
      hideInterface,
      catenaryColor,
      lazy,
      ctxList,
      chainLength,
    })
    const { handleDrawStart, handleDrawMove, handleDrawEnd } =
      useCanvasInteractHandlers({
        onFinish: saveLine,
        drawMassive,
        canvas,
        brushColor,
        brushRadius,
        disabled,
        lazy,
        mouseHasMoved,
      })

    const clear = useCallback(() => {
      linesCache.current = []
      valuesChanged.current = true
      if (ctxList.current.drawing) {
        ctxList.current.drawing.clearRect(
          0,
          0,
          canvas.current.drawing?.width || 400,
          canvas.current.drawing?.height || 400
        )
      }
      if (ctxList.current.temp) {
        ctxList.current.temp.clearRect(
          0,
          0,
          canvas.current.temp?.width || 400,
          canvas.current.temp?.height || 400
        )
      }
    }, [])

    const simulateDrawingLines = useCallback(
      ({ lines, immediate }: { lines: Line[]; immediate?: boolean }) => {
        let curTime = 0
        let timeoutGap = immediate ? 0 : loadTimeOffset

        lines.forEach((line) => {
          if (immediate) {
            drawMassive(line)
            saveLine(line)
            return
          }

          const { points, ...settings } = line

          for (let i = 1; i < points.length; i++) {
            curTime += timeoutGap
            setTimeout(() => {
              drawMassive({
                points: points.slice(0, i + 1),
                ...settings,
              })
            }, curTime)
          }

          curTime += timeoutGap
          setTimeout(() => {
            saveLine(line)
          }, curTime)
        })
      },
      [drawMassive, loadTimeOffset, saveLine]
    )

    const loadSaveData = useCallback(
      (savedData: string | object, immediate = immediateLoading) => {
        if (typeof savedData !== 'string') {
          throw new Error('savedData needs to be of type string!')
        }
        if (!savedData) return

        const { lines, width, height } = JSON.parse(savedData)

        if (!Array.isArray(lines)) {
          throw new Error('savedData.lines needs to be an array!')
        }

        clear()

        if (width === canvasWidth && height === canvasHeight) {
          simulateDrawingLines({
            lines,
            immediate,
          })
        } else {
          // we need to rescale the lines based on saved & current dimensions
          const scaleX = +canvasWidth / width
          const scaleY = +canvasHeight / height
          const scaleAvg = (scaleX + scaleY) / 2

          simulateDrawingLines({
            lines: linesCache.current.map((line) => ({
              ...line,
              points: line.points.map((p) => ({
                ...p,
                x: p.x * scaleX,
                y: p.y * scaleY,
              })),
              brushRadius: line.brushRadius * scaleAvg,
            })) as Line[],
            immediate,
          })
        }
      },
      [canvasHeight, canvasWidth, immediateLoading, clear, simulateDrawingLines]
    )

    const getSaveData = useCallback(() => {
      return JSON.stringify({
        lines: linesCache,
        width: canvasWidth,
        height: canvasHeight,
      })
    }, [linesCache, canvasWidth, canvasHeight])

    const loop = useCallback(
      ({ once = false } = {}) => {
        if (mouseHasMoved.current || valuesChanged.current) {
          const pointer = lazy.current.getPointerCoordinates()
          const brush = lazy.current.getBrushCoordinates()

          drawInterface(ctxList.current.interface, pointer, brush, {
            width: canvasWidth,
            height: canvasHeight,
          })
          mouseHasMoved.current = false
          valuesChanged.current = false
        }

        if (once) return
        requestAnimationFrame(() => {
          loop()
        })
      },
      [drawInterface, canvasWidth, canvasHeight, lazy]
    )

    const onResize: ResizeObserverCallback = useCallback(
      (entries) => {
        const savedData = getSaveData()
        for (const entry of entries) {
          const { width, height } = entry.contentRect
          setCanvasSize(canvas.current.interface, width, height)
          setCanvasSize(canvas.current.drawing, width, height)
          setCanvasSize(canvas.current.temp, width, height)
          setCanvasSize(canvas.current.grid, width, height)

          drawGrid(ctxList.current.grid, { width, height })
          drawImageRequest()
          loop({ once: true })
        }
        loadSaveData(savedData, true)
      },
      [getSaveData, loadSaveData, drawImageRequest, loop, drawGrid]
    )

    const { observable: containerRef } = useResizeObserver({ onResize })

    useEffect(() => {
      if (!isLoaded) return

      drawGrid(ctxList.current.grid, {
        width: canvasWidth,
        height: canvasHeight,
      })
      drawImageRequest()
      console.log('loop start')
      loop()

      setTimeout(() => {
        const initX = canvasWidth / 2
        const initY = canvasHeight / 2
        lazy.current?.update(
          { x: initX - chainLength / 4, y: initY },
          { both: true }
        )
        lazy.current?.update(
          { x: initX + chainLength / 4, y: initY },
          { both: false }
        )
        mouseHasMoved.current = true
        valuesChanged.current = true
        clear()

        // Load saveData from prop if it exists
        if (saveData) {
          loadSaveData(saveData)
        }
      }, 100)
    }, [
      lazy,
      chainLength,
      isLoaded,
      clear,
      drawImageRequest,
      loadSaveData,
      loop,
      saveData,
      drawGrid,
      canvasHeight,
      canvasWidth,
    ])

    useEffect(() => {
      loadSaveData(saveData)
    }, [saveData, loadSaveData])

    useEffect(() => {
      valuesChanged.current = true
    })

    triggerOnChangeProxy.current = useCallback(() => {
      if (onChange)
        onChange({
          getSaveData,
          loadSaveData,
          clear,
        })
    }, [onChange, getSaveData, loadSaveData, clear])

    // function undo() {
    //   const lines = linesCache.current.slice(0, -1)
    //   clear()
    //   simulateDrawingLines({ lines, immediate: true })
    //   triggerOnChangeProxy.current()
    // }

    return (
      <View
        style={[
          style,
          {
            backgroundColor,
            width: canvasWidth,
            height: canvasHeight,
          },
        ]}
        ref={(container) => {
          if (!container) return
          containerRef.current = container
        }}
      >
        {canvasTypes.map(({ name, zIndex }) => {
          const isInterface = name === 'interface'
          return (
            <Canvas
              key={name}
              canvasRef={(canvasRef) => {
                if (canvasRef) {
                  canvas.current[name] = canvasRef!
                  canvas.current[name]!.width = +canvasWidth || windowWidth
                  canvas.current[name]!.height = +canvasHeight || windowHeight
                  ctxList.current[name] = canvasRef.getContext('2d')
                  if (
                    Object.entries(canvas.current).every(([, layer]) => !!layer)
                  ) {
                    setIsLoaded(true)
                  }
                }
              }}
              style={{
                ...styles.canvas,
                zIndex,
              }}
              width={canvasWidth}
              height={canvasHeight}
              onTouchStart={isInterface ? handleDrawStart : () => {}}
              onTouchMove={isInterface ? handleDrawMove : () => {}}
              onTouchEnd={isInterface ? handleDrawEnd : () => {}}
              onTouchCancel={isInterface ? handleDrawEnd : () => {}}
            />
          )
        })}
      </View>
    )
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps) === JSON.stringify(nextProps)
)

export default DrawArea

const styles = StyleSheet.create({
  canvas: {
    position: 'absolute',
  },
})
