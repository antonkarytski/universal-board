import { useEffect, useRef } from 'react'
import { LazyBrush } from 'lazy-brush'
import {
  nativeDevicePixelRation,
  windowHeight,
  windowWidth,
} from '../constants'

type UseLazyBrashProps = {
  lazyRadius: number
}

function createLazyBrush(lazyRadius: number) {
  return new LazyBrush({
    radius: lazyRadius * nativeDevicePixelRation,
    enabled: true,
    initialPoint: {
      x: windowWidth / 2,
      y: windowHeight / 2,
    },
  })
}

export function useLazyBrush({ lazyRadius }: UseLazyBrashProps) {
  const lazy = useRef<LazyBrush>(createLazyBrush(lazyRadius))
  const chainLength = lazyRadius * nativeDevicePixelRation

  useEffect(() => {
    lazy.current.setRadius(lazyRadius * nativeDevicePixelRation)
  }, [lazyRadius])

  return { lazy, chainLength }
}
