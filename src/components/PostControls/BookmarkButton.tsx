import {memo} from 'react'
import {type Insets} from 'react-native'
import {type AppBskyFeedDefs} from '@atproto/api'
import {msg, plural, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import type React from 'react'

import {useCleanError} from '#/lib/hooks/useCleanError'
import {type Shadow} from '#/state/cache/post-shadow'
import {useFeedFeedbackContext} from '#/state/feed-feedback'
import {useBookmarkMutation} from '#/state/queries/bookmarks/useBookmarkMutation'
import {useRequireAuth} from '#/state/session'
import {useTheme} from '#/alf'
import {Bookmark, BookmarkFilled} from '#/components/icons/Bookmark'
import {Trash_Stroke2_Corner0_Rounded as TrashIcon} from '#/components/icons/Trash'
import * as toast from '#/components/Toast'
import {useAnalytics} from '#/analytics'
import {useFormatPostStatCount} from '#/components/PostControls/util'
import {PostControlButton, PostControlButtonIcon, PostControlButtonText} from './PostControlButton'

export const BookmarkButton = memo(function BookmarkButton({
  post,
  bookmarkCount,
  big,
  logContext,
  hitSlop,
}: {
  post: Shadow<AppBskyFeedDefs.PostView>
  bookmarkCount?: number
  big?: boolean
  logContext: 'FeedItem' | 'PostThreadItem' | 'Post' | 'ImmersiveVideo'
  hitSlop?: Insets
}): React.ReactNode {
  const t = useTheme()
  const ax = useAnalytics()
  const {_} = useLingui()
  const {mutateAsync: bookmark} = useBookmarkMutation()
  const cleanError = useCleanError()
  const requireAuth = useRequireAuth()
  const {feedDescriptor} = useFeedFeedbackContext()
  const formatPostStatCount = useFormatPostStatCount()

  const {viewer} = post
  const isBookmarked = !!viewer?.bookmarked

  const undoLabel = _(
    msg({
      message: `Undo`,
      context: `Button label to undo saving/removing a post from saved posts.`,
    }),
  )

  const save = async ({disableUndo}: {disableUndo?: boolean} = {}) => {
    try {
      await bookmark({
        action: 'create',
        post,
      })

      ax.metric('post:bookmark', {
        uri: post.uri,
        authorDid: post.author.did,
        logContext,
        feedDescriptor,
      })

      toast.show(
        <toast.Outer>
          <toast.Icon />
          <toast.Text>
            <Trans>Post saved</Trans>
          </toast.Text>
          {!disableUndo && (
            <toast.Action
              label={undoLabel}
              onPress={() => remove({disableUndo: true})}>
              {undoLabel}
            </toast.Action>
          )}
        </toast.Outer>,
        {
          type: 'success',
        },
      )
    } catch (e: any) {
      const {raw, clean} = cleanError(e)
      toast.show(clean || raw || e, {
        type: 'error',
      })
    }
  }

  const remove = async ({disableUndo}: {disableUndo?: boolean} = {}) => {
    try {
      await bookmark({
        action: 'delete',
        uri: post.uri,
      })

      ax.metric('post:unbookmark', {
        uri: post.uri,
        authorDid: post.author.did,
        logContext,
        feedDescriptor,
      })

      toast.show(
        <toast.Outer>
          <toast.Icon icon={TrashIcon} />
          <toast.Text>
            <Trans>Removed from saved posts</Trans>
          </toast.Text>
          {!disableUndo && (
            <toast.Action
              label={undoLabel}
              onPress={() => save({disableUndo: true})}>
              {undoLabel}
            </toast.Action>
          )}
        </toast.Outer>,
      )
    } catch (e: any) {
      const {raw, clean} = cleanError(e)
      toast.show(clean || raw || e, {
        type: 'error',
      })
    }
  }

  const onHandlePress = () =>
    requireAuth(async () => {
      if (isBookmarked) {
        await remove()
      } else {
        await save()
      }
    })

  return (
    <PostControlButton
      testID="postBookmarkBtn"
      big={big}
      label={
        isBookmarked
          ? _(
              msg({
                message: `Remove from saved posts (${plural(bookmarkCount || 0, {
                  one: '# save',
                  other: '# saves',
                })})`,
                comment:
                  'Accessibility label for the save button when the post has been saved, verb followed by number of saves and noun',
              }),
            )
          : _(
              msg({
                message: `Add to saved posts (${plural(bookmarkCount || 0, {
                  one: '# save',
                  other: '# saves',
                })})`,
                comment:
                  'Accessibility label for the save button when the post has not been saved, verb form followed by number of saves and noun form',
              }),
            )
      }
      onPress={onHandlePress}
      hitSlop={hitSlop}>
      <PostControlButtonIcon
        fill={isBookmarked ? t.palette.primary_500 : undefined}
        icon={isBookmarked ? BookmarkFilled : Bookmark}
      />
      {typeof bookmarkCount !== 'undefined' && bookmarkCount > 0 && (
        <PostControlButtonText testID="bookmarkCount">
          {formatPostStatCount(bookmarkCount)}
        </PostControlButtonText>
      )}
    </PostControlButton>
  )
})
