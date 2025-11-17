import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['altLabelDisplayProfile']
type SetContext = (v: persisted.Schema['altLabelDisplayProfile']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.altLabelDisplayProfile,
)
stateContext.displayName = 'AltLabelDisplayProfileStateContext'
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['altLabelDisplayProfile']) => {},
)
setContext.displayName = 'AltLabelDisplayProfileSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('altLabelDisplayProfile'))

  const setStateWrapped = React.useCallback(
    (hasAltLabelDisplayProfile: persisted.Schema['altLabelDisplayProfile']) => {
      setState(hasAltLabelDisplayProfile)
      persisted.write('altLabelDisplayProfile', hasAltLabelDisplayProfile)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('altLabelDisplayProfile', nextUseAltLabelDisplayProfile => {
      setState(nextUseAltLabelDisplayProfile) 
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

export function useAltLabelDisplayProfile() {
  return React.useContext(stateContext)
}

export function useSetAltLabelDisplayProfile() {
  return React.useContext(setContext)
}
