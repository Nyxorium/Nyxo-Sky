import {useState} from 'react'
import {Keyboard, Pressable, TextInput, View} from 'react-native'
import {msg} from '@lingui/core/macro'
import {useLingui} from '@lingui/react'
import {Trans} from '@lingui/react/macro'

import {useRecentTags, useRecentTagsApi} from '#/state/preferences'
import {atoms as a, useTheme, web} from '#/alf'
import {
  Button as Btn,
  Button,
  ButtonIcon,
  ButtonText as BtnText,
  ButtonText,
} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {Check_Stroke2_Corner0_Rounded as Check} from '#/components/icons/Check'
import {TinyChevronBottom_Stroke2_Corner0_Rounded as TinyChevronIcon} from '#/components/icons/Chevron'
import {Hashtag_Stroke2_Corner0_Rounded as HashtagIcon} from '#/components/icons/Hashtag'
import {Text} from '#/components/Typography'
import {IS_WEB} from '#/env'

const MAX_TAGS = 8
const MAX_TAG_LENGTH = 64
const MAX_RECENT_SHOWN = 10

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

function RecentTagChip({
  tag,
  disabled,
  onAdd,
  onDelete,
}: {
  tag: string
  disabled: boolean
  onAdd: () => void
  onDelete: () => void
}) {
  const t = useTheme()
  const {_} = useLingui()

  return (
    <View style={[a.flex_row, a.align_center]}>
      {/* Tag label — uses Button for consistent styling, right radius zeroed to merge with delete zone */}
      <Button
        label={disabled ? tag : _(msg`Add tag ${tag}`)}
        onPress={onAdd}
        color="secondary"
        size="small"
        variant="solid"
        disabled={disabled}
        style={[
          {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            opacity: disabled ? 0.4 : 1,
          },
        ]}>
        <ButtonText>{tag}</ButtonText>
      </Button>

      {/* Delete zone — left radius zeroed to merge with Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={_(msg`Remove ${tag} from recent tags`)}
        accessibilityHint=""
        onPress={onDelete}
        style={({pressed, hovered}: {pressed: boolean; hovered?: boolean}) => [
          a.justify_center,
          a.align_center,
          {
            // Match Button's small size padding and height
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderTopRightRadius: 999,
            borderBottomRightRadius: 999,
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor:
              pressed || hovered
                ? t.palette.negative_400 + '33'
                : t.atoms.bg_contrast_50.backgroundColor,
            opacity: disabled ? 0.4 : 1,
          },
        ]}>
        <Text
          style={[
            a.text_sm,
            a.font_medium,
            a.leading_snug,
            {
              color: t.atoms.text_contrast_medium.color,
            },
          ]}>
          ×
        </Text>
      </Pressable>
    </View>
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
  const [recentExpanded, setRecentExpanded] = useState(false)
  const recentTags = useRecentTags()
  const {addRecentTag, removeRecentTag} = useRecentTagsApi()

  // Snapshot recents on mount so the list stays frozen for this dialog session.
  // Writes to persisted state still happen immediately, but the displayed list
  // won't shift while the user is actively typing or tapping chips.
  const [snapshotRecents, setSnapshotRecents] = useState<string[]>(() =>
    recentTags.slice(0, MAX_RECENT_SHOWN),
  )

  const inputTooLong = input.length > MAX_TAG_LENGTH

  const updateTags = (next: string[]) => {
    setLocalTags(next)
    onChange(next)
  }

  const addTag = (raw: string) => {
    const cleaned = cleanTag(raw)
    if (!cleaned) return
    if (cleaned.length > MAX_TAG_LENGTH) return
    if (localTags.some(t => t.toLowerCase() === cleaned.toLowerCase())) {
      setInput('')
      return
    }
    if (localTags.length >= MAX_TAGS) {
      setInput('')
      return
    }
    updateTags([...localTags, cleaned])
    addRecentTag(cleaned)
    setInput('')
  }

  const removeTag = (tag: string) => {
    updateTags(localTags.filter(t => t !== tag))
  }

  const deleteRecentTag = (tag: string) => {
    removeRecentTag(tag)
    setSnapshotRecents(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== tag.toLowerCase())
      const next = recentTags.find(
        t =>
          !filtered.some(s => s.toLowerCase() === t.toLowerCase()) &&
          t.toLowerCase() !== tag.toLowerCase(),
      )
      return next ? [...filtered, next] : filtered
    })
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

      {/* Current post tag chips */}
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
            accessibilityHint=""
            accessibilityLabel="Text input field"
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

      {/* Recently used tags */}
      {snapshotRecents.length > 0 && (
        <View style={[a.mt_lg]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={_(msg`Recently used tags`)}
            accessibilityHint={_(
              msg`${recentExpanded ? 'Collapse' : 'Expand'} recently used tags`,
            )}
            onPress={() => setRecentExpanded(e => !e)}
            style={[a.flex_row, a.align_center, a.gap_xs, a.mb_sm]}>
            <Text
              style={[
                a.text_sm,
                a.font_semi_bold,
                t.atoms.text_contrast_medium,
              ]}>
              <Trans>Recently used</Trans>
            </Text>
            <TinyChevronIcon
              size="2xs"
              style={[
                t.atoms.text_contrast_medium,
                {
                  transform: [{rotate: recentExpanded ? '0deg' : '-90deg'}],
                },
              ]}
            />
          </Pressable>

          {recentExpanded && (
            <View style={[a.flex_row, a.flex_wrap, a.gap_xs]}>
              {snapshotRecents.map(tag => {
                const alreadyAdded = localTags.some(
                  t => t.toLowerCase() === tag.toLowerCase(),
                )
                return (
                  <RecentTagChip
                    key={tag}
                    tag={tag}
                    disabled={alreadyAdded}
                    onAdd={() => addTag(tag)}
                    onDelete={() => deleteRecentTag(tag)}
                  />
                )
              })}
            </View>
          )}
        </View>
      )}

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
