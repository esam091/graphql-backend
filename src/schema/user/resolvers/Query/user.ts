import type { QueryResolvers } from '../../../types.generated'
import { db } from '../../../../db'
import { users as users } from '../../../../schema'
import { eq } from 'drizzle-orm'

export const user: NonNullable<QueryResolvers['user']> = async (
  _parent,
  { id },
  { currentUser }
) => {
  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, Number(id)))

  return dbUser
}
