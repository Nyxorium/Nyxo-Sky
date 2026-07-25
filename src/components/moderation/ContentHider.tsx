import {useMemo, useState} from 'react'
import {
  LayoutAnimation,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native'
import {
  BSKY_LABELER_DID,
  type ModerationCause,
  type ModerationUI,
} from '@atproto/api'
import {Trans, useLingui} from '@lingui/react/macro'

import {
  ADULT_CONTENT_LABELS,
  type AdultSelfLabel,
  isJustAMute,
} from '#/lib/moderation'
import {useGlobalLabelStrings} from '#/lib/moderation/useGlobalLabelStrings'
import {getDefinition, getLabelStrings} from '#/lib/moderation/useLabelInfo'
import {useModerationCauseDescription} from '#/lib/moderation/useModerationCauseDescription'
import {sanitizeDisplayName} from '#/lib/strings/display-names'
import {useLabelDefinitions} from '#/state/preferences'
import {atoms as a, useBreakpoints, useTheme, web} from '#/alf'
import {Button} from '#/components/Button'
import {
  ModerationDetailsDialog,
  useModerationDetailsDialogControl,
} from '#/components/moderation/ModerationDetailsDialog'
import {Text} from '#/components/Typography'

export function isAccountNsfwBlur(b: ModerationCause): boolean {
  return (
    b.type === 'label' &&
    b.source.type === 'labeler' &&
    b.source.did === BSKY_LABELER_DID &&
    ['porn', 'sexual', 'nudity'].includes(b.label.val) &&
    !!b.label.uri &&
    !b.label.uri.includes('/app.bsky.')
  )
}

export function ContentHider({
  testID,
  modui,
  ignoreMute,
  style,
  activeStyle,
  childContainerStyle,
  children,
}: {
  testID?: string
  modui: ModerationUI | undefined
  ignoreMute?: boolean
  style?: StyleProp<ViewStyle>
  activeStyle?: StyleProp<ViewStyle>
  childContainerStyle?: StyleProp<ViewStyle>
  children?: React.ReactNode | ((props: {active: boolean}) => React.ReactNode)
}) {
  const blur = modui?.blurs[0]

  const hasNonAccountNsfwBlur = modui?.blurs.some(b => !isAccountNsfwBlur(b))

  if (!blur || (ignoreMute && isJustAMute(modui)) || !hasNonAccountNsfwBlur) {
    return (
      <View testID={testID} style={style}>
        {typeof children === 'function' ? children({active: false}) : children}
      </View>
    )
  }
  return (
    <ContentHiderActive
      testID={testID}
      modui={modui}
      style={[style, activeStyle]}
      childContainerStyle={childContainerStyle}>
      {typeof children === 'function' ? children({active: true}) : children}
    </ContentHiderActive>
  )
}

function ContentHiderActive({
  testID,
  modui,
  style,
  childContainerStyle,
  children,
}: {
  testID?: string
  modui: ModerationUI
  style?: StyleProp<ViewStyle>
  childContainerStyle?: StyleProp<ViewStyle>
  children?: React.ReactNode
}) {
  const t = useTheme()
  const {t: l} = useLingui()
  const {gtMobile} = useBreakpoints()
  const [override, setOverride] = useState(false)
  const control = useModerationDetailsDialogControl()
  const {labelDefs} = useLabelDefinitions()
  const globalLabelStrings = useGlobalLabelStrings()
  const {i18n} = useLingui()

  const blur = useMemo(() => {
    const blurs = modui.blurs
    const primary = blurs[0]

    const effectivePrimary = blurs.find(b => !isAccountNsfwBlur(b)) ?? primary

    if (
      effectivePrimary.type === 'label' &&
      effectivePrimary.source.type !== 'user'
    ) {
      const ADULT_SELF_LABEL_FAMILY = ['sexual', 'nudity', 'porn']

      const userEquivalent = blurs.find(
        b =>
          b.type === 'label' &&
          b.source.type === 'user' &&
          (b.label.val === effectivePrimary.label.val ||
            (ADULT_SELF_LABEL_FAMILY.includes(b.label.val) &&
              ADULT_SELF_LABEL_FAMILY.includes(effectivePrimary.label.val))),
      )

      if (
        effectivePrimary.type === 'label' &&
        effectivePrimary.label.val === 'sexual-figurative'
      ) {
        const alternative = blurs.find(
          b => b.type === 'label' && b.label.val !== 'sexual-figurative',
        )
        if (alternative) {
          return alternative
        }
      }

      if (userEquivalent) {
        return userEquivalent
      }
    }

    return effectivePrimary
  }, [modui.blurs])

  //  const blur = useMemo(() => {
  //    const blurs = modui.blurs!
  //    const primary = blurs[0]
  //
  //    if (primary.type === 'label' && primary.source.type !== 'user') {
  //      const userEquivalent = blurs.find(
  //        b =>
  //          b.type === 'label' &&
  //          b.source.type === 'user' &&
  //          b.label.val === primary.label.val,
  //      )
  //
  //      if (userEquivalent) {
  //        return userEquivalent
  //      }
  //    }
  //
  //    return primary
  //  }, [modui.blurs])

  const desc = useModerationCauseDescription(blur)

  const labelName = useMemo(() => {
    if (!modui?.blurs || !blur) {
      return undefined
    }
    if (
      blur.type !== 'label' ||
      (blur.type === 'label' && blur.source.type !== 'user')
    ) {
      if (desc.isSubjectAccount) {
        return l`${desc.name} (Account)`
      }
      if (
        blur.type === 'label' &&
        blur.source.type === 'labeler' &&
        blur.source.did === BSKY_LABELER_DID
      ) {
        return `${desc.name} (${l`Bluesky`})`
      }
      return desc.name
    }

    let hasAdultContentLabel = false
    const selfBlurNames = modui.blurs
      .filter(cause => {
        if (cause.type !== 'label') {
          return false
        }
        if (cause.source.type !== 'user') {
          return false
        }
        if (ADULT_CONTENT_LABELS.includes(cause.label.val as AdultSelfLabel)) {
          if (hasAdultContentLabel) {
            return false
          }
          hasAdultContentLabel = true
        }
        return true
      })
      .slice(0, 2)
      .map(cause => {
        if (cause.type !== 'label') {
          return
        }

        const def = cause.labelDef || getDefinition(labelDefs, cause.label)
        if (def.identifier === 'porn') {
          return l`Adult Content`
        }
        if (def.identifier === 'sexual') {
          return l`Sexually Suggestive`
        }
        return getLabelStrings(i18n.locale, globalLabelStrings, def).name
      })

    if (selfBlurNames.length === 0) {
      return desc.name
    }

    const baseName = [...new Set(selfBlurNames)].join(', ')

    if (blur.type === 'label') {
      if (blur.source.type === 'user') {
        return `${baseName} (${l`Self`})`
      }
      if (
        blur.source.type === 'labeler' &&
        blur.source.did === BSKY_LABELER_DID
      ) {
        return `${baseName} (${l`Bluesky`})`
      }
    }

    return baseName
  }, [
    l,
    modui.blurs,
    blur,
    desc.name,
    desc.isSubjectAccount,
    labelDefs,
    i18n.locale,
    globalLabelStrings,
  ])

  return (
    <View testID={testID} style={[a.overflow_hidden, style]}>
      <ModerationDetailsDialog control={control} modcause={blur} />
      <Button
        onPress={e => {
          e.preventDefault()
          e.stopPropagation()
          if (!modui.noOverride) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
            setOverride(v => !v)
          } else {
            control.open()
          }
        }}
        label={desc.name}
        accessibilityHint={
          modui.noOverride
            ? l`Learn more about the moderation applied to this content`
            : override
              ? l`Hides the content`
              : l`Shows the content`
        }>
        {state => (
          <View
            style={[
              a.flex_row,
              a.w_full,
              a.justify_start,
              a.align_center,
              a.py_md,
              a.px_lg,
              a.gap_xs,
              a.rounded_sm,
              t.atoms.bg_contrast_25,
              gtMobile && [a.gap_sm, a.py_lg, a.mt_xs, a.px_xl],
              (state.hovered || state.pressed) && t.atoms.bg_contrast_50,
            ]}>
            <desc.icon
              size="md"
              fill={t.atoms.text_contrast_medium.color}
              style={{marginLeft: -2}}
            />
            <Text
              style={[
                a.flex_1,
                a.text_left,
                a.font_semi_bold,
                a.leading_snug,
                gtMobile && [a.font_semi_bold],
                t.atoms.text_contrast_medium,
                web({
                  marginBottom: 1,
                }),
              ]}
              numberOfLines={2}>
              {labelName}
            </Text>
            {!modui.noOverride && (
              <Text
                style={[
                  a.font_semi_bold,
                  a.leading_snug,
                  gtMobile && [a.font_semi_bold],
                  t.atoms.text_contrast_high,
                  web({
                    marginBottom: 1,
                  }),
                ]}>
                {override ? <Trans>Hide</Trans> : <Trans>Show</Trans>}
              </Text>
            )}
          </View>
        )}
      </Button>
      {desc.source && blur.type === 'label' && !override && (
        <Button
          onPress={e => {
            e.preventDefault()
            e.stopPropagation()
            control.open()
          }}
          label={l`Learn more about the moderation applied to this content`}
          style={[a.pt_sm]}>
          {state => (
            <Text
              style={[
                a.flex_1,
                a.text_sm,
                a.font_normal,
                a.leading_snug,
                t.atoms.text_contrast_medium,
                a.text_left,
              ]}>
              {desc.sourceType === 'user' ? (
                <Trans>Labeled by the author.</Trans>
              ) : (
                <Trans>Labeled by {sanitizeDisplayName(desc.source!)}.</Trans>
              )}{' '}
              <Text
                style={[
                  t.atoms.text_link,
                  a.text_sm,
                  state.hovered && [web({textDecoration: 'underline'})],
                ]}>
                <Trans>Learn more.</Trans>
              </Text>
            </Text>
          )}
        </Button>
      )}
      {override && <View style={childContainerStyle}>{children}</View>}
    </View>
  )
}
