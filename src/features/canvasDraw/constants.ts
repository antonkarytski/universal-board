import { Dimensions, PixelRatio } from 'react-native'
import { CanvasList, CanvasTypes, CanvasTypesList, ContextList } from './types'

export const nativeDevicePixelRation = PixelRatio.get()
export const windowWidth = Dimensions.get('window').width
export const windowHeight = Dimensions.get('window').height

export const canvasTypes: CanvasTypesList = [
  {
    name: 'interface',
    zIndex: 15,
  },
  {
    name: 'drawing',
    zIndex: 11,
  },
  {
    name: 'temp',
    zIndex: 12,
  },
  {
    name: 'grid',
    zIndex: 10,
  },
]
export const defaultCanvasList: CanvasList = {
  interface: null,
  drawing: null,
  temp: null,
  grid: null,
}
export const defaultContextList: ContextList = {
  interface: null,
  drawing: null,
  temp: null,
  grid: null,
}
