import {app} from '@bsky/sdk/lexicons'

export const CONTENT_LABELS = ['porn', 'sexual', 'nudity', 'graphic-media']

export function labelsToInfo(
  labels?: app.bsky.feed.defs.PostView['labels'],
): string | undefined {
  const label = labels?.find(label => CONTENT_LABELS.includes(label.val))

  switch (label?.val) {
    case 'porn':
      return 'Adult Content'
    case 'sexual':
      return 'Sexually Suggestive'
    case 'nudity':
      return 'Non-sexual Nudity'
    case 'gore':
    case 'graphic-media':
      return 'Graphic Media'
    default:
      return undefined
  }
}
