import { Metadata } from 'next'
import SearchClient from './SearchClient'

export const metadata: Metadata = {
  title: '記事検索',
  description: 'ブログ記事をタイトルや内容で検索できます。',
  openGraph: {
    title: 'My Blog - 記事検索',
    description: 'ブログ記事をタイトルや内容で検索できます。',
    type: 'website',
  },
}

export default function SearchPage() {
  return <SearchClient />
}