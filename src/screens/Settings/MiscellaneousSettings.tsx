import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import * as Toggle from '#/components/forms/Toggle'
import { 
  useAltLabelDisplayProfile,
  useSetAltLabelDisplayProfile,
 } from '#/state/preferences/alternate-label-display-profile'
import { 
  useDisableFollowbackBIN,
  useSetDisableFollowbackBIN,
 } from '#/state/preferences/disable-followback-BIN'
import { 
  useDisableShareViaDms,
  useSetDisableShareViaDms,
 } from '#/state/preferences/disable-share-via-dms'
import { 
  useEnableShareViaDID,
  useSetEnableShareViaDID,
 } from '#/state/preferences/enable-share-by-DID'
import { 
  useDisableFeedPromoTab,
  useSetDisableFeedPromoTab,
 } from '#/state/preferences/disable-feed-promo-tab'
import {Hashtag_Stroke2_Corner0_Rounded as HashtagIcon} from '#/components/icons/Hashtag'
import {Phone_Stroke2_Corner0_Rounded as PhoneIcon} from '#/components/icons/Phone'
import * as Layout from '#/components/Layout'
import {PersonPlus_Filled_Stroke2_Corner0_Rounded as PersonPlusIcon} from '#/components/icons/Person'
import {ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon} from '#/components/icons/ChainLink'
import {isNative} from '#/platform/detection'

import {IS_INTERNAL} from '#/env'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function MiscellaneousSettingsScreen({}: Props) {
  const {_} = useLingui()

  const altLabelDisplayProfile = useAltLabelDisplayProfile()
  const setAltLabelDisplayProfile = useSetAltLabelDisplayProfile()
  const disableFollowbackBIN = useDisableFollowbackBIN()
  const setDisableFollowbackBIN = useSetDisableFollowbackBIN()
  const disableShareViaDms = useDisableShareViaDms()
  const setDisableShareViaDms = useSetDisableShareViaDms()
  const enableShareViaDID = useEnableShareViaDID()
  const setEnableShareViaDID = useSetEnableShareViaDID()
  const disableFeedPromoTab = useDisableFeedPromoTab()
  const setDisableFeedPromoTab = useSetDisableFeedPromoTab()

  return (
    <Layout.Screen>
      <Layout.Header.Outer>
        <Layout.Header.BackButton />
        <Layout.Header.Content>
          <Layout.Header.TitleText>
            <Trans>Miscellaneous</Trans>
          </Layout.Header.TitleText>
        </Layout.Header.Content>
        <Layout.Header.Slot />
      </Layout.Header.Outer>
      <Layout.Content>
        <SettingsList.Container>

          {IS_INTERNAL && ( /* Internal until design is finished */
            <> 
              <SettingsList.LinkItem
                to="/settings/tabs-visibility"
                label={_(msg`Tabs Visibility (Profiles)`)}>
                <SettingsList.ItemIcon icon={HashtagIcon} />
                <SettingsList.ItemText>
                  <Trans>Tabs Visibility (Profiles)</Trans>
                </SettingsList.ItemText>
              </SettingsList.LinkItem>

              <SettingsList.Divider />
            </>
          )}

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


          {IS_INTERNAL && /* Internal until ShareMenuItems.tsx works with .did */
          <Toggle.Item
            name="enable_share_via_did"
            label={_(msg`Enable Sharing by DID`)}
            value={enableShareViaDID}
            onChange={value => setEnableShareViaDID(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={ChainLinkIcon} />
              <SettingsList.ItemText>
                <Trans>Enable Sharing by DID</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>}

          <SettingsList.Divider />

          <Toggle.Item
            name="disable_followback_bin"
            label={_(msg`Disable Followback Button in Notifications`)}
            value={disableFollowbackBIN}
            onChange={value => setDisableFollowbackBIN(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={PersonPlusIcon} />
              <SettingsList.ItemText>
                <Trans>Disable 'Follow Back' Button in Notifications</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="disable_feed_promo_tab"
            label={_(msg`Disable 'Feeds ✨'`)}
            value={disableFeedPromoTab}
            onChange={value => setDisableFeedPromoTab(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={HashtagIcon} />
              <SettingsList.ItemText>
                <Trans>Disable 'Feeds ✨'</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          {isNative && <SettingsList.Divider />}

          {isNative && (
            <Toggle.Item
              name="disable_share-via-dms"
              label={_(msg`Disable 'Share Via DMS' in Share Menu`)}
              value={disableShareViaDms}
              onChange={value => setDisableShareViaDms(value)}>
              <SettingsList.Item>
                <SettingsList.ItemIcon icon={PhoneIcon} />
                <SettingsList.ItemText>
                  <Trans>Disable 'Share Via DMS' in Share Menu</Trans>
                </SettingsList.ItemText>
                <Toggle.Platform />
              </SettingsList.Item>
            </Toggle.Item>
          )}

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