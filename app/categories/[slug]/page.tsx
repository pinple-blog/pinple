import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '../../sanity/lib/client'
import { getImageUrl } from '../../../lib/sanity-image'

interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
}

interface Post {
  _id: string
  title: string
  slug: { current: string }
  _createdAt: string
  excerpt?: string
  mainImage?: {
    asset: any
    alt?: string
  }
}

async function getCategory(slug: string): Promise<Category | null> {
  const query = `
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      description,
      color
    }
  `
  return await client.fetch(query, { slug })
}

async function getCategoryPosts(categoryId: string): Promise<Post[]> {
  const query = `
    *[_type == "post" && $categoryId in categories[]._ref] | order(_createdAt desc) {
      _id,
      title,
      slug,
      _createdAt,
      excerpt,
      mainImage {
        asset,
        alt
      }
    }
  `
  return await client.fetch(query, { categoryId })
}

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const category = await getCategory(params.slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.title} - カテゴリ`,
    description: category.description || `${category.title}に関する記事一覧`,
    openGraph: {
      title: `${category.title} - My Blog`,
      description: category.description || `${category.title}に関する記事一覧`,
      type: 'website',
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const posts = await getCategoryPosts(category._id)

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <Link href="/categories" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Categories
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <span
            className={`px-4 py-2 rounded-full text-white bg-${category.color || 'blue'}-500`}
          >
            {category.title}
          </span>
          <span className="text-gray-500">{posts.length}記事</span>
        </div>
        
        {category.description && (
          <p className="text-lg text-gray-600">{category.description}</p>
        )}
      </header>

      <section>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">このカテゴリには記事がありません。</p>
            <Link href="/" className="text-blue-600 hover:underline">
              すべての記事を見る
            </Link>
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
    </main>
  )
}