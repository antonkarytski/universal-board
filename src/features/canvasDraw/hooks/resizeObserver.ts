import { useCallback, useEffect, useRef } from 'react'
import { View } from 'react-native'
import ResizeObserver from 'resize-observer-polyfill'
import { IS_WEB } from '../helpers/platform'
import { setCanvasSize } from '../helpers'

type UseResizeObserverProps = {
  onResize: ResizeObserverCallback
  isLoaded?: boolean
}

export function useResizeObserver({
  onResize,
  isLoaded,
}: UseResizeObserverProps) {
  const observable = useRef<View | Element | null>(null)

  useEffect(() => {
    console.log(!IS_WEB, !observable.current, !isLoaded)
    if (!IS_WEB || !observable.current || !isLoaded) return

    const canvasContainerWeb = observable.current as any as Element

    const observer = new ResizeObserver(onResize)
    observer.observe(canvasContainerWeb)

    return () => observer.unobserve(canvasContainerWeb)
  }, [onResize, isLoaded])

  return { observable }
}
