import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'
import {type NativeStackScreenProps} from '@react-navigation/native-stack'

import {type CommonNavigatorParams} from '#/lib/routes/types'
import {
  type ImpressionVisibilityKey,
  useImpressionVisibilityPrefs,
  useSetImpressionVisibility,
} from '#/state/preferences/impression-visibility'
import * as SettingsList from '#/screens/Settings/components/SettingsList'
import {BubbleInfo_Stroke2_Corner2_Rounded as BubbleInfoIcon} from '#/components/icons/BubbleInfo'
import {Person_Stroke2_Corner2_Rounded as PersonIcon,} from '#/components/icons/Person'
import * as Layout from '#/components/Layout'
import {
  type ImpressionConfig,
  ImpressionSection,
} from './ImpressionSection'

type Props = NativeStackScreenProps<CommonNavigatorParams>

const FEED_IMPRESSIONS: ImpressionConfig[] = [
  {key: 'feedLikes', label: 'Likes'},
]

export function ImpressionVisibilitySettingsScreen({}: Props) {
  const {_} = useLingui()
  const prefs = useImpressionVisibilityPrefs()
  const setVisibility = useSetImpressionVisibility()

  const getOwnValue = (key: ImpressionVisibilityKey) => {
    const v = prefs[key] ?? 'show'
    return v === 'hideOwn' || v === 'hideAll'
  }

  const getOthersValue = (key: ImpressionVisibilityKey) => {
    const v = prefs[key] ?? 'show'
    return v === 'hideOthers' || v === 'hideAll'
  }

  const onToggleOwn = (key: ImpressionVisibilityKey, val: boolean) => {
    const othersChecked = getOthersValue(key)
    setVisibility(
      key,
      val
        ? othersChecked
          ? 'hideAll'
          : 'hideOwn'
        : othersChecked
          ? 'hideOthers'
          : 'show',
    )
  }

  const onToggleOthers = (key: ImpressionVisibilityKey, val: boolean) => {
    const ownChecked = getOwnValue(key)
    setVisibility(
      key,
      val
        ? ownChecked
          ? 'hideAll'
          : 'hideOthers'
        : ownChecked
          ? 'hideOwn'
          : 'show',
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

          <SettingsList.LinkItem
            to="/settings/impression-visibility/posts"
            label={_(msg`Post impressions`)}>
            <SettingsList.ItemIcon icon={BubbleInfoIcon} />
            <SettingsList.ItemText>
              <Trans>Post Impressions</Trans>
            </SettingsList.ItemText>
          </SettingsList.LinkItem>

          <SettingsList.LinkItem
            to="/settings/impression-visibility/profiles"
            label={_(msg`Profile statistics`)}>
            <SettingsList.ItemIcon icon={PersonIcon} />
            <SettingsList.ItemText>
              <Trans>Profile Statistics</Trans>
            </SettingsList.ItemText>
          </SettingsList.LinkItem>

          <SettingsList.Divider />

          <ImpressionSection
            titleText={<Trans>Feed Likes</Trans>}
            subtitleText={<Trans>Show like counts on feeds</Trans>}
            impressions={FEED_IMPRESSIONS}
            getOwnValue={getOwnValue}
            getOthersValue={getOthersValue}
            onToggleOwn={onToggleOwn}
            onToggleOthers={onToggleOthers}
          />

        </SettingsList.Container>
      </Layout.Content>
    </Layout.Screen>
  )
}