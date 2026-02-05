import React from 'react'

import * as persisted from '#/state/persisted'

type StateContext = boolean
type SetContext = (v: boolean) => void

const stateContext = React.createContext<StateContext>(
  Boolean(persisted.defaults.disableComposerPromptInFeeds),
)
stateContext.displayName = 'ComposerPromptStateContext'
const setContext = React.createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'ComposerPromptSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = React.useState(
    Boolean(persisted.get('disableComposerPromptInFeeds')),
  )

  const setStateWrapped = React.useCallback(
    (composerPromptDisabled: persisted.Schema['disableComposerPromptInFeeds']) => {
      setState(Boolean(composerPromptDisabled))
      persisted.write('disableComposerPromptInFeeds', composerPromptDisabled)
    },
    [setState],
  )

  React.useEffect(() => {
    return persisted.onUpdate('disableComposerPromptInFeeds', nextDisableComposerPrompt => {
      setState(Boolean(nextDisableComposerPrompt))
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

export const useComposerPromptDisabled = () => React.useContext(stateContext)
export const useSetComposerPromptDisabled = () => React.useContext(setContext)