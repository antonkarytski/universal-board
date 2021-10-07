import { useEffect, useRef } from 'react'
import { Platform, View } from 'react-native'
import ResizeObserver from 'resize-observer-polyfill'

type UseResizeObserverProps = {
  onResize: ResizeObserverCallback
}

export function useResizeObserver({ onResize }: UseResizeObserverProps) {
  const observable = useRef<View | Element | null>(null)

  useEffect(() => {
    if (Platform.OS !== 'web' || !observable.current) return
    const canvasContainerWeb = observable.current as any as Element

    const observer = new ResizeObserver(onResize)
    observer.observe(canvasContainerWeb)

    return () => observer.unobserve(canvasContainerWeb)
  }, [onResize])

  return { observable }
}
