import type { MutationResolvers } from './../../../types.generated'
import { db } from '@/db'
import { products, shops } from '@/schema'
import { eq, and } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const deleteProduct: NonNullable<MutationResolvers['deleteProduct']> = async (_parent, { productId }, { currentUser }) => {
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

  const deletedProduct = await db
    .delete(products)
    .where(
      and(eq(products.id, Number(productId)), eq(products.shopId, userShop.id))
    )
    .returning()
    .get()

  if (!deletedProduct) {
    throw new GraphQLError('Failed to delete product', {
      extensions: { code: 'PRODUCT_DELETION_FAILED' },
    })
  }

  return {
    ...deletedProduct,
    isActive: Boolean(deletedProduct.isActive),
  }
}
