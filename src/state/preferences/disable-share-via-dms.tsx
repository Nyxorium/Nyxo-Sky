import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = createContext<StateContext>(
  Boolean(persisted.defaults.disableShareViaDms),
)
stateContext.displayName = 'DisableShareViaDmsStateContext'
const setContext = createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'DisableShareViaDmsSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState(
    Boolean(persisted.get('disableShareViaDms')),
  )

  const setStateWrapped = useCallback(
    (disableShareViaDms: persisted.Schema['disableShareViaDms']) => {
      setState(Boolean(disableShareViaDms))
      persisted.write('disableShareViaDms', disableShareViaDms)
    },
    [setState],
  )

  useEffect(() => {
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

export const useDisableShareViaDms = () => useContext(stateContext)
export const useSetDisableShareViaDms = () => useContext(setContext)