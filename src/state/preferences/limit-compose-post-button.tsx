import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['limitComposePostButton']
type SetContext = (v: persisted.Schema['limitComposePostButton']) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.limitComposePostButton,
)
stateContext.displayName = 'LimitComposePostButtonStateContext'
const setContext = React.createContext<SetContext>(
  (_: persisted.Schema['limitComposePostButton']) => {},
)
setContext.displayName = 'LimitComposePostButtonSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState(persisted.get('limitComposePostButton'))

  const setStateWrapped = React.useCallback(
    (hasLimitComposePostButton: persisted.Schema['limitComposePostButton']) => {
      setState(hasLimitComposePostButton)
      persisted.write('limitComposePostButton', hasLimitComposePostButton)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('limitComposePostButton', nextUseLimitComposePostButton => {
      setState(nextUseLimitComposePostButton)
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

export function useLimitComposePostButton() {
  return React.useContext(stateContext)
}

export function useSetLimitComposePostButton() {
  return React.useContext(setContext)
}
