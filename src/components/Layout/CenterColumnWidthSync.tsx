import {Fragment} from 'react'
import {useWindowDimensions} from 'react-native'

import {useViewTailorPrefs} from '#/state/preferences/view-tailor-prefs'
import {useSession} from '#/state/session'
import {useDevMode} from '#/storage/hooks/dev-mode'
import {DEFAULT_CENTER_COLUMN_WIDTH, setCenterColumnWidth} from './const'

export function CenterColumnWidthSync({children}: {children: React.ReactNode}) {
  const {tailors} = useViewTailorPrefs()
  const {hasSession} = useSession()
  const [devModeEnabled] = useDevMode()
  const {width: windowWidth} = useWindowDimensions()
  // Keeps width within slider min-max ranges of 300-900 - Sunstar
  const saved =
    hasSession && devModeEnabled
      ? Math.min(
          Math.max(tailors.columnWidth ?? DEFAULT_CENTER_COLUMN_WIDTH, 300),
          900,
        )
      : DEFAULT_CENTER_COLUMN_WIDTH

  // Smaller windows cause elements like left-nav to get cut off - Sunstar
  const width =
    saved > DEFAULT_CENTER_COLUMN_WIDTH
      ? Math.max(
          Math.min(saved, windowWidth - 200),
          DEFAULT_CENTER_COLUMN_WIDTH,
        )
      : saved

  setCenterColumnWidth(width)

  return <Fragment key={saved}>{children}</Fragment>
}
