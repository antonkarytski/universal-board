import { useCallback } from 'react'

export function usePersist() {
  // const simulateDrawingLines = useCallback(
  //   ({ lines, immediate }: { lines: Line[]; immediate?: boolean }) => {
  //     let curTime = 0
  //     let timeoutGap = immediate ? 0 : loadTimeOffset
  //
  //     lines.forEach((line) => {
  //       if (immediate) {
  //         drawMassive(line)
  //         saveLine(line)
  //         return
  //       }
  //
  //       const { points, ...settings } = line
  //
  //       for (let i = 1; i < points.length; i++) {
  //         curTime += timeoutGap
  //         setTimeout(() => {
  //           drawMassive({
  //             points: points.slice(0, i + 1),
  //             ...settings,
  //           })
  //         }, curTime)
  //       }
  //
  //       curTime += timeoutGap
  //       setTimeout(() => {
  //         saveLine(line)
  //       }, curTime)
  //     })
  //   },
  //   [drawMassive, loadTimeOffset, saveLine]
  // )

  const loadSaveData = useCallback((savedData: string | object, immediate) => {
    // if (typeof savedData !== 'string') {
    //   throw new Error('savedData needs to be of type string!')
    // }
    // if (!savedData) return
    //
    // const { lines, width, height } = JSON.parse(savedData)
    //
    // if (!Array.isArray(lines)) {
    //   throw new Error('savedData.lines needs to be an array!')
    // }
    //
    // clear()
    //
    // if (width === canvasWidth && height === canvasHeight) {
    //   simulateDrawingLines({
    //     lines,
    //     immediate,
    //   })
    // } else {
    //   // we need to rescale the lines based on saved & current dimensions
    //   const scaleX = +canvasWidth / width
    //   const scaleY = +canvasHeight / height
    //   const scaleAvg = (scaleX + scaleY) / 2
    //
    //   simulateDrawingLines({
    //     lines: linesCache.current.map((line) => ({
    //       ...line,
    //       points: line.points.map((p) => ({
    //         ...p,
    //         x: p.x * scaleX,
    //         y: p.y * scaleY,
    //       })),
    //       brushRadius: line.brushRadius * scaleAvg,
    //     })) as Line[],
    //     immediate,
    //   })
    // }
  }, [])

  const getSaveData = useCallback(() => {
    return '{}'
    // return JSON.stringify({
    //   lines: linesCache.current,
    //   width: canvasWidth,
    //   height: canvasHeight,
    // })
  }, [])

  // useEffect(() => {
  //   loadSaveData(saveData)
  // }, [saveData, loadSaveData])

  // function undo() {
  //   const lines = linesCache.current.slice(0, -1)
  //   clear()
  //   simulateDrawingLines({ lines, immediate: true })
  //   triggerOnChangeProxy.current()
  // }

  // Load saveData from prop if it exists
  // if (saveData) {
  //   loadSaveData(saveData)
  // }

  // triggerOnChangeProxy.current = useCallback(() => {
  // 	// if (onChange)
  // 	//   onChange({
  // 	//     getSaveData,
  // 	//     loadSaveData,
  // 	//     clear,
  // 	//   })
  // }, [])
}
