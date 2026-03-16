import {useLayoutEffect} from 'react'
import {type ColorSchemeName, useColorScheme} from 'react-native'
import {type ThemeName} from '@bsky.app/alf'

import {THEME_PRESETS, type ThemePresetName} from '#/alf/theme-presets'
import {useThemePrefs} from '#/state/shell'
import {IS_WEB} from '#/env'

export function useColorModeTheme(): ThemeName {
  const theme = useThemeName()
  const {themePreset} = useThemePrefs()

  useLayoutEffect(() => {
    // Resolve the background colour directly from the preset registry —
    // no need to be inside the ALF context tree.
    const preset = THEME_PRESETS[(themePreset ?? 'nyxoSky') as ThemePresetName]
      ?? THEME_PRESETS.nyxoSky
    const bgColor = preset.themes[theme].atoms.bg.backgroundColor
    updateDocument(theme, bgColor)
  }, [theme, themePreset])

  return theme
}

export function useThemeName(): ThemeName {
  const colorScheme = useColorScheme()
  const {colorMode, darkTheme} = useThemePrefs()
  return getThemeName(colorScheme, colorMode, darkTheme)
}

function getThemeName(
  colorScheme: ColorSchemeName,
  colorMode: 'system' | 'light' | 'dark',
  darkTheme?: ThemeName,
) {
  if (
    (colorMode === 'system' && colorScheme === 'light') ||
    colorMode === 'light'
  ) {
    return 'light'
  } else {
    return darkTheme ?? 'dim'
  }
}

function updateDocument(theme: ThemeName, bgColor: string) {
  // @ts-ignore web only
  if (IS_WEB && typeof window !== 'undefined') {
    // @ts-ignore web only
    const html = window.document.documentElement
    // @ts-ignore web only
    const body = window.document.body
    // @ts-ignore web only
    const meta = window.document.querySelector('meta[name="theme-color"]')

    // Remove any other color mode classes
    html.className = html.className.replace(/(theme)--\w+/g, '')
    html.classList.add(`theme--${theme}`)

    // Set the actual palette background on html/body directly so the
    // browser overscroll area and page background match the active preset.
    html.style.backgroundColor = bgColor
    body.style.backgroundColor = bgColor

    meta?.setAttribute('content', bgColor)
    window.localStorage.setItem('ALF_THEME', theme)
    window.localStorage.setItem('ALF_BG', bgColor)
  }
}

export function getBackgroundColor(theme: ThemeName): string {
  // Fallback for static usage (e.g. splash) — uses Bluesky defaults
  switch (theme) {
    case 'light': return '#FFFFFF'
    case 'dark':  return '#000000'
    case 'dim':   return '#151D28'
  }
}
