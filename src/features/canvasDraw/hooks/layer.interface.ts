import { useCallback, useEffect, useRef } from 'react'
import { Catenary } from 'catenary-curve'
import { CanvasInterface, useCanvasRef } from './canvas'
import { LazyBrushInterface } from './brush'

type UseCanvasInterfaceDrawProps = {
  catenaryColor: string
  hideInterface: boolean | undefined
  isLoaded: boolean
  brush: LazyBrushInterface
}

export type InterfaceLayerController = CanvasInterface & {
  update: () => void
}

export function useInterfaceLayer({
  catenaryColor,
  hideInterface,
  brush: { lazy, chainLength, brushColor, brushRadius },
  isLoaded,
}: UseCanvasInterfaceDrawProps) {
  const catenary = useRef(new Catenary())
  const interfaceLayer = useCanvasRef() as InterfaceLayerController
  const { canvas, ctx: interfaceCtx } = interfaceLayer

  const update = useCallback(() => {
    if (hideInterface || !interfaceCtx.current || !canvas.current) {
      return
    }
    const { width, height } = canvas.current
    const pointer = lazy.current.getPointerCoordinates()
    const brush = lazy.current.getBrushCoordinates()
    const ctx = interfaceCtx.current
    ctx.clearRect(0, 0, width, height)

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
      catenary.current.drawToCanvas(ctx, brush, pointer, chainLength)
      ctx.stroke()
    }

    // Draw brush point (the one in the middle of the brush preview)
    ctx.beginPath()
    ctx.fillStyle = catenaryColor
    ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true)
    ctx.fill()
  }, [
    catenaryColor,
    catenary,
    brushColor,
    brushRadius,
    hideInterface,
    lazy,
    chainLength,
    canvas,
    interfaceCtx,
  ])

  useEffect(() => {
    if (!isLoaded) return
    update()
  }, [isLoaded, update])

  interfaceLayer.update = update

  return interfaceLayer
}
