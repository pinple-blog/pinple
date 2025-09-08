import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image'
import { client } from '../../../sanity/lib/client'
import { getImageUrl } from '../../../lib/sanity-image'

interface Post {
  title: string
  _createdAt: string
  body: any[]
  excerpt?: string
  slug: { current: string }
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
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Blog
      </Link>
      
      <article>
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
        
        <header className="mb-8">
          {/* メイン画像 */}
          {post.mainImage && (
            <div className="mb-6">
              <Image
                src={getImageUrl(post.mainImage, 800, 400) || ''}
                alt={post.mainImage.alt || post.title}
                width={800}
                height={400}
                className="w-full rounded-lg object-cover"
                priority
              />
            </div>
          )}
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <time dateTime={post._createdAt}>
              {new Date(post._createdAt).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>
        
        <div className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
          <PortableText value={post.body} />
        </div>
      </article>
    </main>
  )
}