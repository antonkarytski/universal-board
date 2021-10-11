import { TextInput } from 'react-native'
import React from 'react'

type TextShapeProps = {}

export default function TextShape({}: TextShapeProps) {
  return (
    <TextInput
      onChange={(e) => {
        e.nativeEvent.text
      }}
      onChangeText={() => {}}
    ></TextInput>
  )
}
