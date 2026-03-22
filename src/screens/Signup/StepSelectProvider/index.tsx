import {useEffect, useState} from 'react'
import {Pressable, View} from 'react-native'
import {msg} from '@lingui/core/macro'
import {Trans} from '@lingui/react/macro'
import {useLingui} from '@lingui/react'

import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as TextField from '#/components/forms/TextField'
import {Globe_Stroke2_Corner0_Rounded as Globe} from '#/components/icons/Globe'
import {Text} from '#/components/Typography'
import {useSignupContext} from '#/screens/Signup/state'
import {IS_WEB} from '#/env'
import {InlineLinkText} from '#/components/Link'

type Provider = {
  serviceUrl: string
  name: string
  description?: string
  recommended?: boolean
  inviteOnly?: boolean
}

const PROVIDERS: Provider[] = [
  {
    serviceUrl: 'https://bsky.social',
    name: 'Bluesky',
    description: 'The most popular choice, works with everything',
    recommended: true,
  },
  {
    serviceUrl: 'https://selfhosted.social',
    name: 'selfhosted.social',
    description: 'Independent, community-run',
  },
  // {
  //   serviceUrl: 'https://transrights.northsky.social',
  //   name: 'NorthSky',
  //   description: '',
  //   inviteOnly: true,
  // },
  // {
  //   serviceUrl: 'https://pds.witchcraft.systems',
  //   name: 'witchcraft.systems',
  //   description: 'A witchy corner of the atmosphere',
  //   inviteOnly: true,
  // },
]

export function StepSelectProvider({onPressBack}: {onPressBack: () => void}) {
  const {_} = useLingui()
  const t = useTheme()
  const {state, dispatch} = useSignupContext()
  const [serviceUrl, setServiceUrl] = useState('https://bsky.social')

  const [bskyWebDisabled, setBskyWebDisabled] = useState(false)

  useEffect(() => {
    if (IS_WEB && state.serviceDescription?.phoneVerificationRequired) {
      setBskyWebDisabled(true)
      setServiceUrl('https://selfhosted.social')
    }
  }, [state.serviceDescription])

  const onNext = () => {
    let url = serviceUrl.trim().toLowerCase()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    dispatch({type: 'setServiceUrl', value: url})
    dispatch({type: 'next'})
  }

  const isPreset = PROVIDERS.find(p => p.serviceUrl === serviceUrl)

  return (
    <View style={[a.flex_1, a.gap_md]}>
      <Text style={[a.text_md, t.atoms.text_contrast_medium]}>
        <Trans>
          Your account lives on a server. Choose a provider below, or enter
          your own.
        </Trans>
      </Text>

      {bskyWebDisabled && (
        <View
          style={[
            a.rounded_md,
            a.border,
            a.px_lg,
            a.py_md,
            {
              borderColor: t.palette.primary_300,
              backgroundColor: t.palette.primary_25,
            },
          ]}>
          <Text style={[a.text_sm, a.font_semi_bold, {color: t.palette.primary_600}]}>
            <Trans>Bluesky account creation isn't supported in the browser. Visit </Trans>
            <InlineLinkText
              label="bsky.app/signup"
              to="https://bsky.app/signup">
              bsky.app/signup
            </InlineLinkText>
            <Trans> to create your account, then sign in here.</Trans>
          </Text>
        </View>
      )}

      <View style={[a.gap_sm]}>
        {PROVIDERS.map(provider => {
          const isSelected = serviceUrl === provider.serviceUrl
          const isDisabled = provider.serviceUrl === 'https://bsky.social' && bskyWebDisabled
          return (
            <Pressable
              key={provider.serviceUrl}
              accessibilityRole="radio"
              accessibilityState={{checked: isSelected}}
              accessibilityLabel={provider.name}
              onPress={() => !isDisabled && setServiceUrl(provider.serviceUrl)}
              style={[
                a.rounded_md,
                a.border,
                a.px_lg,
                a.py_md,
                a.flex_row,
                a.align_center,
                a.gap_md,
                isDisabled
                  ? [t.atoms.border_contrast_low, {opacity: 0.5}]
                  : isSelected
                  ? {
                      borderColor: t.palette.primary_500,
                      backgroundColor: t.palette.primary_25,
                    }
                  : t.atoms.border_contrast_low,
              ]}>
              <View style={[a.flex_1, a.gap_xs]}>
                <View style={[a.flex_row, a.align_center, a.gap_sm]}>
                  <Text style={[a.font_semi_bold]}>{provider.name}</Text>
                  {provider.recommended && (
                    <View
                      style={[
                        a.rounded_xs,
                        a.px_xs,
                        a.py_2xs,
                        {backgroundColor: t.palette.primary_100},
                      ]}>
                      <Text
                        style={[
                          a.text_xs,
                          a.font_semi_bold,
                          {color: t.palette.primary_600},
                        ]}>
                        <Trans>Recommended</Trans>
                      </Text>
                    </View>
                  )}
                  {provider.inviteOnly && (
                    <View
                      style={[
                        a.rounded_xs,
                        a.px_xs,
                        a.py_2xs,
                        {backgroundColor: t.palette.contrast_100},
                      ]}>
                      <Text
                        style={[
                          a.text_xs,
                          a.font_semi_bold,
                          t.atoms.text_contrast_medium,
                        ]}>
                        <Trans>Invite only</Trans>
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={[a.text_sm, t.atoms.text_contrast_medium]}>
                  {provider.description}
                </Text>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: isSelected
                    ? t.palette.primary_500
                    : t.palette.contrast_300,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {isSelected && (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: t.palette.primary_500,
                    }}
                  />
                )}
              </View>
            </Pressable>
          )
        })}
      </View>

      {/* URL field — always visible, populated by cards or typed manually */}
      <View>
        <TextField.LabelText>
          <Trans>Server address</Trans>
        </TextField.LabelText>
        <TextField.Root>
          <TextField.Icon icon={Globe} />
          <TextField.Input
            value={serviceUrl}
            onChangeText={setServiceUrl}
            label={_(msg`e.g. bsky.social`)}
            autoCapitalize="none"
            keyboardType="url"
            autoCorrect={false}
          />
        </TextField.Root>
      </View>

      <View style={[a.flex_row, a.gap_sm, a.pt_md, a.pb_2xl]}>
        <Button
          variant="outline"
          color="secondary"
          size="large"
          label={_(msg`Back`)}
          onPress={onPressBack}
          style={[a.flex_1]}>
          <ButtonText>
            <Trans>Back</Trans>
          </ButtonText>
        </Button>
        <Button
          variant="solid"
          color="primary"
          size="large"
          label={_(msg`Next`)}
          onPress={onNext}
          style={[a.flex_1]}>
          <ButtonText>
            <Trans>Next</Trans>
          </ButtonText>
        </Button>
      </View>
    </View>
  )
}