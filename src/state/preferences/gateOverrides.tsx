import {createContext, useCallback, useContext, useEffect, useState} from 'react'

import {features} from '#/analytics/features'
import {Features} from '#/analytics/features/types'
import {NYXO_GATE_REGISTRY} from '#/analytics/features/nyxo-registry'
import * as persisted from '#/state/persisted'

type Overrides = Record<string, boolean>

type StateContext = Overrides
type SetContext = (gate: Features, value: boolean | undefined) => void

const stateContext = createContext<StateContext>(
  persisted.defaults.nyxoGateOverrides ?? {},
)
stateContext.displayName = 'GateOverridesStateContext'

const setContext = createContext<SetContext>((_gate, _value) => {})
setContext.displayName = 'GateOverridesSetContext'

const rawContext = createContext<Record<string, boolean>>({})
rawContext.displayName = 'GateOverridesRawContext'

function applyToGrowthBook(overrides: Overrides) {
  const map = new Map<string, boolean>()
  for (const [key, value] of Object.entries(overrides)) {
    map.set(key, value)
  }
  features.setForcedFeatures(map)
}

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [rawValues] = useState<Record<string, boolean>>(() => {
    const raw: Record<string, boolean> = {}
    for (const key of Object.keys(NYXO_GATE_REGISTRY)) {
      raw[key] = features.isOn(key as Features)
    }
    return raw
  })

  const [state, setState] = useState<Overrides>(() => {
    const stored: Overrides = persisted.get('nyxoGateOverrides') ?? {}
    applyToGrowthBook(stored)
    return stored
  })

  const setStateWrapped = useCallback(
    (gate: Features, value: boolean | undefined) => {
      setState(prev => {
        const next = {...prev}
        if (value === undefined) {
          delete next[gate]
        } else {
          next[gate] = value
        }
        persisted.write('nyxoGateOverrides', next)
        applyToGrowthBook(next)
        return next
      })
    },
    [],
  )

  useEffect(() => {
    return persisted.onUpdate('nyxoGateOverrides', next => {
      const safe: Overrides = next ?? {}
      setState(safe)
      applyToGrowthBook(safe)
    })
  }, [])

  return (
    <rawContext.Provider value={rawValues}>
      <stateContext.Provider value={state}>
        <setContext.Provider value={setStateWrapped}>
          {children}
        </setContext.Provider>
      </stateContext.Provider>
    </rawContext.Provider>
  )
}

export function useGateOverrides() {
  return useContext(stateContext)
}

export function useSetGateOverride() {
  return useContext(setContext)
}

export function useRawGateValues() {
  return useContext(rawContext)
}