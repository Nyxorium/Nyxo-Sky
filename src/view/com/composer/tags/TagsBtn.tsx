import {Keyboard, View} from 'react-native'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {atoms as a, useTheme, web} from '#/alf'
import {Button, ButtonIcon, ButtonText} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {Check_Stroke2_Corner0_Rounded as Check} from '#/components/icons/Check'
import {TinyChevronBottom_Stroke2_Corner0_Rounded as TinyChevronIcon} from '#/components/icons/Chevron'
import {Hashtag_Stroke2_Corner0_Rounded as HashtagIcon} from '#/components/icons/Hashtag'
import {Text} from '#/components/Typography'
import {Button as Btn, ButtonText as BtnText} from '#/components/Button'
import {IS_WEB} from '#/env'
import {useState} from 'react'
import {TextInput} from 'react-native'

const MAX_TAGS = 8
const MAX_TAG_LENGTH = 64

function cleanTag(raw: string): string {
  return raw.replace(/^#+/, '').trim().replace(/\s+/g, '')
}

export function TagsBtn({
  tags,
  onChange,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const control = Dialog.useDialogControl()
  const {_} = useLingui()
  const hasTags = (tags ?? []).length > 0

  return (
    <>
      <Button
        color="secondary"
        size="small"
        testID="tagsBtn"
        onPress={() => {
          Keyboard.dismiss()
          control.open()
        }}
        label={_(msg`Add tags`)}
        accessibilityHint={_(msg`Opens a dialog to add tags to your post`)}>
        <ButtonIcon icon={hasTags ? Check : HashtagIcon} />
        <ButtonText numberOfLines={1} maxFontSizeMultiplier={2}>
          {hasTags ? (
            <Trans>
              {tags.length} {tags.length === 1 ? 'Tag' : 'Tags'}
            </Trans>
          ) : (
            <Trans>Tags</Trans>
          )}
        </ButtonText>
        <ButtonIcon icon={TinyChevronIcon} size="2xs" />
      </Button>

      <Dialog.Outer
        control={control}
        nativeOptions={{preventExpansion: true}}
        webOptions={{alignCenter: true}}>
        <Dialog.Handle />
        <TagsDialogInner tags={tags} onChange={onChange} />
      </Dialog.Outer>
    </>
  )
}

function TagsDialogInner({
  tags: initialTags,
  onChange,
}: {
  tags: string[]
  onChange: (tags: string[]) => void
}) {
  const {_} = useLingui()
  const t = useTheme()
  const control = Dialog.useDialogContext()
  const [input, setInput] = useState('')
  const [localTags, setLocalTags] = useState<string[]>(initialTags)

  const inputTooLong = input.length > MAX_TAG_LENGTH

  const updateTags = (next: string[]) => {
    setLocalTags(next)
    onChange(next)
  }

  const addTag = (raw: string) => {
    const cleaned = cleanTag(raw)
    if (!cleaned) return
    if (cleaned.length > MAX_TAG_LENGTH) {
      return
    }
    if (localTags.some(t => t.toLowerCase() === cleaned.toLowerCase())) {
      setInput('')
      return
    }
    if (localTags.length >= MAX_TAGS) {
      setInput('')
      return
    }
    updateTags([...localTags, cleaned])
    setInput('')
  }

  const removeTag = (tag: string) => {
    updateTags(localTags.filter(t => t !== tag))
  }

  const onSubmitEditing = () => {
    if (input.trim()) addTag(input)
  }

  const onChangeText = (text: string) => {
    if (text.endsWith(',')) {
      addTag(text.slice(0, -1)) // strip the comma before adding
    } else {
      setInput(text)
    }
  }

  return (
    <Dialog.ScrollableInner
      label={_(msg`Add tags`)}
      style={[{maxWidth: 500}, a.w_full]}>
      <View style={[a.gap_sm]}>
        <Text style={[a.text_2xl, a.font_semi_bold]}>
          <Trans>Add tags</Trans>
        </Text>
        <Text style={[t.atoms.text_contrast_medium, a.leading_snug]}>
          <Trans>
            Tags help others discover your post. Up to {MAX_TAGS} tags allowed.
          </Trans>
        </Text>
      </View>

      {/* Chips */}
      {localTags.length > 0 && (
        <View style={[a.flex_row, a.flex_wrap, a.gap_xs, a.mt_md]}>
          {localTags.map(tag => (
            <Button
              key={tag}
              label={_(msg`Remove ${tag}`)}
              onPress={() => removeTag(tag)}
              color="secondary"
              size="small"
              variant="solid">
              <ButtonText>{tag}</ButtonText>
              <ButtonText style={[{opacity: 0.6}]}> ×</ButtonText>
            </Button>
          ))}
        </View>
      )}

      {/* Input */}
      <View style={[a.mt_md]}>
        <View
          style={[
            a.px_md,
            a.py_sm,
            a.rounded_sm,
            a.border,
            inputTooLong
              ? {borderColor: t.palette.negative_400}
              : t.atoms.border_contrast_medium,
            t.atoms.bg_contrast_25,
          ]}>
          <TextInput
            value={input}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            placeholder={
              localTags.length >= MAX_TAGS
                ? _(msg`Maximum tags reached`)
                : _(msg`Type a tag and press , or enter`)
            }
            placeholderTextColor={t.atoms.text_contrast_low.color}
            style={[t.atoms.text, {fontSize: 16}]}
            autoCapitalize="none"
            autoCorrect={false}
            submitBehavior="submit"
            returnKeyType="done"
          />
        </View>
        {inputTooLong && (
          <Text
            style={[
              a.text_sm,
              a.mt_xs,
              a.font_semi_bold,
              {color: t.palette.negative_400},
            ]}>
            <Trans>
              Tag is too long. The maximum number of characters is{' '}
              {MAX_TAG_LENGTH}.
            </Trans>
          </Text>
        )}
      </View>

      <View style={[a.mt_md, web([a.flex_row, a.ml_auto])]}>
        <Btn
          label={_(msg`Done`)}
          onPress={() => control.close()}
          color="primary"
          size={IS_WEB ? 'small' : 'large'}
          variant="solid"
          testID="tagsConfirmBtn">
          <BtnText>
            <Trans>Done</Trans>
          </BtnText>
        </Btn>
      </View>
    </Dialog.ScrollableInner>
  )
}
