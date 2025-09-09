require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// テストカテゴリを作成
client.create({
  _type: 'category',
  title: '技術',
  slug: { current: 'tech' },
  description: 'プログラミングや開発に関する記事',
  color: 'blue'
}).then(result => {
  console.log('カテゴリ作成成功:', result._id);
}).catch(error => {
  console.error('エラー:', error.message);
});
