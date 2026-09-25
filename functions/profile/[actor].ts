import {getProfile} from '../_shared/atproto'
import {
  renderMetaHtml,
  truncate,
  DEFAULT_DESCRIPTION,
  SITE_URL,
} from '../_shared/meta'

interface Env {
  ASSETS: Fetcher
}

export const onRequestGet: PagesFunction<Env> = async context => {
  const {handleOrDID} = context.params as {handleOrDID: string}

  const indexUrl = new URL('/index.html', context.request.url)
  const basePromise = context.env.ASSETS.fetch(indexUrl.toString())
  const profile = await getProfile(decodeURIComponent(handleOrDID))
  const base = await basePromise

  if (!profile) {
    // Unknown/unresolvable actors fall back to the plain app shell rather
    // than erroring the whole page load.
    return base
  }

  const name = profile.displayName?.trim() || `@${profile.handle}`
  const title = `${name} (@${profile.handle})`
  const description = profile.description?.trim()
    ? truncate(profile.description, 200)
    : DEFAULT_DESCRIPTION

  return renderMetaHtml(base, {
    title,
    description,
    url: `${SITE_URL}/profile/${profile.handle}`,
    image: profile.avatar,
  })
}
