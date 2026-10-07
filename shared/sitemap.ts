/**
 * SEO sitemap matrix — static pages for pages-sitemap.xml.
 * `/employers` is the live employer landing (checklist path was `/employer`).
 * Omit `/resume-builder` and `/about-us` until those pages exist and are indexable.
 */
export const PAGES_SITEMAP_URLS = [
  '/',
  '/employers',
  '/blog',
  '/faq',
  '/contact',
  '/terms-and-conditions',
  '/privacy-policy',
  '/jobs',
  '/projects',
  '/tax-return',
] as const

/** Shared @nuxtjs/sitemap multi-sitemap config for local + production. */
export function createSitemapConfig() {
  return {
    excludeAppSources: true as const,
    sitemapsPathPrefix: false as const,
    sitemaps: {
      'pages-sitemap': {
        urls: [...PAGES_SITEMAP_URLS],
        defaults: {
          changefreq: 'weekly' as const,
          priority: 0.8,
        },
      },
      'blog-sitemap': {
        // WordPress / Rank Math post sitemap (articles under /blog/)
        sources: ['https://hihesab.com/blog/post-sitemap.xml'],
        defaults: {
          changefreq: 'weekly' as const,
          priority: 0.7,
        },
      },
      'jobs-sitemap': {
        sources: ['/api/__sitemap__/jobs'],
        chunks: true,
        defaults: {
          changefreq: 'daily' as const,
          priority: 0.7,
        },
      },
      'projects-sitemap': {
        sources: ['/api/__sitemap__/projects'],
        chunks: true,
        defaults: {
          changefreq: 'daily' as const,
          priority: 0.7,
        },
      },
    },
  }
}
