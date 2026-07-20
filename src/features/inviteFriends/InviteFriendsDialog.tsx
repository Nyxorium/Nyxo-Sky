import * as Dialog from '#/components/Dialog'
import {InviteFriendsDialogInner} from './InviteFriendsDialogInner'

export function InviteFriendsDialog({
  control,
  onClose,
  did,
}: {
  control: Dialog.DialogControlProps
  onClose?: () => void
  did?: string
}) {
  return (
    <Dialog.Outer
      control={control}
      onClose={onClose}
      nativeOptions={{preventExpansion: true}}>
      <InviteFriendsDialogInner control={control} did={did} />
    </Dialog.Outer>
  )
}
