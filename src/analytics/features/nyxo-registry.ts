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
    [Features.AtmosphereScreenEnable]: {
      label: 'Atmosphere Explore',
      description: 'Show the Atmosphere tab in drawer/left nav',
    },
    [Features.ShareDestinationsEnable]: {
      label: 'Share Destinations Enable',
      description: '',
    },
    [Features.ImageUploadsNativeCompressionEnable]: {
      label: 'Image Uploads Native Compression Enable',
      description: '',
    },
    [Features.ImageUploadsWebCompressionEnable]: {
      label: 'Image Uploads Web Compression Enable',
      description: '',
    },
    [Features.FollowingV2Enable]: {
      label: 'Following v2 Enable',
      description: '',
    },
  }
