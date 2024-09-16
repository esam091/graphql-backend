import type { MutationResolvers } from './../../../types.generated'
import { db } from '@/db'
import { products, shops } from '@/schema'
import { eq, count } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const createProduct: NonNullable<MutationResolvers['createProduct']> = async (_parent, { name, description, price, stock }, { currentUser }) => {
  if (name.length < 1 || name.length > 50) {
    throw new GraphQLError('Name must be between 1 and 50 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }

  if (description.length < 1 || description.length > 100) {
    throw new GraphQLError('Description must be between 1 and 100 characters', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }

  if (price < 1 || price > 10000) {
    throw new GraphQLError('Price must be between 1 and 10000', {
      extensions: { code: 'BAD_USER_INPUT' },
    })
  }

  if (stock < 0 || stock > 100) {
    throw new GraphQLError('Stock must be between 0 and 100', {
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

  const [{ productCount }] = await db
    .select({ productCount: count() })
    .from(products)
    .where(eq(products.shopId, userShop.id))

  if (productCount === 10) {
    throw new GraphQLError('Maximum product limit reached (10 products)', {
      extensions: { code: 'PRODUCT_LIMIT_REACHED' },
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
