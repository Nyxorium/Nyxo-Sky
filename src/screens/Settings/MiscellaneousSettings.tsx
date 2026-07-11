import {Trans, useLingui} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {
  useAltLabelDisplayProfile,
  useSetAltLabelDisplayProfile,
} from '#/state/preferences/alternate-label-display-profile'
import {
  useComposerPromptDisabled,
  useSetComposerPromptDisabled,
} from '#/state/preferences/disable-composer-prompt-in-feeds'
import {
  useDisableFeedPromoTab,
  useSetDisableFeedPromoTab,
} from '#/state/preferences/disable-feed-promo-tab'
import {
  useDisableFollowbackBIN,
  useSetDisableFollowbackBIN,
} from '#/state/preferences/disable-followback-BIN'
import {
  useDisableProfileDescriptions,
  useSetDisableProfileDescriptions,
} from '#/state/preferences/disable-profile-descriptions'
import {
  useDisableShareViaDms,
  useSetDisableShareViaDms,
} from '#/state/preferences/disable-share-via-dms'
import {
  useEnableShareViaDID,
  useSetEnableShareViaDID,
} from '#/state/preferences/enable-share-by-DID'
import {
  useEnableSquareAvatars,
  useSetEnableSquareAvatars,
} from '#/state/preferences/enable-square-avatars'
import {
  useLikeOnRepost,
  useSetLikeOnRepost,
} from '#/state/preferences/like-on-repost'
import {
  useLimitComposePostButton,
  useSetLimitComposePostButton,
} from '#/state/preferences/limit-compose-post-button'
import {
  useNoAppLabelers,
  useSetNoAppLabelers,
} from '#/state/preferences/no-app-labelers'
import {
  useSetSkipProfileWideContentWarning,
  useSkipProfileWideContentWarning,
} from '#/state/preferences/skip-profile-wide-content-warning'
import {
  useSetSplitModerationLabelGrouping,
  useSplitModerationLabelGrouping,
} from '#/state/preferences/split-moderation-label-grouping'
import {AppearanceToggleButtonGroup} from '#/screens/Settings/AppearanceSettings'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {atoms as a} from '#/alf'
import {Admonition} from '#/components/Admonition'
import * as Toggle from '#/components/forms/Toggle'
import {Beaker_Stroke2_Corner2_Rounded as BeakerIcon} from '#/components/icons/Beaker'
import {ChainLink_Stroke2_Corner0_Rounded as ChainLinkIcon} from '#/components/icons/ChainLink'
import {Filter_Stroke2_Corner0_Rounded as Filter} from '#/components/icons/Filter'
import {Hashtag_Stroke2_Corner0_Rounded as HashtagIcon} from '#/components/icons/Hashtag'
import {Message_Stroke2_Corner0_Rounded as Message} from '#/components/icons/Message'
import {
  Person_Stroke2_Corner2_Rounded as PersonIcon,
  PersonPlus_Filled_Stroke2_Corner0_Rounded as PersonPlusIcon,
} from '#/components/icons/Person'
import {Phone_Stroke2_Corner0_Rounded as PhoneIcon} from '#/components/icons/Phone'
import {RaisingHand4Finger_Stroke2_Corner0_Rounded as RaisingHandIcon} from '#/components/icons/RaisingHand'
import {Window_Stroke2_Corner2_Rounded as WindowIcon} from '#/components/icons/Window'
import * as Layout from '#/components/Layout'
import {IS_NATIVE} from '#/env'
import {useDevMode} from '#/storage/hooks/dev-mode'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function MiscellaneousSettingsScreen({}: Props) {
  const {t: l} = useLingui()

  const [devModeEnabled] = useDevMode()

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
  const enableSquareAvatars = useEnableSquareAvatars()
  const setEnableSquareAvatars = useSetEnableSquareAvatars()
  const disableComposerPromptInFeeds = useComposerPromptDisabled()
  const setDisableComposerPromptInFeeds = useSetComposerPromptDisabled()
  const disableProfileDescriptions = useDisableProfileDescriptions()
  const setDisableProfileDescriptions = useSetDisableProfileDescriptions()
  const limitComposePostButton = useLimitComposePostButton()
  const setLimitComposePostButton = useSetLimitComposePostButton()
  const noAppLabelers = useNoAppLabelers()
  const setNoAppLabelers = useSetNoAppLabelers()
  const skipProfileWideContentWarning = useSkipProfileWideContentWarning()
  const setSkipProfileWideContentWarning = useSetSkipProfileWideContentWarning()
  const splitModerationlabelGrouping = useSplitModerationLabelGrouping()
  const setSplitModerationlabelGrouping = useSetSplitModerationLabelGrouping()
  const likeOnRepost = useLikeOnRepost()
  const setLikeOnRepost = useSetLikeOnRepost()

  // Keep disable and enable options seperate? - Sunstar

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
          <SettingsList.LinkItem
            to="/settings/feature-gates"
            label={l`Feature Gates`}>
            <SettingsList.ItemIcon icon={BeakerIcon} />
            <SettingsList.ItemText>
              <Trans>Feature Gates</Trans>
            </SettingsList.ItemText>
          </SettingsList.LinkItem>

          <SettingsList.Divider />

          <AppearanceToggleButtonGroup
            title={l`Alternate Label Display for Profiles`}
            icon={PhoneIcon}
            items={[
              {label: l`Original`, name: 'original'},
              {label: l`Alternative`, name: 'alternative'},
              {label: l`Off`, name: 'off'},
            ]}
            value={altLabelDisplayProfile}
            onChange={setAltLabelDisplayProfile}
          />

          <Toggle.Item
            name="enable_share_via_did"
            label={l`Share by DID`}
            value={enableShareViaDID}
            onChange={value => setEnableShareViaDID(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={ChainLinkIcon} />
              <SettingsList.ItemText>
                <Trans>Share by DID</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="enable_square_avatars"
            label={l`Square Avatars`}
            value={enableSquareAvatars}
            onChange={value => setEnableSquareAvatars(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={PersonIcon} />
              <SettingsList.ItemText>
                <Trans>Square Avatars</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <SettingsList.Divider />

          <Toggle.Item
            name="disable_followback_bin"
            label={l`Disable Followback Button in Notifications`}
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
            label={l`Disable 'Feeds ✨'`}
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

          <Toggle.Item
            name="disable_composer_prompt_in_feeds"
            label={l`Disable Composer Prompt`}
            value={disableComposerPromptInFeeds}
            onChange={value => setDisableComposerPromptInFeeds(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={WindowIcon} />
              <SettingsList.ItemText>
                <Trans>Disable Composer Prompt</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="disable_profile_content_warning"
            label={l`Disable Profile wide content warnings`}
            value={skipProfileWideContentWarning}
            onChange={value => setSkipProfileWideContentWarning(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={PersonIcon} />
              <SettingsList.ItemText>
                <Trans>Disable Profile Wide Content Warnings</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="split_moderation_label_grouping"
            label={l`Split moderation label grouping`}
            value={splitModerationlabelGrouping}
            onChange={value => setSplitModerationlabelGrouping(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={Filter} />
              <SettingsList.ItemText>
                <Trans>Decouple Moderation Label Grouping</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          <Toggle.Item
            name="like_on_repost"
            label={l`Like on repost`}
            value={likeOnRepost}
            onChange={value => setLikeOnRepost(value)}>
            <SettingsList.Item>
              <SettingsList.ItemIcon icon={Filter} />
              <SettingsList.ItemText>
                <Trans>Like on Repost</Trans>
              </SettingsList.ItemText>
              <Toggle.Platform />
            </SettingsList.Item>
          </Toggle.Item>

          {devModeEnabled && (
            <Toggle.Item
              name="disable_profile_descriptions"
              label={l`Disable Profile Descriptions`}
              value={disableProfileDescriptions}
              onChange={value => setDisableProfileDescriptions(value)}>
              <SettingsList.Item>
                <SettingsList.ItemIcon icon={Message} />
                <SettingsList.ItemText>
                  <Trans>Disable Profile Descriptions</Trans>
                </SettingsList.ItemText>
                <Toggle.Platform />
              </SettingsList.Item>
            </Toggle.Item>
          )}

          {IS_NATIVE && <SettingsList.Divider />}

          {IS_NATIVE && (
            <Toggle.Item
              name="disable_share-via-dms"
              label={l`Disable 'Share Via DMs' in Share Menu`}
              value={disableShareViaDms}
              onChange={value => setDisableShareViaDms(value)}>
              <SettingsList.Item>
                <SettingsList.ItemIcon icon={PhoneIcon} />
                <SettingsList.ItemText>
                  <Trans>Disable 'Share Via DMs' in Share Menu</Trans>
                </SettingsList.ItemText>
                <Toggle.Platform />
              </SettingsList.Item>
            </Toggle.Item>
          )}

          {IS_NATIVE && (
            <Toggle.Item
              name="hide_new_post_button"
              label={l`Hide New Post button`}
              value={limitComposePostButton}
              onChange={value => setLimitComposePostButton(value)}>
              <SettingsList.Item>
                <SettingsList.ItemIcon icon={WindowIcon} />
                <SettingsList.ItemText>
                  <Trans>Hide New Post button</Trans>
                </SettingsList.ItemText>
                <Toggle.Platform />
              </SettingsList.Item>
            </Toggle.Item>
          )}

          <SettingsList.Divider />

          <SettingsList.Group contentContainerStyle={[a.gap_sm]}>
            <SettingsList.ItemIcon icon={RaisingHandIcon} />
            <SettingsList.ItemText>
              <Trans>Labelers</Trans>
            </SettingsList.ItemText>
            <Toggle.Item
              name="no_app_labelers"
              label={l`Do not declare any app labelers`}
              value={noAppLabelers}
              onChange={value => setNoAppLabelers(value)}
              style={[a.w_full]}>
              <Toggle.LabelText style={[a.flex_1]}>
                <Trans>Do not declare any default app labelers</Trans>
              </Toggle.LabelText>
              <Toggle.Platform />
            </Toggle.Item>
            <Admonition type="warning" style={[a.flex_1]}>
              <Trans>Restart app after changing this setting.</Trans>
            </Admonition>
          </SettingsList.Group>
        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}
