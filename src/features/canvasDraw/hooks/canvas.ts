import { useRef } from 'react'

export function useCanvasRef() {
  const canvas = useRef<HTMLCanvasElement | null>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  if (canvas.current && !ctx.current)
    ctx.current = canvas.current.getContext('2d')

  return { canvas, ctx }
}
