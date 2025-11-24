import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.enableShareViaDID),
)
stateContext.displayName = 'EnableShareViaDIDStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'EnableShareViaDIDSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('enableShareViaDID')),
  )

  const setStateWrapped = React.useCallback(
    (enableShareViaDID: persisted.Schema['enableShareViaDID']) => {
      setState(Boolean(enableShareViaDID))
      persisted.write('enableShareViaDID', enableShareViaDID)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'enableShareViaDID',
      nextEnableShareViaDID => {
        setState(Boolean(nextEnableShareViaDID))
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

export const useEnableShareViaDID = () => React.useContext(stateContext)
export const useSetEnableShareViaDID = () => React.useContext(setContext)