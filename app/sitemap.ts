import { MetadataRoute } from 'next'
import { client } from '../sanity/lib/client'

interface Post {
  slug: { current: string }
  _updatedAt: string
}

async function getPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post"] {
      slug,
      _updatedAt
    }
  `
  return await client.fetch(query)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts()
  const baseUrl = 'https://yourdomain.com' // 後で実際のドメインに変更

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug.current}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...postUrls,
  ]
}