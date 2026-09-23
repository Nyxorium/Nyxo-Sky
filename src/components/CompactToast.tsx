import {useEffect, useRef} from 'react'
import {Gesture, GestureDetector} from 'react-native-gesture-handler'
import Animated, {
  Easing,
  type EntryExitAnimationFunction,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import {type CompactToast, compactToastStore} from '#/state/compact-toast/store'

const ENTERING_ANIMATION_DURATION = 300
const easeOutQuartFn = Easing.bezierFn(0.165, 0.84, 0.44, 1)
const easeInOutCubic = Easing.bezier(0.645, 0.045, 0.355, 1)

// top-center values from sonner-native's animation-utils.ts
const ENTER_TRANSLATE_Y = -20
const EXIT_TRANSLATE_Y = -150

const compactEntering: EntryExitAnimationFunction = () => {
  'worklet'
  return {
    initialValues: {
      opacity: 0,
      transform: [{translateY: ENTER_TRANSLATE_Y}],
    },
    animations: {
      opacity: withTiming(1, {
        easing: easeOutQuartFn,
        duration: ENTERING_ANIMATION_DURATION,
      }),
      transform: [
        {
          translateY: withTiming(0, {
            easing: easeOutQuartFn,
            duration: ENTERING_ANIMATION_DURATION,
          }),
        },
      ],
    },
  }
}

const compactExiting: EntryExitAnimationFunction = () => {
  'worklet'
  return {
    initialValues: {
      opacity: 1,
      transform: [{translateY: 0}],
    },
    animations: {
      opacity: withTiming(0, {easing: easeInOutCubic}),
      transform: [
        {translateY: withTiming(EXIT_TRANSLATE_Y, {easing: easeInOutCubic})},
      ],
    },
  }
}

function rubberBand(distance: number, dimension: number, constant = 0.55) {
  'worklet'
  return (distance * dimension * constant) / (dimension + constant * distance)
}

export function CompactToastView({toast}: {toast: CompactToast}) {
  const reducedMotion = useReducedMotion()
  const dragY = useSharedValue(0)
  const dragOpacity = useSharedValue(1)

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const remainingRef = useRef(toast.duration)
  const startedAtRef = useRef(Date.now())

  function startTimer(duration: number) {
    startedAtRef.current = Date.now()
    remainingRef.current = duration
    timerRef.current = setTimeout(() => {
      compactToastStore.dismiss(toast.id)
    }, duration)
  }

  function pauseTimer() {
    clearTimeout(timerRef.current)
    const elapsed = Date.now() - startedAtRef.current
    remainingRef.current = Math.max(0, remainingRef.current - elapsed)
  }

  function resumeTimer() {
    startTimer(remainingRef.current)
  }

  useEffect(() => {
    startTimer(toast.duration)
    return () => clearTimeout(timerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pan = Gesture.Pan()
    .onBegin(() => {
      runOnJS(pauseTimer)()
    })
    .onChange(e => {
      if (e.translationY < 0) {
        dragY.value = e.translationY
      } else {
        dragY.value = rubberBand(e.translationY, 60)
      }
    })
    .onEnd(e => {
      const draggedUpEnough = e.translationY < -40 || e.velocityY < -800
      if (draggedUpEnough) {
        dragY.value = withTiming(EXIT_TRANSLATE_Y, {easing: easeInOutCubic})
        dragOpacity.value = withTiming(
          0,
          {easing: easeInOutCubic},
          finished => {
            if (finished) runOnJS(compactToastStore.dismiss)(toast.id)
          },
        )
      } else {
        dragY.value = withTiming(0, {duration: 180})
      }
    })
    .onFinalize(() => {
      runOnJS(resumeTimer)()
    })

  const dragStyle = useAnimatedStyle(() => ({
    opacity: dragOpacity.value,
    transform: [{translateY: dragY.value}],
  }))

  return (
    <Animated.View
      entering={reducedMotion ? undefined : compactEntering}
      exiting={reducedMotion ? undefined : compactExiting}>
      <GestureDetector gesture={pan}>
        <Animated.View style={dragStyle}>{toast.node}</Animated.View>
      </GestureDetector>
    </Animated.View>
  )
}
