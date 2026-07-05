export type YandexMapPoint = {
  longitude: number
  latitude: number
  marker?: string
}

export type YandexStaticMapOptions = {
  points: YandexMapPoint[]
  center?: { longitude: number; latitude: number }
  width?: number
  height?: number
  zoom?: number
  lang?: string
}

export function buildYandexStaticMapUrl({
  points,
  center,
  width = 368,
  height = 383,
  zoom = 15,
  lang = 'en_US',
}: YandexStaticMapOptions): string | null {
  if (!points.length) return null

  const mapCenter = center ?? points[0]!
  const pt = points
    .map((point) => `${point.longitude},${point.latitude},${point.marker ?? 'pm2rdl1'}`)
    .join('~')

  const params = new URLSearchParams({
    lang,
    ll: `${mapCenter.longitude},${mapCenter.latitude}`,
    size: `${width},${height}`,
    z: String(zoom),
    l: 'map',
    pt,
  })

  return `https://static-maps.yandex.ru/1.x/?${params.toString()}`
}
