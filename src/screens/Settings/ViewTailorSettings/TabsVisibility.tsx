import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {
  useProfileTabVisibilityPrefs,
  useSetProfileTabVisibilityPref,
} from '#/state/preferences/profile-tab-visibility'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {atoms as a, platform, useTheme} from '#/alf'
import * as Toggle from '#/components/forms/Toggle'
import {Heart2_Stroke2_Corner0_Rounded as HeartIcon} from '#/components/icons/Heart2'
import * as Layout from '#/components/Layout'
import {Divider} from '../components/SettingsList'
import {ItemTextWithSubtitle} from '../NotificationSettings/components/ItemTextWithSubtitle'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function ProfileTabVisibilitySettingsScreen({}: Props) {
  const {t: l} = useLingui()
  const t = useTheme()

  const {ownTabs, otherTabs} = useProfileTabVisibilityPrefs()
  const {setOwnTabs, setOtherTabs} = useSetProfileTabVisibilityPref()

  const toggleStyle = [
    a.py_xs,
    platform({
      native: [a.justify_between],
      web: [a.flex_row_reverse, a.gap_sm],
    }),
  ]
  const labelStyle = [t.atoms.text, a.font_normal, a.text_md, a.flex_1]

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Tab visibility</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <SettingsList.Item style={[a.align_start]}>
            <SettingsList.ItemIcon icon={HeartIcon} />
            <ItemTextWithSubtitle
              bold
              titleText={<Trans>Tabs on your profile</Trans>}
              subtitleText={
                <Trans>
                  Toggle the visibility of various tabs found on your profile
                </Trans>
              }
            />
          </SettingsList.Item>
          <View style={[a.px_xl, a.pt_md, a.gap_sm]}>
            <View style={[a.gap_sm]}>
              {(
                [
                  ['posts', 'Posts', 'hide_self_posts'],
                  ['replies', 'Replies', 'hide_self_replies'],
                  ['media', 'Media', 'hide_self_media'],
                  ['videos', 'Videos', 'hide_self_videos'],
                  ['likes', 'Likes', 'hide_self_likes'],
                  ['feeds', 'Feeds', 'hide_self_feeds'],
                  ['starterPacks', 'Starter Packs', 'hide_self_starter_packs'],
                  ['lists', 'Lists', 'hide_self_lists'],
                ] as const
              ).map(([key, label, name]) => (
                <Toggle.Item
                  key={key}
                  label={l`${label}`}
                  name={name}
                  value={!ownTabs[key]}
                  onChange={value => setOwnTabs(key, !value)}
                  style={toggleStyle}>
                  <Toggle.LabelText style={labelStyle}>
                    <Trans>{label}</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>
              ))}
            </View>
            <Divider />
          </View>

          <SettingsList.Item style={[a.align_start]}>
            <SettingsList.ItemIcon icon={HeartIcon} />
            <ItemTextWithSubtitle
              bold
              titleText={<Trans>Tabs on other profiles</Trans>}
              subtitleText={
                <Trans>
                  Toggle the visibility of various tabs found on other profiles
                </Trans>
              }
            />
          </SettingsList.Item>
          <View style={[a.px_xl, a.pt_md, a.gap_sm]}>
            <View style={[a.gap_sm]}>
              {(
                [
                  ['posts', 'Posts', 'hide_others_posts'],
                  ['replies', 'Replies', 'hide_others_replies'],
                  ['media', 'Media', 'hide_others_media'],
                  ['videos', 'Videos', 'hide_others_videos'],
                  ['feeds', 'Feeds', 'hide_others_feeds'],
                  [
                    'starterPacks',
                    'Starter Packs',
                    'hide_others_starter_packs',
                  ],
                  ['lists', 'Lists', 'hide_others_lists'],
                ] as const
              ).map(([key, label, name]) => (
                <Toggle.Item
                  key={key}
                  label={l`${label}`}
                  name={name}
                  value={!otherTabs[key]}
                  onChange={value => setOtherTabs(key, !value)}
                  style={toggleStyle}>
                  <Toggle.LabelText style={labelStyle}>
                    <Trans>{label}</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>
              ))}
            </View>
            <Divider />
          </View>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
