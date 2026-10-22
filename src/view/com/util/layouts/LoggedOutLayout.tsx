import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native'

import {usePalette} from '#/lib/hooks/usePalette'
import {useWebMediaQueries} from '#/lib/hooks/useWebMediaQueries'
import {atoms as a, BreakpointWidthContext, useTheme} from '#/alf'
import {CENTER_COLUMN_WIDTH} from '#/components/Layout'
import {IS_NATIVE, IS_WEB} from '#/env'
import {Text} from '../text/Text'

export const LoggedOutLayout = ({
  leadin,
  title,
  description,
  children,
  scrollable,
}: React.PropsWithChildren<{
  leadin: string
  title: string
  description: string
  scrollable?: boolean
}>) => {
  const {isMobile, isTabletOrMobile} = useWebMediaQueries()
  const {width} = useWindowDimensions()
  const pal = usePalette('default')
  const t = useTheme()

  if (IS_NATIVE || isMobile) {
    const content = (
      <BreakpointWidthContext
        value={IS_NATIVE ? Math.min(width, CENTER_COLUMN_WIDTH) : undefined}>
        <View
          style={[
            scrollable && a.flex_1,
            a.pt_lg,
            IS_NATIVE && [
              a.w_full,
              a.self_center,
              {maxWidth: CENTER_COLUMN_WIDTH},
            ],
          ]}>
          {children}
        </View>
      </BreakpointWidthContext>
    )

    if (scrollable) {
      return (
        <ScrollView
          style={[a.flex_1, t.atoms.bg]}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          contentContainerStyle={[a.flex_grow]}>
          {content}
        </ScrollView>
      )
    } else {
      return content
      // return <View style={[a.pt_lg, t.atoms.bg]}>{children}</View> -- Sunstar
    }
  }
  return (
    <View style={styles.container}>
      <View style={[styles.side, t.atoms.bg_contrast_25]}>
        <Text
          style={[
            t.atoms.text_contrast_medium,
            styles.leadinText,
            isTabletOrMobile && styles.leadinTextSmall,
          ]}>
          {leadin}
        </Text>
        <Text
          style={[
            {color: t.palette.primary_500},
            styles.titleText,
            isTabletOrMobile && styles.titleTextSmall,
          ]}>
          {title}
        </Text>
        <Text type="2xl-medium" style={[pal.textLight, styles.descriptionText]}>
          {description}
        </Text>
      </View>
      {scrollable ? (
        <View
          style={[
            styles.scrollableContent,
            t.atoms.bg,
            {borderLeftWidth: 1, borderColor: t.palette.contrast_200},
          ]}>
          <ScrollView
            style={a.flex_1}
            contentContainerStyle={styles.scrollViewContentContainer}
            keyboardShouldPersistTaps="handled"
            /*
             * RNW implements `on-drag` by blurring the focused element on ANY
             * scroll event - including the one Firefox fires when swapping
             * splash -> login content resizes the scroller - which kills the
             * login form's autofocus. It doesn't appear to do anything anyways
             * on web (judging by iOS safari, which keeps the keyboard open
             * regardless of scrolling) -sfn
             */
            keyboardDismissMode={IS_WEB ? 'none' : 'on-drag'}>
            <View style={[styles.contentWrapper, IS_WEB && a.my_auto]}>
              {children}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View
          style={[
            styles.content,
            t.atoms.bg,
            {borderLeftWidth: 1, borderColor: t.palette.contrast_200},
          ]}>
          <View style={styles.contentWrapper}>{children}</View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100vh',
  },
  side: {
    flex: 1,
    paddingHorizontal: 40,
    paddingBottom: 80,
    justifyContent: 'center',
  },
  content: {
    flex: 2,
    paddingHorizontal: 40,
    justifyContent: 'center',
  },
  scrollableContent: {
    flex: 2,
  },
  scrollViewContentContainer: {
    flex: 1,
    paddingHorizontal: 40,
  },
  leadinText: {
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'right',
  },
  leadinTextSmall: {
    fontSize: 24,
  },
  titleText: {
    fontSize: 58,
    fontWeight: '800',
    textAlign: 'right',
  },
  titleTextSmall: {
    fontSize: 36,
  },
  descriptionText: {
    maxWidth: 400,
    marginTop: 10,
    marginLeft: 'auto',
    textAlign: 'right',
  },
  contentWrapper: {
    maxWidth: 600,
  },
})
