import { useCallback } from 'react'
import { CanvasDrawProps } from '../types'

type UseCanvasActionsProps = {
  hideGrid: boolean | undefined
  gridColor: string
}

export function useCanvasActions({
  hideGrid,
  gridColor,
}: UseCanvasActionsProps) {
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
	
	return {drawGrid}
}
