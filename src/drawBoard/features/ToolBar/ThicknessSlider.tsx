import React, { useState } from 'react'
import PalletTool from '../../ui/PalletTool'
import { PickerProps } from './types'
import { StyleSheet, View } from 'react-native'
import Slider from '@react-native-community/slider'

type ThicknessSliderProps = PickerProps<number> & {
  color?: string
}

export default function ThicknessSlider({
  currentValue,
  onSelect,
  color = '#333',
}: ThicknessSliderProps) {
  const [value, setValue] = useState(currentValue)

  const markerStyle = {
    width: value * 2,
    height: value * 2,
    borderRadius: 100,
    backgroundColor: color,
  }

  return (
    <>
      <PalletTool style={styles} buttonInner={<View style={[markerStyle]} />}>
        <Slider
          onValueChange={setValue}
          onResponderEnd={() => onSelect(value)}
          value={value}
          style={styles.slider}
          minimumValue={2.5}
          maximumValue={25}
        />
      </PalletTool>
    </>
  )
}

const styles = StyleSheet.create({
  pallet: {
    width: 170,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  slider: {
    width: '100%',
  },
  marker: {},
})
