import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.enableSquareAvatars),
)
stateContext.displayName = 'EnableSquareAvatarsStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'EnableSquareAvatarsSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('enableSquareAvatars')),
  )

  const setStateWrapped = React.useCallback(
    (enableSquareAvatars: persisted.Schema['enableSquareAvatars']) => {
      setState(Boolean(enableSquareAvatars))
      persisted.write('enableSquareAvatars', enableSquareAvatars)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'enableSquareAvatars',
      nextEnableSquareAvatars => {
        setState(Boolean(nextEnableSquareAvatars))
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

export const useEnableSquareAvatars = () => React.useContext(stateContext)
export const useSetEnableSquareAvatars = () => React.useContext(setContext)