import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import ColorPicker from './ColorPicker/ColorPicker'
import { Colors } from '../types'

type ToolBarProps = {
  currentColor: Colors
  onColorSelect: (color: Colors) => void
  onStepBack: () => void
  onStepForward: () => void
}

export default function ToolBar({
  onColorSelect,
  currentColor,
  onStepBack,
  onStepForward,
}: ToolBarProps) {
  return (
    <>
      <View style={styles.container}>
        <ColorPicker onSelect={onColorSelect} currentColor={currentColor} />
        <TouchableOpacity style={styles.button} onPress={onStepBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onStepForward}>
          <Text style={styles.buttonText}>Forward</Text>
        </TouchableOpacity>
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

  button: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
  },
})
