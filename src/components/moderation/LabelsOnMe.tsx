import {type StyleProp, View, type ViewStyle} from 'react-native'
import {type AppBskyFeedDefs, type ComAtprotoLabelDefs} from '@atproto/api'
import {msg, Plural, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'

import {useSession} from '#/state/session'
import {atoms as a} from '#/alf'
import {
  Button,
  ButtonIcon,
  type ButtonSize,
  ButtonText,
} from '#/components/Button'
import {CircleInfo_Stroke2_Corner0_Rounded as CircleInfo} from '#/components/icons/CircleInfo'
import {
  LabelsOnMeDialog,
  useLabelsOnMeDialogControl,
} from '#/components/moderation/LabelsOnMeDialog'

import {type ModerationDecision} from '@atproto/api'
import {getModerationCauseKey, unique} from '#/lib/moderation'
import * as Pills from '#/components/Pills'

export function LabelsOnMe({
  type,
  labels,
  size,
  style,
}: {
  type: 'account' | 'content'
  labels: ComAtprotoLabelDefs.Label[] | undefined
  size?: ButtonSize
  style?: StyleProp<ViewStyle>
}) {
  const {_} = useLingui()
  const {currentAccount} = useSession()
  const control = useLabelsOnMeDialogControl()

  if (!labels || !currentAccount) {
    return null
  }
  labels = labels.filter(l => !l.val.startsWith('!'))
  if (!labels.length) {
    return null
  }

  return (
    <View style={[a.flex_row, style]}>
      <LabelsOnMeDialog control={control} labels={labels} type={type} />

      <Button
        variant="solid"
        color="secondary"
        size={size || 'small'}
        label={_(msg`View information about these labels`)}
        onPress={() => {
          control.open()
        }}>
        <ButtonIcon position="left" icon={CircleInfo} />
        <ButtonText style={[a.leading_snug]}>
          {type === 'account' ? (
            <Trans>
              <Plural
                value={labels.length}
                one="# label has"
                other="# labels have"
              />{' '}
              been placed on this account
            </Trans>
          ) : (
            <Trans>
              <Plural
                value={labels.length}
                one="# label has"
                other="# labels have"
              />{' '}
              been placed on this content
            </Trans>
          )}
        </ButtonText>
      </Button>
    </View>
  )
}

// LabelsOnMeRevised can be removed if we don't put an appeal button there
// ProfileHeaderAlerts does exactly what we want otherwise
// makes things simmpler and less code doing the same stuff
export function LabelsOnMeRevised({
  type,
  labels,
  moderation,
  style,
}: {
  type: 'account' | 'content'
  labels: ComAtprotoLabelDefs.Label[] | undefined
  moderation: ModerationDecision
  style?: StyleProp<ViewStyle>
}) {
  const modui = moderation.ui('profileView')
  if (!modui.alert && !modui.inform) {
    return null
  }

  return (
    <Pills.Row size="lg" style={style}>
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

export function LabelsOnMyPost({
  post,
  style,
}: {
  post: AppBskyFeedDefs.PostView
  style?: StyleProp<ViewStyle>
}) {
  const {currentAccount} = useSession()
  if (post.author.did !== currentAccount?.did) {
    return null
  }
  return (
    <LabelsOnMe type="content" labels={post.labels} size="tiny" style={style} />
  )
}
