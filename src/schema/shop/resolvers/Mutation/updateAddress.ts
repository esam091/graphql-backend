import { db } from '@/db'
import type { MutationResolvers } from './../../../types.generated'
import { shops } from '@/schema'
import { eq } from 'drizzle-orm'
import { GraphQLError } from 'graphql'

export const updateAddress: NonNullable<
  MutationResolvers['updateAddress']
> = async (_parent, { address }, { currentUser }) => {
  if (!currentUser) {
    throw new GraphQLError('User not logged in', {
      extensions: { code: 'USER_NOT_LOGGED_IN' },
    })
  }

  const [result] = await db
    .update(shops)
    .set({ address })
    .where(eq(shops.userId, Number(currentUser.id)))
    .returning()

  if (!result) {
    throw new GraphQLError('User does not have a shop', {
      extensions: { code: 'SHOP_NOT_FOUND' },
    })
  }

  return result
}
