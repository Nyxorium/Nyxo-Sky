import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

type StateContext = persisted.Schema['limitComposePostButton']
type SetContext = (v: persisted.Schema['limitComposePostButton']) => void

const stateContext = createContext<StateContext>(
  persisted.defaults.limitComposePostButton,
)
stateContext.displayName = 'LimitComposePostButtonStateContext'
const setContext = createContext<SetContext>(
  (_: persisted.Schema['limitComposePostButton']) => {},
)
setContext.displayName = 'LimitComposePostButtonSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = useState(persisted.get('limitComposePostButton'))

  const setStateWrapped = useCallback(
    (hasLimitComposePostButton: persisted.Schema['limitComposePostButton']) => {
      setState(hasLimitComposePostButton)
      persisted.write('limitComposePostButton', hasLimitComposePostButton)
    },
    [setState],
  )

  useEffect(() => {
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
  return useContext(stateContext)
}

export function useSetLimitComposePostButton() {
  return useContext(setContext)
}
