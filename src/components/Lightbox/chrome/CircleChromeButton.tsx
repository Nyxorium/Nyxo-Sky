import {type ComponentType, useRef} from 'react'
import {
  Animated,
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type TextStyle,
} from 'react-native'
import {BlurView} from 'expo-blur'

import {HITSLOP_10} from '#/lib/constants'
import {type Props as IconProps} from '#/components/icons/common'

type Props = {
  icon: ComponentType<IconProps>
  iconStyle?: StyleProp<TextStyle>
  label: string
  onPress?: PressableProps['onPress']
  testID?: string
}

const SIZE = 44
const RADIUS = 24
const ICON = 24

export function CircleChromeButton({
  icon: Icon,
  iconStyle,
  label,
  onPress,
  testID,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.82,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 14,
    }).start()
  }

  return (
    <Animated.View style={{transform: [{scale}]}}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint=""
        hitSlop={HITSLOP_10}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        testID={testID}
        style={styles.root}>
        <BlurView intensity={20} tint="dark" style={styles.inner}>
          <Icon width={ICON} fill="#fff" style={iconStyle} />
        </BlurView>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: SIZE,
    height: SIZE,
    borderRadius: RADIUS,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pressed: {
    opacity: 0.85,
  },
})
