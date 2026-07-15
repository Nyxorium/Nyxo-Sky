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
    [Features.LiveNowBetaDisable]: {
      label: 'Disable Live Now',
      description: 'Hide the Live Now feature',
    },
    [Features.PostThreadKnownLikersEnable]: {
      label: 'Post Thread Known Likers',
      description: 'Show people you follow who liked a post in the thread view',
    },
    [Features.PostThreadKnownLikersFetchEnable]: {
      label: 'Post Thread Known Likers Fetch',
      description: 'Fetch known-liker data for posts in a thread',
    },
  }
