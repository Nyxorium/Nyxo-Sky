import {Celebrate_Stroke2_Corner0_Rounded as Celebrate} from '#/components/icons/Celebrate'
import {
  EmojiArc_Stroke2_Corner0_Rounded as EmojiArc,
  EmojiHeartEyes_Stroke2_Corner0_Rounded as EmojiHeartEyes,
} from '#/components/icons/Emoji'
import {Explosion_Stroke2_Corner0_Rounded as Explosion} from '#/components/icons/Explosion'
import {GameController_Stroke2_Corner0_Rounded as GameController} from '#/components/icons/GameController'
import {Leaf_Stroke2_Corner0_Rounded as Leaf} from '#/components/icons/Leaf'
import {Apple} from '#/components/icons/lucide/Apple'
import {Atom} from '#/components/icons/lucide/Atom'
import {AtSign as At} from '#/components/icons/lucide/AtSign'
import {FlaskRound as Lab} from '#/components/icons/lucide/FlaskRound'
import {Rocket} from '#/components/icons/lucide/Rocket'
import {Rose} from '#/components/icons/lucide/Rose'
import {Ufo as UFO} from '#/components/icons/lucide/Ufo'
import {MusicNote_Stroke2_Corner0_Rounded as MusicNote} from '#/components/icons/MusicNote'
import {Shaka_Stroke2_Corner0_Rounded as Shaka} from '#/components/icons/Shaka'

/**
 * If you want to add or remove icons from the selection, just add the name to the `emojiNames` array and
 * add the item to the `emojiItems` record..
 */

export const emojiNames = [
  'at',
  'arc',
  'heartEyes',
  'apple',
  'atom',
  'celebrate',
  'gameController',
  'leaf',
  'musicNote',
  'rocket',
  'rose',
  'shaka',
  'ufo',
  'explosion',
  'lab',
] as const
export type EmojiName = (typeof emojiNames)[number]

export interface Emoji {
  name: EmojiName
  component: typeof EmojiArc
}
export const emojiItems: Record<EmojiName, Emoji> = {
  at: {
    name: 'at',
    component: At,
  },
  arc: {
    name: 'arc',
    component: EmojiArc,
  },
  heartEyes: {
    name: 'heartEyes',
    component: EmojiHeartEyes,
  },
  apple: {
    name: 'apple',
    component: Apple,
  },
  atom: {
    name: 'atom',
    component: Atom,
  },
  celebrate: {
    name: 'celebrate',
    component: Celebrate,
  },
  gameController: {
    name: 'gameController',
    component: GameController,
  },
  leaf: {
    name: 'leaf',
    component: Leaf,
  },
  musicNote: {
    name: 'musicNote',
    component: MusicNote,
  },
  rocket: {
    name: 'rocket',
    component: Rocket,
  },
  rose: {
    name: 'rose',
    component: Rose,
  },
  shaka: {
    name: 'shaka',
    component: Shaka,
  },
  ufo: {
    name: 'ufo',
    component: UFO,
  },
  explosion: {
    name: 'explosion',
    component: Explosion,
  },
  lab: {
    name: 'lab',
    component: Lab,
  },
}

export const avatarColors = [
  '#FE8311',
  '#FED811',
  '#73DF84',
  '#1185FE',
  '#EF75EA',
  '#F55454',
] as const
export type AvatarColor = (typeof avatarColors)[number]
