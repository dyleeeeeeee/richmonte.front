import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/register'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        crawlDelay: 0,
      },
      {
        userAgent: ['AhrefsBot', 'SemrushBot', 'DotBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://invbank.us/sitemap.xml',
    host: 'https://invbank.us',
  }
}
