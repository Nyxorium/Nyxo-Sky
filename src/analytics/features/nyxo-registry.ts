import {Features} from './types'

export type GateRegistryEntry = {
  label: string
  description?: string
}

export const NYXO_GATE_REGISTRY: Partial<Record<Features, GateRegistryEntry>> =
  {
    [Features.PostGalleryEmbedEnable]: {
      label: 'Image carousel',
      description:
        'Show multiple images as a swipeable carousel instead of a grid',
    },
    // future gates: one line each
    [Features.ComposerLanguageDetectionEnable]: {
      label: 'Composer language detection',
      description:
        'Automatically detect the language of posts as you write them',
    },
    [Features.PostThreadKnownLikersEnable]: {
      label: 'Post Thread Known Likers',
      description: 'Show people you follow who liked a post in the thread view',
    },
    [Features.FollowSortEnable]: {
      label: 'Follow Sort',
      description:
        'Sort other users followers/following pages by Top instead of Latest',
    },
    [Features.ModerationInboxEnable]: {
      label: 'Moderation Inbox',
      description:
        'Show the moderation inbox menu item and screen under Moderation settings (CURRENTLY PLACEHOLDERS)',
    },
  }
