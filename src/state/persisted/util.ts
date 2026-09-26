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

export function migrateOldSettings(state: Schema): Schema {
  const alreadyMigrated = Object.keys(state.switchboard ?? {}).length > 0 // ||
  // Object.keys(state.viewTailors ?? {}).length > 0

  if (alreadyMigrated) return state

  const hasOldData = [state.enableShareViaDID, state.labelerLimitBypass].some(
    v => v === true,
  )

  if (!hasOldData) return state

  return {
    ...state,
    switchboard: {
      shareByDID: state.enableShareViaDID,
      labelerLimitBypass: state.labelerLimitBypass,
      labelGrouping: state.splitModerationLabelGrouping,
    },
  }
}
