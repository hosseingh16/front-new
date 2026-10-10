/**
 * Child sitemaps match GET {apiBase}/sitemap groups:
 * pages-sitemap, blog-sitemap, jobs-sitemap, projects-sitemap.
 */
const sitemapGroups = [
  'pages-sitemap',
  'blog-sitemap',
  'jobs-sitemap',
  'projects-sitemap',
] as const

function childSitemap(group: (typeof sitemapGroups)[number]) {
  return {
    includeAppSources: false as const,
    sources: [`/api/__sitemap__/urls?group=${group}`],
  }
}

export function createSitemapConfig() {
  return {
    sitemaps: {
      'pages-sitemap': childSitemap('pages-sitemap'),
      'blog-sitemap': childSitemap('blog-sitemap'),
      'jobs-sitemap': childSitemap('jobs-sitemap'),
      'projects-sitemap': childSitemap('projects-sitemap'),
    },
    sitemapsPathPrefix: false,
    cacheMaxAgeSeconds: 12 * 60 * 60,
    autoLastmod: true,
    defaults: {
      changefreq: 'weekly' as const,
      priority: 0.9,
    },
  }
}
