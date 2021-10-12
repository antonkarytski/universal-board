import React, { useState } from 'react'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import PalletTool from '../../ui/PalletTool'
import { PickerProps } from './types'
import { StyleSheet } from 'react-native'

type ThicknessSliderProps = PickerProps<number>

export default function ThicknessSlider({
  currentValue,
  onSelect,
}: ThicknessSliderProps) {
  const [value, setValue] = useState(currentValue)

  return (
    <PalletTool style={styles} buttonInner={'Thickness'}>
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
  button: {},
})
