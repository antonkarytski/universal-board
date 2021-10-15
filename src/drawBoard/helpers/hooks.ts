import { useRef } from 'react'

export function useComponentWillMount(fn: () => void) {
  const isMounted = useRef(false)
  if (!isMounted.current) {
    fn()
    isMounted.current = true
  }
}
