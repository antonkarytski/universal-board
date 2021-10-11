import { SpecifiedShape } from '../types'

type CreateDummyShapeProps = {
  name: string
  options?: { [key: string]: any }
}

export function createSpecialShapeRecord({
  name,
  options,
}: CreateDummyShapeProps): SpecifiedShape {
  return {
    name,
    special: true,
    brushColor: '',
    points: [],
    brushRadius: 0,
    options,
  }
}
