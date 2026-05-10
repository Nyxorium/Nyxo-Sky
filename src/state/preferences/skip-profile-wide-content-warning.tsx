import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.skipProfileWideContentWarning),
)
stateContext.displayName = 'SkipProfileWideContentWarningStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'SkipProfileWideContentWarningSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('skipProfileWideContentWarning')),
  )

  const setStateWrapped = React.useCallback(
    (skipProfileWideContentWarning: persisted.Schema['skipProfileWideContentWarning']) => {
      setState(Boolean(skipProfileWideContentWarning))
      persisted.write('skipProfileWideContentWarning', skipProfileWideContentWarning)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate(
      'skipProfileWideContentWarning',
      nextSkipProfileWideContentWarning => {
        setState(Boolean(nextSkipProfileWideContentWarning))
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

export const useSkipProfileWideContentWarning = () => React.useContext(stateContext)
export const useSetSkipProfileWideContentWarning = () => React.useContext(setContext)