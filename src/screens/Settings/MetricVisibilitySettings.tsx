import React from 'react'
import {View} from 'react-native'
import {Trans} from '@lingui/react/macro'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {
  type MetricVisibilityKey,
  useMetricVisibilityPrefs,
  useSetMetricVisibility,
} from '#/state/preferences/metric-visibility'
import {atoms as a, platform, useTheme} from '#/alf'
import * as Layout from '#/components/Layout'
import * as Toggle from '#/components/forms/Toggle'
import {Text} from '#/components/Typography'
import * as SettingsList from './components/SettingsList'
import {ItemTextWithSubtitle} from './NotificationSettings/components/ItemTextWithSubtitle'
import {EyeSlash_Stroke2_Corner0_Rounded as EyeSlashIcon} from '#/components/icons/EyeSlash'

type Props = NativeStackScreenProps<CommonNavigatorParams>

type MetricConfig = {
  key: MetricVisibilityKey
  label: string
}

const METRICS: MetricConfig[] = [
  {key: 'likes',     label: 'Likes'},
  {key: 'reposts',   label: 'Reposts'},
  {key: 'replies',   label: 'Replies'},
  {key: 'quotes',    label: 'Quote posts'},
  {key: 'bookmarks', label: 'Saves'},
]

function MetricSection({
  titleText,
  subtitleText,
  getValue,
  onToggle,
}: {
  titleText: React.ReactNode
  subtitleText: React.ReactNode
  getValue: (key: MetricVisibilityKey) => boolean
  onToggle: (key: MetricVisibilityKey, val: boolean) => void
}) {
  const {_} = useLingui()
  const t = useTheme()

  return (
    <>
      <SettingsList.Item style={[a.align_start]}>
        <SettingsList.ItemIcon icon={EyeSlashIcon} />
        <ItemTextWithSubtitle
          bold
          titleText={titleText}
          subtitleText={subtitleText}
        />
      </SettingsList.Item>
      <View style={[a.px_xl, a.pt_md, a.gap_sm]}>
        {METRICS.map(metric => (
          <Toggle.Item
            key={metric.key}
            label={_(msg`Show ${metric.label}`)}
            name={`${metric.key}`}
            value={!getValue(metric.key)}
            onChange={val => onToggle(metric.key, !val)}
            style={[
              a.py_xs,
              platform({
                native: [a.justify_between],
                web: [a.flex_row_reverse, a.gap_sm],
              }),
            ]}>
            <Toggle.LabelText
              style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
              {metric.label}
            </Toggle.LabelText>
            <Toggle.Platform />
          </Toggle.Item>
        ))}
        <SettingsList.Divider />
      </View>
    </>
  )
}

export function MetricVisibilitySettingsScreen({}: Props) {
  const t = useTheme()
  const prefs = useMetricVisibilityPrefs()
  const setVisibility = useSetMetricVisibility()

  const getOwnValue = (key: MetricVisibilityKey) => {
    const v = prefs[key] ?? 'show'
    return v === 'hide_own' || v === 'hide_all'
  }

  const getOthersValue = (key: MetricVisibilityKey) => {
    const v = prefs[key] ?? 'show'
    return v === 'hide_others' || v === 'hide_all'
  }

  const onToggleOwn = (key: MetricVisibilityKey, val: boolean) => {
    const othersChecked = getOthersValue(key)
    setVisibility(
      key,
      val
        ? othersChecked ? 'hide_all' : 'hide_own'
        : othersChecked ? 'hide_others' : 'show',
    )
  }

  const onToggleOthers = (key: MetricVisibilityKey, val: boolean) => {
    const ownChecked = getOwnValue(key)
    setVisibility(
      key,
      val
        ? ownChecked ? 'hide_all' : 'hide_others'
        : ownChecked ? 'hide_own' : 'show',
    )
  }

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Impression Visibility</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <SettingsList.Item>
            <Text style={[a.text_sm, a.leading_snug, t.atoms.text_contrast_medium]}>
              <Trans>
                Control which post counts are visible to you. These settings
                only affect your own view — counts are not hidden from others.
              </Trans>
            </Text>
          </SettingsList.Item>

          <SettingsList.Divider />

          <MetricSection
            titleText={<Trans>Your posts</Trans>}
            subtitleText={<Trans>Show counts on posts you made</Trans>}
            getValue={getOwnValue}
            onToggle={onToggleOwn}
          />

          <MetricSection
            titleText={<Trans>Others' posts</Trans>}
            subtitleText={<Trans>Show counts on posts by other people</Trans>}
            getValue={getOthersValue}
            onToggle={onToggleOthers}
          />

        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}