import {View} from 'react-native'
import {type AppBskyActorDefs} from '@atproto/api'
import {Trans} from '@lingui/react/macro'
import {atoms as a, useTheme} from '#/alf'
import {InlineLinkText} from '#/components/Link'
import {Globe_Stroke2_Corner0_Rounded as Globe} from '#/components/icons/Globe'
import {Calendar_Stroke2_Corner0_Rounded as Calendar} from '#/components/icons/Calendar'
import {Text} from '#/components/Typography'

export function ProfileHeaderMetaRow({
  profile,
}: {
  profile: AppBskyActorDefs.ProfileViewDetailed
}) {
  const t = useTheme()

  if (!profile.website && !profile.createdAt) return null

  const displayUrl = profile.website
    ? (() => {
        const stripped = profile.website.replace(/^https?:\/\//, '')
        return stripped.length > 30 ? stripped.slice(0, 30) + '…' : stripped
      })()
    : null

  return (
    <View style={[a.flex_row, a.align_center, a.gap_lg, a.flex_wrap]}>
      {profile.website && (
        <View style={[a.flex_row, a.align_center, a.gap_xs]}>
          <Globe size="sm" style={t.atoms.text_contrast_medium} />
          <InlineLinkText
            label={profile.website}
            to={profile.website}
            style={[a.text_sm]}>
            {displayUrl}
          </InlineLinkText>
        </View>
      )}
      {profile.createdAt && (
        <View style={[a.flex_row, a.align_center, a.gap_xs]}>
          <Calendar size="sm" style={t.atoms.text_contrast_medium} />
          <Text style={[a.text_sm, t.atoms.text_contrast_medium]}>
            <Trans>
              Joined{' '}
              {new Date(profile.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                year: 'numeric',
              })}
            </Trans>
          </Text>
        </View>
      )}
    </View>
  )
}