import { useCanvasRef } from './canvas'
import { useCallback } from 'react'

export function useDrawingLayers() {
  const { canvas: persistLayer, ctx: persistCtx } = useCanvasRef()
  const { canvas: tempLayer, ctx: tempCtx } = useCanvasRef()

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
    clear,
    persistLayer,
    tempLayer,
    tempCtx,
    persistCtx,
  }
}
