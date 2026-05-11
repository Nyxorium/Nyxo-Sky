import {View} from 'react-native'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {type ImpressionVisibilityKey} from '#/state/preferences/impression-visibility'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {ItemTextWithSubtitle} from '#/screens/Settings/NotificationSettings/components/ItemTextWithSubtitle'
import {atoms as a, platform, useTheme} from '#/alf'
import * as Toggle from '#/components/forms/Toggle'
import {Heart2_Stroke2_Corner0_Rounded as Heart} from '#/components/icons/Heart2'

export type ImpressionConfig = {
  key: ImpressionVisibilityKey
  label: string
}

export function ImpressionSection({
  titleText,
  subtitleText,
  impressions,
  getOwnValue,
  getOthersValue,
  onToggleOwn,
  onToggleOthers,
}: {
  titleText: React.ReactNode
  subtitleText: React.ReactNode
  impressions: ImpressionConfig[]
  getOwnValue: (key: ImpressionVisibilityKey) => boolean
  getOthersValue: (key: ImpressionVisibilityKey) => boolean
  onToggleOwn: (key: ImpressionVisibilityKey, val: boolean) => void
  onToggleOthers: (key: ImpressionVisibilityKey, val: boolean) => void
}) {
  const {_} = useLingui()
  const t = useTheme()

  return (
    <>
      <SettingsList.Item style={[a.align_start]}>
        <SettingsList.ItemIcon icon={Heart} />
        <ItemTextWithSubtitle
          bold
          titleText={titleText}
          subtitleText={subtitleText}
        />
      </SettingsList.Item>
      <View style={[a.px_xl, a.pt_md, a.gap_sm]}>
        {impressions.map(impression => (
          <View key={impression.key}>
            <Toggle.Item
              label={_(msg`Your feeds`)}
              name={`${impression.key}_own`}
              value={!getOwnValue(impression.key)}
              onChange={val => onToggleOwn(impression.key, !val)}
              style={[
                a.py_xs,
                platform({
                  native: [a.justify_between],
                  web: [a.flex_row_reverse, a.gap_sm],
                }),
              ]}>
              <Toggle.LabelText
                style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                <Trans>Your feeds</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Toggle.Item
              label={_(msg`Others' feeds`)}
              name={`${impression.key}_others`}
              value={!getOthersValue(impression.key)}
              onChange={val => onToggleOthers(impression.key, !val)}
              style={[
                a.py_xs,
                platform({
                  native: [a.justify_between],
                  web: [a.flex_row_reverse, a.gap_sm],
                }),
              ]}>
              <Toggle.LabelText
                style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                <Trans>Others' feeds</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
          </View>
        ))}
        <SettingsList.Divider />
      </View>
    </>
  )
}