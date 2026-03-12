export async function onRequest(
  context: EventContext<Env, string, Record<string, unknown>>,
) {
  const country = context.request.headers.get('CF-IPCountry')
  const region = context.request.headers.get('CF-IPRegion')

  const countryCode = country && country !== 'XX' ? country : undefined
  const regionCode = region && region !== 'XX' ? region : undefined

  return new Response(JSON.stringify({countryCode, regionCode}), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}