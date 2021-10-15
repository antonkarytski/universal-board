import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import React, { useEffect } from 'react'
import TextArea from './TextArea'
import { TextBlockPosition } from './types'
import { TextLayerController } from '../../hooks/layer.text'

type TextShapeProps = {
  style?: StyleProp<ViewStyle>
  itemStyle?: StyleProp<ViewStyle>
  isActive: boolean
  controller: TextLayerController
}

export default function TextLayer({
  style,
  itemStyle,
  controller: { values, list, removeBlank },
  isActive,
}: TextShapeProps) {
  useEffect(() => {
    if (!isActive) {
      removeBlank()
    }
  }, [isActive, removeBlank])

  return (
    <View
      style={[
        style,
        styles.container,
        isActive ? styles.activeContainer : null,
      ]}>
      {list.map((position, index) => (
        <TextArea
          key={index}
          style={itemStyle}
          position={position}
          isActive={isActive}
          onChangeText={text => {
            values.current[index] = text
          }}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    zIndex: 11,
  },
  activeContainer: {
    zIndex: 15,
  },
  input: {
    width: 100,
    height: 50,
    position: 'absolute',
    overlayColor: 'transparent',
  },
  activeInput: {
    borderColor: '#333',
    borderStyle: 'dashed',
    borderWidth: 1,
  },
})
