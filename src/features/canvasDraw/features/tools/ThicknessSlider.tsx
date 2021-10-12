import React, { useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import PalletTool from '../../ui/PalletTool'
import { PickerProps } from './types'
import { StyleSheet, View } from 'react-native'

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
    width: currentValue,
    height: currentValue,
    borderRadius: 100,
    backgroundColor: color,
  }

  return (
    <PalletTool style={styles} buttonInner={<View style={[markerStyle]} />}>
      <MultiSlider
        values={[value]}
        sliderLength={130}
        min={5}
        max={40}
        onValuesChangeFinish={([val]) => onSelect(val)}
        onValuesChange={([val]) => setValue(val)}
        enabledOne
        enabledTwo={false}
      />
    </PalletTool>
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
  marker: {},
})
