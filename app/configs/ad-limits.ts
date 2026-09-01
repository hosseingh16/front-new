export const DEFAULT_MAX_AD_SOFTWARES = 3

export function resolveMaxAdSoftwares(value?: unknown) {
  const parsed = Number(value)
  if (Number.isInteger(parsed) && parsed > 0) return parsed
  return DEFAULT_MAX_AD_SOFTWARES
}
