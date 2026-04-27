import React from 'react'

import * as persisted from '#/state/persisted'

export type MetricVisibility = 'show' | 'hide_own' | 'hide_others' | 'hide_all'
export type MetricVisibilityKey = 'likes' | 'reposts' | 'replies' | 'quotes' | 'bookmarks'
export type MetricVisibilityPrefs = Partial<Record<MetricVisibilityKey, MetricVisibility>>

type StateContext = MetricVisibilityPrefs
type SetContext = (metric: MetricVisibilityKey, value: MetricVisibility) => void

const stateContext = React.createContext<StateContext>(
  persisted.defaults.metricVisibility ?? {},
)
stateContext.displayName = 'MetricVisibilityStateContext'

const setContext = React.createContext<SetContext>((_metric, _value) => {})
setContext.displayName = 'MetricVisibilitySetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [state, setState] = React.useState<MetricVisibilityPrefs>(
    () => persisted.get('metricVisibility') ?? {},
  )

  const setStateWrapped = React.useCallback(
    (metric: MetricVisibilityKey, value: MetricVisibility) => {
      setState(prev => {
        const next = {...prev, [metric]: value}
        persisted.write('metricVisibility', next)
        return next
      })
    },
    [],
  )

  React.useEffect(() => {
    return persisted.onUpdate('metricVisibility', next => {
      setState(next ?? {})
    })
  }, [])

  return (
    <stateContext.Provider value={state}>
      <setContext.Provider value={setStateWrapped}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useMetricVisibilityPrefs() {
  return React.useContext(stateContext)
}

export function useSetMetricVisibility() {
  return React.useContext(setContext)
}

/**
 * Returns true if the given metric should be hidden for a post.
 * Call at render time with whether the post belongs to the current user.
 */
export function useIsMetricHidden(
  metric: MetricVisibilityKey,
  isOwnPost: boolean,
): boolean {
  const prefs = useMetricVisibilityPrefs()
  const v = prefs[metric] ?? 'show'
  if (v === 'hide_all') return true
  if (v === 'hide_own' && isOwnPost) return true
  if (v === 'hide_others' && !isOwnPost) return true
  return false
}