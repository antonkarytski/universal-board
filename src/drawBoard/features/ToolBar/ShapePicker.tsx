import React from 'react'
import { ToolName } from '../../tools'
import PalletTool from '../../ui/PalletTool'
import { StyleSheet } from 'react-native'
import { PickerProps } from './types'
import {
  faCircle,
  faShapes,
  faSlash,
  faSquare,
} from '@fortawesome/free-solid-svg-icons'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import UniFontAwesome from '../../nativeComponents/UniFontAwesome'
import IconButton from '../../ui/IconButton'
import { IS_WEB } from '../../helpers/platform'

const SHAPES_ICONS: Partial<{ [key in ToolName]: IconProp }> = {
  _circle: faCircle,
  _line: faSlash,
  _rectangle: faSquare,
  _triangleRight: faShapes,
  _triangleSymmetricHorizontal: faShapes,
  _triangleSymmetricVertical: faShapes,
}
const SHAPES_LIST = Object.entries(SHAPES_ICONS) as [ToolName, IconProp][]

type ShapePickerProps = PickerProps<ToolName> & {
  color?: string
}

export default function ShapePicker({
  currentValue,
  onSelect,
  color,
}: ShapePickerProps) {
  return (
    <PalletTool
      style={styles}
      buttonInner={
        <UniFontAwesome
          color={color}
          size={!IS_WEB ? 30 : undefined}
          icon={SHAPES_ICONS[currentValue] || faShapes}
          style={IS_WEB ? { fontSize: 30 } : {}}
        />
      }
      list={SHAPES_LIST}
    >
      {([shapeName, shapeLabel]) => {
        return (
          <IconButton
            color={color}
            key={shapeName}
            icon={shapeLabel}
            onPress={() => onSelect(shapeName)}
          />
        )
      }}
    </PalletTool>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
