import {useCallback} from 'react'
import {
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  type AppBskyFeedDefs,
} from '@atproto/api'
import {useLingui} from '@lingui/react'

/**
 * This matches `formatCount` from `view/com/util/numeric/format.ts`, but has
 * additional truncation logic for large numbers. `roundingMode` should always
 * match the original impl, regardless of if we add more formatting here.
 */
export function useFormatPostStatCount() {
  const {i18n} = useLingui()

  return useCallback(
    (postStatCount: number) => {
      const isOver10k = postStatCount >= 10_000
      return i18n.number(postStatCount, {
        notation: 'compact',
        maximumFractionDigits: isOver10k ? 0 : 1,
        roundingMode: 'trunc',
      })
    },
    [i18n],
  )
}

export function getQuotedPost(
  embed: AppBskyFeedDefs.PostView['embed'],
): {uri: string; cid: string} | null {
  // embed.record (plain quote)
  if (AppBskyEmbedRecord.isView(embed)) {
    if (AppBskyEmbedRecord.isViewRecord(embed.record)) {
      return {uri: embed.record.uri, cid: embed.record.cid}
    }
  }
  // embed.recordWithMedia (quote + image/video)
  if (AppBskyEmbedRecordWithMedia.isView(embed)) {
    const inner = embed.record
    if (
      AppBskyEmbedRecord.isView(inner) &&
      AppBskyEmbedRecord.isViewRecord(inner.record)
    ) {
      return {uri: inner.record.uri, cid: inner.record.cid}
    }
  }
  return null
}
