import {type AppBskyFeedPost} from '@atproto/api'

/** Extra fields we write onto a post record on edit — not part of the lexicon. */
export type PostEditFields = {
  /** When the edit happened. Absent means never edited. */
  updatedAt?: string
  /** The original text, kept for history. */
  originalText?: string
}

export type EditedPostRecord = AppBskyFeedPost.Record & PostEditFields

export function getPostEditInfo(record: AppBskyFeedPost.Record): {
  isEdited: boolean
  updatedAt: string | undefined
  originalText: string | undefined
} {
  const {updatedAt, originalText} = record as EditedPostRecord
  return {
    isEdited: typeof updatedAt === 'string',
    updatedAt: typeof updatedAt === 'string' ? updatedAt : undefined,
    originalText: typeof originalText === 'string' ? originalText : undefined,
  }
}
