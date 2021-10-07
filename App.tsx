import React from 'react'
import { SafeAreaView } from 'react-native'
import DrawArea from './src/features/canvasDraw/DrawArea'
import Draw from './src/features/fork'

const App = () => {
  return (
    <SafeAreaView>
      <DrawArea />
    </SafeAreaView>
  )
}

export default App
