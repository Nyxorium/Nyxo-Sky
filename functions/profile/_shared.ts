// Based on https://github.com/Janpot/escape-html-template-tag/blob/master/src/index.ts

import {type AppBskyActorDefs} from '@atproto/api'

const ENTITIES: {[key: string]: string} = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;',
}

const ENT_REGEX = new RegExp(Object.keys(ENTITIES).join('|'), 'g')

type Sub = HtmlSafeString | string | (HtmlSafeString | string)[]

export class HtmlSafeString {
  private _parts: readonly string[]
  private _subs: readonly Sub[]
  constructor(parts: readonly string[], subs: readonly Sub[]) {
    this._parts = parts
    this._subs = subs
  }

  toString(): string {
    let result = this._parts[0]
    for (let i = 1; i < this._parts.length; i++) {
      result += escapehtml(this._subs[i - 1]) + this._parts[i]
    }
    return result
  }
}

function escapehtml(unsafe: Sub): string {
  if (Array.isArray(unsafe)) {
    return unsafe.map(escapehtml).join('')
  }
  if (unsafe instanceof HtmlSafeString) {
    return unsafe.toString()
  }
  return String(unsafe).replace(ENT_REGEX, char => ENTITIES[char])
}

export function html(parts: TemplateStringsArray, ...subs: Sub[]) {
  return new HtmlSafeString(parts, subs)
}

export const renderHandleString = (
  profile: AppBskyActorDefs.ProfileView | AppBskyActorDefs.ProfileViewDetailed,
) =>
  profile.displayName
    ? `${profile.displayName} (@${profile.handle})`
    : `@${profile.handle}`