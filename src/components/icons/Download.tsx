import {forwardRef} from 'react'
import Svg, {Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const Download_Stroke2_Corner0_Rounded = forwardRef<Svg, Props>(
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
