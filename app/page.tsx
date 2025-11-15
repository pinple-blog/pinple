import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { client } from '../sanity/lib/client'
import { getImageUrl } from '../lib/sanity-image'
import BlogLayout from '../components/BlogLayout'
import Sidebar from '../components/Sidebar'

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
    <BlogLayout sidebar={<Sidebar />}>
      {/* ヒーローセクション（オプション） */}
      <section className="text-center mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
          最新の記事
        </h2>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
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
              <p className="text-gray-500 mb-4 font-light">まだ記事が投稿されていません</p>
              <p className="text-sm text-gray-400">
                Sanity Studio で最初の記事を作成してください
              </p>
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
                      {post.mainImage?.asset ? (
                        <Image
                          src={getImageUrl(post.mainImage, 400, 300) || ''}
                          alt={post.mainImage.alt || post.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* コンテンツエリア */}
                    <div className="flex-1 p-6">
                      {/* カテゴリバッジ */}
                      {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.categories.slice(0, 2).map((category) => (
                            <span
                              key={category._id}
                              className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full"
                            >
                              {category.title}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <h3 className="text-xl font-light text-gray-800 mb-3 leading-relaxed group-hover:text-gray-600 transition-colors duration-200">
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

      {/* ページネーション（将来的に実装） */}
      <div className="mt-12 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="px-4 py-2 text-sm font-light text-gray-400 bg-white rounded-lg border border-gray-200 cursor-not-allowed" disabled>
            前へ
          </button>
          <span className="px-4 py-2 text-sm font-normal text-gray-800 bg-white rounded-lg border border-gray-300">
            1
          </span>
          <button className="px-4 py-2 text-sm font-light text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            2
          </button>
          <button className="px-4 py-2 text-sm font-light text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            3
          </button>
          <button className="px-4 py-2 text-sm font-light text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
            次へ
          </button>
        </nav>
      </div>
    </BlogLayout>
  )
}