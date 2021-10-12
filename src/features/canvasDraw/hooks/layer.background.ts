import { useCallback, useEffect } from 'react'
import { drawImage } from '../helpers'
import { useCanvasRef } from './canvas'
import UniImage from '../canvas/UniImage'

type UseGridProps = {
  ctx: CanvasRenderingContext2D | null
  canvas: HTMLCanvasElement | null
}

type DrawGridProps = {
  gridColor: string
}

export function useGrid({ ctx, canvas }: UseGridProps) {
  const eraseGrid = useCallback(() => {
    if (!ctx || !canvas) return
    const { width, height } = canvas
    ctx.clearRect(0, 0, width, height)
  }, [ctx, canvas])

  const drawGrid = useCallback(
    ({ gridColor }: DrawGridProps) => {
      if (!ctx || !canvas) return
      const { width, height } = canvas

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
    [ctx, canvas]
  )

  return { drawGrid, eraseGrid }
}

type UseBackgroundLayerProps = {
  hideGrid?: boolean
  gridColor: string
  isLoaded: boolean
  imgSrc?: string
}

export function useBackgroundLayer({
  isLoaded,
  hideGrid,
  gridColor,
  imgSrc,
}: UseBackgroundLayerProps) {
  const background = useCanvasRef()
  const { ctx, canvas } = background

  const drawImageRequest = useCallback(() => {
    if (!imgSrc) return

    const img = new UniImage()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (!canvas.current) return
      const { width, height } = canvas.current
      drawImage({
        ctx: ctx.current,
        img,
        width,
        height,
      })
    }

    img.src = imgSrc
  }, [imgSrc, canvas, ctx])

  const { eraseGrid, drawGrid } = useGrid({
    canvas: canvas.current,
    ctx: ctx.current,
  })

  useEffect(() => {
    if (!isLoaded) return
    if (hideGrid) {
      eraseGrid()
    } else {
      drawGrid({ gridColor })
    }
    drawImageRequest()
  }, [hideGrid, isLoaded, gridColor, drawGrid, eraseGrid, drawImageRequest])

  return { background }
}
