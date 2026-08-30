import {createSinglePathSVG} from './TEMPLATE'

export const Download_Stroke2_Corner0_Rounded = createSinglePathSVG({
  path: 'M12 3a1 1 0 0 1 1 1v8.086l1.793-1.793a1 1 0 1 1 1.414 1.414l-3.5 3.5a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 1 1 1.414-1.414L11 12.086V4a1 1 0 0 1 1-1ZM4 14a1 1 0 0 1 1 1v4h14v-4a1 1 0 1 1 2 0v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z',
})

import {forwardRef} from 'react'
import Svg, {Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const Download_Stroke2_Corner0_Rounded_new = forwardRef<Svg, Props>(
  function LogoImpl(props, ref) {
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
        <Path d="M12 15V3" />
        <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <Path d="m7 10 5 5 5-5" />
      </Svg>
    )
  },
)
