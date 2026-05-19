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
  Boolean(persisted.defaults.disableFeedPromoTab),
)
stateContext.displayName = 'DisableFeedPromoTabStateContext'
const setContext = createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'DisableFeedPromoTabSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState(
    Boolean(persisted.get('disableFeedPromoTab')),
  )

  const setStateWrapped = useCallback(
    (disableFeedPromoTab: persisted.Schema['disableFeedPromoTab']) => {
      setState(Boolean(disableFeedPromoTab))
      persisted.write('disableFeedPromoTab', disableFeedPromoTab)
    },
    [setState],
  )

  useEffect(() => {
    return persisted.onUpdate(
      'disableFeedPromoTab',
      nextDisableFeedPromoTab => {
        setState(Boolean(nextDisableFeedPromoTab))
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

export const useDisableFeedPromoTab = () => useContext(stateContext)
export const useSetDisableFeedPromoTab = () => useContext(setContext)
