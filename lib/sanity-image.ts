import imageUrlBuilder from '@sanity/image-url'
import { client } from '../sanity/lib/client'

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}

export function getImageUrl(image: any, width?: number, height?: number) {
  // imageまたはimage.assetがnullの場合はnullを返す
  if (!image || !image.asset) return null
  
  let urlBuilder = urlFor(image)
  
  if (width) urlBuilder = urlBuilder.width(width)
  if (height) urlBuilder = urlBuilder.height(height)
  
  return urlBuilder.url()
}
