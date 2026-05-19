import {Provider as AltTextRequiredProvider} from './alt-text-required'
import {Provider as AltLabelDisplayProfile} from './alternate-label-display-profile'
import {Provider as AutoplayProvider} from './autoplay'
import {Provider as DisableComposerPromptInFeeds} from './disable-composer-prompt-in-feeds'
import {Provider as DisableFeedPromoTab} from './disable-feed-promo-tab'
import {Provider as DisableFollowbackBIN} from './disable-followback-BIN'
import {Provider as DisableHapticsProvider} from './disable-haptics'
import {Provider as DisableProfileDescriptions} from './disable-profile-descriptions'
import {Provider as DisableShareViaDms} from './disable-share-via-dms'
import {Provider as ToggleShareViaDID} from './enable-share-by-DID'
import {Provider as EnableSquareAvatars} from './enable-square-avatars'
import {Provider as ExternalEmbedsProvider} from './external-embeds-prefs'
import {Provider as GateOverridesProvider} from './gateOverrides'
import {Provider as HiddenPostsProvider} from './hidden-posts'
import {Provider as ImpressionVisibilityProvider} from './impression-visibility'
import {Provider as InAppBrowserProvider} from './in-app-browser'
import {Provider as KawaiiProvider} from './kawaii'
import {Provider as LanguagesProvider} from './languages'
import {Provider as LargeAltBadgeProvider} from './large-alt-badge'
import {Provider as LimitComposePostButton} from './limit-compose-post-button'
import {Provider as NoAppLabelersProvider} from './no-app-labelers'
import {Provider as ProfileTabVisibilityPrefs} from './profile-tab-visibility'
import {Provider as SimilarAccountProvider} from './similar-accounts'
import {Provider as SkipProfileWideContentWarning} from './skip-profile-wide-content-warning'
import {Provider as SplitModerationLabelGrouping} from './split-moderation-label-grouping'
import {Provider as SubtitlesProvider} from './subtitles'
import {Provider as TrendingSettingsProvider} from './trending'
import {Provider as UsedStarterPacksProvider} from './used-starter-packs'

export {
  useRequireAltTextEnabled,
  useSetRequireAltTextEnabled,
} from './alt-text-required'
export {useAutoplayDisabledPref, useSetAutoplayDisabledPref} from './autoplay'
export {useHapticsDisabled, useSetHapticsDisabled} from './disable-haptics'
export {
  useExternalEmbedsPrefs,
  useSetExternalEmbedPref,
} from './external-embeds-prefs'
export {useHiddenPosts, useHiddenPostsApi} from './hidden-posts'
export {useLabelDefinitions} from './label-defs'
export {useLanguagePrefs, useLanguagePrefsApi} from './languages'
export {
  useSetSimilarAccountsDisabled,
  useSimilarAccountsDisabled,
} from './similar-accounts'
export {
  useSetSkipProfileWideContentWarning,
  useSkipProfileWideContentWarning,
} from './skip-profile-wide-content-warning'
export {useSetSubtitlesEnabled, useSubtitlesEnabled} from './subtitles'

export function Provider({children}: React.PropsWithChildren<{}>) {
  return (
    <LanguagesProvider>
      <AltTextRequiredProvider>
        <LargeAltBadgeProvider>
          <ExternalEmbedsProvider>
            <HiddenPostsProvider>
              <InAppBrowserProvider>
                <DisableHapticsProvider>
                  <AutoplayProvider>
                    <UsedStarterPacksProvider>
                      <SubtitlesProvider>
                        <TrendingSettingsProvider>
                          <SimilarAccountProvider>
                            <LimitComposePostButton>
                              <AltLabelDisplayProfile>
                                <DisableFollowbackBIN>
                                  <DisableShareViaDms>
                                    <ToggleShareViaDID>
                                      <DisableFeedPromoTab>
                                        <ProfileTabVisibilityPrefs>
                                          <EnableSquareAvatars>
                                            <DisableComposerPromptInFeeds>
                                              <NoAppLabelersProvider>
                                                <GateOverridesProvider>
                                                  <ImpressionVisibilityProvider>
                                                    <DisableProfileDescriptions>
                                                      <SkipProfileWideContentWarning>
                                                        <SplitModerationLabelGrouping>
                                                          <KawaiiProvider>
                                                            {children}
                                                          </KawaiiProvider>
                                                        </SplitModerationLabelGrouping>
                                                      </SkipProfileWideContentWarning>
                                                    </DisableProfileDescriptions>
                                                  </ImpressionVisibilityProvider>
                                                </GateOverridesProvider>
                                              </NoAppLabelersProvider>
                                            </DisableComposerPromptInFeeds>
                                          </EnableSquareAvatars>
                                        </ProfileTabVisibilityPrefs>
                                      </DisableFeedPromoTab>
                                    </ToggleShareViaDID>
                                  </DisableShareViaDms>
                                </DisableFollowbackBIN>
                              </AltLabelDisplayProfile>
                            </LimitComposePostButton>
                          </SimilarAccountProvider>
                        </TrendingSettingsProvider>
                      </SubtitlesProvider>
                    </UsedStarterPacksProvider>
                  </AutoplayProvider>
                </DisableHapticsProvider>
              </InAppBrowserProvider>
            </HiddenPostsProvider>
          </ExternalEmbedsProvider>
        </LargeAltBadgeProvider>
      </AltTextRequiredProvider>
    </LanguagesProvider>
  )
}
