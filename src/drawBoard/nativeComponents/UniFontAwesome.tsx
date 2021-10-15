import { Platform } from 'react-native'
import { FontAwesomeIconStyle } from '@fortawesome/react-native-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { CSSProperties, FC } from 'react'

export type UniFontAwesomeProps = {
  icon: IconProp
  size?: number
  color?: string
  mask?: IconProp
  style?: FontAwesomeIconStyle | CSSProperties
}

const UniFontAwesome: FC<UniFontAwesomeProps> = Platform.select({
  native: () => {
    const { FontAwesomeIcon } = require('@fortawesome/react-native-fontawesome')
    return FontAwesomeIcon
  },
  default: () => {
    const { FontAwesomeIcon } = require('@fortawesome/react-fontawesome')
    return FontAwesomeIcon
  },
})()

export default UniFontAwesome
