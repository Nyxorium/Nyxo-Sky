import {
  AppBskyEmbedImages,
  AppBskyFeedDefs,
  AtpAgent,
} from '@atproto/api'

import {renderHandleString} from './profile/_shared'

export async function onRequest(context) {
  const {request} = context
  const url = new URL(request.url)
  const postUrl = url.searchParams.get('url')

  if (!postUrl) {
    return new Response('Missing url parameter', {status: 400})
  }

  const match = new URL(postUrl).pathname.match(
    /\/profile\/([^/]+)\/post\/([^/]+)/,
  )
  if (!match) {
    return new Response('Invalid post URL', {status: 400})
  }

  const [, handleOrDID, rkey] = match

  try {
    const agent = new AtpAgent({service: 'https://public.api.bsky.app/'})
    const {data} = await agent.getPostThread({
      uri: `at://${handleOrDID}/app.bsky.feed.post/${rkey}`,
      depth: 0,
      parentHeight: 0,
    })

    if (!AppBskyFeedDefs.isThreadViewPost(data.thread)) {
      throw new Error('Expected a ThreadViewPost')
    }

    const post = data.thread.post
    const author = post.author

    let thumbnailUrl: string | undefined
    let thumbnailWidth: number | undefined
    let thumbnailHeight: number | undefined
    if (AppBskyEmbedImages.isView(post.embed) && post.embed.images.length > 0) {
      const img = post.embed.images[0]
      thumbnailUrl = img.thumb
      thumbnailWidth = img.aspectRatio?.width
      thumbnailHeight = img.aspectRatio?.height
    } else if (author.avatar) {
      thumbnailUrl = author.avatar
    }

    const providerUrl = new URL(request.url).origin

    const oEmbed: Record<string, unknown> = {
      type: 'rich',
      version: '1.0',
      author_name: renderHandleString(author),
      author_url: `${providerUrl}/profile/${author.handle}`,
      provider_name: 'Nyxo Sky',
      provider_url: providerUrl,
      timestamp: post.indexedAt,
    }

    if (thumbnailUrl) {
      oEmbed.thumbnail_url = thumbnailUrl
      if (thumbnailWidth) oEmbed.thumbnail_width = thumbnailWidth
      if (thumbnailHeight) oEmbed.thumbnail_height = thumbnailHeight
    }

    return new Response(JSON.stringify(oEmbed), {
      headers: {
        'Content-Type': 'application/json+oembed',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (e) {
    console.error(e)
    return new Response('Failed to fetch post', {status: 500})
  }
}