import {forwardRef} from 'react'
import Svg, {Circle, Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const VerifiedCheck = forwardRef<Svg, Props>(
  function LogoImpl(props, ref) {
    const {fill, size, style, ...rest} = useCommonSVGProps(props)

    return (
      <Svg
        fill="none"
        {...rest}
        ref={ref}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={[style]}>
        <Circle cx="12" cy="12" r="11.5" fill={fill} />
        <Path
          fill="#fff"
          d="M15.61 10.186a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          transform="translate(12 12) scale(1.5) translate(-12 -12)"
        />
      </Svg>
    )
  },
)

export const VerifiedCheck_old = forwardRef<Svg, Props>(
  function LogoImpl(props, ref) {
    const {fill, size, style, ...rest} = useCommonSVGProps(props)

    return (
      <Svg
        fill="none"
        {...rest}
        ref={ref}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        style={[style]}>
        <Circle cx="12" cy="12" r="11.5" fill={fill} />
        <Path
          fill="#fff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.659 8.175a1.361 1.361 0 0 1 0 1.925l-6.224 6.223a1.361 1.361 0 0 1-1.925 0L6.4 13.212a1.361 1.361 0 0 1 1.925-1.925l2.149 2.148 5.26-5.26a1.361 1.361 0 0 1 1.925 0Z"
        />
      </Svg>
    )
  },
)
