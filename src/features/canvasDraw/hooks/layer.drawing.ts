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

type ClearProps = {
  preventSave?: boolean
}

export function useDrawingLayers({ onMove, brush }: UseDrawingLayersProps) {
  const persist = useCanvasRef()
  const { canvas: persistLayer, ctx: persistCtx } = persist
  const { canvas: tempLayer, ctx: tempCtx } = useCanvasRef()

  const { history, controller: historyController } = useDrawHistory(persist)
  const { controller: interactController } = useShape(Free, {
    sizeCanvas: persistLayer,
    persistCtx,
    tempCtx,
    history,
    onMove,
    brush,
  })

  const clear = useCallback(
    ({ preventSave }: ClearProps = {}) => {
      clearCanvas(tempLayer.current)
      clearCanvas(persistLayer.current)
      if (preventSave) return
      history.add({
        name: '_clear',
        special: true,
        brushColor: '',
        points: [],
        brushRadius: 0,
      })
    },
    [tempLayer, persistLayer, history]
  )

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
