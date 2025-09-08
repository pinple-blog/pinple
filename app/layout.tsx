import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'My Blog',
    template: '%s | My Blog',
  },
  description: 'A modern blog powered by Next.js and Sanity',
  keywords: ['blog', 'Next.js', 'Sanity', 'TypeScript', 'web development'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Name',
  metadataBase: new URL('https://yourdomain.com'), // 後で実際のドメインに変更
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://yourdomain.com',
    siteName: 'My Blog',
    title: 'My Blog',
    description: 'A modern blog powered by Next.js and Sanity',
    images: [
      {
        url: '/og-image.jpg', // 後で作成
        width: 1200,
        height: 630,
        alt: 'My Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Blog',
    description: 'A modern blog powered by Next.js and Sanity',
    images: ['/og-image.jpg'],
    creator: '@yourusername', // Twitterアカウントがあれば
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Consoleで取得
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* 構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Blog',
              name: 'My Blog',
              description: 'A modern blog powered by Next.js and Sanity',
              url: 'https://yourdomain.com',
              author: {
                '@type': 'Person',
                name: 'Your Name',
              },
              publisher: {
                '@type': 'Person',
                name: 'Your Name',
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}