import React from 'react'
import * as COLORS from '../../constants/colors'
import ColorPickerItem from './ColorPickerItem'
import { StyleSheet } from 'react-native'
import { Colors } from '../../types'
import PalletTool from '../../ui/PalletTool'

type ColorPickerProps = {
  onSelect: (color: Colors) => void
  currentColor: Colors
}

const COLORS_LIST = Object.values(COLORS)

export default function ColorPicker({
  onSelect,
  currentColor,
}: ColorPickerProps) {
  const buttonColor = {
    backgroundColor: currentColor,
  }

  return (
    <PalletTool list={COLORS_LIST} style={buttonColor}>
      {(color) => {
        return (
          <ColorPickerItem
            color={color}
            isActive={currentColor === color}
            onSelect={() => onSelect(color)}
            key={color}
          />
        )
      }}
    </PalletTool>
  )
}
