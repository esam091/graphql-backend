import type { MutationResolvers } from './../../../types.generated'
import { db } from '@/db'
import { products, shops } from '@/schema'
import { eq, and } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const setProductActive: NonNullable<MutationResolvers['setProductActive']> = async (_parent, { productId, isActive }, { currentUser }) => {
  if (!currentUser) {
    throw new GraphQLError('Authentication required', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }

  const userShop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, Number(currentUser.id)))
    .get()

  if (!userShop) {
    throw new GraphQLError('User does not have a shop', {
      extensions: { code: 'SHOP_NOT_FOUND' },
    })
  }

  const updatedProduct = await db
    .update(products)
    .set({ isActive: isActive ? 1 : 0 })
    .where(
      and(eq(products.id, Number(productId)), eq(products.shopId, userShop.id))
    )
    .returning()
    .get()

  if (!updatedProduct) {
    throw new GraphQLError(
      'Product not found or does not belong to your shop',
      {
        extensions: { code: 'PRODUCT_NOT_FOUND' },
      }
    )
  }

  return {
    ...updatedProduct,
    isActive: Boolean(updatedProduct.isActive),
  }
}
