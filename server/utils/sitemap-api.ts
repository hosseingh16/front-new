import type { H3Event } from 'h3'

type PaginatedMeta = {
  current_page?: number
  last_page?: number
  total?: number
}

type ApiListResponse<T> = {
  data?: T[] | null
  meta?: PaginatedMeta
}

export function getApiBase(event: H3Event): string {
  const config = useRuntimeConfig(event)
  return String(config.public.apiBase || '').replace(/\/$/, '')
}

export async function fetchLookupItems(
  event: H3Event,
  keys: string[],
): Promise<Record<string, Array<{ label: string; value: string | number }>>> {
  const apiBase = getApiBase(event)
  if (!apiBase || !keys.length) return {}

  try {
    const result = await $fetch<{
      data?: Record<string, Array<{ label: string; value: string | number }>>
    }>(`${apiBase}/lookups`, {
      query: { keys: keys.join(',') },
    })
    return result.data ?? {}
  } catch {
    return {}
  }
}

export async function fetchAllPaginated<T>(
  event: H3Event,
  path: string,
  options?: { perPage?: number; maxPages?: number },
): Promise<T[]> {
  const apiBase = getApiBase(event)
  if (!apiBase) return []

  const perPage = options?.perPage ?? 100
  const maxPages = options?.maxPages ?? 50
  const items: T[] = []
  let page = 1
  let lastPage = 1

  while (page <= lastPage && page <= maxPages) {
    try {
      const result = await $fetch<ApiListResponse<T>>(`${apiBase}${path}`, {
        query: { page, per_page: perPage },
      })
      const batch = result.data ?? []
      items.push(...batch)
      lastPage = Math.max(1, Number(result.meta?.last_page) || 1)
      if (!batch.length) break
      page += 1
    } catch {
      break
    }
  }

  return items
}
