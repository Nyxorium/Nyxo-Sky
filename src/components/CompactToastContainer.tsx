import {StyleSheet, View} from 'react-native'
import Animated, {Layout} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'

import {useCompactToasts} from '#/state/compact-toast/store'
import {CompactToastView} from './CompactToast'

export function CompactToastContainer() {
  const toasts = useCompactToasts()
  const insets = useSafeAreaInsets()

  if (toasts.length === 0) return null

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, {top: insets.top + 8}]}>
      {toasts.map(t => (
        <Animated.View
          key={t.id}
          layout={Layout.springify().damping(18).stiffness(220)}>
          <CompactToastView toast={t} />
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 8,
    zIndex: 9999,
  },
})
