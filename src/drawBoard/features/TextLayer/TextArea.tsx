import { StyleSheet, TextInput } from 'react-native'
import { webInputStyle } from '../../helpers/styles'
import React from 'react'
import { TextAreaProps } from './types'

export default function TextArea({
  isActive,
  style,
  onChangeText,
  position: { height, width, p1 },
}: TextAreaProps) {
  //const [value, setValue] = useState('')

  const position = {
    transform: [{ translateY: p1.y }, { translateX: p1.x }],
    minWidth: width > 100 ? width : 100,
    minHeight: height > 50 ? height : 50,
  }
  return (
    <TextInput
      autoFocus
      multiline
      scrollEnabled={false}
      style={[
        styles.input,
        style,
        position,
        isActive ? styles.activeInput : null,
        //@ts-ignore
        webInputStyle,
      ]}
      onChangeText={onChangeText}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    position: 'absolute',
    overlayColor: 'transparent',
  },
  inputText: {
    color: '#333',
    zIndex: 25,
  },
  activeInput: {
    borderColor: '#333',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
})
