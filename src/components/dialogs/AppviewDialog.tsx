import {useState} from 'react'
import {View} from 'react-native'
import {Trans, useLingui} from '@lingui/react/macro'

import {
  APPVIEW_PRESETS,
  CAN_AUTO_RESTART,
  DID_RE,
  getActiveAppviewDid,
  getStoredAppviewDid,
  setAppviewOverride,
} from '#/state/appview-override'
import {getAppviewLabel} from '#/state/appview-override'
import {atoms as a, useTheme} from '#/alf'
import {Button, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import * as SegmentedControl from '#/components/forms/SegmentedControl'
import * as TextField from '#/components/forms/TextField'
import {TinyChevronBottom_Stroke2_Corner0_Rounded as TinyChevronDownIcon} from '#/components/icons/TinyChevronBottom'
import {Text} from '#/components/Typography'

type Mode = 'bluesky' | 'eurosky' | 'custom'

function modeFor(did: string): Mode {
  if (did === APPVIEW_PRESETS.bluesky) return 'bluesky'
  if (did === APPVIEW_PRESETS.eurosky) return 'eurosky'
  return 'custom'
}

export function AppviewDialog({control}: {control: Dialog.DialogControlProps}) {
  return (
    <Dialog.Outer control={control} testID="appviewDialog">
      <Dialog.Handle />
      <Inner />
    </Dialog.Outer>
  )
}

function Inner() {
  const {t: l} = useLingui()
  const t = useTheme()
  const active = getActiveAppviewDid()
  const [stored, setStored] = useState(getStoredAppviewDid())
  const [mode, setMode] = useState<Mode>(modeFor(stored))
  const [custom, setCustom] = useState(
    modeFor(stored) === 'custom' ? stored : '',
  )

  const did = mode === 'custom' ? custom.trim() : APPVIEW_PRESETS[mode]
  const valid = DID_RE.test(did)
  const dirty = did !== stored
  const pending = stored !== active

  const onConfirm = () => {
    setAppviewOverride(did === APPVIEW_PRESETS.bluesky ? null : did)
    setStored(did)
    if (CAN_AUTO_RESTART) window.location.reload()
  }

  return (
    <Dialog.ScrollableInner label="Choose your app server">
      <View style={[a.gap_lg]}>
        <Text style={[a.text_2xl, a.font_bold]}>Choose your app server</Text>

        <SegmentedControl.Root
          label={l`App server`}
          type="radio"
          value={mode}
          onChange={v => setMode(v)}>
          <SegmentedControl.Item label={l`Bluesky`} value="bluesky">
            <SegmentedControl.ItemText>Bluesky</SegmentedControl.ItemText>
          </SegmentedControl.Item>
          <SegmentedControl.Item label={l`Eurosky`} value="eurosky">
            <SegmentedControl.ItemText>Eurosky</SegmentedControl.ItemText>
          </SegmentedControl.Item>
          <SegmentedControl.Item label={l`Custom`} value="custom">
            <SegmentedControl.ItemText>
              <Trans>Custom</Trans>
            </SegmentedControl.ItemText>
          </SegmentedControl.Item>
        </SegmentedControl.Root>

        {mode === 'custom' && (
          <View style={[a.gap_xs]}>
            <TextField.Root>
              <TextField.Input
                label="Appview DID"
                value={custom}
                onChangeText={setCustom}
                placeholder="did:web:example.com"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </TextField.Root>
            {custom.trim().length > 0 && !valid && (
              <Text style={[a.text_sm, {color: t.palette.negative_500}]}>
                Needs to look like did:web:example.com
              </Text>
            )}
          </View>
        )}

        {!CAN_AUTO_RESTART && pending && (
          <Text style={[a.text_sm, t.atoms.text_contrast_medium]}>
            <Trans>
              Saved: {getAppviewLabel(stored)}. Fully close the app and reopen
              it to apply.
            </Trans>
          </Text>
        )}

        <Text style={[a.text_sm, a.leading_snug, t.atoms.text_contrast_medium]}>
          The AppView serves data such as posts, profiles, notifications, and
          other infomation. This does not affect your hosting provider or
          details in that regard.
        </Text>

        <Button
          label={CAN_AUTO_RESTART ? 'Restart' : 'Save'}
          onPress={onConfirm}
          disabled={!valid || !dirty}
          size="large"
          color="primary">
          <ButtonText>
            {CAN_AUTO_RESTART ? <Trans>Restart</Trans> : <Trans>Save</Trans>}
          </ButtonText>
        </Button>
      </View>
      <Dialog.Close />
    </Dialog.ScrollableInner>
  )
}

type Props = {variant: 'chip' | 'text'}

export function AppviewButton({variant}: Props) {
  const {t: l} = useLingui()
  const t = useTheme()
  const control = Dialog.useDialogControl()
  const current = getAppviewLabel(getActiveAppviewDid())

  return (
    <>
      <Button
        testID="selectAppviewButton"
        label={l`Choose app server`}
        accessibilityHint={l`Opens a dialog to change the app server`}
        onPress={() => control.open()}
        size="small"
        color="secondary"
        variant="ghost">
        <ButtonText
          style={[t.atoms.text_contrast_medium, a.font_normal]}
          numberOfLines={1}>
          {variant === 'chip' ? current : <Trans>App server</Trans>}
        </ButtonText>
        <TinyChevronDownIcon width={8} style={[t.atoms.text_contrast_medium]} />
      </Button>
      <AppviewDialog control={control} />
    </>
  )
}
