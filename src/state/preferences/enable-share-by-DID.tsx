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
  Boolean(persisted.defaults.enableShareViaDID),
)
stateContext.displayName = 'EnableShareViaDIDStateContext'
const setContext = createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'EnableShareViaDIDSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState(
    Boolean(persisted.get('enableShareViaDID')),
  )

  const setStateWrapped = useCallback(
    (enableShareViaDID: persisted.Schema['enableShareViaDID']) => {
      setState(Boolean(enableShareViaDID))
      persisted.write('enableShareViaDID', enableShareViaDID)
    },
    [setState],
  )

  useEffect(() => {
    return persisted.onUpdate('enableShareViaDID', nextEnableShareViaDID => {
      setState(Boolean(nextEnableShareViaDID))
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

export const useEnableShareViaDID = () => useContext(stateContext)
export const useSetEnableShareViaDID = () => useContext(setContext)
