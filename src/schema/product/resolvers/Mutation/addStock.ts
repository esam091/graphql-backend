import type { MutationResolvers } from './../../../types.generated'
import { db } from '@/db'
import { products, shops } from '@/schema'
import { eq, and } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const addStock: NonNullable<MutationResolvers['addStock']> = async (
  _parent,
  { productId, stock },
  { currentUser }
) => {
  if (stock <= 0) {
    throw new GraphQLError('Stock must be a positive number', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }
  
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

  if (stock <= 0) {
    throw new GraphQLError('Stock must be a positive number', {
      extensions: { code: 'INVALID_STOCK' },
    })
  }

  const product = await db
    .select()
    .from(products)
    .where(
      and(eq(products.id, Number(productId)), eq(products.shopId, userShop.id))
    )
    .get()

  if (!product) {
    throw new GraphQLError(
      'Product not found or does not belong to your shop',
      {
        extensions: { code: 'PRODUCT_NOT_FOUND' },
      }
    )
  }

  const newStock = product.stock + stock

  if (newStock > 100) {
    throw new GraphQLError('Total stock cannot exceed 100', {
      extensions: { code: 'STOCK_LIMIT_EXCEEDED' },
    })
  }

  const updatedProduct = await db
    .update(products)
    .set({ stock: newStock })
    .where(eq(products.id, Number(productId)))
    .returning()
    .get()

  if (!updatedProduct) {
    throw new GraphQLError('Failed to update product stock', {
      extensions: { code: 'STOCK_UPDATE_FAILED' },
    })
  }

  return {
    ...updatedProduct,
    isActive: Boolean(updatedProduct.isActive),
  }
}
