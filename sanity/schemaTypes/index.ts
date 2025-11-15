import authorType from './authorType'
// blockContentTypeが名前付きエクスポートの場合
// import { blockContentType } from './blockContentType'
// または、単にスキーマから除外（blockContentは独立したスキーマとして必要ない場合）
import categoryType from './categoryType'
import postType from './postType'

export const schemaTypes = [
  postType,
  authorType,
  categoryType,
  // blockContentType, // 必要に応じてコメントアウト
]