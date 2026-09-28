export type JobDetailPathSource = {
  id: string | number
  title?: string | null
  company_name?: string | null
  company?: { slug?: string | null; name?: string | null } | null
}

function normalizePersianText(value: string): string {
  return value.replace(/ي/g, 'ی').replace(/ك/g, 'ک')
}

export function slugifyJobSegment(
  value: string | number | null | undefined,
): string {
  if (value == null) return ''

  return normalizePersianText(String(value).trim())
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function buildJobDetailSlug(source: JobDetailPathSource): string {
  const titlePart = slugifyJobSegment(source.title)
  const companyPart = slugifyJobSegment(
    source.company?.slug || source.company?.name || source.company_name,
  )

  if (titlePart && companyPart) return `${titlePart}-${companyPart}`
  return titlePart || companyPart || 'ad'
}

export function jobDetailPath(
  source: JobDetailPathSource | string | number,
): string {
  if (typeof source === 'string' || typeof source === 'number') {
    return `/jobs/${source}`
  }

  return `/jobs/${source.id}/${buildJobDetailSlug(source)}`
}
