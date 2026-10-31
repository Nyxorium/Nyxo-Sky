import {useQuery} from '@tanstack/react-query'

import {type Shadow} from '#/state/cache/types'
import {useAppviewClient, useSession} from '#/state/session'
import {app} from '#/lexicons'
import type * as bsky from '#/types/bsky'

type Did = `did:${string}:${string}`

export const RQKEY = (did: string) => ['blocked-follow-uri', did]

export function useFollowUri(profile: Shadow<bsky.profile.AnyProfileView>) {
  const {data} = useBlockedFollowUri(
    profile.did,
    !!profile.viewer?.blockedBy && !profile.viewer?.following,
  )
  return profile.viewer?.following ?? data ?? undefined
}

export function useBlockedFollowUri(did: Did, enabled: boolean) {
  const client = useAppviewClient()
  const {currentAccount} = useSession()

  return useQuery({
    enabled: enabled && !!currentAccount,
    queryKey: RQKEY(did),
    staleTime: 30_000,
    queryFn: async () => {
      const {relationships} = await client.call(
        app.bsky.graph.getRelationships,
        {actor: currentAccount!.did, others: [did]},
      )

      type Rel = Extract<
        (typeof relationships)[number],
        {$type: 'app.bsky.graph.defs#relationship'}
      >
      const isRel = (r: (typeof relationships)[number]): r is Rel =>
        r.$type === 'app.bsky.graph.defs#relationship'

      const rel = relationships.filter(isRel).find(r => r.did === did)
      return rel?.following ?? null
    },
  })
}
