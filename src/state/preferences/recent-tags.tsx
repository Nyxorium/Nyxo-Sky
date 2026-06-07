import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import * as persisted from '#/state/persisted'

const MAX_RECENT_STORED = 20

type StateContext = string[]
type SetContext = {
  addRecentTag: (tag: string) => void
  removeRecentTag: (tag: string) => void
}

const stateContext = createContext<StateContext>(
  persisted.defaults.recentTags ?? [],
)
stateContext.displayName = 'RecentTagsStateContext'

const setContext = createContext<SetContext>({
  addRecentTag: () => {},
  removeRecentTag: () => {},
})
setContext.displayName = 'RecentTagsSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState<string[]>(
    persisted.get('recentTags') ?? [],
  )

  const addRecentTag = useCallback((tag: string) => {
    setState(prev => {
      const deduped = prev.filter(t => t.toLowerCase() !== tag.toLowerCase())
      const next = [tag, ...deduped].slice(0, MAX_RECENT_STORED)
      void persisted.write('recentTags', next)
      return next
    })
  }, [])

  const removeRecentTag = useCallback((tag: string) => {
    setState(prev => {
      const next = prev.filter(t => t.toLowerCase() !== tag.toLowerCase())
      void persisted.write('recentTags', next)
      return next
    })
  }, [])

  useEffect(() => {
    return persisted.onUpdate('recentTags', next => {
      setState(next ?? [])
    })
  }, [])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={{addRecentTag, removeRecentTag}}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export const useRecentTags = () => useContext(stateContext)
export const useRecentTagsApi = () => useContext(setContext)
