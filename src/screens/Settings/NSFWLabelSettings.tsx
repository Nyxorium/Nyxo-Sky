import {View} from 'react-native'
import {type $Typed, ComAtprotoLabelDefs} from '@atproto/api'
import {Trans, useLingui} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'
import {useQueryClient} from '@tanstack/react-query'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {RQKEY_ROOT as POST_FEED_RQKEY_ROOT} from '#/state/queries/post-feed'
import {
  useProfileQuery,
  useProfileUpdateMutation,
} from '#/state/queries/profile'
import {postThreadQueryKeyRoot} from '#/state/queries/usePostThread/types'
import {useSession} from '#/state/session'
import {UserAvatar} from '#/view/com/util/UserAvatar'
import {atoms as a, platform, useTheme} from '#/alf'
import {BotBadge} from '#/components/BotBadge'
import * as Toggle from '#/components/forms/Toggle'
import {EyeSlash_Stroke2_Corner0_Rounded as EyeSlashIcon} from '#/components/icons/EyeSlash'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {useSimpleVerificationState} from '#/components/verification'
import {VerificationCheck} from '#/components/verification/VerificationCheck'
import * as bsky from '#/types/bsky'

const LABEL_OPTIONS = [
  {val: 'porn', labelText: 'Adult Content'},
  {val: 'sexual', labelText: 'Sexually Suggestive'},
  {val: 'nudity', labelText: 'Non-sexual Nudity'},
  {val: 'graphic-media', labelText: 'Graphic Media'},
] as const

type LabelVal = (typeof LABEL_OPTIONS)[number]['val']

type Props = NativeStackScreenProps<CommonNavigatorParams, 'NSFWLabelSettings'>

export function NSFWLabelSettingsScreen({}: Props) {
  const t = useTheme()
  const {t: l} = useLingui()
  const queryClient = useQueryClient()
  const {currentAccount} = useSession()
  const {data: profile} = useProfileQuery({did: currentAccount?.did})
  const updateProfile = useProfileUpdateMutation()
  const verification = useSimpleVerificationState({profile})

  const activeLabels = new Set(
    profile?.labels?.filter(l => l.src === profile.did).map(l => l.val) ?? [],
  )

  const canToggle = profile && !updateProfile.isPending

  const onToggleLabel = (val: LabelVal) => {
    if (!profile) return
    let wasAdded = false
    updateProfile.mutate(
      {
        profile,
        updates: existing => {
          const labels: $Typed<ComAtprotoLabelDefs.SelfLabels> = bsky.validate(
            existing.labels,
            ComAtprotoLabelDefs.validateSelfLabels,
          )
            ? existing.labels
            : {
                $type: 'com.atproto.label.defs#selfLabels',
                values: [],
              }

          const hasLabel = labels.values.some(l => l.val === val)
          if (hasLabel) {
            wasAdded = false
            labels.values = labels.values.filter(l => l.val !== val)
          } else {
            wasAdded = true
            labels.values.push({val})
          }

          if (labels.values.length === 0) {
            delete existing.labels
          } else {
            existing.labels = labels
          }

          return existing
        },
        checkCommitted: res => {
          const exists = !!res.data.labels?.some(l => l.val === val)
          return exists === wasAdded
        },
      },
      {
        onSuccess() {
          queryClient.invalidateQueries({queryKey: [POST_FEED_RQKEY_ROOT]})
          queryClient.invalidateQueries({queryKey: [postThreadQueryKeyRoot]})
        },
      },
    )
  }

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>NSFW Account Labels</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <View style={[a.p_xl, a.gap_xl]}>
          {profile && (
            <View
              style={[
                a.flex_row,
                a.justify_center,
                a.align_center,
                a.gap_sm,
                a.rounded_lg,
                a.border,
                t.atoms.bg_contrast_50,
                t.atoms.border_contrast_low,
                {
                  height: 160,
                  paddingRight: 20, // helps visually center
                },
              ]}>
              <UserAvatar
                size={42}
                avatar={profile.avatar}
                type={profile.associated?.labeler ? 'labeler' : 'user'}
              />
              <View>
                <View style={[a.flex_row, a.align_baseline]}>
                  <View style={[a.flex_row, a.align_center, a.gap_xs]}>
                    <Text
                      emoji
                      style={[
                        a.text_xl,
                        a.font_semi_bold,
                        a.flex_shrink,
                        a.leading_tight,
                      ]}
                      numberOfLines={1}>
                      {profile.displayName || profile.handle}
                    </Text>
                    {verification.isVerified && (
                      <VerificationCheck
                        verifier={verification.role === 'verifier'}
                        size="sm"
                      />
                    )}
                    <View style={{top: platform({ios: -1})}}>
                      <BotBadge profile={profile} width={17} />
                    </View>
                  </View>
                </View>
                <Text
                  style={[
                    a.text_md,
                    a.leading_snug,
                    t.atoms.text_contrast_medium,
                  ]}
                  numberOfLines={1}>
                  @{profile.handle}
                </Text>
              </View>
            </View>
          )}
          <View style={[a.gap_sm]}>
            <Text style={[a.text_2xl, a.font_bold]}>
              <Trans>Add NSFW labels to this account</Trans>
            </Text>
            <Text style={[a.text_md, a.leading_snug]}>
              <Trans>
                This menu lets you apply labels such as Adult Content, Sexually
                Suggestive, Non-sexual Nudity, and Graphic Media on an account
                level. They can be turned on or off at any time.
              </Trans>
            </Text>
          </View>
          {LABEL_OPTIONS.map(({val, labelText}) => (
            <Toggle.Item
              key={val}
              name={`${val}_label`}
              disabled={!canToggle || updateProfile.isPending}
              value={activeLabels.has(val)}
              onChange={() => onToggleLabel(val)}
              label={l`Show ${labelText} label`}
              style={[
                a.w_full,
                a.p_md,
                a.rounded_lg,
                a.border,
                t.atoms.border_contrast_low,
                t.atoms.bg_contrast_50,
              ]}>
              <View style={[a.pr_xs]}>
                <EyeSlashIcon
                  width={24}
                  fill={t.atoms.text_contrast_medium.color}
                />
              </View>
              <Toggle.LabelText style={[a.flex_1, a.text_md, a.font_medium]}>
                <Trans>{labelText}</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          ))}
        </View>
      </Layout.Content>
    </Layout.Screen>
  )
}
