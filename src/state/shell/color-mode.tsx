import {createContext, useContext, useEffect, useMemo, useState} from 'react'

import {type ThemePresetName} from '#/alf/theme-presets'
import * as persisted from '#/state/persisted'

type StateContext = {
  colorMode: persisted.Schema['colorMode']
  darkTheme: persisted.Schema['darkTheme']
  themePreset: ThemePresetName
}
type SetContext = {
  setColorMode: (v: persisted.Schema['colorMode']) => void
  setDarkTheme: (v: persisted.Schema['darkTheme']) => void
  setThemePreset: (v: ThemePresetName) => void
}

const stateContext = createContext<StateContext>({
  colorMode: 'system',
  darkTheme: 'dark',
  themePreset: 'nyxoSky',
})
stateContext.displayName = 'ColorModeStateContext'
const setContext = createContext<SetContext>({} as SetContext)
setContext.displayName = 'ColorModeSetContext'

export function Provider({children}: React.PropsWithChildren<{}>) {
  const [colorMode, setColorMode] = useState(() => persisted.get('colorMode'))
  const [darkTheme, setDarkTheme] = useState(() => persisted.get('darkTheme'))
  const [themePreset, setThemePreset] = useState<ThemePresetName>(
    () => (persisted.get('themePreset') as ThemePresetName) ?? 'nyxoSky',
  )

  const stateContextValue = useMemo(
    () => ({
      colorMode,
      darkTheme,
      themePreset,
    }),
    [colorMode, darkTheme, themePreset],
  )

  const setContextValue = useMemo(
    () => ({
      setColorMode: (_colorMode: persisted.Schema['colorMode']) => {
        setColorMode(_colorMode)
        persisted.write('colorMode', _colorMode)
      },
      setDarkTheme: (_darkTheme: persisted.Schema['darkTheme']) => {
        setDarkTheme(_darkTheme)
        persisted.write('darkTheme', _darkTheme)
      },
      setThemePreset: (_themePreset: ThemePresetName) => {
        setThemePreset(_themePreset)
        persisted.write('themePreset', _themePreset)
      },
    }),
    [],
  )

  useEffect(() => {
    const unsub1 = persisted.onUpdate('darkTheme', nextDarkTheme => {
      setDarkTheme(nextDarkTheme)
    })
    const unsub2 = persisted.onUpdate('colorMode', nextColorMode => {
      setColorMode(nextColorMode)
    })
    const unsub3 = persisted.onUpdate('themePreset', nextThemePreset => {
      setThemePreset((nextThemePreset as ThemePresetName) ?? 'nyxoSky')
    })
    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [])

  return (
    <stateContext.Provider value={stateContextValue}>
      <setContext.Provider value={setContextValue}>
        {children}
      </setContext.Provider>
    </stateContext.Provider>
  )
}

export function useThemePrefs() {
  return useContext(stateContext)
}

export function useSetThemePrefs() {
  return useContext(setContext)
}
