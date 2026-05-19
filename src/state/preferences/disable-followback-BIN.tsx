import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['disableFollowbackBIN']
type SetContext = (v: persisted.Schema['disableFollowbackBIN']) => void

const stateContext = createContext<StateContext>(
  persisted.defaults.disableFollowbackBIN,
)
stateContext.displayName = 'DisableFollowbackBINStateContext'
const setContext = createContext<SetContext>(
  (_: persisted.Schema['disableFollowbackBIN']) => {},
)
setContext.displayName = 'DisableFollowbackBINSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = useState(persisted.get('disableFollowbackBIN'))

  const setStateWrapped = useCallback(
    (hasDisableFollowbackBIN: persisted.Schema['disableFollowbackBIN']) => {
      setState(hasDisableFollowbackBIN)
      persisted.write('disableFollowbackBIN', hasDisableFollowbackBIN)
    },
    [setState],
  )

  useEffect(() => {
    return persisted.onUpdate(
      'disableFollowbackBIN',
      nextUseDisableFollowbackBIN => {
        setState(nextUseDisableFollowbackBIN)
      },
    )
  }, [setStateWrapped])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useDisableFollowbackBIN() {
  return useContext(stateContext)
}

export function useSetDisableFollowbackBIN() {
  return useContext(setContext)
}
