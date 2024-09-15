import { shops } from '@/schema'
import type { ProductResolvers } from './../../types.generated'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
export const Product: ProductResolvers = {
  shop: async (_parent) => {
    const [shop] = await db
      .select()
      .from(shops)
      .where(eq(shops.id, _parent.shopId))

    return shop!
  },
}
