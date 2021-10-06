import React from 'react'
import { SafeAreaView, useColorScheme } from 'react-native'

import { Colors } from 'react-native/Libraries/NewAppScreen'
import DrawBoard from './src/features/drawBoard/DrawBoard'
import DrawArea from './src/features/canvasDraw/DrawArea'

const App = () => {
  const isDarkMode = useColorScheme() === 'dark'

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <DrawArea />
    </SafeAreaView>
  )
}

export default App
