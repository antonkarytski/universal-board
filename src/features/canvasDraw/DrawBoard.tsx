import React, { useRef, useState } from 'react'
import DrawArea from './DrawArea'
import ToolBar from './features/tools/ToolBar'
import { GREY } from './constants/colors'
import { ActionsController, Colors, HistoryController } from './types'
import Shapes, { ShapeName } from './shapes'

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
  const [currentShape, setCurrentShape] = useState<ShapeName>('_line')

  return (
    <>
      <DrawArea
        brushColor={brushColor}
        historyController={historyController}
        controller={boardController}
        shape={Shapes[currentShape]}
      >
        <ToolBar
          currentColor={brushColor}
          onColorSelect={setBrushColor}
          currentShape={currentShape}
          onShapeSelect={setCurrentShape}
          onStepBack={() => historyController.current.stepBack()}
          onStepForward={() => historyController.current.stepForward()}
          onClear={() => boardController.current.clear()}
        />
      </DrawArea>
    </>
  )
}
