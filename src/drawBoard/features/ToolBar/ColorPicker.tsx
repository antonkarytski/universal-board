import React from 'react'
import * as COLORS from '../../constants/colors'
import ColorPickerItem from './ColorPickerItem'
import { Colors } from '../../types'
import PalletTool from '../../ui/PalletTool'
import { PickerProps } from './types'

type ColorPickerProps = PickerProps<Colors>

const COLORS_LIST = Object.values(COLORS)

export default function ColorPicker({
  onSelect,
  currentValue,
}: ColorPickerProps) {
  const button = {
    backgroundColor: currentValue,
  }

  return (
    <PalletTool list={COLORS_LIST} style={{ button }}>
      {(color) => {
        return (
          <ColorPickerItem
            color={color}
            isActive={currentValue === color}
            onSelect={() => onSelect(color)}
            key={color}
          />
        )
      }}
    </PalletTool>
  )
}
