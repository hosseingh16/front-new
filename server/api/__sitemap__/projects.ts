import { provinceLabelToSlug } from '../../../app/utils/province-filter-query'
import { slugifyJobSegment } from '../../../app/utils/job-detail-path'
import {
  fetchAllPaginated,
  fetchLookupItems,
} from '../../utils/sitemap-api'

type SitemapProject = {
  id: string | number
  type?: string | null
  scopes?: string | null
  title?: string | null
}

function projectDetailPath(project: SitemapProject): string {
  const titlePart =
    slugifyJobSegment(project.title) ||
    slugifyJobSegment(project.type) ||
    slugifyJobSegment(project.scopes) ||
    'project'

  return `/project/${project.id}/${titlePart}`
}

export default defineSitemapEventHandler(async (event) => {
  const [projects, lookups] = await Promise.all([
    fetchAllPaginated<SitemapProject>(event, '/projects', { perPage: 100 }),
    fetchLookupItems(event, ['provinces']),
  ])

  const urls: string[] = ['/projects/type/remote']

  for (const project of projects) {
    if (!project?.id) continue
    urls.push(projectDetailPath(project))
  }

  for (const item of lookups.provinces ?? []) {
    const label = item.label?.trim()
    if (!label) continue
    const slug = provinceLabelToSlug(label)
    if (!slug) continue
    urls.push(`/projects/city/${slug}`)
  }

  // Project category landing pages — slug from type when present on listings.
  const categorySlugs = new Set<string>()
  for (const project of projects) {
    const slug = slugifyJobSegment(project.type)
    if (slug) categorySlugs.add(slug)
  }
  for (const slug of categorySlugs) {
    urls.push(`/projects/category/${slug}`)
  }

  return [...new Set(urls)].map((loc) => asSitemapUrl({ loc }))
})
