import type { ProductResolvers } from './../../types.generated'
import { shopLoader } from '@/schema/loader/shopLoader'
export const Product: ProductResolvers = {
  shop: async (_parent) => {
    return await shopLoader.load(_parent.shopId)
  }
}
