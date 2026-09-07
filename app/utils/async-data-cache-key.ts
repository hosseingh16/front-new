export function asyncDataCacheKey(
  prefix: string,
  query?: Record<string, unknown>,
) {
  if (!query) return prefix;

  const parts = Object.entries(query)
    .filter(([, value]) => value != null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${String(value)}`);

  return parts.length ? `${prefix}:${parts.join("&")}` : prefix;
}
