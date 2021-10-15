import {IS_WEB} from './platform'

export const webInputStyle = IS_WEB
  ? {
      overflow: 'hidden',
      outlineOffset: 0,
      outlineStyle: 'none',
      outlineWidth: 0,
    }
  : null
