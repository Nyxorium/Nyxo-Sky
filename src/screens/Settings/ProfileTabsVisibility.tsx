import {msg, Trans} from '@lingui/macro'
import {useLingui} from '@lingui/react'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import * as Toggle from '#/components/forms/Toggle'
import { 
  useProfileTabVisibilityPref,
  useSetProfileTabVisibilityPref,
 } from '#/state/preferences/tabs-visibility-profiles'
import * as Layout from '#/components/Layout'
import {ItemTextWithSubtitle} from './NotificationSettings/components/ItemTextWithSubtitle'
import {Heart2_Stroke2_Corner0_Rounded as HeartIcon} from '#/components/icons/Heart2'
import {atoms as a, platform, useTheme} from '#/alf'
import {View} from 'react-native'
import {Divider} from './components/SettingsList'

type Props = NativeStackScreenProps<CommonNavigatorParams>

export function ProfileTabVisibilitySettingsScreen({}: Props) {
  const {_} = useLingui()
  const t = useTheme()

  const {
    postsProfileTab,
    repliesProfileTab,
    mediaProfileTab,
    videosProfileTab,
    feedsProfileTab,
    starterPacksProfileTab,
    listsProfileTab,

    postsProfileTab_self,
    repliesProfileTab_self,
    mediaProfileTab_self,
    videosProfileTab_self,
    likesProfileTab_self,
    feedsProfileTab_self,
    starterPacksProfileTab_self,
    listsProfileTab_self,
  } = useProfileTabVisibilityPref()

  const {
    setPostsProfileTab,
    setRepliesProfileTab,
    setMediaProfileTab,
    setVideosProfileTab,
    setFeedsProfileTab,
    setStarterPacksProfileTab,
    setListsProfileTab,

    setPostsProfileTab_self,
    setRepliesProfileTab_self,
    setMediaProfileTab_self,
    setVideosProfileTab_self,
    setLikesProfileTab_self,
    setFeedsProfileTab_self,
    setStarterPacksProfileTab_self,
    setListsProfileTab_self,
  } = useSetProfileTabVisibilityPref()


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
                <Trans>Toggle the visibility of various tabs found on your profile</Trans>
              }
            />
          </SettingsList.Item>
          <View style={[a.px_xl, a.pt_md, a.gap_sm]}>
              <View style={[a.gap_sm]}>
                <Toggle.Item
                  label={_(msg`Posts`)}
                  name="hide_on_own_posts"
                  value={!postsProfileTab_self}
                  onChange={value => setPostsProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Posts</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Replies`)}
                  name="hide_on_own_replies"
                  value={!repliesProfileTab_self}
                  onChange={value => setRepliesProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Replies</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Media`)}
                  name="hide_on_own_media"
                  value={!mediaProfileTab_self}
                  onChange={value => setMediaProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Media</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Videos`)}
                  name="hide_on_own_videos"
                  value={!videosProfileTab_self}
                  onChange={value => setVideosProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Videos</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Likes`)}
                  name="hide_on_own_likes"
                  value={!likesProfileTab_self}
                  onChange={value => setLikesProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Likes</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Feeds`)}
                  name="hide_on_own_feeds"
                  value={!feedsProfileTab_self}
                  onChange={value => setFeedsProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Feeds</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Starter Packs`)}
                  name="hide_on_own_starter_packs"
                  value={!starterPacksProfileTab_self}
                  onChange={value => setStarterPacksProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Starter Packs</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Lists`)}
                  name="hide_on_own_lists"
                  value={!listsProfileTab_self}
                  onChange={value => setListsProfileTab_self(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Lists</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

              </View>
            <Divider />
          </View>



          <SettingsList.Item style={[a.align_start]}>
            <SettingsList.ItemIcon icon={HeartIcon} />
            <ItemTextWithSubtitle
              bold
              titleText={<Trans>Tabs on other profiles</Trans>}
              subtitleText={
                <Trans>Toggle the visibility of various tabs found on other profiles</Trans>
              }
            />
          </SettingsList.Item>
          <View style={[a.px_xl, a.pt_md, a.gap_sm]}>
              <View style={[a.gap_sm]}>
                <Toggle.Item
                  label={_(msg`Posts`)}
                  name="hide_on_own_posts"
                  value={!postsProfileTab}
                  onChange={value => setPostsProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Posts</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Replies`)}
                  name="hide_on_own_replies"
                  value={!repliesProfileTab}
                  onChange={value => setRepliesProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Replies</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Media`)}
                  name="hide_on_own_media"
                  value={!mediaProfileTab}
                  onChange={value => setMediaProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Media</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Videos`)}
                  name="hide_on_own_videos"
                  value={!videosProfileTab}
                  onChange={value => setVideosProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Videos</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Feeds`)}
                  name="hide_on_own_feeds"
                  value={!feedsProfileTab}
                  onChange={value => setFeedsProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Feeds</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Starter Packs`)}
                  name="hide_on_own_starter_packs"
                  value={!starterPacksProfileTab}
                  onChange={value => setStarterPacksProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Starter Packs</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

                <Toggle.Item
                  label={_(msg`Lists`)}
                  name="hide_on_own_lists"
                  value={!listsProfileTab}
                  onChange={value => setListsProfileTab(!value)}
                  style={[
                    a.py_xs,
                    platform({
                      native: [a.justify_between],
                      web: [a.flex_row_reverse, a.gap_sm],
                    }),
                  ]}>
                  <Toggle.LabelText
                    style={[t.atoms.text, a.font_normal, a.text_md, a.flex_1]}>
                    <Trans>Lists</Trans>
                  </Toggle.LabelText>
                  <Toggle.Platform />
                </Toggle.Item>

              </View>
            <Divider />
          </View>

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