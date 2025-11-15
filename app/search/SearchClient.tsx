'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { client } from '../../sanity/lib/client'
import { getImageUrl } from '../../lib/sanity-image'
import BlogLayout from '../../components/BlogLayout'
import Sidebar from '../../components/Sidebar'

interface SearchResult {
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
            slug,
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
    <BlogLayout sidebar={<Sidebar />}>
      {/* 検索ヘッダー */}
      <section className="text-center mb-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-3xl font-light text-gray-800 mb-4 tracking-wide">
          記事検索
        </h2>
        <p className="text-gray-500 font-light mb-8">
          記事のタイトルや内容で検索できます
        </p>
        <div className="w-20 h-0.5 bg-gray-300 mx-auto mb-8"></div>
        
        {/* 検索フォーム */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-full shadow-sm border border-gray-100 p-2 flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="キーワードを入力..."
              className="flex-1 px-6 py-3 font-light text-gray-700 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <span className="text-sm">検索中...</span>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm">検索</span>
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* 検索結果 */}
      <section>
        {loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="w-12 h-12 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-light">検索中...</p>
            </div>
          </div>
        )}

        {!loading && hasSearched && (
          <div className="mb-8 text-center">
            <p className="text-gray-600 font-light">
              「<span className="font-normal text-gray-800">{searchQuery}</span>」の検索結果: 
              <span className="font-normal text-gray-800 ml-2">{results.length}件</span>
            </p>
          </div>
        )}

        {!loading && hasSearched && results.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4 font-light">検索結果が見つかりませんでした</p>
              <p className="text-sm text-gray-400">
                別のキーワードで検索してみてください
              </p>
            </div>
          </div>
        )}

        {!loading && !hasSearched && !query && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 mb-4 font-light">記事を検索してみましょう</p>
              <p className="text-sm text-gray-400">
                タイトルや内容のキーワードで検索できます
              </p>
            </div>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-8">
            {results.map((post) => (
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
    </BlogLayout>
  )
}