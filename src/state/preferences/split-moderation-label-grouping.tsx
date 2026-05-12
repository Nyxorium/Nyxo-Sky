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
  Boolean(persisted.defaults.splitModerationLabelGrouping),
)
stateContext.displayName = 'SplitModerationLabelGroupingStateContext'
const setContext = createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'SplitModerationLabelGroupingSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState(
    Boolean(persisted.get('splitModerationLabelGrouping')),
  )

  const setStateWrapped = useCallback(
    (splitModerationLabelGrouping: persisted.Schema['splitModerationLabelGrouping']) => {
      setState(Boolean(splitModerationLabelGrouping))
      persisted.write('splitModerationLabelGrouping', splitModerationLabelGrouping)
    },
    [setState],
  )

  useEffect(() => {
    return persisted.onUpdate(
      'splitModerationLabelGrouping',
      nextSplitModerationLabelGrouping => {
        setState(Boolean(nextSplitModerationLabelGrouping))
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

export const useSplitModerationLabelGrouping = () => useContext(stateContext)
export const useSetSplitModerationLabelGrouping = () => useContext(setContext)