import UniFontAwesome, {
  UniFontAwesomeProps,
} from '../nativeComponents/UniFontAwesome'
import { IS_WEB } from '../helpers/platform'
import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

type IconButtonProps = {
  onPress?: () => void
  style?: StyleProp<ViewStyle>
} & Omit<UniFontAwesomeProps, 'style'>

export default function IconButton({
  onPress,
  style,
  color = '#333',
  size = 25,
  icon,
}: IconButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <UniFontAwesome
        icon={icon}
        color={color}
        size={!IS_WEB ? size : undefined}
        style={IS_WEB ? { fontSize: size } : {}}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
})
