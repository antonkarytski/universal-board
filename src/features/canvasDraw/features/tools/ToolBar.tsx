import React from 'react'
import { StyleSheet, View } from 'react-native'
import ColorPicker from './ColorPicker'
import { Colors } from '../../types'
import ShapePicker from './ShapePicker'
import { ShapeName } from '../../shapes'
import ThicknessSlider from './ThicknessSlider'
import {
  faPen,
  faEraser,
  faReply,
  faShare,
  faTrash,
  faPlay,
  faPause,
} from '@fortawesome/free-solid-svg-icons'
import IconButton from '../../ui/IconButton'

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
        <ShapePicker
          color={currentColor}
          onSelect={onShapeSelect}
          currentValue={currentShape}
        />
        <IconButton
          icon={faPen}
          onPress={() => onShapeSelect('_free')}
          color={currentColor}
        />
        <IconButton
          icon={faEraser}
          onPress={() => onShapeSelect('_erase')}
          size={30}
        />
        <ThicknessSlider
          color={currentColor}
          onSelect={onThicknessSelect}
          currentValue={currentThickness}
        />
        <IconButton icon={faReply} onPress={onStepBack} />
        <IconButton icon={faShare} onPress={onStepForward} />
        <IconButton
          icon={isHistoryPlaying ? faPause : faPlay}
          onPress={onHistoryReplay}
        />
        <IconButton
          style={styles.trashButton}
          icon={faTrash}
          color={'#fff'}
          onPress={onClear}
        />
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
    alignItems: 'center',
  },

  button: {
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
  },
  trashButton: {
    backgroundColor: '#ff5279',
    borderRadius: 10,
  },
})
