import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.disableProfileDescriptions),
)
stateContext.displayName = 'DisableProfileDescriptionsStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'DisableProfileDescriptionsSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('disableProfileDescriptions')),
  )

  const setStateWrapped = React.useCallback(
    (disableProfileDescriptions: persisted.Schema['disableProfileDescriptions']) => {
      setState(Boolean(disableProfileDescriptions))
      persisted.write('disableProfileDescriptions', disableProfileDescriptions)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'disableProfileDescriptions',
      nextDisableProfileDescriptions => {
        setState(Boolean(nextDisableProfileDescriptions))
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

export const useDisableProfileDescriptions = () => React.useContext(stateContext)
export const useSetDisableProfileDescriptions = () => React.useContext(setContext)