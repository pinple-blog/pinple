import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { client } from '../sanity/lib/client'
import { getImageUrl } from '../lib/sanity-image'

export const metadata: Metadata = {
  title: 'ホーム',
  description: 'Next.jsとSanityで作られたモダンなブログ。最新の記事をご覧ください。',
  openGraph: {
    title: 'My Blog - ホーム',
    description: 'Next.jsとSanityで作られたモダンなブログ。最新の記事をご覧ください。',
    type: 'website',
  },
}

interface Post {
  _id: string
  title: string
  slug: { current: string }
  _createdAt: string
  excerpt?: string
  categories?: {
    _id: string
    title: string
    slug: { current: string }
    color?: string
  }[]
  mainImage?: {
    asset: any
    alt?: string
  }
}

async function getPosts(): Promise<Post[]> {
  const query = `
    *[_type == "post"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      _createdAt,
      excerpt,
      categories[]->{
        _id,
        title,
        slug,
        color
      },
      mainImage {
        asset,
        alt
      }
    }
  `
  return await client.fetch(query)
}

export default async function Home() {
  const posts = await getPosts()

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Blog</h1>
        <p className="text-lg text-gray-600">Next.jsとSanityで作られたモダンなブログ</p>
      </header>

      <section>
        <h2 className="text-2xl font-bold mb-8">最新記事</h2>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">まだ記事が投稿されていません。</p>
            <p className="text-sm text-gray-400">
              <a href="https://www.sanity.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Sanity Studio
              </a> で最初の記事を作成してください。
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post._id} className="border-b pb-8">
                <Link href={`/posts/${post.slug.current}`}>
                  <div className="flex gap-6 hover:bg-gray-50 p-4 rounded-lg transition-colors">
                    {/* サムネイル画像 */}
                    {post.mainImage && (
                      <div className="flex-shrink-0">
                        <Image
                          src={getImageUrl(post.mainImage, 200, 150) || ''}
                          alt={post.mainImage.alt || post.title}
                          width={200}
                          height={150}
                          className="rounded-lg object-cover"
                        />
                      </div>
                    )}
                    
                    {/* 記事情報 */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold hover:text-blue-600 mb-2">
                        {post.title}
                      </h3>
                      
                      {/* カテゴリ表示 */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.categories.map((category) => (
                            <span
                              key={category._id}
                              className={`px-2 py-1 text-xs rounded-full text-white bg-${category.color || 'blue'}-500`}
                            >
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {new Date(post._createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long', 
                          day: 'numeric'
                        })}
                      </p>
                      {post.excerpt && (
                        <p className="text-gray-700 line-clamp-3">{post.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">記事管理について</h2>
        <p className="text-gray-700">
          記事は <a href="https://www.sanity.io/manage" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Sanity Studio</a> で管理されています。
          記事の投稿・編集はSanityのWebインターフェースから行えます。
        </p>
      </section>
    </main>
  )
}