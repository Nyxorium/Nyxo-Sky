import {type EventContext} from '@cloudflare/workers-types'

interface Env {
  FILTERED_REGIONS?: string
  FALLBACK_REGIONS?: string
}

function parseFilteredRegions(raw: string | undefined): Set<string> | null {
  if (!raw?.trim()) return null
  const codes = raw
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(s => s.length > 0)
  return codes.length > 0 ? new Set(codes) : null
}

export async function onRequest(
  context: EventContext<Env, string, Record<string, unknown>>,
) {
  const country = context.request.headers.get('CF-IPCountry')
  const region = context.request.headers.get('CF-IPRegion')

  const filteredRegions = parseFilteredRegions(context.env.FILTERED_REGIONS)
  const countryFallback = context.env.FILTERED_REGIONS

  const countryCode = country && country !== 'XX' ? country : undefined
  const regionCode = region && region !== 'XX' ? region : undefined

  const filteredCountryCode =
    filteredRegions && countryCode && filteredRegions.has(countryCode)
      ? countryFallback
      : countryCode

  return new Response(
    JSON.stringify({
      countryCode: filteredCountryCode,
      regionCode: regionCode,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  )
}
