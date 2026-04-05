const serviceCache = new Map<string, string>()

export async function resolvePdsServiceUrl(
  did: `did:${string}`,
): Promise<string> {
  const cached = serviceCache.get(did)
  if (cached) return cached

  const docUrl = did.startsWith('did:plc:')
    ? `https://plc.directory/${did}`
    : `https://${did.substring(8)}/.well-known/did.json`

  const doc: {
    service: {serviceEndpoint: string; type: string}[]
  } = await (await fetch(docUrl)).json()

  const service = doc.service.find(
    s => s.type === 'AtprotoPersonalDataServer',
  )?.serviceEndpoint

  if (service === undefined) {
    throw new Error(`Could not find a PDS service for ${did}`)
  }

  serviceCache.set(did, service)
  return service
}