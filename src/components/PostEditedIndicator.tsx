import {View} from 'react-native'
import {type AppBskyFeedPost} from '@atproto/api'
import {Trans, useLingui} from '@lingui/react/macro'

import {getPostEditInfo} from '#/lib/edit-post'
import {atoms as a, useTheme, web} from '#/alf'
import {Button} from '#/components/Button'
import * as Dialog from '#/components/Dialog'
import {Pencil_Stroke2_Corner0_Rounded as PencilIcon} from '#/components/icons/Pencil'
import {Text} from '#/components/Typography'

/**
 * The "· Edited" badge next to a post's timestamp. Renders nothing unless the
 * post was edited; tapping it opens the original-vs-current history.
 */
export function PostEditedIndicator({
  record,
  size = 'md',
  standalone,
  compact,
}: {
  record: AppBskyFeedPost.Record
  size?: 'sm' | 'md'
  standalone?: boolean
  compact?: boolean
}) {
  const t = useTheme()
  const {t: l} = useLingui()
  const control = Dialog.useDialogControl()
  const {isEdited, originalText, updatedAt} = getPostEditInfo(record)

  if (!isEdited) return null

  if (standalone) {
    return (
      <>
        <Button
          label={l`View edit history`}
          accessibilityHint={l`Opens the original and edited versions of this post`}
          onPress={e => {
            e.preventDefault()
            e.stopPropagation()
            control.open()
          }}>
          {({hovered, pressed}) => (
            <View
              style={[
                a.flex_row,
                a.align_center,
                a.rounded_full,
                t.atoms.bg_contrast_25,
                (hovered || pressed) && t.atoms.bg_contrast_50,
                {
                  gap: 3,
                  paddingHorizontal: 6,
                  paddingVertical: compact ? 0 : 3,
                },
              ]}>
              <PencilIcon
                size="sm"
                style={[t.atoms.text_contrast_medium]}
                aria-hidden
              />
              <Text
                style={[
                  a.text_xs,
                  a.font_semi_bold,
                  a.leading_tight,
                  t.atoms.text_contrast_medium,
                ]}>
                <Trans>Edited</Trans>
              </Text>
            </View>
          )}
        </Button>
        <PostEditHistoryDialog
          control={control}
          originalText={originalText}
          currentText={record.text}
          createdAt={record.createdAt}
          updatedAt={updatedAt}
        />
      </>
    )
  }

  return (
    <>
      <Text
        accessibilityRole="button"
        accessibilityLabel={l`View edit history`}
        accessibilityHint={l`Opens the original and edited versions of this post`}
        onPress={() => control.open()}
        style={[
          a.pl_xs,
          size === 'sm' ? a.text_sm : a.text_md,
          a.leading_tight,
          t.atoms.text_contrast_medium,
          web({whiteSpace: 'nowrap', cursor: 'pointer'}),
        ]}>
        <Trans context="Indicates a post has been edited">· Edited</Trans>
      </Text>
      <PostEditHistoryDialog
        control={control}
        originalText={originalText}
        currentText={record.text}
        createdAt={record.createdAt}
        updatedAt={updatedAt}
      />
    </>
  )
}

function PostEditHistoryDialog({
  control,
  originalText,
  currentText,
  createdAt,
  updatedAt,
}: {
  control: Dialog.DialogControlProps
  originalText: string | undefined
  currentText: string
  createdAt: string
  updatedAt: string | undefined
}) {
  const t = useTheme()
  const {t: l, i18n} = useLingui()

  return (
    <Dialog.Outer control={control}>
      <Dialog.Handle />
      <Dialog.ScrollableInner label={l`Edit history`}>
        <Dialog.Header>
          <Dialog.HeaderText>
            <Trans>Edit history</Trans>
          </Dialog.HeaderText>
        </Dialog.Header>
        <View style={[a.pt_lg]}>
          <TimelineEntry
            isCurrent
            label={
              updatedAt
                ? l`Current · ${i18n.date(new Date(updatedAt), {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}`
                : l`Current`
            }
            text={currentText}
          />
          <TimelineEntry
            isLast
            label={l`Original · ${i18n.date(new Date(createdAt), {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}`}
            text={originalText ?? ''}
          />
        </View>
        <Text style={[a.text_xs, a.pt_md, t.atoms.text_contrast_medium]}>
          <Trans>
            Edit history is only shown for posts edited using compatible
            clients. Posts edited on other platforms may not display history
            here.
          </Trans>
        </Text>
        <Dialog.Close />
      </Dialog.ScrollableInner>
    </Dialog.Outer>
  )
}

function TimelineEntry({
  label,
  text,
  isCurrent = false,
  isLast = false,
}: {
  label: string
  text: string
  isCurrent?: boolean
  isLast?: boolean
}) {
  const t = useTheme()
  return (
    <View style={[a.flex_row, a.gap_md]}>
      <View style={[a.align_center, {width: 12}]}>
        <View
          style={[
            {width: 12, height: 12, borderRadius: 999, marginTop: 3},
            isCurrent
              ? {backgroundColor: t.palette.primary_500}
              : [{borderWidth: 2}, t.atoms.border_contrast_high, t.atoms.bg],
          ]}
        />
        {!isLast && (
          <View
            style={[
              a.flex_1,
              {width: 2, marginTop: 3, backgroundColor: t.palette.contrast_200},
            ]}
          />
        )}
      </View>
      <View style={[a.flex_1, a.gap_xs, !isLast && a.pb_2xl]}>
        <Text style={[a.text_sm, a.font_bold, t.atoms.text_contrast_medium]}>
          {label}
        </Text>
        <Text emoji style={[a.text_md, a.leading_relaxed, t.atoms.text]}>
          {text}
        </Text>
      </View>
    </View>
  )
}
