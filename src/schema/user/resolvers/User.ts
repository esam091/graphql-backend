import { db } from '@/db'
import type { UserResolvers } from '../../types.generated'
import { shops } from '@/schema'
import { eq } from 'drizzle-orm'

export const User: UserResolvers = {
  isAdmin: async ({ role }) => {
    return role === 'admin'
  },
  shop: async (user) => { 
    return await db.select().from(shops).where(eq(shops.userId, user.id)).get()
  },
  dateOfBirth: async ({ dateOfBirth, id }, _, { currentUser }) => {
    if (currentUser?.role !== 'admin' && currentUser?.id !== id.toString()) {
      throw new Error(
        'Date of birth is only available to admins or the user themselves'
      )
    }

    return new Date(dateOfBirth)
  },
}
