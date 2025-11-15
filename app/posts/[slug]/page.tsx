import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { client } from '../../../sanity/lib/client'
import { getImageUrl } from '../../../lib/sanity-image'
import BlogLayout from '../../../components/BlogLayout'
import Sidebar from '../../../components/Sidebar'

interface Post {
  title: string
  _createdAt: string
  body: any[]
  excerpt?: string
  slug: { current: string }
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

async function getPost(slug: string): Promise<Post | null> {
  const query = `
    *[_type == "post" && slug.current == $slug][0] {
      title,
      _createdAt,
      body,
      excerpt,
      slug,
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
  return await client.fetch(query, { slug })
}

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const description = post.excerpt || `${post.title}についての記事です。`

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post._createdAt,
      authors: ['Your Name'],
      images: post.mainImage ? [getImageUrl(post.mainImage, 1200, 630) || ''] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.mainImage ? [getImageUrl(post.mainImage, 1200, 630) || ''] : [],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <BlogLayout sidebar={<Sidebar />}>
      <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* メイン画像 */}
        {post.mainImage && (
          <div className="aspect-[21/9] bg-gray-50">
            <Image
              src={getImageUrl(post.mainImage, 800, 343) || ''}
              alt={post.mainImage.alt || post.title}
              width={800}
              height={343}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}
        
        <div className="p-8">
          <header className="mb-8">
            {/* カテゴリバッジ */}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug.current}`}
                    className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200"
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            )}
            
            <h1 className="text-3xl font-light text-gray-800 mb-6 leading-relaxed tracking-wide">
              {post.title}
            </h1>
            
            <div className="flex items-center text-gray-400 text-sm tracking-wide">
              <time dateTime={post._createdAt}>
                {new Date(post._createdAt).toLocaleDateString('ja-JP', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            
            <div className="w-20 h-0.5 bg-gray-200 mt-6"></div>
          </header>
          
          {/* 記事本文 */}
          <div className="prose prose-lg max-w-none 
            prose-headings:font-light prose-headings:text-gray-800 prose-headings:tracking-wide
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-gray-600 prose-p:leading-relaxed prose-p:font-light
            prose-a:text-gray-800 prose-a:no-underline prose-a:border-b prose-a:border-gray-300 hover:prose-a:border-gray-500
            prose-strong:text-gray-800 prose-strong:font-normal
            prose-blockquote:font-light prose-blockquote:text-gray-600 prose-blockquote:border-l-gray-300
            prose-code:text-gray-700 prose-code:bg-gray-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
            prose-img:rounded-xl prose-img:shadow-sm
            prose-ul:text-gray-600 prose-li:font-light
            prose-ol:text-gray-600">
            <PortableText value={post.body} />
          </div>
        </div>
      </article>

      {/* 戻るリンク */}
      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors duration-200 font-light"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          記事一覧に戻る
        </Link>
      </div>

      {/* 構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post._createdAt,
            dateModified: post._createdAt,
            author: {
              '@type': 'Person',
              name: 'Your Name',
            },
            publisher: {
              '@type': 'Person',
              name: 'Your Name',
            },
            description: post.excerpt || post.title,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://yourdomain.com/posts/${post.slug.current}`,
            },
          }),
        }}
      />
    </BlogLayout>
  )
}