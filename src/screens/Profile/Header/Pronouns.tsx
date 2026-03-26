import {View} from 'react-native'
import {type AppBskyActorDefs} from '@atproto/api'

import {type Shadow} from '#/state/cache/types'
import {atoms as a, useTheme} from '#/alf'
import {Text} from '#/components/Typography'

import {NON_BREAKING_SPACE} from '#/lib/strings/constants'

export function ProfileHeaderPronouns({
  profile,
}: {
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
}) {
  const t = useTheme()

  if (!profile.pronouns) return null

  return (
    <View pointerEvents="none">
      <Text
        style={[
          a.text_md,
          a.leading_snug,
          t.atoms.text_contrast_medium,
          {fontStyle: 'italic'},
        ]}
        numberOfLines={1}>
        {profile.pronouns}
      </Text>
    </View>
  )
}

export function ProfileHeaderPronounsInline({
  profile,
}: {
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
}) {
  const t = useTheme()

  if (!profile.pronouns) return null

  return (
    <Text style={[a.text_md, a.leading_snug, t.atoms.text_contrast_medium]}>
      {NON_BREAKING_SPACE + '\u00B7' + NON_BREAKING_SPACE + profile.pronouns}
    </Text>
  )
}