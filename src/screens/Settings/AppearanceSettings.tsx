import {useCallback} from 'react'
import {Pressable, View} from 'react-native'
import Animated, {
  FadeInUp,
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
} from 'react-native-reanimated'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {useSetThemePrefs, useThemePrefs} from '#/state/shell'
import {SettingsListItem as AppIconSettingsListItem} from '#/screens/Settings/AppIconSettings/SettingsListItem'
import {type Alf, atoms as a, native, useAlf, useTheme} from '#/alf'
import {THEME_PRESETS, type ThemePresetName} from '#/alf/theme-presets'
import * as SegmentedControl from '#/components/forms/SegmentedControl'
import {type Props as SVGIconProps} from '#/components/icons/common'
import {CircleCheck_Stroke2_Corner0_Rounded as CheckIcon} from '#/components/icons/CircleCheck'
import {ColorPalette_Stroke2_Corner0_Rounded as PaletteIcon} from '#/components/icons/ColorPalette'
import {Moon_Stroke2_Corner0_Rounded as MoonIcon} from '#/components/icons/Moon'
import {Phone_Stroke2_Corner0_Rounded as PhoneIcon} from '#/components/icons/Phone'
import {TextSize_Stroke2_Corner0_Rounded as TextSize} from '#/components/icons/TextSize'
import {TitleCase_Stroke2_Corner0_Rounded as Aa} from '#/components/icons/TitleCase'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import {IS_INTERNAL, IS_NATIVE} from '#/env'
import * as SettingsList from './components/SettingsList'

type Props = NativeStackScreenProps<CommonNavigatorParams, 'AppearanceSettings'>
export function AppearanceSettingsScreen({}: Props) {
  const {_} = useLingui()
  const {fonts} = useAlf()

  const {colorMode, darkTheme, themePreset} = useThemePrefs()
  const {setColorMode, setDarkTheme, setThemePreset} = useSetThemePrefs()

  const onChangeAppearance = useCallback(
    (value: 'light' | 'system' | 'dark') => {
      setColorMode(value)
    },
    [setColorMode],
  )

  const onChangeDarkTheme = useCallback(
    (value: 'dim' | 'dark') => {
      setDarkTheme(value)
    },
    [setDarkTheme],
  )

  const onChangeFontFamily = useCallback(
    (value: 'system' | 'theme') => {
      fonts.setFontFamily(value)
    },
    [fonts],
  )

  const onChangeFontScale = useCallback(
    (value: Alf['fonts']['scale']) => {
      fonts.setFontScale(value)
    },
    [fonts],
  )

  const onChangeThemePreset = useCallback(
    (value: ThemePresetName) => {
      setThemePreset(value)
    },
    [setThemePreset],
  )

  return (
    <LayoutAnimationConfig skipExiting skipEntering>
      <Layout.Screen testID="preferencesThreadsScreen">
        <Layout.Header.Outer>
          <Layout.Header.BackButton />
          <Layout.Header.Content>
            <Layout.Header.TitleText>
              <Trans>Appearance</Trans>
            </Layout.Header.TitleText>
          </Layout.Header.Content>
          <Layout.Header.Slot />
        </Layout.Header.Outer>
        <Layout.Content>
          <SettingsList.Container>
            <SettingsList.Group contentContainerStyle={[a.gap_sm]} iconInset={false}>
              <SettingsList.ItemIcon icon={PaletteIcon} />
              <SettingsList.ItemText>
                <Trans>App theme</Trans>
              </SettingsList.ItemText>
              <ThemePresetGrid
                value={themePreset ?? 'nyxoSky'}
                onChange={onChangeThemePreset}
              />
            </SettingsList.Group>

            <SettingsList.Divider />
            <AppearanceToggleButtonGroup
              title={_(msg`Color mode`)}
              icon={PhoneIcon}
              items={[
                {
                  label: _(msg`System`),
                  name: 'system',
                },
                {
                  label: _(msg`Light`),
                  name: 'light',
                },
                {
                  label: _(msg`Dark`),
                  name: 'dark',
                },
              ]}
              value={colorMode}
              onChange={onChangeAppearance}
            />

            {colorMode !== 'light' && (
              <Animated.View
                entering={native(FadeInUp)}
                exiting={native(FadeOutUp)}>
                <AppearanceToggleButtonGroup
                  title={_(msg`Dark theme`)}
                  icon={MoonIcon}
                  items={[
                    {
                      label: _(msg`Dim`),
                      name: 'dim',
                    },
                    {
                      label: _(msg`Dark`),
                      name: 'dark',
                    },
                  ]}
                  value={darkTheme ?? 'dim'}
                  onChange={onChangeDarkTheme}
                />
              </Animated.View>
            )}

            <Animated.View layout={native(LinearTransition)}>
              <SettingsList.Divider />

              <AppearanceToggleButtonGroup
                title={_(msg`Font`)}
                description={_(
                  msg`For the best experience, we recommend using the theme font.`,
                )}
                icon={Aa}
                items={[
                  {
                    label: _(msg`System`),
                    name: 'system',
                  },
                  {
                    label: _(msg`Theme`),
                    name: 'theme',
                  },
                ]}
                value={fonts.family}
                onChange={onChangeFontFamily}
              />

              <AppearanceToggleButtonGroup
                title={_(msg`Font size`)}
                icon={TextSize}
                items={[
                  {
                    label: _(msg`Smaller`),
                    name: '-1',
                  },
                  {
                    label: _(msg`Default`),
                    name: '0',
                  },
                  {
                    label: _(msg`Larger`),
                    name: '1',
                  },
                ]}
                value={fonts.scale}
                onChange={onChangeFontScale}
              />

              {IS_NATIVE && IS_INTERNAL && (
                <>
                  <SettingsList.Divider />
                  <AppIconSettingsListItem />
                </>
              )}
            </Animated.View>
          </SettingsList.Container>
        </Layout.Content>
      </Layout.Screen>
    </LayoutAnimationConfig>
  )
}

