import { LazyBrushInterface } from './brush'
import { useDrawHistory } from './history'
import { clearCanvas } from '../helpers'
import { useCanvasRef } from './canvas'
import { useCallback } from 'react'
import { useShape } from './shape'
import { ShapeInterface } from '../types'
import { createSpecialShapeRecord } from '../helpers/shapes'

type UseDrawingLayersProps = {
  onMove: () => void
  brush: LazyBrushInterface
  shape: ShapeInterface
}

type ClearProps = {
  preventSave?: boolean
}

export function useDrawingLayers({
  onMove,
  brush,
  shape,
}: UseDrawingLayersProps) {
  const persist = useCanvasRef()
  const { canvas: persistLayer, ctx: persistCtx } = persist
  const { canvas: tempLayer, ctx: tempCtx } = useCanvasRef()

  const { history, controller: historyController } = useDrawHistory(persist)
  const { controller: interactController } = useShape(shape, {
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
      history.add(createSpecialShapeRecord({ name: '_clear' }))
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
