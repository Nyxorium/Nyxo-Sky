import {createContext, useContext} from 'react'
import {View} from 'react-native'
import {type AppBskyActorDefs} from '@atproto/api'

import {NON_BREAKING_SPACE} from '#/lib/strings/constants'
import {type Shadow} from '#/state/cache/types'
import {atoms as a, useTheme} from '#/alf'
import {Text} from '#/components/Typography'
import {IS_IOS} from '#/env'

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

const AlignmentContext = createContext<'platform' | 'left'>('platform')
AlignmentContext.displayName = 'AlignmentContext'

export function ProfileHeaderPronounsMinimal({
  profile,
}: {
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
}) {
  const t = useTheme()
  const align = useContext(AlignmentContext)

  if (!profile.pronouns) return null

  return (
    <Text
      style={[
        a.text_sm,
        a.leading_snug,
        IS_IOS && align === 'platform' && a.text_center,
        t.atoms.text_contrast_medium,
      ]}
      numberOfLines={1}>
      {profile.pronouns}
    </Text>
  )
}
