import {useLayoutEffect, useMemo, useRef, useState} from 'react'
import {
  type LayoutChangeEvent,
  PanResponder,
  Platform,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import * as Haptics from 'expo-haptics'

import {atoms as a, useTheme} from '#/alf'
import {Text} from '#/components/Typography'

const THUMB = 24
const TRACK_H = 4

export function StepSlider({
  value,
  min,
  max,
  onChange,
  onChangeEnd,
  marks = [],
  label,
  disabled = false,
  style,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  /** Fires once on release; use this for persisting. */
  onChangeEnd?: (v: number) => void
  marks?: number[]
  label: string
  disabled?: boolean
  style?: StyleProp<ViewStyle>
}) {
  const t = useTheme()
  const [width, setWidth] = useState(0)

  const steps = Math.max(max - min, 1)
  const usable = Math.max(width - THUMB, 1)

  // PanResponder is created once, so read live values through a ref
  const live = useRef({min, steps, usable, onChange, onChangeEnd, disabled})
  const lastStep = useRef(value)
  const startX = useRef(0)

  useLayoutEffect(() => {
    live.current = {min, steps, usable, onChange, onChangeEnd, disabled}
    lastStep.current = value
  })

  const stepFromX = (x: number) => {
    const {min, steps, usable} = live.current
    const clamped = Math.min(Math.max(x, 0), usable)
    return Math.round((clamped / usable) * steps) + min
  }

  const emit = (step: number) => {
    if (step === lastStep.current) return
    lastStep.current = step
    live.current.onChange(step)
    Haptics.selectionAsync().catch(() => {})
  }

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !live.current.disabled,
        onMoveShouldSetPanResponder: () => !live.current.disabled,
        onPanResponderTerminationRequest: () => false, // don't let a ScrollView steal the drag
        onPanResponderGrant: e => {
          // tap-to-jump; children are pointerEvents="none" so locationX is track-relative
          startX.current = e.nativeEvent.locationX - THUMB / 2
          emit(stepFromX(startX.current))
        },
        onPanResponderMove: (_, g) => emit(stepFromX(startX.current + g.dx)),
        onPanResponderRelease: () =>
          live.current.onChangeEnd?.(lastStep.current),
        onPanResponderTerminate: () =>
          live.current.onChangeEnd?.(lastStep.current),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const thumbLeft = ((value - min) / steps) * usable

  return (
    <View style={[style, disabled && {opacity: 0.4}]}>
      <View style={[a.flex_row, a.justify_between, a.align_center]}>
        <Text style={[a.text_md, t.atoms.text]}>{label}</Text>
        <Text style={[a.text_md, a.font_bold, t.atoms.text]}>{value}</Text>
      </View>

      <View
        {...pan.panHandlers}
        onLayout={(e: LayoutChangeEvent) =>
          setWidth(e.nativeEvent.layout.width)
        }
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityHint=""
        accessibilityState={{disabled}}
        accessibilityValue={{min, max, now: value}}
        accessibilityActions={[{name: 'increment'}, {name: 'decrement'}]}
        onAccessibilityAction={e => {
          if (disabled) return
          const d = e.nativeEvent.actionName === 'increment' ? 1 : -1
          const n = Math.min(Math.max(value + d, min), max)
          onChange(n)
          onChangeEnd?.(n)
        }}
        style={[
          {height: 44, justifyContent: 'center'},
          // stops mobile browsers from scrolling the page mid-drag
          Platform.OS === 'web' ? ({touchAction: 'none'} as ViewStyle) : null,
        ]}>
        <View
          pointerEvents="none"
          style={[
            {height: TRACK_H, borderRadius: TRACK_H / 2},
            t.atoms.bg_contrast_50,
          ]}
        />
        {marks.map(m => (
          <View
            key={m}
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: THUMB / 2 + ((m - min) / steps) * usable - 1,
              width: 2,
              height: 10,
              borderRadius: 1,
              backgroundColor: t.palette.contrast_400,
            }}
          />
        ))}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: thumbLeft,
            width: THUMB,
            height: THUMB,
            borderRadius: THUMB / 2,
            backgroundColor: t.palette.primary_500,
          }}
        />
      </View>
    </View>
  )
}
