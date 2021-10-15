import { useCallback, useMemo, useRef } from 'react'
import { clearCanvas } from '../helpers'

export function useCanvasRef() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  if (canvas.current && !ctx.current) {
    ctx.current = canvas.current.getContext('2d')
  }

  const clear = useCallback(() => {
    if (!canvas.current) return
    clearCanvas(canvas.current)
  }, [])

  return useMemo(() => ({ canvas, ctx, clear }), [canvas, ctx, clear])
}

export type CanvasInterface = ReturnType<typeof useCanvasRef>
