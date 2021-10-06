import { useEffect } from 'react'
import { Platform, View } from 'react-native'
import ResizeObserver from 'resize-observer-polyfill'

type UseResizeObserverProps = {
  canvasContainer: View | null
  onResize: ResizeObserverCallback
}

export function useResizeObserver({
  canvasContainer,
  onResize,
}: UseResizeObserverProps) {
  useEffect(() => {
    if (Platform.OS !== 'web' || !canvasContainer) return
    const canvasContainerWeb = canvasContainer as any as Element

    const observer = new ResizeObserver(onResize)
    observer.observe(canvasContainerWeb)

    return observer.unobserve(canvasContainerWeb)
  }, [onResize, canvasContainer])
}
