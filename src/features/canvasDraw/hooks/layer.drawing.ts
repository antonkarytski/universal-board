import { useCanvasRef } from './canvas'
import { baseShapes } from './canvasActions'
import { Line, Point } from '../types'
import { useCallback, useRef } from 'react'

export function useDrawingLayers() {
  const linesCache = useRef<Line[]>([])
  const { canvas: persistLayer, ctx: persistCtx } = useCanvasRef()
  const { canvas: tempLayer, ctx: tempCtx } = useCanvasRef()

  function drawShape(line: Line) {
    if (!tempCtx.current) return
    baseShapes.free(tempCtx.current, line, { lastPart: true }).catch(() => {})
  }

  function saveShape(line: Line) {
    if (line.points.length < 2 || !persistCtx.current) return

    linesCache.current.push(line)

    baseShapes.free(persistCtx.current, line).then(() => {
      if (tempLayer.current) {
        const width = tempLayer.current.width
        const height = tempLayer.current.height
        tempCtx.current?.clearRect(0, 0, width, height)
      }
    })
  }

  const clear = useCallback(() => {
    linesCache.current = []
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

  return { drawShape, saveShape, clear, persistLayer, tempLayer, linesCache }
}
