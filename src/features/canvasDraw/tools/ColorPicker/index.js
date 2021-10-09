import React, { useState, useEffect, useContext } from 'react'

import './styles.scss'

import * as colors from '../../../constants/drawingArea/DrawningAreaColors'
import { ReactComponent as ColorPickerIcon } from '../../../assets/images/color_icon.svg'
import ArrowDropItem from '../../ArrowDropItem'
import ColorPickerItem from './ColorPickerItem'
import BrushContext from '../../../context/brushContext'
import conditionShowingItemHelper from '../../../helpers/conditionShowingItemHelper'

import showDrawingToolBodyInPortal from '../../../helpers/showDrawingToolBodyInPortal'

const ColorPicker = () => {
  const { currentBrushColor, checkCurrentActiveColor, changeBrushColor } =
    useContext(BrushContext)
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    const colorPickerIcon = document.getElementById('color-picker-icon')
    if (!colorPickerIcon) {
      return
    }

    const svgColorIcon = colorPickerIcon.firstChild
    if (!svgColorIcon) {
      return
    }

    const svgPartToFill = svgColorIcon.firstChild
    if (!svgPartToFill) {
      return
    }

    svgPartToFill.style.fill = currentBrushColor
  }, [currentBrushColor])

  useEffect(() => {
    document.addEventListener('click', manageColorSelectorState)

    return () => {
      document.removeEventListener('click', manageColorSelectorState)
    }
  })

  const manageColorSelectorState = (e) => {
    conditionShowingItemHelper(
      document.getElementById('color-picker-icon'),
      document.getElementById('color-palette'),
      e.target,
      showColorPicker,
      setShowColorPicker
    )
  }

  const chooseColor = (color) => {
    changeBrushColor(color)
    setShowColorPicker(false)
  }

  const renderColorSelectorContainer = () => {
    return showDrawingToolBodyInPortal(
      showColorPicker,
      <div className="palette-container" id="color-palette">
        <ColorPickerItem
          classColor="yellow"
          color={colors.YELLOW}
          isActive={checkCurrentActiveColor(colors.YELLOW)}
          changeColor={() => chooseColor(colors.YELLOW)}
        />
      </div>,
      '-105%',
      '115%'
    )
  }

  return (
    <>
      <div
        className={`color-picker-button ${showColorPicker && 'active'}`}
        id="color-picker-icon"
      >
        <ColorPickerIcon size={30} />
        <ArrowDropItem showArrowUp={showColorPicker} />
      </div>
      {renderColorSelectorContainer()}
    </>
  )
}

export default ColorPicker
