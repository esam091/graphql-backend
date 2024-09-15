import type { MutationResolvers } from './../../../types.generated'
import { db } from '@/db'
import { products, shops } from '@/schema'
import { eq } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const createProduct: NonNullable<
  MutationResolvers['createProduct']
> = async (_parent, { name, description, price, stock }, { currentUser }) => {
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

  if (stock > 100) {
    throw new GraphQLError('Stock cannot exceed 100', {
      extensions: { code: 'STOCK_LIMIT_EXCEEDED' },
    })
  }

  const newProduct = await db
    .insert(products)
    .values({
      name,
      description,
      price,
      stock,
      isActive: 1,
      shopId: userShop.id,
    })
    .returning()
    .get()

  if (!newProduct) {
    throw new GraphQLError('Failed to create product', {
      extensions: { code: 'PRODUCT_CREATION_FAILED' },
    })
  }

  return {
    ...newProduct,
    isActive: Boolean(newProduct.isActive),
  }
}
