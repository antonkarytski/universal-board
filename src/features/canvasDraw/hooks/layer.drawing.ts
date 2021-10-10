import { useCanvasRef } from './canvas'
import { MutableRefObject, useCallback } from 'react'
import { useShape } from './shape'
import { Free } from '../shapes/free'
import { LazyBrushInterface } from './brush'
import { SpecifiedShape } from '../types'

type UseDrawingLayersProps = {
  onMove: () => void
  brush: LazyBrushInterface
  cache: MutableRefObject<SpecifiedShape[]>
}

export function useDrawingLayers({
  onMove,
  brush,
  cache,
}: UseDrawingLayersProps) {
  const { canvas: persistLayer, ctx: persistCtx } = useCanvasRef()
  const { canvas: tempLayer, ctx: tempCtx } = useCanvasRef()
  const { controller } = useShape(Free, {
    onMove,
    sizeCanvas: persistLayer,
    persistCtx,
    tempCtx,
    cache,
    brush,
  })

  const clear = useCallback(() => {
    //linesCache.current = []
    if (persistCtx.current) {
      persistCtx.current.clearRect(
        0,
        0,
        persistLayer.current?.width || 400,
        persistLayer.current?.height || 400
      )
    }
    if (tempCtx.current) {
      tempCtx.current.clearRect(
        0,
        0,
        tempLayer.current?.width || 400,
        tempLayer.current?.height || 400
      )
    }
  }, [tempCtx, tempLayer, persistCtx, persistLayer])

  return {
    interactController: controller,
    clear,
    persistLayer,
    tempLayer,
    tempCtx,
    persistCtx,
  }
}
