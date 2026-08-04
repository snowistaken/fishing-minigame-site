import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: BASE_URL,                    lastModified },
    { url: `${BASE_URL}/meet-the-band`, lastModified },
    { url: `${BASE_URL}/contact-us`,    lastModified },
  ]
}
