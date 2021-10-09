import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import ColorPicker from './ColorPicker/ColorPicker'
import { Colors } from '../types'

type ToolBarProps = {
  currentColor: Colors
  onColorSelect: (color: Colors) => void
}

export default function ToolBar({ onColorSelect, currentColor }: ToolBarProps) {
  return (
    <>
      <View style={styles.container}>
        <ColorPicker onSelect={onColorSelect} currentColor={currentColor} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 20,
    elevation: 2,
    backgroundColor: 'white',
    top: 10,
    right: 10,
    borderRadius: 15,
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
})
