import {createSinglePathSVG} from './TEMPLATE'

export const At_Stroke2_Corner0_Rounded = createSinglePathSVG({
  path: 'M12 4a8 8 0 1 0 4.21 14.804 1 1 0 0 1 1.054 1.7A9.96 9.96 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.104-.27 2.31-.949 3.243-.716.984-1.849 1.6-3.331 1.465a4.2 4.2 0 0 1-2.93-1.585c-.94 1.21-2.388 1.94-3.985 1.715-2.53-.356-4.04-2.91-3.682-5.458s2.514-4.586 5.044-4.23c.905.127 1.68.536 2.286 1.126a1 1 0 0 1 1.964.368l-.515 3.545v.002a2.22 2.22 0 0 0 1.999 2.526c.75.068 1.212-.21 1.533-.65.358-.493.566-1.245.566-2.067a8 8 0 0 0-8-8Zm-.112 5.13c-1.195-.168-2.544.819-2.784 2.529s.784 3.03 1.98 3.198 2.543-.819 2.784-2.529-.784-3.03-1.98-3.198Z',
})

export const At_Stroke2_Corner2_Rounded = createSinglePathSVG({
  path: 'M12 4a8 8 0 1 0 4.21 14.804 1 1 0 0 1 1.054 1.7A9.96 9.96 0 0 1 12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10c0 1.104-.27 2.31-.949 3.243-.716.984-1.849 1.6-3.331 1.465a4.2 4.2 0 0 1-2.93-1.585c-.94 1.21-2.388 1.94-3.985 1.715-2.53-.356-4.04-2.91-3.682-5.458s2.514-4.586 5.044-4.23c.905.127 1.68.536 2.286 1.126a1 1 0 0 1 1.964.368l-.515 3.545v.002a2.22 2.22 0 0 0 1.999 2.526c.75.068 1.212-.21 1.533-.65.358-.493.566-1.245.566-2.067a8 8 0 0 0-8-8Zm-.112 5.13c-1.195-.168-2.544.819-2.784 2.529s.784 3.03 1.98 3.198 2.544-.819 2.784-2.529-.784-3.03-1.98-3.198Z',
})

import {forwardRef} from 'react'
import Svg, {Circle, Path} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'

export const At_Stroke2_Corner0_Rounded_new = forwardRef<Svg, Props>(
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

export const At_Stroke2_Corner2_Rounded_new = forwardRef<Svg, Props>(
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
