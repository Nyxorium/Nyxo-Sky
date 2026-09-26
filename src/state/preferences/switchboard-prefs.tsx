import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

export type SwitchboardPrefs = Partial<{
  shareByDID: boolean
  labelerLimitBypass: boolean
  labelGrouping: boolean
}>

type StateContext = {
  switches: SwitchboardPrefs
}
type SetContext = (toggle: keyof SwitchboardPrefs, value: boolean) => void

const stateContext = createContext<StateContext>({
  switches: persisted.defaults.switchboard ?? {},
})
stateContext.displayName = 'SwitchboardPrefsStateContext'

const setContext = createContext<SetContext>(() => {})
setContext.displayName = 'SwitchboardPrefsSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [switches, setSwitches] = useState<SwitchboardPrefs>(() => ({
    ...persisted.defaults.switchboard,
    ...persisted.get('switchboard'),
  }))

  const setSwitchesWrapped = useCallback(
    (toggle: keyof SwitchboardPrefs, value: boolean) => {
      setSwitches(prev => {
        const next = {...prev, [toggle]: value}
        void persisted.write('switchboard', next)
        return next
      })
    },
    [],
  )

  useEffect(() => {
    const unsub1 = persisted.onUpdate('switchboard', next => {
      setSwitches({...persisted.defaults.switchboard, ...next})
    })
    return () => {
      unsub1()
    }
  }, [])

  return (
    <stateContext.Provider value={{switches}}>
      <setContext.Provider value={setSwitchesWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useSwitchboardPrefs() {
  return useContext(stateContext)
}

export function useSetSwitchboardPref() {
  return useContext(setContext)
}
