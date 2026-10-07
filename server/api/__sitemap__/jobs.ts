import { jobCategoryPath } from '../../../app/utils/job-category'
import { jobCityPath } from '../../../app/utils/job-city'
import { jobDetailPath } from '../../../app/utils/job-detail-path'
import {
  fetchAllPaginated,
  fetchLookupItems,
} from '../../utils/sitemap-api'

type SitemapAd = {
  id: string | number
  title?: string | null
  company_name?: string | null
  company?: { slug?: string | null; name?: string | null } | null
  expired?: boolean | null
  status?: string | null
}

export default defineSitemapEventHandler(async (event) => {
  const [ads, lookups] = await Promise.all([
    fetchAllPaginated<SitemapAd>(event, '/ads', { perPage: 100 }),
    fetchLookupItems(event, ['job_titles', 'provinces']),
  ])

  const urls: string[] = []

  for (const ad of ads) {
    if (!ad?.id) continue
    if (ad.expired) continue
    urls.push(jobDetailPath(ad))
  }

  for (const item of lookups.job_titles ?? []) {
    const slug = item.value
    if (slug == null || String(slug).trim() === '') continue
    urls.push(jobCategoryPath(slug))
  }

  for (const item of lookups.provinces ?? []) {
    const label = item.label?.trim()
    if (!label) continue
    urls.push(jobCityPath(label))
  }

  return [...new Set(urls)].map((loc) => asSitemapUrl({ loc }))
})
