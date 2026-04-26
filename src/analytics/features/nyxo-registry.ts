import {Features} from './types'

export type GateRegistryEntry = {
  label: string
  description?: string
}

export const NYXO_GATE_REGISTRY: Partial<Record<Features, GateRegistryEntry>> = {
  [Features.PostGalleryEmbedEnable]: {
    label: 'Image carousel',
    description: 'Show multiple images as a swipeable carousel instead of a grid',
  },
  // future gates: one line each
  [Features.ImageUploadsHighResolution]: {
    label: 'High resolution image uploads',
    description: 'Upload images at higher resolution than the default',
  },
  [Features.ImageUploadsBlobSize2mbEnabled]: {
    label: '2MB image upload limit',
    description: 'Allow uploading images up to 2MB instead of 1MB',
  },
  [Features.GroupChatsEnable]: {
    label: 'Group chats',
    description: 'Enable group chat functionality in direct messages',
  },
  [Features.KlipyGifProviderEnable]: {
    label: 'Klipy GIF provider',
    description: 'Use Klipy as an additional GIF provider in the composer',
  },
  [Features.ComposerLanguageDetectionEnable]: {
    label: 'Composer language detection',
    description: 'Automatically detect the language of posts as you write them',
  },
  [Features.LiveNowBetaDisable]: {
    label: 'Disable Live Now beta',
    description: 'Hide the Live Now feature if it has been enabled by Bluesky',
  },
}