import React, { useRef, useState } from 'react'
import DrawArea from './DrawArea'
import ToolBar from './tools/ToolBar'
import { GREY } from './constants/colors'
import { ActionsController, Colors, HistoryController } from './types'

const dummyHistoryController: HistoryController = {
  stepBack() {},
  stepForward() {},
}

const dummyBoardController: ActionsController = {
  clear() {},
}

export default function DrawBoard() {
  const [brushColor, setBrushColor] = useState<Colors>(GREY)
  const historyController = useRef(dummyHistoryController)
  const boardController = useRef(dummyBoardController)

  return (
    <>
      <DrawArea
        brushColor={brushColor}
        historyController={historyController}
        controller={boardController}
      >
        <ToolBar
          currentColor={brushColor}
          onColorSelect={setBrushColor}
          onStepBack={() => historyController.current.stepBack()}
          onStepForward={() => historyController.current.stepForward()}
          onClear={() => boardController.current.clear()}
        />
      </DrawArea>
    </>
  )
}
