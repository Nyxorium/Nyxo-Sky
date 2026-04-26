import {View} from 'react-native'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {NYXO_GATE_REGISTRY} from '#/analytics/features/nyxo-registry'
import {Features} from '#/analytics/features/types'
import {type CommonNavigatorParams} from '#/lib/routes/types'
import {useRawGateValues} from '#/state/preferences/gateOverrides'
import {useGateOverrides, useSetGateOverride} from '#/state/preferences/gateOverrides'
import {atoms as a, useTheme} from '#/alf'
import * as SegmentedControl from '#/components/forms/SegmentedControl'
import * as Layout from '#/components/Layout'
import {Text} from '#/components/Typography'
import * as SettingsList from './components/SettingsList'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function FeatureGatesSettingsScreen({}: Props) {
  const {_} = useLingui()
  const t = useTheme()
  const overrides = useGateOverrides()
  const setOverride = useSetGateOverride()
  const rawValues = useRawGateValues()

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Feature Gates</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <SettingsList.Item>
            <Text style={[a.text_sm, a.leading_snug, t.atoms.text_contrast_medium]}>
              <Trans>
                These settings let you override feature flags set by Bluesky.
                Auto follows whatever Bluesky has enabled for your account.
              </Trans>
            </Text>
          </SettingsList.Item>

          <SettingsList.Divider />

          {Object.entries(NYXO_GATE_REGISTRY).map(([gate, meta]) => {
            const key = gate as Features
            const currentOverride = overrides[key]
            const liveValue = rawValues[key] ?? false

            const segmentedValue =
              currentOverride === undefined ? 'auto' :
              currentOverride ? 'on' : 'off'

            return (
              <SettingsList.Group
                key={gate}
                contentContainerStyle={[a.gap_sm]}
                iconInset={false}>
                <SettingsList.ItemText>{meta.label}</SettingsList.ItemText>
                {meta.description && (
                  <Text
                    style={[
                      a.text_sm,
                      a.leading_snug,
                      t.atoms.text_contrast_medium,
                      a.w_full,
                    ]}>
                    {meta.description}
                  </Text>
                )}
                <SegmentedControl.Root
                  type="radio"
                  label={meta.label}
                  value={segmentedValue}
                  onChange={value => {
                    setOverride(
                      key,
                      value === 'on' ? true :
                      value === 'off' ? false :
                      undefined,
                    )
                  }}>
                  <SegmentedControl.Item label={_(msg`Off`)} value="off">
                    <SegmentedControl.ItemText>
                      <Trans>Off</Trans>
                    </SegmentedControl.ItemText>
                  </SegmentedControl.Item>
                  <SegmentedControl.Item
                    label={_(msg`Auto (${liveValue ? 'on' : 'off'})`)}
                    value="auto">
                    <SegmentedControl.ItemText>
                      <Trans>Auto ({liveValue ? _(msg`on`) : _(msg`off`)})</Trans>
                    </SegmentedControl.ItemText>
                  </SegmentedControl.Item>
                  <SegmentedControl.Item label={_(msg`On`)} value="on">
                    <SegmentedControl.ItemText>
                      <Trans>On</Trans>
                    </SegmentedControl.ItemText>
                  </SegmentedControl.Item>
                </SegmentedControl.Root>
              </SettingsList.Group>
            )
          })}
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}