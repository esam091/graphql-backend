import { GraphQLError } from 'graphql'
import type { MutationResolvers } from '../../../types.generated'
import { db } from '@/db'
import { shops } from '@/schema'
import { eq } from 'drizzle-orm'

export const createShop: NonNullable<MutationResolvers['createShop']> = async (
  _parent,
  fields,
  { currentUser }
) => {
  if (!currentUser) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'NOT_AUTHENTICATED' },
    })
  }

  // Check if the user already has a shop
  const existingShop = await db
    .select()
    .from(shops)
    .where(eq(shops.userId, Number(currentUser.id)))
    .limit(1)
    .get()

  if (existingShop) {
    throw new GraphQLError('User already has a shop', {
      extensions: { code: 'SHOP_ALREADY_EXISTS' },
    })
  }

  const newShop = await db
    .insert(shops)
    .values({
      name: fields.name,
      address: fields.address,
      userId: Number(currentUser.id),
    })
    .returning()
    .get()

  return newShop
}
