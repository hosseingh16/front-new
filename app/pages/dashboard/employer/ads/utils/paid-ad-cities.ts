import { SETTINGS_DEFAULTS } from '~/configs/settings-defaults'

export const PAID_AD_CITY_PRICE = SETTINGS_DEFAULTS['ads.paid_city_price']
export const DEFAULT_PAID_AD_CITY_NAMES = SETTINGS_DEFAULTS['ads.paid_cities']

export function findPaidAdCityName(
  nameOrSources: string | null | undefined | Array<string | null | undefined>,
  cityNames: readonly string[] = DEFAULT_PAID_AD_CITY_NAMES,
): string | null {
  const sources = Array.isArray(nameOrSources) ? nameOrSources : [nameOrSources]

  for (const source of sources) {
    const value = source?.trim()
    if (!value) continue

    const match = cityNames.find((city) => value.includes(city))
    if (match) return match
  }

  return null
}

export function isPaidAdCity(
  name?: string | null,
  cityNames: readonly string[] = DEFAULT_PAID_AD_CITY_NAMES,
) {
  return findPaidAdCityName(name, cityNames) != null
}
