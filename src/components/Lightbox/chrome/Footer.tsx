import {useRef} from 'react'
import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'

import {atoms as a} from '#/alf'
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
}

export function Footer({
  altText,
  isAltExpanded,
  onToggleAltExpanded,
  onPressShare,
  onPressSave,
}: Props) {
  const {_} = useLingui()
  const insets = useSafeAreaInsets()
  const isMomentumScrolling = useRef(false)

  return (
    <View
      style={[styles.root, {paddingBottom: insets.bottom + 8}]}
      pointerEvents="box-none">
      <View style={[a.flex_row, a.justify_end, a.gap_sm, a.px_md, a.pb_sm]}>
        <CircleChromeButton
          icon={ShareIcon}
          label={_(msg`Share image`)}
          onPress={onPressShare}
        />
        <CircleChromeButton
          icon={SaveIcon}
          label={_(msg`Save image`)}
          onPress={onPressSave}
        />
      </View>
      {altText && (
        <View style={[styles.altWrap]}>
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
              accessibilityLabel={_(msg`Expand alt text`)}
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
                style={[a.text_sm, styles.altText]}
                numberOfLines={isAltExpanded ? undefined : 3}>
                {altText}
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  altWrap: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  altText: {
    color: '#fff',
  },
})
