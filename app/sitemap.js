const BASE_URL = 'https://fishingminigame.com'

export default function sitemap() {
  return [
    { url: BASE_URL,                    lastModified: new Date() },
    { url: `${BASE_URL}/meet-the-band`, lastModified: new Date() },
    { url: `${BASE_URL}/contact-us`,    lastModified: new Date() },
  ]
}
