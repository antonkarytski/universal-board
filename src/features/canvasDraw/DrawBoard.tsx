import React, { useState } from 'react'
import DrawArea from './DrawArea'
import ToolBar from './tools/ToolBar'
import { GREY } from './constants/colors'
import { Colors } from './types'

export default function DrawBoard() {
  const [brushColor, setBrushColor] = useState<Colors>(GREY)

  return (
    <>
      <DrawArea brushColor={brushColor}>
        <ToolBar currentColor={brushColor} onColorSelect={setBrushColor} />
      </DrawArea>
    </>
  )
}
