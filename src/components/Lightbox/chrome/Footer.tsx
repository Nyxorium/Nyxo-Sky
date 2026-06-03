import {useRef} from 'react'
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {BlurView} from 'expo-blur'
import {useLingui} from '@lingui/react/macro'

import {atoms as a, platform, useTheme} from '#/alf'
import {ArrowShareRight_Stroke2_Corner2_Rounded as ShareIcon} from '#/components/icons/ArrowShareRight'
import {Download_Stroke2_Corner0_Rounded as SaveIcon} from '#/components/icons/Download'
import {Text} from '#/components/Typography'
import {CircleChromeButton} from './CircleChromeButton'

type Props = {
  altText: string | undefined
  isAltExpanded: boolean
  onToggleAltExpanded: () => void
  onPressShare: () => void
  onPressSave: () => void
  onLongPressSave?: () => void
}

export function Footer({
  altText,
  isAltExpanded,
  onToggleAltExpanded,
  onPressShare,
  onPressSave,
  onLongPressSave,
}: Props) {
  const {t: l} = useLingui()
  const t = useTheme()
  const insets = useSafeAreaInsets()
  const isMomentumScrolling = useRef(false)

  return (
    <View
      style={[
        a.absolute,
        a.left_0,
        a.right_0,
        a.bottom_0,
        a.pointer_events_box_none,
        {paddingBottom: insets.bottom + 8},
      ]}>
      <View style={[a.flex_row, a.justify_end, a.gap_sm, a.px_md, a.pb_sm]}>
        <CircleChromeButton
          icon={ShareIcon}
          label={l`Share image`}
          onPress={onPressShare}
        />
        <CircleChromeButton
          icon={SaveIcon}
          label={l`Save image`}
          onPress={onPressSave}
          onLongPress={onLongPressSave}
        />
      </View>
      {altText && (
        <View style={[styles.altWrap]}>
          <BlurView
            intensity={16}
            tint="dark"
            style={[
              // Tint kept over the blur so dense, text-heavy images stay
              // readable. On Android the blur falls back to a flat overlay, so
              // bump the opacity to keep the contrast the real blur provides
              // elsewhere.
              platform({
                ios: {backgroundColor: 'rgba(0, 0, 0, 0.5)'},
                android: {backgroundColor: 'rgba(0, 0, 0, 0.85)'},
              }),
            ]}>
            <ScrollView
              scrollEnabled={isAltExpanded}
              onMomentumScrollBegin={() => {
                isMomentumScrolling.current = true
              }}
              onMomentumScrollEnd={() => {
                isMomentumScrolling.current = false
              }}
              contentContainerStyle={[a.px_2xl, a.py_sm]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={l`Expand alt text`}
                accessibilityHint=""
                onPress={() => {
                  if (isMomentumScrolling.current) return
                  LayoutAnimation.configureNext({
                    duration: 450,
                    update: {type: 'spring', springDamping: 1},
                  })
                  onToggleAltExpanded()
                }}>
                <Text
                  emoji
                  selectable
                  style={[a.text_sm, {color: t.palette.white}]}
                  numberOfLines={isAltExpanded ? undefined : 3}>
                  {altText}
                </Text>
              </Pressable>
            </ScrollView>
          </BlurView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  altWrap: {
    borderRadius: 12,
    overflow: 'hidden',
  },
})
