import {type StyleProp, View, type ViewStyle} from 'react-native'
import {AppBskyFeedDefs, AppBskyFeedPost} from '@atproto/api'

import {atoms as a, tokens, useTheme} from '#/alf'
import {RichTextTag} from '#/components/RichTextTag'

export function PostTags({
  post,
  style,
  isThreaded,
}: {
  post: AppBskyFeedDefs.PostView
  style?: StyleProp<ViewStyle>
  isThreaded?: boolean
}) {
  const t = useTheme()
  const tags = getRecordTags(post)

  const useSpacer = isThreaded ? [a.pt_sm, a.pb_0] : null
  const useItalic = a.italic
  // Not sure how italic will hold up as a style
  // This is a test to see -- Sunstar

  if (!tags.length) return null

  return (
    <View
      style={[
        a.flex_row,
        a.flex_wrap,
        a.pt_2xs,
        {
          columnGap: tokens.space.sm,
          rowGap: tokens.space._2xs,
        },
        style,
        useSpacer,
      ]}>
      {tags.map(tag => (
        <RichTextTag
          key={tag}
          tag={tag}
          display={`#${tag}`}
          authorHandle={post.author.handle}
          textStyle={[
            a.text_sm,
            a.font_bold,
            {color: t.palette.primary_800},
            useItalic,
          ]}
        />
      ))}
    </View>
  )
}

function getRecordTags(post: AppBskyFeedDefs.PostView): string[] {
  if (!AppBskyFeedPost.isRecord(post.record)) return []
  const tags = post.record.tags
  return Array.isArray(tags)
    ? tags.filter(
        (tag): tag is string =>
          typeof tag === 'string' && tag.trim().length > 0,
      )
    : []
}
