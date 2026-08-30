import {forwardRef} from 'react'
import Svg, {Path, Rect} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const Bot_Stroke = forwardRef<Svg, Props>(function BotImpl(props, ref) {
  const {fill, size, style, ...rest} = useCommonSVGProps(props)
  return (
    <Svg
      fill="none"
      stroke={fill}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
      ref={ref}
      viewBox="0 0 24 24"
      width={size}
      height={size}
      style={[style]}>
      <Path d="M12 8V4H8" />
      <Rect width={16} height={12} x={4} y={8} rx={2} />
      <Path d="M2 14h2" />
      <Path d="M20 14h2" />
      <Path d="M15 13v2" />
      <Path d="M9 13v2" />
    </Svg>
  )
})

import {createSinglePathSVG} from './TEMPLATE'

export const Bot_Filled = createSinglePathSVG({
  path: 'M12 0a2 2 0 0 1 1 3.73V5h4.2c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.31 1.31C22 7.28 22 8.12 22 9.8v.25a2.501 2.501 0 0 1 0 4.9V15c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 23 16.8 23 14 23h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 19.2 2 17.8 2 15v-.05a2.5 2.5 0 0 1 0-4.9V9.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.31-1.31C4.28 5 5.12 5 6.8 5H11V3.73A2 2 0 0 1 12 0M8 10a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0v-2a2 2 0 0 0-2-2m8 0a2 2 0 0 0-2 2v2a2 2 0 1 0 4 0v-2a2 2 0 0 0-2-2',
})
