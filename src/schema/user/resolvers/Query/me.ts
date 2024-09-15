import { GraphQLError } from 'graphql'
import type { QueryResolvers } from './../../../types.generated'
import { db } from '../../../../db'
import { users } from '../../../../schema'
import { sql, eq } from 'drizzle-orm'

export const me: NonNullable<QueryResolvers['me']> = async (
  _parent,
  _arg,
  { currentUser }
) => {
  if (!currentUser) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'NOT_AUTHENTICATED' },
    })
  }

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(sql`cast(${users.id} as text)`, currentUser.id))

  if (!dbUser) {
    throw new GraphQLError('User not found', {
      extensions: { code: 'USER_NOT_FOUND' },
    })
  }

  return dbUser
}
