import React, { useRef, useState } from 'react'
import DrawArea from './DrawArea'
import ToolBar from './tools/ToolBar'
import { GREY } from './constants/colors'
import { Colors, HistoryController } from './types'

const dummyHistoryController: HistoryController = {
  stepBack() {},
  stepForward() {},
}

export default function DrawBoard() {
  const [brushColor, setBrushColor] = useState<Colors>(GREY)
  const historyController = useRef(dummyHistoryController)

  return (
    <>
      <DrawArea brushColor={brushColor} historyController={historyController}>
        <ToolBar
          currentColor={brushColor}
          onColorSelect={setBrushColor}
          onStepBack={() => historyController.current.stepBack()}
          onStepForward={() => historyController.current.stepForward()}
        />
      </DrawArea>
    </>
  )
}
