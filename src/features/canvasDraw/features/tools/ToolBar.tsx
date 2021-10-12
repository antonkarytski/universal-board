import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ColorPicker from './ColorPicker'
import { Colors } from '../../types'
import ShapePicker from './ShapePicker'
import { ShapeName } from '../../shapes'
import ThicknessSlider from './ThicknessSlider'

type ToolBarProps = {
  currentColor: Colors
  onColorSelect: (color: Colors) => void
  currentShape: ShapeName
  onShapeSelect: (shape: ShapeName) => void
  currentThickness: number
  onThicknessSelect: (value: number) => void
  onStepBack: () => void
  onStepForward: () => void
  isHistoryPlaying: boolean
  onHistoryReplay: () => void
  onClear: () => void
}

export default function ToolBar({
  onColorSelect,
  currentColor,
  onShapeSelect,
  currentShape,
  onThicknessSelect,
  currentThickness,
  onStepBack,
  onStepForward,
  isHistoryPlaying,
  onHistoryReplay,
  onClear,
}: ToolBarProps) {
  return (
    <>
      <View style={styles.container}>
        <ColorPicker onSelect={onColorSelect} currentValue={currentColor} />
        <ShapePicker onSelect={onShapeSelect} currentValue={currentShape} />
        <TouchableOpacity
          style={styles.button}
          onPress={() => onShapeSelect('_free')}
        >
          <Text style={styles.buttonText}>Pen</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => onShapeSelect('_erase')}
        >
          <Text style={styles.buttonText}>Erase</Text>
        </TouchableOpacity>
        <ThicknessSlider
          onSelect={onThicknessSelect}
          currentValue={currentThickness}
        />
        <TouchableOpacity style={styles.button} onPress={onStepBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onStepForward}>
          <Text style={styles.buttonText}>Forward</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onHistoryReplay}>
          <Text style={styles.buttonText}>
            {isHistoryPlaying ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClear}>
          <Text style={styles.buttonText}>Clear</Text>
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
