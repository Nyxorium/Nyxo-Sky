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
  Boolean(persisted.defaults.labelerLimitBypass),
)
stateContext.displayName = 'LabelerLimitBypassStateContext'
const setContext = createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'LabelerLimitBypassSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState(
    Boolean(persisted.get('labelerLimitBypass')),
  )

  const setStateWrapped = useCallback(
    (labelerLimitBypass: persisted.Schema['labelerLimitBypass']) => {
      setState(Boolean(labelerLimitBypass))
      void persisted.write('labelerLimitBypass', labelerLimitBypass)
    },
    [setState],
  )

  useEffect(() => {
    return persisted.onUpdate('labelerLimitBypass', nextLabelerLimitBypass => {
      setState(Boolean(nextLabelerLimitBypass))
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

export const useLabelerLimitBypass = () => useContext(stateContext)
export const useSetLabelerLimitBypass = () => useContext(setContext)
