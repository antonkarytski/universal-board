import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import React, { ReactNode, useState } from 'react'

type ExtendableItemProps<I> = {
  list: I[]
  children: (item: I) => ReactNode
  style?: StyleProp<ViewStyle>
  buttonInner?: ReactNode
}

export default function PalletTool<I>({
  children,
  list,
  style,
  buttonInner,
}: ExtendableItemProps<I>) {
  const [isActive, setIsActive] = useState(false)

  return (
    <>
      <TouchableOpacity
        style={[styles.openButton, style]}
        onPress={() => setIsActive((state) => !state)}
      >
        {buttonInner}
      </TouchableOpacity>

      {isActive ? (
        <View style={styles.palletContainer}>{list.map(children)}</View>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  openButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },

  palletContainer: {
    width: 160,
    flexWrap: 'wrap',
    position: 'absolute',
    top: 6,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    right: 70,
    elevation: 2,
  },
})
