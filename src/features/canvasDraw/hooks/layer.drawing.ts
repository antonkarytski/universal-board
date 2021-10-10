import { LazyBrushInterface } from './brush'
import { useDrawHistory } from './history'
import { clearCanvas } from '../helpers'
import { useCanvasRef } from './canvas'
import { Free } from '../shapes/free'
import { useCallback } from 'react'
import { useShape } from './shape'

type UseDrawingLayersProps = {
  onMove: () => void
  brush: LazyBrushInterface
}

export function useDrawingLayers({ onMove, brush }: UseDrawingLayersProps) {
  const persist = useCanvasRef()
  const { canvas: persistLayer, ctx: persistCtx } = persist
  const { canvas: tempLayer, ctx: tempCtx } = useCanvasRef()

  const { cache, controller: historyController } = useDrawHistory(persist)
  const { controller: interactController } = useShape(Free, {
    sizeCanvas: persistLayer,
    persistCtx,
    tempCtx,
    onMove,
    cache,
    brush,
  })

  const clear = useCallback(() => {
    clearCanvas(tempLayer.current)
    clearCanvas(persistLayer.current)
  }, [tempLayer, persistLayer])

  return {
    interactController,
    historyController,
    clear,
    persistLayer,
    tempLayer,
    tempCtx,
    persistCtx,
  }
}
