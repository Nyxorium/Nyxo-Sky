import {Platform} from 'react-native'

import {BLUESKY_PROXY_HEADER} from '#/lib/constants'
import {device} from '#/storage'

export function applyAppviewOverride() {
  const did = device.get(['appviewOverrideDid'])
  if (did) BLUESKY_PROXY_HEADER.set(`${did}#bsky_appview`)
}

export function setAppviewOverride(did: string | null) {
  if (did) device.set(['appviewOverrideDid'], did)
  else device.remove(['appviewOverrideDid'])
}

export function getStoredAppviewDid() {
  return device.get(['appviewOverrideDid']) ?? APPVIEW_PRESETS.bluesky
}

export function getActiveAppviewDid() {
  return BLUESKY_PROXY_HEADER.get().split('#')[0]
}

export const APPVIEW_PRESETS = {
  bluesky: 'did:web:api.bsky.app',
  eurosky: 'did:web:api.eurosky.network',
} as const

export function getAppviewLabel(did: string) {
  if (did === APPVIEW_PRESETS.bluesky) return 'Bluesky'
  if (did === APPVIEW_PRESETS.eurosky) return 'Eurosky'
  return did.replace(/^did:web:/, '')
}

export const DID_RE = /^did:(web|plc):[a-zA-Z0-9._:%-]+$/

export const CAN_AUTO_RESTART = Platform.OS === 'web'
