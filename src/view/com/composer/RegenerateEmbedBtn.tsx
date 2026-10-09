import {useCallback, useState} from 'react'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {useQueryClient} from '@tanstack/react-query'

import {resolveLink} from '#/lib/api/resolve'
import {RQKEY_LINK} from '#/state/queries/resolve-link'
import {useAppviewClient, useChatClient} from '#/state/session'
import {Button, ButtonIcon} from '#/components/Button'
import {ArrowRotateClockwise_Stroke2_Corner0_Rounded as Rotate} from '#/components/icons/ArrowRotate'
import {Loader} from '#/components/Loader'

export function RegenerateEmbedBtn({uri}: {uri: string}) {
  const appviewClient = useAppviewClient()
  const chatClient = useChatClient()
  const queryClient = useQueryClient()
  const {_} = useLingui()
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = useCallback(async () => {
    setIsRegenerating(true)
    try {
      const fresh = await resolveLink({appviewClient, chatClient}, uri, {
        bustCache: true,
      })
      queryClient.setQueryData(RQKEY_LINK(uri), fresh)
    } catch {
      // leave existing cached data in place on failure
    } finally {
      setIsRegenerating(false)
    }
  }, [{appviewClient, chatClient}, queryClient, uri])

  const onPress = useCallback(() => {
    void handleRegenerate()
  }, [handleRegenerate])

  return (
    <Button
      color="secondary"
      size="small"
      testID="regenerateEmbedBtn"
      onPress={onPress}
      disabled={isRegenerating}
      label={_(msg`Regenerate link preview`)}
      accessibilityHint={_(
        msg`Re-fetches the embed preview for the attached link`,
      )}>
      {isRegenerating ? <Loader size="sm" /> : <ButtonIcon icon={Rotate} />}
    </Button>
  )
}
