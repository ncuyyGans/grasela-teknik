const MAPS_SEPARATOR = '\n@@MAPS_URL@@\n'

export function parseAddress(value?: string | null) {
  const raw = value || ''
  const separatorIndex = raw.indexOf(MAPS_SEPARATOR)

  if (separatorIndex === -1) {
    return { address: raw, mapsUrl: '' }
  }

  return {
    address: raw.slice(0, separatorIndex).trim(),
    mapsUrl: raw.slice(separatorIndex + MAPS_SEPARATOR.length).trim(),
  }
}

export function serializeAddress(address: string, mapsUrl: string) {
  const cleanAddress = address.trim()
  const cleanMapsUrl = mapsUrl.trim()
  return cleanMapsUrl
    ? `${cleanAddress}${MAPS_SEPARATOR}${cleanMapsUrl}`
    : cleanAddress
}
