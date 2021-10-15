import {useEffect, useRef} from 'react'
import {View} from 'react-native'
import ResizeObserver from 'resize-observer-polyfill'
import {IS_WEB} from '../helpers/platform'

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
    if (!IS_WEB || !observable.current || !isLoaded) return

    const canvasContainerWeb = (observable.current as any) as Element

    const observer = new ResizeObserver(onResize)
    observer.observe(canvasContainerWeb)

    return () => observer.unobserve(canvasContainerWeb)
  }, [onResize, isLoaded])

  return {observable}
}
