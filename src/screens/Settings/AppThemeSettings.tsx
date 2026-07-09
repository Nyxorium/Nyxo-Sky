import {useCallback} from 'react'
import {Pressable, View} from 'react-native'
import {LayoutAnimationConfig} from 'react-native-reanimated'
import {Trans} from '@lingui/react/macro'

import {
  type CommonNavigatorParams,
  type NativeStackScreenProps,
} from '#/lib/routes/types'
import {useSetThemePrefs, useThemePrefs} from '#/state/shell'
import {atoms as a, useTheme} from '#/alf'
import {THEME_PRESETS, type ThemePresetName} from '#/alf/theme-presets'
import * as SegmentedControl from '#/components/forms/SegmentedControl'
import {CircleCheck_Stroke2_Corner0_Rounded as CheckIcon} from '#/components/icons/CircleCheck'
import {ColorPalette_Stroke2_Corner0_Rounded as PaletteIcon} from '#/components/icons/ColorPalette'
import {type Props as SVGIconProps} from '#/components/icons/common'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import * as SettingsList from './components/SettingsList'

type Props = NativeStackScreenProps<CommonNavigatorParams, 'AppThemeSettings'>
export function AppThemeSettingsScreen({}: Props) {
  const {themePreset} = useThemePrefs()
  const {setThemePreset} = useSetThemePrefs()

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
              <Trans>App Themes</Trans>
            </Layout.Header.TitleText>
          </Layout.Header.Content>
          <Layout.Header.Slot />
        </Layout.Header.Outer>
        <Layout.Content>
          <SettingsList.Container>
            <SettingsList.Group
              contentContainerStyle={[a.gap_sm]}
              iconInset={false}>
              <SettingsList.ItemIcon icon={PaletteIcon} />
              <SettingsList.ItemText>
                <Trans>App Themes</Trans>
              </SettingsList.ItemText>
              <ThemePresetGrid
                value={themePreset ?? 'nyxoSky'}
                onChange={onChangeThemePreset}
              />
            </SettingsList.Group>
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
            accessibilityHint=""
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
              {isSelected && <CheckIcon size="sm" style={{color: textColor}} />}
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
