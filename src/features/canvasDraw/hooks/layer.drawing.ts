import { useCanvasRef } from './canvas'

export function useDrawingLayers() {
  const persist = useCanvasRef()
  const temp = useCanvasRef()

  return {
    persist,
    temp,
  }
}
