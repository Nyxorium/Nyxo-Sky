import {useCallback, useMemo, useRef, useState} from 'react'
import {View, type ViewabilityConfig} from 'react-native'
import {type AppBskyActorDefs, type AppBskyFeedDefs} from '@atproto/api'
import {Trans, useLingui} from '@lingui/react/macro'
import {useQueryClient} from '@tanstack/react-query'
import * as bcp47Match from 'bcp-47-match'

import {popularInterests, useInterestsDisplayNames} from '#/lib/interests'
import {cleanError} from '#/lib/strings/errors'
import {useLanguagePrefs} from '#/state/preferences/languages'
import {useModerationOpts} from '#/state/preferences/moderation-opts'
import {RQKEY_ROOT as useActorSearchQueryKeyRoot} from '#/state/queries/actor-search'
import {useGetPopularFeedsQuery} from '#/state/queries/feed'
import {Nux, useNux} from '#/state/queries/nuxs'
import {usePreferencesQuery} from '#/state/queries/preferences'
import {
  createGetSuggestedFeedsQueryKey,
  useGetSuggestedFeedsQuery,
} from '#/state/queries/trending/useGetSuggestedFeedsQuery'
import {
  getSuggestedUsersForExploreQueryKeyRoot,
  useGetSuggestedUsersForExploreQuery,
} from '#/state/queries/trending/useGetSuggestedUsersForExploreQuery'
import {createGetTrendsQueryKey} from '#/state/queries/trending/useGetTrendsQuery'
import {List} from '#/view/com/util/List'
import {FeedFeedLoadingPlaceholder} from '#/view/com/util/LoadingPlaceholder'
import {ExploreInterestsCard} from '#/screens/Search/modules/ExploreInterestsCard'
import {ExploreTrendingVideos} from '#/screens/Search/modules/ExploreTrendingVideos'
import {atoms as a, native, platform, useTheme} from '#/alf'
import {Admonition} from '#/components/Admonition'
import {Button} from '#/components/Button'
import * as FeedCard from '#/components/FeedCard'
import {ChevronBottom_Stroke2_Corner0_Rounded as ChevronDownIcon} from '#/components/icons/Chevron'
import {
  type Props as IcoProps,
  type Props as SVGIconProps,
} from '#/components/icons/common'
import {ListSparkle_Stroke2_Corner0_Rounded as ListSparkle} from '#/components/icons/ListSparkle'
import {UserCircle_Stroke2_Corner0_Rounded as Person} from '#/components/icons/UserCircle'
import {boostInterests} from '#/components/InterestTabs'
import {Loader} from '#/components/Loader'
import * as ProfileCard from '#/components/ProfileCard'
import {SubtleHover} from '#/components/SubtleHover'
import {Text} from '#/components/Typography'
import {type Metrics, useAnalytics} from '#/analytics'
import {ExploreScreenLiveEventFeedsBanner} from '#/features/liveEvents/components/ExploreScreenLiveEventFeedsBanner'
import * as ModuleHeader from './components/ModuleHeader'
import {
  SuggestedAccountsTabBar,
  SuggestedProfileCard,
} from './modules/ExploreSuggestedAccounts'

function LoadMore({item}: {item: ExploreScreenItems & {type: 'loadMore'}}) {
  const t = useTheme()
  const {t: l} = useLingui()

  const handleOnPress = () => {
    void item.onLoadMore()
  }

  return (
    <Button
      label={l`Load more`}
      onPress={handleOnPress}
      style={[a.relative, a.w_full]}>
      {({hovered, pressed}) => (
        <>
          <SubtleHover hover={hovered || pressed} />
          <View
            style={[
              a.flex_1,
              a.flex_row,
              a.align_center,
              a.justify_center,
              a.px_lg,
              a.py_md,
              a.gap_sm,
            ]}>
            <Text style={[a.leading_snug]}>{item.message}</Text>
            {item.isLoadingMore ? (
              <Loader size="sm" />
            ) : (
              <ChevronDownIcon size="sm" style={t.atoms.text_contrast_medium} />
            )}
          </View>
        </>
      )}
    </Button>
  )
}

