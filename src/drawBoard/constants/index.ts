import { Dimensions, PixelRatio } from 'react-native'
import { CanvasTypesList } from '../types'

export const nativeDevicePixelRation = PixelRatio.get()
export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height

export const canvasTypes: CanvasTypesList = [
  {
    name: 'interface',
    zIndex: 15,
  },
  {
    name: 'persist',
    zIndex: 11,
  },
  {
    name: 'temp',
    zIndex: 12,
  },
  {
    name: 'background',
    zIndex: 10,
  },
]
