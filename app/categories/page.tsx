import Link from 'next/link'
import { Metadata } from 'next'
import { client } from '../../sanity/lib/client'
import BlogLayout from '../../components/BlogLayout'
import Sidebar from '../../components/Sidebar'

export const metadata: Metadata = {
  title: 'カテゴリ一覧',
  description: '記事をカテゴリ別に閲覧できます。',
  openGraph: {
    title: 'My Blog - カテゴリ一覧',
    description: '記事をカテゴリ別に閲覧できます。',
    type: 'website',
  },
}

interface Category {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  color?: string
  postCount: number
}

async function getCategories(): Promise<Category[]> {
  const query = `
    *[_type == "category"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      color,
      "postCount": count(*[_type == "post" && references(^._id)])
    }
  `
  return await client.fetch(query)
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <BlogLayout sidebar={<Sidebar />}>
      {/* ページタイトル */}
      <section className="text-center mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
          カテゴリ一覧
        </h2>
        <p className="text-gray-500 font-light mb-6">
          記事をカテゴリ別に閲覧できます
        </p>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto"></div>
      </section>

      {/* カテゴリ一覧 */}
      <section>
        {categories.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4 font-light">カテゴリが設定されていません</p>
              <p className="text-sm text-gray-400">
                Sanity Studio でカテゴリを作成してください
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/categories/${category.slug.current}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full">
                      {category.title}
                    </span>
                    <span className="text-xs text-gray-400 tracking-wide">
                      {category.postCount}記事
                    </span>
                  </div>
                  
                  {category.description ? (
                    <p className="text-sm text-gray-600 leading-relaxed font-light">
                      {category.description}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic font-light">
                      説明なし
                    </p>
                  )}
                  
                  <div className="mt-6 flex items-center text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    <span className="text-xs font-light">記事を見る</span>
                    <svg className="w-3 h-3 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </BlogLayout>
  )
}