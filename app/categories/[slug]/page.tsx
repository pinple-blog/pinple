import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '../../../sanity/lib/client'
import { getImageUrl } from '../../../lib/sanity-image'
import BlogLayout from '../../../components/BlogLayout'
import Sidebar from '../../../components/Sidebar'

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
    <BlogLayout sidebar={<Sidebar />}>
      {/* カテゴリヘッダー */}
      <section className="text-center mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="inline-block px-4 py-2 bg-gray-100 rounded-full mb-4">
          <span className="text-sm font-light text-gray-600 tracking-wide">
            カテゴリ
          </span>
        </div>
        <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
          {category.title}
        </h2>
        {category.description && (
          <p className="text-gray-500 font-light mb-6">
            {category.description}
          </p>
        )}
        <p className="text-sm text-gray-400 tracking-wide">
          {posts.length}件の記事
        </p>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto mt-6"></div>
      </section>

      {/* 記事一覧 */}
      <section>
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4 font-light">このカテゴリには記事がありません</p>
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 font-light"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                すべての記事を見る
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article 
                key={post._id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
              >
                <Link href={`/posts/${post.slug.current}`}>
                  <div className="flex flex-col sm:flex-row">
                    {/* 画像エリア */}
                    <div className="sm:w-1/3 aspect-[16/9] sm:aspect-[4/3] bg-gray-50 overflow-hidden">
                      {post.mainImage ? (
                        <Image
                          src={getImageUrl(post.mainImage, 300, 225) || ''}
                          alt={post.mainImage.alt || post.title}
                          width={300}
                          height={225}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* コンテンツエリア */}
                    <div className="flex-1 p-6">
                      {/* カテゴリバッジ */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat._id}
                              className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full"
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <h3 className="text-lg font-light text-gray-800 mb-3 leading-relaxed group-hover:text-gray-600 transition-colors duration-200">
                        {post.title}
                      </h3>
                      
                      <p className="text-xs text-gray-400 mb-3 tracking-wide">
                        {new Date(post._createdAt).toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed font-light line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="mt-4 inline-flex items-center text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                        <span className="font-light">続きを読む</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 戻るリンク */}
      <div className="mt-12 text-center">
        <Link 
          href="/categories" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 font-light"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          カテゴリ一覧に戻る
        </Link>
      </div>
    </BlogLayout>
  )
}