import { Coordinates } from 'lazy-brush'
import { GestureResponderEvent } from 'react-native'
import { MutableRefObject } from 'react'

type DrawImageProps = {
  ctx: CanvasRenderingContext2D | null
  img: HTMLImageElement
  x?: number
  y?: number
  w?: number
  h?: number
  offsetX?: number
  offsetY?: number
  width: number
  height: number
}

export function drawImage({
  ctx,
  img,
  x,
  y,
  w,
  h,
  offsetX,
  offsetY,
  width,
  height,
}: DrawImageProps) {
  if (!ctx) return
  if (typeof x !== 'number') x = 0
  if (typeof y !== 'number') y = 0
  if (typeof w !== 'number') w = width
  if (typeof h !== 'number') h = height
  if (typeof offsetX !== 'number') offsetX = 0.5
  if (typeof offsetY !== 'number') offsetY = 0.5

  // keep bounds [0.0, 1.0]
  if (offsetX < 0) offsetX = 0
  if (offsetY < 0) offsetY = 0
  if (offsetX > 1) offsetX = 1
  if (offsetY > 1) offsetY = 1

  var iw = img.width,
    ih = img.height,
    r = Math.min(w / iw, h / ih),
    nw = iw * r, // new prop. width
    nh = ih * r, // new prop. height
    cx,
    cy,
    cw,
    ch,
    ar = 1

  // decide which gap to fill
  if (nw < w) ar = w / nw
  if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh // updated
  nw *= ar
  nh *= ar

  // calc source rectangle
  cw = iw / (nw / w)
  ch = ih / (nh / h)

  cx = (iw - cw) * offsetX
  cy = (ih - ch) * offsetY

  // make sure source rectangle is valid
  if (cx < 0) cx = 0
  if (cy < 0) cy = 0
  if (cw > iw) cw = iw
  if (ch > ih) ch = ih

  // fill image in dest. rectangle
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
}

export function midPointBtw(p1: Coordinates, p2: Coordinates) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  }
}

export function setCanvasSize(
  canvas: HTMLCanvasElement | null,
  width: number | string,
  height: number | string
) {
  if (!canvas) return
  canvas.width = +width
  canvas.height = +height
  canvas.style.width = width + ''
  canvas.style.height = height + ''
}

export function getPointerPos(
  e: GestureResponderEvent,
  controlCanvas: MutableRefObject<HTMLCanvasElement | null>
) {
  let clientX = e.nativeEvent.locationX
  let clientY = e.nativeEvent.locationY

  if (e.nativeEvent.changedTouches && e.nativeEvent.changedTouches.length > 0) {
    clientX = e.nativeEvent.changedTouches[0].locationX
    clientY = e.nativeEvent.changedTouches[0].locationY
  }

  const rect = controlCanvas.current?.getBoundingClientRect()
  if (!rect) {
    return {
      x: clientX,
      y: clientY,
    }
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  }
}

export function clearCanvas(canvas: HTMLCanvasElement | null) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
}
