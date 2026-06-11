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
  Boolean(persisted.defaults.likeOnRepost),
)
stateContext.displayName = 'LikeOnRepostStateContext'
const setContext = createContext<SetContext>((_: boolean) => {})
setContext.displayName = 'LikeOnRepostSetContext'

export function Provider({children}: {children: React.ReactNode}) {
  const [state, setState] = useState(Boolean(persisted.get('likeOnRepost')))

  const setStateWrapped = useCallback(
    (likeOnRepost: persisted.Schema['likeOnRepost']) => {
      setState(Boolean(likeOnRepost))
      void persisted.write('likeOnRepost', likeOnRepost)
    },
    [setState],
  )

  useEffect(() => {
    return persisted.onUpdate('likeOnRepost', nextLikeOnRepost => {
      setState(Boolean(nextLikeOnRepost))
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

export const useLikeOnRepost = () => useContext(stateContext)
export const useSetLikeOnRepost = () => useContext(setContext)
