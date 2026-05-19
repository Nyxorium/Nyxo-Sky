interface Env {
  FILTERED_REGIONS?: string
}

const nyxoNeutralGeo = {
  countryCode: 'NL',
  regionCode: undefined,
} as const

export async function onRequest(
  context: EventContext<Env, string, Record<string, unknown>>,
) {
  const filteredRegions = parseFilteredRegions(context.env.FILTERED_REGIONS)

  const country = context.request.headers.get('CF-IPCountry')
  const region = context.request.headers.get('CF-IPRegion')

  const countryCode = country && country !== 'XX' ? country : undefined
  const regionCode = region && region !== 'XX' ? region : undefined

  const geo =
    countryCode && filteredRegions !== null && filteredRegions.has(countryCode)
      ? nyxoNeutralGeo
      : {countryCode, regionCode}

  return new Response(JSON.stringify({geo}), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}

function parseFilteredRegions(raw: string | undefined): Set<string> | null {
  if (!raw?.trim()) return null
  const codes = raw
    .split(',')
    .map(s => s.trim().toUpperCase())
    .filter(s => s.length > 0)
  return codes.length > 0 ? new Set(codes) : null
}
