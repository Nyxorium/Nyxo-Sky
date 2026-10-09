import Svg, {Circle, Line, Path} from 'react-native-svg'

import {useTheme} from '#/alf'

export function UserPlus({size}: {size: 'small' | 'medium' | 'large'}) {
  const t = useTheme()
  const px = size === 'large' ? 32 : size === 'medium' ? 24 : 16

  return (
    <Svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      stroke={t.atoms.text.color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round">
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx={9} cy={7} r={4} />
      <Line x1={19} x2={19} y1={8} y2={14} />
      <Line x1={22} x2={16} y1={11} y2={11} />
    </Svg>
  )
}
