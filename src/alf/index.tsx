import {createContext, useCallback, useContext, useMemo, useState} from 'react'
import {type Theme, type ThemeName, utils as baseUtils} from '@bsky.app/alf'

import {
  computeFontScaleMultiplier,
  getFontFamily,
  getFontScale,
  setFontFamily as persistFontFamily,
  setFontScale as persistFontScale,
} from '#/alf/fonts'
import {THEME_PRESETS, type ThemePresetName} from '#/alf/theme-presets'
import {themes as defaultThemes} from '#/alf/themes'
import {darken, lighten, rgbToHex} from '#/alf/util/colorGeneration'
import {type Device} from '#/storage'

export {type TextStyleProp, type Theme, type ViewStyleProp} from '@bsky.app/alf'
export {atoms} from '#/alf/atoms'
export * from '#/alf/breakpoints'
export * from '#/alf/fonts'
export * as tokens from '#/alf/tokens'
export * from '#/alf/util/flatten'
export * from '#/alf/util/platform'
export * from '#/alf/util/themeSelector'
export * from '#/alf/util/useGutters'
export const utils = {
  ...baseUtils,
  rgbToHex,
  lighten,
  darken,
}

export type Alf = {
  themeName: ThemeName
  theme: Theme
  themes: typeof defaultThemes
  fonts: {
    scale: Exclude<Device['fontScale'], undefined>
    scaleMultiplier: number
    family: Device['fontFamily']
    setFontScale: (fontScale: Exclude<Device['fontScale'], undefined>) => void
    setFontFamily: (fontFamily: Device['fontFamily']) => void
  }
  /**
   * Feature flags or other gated options
   */
  flags: {}
}

/*
 * Context
 */
export const Context = createContext<Alf>({
  themeName: 'light',
  theme: defaultThemes.light,
  themes: defaultThemes,
  fonts: {
    scale: getFontScale(),
    scaleMultiplier: computeFontScaleMultiplier(getFontScale()),
    family: getFontFamily(),
    setFontScale: () => {},
    setFontFamily: () => {},
  },
  flags: {},
})
Context.displayName = 'AlfContext'

export function ThemeProvider({
  children,
  theme: themeName,
  themePreset = 'nyxoSky',
  themesOverride,
}: React.PropsWithChildren<{
  theme: ThemeName
  themePreset?: ThemePresetName
  themesOverride?: Partial<typeof defaultThemes>
}>) {
  const [fontScale, setFontScale] = useState<Alf['fonts']['scale']>(() =>
    getFontScale(),
  )
  const [fontScaleMultiplier, setFontScaleMultiplier] = useState(() =>
    computeFontScaleMultiplier(fontScale),
  )
  const setFontScaleAndPersist = useCallback<Alf['fonts']['setFontScale']>(
    fs => {
      setFontScale(fs)
      persistFontScale(fs)
      setFontScaleMultiplier(computeFontScaleMultiplier(fs))
    },
    [setFontScale],
  )
  const [fontFamily, setFontFamily] = useState<Alf['fonts']['family']>(() =>
    getFontFamily(),
  )
  const setFontFamilyAndPersist = useCallback<Alf['fonts']['setFontFamily']>(
    ff => {
      setFontFamily(ff)
      persistFontFamily(ff)
    },
    [setFontFamily],
  )

  const value = useMemo<Alf>(() => {
    // Start from the chosen preset, then let themesOverride patch on top.
    // Falls back to the bluesky preset if themePreset is somehow unrecognised.
    const preset = THEME_PRESETS[themePreset] ?? THEME_PRESETS.bluesky
    const t = {
      ...preset.themes,
      ...themesOverride,
    } as typeof defaultThemes
    return {
      themes: t,
      themeName: themeName,
      theme: t[themeName],
      fonts: {
        scale: fontScale,
        scaleMultiplier: fontScaleMultiplier,
        family: fontFamily,
        setFontScale: setFontScaleAndPersist,
        setFontFamily: setFontFamilyAndPersist,
      },
      flags: {},
    }
  }, [
    themePreset,
    themesOverride,
    themeName,
    fontScale,
    fontScaleMultiplier,
    setFontScaleAndPersist,
    fontFamily,
    setFontFamilyAndPersist,
  ])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useAlf() {
  return useContext(Context)
}

export function useTheme(theme?: ThemeName) {
  const alf = useAlf()
  return useMemo(() => {
    return theme ? alf.themes[theme] : alf.theme
  }, [theme, alf])
}
