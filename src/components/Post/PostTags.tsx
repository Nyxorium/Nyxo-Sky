import {Fragment} from 'react'

import {atoms as a} from '#/alf'
import {RichTextTag} from '#/components/RichTextTag'
import {Text} from '#/components/Typography'

export function PostTags({
  tags,
  authorHandle,
}: {
  tags?: string[]
  authorHandle?: string
}) {
  if (!tags?.length) return null

  return (
    <Text style={[a.text_sm, a.pt_md]}>
      {tags.map((tag, i) => (
        <Fragment key={tag + i}>
          <RichTextTag
            tag={tag}
            display={`#${tag}`}
            authorHandle={authorHandle}
            textStyle={[a.text_sm]}
          />
          {i < tags.length - 1 ? ' \u00B7 ' : null}
        </Fragment>
      ))}
    </Text>
  )
}
