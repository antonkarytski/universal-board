import React from 'react'
import { Platform } from 'react-native'
import { CanvasProps } from './types'
import { IS_WEB } from '../canvasDraw/helpers/platform'

const DeterminedCanvas = Platform.select({
  native: () => require('./Canvas.native'),
  default: () => require('./Canvas.web'),
})()

export default function Canvas(props: CanvasProps) {
  return <DeterminedCanvas {...props} />
}

type UniImageType = {
  new (width?: number, height?: number): HTMLImageElement
}

const UniImage: UniImageType = Platform.select({
  native: () => {
    const { GImage } = require('@flyskywhy/react-native-gcanvas')
    return GImage
  },
  default: () => window.Image,
})()
