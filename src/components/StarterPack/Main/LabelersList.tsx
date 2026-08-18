import {forwardRef, useCallback, useImperativeHandle, useState} from 'react'
import {type ListRenderItemInfo, View} from 'react-native'
import {type ModerationOpts} from '@bsky/sdk/moderation'

import {useBottomBarOffset} from '#/lib/hooks/useBottomBarOffset'
import {useInitialNumToRender} from '#/lib/hooks/useInitialNumToRender'
import {List, type ListRef} from '#/view/com/util/List'
import {type SectionRef} from '#/screens/Profile/Sections/types'
import {atoms as a, useTheme} from '#/alf'
import {ListFooter, ListMaybePlaceholder} from '#/components/Lists'
import {Default as ProfileCard} from '#/components/ProfileCard'
import {IS_NATIVE, IS_WEB} from '#/env'
import {type app} from '#/lexicons'

function keyExtractor(item: app.bsky.actor.defs.ProfileView, index: number) {
  return `${item.did}-${index}`
}

interface LabelersListProps {
  profiles?: app.bsky.actor.defs.ProfileView[]
  isError: boolean
  refetch: () => Promise<unknown>
  moderationOpts: ModerationOpts
  headerHeight: number
  scrollElRef: ListRef
}

export const LabelersList = forwardRef<SectionRef, LabelersListProps>(
  function LabelersListImpl(
    {profiles, isError, refetch, moderationOpts, headerHeight, scrollElRef},
    ref,
  ) {
    const t = useTheme()
    const bottomBarOffset = useBottomBarOffset(headerHeight)
    const initialNumToRender = useInitialNumToRender()

    const [isPTRing, setIsPTRing] = useState(false)

    const onScrollToTop = useCallback(() => {
      scrollElRef.current?.scrollToOffset({
        animated: IS_NATIVE,
        offset: -headerHeight,
      })
    }, [scrollElRef, headerHeight])

    useImperativeHandle(ref, () => ({
      scrollToTop: onScrollToTop,
    }))

    const renderItem = ({
      item,
      index,
    }: ListRenderItemInfo<app.bsky.actor.defs.ProfileView>) => {
      return (
        <View
          style={[
            a.p_lg,
            t.atoms.border_contrast_low,
            (IS_WEB || index !== 0) && a.border_t,
          ]}>
          <ProfileCard
            profile={item}
            moderationOpts={moderationOpts}
            logContext="StarterPackProfilesList"
          />
        </View>
      )
    }

    if (!profiles) {
      return (
        <View
          style={[
            a.h_full_vh,
            {marginTop: headerHeight, marginBottom: bottomBarOffset},
          ]}>
          <ListMaybePlaceholder
            isLoading={true}
            isError={isError}
            onRetry={refetch}
          />
        </View>
      )
    }

    return (
      <List
        data={profiles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ref={scrollElRef}
        headerOffset={headerHeight}
        ListFooterComponent={
          <ListFooter
            style={{paddingBottom: bottomBarOffset, borderTopWidth: 0}}
          />
        }
        showsVerticalScrollIndicator={false}
        desktopFixedHeight
        initialNumToRender={initialNumToRender}
        refreshing={isPTRing}
        onRefresh={() => {
          setIsPTRing(true)
          void refetch().finally(() => setIsPTRing(false))
        }}
      />
    )
  },
)
