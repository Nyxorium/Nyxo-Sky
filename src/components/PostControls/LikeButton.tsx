import {memo, useCallback, useMemo} from 'react'
import {View} from 'react-native'
import {type AppBskyFeedDefs} from '@atproto/api'
import {msg, plural} from '@lingui/core/macro'
import {Trans, useLingui} from '@lingui/react/macro'

import {CountWheel} from '#/lib/custom-animations/CountWheel'
import {AnimatedLikeIcon} from '#/lib/custom-animations/LikeIcon'
import {useHaptics} from '#/lib/haptics'
import {type Shadow} from '#/state/cache/types'
import {useAgent, useRequireAuth} from '#/state/session'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {Heart2_Stroke2_Corner0_Rounded as HeartIcon} from '#/components/icons/Heart2'
import {
  getQuotedPost,
  useFormatPostStatCount,
} from '#/components/PostControls/util'
import * as Toast from '#/components/Toast'
import {Text} from '#/components/Typography'
import {PostControlButton, PostControlButtonText} from './PostControlButton'

interface Props {
  post: Shadow<AppBskyFeedDefs.PostView>
  big?: boolean
  hideLikes?: boolean
  hasBeenToggled: boolean
  onToggleLike: () => Promise<void>
}

let LikeButton = ({
  post,
  big,
  hideLikes,
  hasBeenToggled,
  onToggleLike,
}: Props): React.ReactNode => {
  const t = useTheme()
  const {t: l} = useLingui()
  const requireAuth = useRequireAuth()
  const dialogControl = Dialog.useDialogControl()
  const formatPostStatCount = useFormatPostStatCount()

  const quotedPost = useMemo(() => getQuotedPost(post.embed), [post.embed])

  const onPress = () => requireAuth(() => void onToggleLike())

  const onLongPress = quotedPost
    ? () => requireAuth(() => dialogControl.open())
    : undefined

  return (
    <>
      <PostControlButton
        testID="likeBtn"
        big={big}
        active={Boolean(post.viewer?.like)}
        activeColor={t.palette.pink}
        onPress={onPress}
        onLongPress={onLongPress}
        label={
          post.viewer?.like
            ? l(
                msg({
                  message: `Unlike (${plural(post.likeCount || 0, {
                    one: '# like',
                    other: '# likes',
                  })})`,
                  comment:
                    'Accessibility label for the like button when the post has been liked',
                }),
              )
            : l(
                msg({
                  message: `Like (${plural(post.likeCount || 0, {
                    one: '# like',
                    other: '# likes',
                  })})`,
                  comment:
                    'Accessibility label for the like button when the post has not been liked',
                }),
              )
        }>
        <AnimatedLikeIcon
          isLiked={Boolean(post.viewer?.like)}
          big={big}
          hasBeenToggled={hasBeenToggled}
        />
        <CountWheel
          count={!hideLikes ? (post.likeCount ?? 0) : 0}
          isToggled={Boolean(post.viewer?.like)}
          hasBeenToggled={hasBeenToggled}
          renderCount={({count}) => (
            <PostControlButtonText testID="likeCount">
              {formatPostStatCount(count)}
            </PostControlButtonText>
          )}
        />
      </PostControlButton>
      {quotedPost && (
        <Dialog.Outer
          control={dialogControl}
          nativeOptions={{preventExpansion: true}}>
          <Dialog.Handle />
          <LikeButtonDialogInner
            post={post}
            quotedPost={quotedPost}
            onToggleLike={onToggleLike}
          />
        </Dialog.Outer>
      )}
    </>
  )
}
LikeButton = memo(LikeButton)
export {LikeButton}

let LikeButtonDialogInner = ({
  post,
  quotedPost,
  onToggleLike,
}: {
  post: Shadow<AppBskyFeedDefs.PostView>
  quotedPost: {uri: string; cid: string}
  onToggleLike: () => Promise<void>
}): React.ReactNode => {
  const t = useTheme()
  const {t: l} = useLingui()
  const playHaptic = useHaptics()
  const control = Dialog.useDialogContext()
  const agent = useAgent()

  const onPressLike = useCallback(() => {
    if (!post.viewer?.like) playHaptic()
    control.close(() => {
      void onToggleLike()
    })
  }, [control, post.viewer?.like, onToggleLike, playHaptic])

  const onPressPassThrough = useCallback(() => {
    playHaptic()
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    control.close(async () => {
      await onToggleLike()
      try {
        await agent.like(quotedPost.uri, quotedPost.cid)
        Toast.show(l`Quoted post liked`)
      } catch (err) {
        const e = err as Error
        if (e?.name !== 'AbortError') {
          Toast.show(l`Could not like quoted post`, {type: 'error'})
        }
      }
    })
  }, [control, agent, quotedPost, onToggleLike, playHaptic, l])

  const onPressClose = useCallback(() => control.close(), [control])

  return (
    <Dialog.ScrollableInner label={l(msg`Like or pass through`)}>
      <View style={a.gap_xl}>
        <View style={a.gap_xs}>
          <Button
            style={[a.justify_start, a.px_md, a.gap_sm]}
            label={post.viewer?.like ? l(msg`Unlike`) : l(msg`Like`)}
            onPress={onPressLike}
            size="large"
            variant="ghost"
            color="primary">
            <HeartIcon size="lg" fill={t.palette.pink} />
            <Text style={[a.font_semi_bold, a.text_xl]}>
              {post.viewer?.like ? <Trans>Unlike</Trans> : <Trans>Like</Trans>}
            </Text>
          </Button>
          <Button
            style={[a.justify_start, a.px_md, a.gap_sm]}
            label={l(msg`Like and pass through to quoted post`)}
            onPress={onPressPassThrough}
            size="large"
            variant="ghost"
            color="primary">
            <HeartIcon size="lg" fill={t.palette.pink} />
            <Text style={[a.font_semi_bold, a.text_xl]}>
              <Trans>Like and pass through</Trans>
            </Text>
          </Button>
        </View>
        <Button
          label={l(msg`Cancel`)}
          onPress={onPressClose}
          size="large"
          color="secondary">
          <ButtonText>
            <Trans>Cancel</Trans>
          </ButtonText>
        </Button>
      </View>
    </Dialog.ScrollableInner>
  )
}
LikeButtonDialogInner = memo(LikeButtonDialogInner)
export {LikeButtonDialogInner}
