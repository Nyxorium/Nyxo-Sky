import {forwardRef} from 'react'
import Svg, {Circle, Path, Rect} from 'react-native-svg'

import {type Props, useCommonSVGProps} from '#/components/icons/common'
import {createSinglePathSVG} from './TEMPLATE'
import {Unlock_Stroke2_Corner2_Rounded as CanonicalUnlock_Stroke2_Corner2_Rounded} from './Unlock'

export const Lock_Stroke2_Corner0_Rounded = createSinglePathSVG({
  path: 'M7 7a5 5 0 0 1 10 0v2h1a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h1V7Zm-1 4v9h12v-9H6Zm9-2H9V7a3 3 0 1 1 6 0v2Zm-3 4a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0v-3a1 1 0 0 1 1-1Z',
  viewBox: '0 0 24 24',
})

export const Lock_Stroke2_Corner2_Rounded = forwardRef<Svg, Props>(
  function LockKeyholeImpl(props, ref) {
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
        <Circle cx={12} cy={16} r={1} />
        <Rect x={3} y={10} width={18} height={12} rx={2} />
        <Path d="M7 10V7a5 5 0 0 1 10 0v3" />
      </Svg>
    )
  },
)

/** @deprecated Import Unlock_Stroke2_Corner2_Rounded from `#/components/icons/Unlock` instead. */
export const Unlock_Stroke2_Corner2_Rounded =
  CanonicalUnlock_Stroke2_Corner2_Rounded
