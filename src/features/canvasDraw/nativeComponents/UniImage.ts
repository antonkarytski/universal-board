import { Platform } from 'react-native'

type UniImageType = {
  new (width?: number, height?: number): HTMLImageElement
}

const UniImage: UniImageType = Platform.select({
  native: () => {
    //@ts-ignore
    const { GImage } = require('@flyskywhy/react-native-gcanvas')
    return GImage
  },
  default: () => window.Image,
})()

export default UniImage
