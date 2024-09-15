import { db } from '@/db'
import type { ShopResolvers } from '../../types.generated'
import { users } from '@/schema'
import { eq } from 'drizzle-orm'
import { searchProducts } from '@/util'

export const Shop: ShopResolvers = {
  products: async (_parent, args, context) => {
    return searchProducts({
      args: {
        ...args,
        shopId: _parent.id,
      },
      context,
    })
  },

  owner: async (parent) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, parent.userId))

    return user!
  },

  address: async (parent, _arg, { currentUser }) => {
    if (
      currentUser?.role !== 'admin' &&
      currentUser?.id !== parent.userId.toString()
    ) {
      throw new Error('Address is only available to admins')
    }

    return parent.address
  },
}
