import {useCallback, useMemo} from 'react'
import {hasMutedWord} from '@bsky/sdk/moderation'
import {useQuery} from '@tanstack/react-query'

import {
  aggregateUserInterests,
  createBskyTopicsHeader,
} from '#/lib/api/feed/utils'
import {logger} from '#/logger'
import {getContentLanguages} from '#/state/preferences/languages'
import {useViewTailorPrefs} from '#/state/preferences/view-tailor-prefs'
import {STALE} from '#/state/queries'
import {usePreferencesQuery} from '#/state/queries/preferences'
import {useAppviewClient} from '#/state/session'
import {useAnalytics} from '#/analytics'
import {app} from '#/lexicons'

export const DEFAULT_LIMIT = 10
export const DEFAULT_FETCH_LIMIT = 25

type QueryProps = {
  fetchLimit?: number
  limit?: number
  refetchOnWindowFocus?: boolean
}

function dedupe<T extends {link: string}>(trends: T[]): T[] {
  const seen = new Set<string>()
  return trends.filter(trend => {
    if (seen.has(trend.link)) return false
    seen.add(trend.link)
    return true
  })
}

export const createGetTrendsQueryKey = (fetchLimit?: number) =>
  fetchLimit === undefined ? ['trends'] : ['trends', {limit: fetchLimit}]

export function useTrendingTopicsLimit() {
  const ax = useAnalytics()
  const {tailors} = useViewTailorPrefs()
  const remoteCount = ax.features.getValue(
    ax.features.TrendingExploreTopicsCountValue,
    DEFAULT_LIMIT,
  )
  return tailors.trendingTopics ?? remoteCount
}

export function useSidebarTrendingLimit() {
  return Math.min(DEFAULT_LIMIT, useTrendingTopicsLimit())
}

export function useGetTrendsQuery(props: QueryProps = {}) {
  const client = useAppviewClient()
  const {data: preferences} = usePreferencesQuery()
  const sidebarLimit = useSidebarTrendingLimit()
  const fetchLimit = props.fetchLimit ?? DEFAULT_FETCH_LIMIT
  const limit = props.limit ?? sidebarLimit
  const mutedWords = useMemo(() => {
    return preferences?.moderationPrefs?.mutedWords || []
  }, [preferences?.moderationPrefs])

  return useQuery({
    enabled: !!preferences,
    refetchOnWindowFocus: props.refetchOnWindowFocus,
    staleTime: STALE.MINUTES.THREE,
    queryKey: createGetTrendsQueryKey(fetchLimit),
    queryFn: async () => {
      const contentLangs = getContentLanguages().join(',')
      const data = await client.call(
        app.bsky.unspecced.getTrends,
        {
          limit: fetchLimit,
        },
        {
          headers: {
            ...createBskyTopicsHeader(aggregateUserInterests(preferences)),
            'Accept-Language': contentLangs,
          },
        },
      )
      if (!data.recIdStr) {
        logger.debug('useGetTrendsQuery response missing recIdStr')
      }
      return data
    },
    select: useCallback(
      (data: app.bsky.unspecced.getTrends.$OutputBody) => {
        return {
          recId: data.recIdStr,
          trends: dedupe(
            (data.trends ?? []).filter(t => {
              return !hasMutedWord({
                mutedWords,
                text: `${t.topic} ${t.displayName} ${t.category}`,
              })
            }),
          ).slice(0, limit),
        }
      },
      [limit, mutedWords],
    ),
  })
}
