import {app} from '#/lexicons'
import {Client} from '@atproto/lex'

import {html, renderHandleString} from '../../../profile/_shared'
import * as bsky from '#/types/bsky'

type Thread = app.bsky.feed.defs.ThreadViewPost

export function expandPostTextRich(
  postView: app.bsky.feed.defs.ThreadViewPost,
): string {
  if (
    !postView.post ||
    bsky.isType(app.bsky.feed.defs.notFoundPost, postView) ||
    bsky.isType(app.bsky.feed.defs.blockedPost, postView)
  ) {
    return ''
  }

  const post = postView.post
  const record = post.record
  const embed = post.embed
  const originalText = typeof record?.text === 'string' ? record.text : ''
  const facets = record?.facets as [app.bsky.richtext.facet.Main] | undefined

  let expandedText = originalText

  if (originalText && facets && facets.length > 0) {
    try {
      const rt = new RichText({text: originalText, facets})
      const modifiedSegmentsText: string[] = []

      for (const segment of rt.segments()) {
        const link = segment.link
        if (
          link &&
          segment.text.endsWith('...') &&
          link.uri.includes(segment.text.slice(0, -3))
        ) {
          modifiedSegmentsText.push(link.uri)
        } else {
          modifiedSegmentsText.push(segment.text)
        }
      }
      expandedText = modifiedSegmentsText.join('')
    } catch (error) {
      console.error('Error processing RichText segments:', error)
      expandedText = originalText
    }
  }

  if (bsky.isType(app.bsky.embed.external.view, embed) && embed.external?.uri) {
    const externalUri = embed.external.uri
    if (!expandedText.includes(externalUri)) {
      expandedText = expandedText
        ? `${expandedText}\n${externalUri}`
        : externalUri
    }
  }

  if (
    bsky.isType(app.bsky.embed.record.view, embed) ||
    bsky.isType(app.bsky.embed.recordWithMedia.view, embed)
  ) {
    const record = embed.record.record ?? embed.record
    if (bsky.isType(app.bsky.embed.record.viewRecord, record)) {
      const quote = `↘️ quoting ${renderHandleString(record.author)}:\n\n${
        record.value.text
      }`
      expandedText = expandedText ? `${expandedText}\n\n${quote}` : quote
    } else {
      const placeholder = '[quote/embed]'
      if (!expandedText.includes(placeholder)) {
        expandedText = expandedText
          ? `${expandedText}\n\n${placeholder}`
          : placeholder
      }
    }
  }

  if (bsky.isType(app.bsky.feed.defs.threadViewPost, postView.parent)) {
    const header = `↩️ reply to ${renderHandleString(
      postView.parent.post.author,
    )}:`
    expandedText = expandedText ? `${header}\n\n${expandedText}` : header
  }

  return expandedText
}

class HeadHandler {
  thread: Thread
  url: string
  postTextString: string
  constructor(thread: Thread, url: string, postTextString: string) {
    this.thread = thread
    this.url = url
    this.postTextString = postTextString
  }
  async element(element) {
    const author = this.thread.post.author
    const origin = new URL(this.url).origin

    const postText =
      this.postTextString.length > 0
        ? html`
            <meta name="description" content="${this.postTextString}" />
            <meta property="og:description" content="${this.postTextString}" />
          `
        : ''

    const embed = this.thread.post.embed

    const embedElems = !embed
      ? ''
      : bsky.isType(app.bsky.embed.images.view, embed)
        ? html`${embed.images.map(
              i => html`<meta property="og:image" content="${i.thumb}" />`,
            )}
            <meta name="twitter:card" content="summary_large_image" /> `
        : 'thumbnail' in embed && embed.thumbnail
          ? html`
              <meta property="og:image" content="${embed.thumbnail}" />
              <meta name="twitter:card" content="summary_large_image" />
            `
          : html`<meta name="twitter:card" content="summary" />`

    element.append(
      html`
        <meta property="og:site_name" content="Nyxo Sky" />
        <meta property="og:url" content="${this.url}" />
        ${postText} ${embedElems}
        <meta name="twitter:label1" content="Account DID" />
        <meta name="twitter:value1" content="${author.did}" />
        <meta
          name="article:published_time"
          content="${this.thread.post.indexedAt}" />
        <link
          rel="alternate"
          type="application/json+oembed"
          href="${origin}/oembed?url=${encodeURIComponent(this.url)}"
          title="${renderHandleString(author)}" />
      `,
      {html: true},
    )
  }
}

class TitleHandler {
  thread: Thread
  constructor(thread: Thread) {
    this.thread = thread
  }
  async element(element) {
    element.setInnerContent(renderHandleString(this.thread.post.author))
  }
}

class NoscriptHandler {
  thread: Thread
  postTextString: string
  constructor(thread: Thread, postTextString: string) {
    this.thread = thread
    this.postTextString = postTextString
  }
  async element(element) {
    element.append(
      html`
        <div id="bsky_post_summary">
          <h3>Post</h3>
          <p id="bsky_display_name">
            ${this.thread.post.author.displayName ?? ''}
          </p>
          <p id="bsky_handle">${this.thread.post.author.handle}</p>
          <p id="bsky_did">${this.thread.post.author.did}</p>
          <p id="bsky_post_text">${this.postTextString}</p>new AtpAgent({service: 'https://public.api.bsky.app/'})
          <p id="bsky_post_indexedat">${this.thread.post.indexedAt}</p>
        </div>
      `,
      {html: true},
    )
  }
}

export async function onRequest(context) {
  const client = new Client({service: 'https://public.api.bsky.app/'})
  const {request, env} = context
  const origin = new URL(request.url).origin
  const {handleOrDID, rkey}: {handleOrDID: string; rkey: string} =
    context.params

  const base = env.ASSETS.fetch(new URL('/', origin))
  try {
    const {data} = await client.getPostThread({
      uri: `at://${handleOrDID}/app.bsky.feed.post/${rkey}`,
      depth: 1,
      parentHeight: 1,
    })
    if (!bsky.isType(app.bsky.feed.defs.threadViewPost, data.thread)) {
      throw new Error('Expected a ThreadViewPost')
    }
    const postTextString = expandPostTextRich(data.thread)
    return new HTMLRewriter()
      .on(`head`, new HeadHandler(data.thread, request.url, postTextString))
      .on(`title`, new TitleHandler(data.thread))
      .on(`noscript`, new NoscriptHandler(data.thread, postTextString))
      .transform(await base)
  } catch (e) {
    console.error(e)
    return await base
  }
}
