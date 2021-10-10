import { Dimensions, Platform } from 'react-native'

export const IS_WEB = Platform.OS === 'web'
export const IS_MOBILE = Platform.OS === 'android' || Platform.OS === 'ios'

export function getWindowSize() {
  return Dimensions.get('window')
}
