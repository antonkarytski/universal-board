import { Coordinates } from 'lazy-brush'

export function distanceBetween(p1: Coordinates, p2: Coordinates) {
  const c1 = (p1.x - p2.x) ** 2
  const c2 = (p1.y - p2.y) ** 2
  return Math.sqrt(c1 + c2)
}