type ExploreScreenItems =
  | {
      type: 'topBorder'
      key: string
    }
  | {
      type: 'header'
      key: string
      title: string
      icon: React.ComponentType<SVGIconProps>
      iconSize?: IcoProps['size']
      bottomBorder?: boolean
      searchButton?: {
        label: string
        metricsTag: Metrics['explore:module:searchButtonPress']['module']
        tab: 'user' | 'profile' | 'feed'
      }
    }
  | {
      type: 'tabbedHeader'
      key: string
      title: string
      icon: React.ComponentType<SVGIconProps>
      iconSize?: IcoProps['size']
      searchButton?: {
        label: string
        metricsTag: Metrics['explore:module:searchButtonPress']['module']
        tab: 'user' | 'profile' | 'feed'
      }
      hideDefaultTab?: boolean
    }
  | {
      type: 'trendingVideos'
      key: string
    }
  | {
      type: 'profile'
      key: string
      profile: AppBskyActorDefs.ProfileView
      recId?: string
    }
  | {
      type: 'profileEmpty'
      key: 'profileEmpty'
    }
  | {
      type: 'feed'
      key: string
      feed: AppBskyFeedDefs.GeneratorView
    }
  | {
      type: 'loadMore'
      key: string
      message: string
      isLoadingMore: boolean
      onLoadMore: () => void | Promise<void>
    }
  | {
      type: 'profilePlaceholder'
      key: string
    }
  | {
      type: 'feedPlaceholder'
      key: string
    }
  | {
      type: 'error'
      key: string
      message: string
      error: string
    }
  | {
      type: 'interests-card'
      key: 'interests-card'
    }
  | {
      type: 'liveEventFeedsBanner'
      key: string
    }

