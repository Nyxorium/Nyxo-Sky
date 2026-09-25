
const APPVIEW = 'https://public.api.bsky.app'

export interface BskyProfile {
  did: string
  handle: string
  displayName?: string
  description?: string
  avatar?: string
}

export interface BskyPost {
  uri: string
  cid: string
  author: BskyProfile
  text: string
  createdAt: string
}

async function xrpcGet<T>(
  nsid: string,
  params: Record<string, string>,
): Promise<T | null> {
  const url = new URL(`${APPVIEW}/xrpc/${nsid}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    headers: {accept: 'application/json'},
    // Edge-cache successful AppView reads briefly. Embeds don't need to be
    // second-by-second fresh, and this saves a round trip on repeated scrapes
    // (link-unfurlers frequently re-fetch the same URL).
    cf: {cacheTtl: 120, cacheEverything: true},
  })

  if (!res.ok) return null
  return (await res.json()) as T
}

/** Resolves a handle OR did to a full profile. Returns null if not found. */
export async function getProfile(actor: string): Promise<BskyProfile | null> {
  return xrpcGet<BskyProfile>('app.bsky.actor.getProfile', {actor})
}

/**
 * Fetches a single post given the author (handle or did) and the record key
 * from the URL. Resolves the author to a DID first, since AT-URIs need one.
 */
export async function getPostByHandleAndRkey(
  actorHandleOrDid: string,
  rkey: string,
): Promise<BskyPost | null> {
  const did = actorHandleOrDid.startsWith('did:')
    ? actorHandleOrDid
    : (await getProfile(actorHandleOrDid))?.did

  if (!did) return null

  const uri = `at://${did}/app.bsky.feed.post/${rkey}`
  const result = await xrpcGet<{posts: any[]}>('app.bsky.feed.getPosts', {
    uris: uri,
  })

  const post = result?.posts?.[0]
  if (!post) return null

  return {
    uri: post.uri,
    cid: post.cid,
    author: post.author,
    text: post.record?.text ?? '',
    createdAt: post.record?.createdAt ?? '',
  }
}
