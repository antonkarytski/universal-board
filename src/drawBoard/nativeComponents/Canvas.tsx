import React from 'react'
import { Platform } from 'react-native'
import { CanvasProps } from './types'
import { IS_WEB } from '../helpers/platform'

const DeterminedCanvas = Platform.select({
  native: IS_WEB ? () => null : () => require('./Canvas.native'),
  default: () => require('./Canvas.web'),
})()
export default function Canvas(props: CanvasProps) {
  return <DeterminedCanvas {...props} />
}
