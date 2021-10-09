import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

type ColorPickerItemProps = {
  color: string
  isActive: boolean
  onSelect: () => void
}

export default function ColorPickerItem({
  color,
  isActive,
  onSelect,
}: ColorPickerItemProps) {
  const buttonColor = {
    backgroundColor: color,
  }

  return (
    <TouchableOpacity style={[styles.button, buttonColor]} onPress={onSelect} />
  )
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 10,
    margin: 3,
  },
})
