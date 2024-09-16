import type { QueryResolvers } from './../../../types.generated'
import { shopLoader } from '@/schema/loader/shopLoader'

export const shop: NonNullable<QueryResolvers['shop']> = async (
  _,
  { id },
) => {
  return shopLoader.load(Number(id))
}
