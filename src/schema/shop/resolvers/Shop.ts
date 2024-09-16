import type { ShopResolvers } from '../../types.generated'
import { searchProducts } from '@/util'
import { userLoader } from '@/schema/loader/userLoader'

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
    return userLoader.load(parent.userId)
  },

  address: async (parent, _arg, { currentUser }) => {
    if (
      currentUser?.role !== 'admin' &&
      currentUser?.id !== parent.userId.toString()
    ) {
      throw new Error('Address is only available to admins')
    }

    return parent.address
  }
}
