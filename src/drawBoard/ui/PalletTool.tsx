import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import React, { ReactNode, useState } from 'react'

type NodeGenerator<I> = (item: I) => ReactNode
type ExtendableItemProps<I> = {
  style?: {
    button?: StyleProp<ViewStyle>
    pallet?: StyleProp<ViewStyle>
  }
  buttonInner?: ReactNode
} & (
  | {
      list: I[]
      children: (item: I) => ReactNode
    }
  | {
      list?: undefined
      children: ReactNode
    }
)

export default function PalletTool<I>({
  children,
  list,
  style,
  buttonInner,
}: ExtendableItemProps<I>) {
  const [isActive, setIsActive] = useState(false)

  return (
    <View>
      <TouchableOpacity
        style={[styles.openButton, style?.button]}
        onPress={() => setIsActive((state) => !state)}
      >
        {typeof buttonInner === 'string' ? (
          <Text>{buttonInner}</Text>
        ) : (
          buttonInner
        )}
      </TouchableOpacity>

      {isActive ? (
        <View style={[styles.palletContainer, style?.pallet]}>
          {!Array.isArray(list)
            ? children
            : list.map(children as NodeGenerator<I>)}
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  openButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginBottom: 10,
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
