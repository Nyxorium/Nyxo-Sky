import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.disableShareViaDms),
)
stateContext.displayName = 'DisableShareViaDmsStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'DisableShareViaDmsSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('disableShareViaDms')),
  )

  const setStateWrapped = React.useCallback(
    (disableShareViaDms: persisted.Schema['disableShareViaDms']) => {
      setState(Boolean(disableShareViaDms))
      persisted.write('disableShareViaDms', disableShareViaDms)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'disableShareViaDms',
      nextDisableShareViaDms => {
        setState(Boolean(nextDisableShareViaDms))
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

export const useDisableShareViaDms = () => React.useContext(stateContext)
export const useSetDisableShareViaDms = () => React.useContext(setContext)