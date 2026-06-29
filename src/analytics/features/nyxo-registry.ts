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
    [Features.ImportContactsSettingsDisable]: {
      label: 'Disable contact import (settings)',
      description: 'Hide the import contacts option in settings',
    },
    [Features.LiveNowBetaDisable]: {
      label: 'Disable Live Now beta',
      description: 'Hide the Live Now feature',
    },
    [Features.NotificationsExpandedProfileCardEnable]: {
      label: 'Expanded profile cards in notifications',
      description: 'Show a richer profile card when viewing notifications',
    },
    [Features.SearchV2Enable]: {
      label: 'Search v2',
      description: 'Enable the redesigned search experience',
    },
    [Features.AdvancedSearchV2Enable]: {
      label: 'Advanced search v2',
      description: 'Enable the redesigned advanced search experience',
    },
  }
