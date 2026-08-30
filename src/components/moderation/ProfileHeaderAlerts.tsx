import {View} from 'react-native'
import {type StyleProp, type ViewStyle} from 'react-native'
import {type ModerationDecision} from '@bsky/sdk/moderation'
import {Trans} from '@lingui/react/macro'

import {getModerationCauseKey, unique} from '#/lib/moderation'
import {atoms as a, useTheme} from '#/alf'
import * as Pills from '#/components/Pills'
import {Text} from '#/components/Typography'
import type * as bsky from '#/types/bsky'

export function ProfileHeaderAlerts({
  moderation,
  profile,
  style,
}: {
  moderation: ModerationDecision
  profile: bsky.profile.AnyProfileView
  style?: StyleProp<ViewStyle>
}) {
  const t = useTheme()
  const modui = moderation.ui('profileView')
  const mutedOnlyReposts = profile.viewer?.mutedOnlyReposts

  const blockHide = profile.viewer?.blocking || profile.viewer?.blockedBy
  const showFollowsYou = profile.viewer?.followedBy && !blockHide

  if (!mutedOnlyReposts && !modui.alert && !modui.inform && !showFollowsYou) {
    return null
  }

  return (
    <Pills.Row size="lg" style={style}>
      {showFollowsYou ? (
        <View style={[t.atoms.bg_contrast_50, a.rounded_xs, a.px_sm, a.py_xs]}>
          <Text style={[t.atoms.text, a.text_sm]}>
            <Trans>Follows you</Trans>
          </Text>
        </View>
      ) : undefined}
      {modui.alerts.filter(unique).map(cause => (
        <Pills.Label
          size="lg"
          key={getModerationCauseKey(cause)}
          cause={cause}
        />
      ))}
      {modui.informs.filter(unique).map(cause => (
        <Pills.Label
          size="lg"
          key={getModerationCauseKey(cause)}
          cause={cause}
        />
      ))}
      {mutedOnlyReposts && <Pills.MutedOnlyReposts size="lg" />}
    </Pills.Row>
  )
}
