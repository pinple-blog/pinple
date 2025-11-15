import Link from 'next/link'
import { ReactNode } from 'react'

interface BlogLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

export default function BlogLayout({ children, sidebar }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/">
                <h1 className="text-2xl font-light text-gray-800 tracking-wide cursor-pointer hover:text-gray-600 transition-colors duration-200">
                  My Blog
                </h1>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                清潔感のあるライフスタイルブログ
              </p>
            </div>
            
            {/* ナビゲーション */}
            <nav className="flex items-center space-x-8">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 font-light"
              >
                ホーム
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200 font-light"
              >
                カテゴリ
              </Link>
              <Link 
                href="/search" 
                className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-700 transition-colors duration-200"
              >
                検索
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 2カラムレイアウト */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1 lg:w-2/3">
            {children}
          </main>

          {/* サイドバー */}
          <aside className="lg:w-1/3">
            {sidebar || <DefaultSidebar />}
          </aside>
        </div>
      </div>
    </div>
  )
}

// デフォルトサイドバーコンポーネント
function DefaultSidebar() {
  return (
    <div className="space-y-6">
      {/* プロフィール */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-light text-gray-800 mb-4 tracking-wide">プロフィール</h3>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-light leading-relaxed">
            ブログ運営者のプロフィールをここに記載します。
          </p>
        </div>
      </div>

      {/* カテゴリ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-light text-gray-800 mb-4 tracking-wide">カテゴリ</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/categories/lifestyle" className="text-sm text-gray-600 hover:text-gray-800 font-light flex justify-between items-center group">
              <span>ライフスタイル</span>
              <span className="text-gray-400 group-hover:text-gray-600">(12)</span>
            </Link>
          </li>
          <li>
            <Link href="/categories/tech" className="text-sm text-gray-600 hover:text-gray-800 font-light flex justify-between items-center group">
              <span>テクノロジー</span>
              <span className="text-gray-400 group-hover:text-gray-600">(8)</span>
            </Link>
          </li>
          <li>
            <Link href="/categories/travel" className="text-sm text-gray-600 hover:text-gray-800 font-light flex justify-between items-center group">
              <span>旅行</span>
              <span className="text-gray-400 group-hover:text-gray-600">(15)</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* 人気記事 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-light text-gray-800 mb-4 tracking-wide">人気記事</h3>
        <ul className="space-y-3">
          <li>
            <Link href="/posts/sample-1" className="group">
              <p className="text-sm text-gray-600 hover:text-gray-800 font-light leading-relaxed">
                1. 記事タイトルサンプル
              </p>
            </Link>
          </li>
          <li>
            <Link href="/posts/sample-2" className="group">
              <p className="text-sm text-gray-600 hover:text-gray-800 font-light leading-relaxed">
                2. 記事タイトルサンプル
              </p>
            </Link>
          </li>
          <li>
            <Link href="/posts/sample-3" className="group">
              <p className="text-sm text-gray-600 hover:text-gray-800 font-light leading-relaxed">
                3. 記事タイトルサンプル
              </p>
            </Link>
          </li>
        </ul>
      </div>

      {/* アーカイブ */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-light text-gray-800 mb-4 tracking-wide">アーカイブ</h3>
        <ul className="space-y-2">
          <li>
            <Link href="/archive/2024-12" className="text-sm text-gray-600 hover:text-gray-800 font-light flex justify-between items-center group">
              <span>2024年12月</span>
              <span className="text-gray-400 group-hover:text-gray-600">(5)</span>
            </Link>
          </li>
          <li>
            <Link href="/archive/2024-11" className="text-sm text-gray-600 hover:text-gray-800 font-light flex justify-between items-center group">
              <span>2024年11月</span>
              <span className="text-gray-400 group-hover:text-gray-600">(8)</span>
            </Link>
          </li>
          <li>
            <Link href="/archive/2024-10" className="text-sm text-gray-600 hover:text-gray-800 font-light flex justify-between items-center group">
              <span>2024年10月</span>
              <span className="text-gray-400 group-hover:text-gray-600">(12)</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* タグクラウド */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-light text-gray-800 mb-4 tracking-wide">タグ</h3>
        <div className="flex flex-wrap gap-2">
          <Link href="/tags/nextjs" className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200">
            Next.js
          </Link>
          <Link href="/tags/react" className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200">
            React
          </Link>
          <Link href="/tags/typescript" className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200">
            TypeScript
          </Link>
          <Link href="/tags/tailwind" className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200">
            Tailwind
          </Link>
          <Link href="/tags/sanity" className="px-3 py-1 text-xs font-light bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors duration-200">
            Sanity
          </Link>
        </div>
      </div>

      {/* 検索ボックス */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-light text-gray-800 mb-4 tracking-wide">記事検索</h3>
        <form action="/search" method="get">
          <input
            type="text"
            name="q"
            placeholder="キーワードを入力..."
            className="w-full px-4 py-2 text-sm font-light border border-gray-200 rounded-full focus:outline-none focus:border-gray-400"
          />
        </form>
      </div>
    </div>
  )
}