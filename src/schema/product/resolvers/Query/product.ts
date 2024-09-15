import type { QueryResolvers } from './../../../types.generated'
import { db } from '@/db'
import { products, shops } from '@/schema'
import { eq } from 'drizzle-orm'

export const product: NonNullable<QueryResolvers['product']> = async (
  _parent,
  { id },
  { currentUser }
) => {
  const dbProduct = await db
    .select()
    .from(products)
    .where(eq(products.id, Number(id)))
    .get()

  if (!dbProduct) {
    return null
  }

  if (!dbProduct.isActive) {
    // Check if the current user is the owner of the product
    if (!currentUser) {
      return null
    }

    if (currentUser.role === 'admin') {
      return {
        ...dbProduct,
        isActive: Boolean(dbProduct.isActive),
      }
    }

    const userShop = await db
      .select()
      .from(shops)
      .where(eq(shops.userId, Number(currentUser.id)))
      .get()

    if (!userShop || userShop.id !== dbProduct.shopId) {
      return null
    }
  }

  return {
    ...dbProduct,
    isActive: Boolean(dbProduct.isActive),
  }
}
