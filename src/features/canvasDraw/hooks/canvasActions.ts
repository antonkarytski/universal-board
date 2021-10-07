import { MutableRefObject, useCallback, useRef } from 'react'
import { ContextList, Line, Point } from '../types'
import { Catenary } from 'catenary-curve'
import { LazyBrush } from 'lazy-brush'
import { midPointBtw } from '../helpers'

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
}

type DrawPointsSettings = {
  lastPart?: boolean
  customContext?: CanvasRenderingContext2D
}

export type CanvasActionInterface = ReturnType<typeof useCanvasActions>

function line(ctx: CanvasRenderingContext2D, p1: Point, p2: Point) {
  const midPoint = midPointBtw(p1, p2)
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.quadraticCurveTo(p2.x, p2.y, midPoint.x, midPoint.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

export function useCanvasActions({ ctxList }: UseCanvasActionsProps) {
  const drawMassive = useCallback(
    (
      { points, brushColor, brushRadius }: Line,
      { lastPart, customContext }: DrawPointsSettings = {}
    ) => {
      if (!customContext && !ctxList.current.temp) return

      const ctx =
        customContext || (ctxList.current.temp as CanvasRenderingContext2D)

      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      ctx.strokeStyle = brushColor
      ctx.lineWidth = brushRadius * 2

      if (lastPart) {
        const { length } = points
        if (length < 2) return
        const p1 = points[length - 2]
        const p2 = points[length - 1]
        line(ctx, p1, p2)
        return
      }

      points.forEach((p2, index) => {
        if (index === 0) return
        const p1 = points[index - 1]
        line(ctx, p1, p2)
      })
    },
    [ctxList]
  )

  return { drawMassive }
}
