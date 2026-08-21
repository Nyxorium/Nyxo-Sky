import Svg, {Path} from 'react-native-svg'

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
      <Path d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
    </Svg>
  )
}
