import {forwardRef} from 'react'
import Svg, {Circle, Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const Accessibility_Stroke2_Corner2_Rounded = forwardRef<Svg, Props>(
  function PersonStandingImpl(props, ref) {
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
        <Circle cx={12} cy={5} r={1} />
        <Path d="m9 20 3-6 3 6" />
        <Path d="m6 8 6 2 6-2" />
        <Path d="M12 10v4" />
      </Svg>
    )
  },
)
