const nyxoNeutralGeo = {
  countryCode: 'NL',
  regionCode: undefined,
} as const

const filteredRegions = new Set(['GB', 'AU', 'US'])

export async function onRequest(
  context: EventContext<Env, string, Record<string, unknown>>,
) {
  const country = context.request.headers.get('CF-IPCountry')
  const region = context.request.headers.get('CF-IPRegion')

  const countryCode = country && country !== 'XX' ? country : undefined
  const regionCode = region && region !== 'XX' ? region : undefined

  const geo = countryCode && filteredRegions.has(countryCode)
    ? nyxoNeutralGeo
    : {countryCode, regionCode}

  return new Response(JSON.stringify({geo}), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}