export function AppearanceToggleButtonGroup<T extends string>({
  title,
  description,
  icon: Icon,
  items,
  value,
  onChange,
}: {
  title: string
  description?: string
  icon: React.ComponentType<SVGIconProps>
  items: {
    label: string
    name: T
  }[]
  value: T
  onChange: (value: T) => void
}) {
  const t = useTheme()
  return (
    <>
      <SettingsList.Group contentContainerStyle={[a.gap_sm]} iconInset={false}>
        <SettingsList.ItemIcon icon={Icon} />
        <SettingsList.ItemText>{title}</SettingsList.ItemText>
        {description && (
          <Text
            style={[
              a.text_sm,
              a.leading_snug,
              t.atoms.text_contrast_medium,
              a.w_full,
            ]}>
            {description}
          </Text>
        )}
        <SegmentedControl.Root
          type="radio"
          label={title}
          value={value}
          onChange={onChange}>
          {items.map(item => (
            <SegmentedControl.Item
              key={item.name}
              label={item.label}
              value={item.name}>
              <SegmentedControl.ItemText>
                {item.label}
              </SegmentedControl.ItemText>
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </SettingsList.Group>
    </>
  )
}

// ---------------------------------------------------------------------------
// Theme preset grid — 2-column coloured chips
// ---------------------------------------------------------------------------
function ThemePresetGrid({
  value,
  onChange,
}: {
  value: ThemePresetName
  onChange: (v: ThemePresetName) => void
}) {
  const entries = Object.entries(THEME_PRESETS) as [
    ThemePresetName,
    (typeof THEME_PRESETS)[ThemePresetName],
  ][]

  return (
    <View style={[a.flex_row, a.flex_wrap, a.w_full, {gap: 8}]}>
      {entries.map(([key, preset]) => {
        const isSelected = value === key
        const accent = preset.themes.light.palette.primary_500

        // Determine if the accent is light or dark to pick text colour.
        // primary_500 in light themes sits around 45-55% lightness — we
        // check if it's an hsl string and parse L, otherwise default to white.
        const textColor = getContrastTextColor(accent)

        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityLabel={preset.label}
            accessibilityState={{selected: isSelected}}
            onPress={() => onChange(key)}
            style={{
              width: '48%',
              flexGrow: 1,
              borderRadius: 12,
              overflow: 'hidden',
              borderWidth: 3,
              borderColor: isSelected ? accent : 'transparent',
            }}>
            <View
              style={{
                backgroundColor: accent,
                paddingVertical: 18,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  a.text_sm,
                  a.font_bold,
                  a.leading_snug,
                  {color: textColor, flexShrink: 1},
                ]}
                numberOfLines={1}>
                {preset.label}
              </Text>
              {isSelected && (
                <CheckIcon size="sm" style={{color: textColor}} />
              )}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}

/**
 * Returns white or near-black depending on whether the accent colour is
 * perceived as light or dark. Handles hsl(...) strings only; defaults to
 * white for anything else (hex, named colours).
 */
function getContrastTextColor(color: string): string {
  const match = color.match(/hsl\(\s*[\d.]+,\s*[\d.]+%,\s*([\d.]+)%/)
  if (match) {
    const lightness = parseFloat(match[1])
    return lightness > 60 ? 'rgba(0,0,0,0.8)' : '#FFFFFF'
  }
  return '#FFFFFF'
}