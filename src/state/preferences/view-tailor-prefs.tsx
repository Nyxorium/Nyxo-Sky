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
}>

type StateContext = {
  tailors: ViewTailorPrefs
}
type SetContext = (tailor: keyof ViewTailorPrefs, value: boolean) => void

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
    (tailor: keyof ViewTailorPrefs, value: boolean) => {
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
