import {parse} from 'bcp-47'

import {dedupArray} from '#/lib/functions'
import {logger} from '#/logger'
import {type Schema} from '#/state/persisted/schema'

export function normalizeData(data: Schema) {
  const next = {...data}

  /**
   * Normalize language prefs to ensure that these values only contain 2-letter
   * country codes without region.
   */
  try {
    const langPrefs = {...next.languagePrefs}
    langPrefs.primaryLanguage = normalizeLanguageTagToTwoLetterCode(
      langPrefs.primaryLanguage,
    )
    langPrefs.contentLanguages = dedupArray(
      langPrefs.contentLanguages.map(lang =>
        normalizeLanguageTagToTwoLetterCode(lang),
      ),
    )
    langPrefs.postLanguage = langPrefs.postLanguage
      .split(',')
      .map(lang => normalizeLanguageTagToTwoLetterCode(lang))
      .filter(Boolean)
      .join(',')
    langPrefs.postLanguageHistory = dedupArray(
      langPrefs.postLanguageHistory.map(postLanguage => {
        return postLanguage
          .split(',')
          .map(lang => normalizeLanguageTagToTwoLetterCode(lang))
          .filter(Boolean)
          .join(',')
      }),
    )
    next.languagePrefs = langPrefs
  } catch (e: any) {
    logger.error(`persisted state: failed to normalize language prefs`, {
      safeMessage: e.message,
    })
  }

  return next
}

export function normalizeLanguageTagToTwoLetterCode(lang: string) {
  const result = parse(lang).language
  return result ?? lang
}

export function migrateProfileTabVisibility(state: Schema): Schema {
  const alreadyMigrated =
    Object.keys(state.profileTabVisibility ?? {}).length > 0 ||
    Object.keys(state.profileTabVisibility_self ?? {}).length > 0

  if (alreadyMigrated) return state

  const hasOldData = [
    state.disablePostsProfileTab,
    state.disableRepliesProfileTab,
    state.disableMediaProfileTab,
    state.disableVideosProfileTab,
    state.disableFeedsProfileTab,
    state.disableStarterPacksProfileTab,
    state.disableListsProfileTab,
    state.disablePostsProfileTab_self,
    state.disableRepliesProfileTab_self,
    state.disableMediaProfileTab_self,
    state.disableVideosProfileTab_self,
    state.disableLikesProfileTab_self,
    state.disableFeedsProfileTab_self,
    state.disableStarterPacksProfileTab_self,
    state.disableListsProfileTab_self,
  ].some(v => v === true)

  if (!hasOldData) return state

  return {
    ...state,
    profileTabVisibility: {
      posts: state.disablePostsProfileTab,
      replies: state.disableRepliesProfileTab,
      media: state.disableMediaProfileTab,
      videos: state.disableVideosProfileTab,
      feeds: state.disableFeedsProfileTab,
      starterPacks: state.disableStarterPacksProfileTab,
      lists: state.disableListsProfileTab,
    },
    profileTabVisibility_self: {
      posts: state.disablePostsProfileTab_self,
      replies: state.disableRepliesProfileTab_self,
      media: state.disableMediaProfileTab_self,
      videos: state.disableVideosProfileTab_self,
      likes: state.disableLikesProfileTab_self,
      feeds: state.disableFeedsProfileTab_self,
      starterPacks: state.disableStarterPacksProfileTab_self,
      lists: state.disableListsProfileTab_self,
    },
  }
}
