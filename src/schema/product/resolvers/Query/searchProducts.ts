import type { QueryResolvers } from './../../../types.generated'
import { searchProducts as searchProductsUtil } from '@/util'

export const searchProducts: NonNullable<QueryResolvers['searchProducts']> = async (_parent, args, context) => {
  return searchProductsUtil({ args, context })
}
