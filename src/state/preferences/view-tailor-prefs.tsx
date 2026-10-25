import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

export type ViewTailorPrefs = Partial<{
  petLabels: boolean
  germButton: boolean
  followsYouPill: boolean
  similarAccountBox: boolean
  /** Native-only */
  newPostButton: boolean
  /** Native-only */
  shareViaChat: boolean
  /** Notifications page */
  notificationFollowButton: boolean
  profileDescriptions: boolean
  openInBluesky: boolean
  /** Avatar and Banner blurs in Warn/Hide labels */
  avatarBlurs: boolean
  trendingTopics: number
}>

type StateContext = {
  tailors: ViewTailorPrefs
}
type SetContext = <K extends keyof ViewTailorPrefs>(
  tailor: K,
  value: NonNullable<ViewTailorPrefs[K]>,
) => void

const stateContext = createContext<StateContext>({
  tailors: persisted.defaults.viewTailors ?? {},
})
stateContext.displayName = 'ViewTailorPrefsStateContext'

const setContext = createContext<SetContext>(() => {})
setContext.displayName = 'ViewTailorPrefsSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [tailors, setTailors] = useState<ViewTailorPrefs>(() => ({
    ...persisted.defaults.viewTailors,
    ...persisted.get('viewTailors'),
  }))

  const setTailorsWrapped = useCallback(
    <K extends keyof ViewTailorPrefs>(
      tailor: K,
      value: NonNullable<ViewTailorPrefs[K]>,
    ) => {
      setTailors(prev => {
        const next = {...prev, [tailor]: value}
        void persisted.write('viewTailors', next)
        return next
      })
    },
    [],
  )

  useEffect(() => {
    const unsub1 = persisted.onUpdate('viewTailors', next => {
      setTailors({...persisted.defaults.viewTailors, ...next})
    })
    return () => {
      unsub1()
    }
  }, [])

  return (
    <stateContext.Provider value={{tailors}}>
      <setContext.Provider value={setTailorsWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useViewTailorPrefs() {
  return useContext(stateContext)
}

export function useSetViewTailorPref() {
  return useContext(setContext)
}
