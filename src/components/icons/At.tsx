import {forwardRef} from 'react'
import Svg, {Circle, Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const At_Stroke2_Corner0_Rounded = forwardRef<Svg, Props>(
  function At_Stroke2_Corner0_RoundedImpl(props, ref) {
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
        <Circle cx={12} cy={12} r={4} />
        <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </Svg>
    )
  },
)

export const At_Stroke2_Corner2_Rounded = forwardRef<Svg, Props>(
  function At_Stroke2_Corner0_RoundedImpl(props, ref) {
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
        <Circle cx={12} cy={12} r={4} />
        <Path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
      </Svg>
    )
  },
)
