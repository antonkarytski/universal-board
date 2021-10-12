import { Colors } from '../../types'

export type PickerProps<T> = {
  onSelect: (value: T) => void
  currentValue: T
}
