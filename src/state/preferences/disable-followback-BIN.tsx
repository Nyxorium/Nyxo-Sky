import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['disableFollowbackBIN']
type SetContext = (v: persisted.Schema['disableFollowbackBIN']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.disableFollowbackBIN,
)
stateContext.displayName = 'DisableFollowbackBINStateContext'
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['disableFollowbackBIN']) => {},
)
setContext.displayName = 'DisableFollowbackBINSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('disableFollowbackBIN'))

  const setStateWrapped = React.useCallback(
    (hasDisableFollowbackBIN: persisted.Schema['disableFollowbackBIN']) => {
      setState(hasDisableFollowbackBIN)
      persisted.write('disableFollowbackBIN', hasDisableFollowbackBIN)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableFollowbackBIN', nextUseDisableFollowbackBIN => {
      setState(nextUseDisableFollowbackBIN) 
    })
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
  return React.useContext(stateContext)
}

export function useSetDisableFollowbackBIN() {
  return React.useContext(setContext)
}
