import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

export type ProfileTabVisibilityPrefs = Partial<{
  posts: boolean
  replies: boolean
  media: boolean
  videos: boolean
  feeds: boolean
  starterPacks: boolean
  lists: boolean
}>

export type ProfileTabVisibilitySelfPrefs = Partial<{
  posts: boolean
  replies: boolean
  media: boolean
  videos: boolean
  likes: boolean
  feeds: boolean
  starterPacks: boolean
  lists: boolean
}>

type StateContext = {
  otherTabs: ProfileTabVisibilityPrefs
  ownTabs: ProfileTabVisibilitySelfPrefs
}
type SetContext = {
  setOtherTabs: (tab: keyof ProfileTabVisibilityPrefs, value: boolean) => void
  setOwnTabs: (tab: keyof ProfileTabVisibilitySelfPrefs, value: boolean) => void
}

const stateContext = createContext<StateContext>({
  otherTabs: persisted.defaults.profileTabVisibility ?? {},
  ownTabs: persisted.defaults.profileTabVisibility_self ?? {},
})
stateContext.displayName = 'ProfileTabVisibilityStateContext'

const setContext = createContext<SetContext>({
  setOtherTabs: () => {},
  setOwnTabs: () => {},
})
setContext.displayName = 'ProfileTabVisibilitySetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [otherTabs, setOtherTabs] = useState<ProfileTabVisibilityPrefs>(
    () => persisted.get('profileTabVisibility') ?? {},
  )
  const [ownTabs, setOwnTabs] = useState<ProfileTabVisibilitySelfPrefs>(
    () => persisted.get('profileTabVisibility_self') ?? {},
  )

  const setOtherTabsWrapped = useCallback(
    (tab: keyof ProfileTabVisibilityPrefs, value: boolean) => {
      setOtherTabs(prev => {
        const next = {...prev, [tab]: value}
        persisted.write('profileTabVisibility', next)
        return next
      })
    },
    [],
  )

  const setOwnTabsWrapped = useCallback(
    (tab: keyof ProfileTabVisibilitySelfPrefs, value: boolean) => {
      setOwnTabs(prev => {
        const next = {...prev, [tab]: value}
        persisted.write('profileTabVisibility_self', next)
        return next
      })
    },
    [],
  )

  useEffect(() => {
    const unsub1 = persisted.onUpdate('profileTabVisibility', next => {
      setOtherTabs(next ?? {})
    })
    const unsub2 = persisted.onUpdate('profileTabVisibility_self', next => {
      setOwnTabs(next ?? {})
    })
    return () => {
      unsub1()
      unsub2()
    }
  }, [])

  return (
    <stateContext.Provider value={{otherTabs, ownTabs}}>
      <setContext.Provider
        value={{
          setOtherTabs: setOtherTabsWrapped,
          setOwnTabs: setOwnTabsWrapped,
        }}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useProfileTabVisibilityPrefs() {
  return useContext(stateContext)
}

export function useSetProfileTabVisibilityPref() {
  return useContext(setContext)
}
