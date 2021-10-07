import { IS_WEB } from '../helpers/platform'
import { Platform } from 'react-native'

type UniImageType = {
  new (width?: number, height?: number): HTMLImageElement
}

const UniImage: UniImageType = Platform.select({
  web: () => window.Image,
  default: () => {
    const { GImage } = require('@flyskywhy/react-native-gcanvas')
    return GImage
  },
})()

export default UniImage
