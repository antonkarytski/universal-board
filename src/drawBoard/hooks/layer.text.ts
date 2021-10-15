import { useCallback, useMemo, useRef, useState } from 'react'
import { TextShapeCreateHandler } from '../tools/text'
import { TextBlockPosition } from '../features/TextLayer/types'

export function useTextLayer() {
  const [list, setList] = useState<TextBlockPosition[]>([])
  const values = useRef<string[]>([])

  const addTextShape: TextShapeCreateHandler = (p1, { height, width }) => {
    const textShapePosition = {
      p1,
      width: Math.abs(width),
      height: Math.abs(height),
    }
    setList((state) => [...state, textShapePosition])
  }

  const removeBlank = useCallback(() => {
    setList((current) =>
      current.filter((_, index) => {
        return !!values.current[index]
      })
    )
    values.current = values.current.filter((val) => !!val)
  }, [])

  const textController = useMemo(() => {
    function clear() {
      setList([])
      values.current = []
    }

    return {
      list,
      setList,
      values,
      removeBlank,
      clear,
    }
  }, [list, removeBlank])

  return {
    textController,
    addTextShape,
  }
}

export type TextLayerController = ReturnType<
  typeof useTextLayer
>['textController']
