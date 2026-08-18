import {type app} from '#/lexicons'

/** Extra fields we write onto a post record on edit — not part of the lexicon. */
export type PostEditFields = {
  /** When the edit happened. Absent means never edited. */
  updatedAt?: string
  /** The original text, kept for history. */
  originalText?: string
}

export type EditedPostRecord = app.bsky.feed.post.Main & PostEditFields

export function getPostEditInfo(record: app.bsky.feed.post.Main): {
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
