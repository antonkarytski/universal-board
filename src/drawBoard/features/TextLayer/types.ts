import { StyleProp, ViewStyle } from 'react-native'
import { Coordinates } from 'lazy-brush'

export type TextBlockPosition = {
  p1: Coordinates
  width: number
  height: number
}
export type TextAreaProps = {
  isActive?: boolean
  style?: StyleProp<ViewStyle>
  position: TextBlockPosition
  onChangeText?: (text: string) => void
}
