import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.disableFeedPromoTab),
)
stateContext.displayName = 'DisableFeedPromoTabStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'DisableFeedPromoTabSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('disableFeedPromoTab')),
  )

  const setStateWrapped = React.useCallback(
    (disableFeedPromoTab: persisted.Schema['disableFeedPromoTab']) => {
      setState(Boolean(disableFeedPromoTab))
      persisted.write('disableFeedPromoTab', disableFeedPromoTab)
    },
    [setState],
  )

  React.useEffect(() => {
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

export const useDisableFeedPromoTab = () => React.useContext(stateContext)
export const useSetDisableFeedPromoTab = () => React.useContext(setContext)