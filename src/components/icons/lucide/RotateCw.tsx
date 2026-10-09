import Svg, {Path} from 'react-native-svg'

import {useTheme} from '#/alf'

export function RotateCw({size}: {size: 'small' | 'medium' | 'large'}) {
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
      <Path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <Path d="M21 3v5h-5" />
    </Svg>
  )
}
