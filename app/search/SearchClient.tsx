'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { client } from '../../sanity/lib/client'
import { getImageUrl } from '../../lib/sanity-image'

interface SearchResult {
  _id: string
  title: string
  slug: { current: string }
  _createdAt: string
  excerpt?: string
  categories?: {
    _id: string
    title: string
    color?: string
  }[]
  mainImage?: {
    asset: any
    alt?: string
  }
}

export default function SearchClient() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const searchResults = await client.fetch(`
        *[_type == "post" && (
          title match $searchTerm + "*" ||
          pt::text(body) match $searchTerm + "*" ||
          excerpt match $searchTerm + "*"
        )] | order(_createdAt desc) {
          _id,
          title,
          slug,
          _createdAt,
          excerpt,
          categories[]->{
            _id,
            title,
            color
          },
          mainImage {
            asset,
            alt
          }
        }[0...20]
      `, { searchTerm })

      setResults(searchResults)
    } catch (error) {
      console.error('検索エラー:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
    
    // URLパラメータを更新
    const url = new URL(window.location.href)
    if (searchQuery.trim()) {
      url.searchParams.set('q', searchQuery)
    } else {
      url.searchParams.delete('q')
    }
    window.history.replaceState({}, '', url.toString())
  }

  useEffect(() => {
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [query])

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to Blog
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">記事検索</h1>
        
        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="記事のタイトルや内容で検索..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '検索中...' : '検索'}
            </button>
          </div>
        </form>
      </header>

      {/* 検索結果 */}
      <section>
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600">検索中...</p>
          </div>
        )}

        {!loading && hasSearched && (
          <div className="mb-4">
            <p className="text-gray-600">
              "{searchQuery}" の検索結果: {results.length}件
            </p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">検索結果が見つかりませんでした。</p>
            <p className="text-sm text-gray-400">
              別のキーワードで検索してみてください。
            </p>
          </div>
        )}

        {!loading && !hasSearched && !query && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">記事を検索してみましょう。</p>
            <p className="text-sm text-gray-400">
              タイトルや内容のキーワードで検索できます。
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-8">
            {results.map((post) => (
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
    </main>
  )
}