export function Explore({
  focusSearchInput,
}: {
  focusSearchInput: (tab: 'user' | 'profile' | 'feed') => void
  headerHeight: number
}) {
  const ax = useAnalytics()
  const {t: l} = useLingui()
  const t = useTheme()
  const {data: preferences, error: preferencesError} = usePreferencesQuery()
  const moderationOpts = useModerationOpts()
  const [selectedInterest, setSelectedInterest] = useState<string | null>(null)

  /*
   * Begin special language handling
   */
  const {contentLanguages} = useLanguagePrefs()
  const useFullExperience = useMemo(() => {
    if (contentLanguages.length === 0) return true
    return bcp47Match.basicFilter('en', contentLanguages).length > 0
  }, [contentLanguages])
  const personalizedInterests = preferences?.interests?.tags
  const interestsDisplayNames = useInterestsDisplayNames()
  const interests = Object.keys(interestsDisplayNames)
    .sort(boostInterests(popularInterests))
    .sort(boostInterests(personalizedInterests))
  const {
    data: suggestedUsers,
    isLoading: suggestedUsersIsLoading,
    error: suggestedUsersError,
    isRefetching: suggestedUsersIsRefetching,
  } = useGetSuggestedUsersForExploreQuery({
    category: selectedInterest || (useFullExperience ? null : interests[0]),
  })
  /* End special language handling */

  const {
    data: feeds,
    hasNextPage: hasNextFeedsPage,
    isLoading: isLoadingFeeds,
    isFetchingNextPage: isFetchingNextFeedsPage,
    error: feedsError,
    fetchNextPage: fetchNextFeedsPage,
  } = useGetPopularFeedsQuery({limit: 10, enabled: useFullExperience})
  const interestsNux = useNux(Nux.ExploreInterestsCard)
  const showInterestsNux =
    interestsNux.status === 'ready' && !interestsNux.nux?.completed

  const isLoadingMoreFeeds = isFetchingNextFeedsPage && !isLoadingFeeds
  const [hasPressedLoadMoreFeeds, setHasPressedLoadMoreFeeds] = useState(false)
  const onLoadMoreFeeds = useCallback(async () => {
    if (isFetchingNextFeedsPage || !hasNextFeedsPage || feedsError) return
    if (!hasPressedLoadMoreFeeds) {
      setHasPressedLoadMoreFeeds(true)
      return
    }
    try {
      await fetchNextFeedsPage()
    } catch (err) {
      ax.logger.error('Failed to load more suggested follows', {message: err})
    }
  }, [
    ax,
    isFetchingNextFeedsPage,
    hasNextFeedsPage,
    feedsError,
    fetchNextFeedsPage,
    hasPressedLoadMoreFeeds,
  ])

  const {data: suggestedFeeds, error: suggestedFeedsError} =
    useGetSuggestedFeedsQuery({
      enabled: useFullExperience,
    })

  const qc = useQueryClient()
  const [isPTR, setIsPTR] = useState(false)
  const onPTR = useCallback(async () => {
    setIsPTR(true)
    await Promise.all([
      qc.resetQueries({
        queryKey: createGetTrendsQueryKey(),
      }),
      qc.resetQueries({
        queryKey: [getSuggestedUsersForExploreQueryKeyRoot],
      }),
      qc.resetQueries({
        queryKey: [useActorSearchQueryKeyRoot],
      }),
      qc.resetQueries({
        queryKey: createGetSuggestedFeedsQueryKey(),
      }),
    ])
    setIsPTR(false)
  }, [qc, setIsPTR])

  const topBorder = useMemo(
    () =>
      ({
        type: 'topBorder',
        key: 'top-border',
      }) as const,
    [],
  )
  const suggestedFollowsModule = useMemo(() => {
    const i: ExploreScreenItems[] = []
    i.push({
      type: 'tabbedHeader',
      key: 'suggested-accounts-header',
      title: l`Suggested accounts`,
      icon: Person,
      iconSize: 'md',
      searchButton: {
        label: l`Search for more accounts`,
        metricsTag: 'suggestedAccounts',
        tab: 'user',
      },
      hideDefaultTab: !useFullExperience,
    })

    if (suggestedUsersIsLoading || suggestedUsersIsRefetching) {
      i.push({type: 'profilePlaceholder', key: 'profilePlaceholder'})
    } else if (suggestedUsersError) {
      i.push({
        type: 'error',
        key: 'suggestedUsersError',
        message: l`Failed to load suggested follows`,
        error: cleanError(suggestedUsersError),
      })
    } else {
      if (suggestedUsers !== undefined) {
        if (suggestedUsers.actors.length > 0 && moderationOpts) {
          // Currently the responses contain duplicate items.
          // Needs to be fixed on backend, but let's dedupe to be safe.
          let seen = new Set()
          const profileItems: ExploreScreenItems[] = []
          for (const actor of suggestedUsers.actors) {
            // checking for following still necessary if search data is used
            if (!seen.has(actor.did) && !actor.viewer?.following) {
              seen.add(actor.did)
              profileItems.push({
                type: 'profile',
                key: actor.did,
                profile: actor,
                recId: suggestedUsers.recId,
              })
            }
          }

          if (profileItems.length === 0) {
            i.push({
              type: 'profileEmpty',
              key: 'profileEmpty',
            })
          } else {
            if (selectedInterest === null && useFullExperience) {
              // First "For You" tab, only show 5 to keep screen short
              i.push(...profileItems.slice(0, 5))
            } else {
              i.push(...profileItems)
            }
          }
        } else {
          i.push({
            type: 'profileEmpty',
            key: 'profileEmpty',
          })
        }
      } else {
        i.push({type: 'profilePlaceholder', key: 'profilePlaceholder'})
      }
    }
    return i
  }, [
    l,
    moderationOpts,
    suggestedUsers,
    suggestedUsersIsLoading,
    suggestedUsersIsRefetching,
    suggestedUsersError,
    selectedInterest,
    useFullExperience,
  ])
  const suggestedFeedsModule = useMemo(() => {
    const i: ExploreScreenItems[] = []
    i.push({
      type: 'header',
      key: 'suggested-feeds-header',
      title: l`Discover feeds`,
      icon: ListSparkle,
      iconSize: 'md',
      searchButton: {
        label: l`Search for more feeds`,
        metricsTag: 'suggestedFeeds',
        tab: 'feed',
      },
    })

    if (useFullExperience) {
      if (suggestedFeeds && preferences) {
        let seen = new Set()
        const feedItems: ExploreScreenItems[] = []
        for (const feed of suggestedFeeds.feeds) {
          if (!seen.has(feed.uri)) {
            seen.add(feed.uri)
            feedItems.push({
              type: 'feed',
              key: feed.uri,
              feed,
            })
          }
        }

        // feeds errors can occur during pagination, so feeds is truthy
        if (suggestedFeedsError) {
          i.push({
            type: 'error',
            key: 'suggestedFeedsError',
            message: l`Failed to load suggested feeds`,
            error: cleanError(suggestedFeedsError),
          })
        } else if (preferencesError) {
          i.push({
            type: 'error',
            key: 'preferencesError',
            message: l`Failed to load feeds preferences`,
            error: cleanError(preferencesError),
          })
        } else {
          if (feedItems.length === 0) {
            i.pop()
          } else {
            // This query doesn't follow the limit very well, so the first press of the
            // load more button just unslices the array back to ~10 items
            if (!hasPressedLoadMoreFeeds) {
              i.push(...feedItems.slice(0, 6))
            } else {
              i.push(...feedItems)
            }

            for (const [index, item] of feedItems.entries()) {
              if (item.type !== 'feed') {
                continue
              }
              // don't log the ones we've already sent
              if (hasPressedLoadMoreFeeds && index < 6) {
                continue
              }
              ax.metric('feed:suggestion:seen', {feedUrl: item.feed.uri})
            }
          }
          if (!hasPressedLoadMoreFeeds) {
            i.push({
              type: 'loadMore',
              key: 'loadMoreFeeds',
              message: l`Load more suggested feeds`,
              isLoadingMore: isLoadingMoreFeeds,
              onLoadMore: onLoadMoreFeeds,
            })
          }
        }
      } else {
        if (feedsError) {
          i.push({
            type: 'error',
            key: 'feedsError',
            message: l`Failed to load feeds`,
            error: cleanError(feedsError),
          })
        } else if (suggestedFeedsError) {
          i.push({
            type: 'error',
            key: 'suggestedFeedsError',
            message: l`Failed to load suggested feeds`,
            error: cleanError(suggestedFeedsError),
          })
        } else if (preferencesError) {
          i.push({
            type: 'error',
            key: 'preferencesError',
            message: l`Failed to load feeds preferences`,
            error: cleanError(preferencesError),
          })
        } else {
          i.push({type: 'feedPlaceholder', key: 'feedPlaceholder'})
        }
      }
    } else {
      if (feeds && preferences) {
        // Currently the responses contain duplicate items.
        // Needs to be fixed on backend, but let's dedupe to be safe.
        let seen = new Set()
        const feedItems: ExploreScreenItems[] = []
        for (const page of feeds.pages) {
          for (const feed of page.feeds) {
            if (!seen.has(feed.uri)) {
              seen.add(feed.uri)
              feedItems.push({
                type: 'feed',
                key: feed.uri,
                feed,
              })
            }
          }
        }

        // feeds errors can occur during pagination, so feeds is truthy
        if (feedsError) {
          i.push({
            type: 'error',
            key: 'feedsError',
            message: l`Failed to load feeds`,
            error: cleanError(feedsError),
          })
        } else if (suggestedFeedsError) {
          i.push({
            type: 'error',
            key: 'suggestedFeedsError',
            message: l`Failed to load suggested feeds`,
            error: cleanError(suggestedFeedsError),
          })
        } else if (preferencesError) {
          i.push({
            type: 'error',
            key: 'preferencesError',
            message: l`Failed to load feeds preferences`,
            error: cleanError(preferencesError),
          })
        } else {
          if (feedItems.length === 0) {
            if (!hasNextFeedsPage) {
              i.pop()
            }
          } else {
            // This query doesn't follow the limit very well, so the first press of the
            // load more button just unslices the array back to ~10 items
            if (!hasPressedLoadMoreFeeds) {
              i.push(...feedItems.slice(0, 3))
            } else {
              i.push(...feedItems)
            }
          }
          if (hasNextFeedsPage) {
            i.push({
              type: 'loadMore',
              key: 'loadMoreFeeds',
              message: l`Load more suggested feeds`,
              isLoadingMore: isLoadingMoreFeeds,
              onLoadMore: onLoadMoreFeeds,
            })
          }
        }
      } else {
        if (feedsError) {
          i.push({
            type: 'error',
            key: 'feedsError',
            message: l`Failed to load feeds`,
            error: cleanError(feedsError),
          })
        } else if (suggestedFeedsError) {
          i.push({
            type: 'error',
            key: 'feedsError',
            message: l`Failed to load suggested feeds`,
            error: cleanError(suggestedFeedsError),
          })
        } else if (preferencesError) {
          i.push({
            type: 'error',
            key: 'preferencesError',
            message: l`Failed to load feeds preferences`,
            error: cleanError(preferencesError),
          })
        } else {
          i.push({type: 'feedPlaceholder', key: 'feedPlaceholder'})
        }
      }
    }
    return i
  }, [
    l,
    ax,
    useFullExperience,
    suggestedFeeds,
    preferences,
    suggestedFeedsError,
    preferencesError,
    feedsError,
    hasNextFeedsPage,
    hasPressedLoadMoreFeeds,
    isLoadingMoreFeeds,
    onLoadMoreFeeds,
    feeds,
  ])

  const interestsNuxModule = useMemo<ExploreScreenItems[]>(() => {
    if (!showInterestsNux) return []
    return [
      {
        type: 'interests-card',
        key: 'interests-card',
      },
    ]
  }, [showInterestsNux])

  const items = useMemo<ExploreScreenItems[]>(() => {
    const i: ExploreScreenItems[] = []

    // Dynamic module ordering

    i.push(topBorder)
    i.push(...interestsNuxModule)

    i.push({type: 'liveEventFeedsBanner', key: 'liveEventFeedsBanner'})

    if (useFullExperience) {
      i.push(...suggestedFeedsModule)
      i.push(...suggestedFollowsModule)
    } else {
      i.push(...suggestedFollowsModule)
    }

    return i
  }, [
    topBorder,
    suggestedFollowsModule,
    suggestedFeedsModule,
    interestsNuxModule,
    useFullExperience,
  ])

  const renderItem = useCallback(
    ({item, index}: {item: ExploreScreenItems; index: number}) => {
      switch (item.type) {
        case 'topBorder':
          return (
            <View style={[a.w_full, t.atoms.border_contrast_low, a.border_t]} />
          )
        case 'header': {
          return (
            <ModuleHeader.Container bottomBorder={item.bottomBorder}>
              <ModuleHeader.Icon icon={item.icon} size={item.iconSize} />
              <ModuleHeader.TitleText>{item.title}</ModuleHeader.TitleText>
              {item.searchButton && (
                <ModuleHeader.SearchButton
                  {...item.searchButton}
                  onPress={() =>
                    focusSearchInput(item.searchButton?.tab || 'user')
                  }
                />
              )}
            </ModuleHeader.Container>
          )
        }
        case 'tabbedHeader': {
          return (
            <View style={[a.pb_md]}>
              <ModuleHeader.Container style={[a.pb_xs]}>
                <ModuleHeader.Icon icon={item.icon} size={item.iconSize} />
                <ModuleHeader.TitleText>{item.title}</ModuleHeader.TitleText>
                {item.searchButton && (
                  <ModuleHeader.SearchButton
                    {...item.searchButton}
                    onPress={() =>
                      focusSearchInput(item.searchButton?.tab || 'user')
                    }
                  />
                )}
              </ModuleHeader.Container>
              <SuggestedAccountsTabBar
                selectedInterest={selectedInterest}
                onSelectInterest={setSelectedInterest}
                hideDefaultTab={item.hideDefaultTab}
              />
            </View>
          )
        }
        case 'trendingVideos': {
          return <ExploreTrendingVideos />
        }
        case 'profile': {
          return (
            <SuggestedProfileCard
              profile={item.profile}
              moderationOpts={moderationOpts!}
              recId={item.recId}
              position={index}
            />
          )
        }
        case 'profileEmpty': {
          return (
            <View style={[a.px_lg, a.pb_lg]}>
              <Admonition>
                {selectedInterest ? (
                  <Trans>
                    No results for "{interestsDisplayNames[selectedInterest]}".
                  </Trans>
                ) : (
                  <Trans>No results.</Trans>
                )}
              </Admonition>
            </View>
          )
        }
        case 'feed': {
          return (
            <View
              style={[
                a.border_t,
                t.atoms.border_contrast_low,
                a.px_lg,
                a.py_lg,
              ]}>
              <FeedCard.Default
                view={item.feed}
                onPress={() => {
                  if (!useFullExperience) {
                    return
                  }
                  ax.metric('feed:suggestion:press', {
                    feedUrl: item.feed.uri,
                  })
                }}
              />
            </View>
          )
        }
        case 'loadMore': {
          return (
            <View style={[a.border_t, t.atoms.border_contrast_low]}>
              <LoadMore item={item} />
            </View>
          )
        }
        case 'profilePlaceholder': {
          return (
            <>
              {Array.from({length: 3}).map((__, i) => (
                <View
                  style={[
                    a.px_lg,
                    a.py_lg,
                    a.border_t,
                    t.atoms.border_contrast_low,
                  ]}
                  key={i}>
                  <ProfileCard.Outer>
                    <ProfileCard.Header>
                      <ProfileCard.AvatarPlaceholder />
                      <ProfileCard.NameAndHandlePlaceholder />
                    </ProfileCard.Header>
                    <ProfileCard.DescriptionPlaceholder numberOfLines={2} />
                  </ProfileCard.Outer>
                </View>
              ))}
            </>
          )
        }
        case 'feedPlaceholder': {
          return <FeedFeedLoadingPlaceholder />
        }
        case 'error':
        case 'interests-card': {
          return <ExploreInterestsCard />
        }
        case 'liveEventFeedsBanner': {
          return <ExploreScreenLiveEventFeedsBanner />
        }
      }
    },
    [
      ax,
      t.atoms.border_contrast_low,
      focusSearchInput,
      selectedInterest,
      moderationOpts,
      interestsDisplayNames,
      useFullExperience,
    ],
  )

  const stickyHeaderIndices = useMemo(
    () =>
      items.reduce(
        (acc, curr) =>
          ['topBorder', 'preview:header'].includes(curr.type)
            ? acc.concat(items.indexOf(curr))
            : acc,
        [] as number[],
      ),
    [items],
  )

  // track headers and report module viewability
  const alreadyReportedRef = useRef<Map<string, string>>(new Map())
  const seenProfilesRef = useRef<Set<string>>(new Set())
  const onItemSeen = useCallback(
    (item: ExploreScreenItems) => {
      let module: Metrics['explore:module:seen']['module']
      if (item.type === 'trendingVideos') {
        module = item.type
      } else if (item.type === 'profile') {
        module = 'suggestedAccounts'
        // Track individual profile seen events
        if (!seenProfilesRef.current.has(item.profile.did)) {
          seenProfilesRef.current.add(item.profile.did)
          const position = suggestedFollowsModule.findIndex(
            i => i.type === 'profile' && i.profile.did === item.profile.did,
          )
          ax.metric('suggestedUser:seen', {
            logContext: 'Explore',
            recId: item.recId,
            position: position !== -1 ? position - 1 : 0, // -1 to account for header
            suggestedDid: item.profile.did,
            category: null,
          })
        }
      } else if (item.type === 'feed') {
        module = 'suggestedFeeds'
      } else {
        return
      }
      if (!alreadyReportedRef.current.has(module)) {
        alreadyReportedRef.current.set(module, module)
        ax.metric('explore:module:seen', {module})
      }
    },
    [ax, suggestedFollowsModule],
  )

  const handleOnRefresh = () => {
    void onPTR()
  }

  return (
    <List
      data={items}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      desktopFixedHeight
      contentContainerStyle={{paddingBottom: 100}}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      stickyHeaderIndices={native(stickyHeaderIndices)}
      viewabilityConfig={viewabilityConfig}
      onItemSeen={onItemSeen}
      /**
       * Default: 2
       */
      onEndReachedThreshold={4}
      /**
       * Default: 10
       */
      initialNumToRender={10}
      /**
       * Default: 21
       */
      windowSize={platform({android: 11})}
      /**
       * Default: 10
       *
       * NOTE: This was 1 on Android. Unfortunately this leads to the list totally freaking out
       * when the sticky headers changed. I made a minimal reproduction and yeah, it's this prop.
       * Totally fine when the sticky headers are static, but when they're dynamic, it's a mess.
       *
       * Repro: https://github.com/mozzius/stickyindices-repro
       *
       * I then found doubling this prop on iOS also reduced it freaking out there as well.
       *
       * Trades off seeing more blank space due to it having to render more items before it can show anything.
       * -sfn
       */
      maxToRenderPerBatch={platform({android: 10, ios: 20})}
      /**
       * Default: 50
       *
       * NOTE: This was 25 on Android. However, due to maxToRenderPerBatch being set to 10,
       * the lower batching period is no longer necessary (?)
       */
      updateCellsBatchingPeriod={50}
      refreshing={isPTR}
      onRefresh={handleOnRefresh}
    />
  )
}

function keyExtractor(item: ExploreScreenItems) {
  return item.key
}

const viewabilityConfig: ViewabilityConfig = {
  itemVisiblePercentThreshold: 100,
}
