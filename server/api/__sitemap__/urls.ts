import { getApiBase } from '../../utils/sitemap-api'

const SITEMAP_GROUPS = [
  'pages-sitemap',
  'blog-sitemap',
  'jobs-sitemap',
  'projects-sitemap',
] as const

type SitemapGroup = (typeof SITEMAP_GROUPS)[number]

type SitemapGroups = Partial<Record<SitemapGroup, string[]>>

type SitemapApiResponse = {
  data?: SitemapGroups | null
} & SitemapGroups

const CACHE_TTL_MS = 12 * 60 * 60 * 1000

const PAGE_FALLBACK = [
  '/',
  '/resume-builder',
  '/employer',
  '/blog',
  '/about-us',
  '/faq',
  '/contact',
  '/terms-and-conditions',
  '/privacy-policy',
  '/jobs',
  '/projects',
  '/tax-return',
]

type SitemapUrl = {
  loc: string
  changefreq: 'daily'
  priority: number
}

let cachedGroups: { at: number; groups: SitemapGroups } | null = null

function isSitemapGroup(value: string): value is SitemapGroup {
  return (SITEMAP_GROUPS as readonly string[]).includes(value)
}

function toLoc(url: string): string {
  const value = url.trim()
  if (!value) return ''

  try {
    const parsed = new URL(value)
    let pathname = parsed.pathname || '/'
    try {
      pathname = decodeURI(pathname)
    } catch {
      // Keep the pathname when it is not valid percent-encoding.
    }
    const path = `${pathname}${parsed.search}` || '/'
    return path.startsWith('/') ? path : `/${path}`
  } catch {
    return value.startsWith('/') ? value : `/${value}`
  }
}

function unwrapGroups(payload: unknown): SitemapGroups {
  if (!payload || typeof payload !== 'object') return {}

  const body = payload as SitemapApiResponse
  const source = body.data && !Array.isArray(body.data) ? body.data : body
  if (!source || typeof source !== 'object' || Array.isArray(source)) return {}

  const groups: SitemapGroups = {}
  for (const group of SITEMAP_GROUPS) {
    const urls = source[group]
    if (!Array.isArray(urls)) continue
    groups[group] = urls.filter(
      (item): item is string => typeof item === 'string' && item.trim() !== '',
    )
  }

  return groups
}

function toSitemapUrls(urls: string[]): SitemapUrl[] {
  const routes: SitemapUrl[] = []
  const locs = new Set<string>()

  for (const url of urls) {
    const loc = toLoc(url)
    if (!loc || locs.has(loc)) continue
    locs.add(loc)
    routes.push({
      loc,
      changefreq: 'daily',
      priority: loc === '/' ? 1 : 0.9,
    })
  }

  return routes
}

async function loadGroups(event: Parameters<typeof getApiBase>[0]): Promise<SitemapGroups> {
  if (cachedGroups && Date.now() - cachedGroups.at < CACHE_TTL_MS) {
    return cachedGroups.groups
  }

  const apiBase = getApiBase(event)
  if (!apiBase) return {}

  const allowLocalCert = apiBase.includes('.test')
  const previousTls = process.env.NODE_TLS_REJECT_UNAUTHORIZED
  if (allowLocalCert) process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    // `groups` skips the older cached response that had no projects-sitemap.
    const response = await $fetch<SitemapApiResponse>(`${apiBase}/sitemap`, {
      query: { groups: '4' },
    })
    const groups = unwrapGroups(response)
    cachedGroups = { at: Date.now(), groups }
    return groups
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return {}
  } finally {
    if (allowLocalCert) {
      if (previousTls == null) delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
      else process.env.NODE_TLS_REJECT_UNAUTHORIZED = previousTls
    }
  }
}

export default defineEventHandler(async (event) => {
  const requested = String(getQuery(event).group || '')
  if (!isSitemapGroup(requested)) return []

  const groups = await loadGroups(event)
  const urls = groups[requested]
  if (urls?.length) return toSitemapUrls(urls)

  if (requested === 'pages-sitemap') return toSitemapUrls(PAGE_FALLBACK)
  if (requested === 'projects-sitemap') {
    return toSitemapUrls(['/projects/type/remote'])
  }

  return []
})
