import React, { useState } from 'react'
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

const styles = StyleSheet.create({
  openButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  palletContainer: {
    width: 160,
    flexWrap: 'wrap',
    //height: 200,
    position: 'absolute',
    top: 6,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    right: 70,
    elevation: 2,
  },
})
