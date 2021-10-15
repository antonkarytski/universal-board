import { useEffect, useRef } from 'react'
import { LazyBrush } from 'lazy-brush'
import {
  nativeDevicePixelRation,
  windowHeight,
  windowWidth,
} from '../constants'

type UseBrushProps = {
  lazyRadius: number
  brushColor: string
  brushRadius: number
}

export type LazyBrushInterface = ReturnType<typeof useBrush>

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

export function useBrush({ lazyRadius, ...settings }: UseBrushProps) {
  const lazy = useRef<LazyBrush>(createLazyBrush(lazyRadius))
  const chainLength = lazyRadius * nativeDevicePixelRation
  const resetLength = () => lazy.current.setRadius(chainLength)

  useEffect(() => {
    lazy.current.setRadius(chainLength)
  }, [chainLength])

  return { lazy, chainLength, resetLength, ...settings }
}
