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

const Shapes = {
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

export type ShapeName = keyof typeof Shapes
export default Shapes
