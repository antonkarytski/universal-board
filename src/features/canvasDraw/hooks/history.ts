import { MutableRefObject, useRef } from 'react'
import { SpecifiedShape } from '../types'

type UseDrawHistoryProps = {
  cache: MutableRefObject<SpecifiedShape[]>
}

export function useDrawHistory({ cache }: UseDrawHistoryProps) {}
