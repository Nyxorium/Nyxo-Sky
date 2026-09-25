export const SITE_NAME = 'Nyxo Sky'
export const SITE_URL = 'https://embed-v2.nyxosky.pages.dev' 
// 'https://nyxosky.pages.dev'
export const DEFAULT_IMAGE = `${SITE_URL}/social-preview.png`
export const DEFAULT_DESCRIPTION = 'A little more control, honestly'

export interface MetaInput {
  title: string
  description: string
  url: string
  image?: string
}

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Collapses whitespace and hard-caps length, breaking on a word boundary. */
export function truncate(input: string, maxLength: number): string {
  const collapsed = input.replace(/\s+/g, ' ').trim()
  if (collapsed.length <= maxLength) return collapsed
  const cut = collapsed.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLength)}…`
}

class MetaTagHandler {
  private inserted = false
  constructor(private meta: Required<MetaInput>) {}

  element(element: Element) {
    // Drop a fresh block of tags in as the last child of <head>, rather than
    // trying to find-and-replace individual pre-existing tags — that breaks
    // the moment the static HTML's shape changes.
    if (this.inserted) return
    this.inserted = true

    const {title, description, url, image} = this.meta
    const t = escapeHtml(title)
    const d = escapeHtml(description)
    const u = escapeHtml(url)
    const i = escapeHtml(image)

    element.append(
      `
    <title>${t}</title>
    <meta name="description" content="${d}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${t}" />
    <meta property="og:description" content="${d}" />
    <meta property="og:url" content="${u}" />
    <meta property="og:image" content="${i}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${t}" />
    <meta name="twitter:description" content="${d}" />
    <meta name="twitter:image" content="${i}" />
`,
      {html: true},
    )
  }
}

class TitleStripHandler {
  // Removes the static app-shell <title> so we don't end up with two.
  element(element: Element) {
    element.remove()
  }
}

export function renderMetaHtml(baseHtml: Response, meta: MetaInput): Response {
  const full: Required<MetaInput> = {
    image: DEFAULT_IMAGE,
    ...meta,
  }

  return new HTMLRewriter()
    .on('title', new TitleStripHandler())
    .on('head', new MetaTagHandler(full))
    .transform(baseHtml)
}
