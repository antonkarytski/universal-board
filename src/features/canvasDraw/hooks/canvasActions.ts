import { MutableRefObject, useCallback, useRef } from 'react'
import { CanvasDrawProps, CanvasList, ContextList, Line } from '../types'
import { Catenary } from 'catenary-curve'
import { LazyBrush } from 'lazy-brush'
import { midPointBtw } from '../helpers'
import { Platform } from 'react-native'
import { IS_WEB } from '../helpers/platform'

type UseCanvasInterfaceDrawProps = {
  hideGrid: boolean | undefined
  gridColor: string
  brushColor: string
  brushRadius: number
  catenaryColor: string
  hideInterface: boolean | undefined
  lazy: MutableRefObject<LazyBrush | null>
  chainLength: number
  ctxList: MutableRefObject<ContextList>
}

export function useCanvasInterfaceDraw({
  hideGrid,
  gridColor,
  brushColor,
  brushRadius,
  catenaryColor,
  hideInterface,
  lazy,
  chainLength,
  ctxList,
}: UseCanvasInterfaceDrawProps) {
  const catenary = useRef(new Catenary())

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D | null,
      { width, height }: { width: number; height: number }
    ) => {
      if (hideGrid || !ctx) return

      ctx.clearRect(0, 0, width, height)

      ctx.beginPath()
      ctx.setLineDash([5, 1])
      ctx.setLineDash([])
      ctx.strokeStyle = gridColor
      ctx.lineWidth = 0.5

      const gridSize = 25

      let countX = 0
      while (countX < width) {
        countX += gridSize
        ctx.moveTo(countX, 0)
        ctx.lineTo(countX, height)
      }
      ctx.stroke()

      let countY = 0
      while (countY < height) {
        countY += gridSize
        ctx.moveTo(0, countY)
        ctx.lineTo(width, countY)
      }
      ctx.stroke()
    },
    [gridColor, hideGrid]
  )

  const drawInterface = useCallback(
    (ctx, pointer, brush, sizes: { width: number; height: number }) => {
      if (hideInterface || !lazy.current || !ctx) return
      ctx.clearRect(0, 0, sizes.width, sizes.height)

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
          chainLength
        )
        ctx.stroke()
      }

      // Draw brush point (the one in the middle of the brush preview)
      ctx.beginPath()
      ctx.fillStyle = catenaryColor
      ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true)
      ctx.fill()
    },
    [
      catenaryColor,
      catenary,
      brushColor,
      brushRadius,
      hideInterface,
      ctxList,
      lazy,
      chainLength,
    ]
  )

  return { drawGrid, drawInterface }
}

type UseCanvasActionsProps = {
  ctxList: MutableRefObject<ContextList>
  canvas: MutableRefObject<CanvasList>
}

export type CanvasActionInterface = ReturnType<typeof useCanvasActions>

export function useCanvasActions({
  ctxList,
  canvas: canvasList,
}: UseCanvasActionsProps) {
  const drawPoints = useCallback(
    ({ points, brushColor, brushRadius }: Line) => {
      if (!ctxList.current.temp || !canvasList.current.temp) return

      const ctx = ctxList.current.temp
      const canvas = canvasList.current.temp

      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = brushColor

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineWidth = brushRadius * 2

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
    },
    [ctxList, canvasList]
  )

  return { drawPoints }
}
