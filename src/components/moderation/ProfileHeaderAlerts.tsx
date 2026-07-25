import {View} from 'react-native'
import {type StyleProp, type ViewStyle} from 'react-native'
import {type AppBskyActorDefs, type ModerationDecision} from '@atproto/api'
import {Trans} from '@lingui/react/macro'

import {getModerationCauseKey, unique} from '#/lib/moderation'
import {type Shadow} from '#/state/cache/types'
import {atoms as a, useTheme} from '#/alf'
import * as Pills from '#/components/Pills'
import {Text} from '#/components/Typography'

export function ProfileHeaderAlerts({
  moderation,
  style,
  profile,
}: {
  moderation: ModerationDecision
  style?: StyleProp<ViewStyle>
  profile: Shadow<AppBskyActorDefs.ProfileViewDetailed>
}) {
  const t = useTheme()
  const modui = moderation.ui('profileView')
  const blockHide = profile.viewer?.blocking || profile.viewer?.blockedBy
  const showFollowsYou = profile.viewer?.followedBy && !blockHide

  if (!modui.alert && !modui.inform && !showFollowsYou) {
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
    </Pills.Row>
  )
}
