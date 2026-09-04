import {Trans, useLingui} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {
  useSetViewTailorPref,
  useViewTailorPrefs,
} from '#/state/preferences/view-tailor-prefs'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import * as Toggle from '#/components/forms/Toggle'
import {DevicePhoneMobile} from '#/components/icons/heroicons/DevicePhoneMobile'
import {Window_Stroke2_Corner2_Rounded as WindowIcon} from '#/components/icons/Window'
import * as Layout from '#/components/Layout'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function NativeTailorsSettingsScreen({}: Props) {
  const {t: l} = useLingui()

  const {tailors} = useViewTailorPrefs()
  const setTailors = useSetViewTailorPref()

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Native Tailors</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>
          <Toggle.Item
            name="hide_share-via-chat"
            label={l`'Share via chat' in share menu`}
            value={tailors.shareViaChat}
            onChange={value => setTailors('shareViaChat', value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={DevicePhoneMobile} />
              <SettingsList.ItemText>
                <Trans>'Share via chat' in Share Menu</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="limit_new_post_button"
            label={l`New Post button`}
            value={tailors.newPostButton}
            onChange={value => setTailors('newPostButton', value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={WindowIcon} />
              <SettingsList.ItemText>
                <Trans>New Post button</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
