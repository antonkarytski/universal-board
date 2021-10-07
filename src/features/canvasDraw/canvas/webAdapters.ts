import React, { Touch } from 'react'
import { GestureResponderEvent, NativeTouchEvent } from 'react-native'

export function mouseEventAdapter(
  event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  fn?: (event: GestureResponderEvent) => void
) {
  if (!fn) return
  const nativeProps: GestureResponderEvent = {
    nativeEvent: {
      locationX: event.nativeEvent.offsetX,
      locationY: event.nativeEvent.offsetY,
      pageX: event.nativeEvent.pageX,
      pageY: event.nativeEvent.pageY,
      identifier: -1 + '',
      timestamp: event.timeStamp,
      changedTouches: [],
      touches: [],
      target: '',
    },
    timeStamp: event.timeStamp,
    target: 0,
    isTrusted: event.isTrusted,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    stopPropagation: event.stopPropagation,
    eventPhase: event.eventPhase,
    defaultPrevented: event.defaultPrevented,
    preventDefault: event.preventDefault,
    isDefaultPrevented: event.isDefaultPrevented,
    isPropagationStopped: event.isPropagationStopped,
    persist: event.persist,
    type: event.type,
    currentTarget: 0,
  }
  fn(nativeProps)
}

function touchToNativeTouch(
  { identifiedTouch, item, length, ...touchesList }: React.TouchList,
  timestamp: number
): NativeTouchEvent[] {
  const touches: Touch[] = []
  for (let i in touchesList) {
    if (touchesList.hasOwnProperty(i)) {
      touches.push(touchesList[i])
    }
  }
  return touches.map((touch) => {
    return {
      identifier: touch.identifier + '',
      locationX: touch.clientX,
      locationY: touch.clientY,
      timestamp,
      pageX: touch.pageX,
      pageY: touch.pageY,
      target: '',
      changedTouches: [],
      touches: [],
    }
  })
}

export function touchEventAdapter(
  event: React.TouchEvent<HTMLCanvasElement>,
  fn?: (event: GestureResponderEvent) => void
) {
  if (!fn) return
  const nativeProps: GestureResponderEvent = {
    nativeEvent: {
      locationX: event.touches[0].clientX,
      locationY: event.touches[0].clientY,
      pageX: event.touches[0].pageX,
      pageY: event.touches[0].pageY,
      identifier: event.touches[0].identifier + '',
      timestamp: event.timeStamp,
      changedTouches: touchToNativeTouch(event.changedTouches, event.timeStamp),
      touches: touchToNativeTouch(event.touches, event.timeStamp),
      target: '',
    },
    timeStamp: event.timeStamp,
    target: 0,
    isTrusted: event.isTrusted,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    stopPropagation: event.stopPropagation,
    eventPhase: event.eventPhase,
    defaultPrevented: event.defaultPrevented,
    preventDefault: event.preventDefault,
    isDefaultPrevented: event.isDefaultPrevented,
    isPropagationStopped: event.isPropagationStopped,
    persist: event.persist,
    type: event.type,
    currentTarget: 0,
  }
  fn(nativeProps)
}
