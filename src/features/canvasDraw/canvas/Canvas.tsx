import React from 'react'
import { Platform } from 'react-native'
import { CanvasProps } from './types'

const DeterminedCanvas = Platform.select({
  native: () => require('./Canvas.native'),
  default: () => require('./Canvas.web'),
})()
export default function Canvas(props: CanvasProps) {
  return <DeterminedCanvas {...props} />
}
