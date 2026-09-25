import {getPostByHandleAndRkey} from '../../../_shared/atproto'
import {renderMetaHtml, truncate, SITE_URL} from '../../../_shared/meta'

interface Env {
  ASSETS: Fetcher
}

export const onRequestGet: PagesFunction<Env> = async context => {
  const {actor, rkey} = context.params as {actor: string; rkey: string}

  const indexUrl = new URL('/index.html', context.request.url)
  const basePromise = context.env.ASSETS.fetch(indexUrl.toString())
  const post = await getPostByHandleAndRkey(decodeURIComponent(actor), rkey)
  const base = await basePromise

  if (!post) {
    return base
  }

  const authorName = post.author.displayName?.trim() || `@${post.author.handle}`
  const title = `${authorName} on Nyxo Sky`
  const description = post.text?.trim()
    ? truncate(post.text, 200)
    : `A post by @${post.author.handle}`

  return renderMetaHtml(base, {
    title,
    description,
    url: `${SITE_URL}/profile/${post.author.handle}/post/${rkey}`,
    image: post.author.avatar,
  })
}
