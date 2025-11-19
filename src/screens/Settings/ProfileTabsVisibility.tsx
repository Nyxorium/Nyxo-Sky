import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {useDialogControl} from '#/components/Dialog'
import * as Toggle from '#/components/forms/Toggle'
import { 
  useAltLabelDisplayProfile,
  useSetAltLabelDisplayProfile,
 } from '#/state/preferences/alternate-label-display-profile'
import { 
  useDisableFollowbackBIN,
  useSetDisableFollowbackBIN,
 } from '#/state/preferences/disable-followback-BIN'
import {Phone_Stroke2_Corner0_Rounded as PhoneIcon} from '#/components/icons/Phone'
import * as Layout from '#/components/Layout'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function ProfileTabVisibilitySettingsScreen({}: Props) {
  const {_} = useLingui()

  const altLabelDisplayProfile = useAltLabelDisplayProfile()
  const setAltLabelDisplayProfile = useSetAltLabelDisplayProfile()
  const disableFollowbackBIN = useDisableFollowbackBIN()
  const setDisableFollowbackBIN = useSetDisableFollowbackBIN()

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Tabs Visibility (Profiles)</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>


          <SettingsList.Divider />

          <Toggle.Item
            name="alt_label_display_profile"
            label={_(msg`Use Alternate Label Display for Profiles`)}
            value={altLabelDisplayProfile}
            onChange={value => setAltLabelDisplayProfile(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={PhoneIcon} />
              <SettingsList.ItemText>
                <Trans>Use Alternate Label Display for Profiles</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="disable_followback_bin"
            label={_(msg`Disable Followback Button in Notifications`)}
            value={disableFollowbackBIN}
            onChange={value => setDisableFollowbackBIN(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={PhoneIcon} />
              <SettingsList.ItemText>
                <Trans>Disable Followback Button in Notifications</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}

const styles = {
  textInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
  },
}