const PAID_AD_CITY_NAMES = ['مشهد','تهران'] as const

export const PAID_AD_CITY_PRICE = 345_000

export function findPaidAdCityName(
  ...sources: Array<string | null | undefined>
): string | null {
  for (const source of sources) {
    const value = source?.trim()
    if (!value) continue

    const match = PAID_AD_CITY_NAMES.find((city) => value.includes(city))
    if (match) return match
  }

  return null
}

export function isPaidAdCity(name?: string | null) {
  return findPaidAdCityName(name) != null
}
