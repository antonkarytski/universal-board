import React, { useCallback, useEffect, useRef } from 'react'
import { GestureResponderEvent, StyleSheet, View } from 'react-native'
import Canvas, { UniImage } from '../universalCanvas/Canvas'
import {
  CanvasDrawProps,
  CanvasList,
  ContextList,
  Line,
  LineSettings,
} from './types'
import { Catenary } from 'catenary-curve'
import { LazyBrush, LazyPoint } from 'lazy-brush'
import {
  canvasTypes,
  defaultCanvasList,
  defaultContextList,
  nativeDevicePixelRation,
  windowHeight,
  windowWidth,
} from './constants'
import { useResizeObserver } from './hooks/resizeObserver'
import { drawImage } from './helper'
import { useCanvasActions } from './hooks/canvasActions'

function midPointBtw(p1: LazyPoint, p2: LazyPoint) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

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
    canvasWidth = 400,
    canvasHeight = 400,
    style,
    hideGrid = false,
    disabled = false,
    imgSrc = '',
    saveData = '',
    immediateLoading = false,
    hideInterface = false,
  }: CanvasDrawProps) => {
    const canvas = useRef<CanvasList>(defaultCanvasList)
    const ctxList = useRef<ContextList>(defaultContextList)
    const canvasContainer = useRef<View | null>(null)
    const catenary = useRef(new Catenary())
    const pointsCache = useRef<LazyPoint[]>([])
    const linesCache = useRef<Line[]>([])
    const mouseHasMoved = useRef(true)
    const valuesChanged = useRef(true)
    // const isDrawing = useRef(false)
    // const isPressing = useRef(false)

    const lazy = useRef<LazyBrush | null>(null)
    const chainLength = useRef(0)

    const triggerOnChangeProxy = useRef(() => {})

    const drawImageRequest = useCallback(() => {
      if (!imgSrc) return
      const img = new UniImage()
      img.crossOrigin = 'anonymous'
      img.onload = () => drawImage({ ctx: ctxList.current.grid, img })
      img.src = imgSrc
    }, [imgSrc])

    const {drawGrid} = useCanvasActions({
      gridColor,
      hideGrid,
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

    const drawPoints = useCallback(({ points, ...settings }: Line) => {
      if (!ctxList.current.temp) return
      const ctx = ctxList.current.temp
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = settings.brushColor

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.lineWidth = settings.brushRadius * 2

      let p1 = points[0]
      let p2 = points[1]

      ctx.moveTo(p2.x, p2.y)
      ctx.beginPath()

      for (let i = 1; i < points.length; i++) {
        const midPoint = midPointBtw(p1, p2)
        ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
        p1 = points[i]
        p2 = points[i + 1]
      }
      ctx.lineTo(p1.x, p1.y)
      ctx.stroke()
    }, [])

    const saveLine = useCallback(
      (params: LineSettings = {}) => {
        if (pointsCache.current.length < 2 || !canvas.current.temp) return

        linesCache.current.push({
          points: [...pointsCache.current],
          brushColor: params.brushColor || brushColor,
          brushRadius: params.brushRadius || brushRadius,
        })

        pointsCache.current = []

        const width = canvas.current.temp.width
        const height = canvas.current.temp.height

        ctxList.current.drawing?.drawImage(
          canvas.current.temp,
          0,
          0,
          width,
          height
        )
        ctxList.current.temp?.clearRect(0, 0, width, height)

        triggerOnChangeProxy.current()
      },
      [
        pointsCache,
        linesCache,
        canvas,
        ctxList,
        brushColor,
        brushRadius,
        triggerOnChangeProxy,
      ]
    )

    const simulateDrawingLines = useCallback(
      ({ lines, immediate }: { lines: Line[]; immediate?: boolean }) => {
        let curTime = 0
        let timeoutGap = immediate ? 0 : loadTimeOffset

        lines.forEach((line) => {
          if (immediate) {
            drawPoints(line)
            pointsCache.current = line.points
            saveLine(line)
            return
          }

          const { points, ...settings } = line

          for (let i = 1; i < points.length; i++) {
            curTime += timeoutGap
            setTimeout(() => {
              drawPoints({
                points: points.slice(0, i + 1),
                ...settings,
              })
            }, curTime)
          }

          curTime += timeoutGap
          setTimeout(() => {
            // Save this line with its props instead of this.props
            pointsCache.current = points
            saveLine(settings)
          }, curTime)
        })
      },
      [drawPoints, loadTimeOffset, saveLine]
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

    const drawGrid = useCallback(
      (ctx: CanvasRenderingContext2D | null) => {
        if (hideGrid || !ctx) return
        console.log(ctx)

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.beginPath()
        ctx.setLineDash([5, 1])
        ctx.setLineDash([])
        ctx.strokeStyle = gridColor
        ctx.lineWidth = 0.5

        const gridSize = 25

        let countX = 0
        while (countX < ctx.canvas.width) {
          countX += gridSize
          ctx.moveTo(countX, 0)
          ctx.lineTo(countX, ctx.canvas.height)
        }
        ctx.stroke()

        let countY = 0
        while (countY < ctx.canvas.height) {
          countY += gridSize
          ctx.moveTo(0, countY)
          ctx.lineTo(ctx.canvas.width, countY)
        }
        ctx.stroke()
      },
      [gridColor, hideGrid]
    )

    const drawInterface = useCallback(
      (ctx, pointer, brush) => {
        if (hideInterface || !lazy.current || !ctx) return
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Draw brush preview
        ctx.beginPath()
        ctx.fillStyle = brushColor
        ctx.arc(brush.x, brush.y, brushRadius || 10, 0, Math.PI * 2, true)
        ctx.fill()

        // Draw mouse point (the one directly at the cursor)
        ctx.beginPath()
        ctx.fillStyle = catenaryColor
        ctx.arc(pointer.x, pointer.y, 4, 0, Math.PI * 2, true)
        ctx.fill()

        // Draw catenary
        if (lazy.current.isEnabled()) {
          ctx.beginPath()
          ctx.lineWidth = 2
          ctx.lineCap = 'round'
          ctx.setLineDash([2, 4])
          ctx.strokeStyle = catenaryColor
          catenary.current.drawToCanvas(
            ctxList.current.interface,
            brush,
            pointer,
            chainLength.current
          )
          ctx.stroke()
        }

        // Draw brush point (the one in the middle of the brush preview)
        ctx.beginPath()
        ctx.fillStyle = catenaryColor
        ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true)
        ctx.fill()
      },
      [catenaryColor, catenary, brushColor, brushRadius, hideInterface]
    )
    const loop = useCallback(
      ({ once = false } = {}) => {
        if (!lazy.current) return
        if (mouseHasMoved.current || valuesChanged.current) {
          const pointer = lazy.current?.getPointerCoordinates()
          const brush = lazy.current.getBrushCoordinates()

          //drawInterface(ctxList.current.interface, pointer, brush)
          mouseHasMoved.current = false
          valuesChanged.current = false
        }

        if (once) return
        requestAnimationFrame(() => {
          loop()
        })
      },
      [drawInterface]
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

          drawGrid(ctxList.current.grid)
          drawImageRequest()
          loop({ once: true })
        }
        loadSaveData(savedData, true)
      },
      [getSaveData, loadSaveData, drawImageRequest, loop, drawGrid]
    )

    useResizeObserver({
      canvasContainer: canvasContainer.current,
      onResize,
    })

    useEffect(() => {
      lazy.current = new LazyBrush({
        radius: lazyRadius * nativeDevicePixelRation,
        enabled: true,
        initialPoint: {
          x: windowWidth / 2,
          y: windowHeight / 2,
        },
      })
      chainLength.current = lazyRadius * nativeDevicePixelRation
      //
      // drawImageRequest()
      // loop()
      //
      // setTimeout(() => {
      //   const initX = windowWidth / 2
      //   const initY = windowHeight / 2
      //   lazy.current?.update(
      //     { x: initX - chainLength.current / 4, y: initY },
      //     { both: true }
      //   )
      //   lazy.current?.update(
      //     { x: initX + chainLength.current / 4, y: initY },
      //     { both: false }
      //   )
      //   mouseHasMoved.current = true
      //   valuesChanged.current = true
      //   clear()
      //
      //   // Load saveData from prop if it exists
      //   if (saveData) {
      //     loadSaveData(saveData)
      //   }
      // }, 100)
    }, [clear, drawImageRequest, lazyRadius, loadSaveData, loop, saveData])

    useEffect(() => {
      chainLength.current = lazyRadius * nativeDevicePixelRation
      lazy.current?.setRadius(lazyRadius * window.devicePixelRatio)
    }, [lazyRadius])

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

    function getPointerPos(e: GestureResponderEvent) {
      let clientX = e.nativeEvent.locationX
      let clientY = e.nativeEvent.locationY

      if (
        e.nativeEvent.changedTouches &&
        e.nativeEvent.changedTouches.length > 0
      ) {
        clientX = e.nativeEvent.changedTouches[0].locationX
        clientY = e.nativeEvent.changedTouches[0].locationY
      }

      const rect = canvas.current.interface?.getBoundingClientRect()
      if (!rect) {
        return {
          x: clientX,
          y: clientY,
        }
      }
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }
    }

    function handlePointerMove(x: number, y: number) {
      if (disabled) return
      if (!lazy.current) return

      lazy.current.update({ x, y })
      const isDisabled = !lazy.current.isEnabled()

      if (
        (isPressing.current && !isDrawing.current) ||
        (isDisabled && isPressing.current)
      ) {
        // Start drawing and add point
        isDrawing.current = true
        //@ts-ignore
        pointsCache.current.push(lazy.current.brush.toObject())
      }

      if (isDrawing.current) {
        //@ts-ignore
        pointsCache.current.push(lazy.current.brush.toObject())

        // Draw current points
        drawPoints({
          points: pointsCache.current,
          brushColor,
          brushRadius,
        })
      }

      mouseHasMoved.current = true
    }

    function handleDrawStart(e: GestureResponderEvent) {
      e.preventDefault()
      console.log('start')
      isPressing.current = true

      const { x, y } = getPointerPos(e)

      if (e.nativeEvent.touches && e.nativeEvent.touches.length > 0) {
        lazy.current?.update({ x, y }, { both: true })
      }

      handlePointerMove(x, y)
    }

    function handleDrawMove(e: GestureResponderEvent) {
      e.preventDefault()

      const { x, y } = getPointerPos(e)
      handlePointerMove(x, y)
    }

    function handleDrawEnd(e: GestureResponderEvent) {
      e.preventDefault()

      handleDrawMove(e)

      isDrawing.current = false
      isPressing.current = false
      saveLine()
    }

    function undo() {
      const lines = linesCache.current.slice(0, -1)
      clear()
      simulateDrawingLines({ lines, immediate: true })
      triggerOnChangeProxy.current()
    }

    return (
      <View
        style={[
          style,
          {
            //backgroundColor,
            width: canvasWidth,
            height: canvasHeight,
            backgroundColor: 'red',
          },
        ]}
        ref={(container) => {
          if (!container) return
          canvasContainer.current = container
        }}
      >
        {canvasTypes.map(({ name, zIndex }) => {
          const isInterface = name === 'interface'
          return (
            <Canvas
              key={name}
              canvasRef={(canvasRef) => {
                if (canvasRef) {
                  canvas.current[name] = canvasRef
                  ctxList.current[name] = canvasRef.getContext('2d')
                }
              }}
              style={{ ...styles.canvas, zIndex }}
              onTouchStart={
                isInterface
                  ? handleDrawStart
                  : () => {
                      console.log('touch')
                    }
              }
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
