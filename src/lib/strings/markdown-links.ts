import {type Client, type UriString} from '@atproto/lex'
import {RichText} from '@bsky/sdk/richtext'

import {shortenLinks} from '#/lib/strings/rich-text-manip'
import {app} from '#/lexicons'
import * as bsky from '#/types/bsky'

const MARKDOWN_LINK_REGEX =
  /(\\)?\[([^\[\]\n]+)\]\(([^\s()]+(?:\([^\s()]*\)[^\s()]*)*)\)/g

function utf8Length(s: string): number {
  let n = 0
  for (const ch of s) {
    const cp = ch.codePointAt(0)!
    n += cp <= 0x7f ? 1 : cp <= 0x7ff ? 2 : cp <= 0xffff ? 3 : 4
  }
  return n
}

export type MarkdownLink = {byteStart: number; byteEnd: number; uri: UriString}

/**
 * Decides whether the text inside `(...)` is a real link, using the SDK's own
 * detection so bare domains follow the same rules as regular post text.
 */
function resolveMarkdownUri(raw: string): UriString | undefined {
  if (/^https?:\/\//i.test(raw)) return raw as UriString

  const rt = new RichText({text: raw})
  rt.detectFacetsWithoutResolution()
  if (rt.facets?.length !== 1) return undefined
  const facet = rt.facets[0]
  if (facet.index.byteStart !== 0 || facet.index.byteEnd !== utf8Length(raw)) {
    return undefined
  }
  const feature = facet.features[0]
  if (!bsky.isType(app.bsky.richtext.facet.link, feature)) return undefined
  return feature.uri
}

/**
 * Strips `[label](url)` syntax down to `label` and returns the byte range of
 * each label in the stripped text.
 */
export function extractMarkdownLinks(input: string): {
  text: string
  links: MarkdownLink[]
} {
  let text = ''
  let bytes = 0
  let last = 0
  const links: MarkdownLink[] = []

  for (const m of input.matchAll(MARKDOWN_LINK_REGEX)) {
    const [full, escape, label, rawUri] = m
    const resolved = resolveMarkdownUri(rawUri)
    // Not a real link: leave the whole thing as literal text.
    if (!resolved) continue

    const start = m.index

    const before = input.slice(last, start)
    text += before
    bytes += utf8Length(before)

    if (escape) {
      const literal = full.slice(1)
      text += literal
      bytes += utf8Length(literal)
    } else {
      const labelBytes = utf8Length(label)
      links.push({
        byteStart: bytes,
        byteEnd: bytes + labelBytes,
        uri: resolved,
      })
      text += label
      bytes += labelBytes
    }

    last = start + full.length
  }

  text += input.slice(last)
  return {text, links}
}

const overlaps = (
  a: {byteStart: number; byteEnd: number},
  b: {byteStart: number; byteEnd: number},
) => a.byteStart < b.byteEnd && b.byteStart < a.byteEnd

/**
 * Drops auto-detected facets that overlap a markdown link, then adds the
 * markdown links as link facets.
 */
export function mergeMarkdownLinkFacets(
  facets: app.bsky.richtext.facet.Main[] | undefined,
  links: MarkdownLink[],
): app.bsky.richtext.facet.Main[] {
  const kept = (facets ?? []).filter(
    f => !links.some(l => overlaps(f.index, l)),
  )
  const added: app.bsky.richtext.facet.Main[] = links.map(l => ({
    index: {byteStart: l.byteStart, byteEnd: l.byteEnd},
    features: [{$type: 'app.bsky.richtext.facet#link' as const, uri: l.uri}],
  }))
  return [...kept, ...added].sort(
    (a, b) => a.index.byteStart - b.index.byteStart,
  )
}

/**
 * Grapheme length of what will actually be posted: markdown links collapsed
 * to their labels, then long URLs shortened.
 */
export function getFinalGraphemeLength(rt: RichText): number {
  const {text} = extractMarkdownLinks(rt.text)
  if (text === rt.text) return shortenLinks(rt).graphemeLength
  const stripped = new RichText({text})
  stripped.detectFacetsWithoutResolution()
  return shortenLinks(stripped).graphemeLength
}

/**
 * Resolves facets for `rt`, treating `[label](url)` as markdown links.
 * Returns the RichText to use from here on (a new instance when markdown
 * was converted, otherwise the same one with facets detected as usual).
 */
export async function detectFacetsWithMarkdown(
  rt: RichText,
  client: Client,
): Promise<RichText> {
  const {text, links} = extractMarkdownLinks(rt.text)
  const next = text !== rt.text ? new RichText({text}) : rt
  await next.detectFacets(client)
  if (links.length) {
    next.facets = mergeMarkdownLinkFacets(next.facets, links)
  }
  return next
}

export type MarkdownSpan = {
  /** UTF-16 string indices into the raw input (not UTF-8 byte offsets). */
  start: number
  end: number
  /** `link`: a whole `[label](url)`. `escape`: the `\` before an escaped one. */
  kind: 'link' | 'escape'
}

/**
 * Where markdown links and escape backslashes sit in the raw composer text,
 * using the same pattern as send-time conversion so the two always agree.
 */
export function findMarkdownSpans(input: string): MarkdownSpan[] {
  const spans: MarkdownSpan[] = []
  for (const m of input.matchAll(MARKDOWN_LINK_REGEX)) {
    if (!resolveMarkdownUri(m[3])) continue
    const start = m.index
    if (m[1]) {
      spans.push({start, end: start + 1, kind: 'escape'})
    } else {
      spans.push({start, end: start + m[0].length, kind: 'link'})
    }
  }
  return spans
}
