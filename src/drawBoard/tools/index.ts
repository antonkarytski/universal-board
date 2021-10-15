import { Free } from './free'
import { Erase } from './erase'
import { Circle } from './circle'
import {
  TriangleRight,
  TriangleSymmetricHorizontal,
  TriangleSymmetricVertical,
} from './triangle'
import { Rectangle } from './rectangle'
import { Line } from './line'
import { dummyShape } from './_helpers'
import { ToolInterface } from '../types'

const Tools = {
  _free: Free,
  _erase: Erase,
  _line: Line,
  _circle: Circle,
  _rectangle: Rectangle,
  _triangleRight: TriangleRight,
  _triangleSymmetricVertical: TriangleSymmetricVertical,
  _triangleSymmetricHorizontal: TriangleSymmetricHorizontal,
  _text: dummyShape('_text'),
}

export type ToolName = keyof typeof Tools

type ShapeSetProps = {
  _text?: ToolInterface
}

export class ToolsSet {
  _free = Free
  _erase = Erase
  _line = Line
  _circle = Circle
  _rectangle = Rectangle
  _triangleRight = TriangleRight
  _triangleSymmetricVertical = TriangleSymmetricVertical
  _triangleSymmetricHorizontal = TriangleSymmetricHorizontal
  _text = dummyShape('_text')

  constructor({ _text }: ShapeSetProps = {}) {
    if (_text) this._text = _text
  }
}

export default Tools
